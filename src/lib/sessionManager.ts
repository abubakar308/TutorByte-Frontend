"use server";

import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";
import { isTokenExpired, isTokenExpiringSoon, decodeToken } from "./tokenUtils";
import { getNewTokensWithRefreshToken } from "@/services/auth";

/**
 * Session management utilities for handling token refresh and validation
 */

export interface SessionInfo {
  isValid: boolean;
  isExpired: boolean;
  isExpiringSoon: boolean;
  expiresAt?: Date;
  remainingSeconds?: number;
  userId?: string;
  userRole?: string;
}

/**
 * Get current session information
 */
export async function getSessionInfo(): Promise<SessionInfo> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return {
      isValid: false,
      isExpired: true,
      isExpiringSoon: false,
    };
  }

  try {
    const expired = await isTokenExpired(token);
    const expiringSoon = await isTokenExpiringSoon(token);
    const decoded = decodeToken(token);

    return {
      isValid: !expired,
      isExpired: expired,
      isExpiringSoon: expiringSoon && !expired,
      expiresAt: decoded?.exp ? new Date(decoded.exp * 1000) : undefined,
      remainingSeconds: decoded?.exp
        ? decoded.exp - Math.floor(Date.now() / 1000)
        : 0,
      userId: decoded?.userId,
      userRole: decoded?.role,
    };
  } catch (error) {
    console.error("Error getting session info:", error);
    return {
      isValid: false,
      isExpired: true,
      isExpiringSoon: false,
    };
  }
}

/**
 * Refresh token if it's expiring soon
 * Returns true if token was refreshed, false otherwise
 */
export async function refreshSessionIfNeeded(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (!token || !refreshToken) {
    return false;
  }

  try {
    const expiringSoon = await isTokenExpiringSoon(token, 300); // 5 minutes threshold

    if (expiringSoon) {
      const success = await getNewTokensWithRefreshToken(refreshToken);
      return success;
    }

    return false;
  } catch (error) {
    console.error("Error refreshing session:", error);
    return false;
  }
}

/**
 * Clear session (logout)
 */
export async function clearSession(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete("token");
  cookieStore.delete("refreshToken");
  cookieStore.delete("better-auth.session_token");
  cookieStore.delete("sessionExpiry");
}

/**
 * Validate session and refresh if needed
 */
export async function validateAndRefreshSession(): Promise<boolean> {
  const sessionInfo = await getSessionInfo();

  if (sessionInfo.isExpired) {
    await clearSession();
    return false;
  }

  if (sessionInfo.isExpiringSoon) {
    const refreshed = await refreshSessionIfNeeded();
    if (!refreshed) {
      await clearSession();
      return false;
    }
  }

  return sessionInfo.isValid;
}

/**
 * Set session expiry time
 */
