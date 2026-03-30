"use server";

import { getCurrentUser, DecodedUser } from "@/services/auth";
import { UserRole } from "./tokenUtils";

/**
 * Middleware utilities for role-based access control
 */

// ============ ROLE CHECKING ============

/**
 * Check if user has a specific role
 */
export async function hasRole(role: UserRole): Promise<boolean> {
  try {
    const user = await getCurrentUser();
    return user?.role === role;
  } catch {
    return false;
  }
}

/**
 * Check if user has any of the specified roles
 */
export async function hasAnyRole(...roles: UserRole[]): Promise<boolean> {
  try {
    const user = await getCurrentUser();
    return user ? roles.includes(user.role) : false;
  } catch {
    return false;
  }
}

/**
 * Check if user has all of the specified roles (usually just one, but supports multiple for extensibility)
 */
export async function hasAllRoles(...roles: UserRole[]): Promise<boolean> {
  try {
    const user = await getCurrentUser();
    return user ? roles.includes(user.role) : false;
  } catch {
    return false;
  }
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  try {
    const user = await getCurrentUser();
    return user !== null;
  } catch {
    return false;
  }
}

// ============ VALIDATION & PROTECTION ============

/**
 * Validate that user has required role, throw error if not
 */
export async function validateRole(requiredRole: UserRole): Promise<DecodedUser> {
  const user = await getCurrentUser();
  
  if (!user) {
    throw new Error("Unauthorized: User not authenticated");
  }
  
  if (user.role !== requiredRole) {
    throw new Error(`Forbidden: User must have ${requiredRole} role`);
  }
  
  return user;
}

/**
 * Validate that user has one of required roles, throw error if not
 */
export async function validateAnyRole(...requiredRoles: UserRole[]): Promise<DecodedUser> {
  const user = await getCurrentUser();
  
  if (!user) {
    throw new Error("Unauthorized: User not authenticated");
  }
  
  if (!requiredRoles.includes(user.role)) {
    throw new Error(
      `Forbidden: User must have one of these roles: ${requiredRoles.join(", ")}`
    );
  }
  
  return user;
}

/**
 * Require user to be authenticated, throw error if not
 */
export async function requireAuth(): Promise<DecodedUser> {
  const user = await getCurrentUser();
  
  if (!user) {
    throw new Error("Unauthorized: User not authenticated");
  }
  
  return user;
}

// ============ ROLE-SPECIFIC VALIDATORS ============

export async function requireAdmin(): Promise<DecodedUser> {
  return validateRole("ADMIN");
}

export async function requireTutor(): Promise<DecodedUser> {
  return validateRole("TUTOR");
}

export async function requireStudent(): Promise<DecodedUser> {
  return validateRole("STUDENT");
}

export async function requireAdminOrTutor(): Promise<DecodedUser> {
  return validateAnyRole("ADMIN", "TUTOR");
}

export async function requireAdminOrStudent(): Promise<DecodedUser> {
  return validateAnyRole("ADMIN", "STUDENT");
}

export async function requireTutorOrStudent(): Promise<DecodedUser> {
  return validateAnyRole("TUTOR", "STUDENT");
}

// ============ PERMISSION-BASED ACCESS ============

/**
 * Define user permissions based on role
 */
export const rolePermissions: Record<UserRole, string[]> = {
  ADMIN: [
    "manage_users",
    "manage_tutors",
    "manage_payments",
    "manage_bookings",
    "view_analytics",
    "manage_system",
    "view_logs",
    "block_users",
    "approve_tutors",
    "refund_payments",
  ],
  TUTOR: [
    "manage_own_profile",
    "manage_availability",
    "accept_bookings",
    "complete_sessions",
    "receive_payments",
    "view_reviews",
    "view_earnings",
    "manage_subjects",
  ],
  STUDENT: [
    "book_tutors",
    "search_tutors",
    "manage_bookings",
    "make_payments",
    "leave_reviews",
    "view_history",
    "manage_favorites",
    "manage_profile",
  ],
};

/**
 * Check if user has a specific permission
 */
export async function hasPermission(permission: string): Promise<boolean> {
  try {
    const user = await getCurrentUser();
    if (!user) return false;
    
    const permissions = rolePermissions[user.role] || [];
    return permissions.includes(permission);
  } catch {
    return false;
  }
}

