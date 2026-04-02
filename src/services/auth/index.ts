"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";
import { setTokenInCookies } from "@/lib/tokenUtils";

// --- Types & Interfaces ---
export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
}

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  image: string | null;
  role: "STUDENT" | "TUTOR";
}

interface LoginPayload {
  email: string;
  password: string;
}

export interface DecodedUser {
  userId: string;
  name: string;
  email: string;
  role: "STUDENT" | "TUTOR" | "ADMIN";
  isDeleted?: boolean;
  emailVerified?: boolean;
  iat?: number;
  exp?: number;
}

interface LoginResponseData {
  token: string;
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: "STUDENT" | "TUTOR" | "ADMIN";
    image: string | null;
  };
}

// --- Auth Actions ---

/**
 * User Registration
 */
export const registerUser = async (userData: RegisterPayload): Promise<ApiResponse> => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    const result: ApiResponse = await res.json();
    if (result.success) revalidatePath("/login");
    return result;
  } catch (error) {
    return { success: false, message: "Registration failed" };
  }
};

/**
 * User Login
 */
export const loginUser = async (userData: LoginPayload): Promise<ApiResponse<LoginResponseData>> => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
      cache: "no-store",
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: data.error || data.message || "Invalid credentials", 
      };
    }

    const result: ApiResponse<LoginResponseData> = data;

    if (result.success && result.data) {
      const cookieStore = await cookies();
      const { accessToken, refreshToken, token } = result.data;

      // ক্লিনিং ও সেটিং কুকিজ
      const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax" as const,
        path: "/",
      };

      cookieStore.set("accessToken", accessToken, cookieOptions);
      if (refreshToken) cookieStore.set("refreshToken", refreshToken, cookieOptions);
      if (token) cookieStore.set("better-auth.session_token", token, cookieOptions);

      revalidatePath("/");
    }

    return result;
  } catch (error) {
    return { success: false, message: "Login failed" };
  }
};

/**
 * Logout
 */
export const logOut = async () => {
  const cookieStore = await cookies();
  ["accessToken", "refreshToken", "better-auth.session_token", "token"].forEach((c) =>
    cookieStore.delete(c)
  );
  revalidatePath("/");
};

/**
 * Refresh Token Logic
 */
export async function getNewTokensWithRefreshToken(refreshToken: string): Promise<boolean> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Cookie: `refreshToken=${refreshToken}`,
      },
    });

    if (!res.ok) return false;

    const { data } = await res.json();
    const { accessToken, refreshToken: newRefreshToken, token } = data;

    if (accessToken) await setTokenInCookies("accessToken", accessToken);
    if (newRefreshToken) await setTokenInCookies("refreshToken", newRefreshToken);
    if (token) await setTokenInCookies("better-auth.session_token", token);

    return true;
  } catch (error) {
    return false;
  }
}

// --- User & Role Helpers ---

/**
 * Get Decoded User from Token
 */
export const getCurrentUser = async (): Promise<DecodedUser | null> => {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token || token.split(".").length !== 3) return null;

  try {
    const decodedData = jwtDecode<DecodedUser>(token);
    const isExpired = decodedData.exp ? decodedData.exp * 1000 < Date.now() : false;
    return isExpired ? null : decodedData;
  } catch {
    return null;
  }
};

/**
 * Fetch Full User Info from API
 */
export async function getUserInfo() {
  try {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;
    const sessionToken = cookieStore.get("better-auth.session_token")?.value;

    if (!accessToken) return null;

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`, // সাধারণত Bearer Token হিসেবে পাঠানো ভালো
        Cookie: `accessToken=${accessToken}; better-auth.session_token=${sessionToken}`,
      },
    });

    const result = await res.json();
    return result.data || null;
  } catch (error) {
    return null;
  }
}

/**
 * Role Guards
 */
export const isUserRole = async (role: DecodedUser["role"]) => {
  const user = await getCurrentUser();
  return user?.role === role;
};

export const requireRole = async (role: DecodedUser["role"]) => {
  const user = await getCurrentUser();
  if (!user || user.role !== role) throw new Error("Unauthorized or Forbidden");
  return user;
};