export async function setSessionExpiry(expiryDate: Date): Promise<void> {
  const cookieStore = await cookies();
  const expiryTimestamp = expiryDate.getTime().toString();

  cookieStore.set("sessionExpiry", expiryTimestamp, {
    httpOnly: false, // Allow client-side access for countdown timer
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
}

/**
 * Get session expiry time
 */
export async function getSessionExpiry(): Promise<Date | null> {
  const cookieStore = await cookies();
  const expiry = cookieStore.get("sessionExpiry")?.value;

  if (!expiry) return null;

  try {
    const expiryTime = parseInt(expiry, 10);
    return new Date(expiryTime);
  } catch {
    return null;
  }
}

/**
 * Check if current session matches a specific user
 */
export async function isSessionForUser(userId: string): Promise<boolean> {
  const sessionInfo = await getSessionInfo();
  return sessionInfo.userId === userId && sessionInfo.isValid;
}

/**
 * Get all active sessions for a user (server-side tracking)
 * This is a placeholder - implement with your backend
 */
export async function getActiveSessions(): Promise<any[]> {
  // This would typically call an API endpoint to get active sessions
  // from the backend
  return [];
}

/**
 * Logout all sessions for a user
 * This is a placeholder - implement with your backend
 */
export async function logoutAllSessions(): Promise<boolean> {
  try {
    // Call backend endpoint to invalidate all sessions
    // Then clear local session
    await clearSession();
    return true;
  } catch (error) {
    console.error("Error logging out all sessions:", error);
    return false;
  }
}

/**
 * Session timeout handler for client-side tracking
 */
export class SessionTimeout {
  private timeoutId: NodeJS.Timeout | null = null;
  private warningId: NodeJS.Timeout | null = null;
  private readonly sessionDuration = 24 * 60 * 60 * 1000; // 24 hours
  private readonly warningThreshold = 5 * 60 * 1000; // 5 minutes before expiry

  /**
   * Start session timeout tracking
   */
  start(onWarning?: () => void, onExpiry?: () => void): void {
    const warningTime = this.sessionDuration - this.warningThreshold;

    // Set warning timeout
    this.warningId = setTimeout(() => {
      if (onWarning) onWarning();
    }, warningTime);

    // Set expiry timeout
    this.timeoutId = setTimeout(() => {
      if (onExpiry) onExpiry();
    }, this.sessionDuration);
  }

  /**
   * Reset session timeout (called on user activity)
   */
  reset(onWarning?: () => void, onExpiry?: () => void): void {
    this.clear();
    this.start(onWarning, onExpiry);
  }

  /**
   * Clear timeout
   */
  clear(): void {
    if (this.timeoutId) clearTimeout(this.timeoutId);
    if (this.warningId) clearTimeout(this.warningId);
  }
}

/**
 * Multi-tab session synchronization handler
 * Keeps tabs in sync when one tab logs out
 */
export class SessionSyncHandler {
  private readonly storageKey = "tutorbyte-session-sync";

  /**
   * Broadcast session change to other tabs
   */
  broadcastSessionChange(type: "login" | "logout"): void {
    if (typeof window === "undefined") return;

    const event = new StorageEvent("storage", {
      key: this.storageKey,
      newValue: JSON.stringify({
        type,
        timestamp: Date.now(),
      }),
    });

    window.dispatchEvent(event);
  }

  /**
   * Listen for session changes from other tabs
   */
  onSessionChange(
    callback: (type: "login" | "logout") => void
  ): () => void {
    if (typeof window === "undefined") return () => {};

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === this.storageKey && event.newValue) {
        try {
          const data = JSON.parse(event.newValue);
          callback(data.type);
        } catch {
          console.error("Error parsing session sync event");
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }
}

/**
 * Session activity tracker
 * Tracks user activity for session timeout
 */
export class SessionActivityTracker {
  private lastActivityTime = Date.now();
  private inactivityTimeout = 30 * 60 * 1000; // 30 minutes
  private timeoutId: NodeJS.Timeout | null = null;

  constructor(private onInactivity?: () => void) {}

  /**
   * Initialize activity tracking
   */
  init(): void {
    if (typeof window === "undefined") return;

    const events = [
      "mousedown",
      "keydown",
      "scroll",
      "touchstart",
      "click",
    ];

    events.forEach((event) => {
      window.addEventListener(event, () => this.recordActivity());
    });

    this.startInactivityCheck();
  }

  /**
   * Record user activity
   */
  private recordActivity(): void {
    this.lastActivityTime = Date.now();

    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    this.startInactivityCheck();
  }

  /**
   * Check for inactivity
   */
  private startInactivityCheck(): void {
    this.timeoutId = setTimeout(() => {
      const timeSinceLastActivity = Date.now() - this.lastActivityTime;

      if (timeSinceLastActivity >= this.inactivityTimeout) {
        if (this.onInactivity) {
          this.onInactivity();
        }
      }
    }, this.inactivityTimeout);
  }

  /**
   * Stop activity tracking
   */
  destroy(): void {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    if (typeof window !== "undefined") {
      const events = [
        "mousedown",
        "keydown",
        "scroll",
        "touchstart",
        "click",
      ];

      events.forEach((event) => {
        window.removeEventListener(event, () => this.recordActivity());
      });
    }
  }
}