/**
 * Check if user has any of the specified permissions
 */
export async function hasAnyPermission(...permissions: string[]): Promise<boolean> {
  try {
    const user = await getCurrentUser();
    if (!user) return false;
    
    const userPermissions = rolePermissions[user.role] || [];
    return permissions.some(p => userPermissions.includes(p));
  } catch {
    return false;
  }
}

/**
 * Require user to have specific permission
 */
export async function requirePermission(permission: string): Promise<DecodedUser> {
  const user = await requireAuth();
  
  const userPermissions = rolePermissions[user.role] || [];
  if (!userPermissions.includes(permission)) {
    throw new Error(`Forbidden: User does not have '${permission}' permission`);
  }
  
  return user;
}

/**
 * Require user to have one of specified permissions
 */
export async function requireAnyPermission(...permissions: string[]): Promise<DecodedUser> {
  const user = await requireAuth();
  
  const userPermissions = rolePermissions[user.role] || [];
  if (!permissions.some(p => userPermissions.includes(p))) {
    throw new Error(
      `Forbidden: User does not have any of these permissions: ${permissions.join(", ")}`
    );
  }
  
  return user;
}

// ============ ROUTE PROTECTION ============

/**
 * List of protected routes and their required roles
 */
export const protectedRoutes: Record<string, UserRole[]> = {
  "/admin/dashboard": ["ADMIN"],
  "/tutor/dashboard": ["TUTOR"],
  "/dashboard": ["STUDENT"],
  "/my-profile": ["STUDENT", "TUTOR", "ADMIN"],
  "/settings": ["STUDENT", "TUTOR", "ADMIN"],
};

/**
 * Check if a route requires authentication
 */
export function isProtectedRoute(pathname: string): boolean {
  return Object.keys(protectedRoutes).some(route => pathname.startsWith(route));
}

/**
 * Get required roles for a route
 */
export function getRouteRoles(pathname: string): UserRole[] | null {
  for (const [route, roles] of Object.entries(protectedRoutes)) {
    if (pathname.startsWith(route)) {
      return roles;
    }
  }
  return null;
}

/**
 * Check if user can access a route
 */
export async function canAccessRoute(pathname: string): Promise<boolean> {
  const roles = getRouteRoles(pathname);
  
  if (!roles) return true; // Route is not protected
  
  const user = await getCurrentUser();
  if (!user) return false;
  
  return roles.includes(user.role);
}

// ============ USER ID VERIFICATION ============

/**
 * Verify that the authenticated user matches the requested user ID
 * (prevents users from accessing/modifying other users' data)
 */
export async function verifyUserOwnership(requestedUserId: string): Promise<boolean> {
  const user = await getCurrentUser();
  
  if (!user) return false;
  
  // Admins can access any user's data
  if (user.role === "ADMIN") return true;
  
  // Other users can only access their own data
  return user.userId === requestedUserId;
}

/**
 * Require that user owns the resource
 */
export async function requireOwnership(resourceUserId: string): Promise<DecodedUser> {
  const user = await requireAuth();
  
  // Admins can access any resource
  if (user.role === "ADMIN") return user;
  
  // Other users can only access their own resources
  if (user.userId !== resourceUserId) {
    throw new Error("Forbidden: You do not have access to this resource");
  }
  
  return user;
}

// ============ SESSION EXPIRY CHECK ============

/**
 * Get remaining session time in seconds
 */
export async function getRemainingSessionTime(): Promise<number> {
  const user = await getCurrentUser();
  
  if (!user || !user.exp) return 0;
  
  const remainingSeconds = user.exp - Math.floor(Date.now() / 1000);
  return remainingSeconds > 0 ? remainingSeconds : 0;
}

/**
 * Check if session is expiring soon
 */
export async function isSessionExpiringSoon(thresholdSeconds = 300): Promise<boolean> {
  const remaining = await getRemainingSessionTime();
  return remaining > 0 && remaining <= thresholdSeconds;
}

/**
 * Check if session has expired
 */
export async function isSessionExpired(): Promise<boolean> {
  const remaining = await getRemainingSessionTime();
  return remaining === 0;
}
