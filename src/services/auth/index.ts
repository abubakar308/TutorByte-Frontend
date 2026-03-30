"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";
import { setTokenInCookies } from "@/lib/tokenUtils";

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: "STUDENT";
}

interface LoginPayload {
  email: string;
  password: string;
}



export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
}

export const registerUser = async (
  userData: RegisterPayload
): Promise<ApiResponse> => {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/register`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      }
    );

    const result: ApiResponse = await res.json();

    if (result.success) {
      // only revalidate public pages
      revalidatePath("/login");
    }

    return result;
  } catch {
    return {
      success: false,
      message: "Registration failed",
    };
  }
};


interface LoginPayload {
  email: string;
  password: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
}

interface LoginResponseData {
  token: string;
  accessToken: string;
  refreshToken: string;
  redirect: boolean;
  user: {
    id: string;
    name: string;
    email: string;
    role: "STUDENT" | "TUTOR" | "ADMIN";
    emailVerified: boolean;
    image: string | null;
    createdAt: string;
    updatedAt: string;
    status: string;
    needPasswordChange: boolean;
    isDeleted: boolean;
    deletedAt: string | null;
  };
}

export const loginUser = async (
  userData: LoginPayload
): Promise<ApiResponse<LoginResponseData>> => {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
      cache: "no-store",
    });

    const result: ApiResponse<LoginResponseData> = await res.json();

    if (result.success && result.data?.accessToken) {
      const cookieStore = await cookies();

       cookieStore.delete("token");
      cookieStore.delete("accessToken");
      cookieStore.delete("refreshToken");
      cookieStore.delete("better-auth.session_token");

      cookieStore.set("accessToken", result.data.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      });

      if (result.data?.refreshToken) {
        cookieStore.set("refreshToken", result.data.refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
        });
      }

      if (result.data?.token) {
        cookieStore.set("better-auth.session_token", result.data.token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
        });
      }

      revalidatePath("/");
    }

    return result;
  } catch {
    return {
      success: false,
      message: "Login failed",
    };
  }
};

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


export async function getNewTokensWithRefreshToken(refreshToken  : string) : Promise<boolean> {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`, {
            method: "POST",
            headers:{
                "Content-Type": "application/json",
                Cookie : `refreshToken=${refreshToken}`
            }
        });

        if(!res.ok){
            return false;
        }

        const {data} = await res.json();

        const { accessToken, refreshToken: newRefreshToken, token } = data;

        if(accessToken){
            await setTokenInCookies("accessToken", accessToken);
        }

        if(newRefreshToken){
            await setTokenInCookies("refreshToken", newRefreshToken);
        }

        if(token){
            await setTokenInCookies("better-auth.session_token", token, 24 * 60 * 60); // 1 day in seconds
        }

        return true;
    } catch (error) {
        console.error("Error refreshing token:", error);
        return false;
    }
}

export async function getUserInfo() {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get("accessToken")?.value;
        const sessionToken = cookieStore.get("better-auth.session_token")?.value

        if (!accessToken) {
            return null;
        }

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Cookie: `accessToken=${accessToken}; better-auth.session_token=${sessionToken}`
            }
        });

        if (!res.ok) {
            console.error("Failed to fetch user info:", res.status, res.statusText);
            return null;
        }

        const { data } = await res.json();

        return data;
    } catch (error) {
        console.error("Error fetching user info:", error);
        return null;
    }
}

export const getCurrentUser = async (): Promise<DecodedUser | null> => {
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  if (!token || typeof token !== "string") {
    return null;
  }

  if (token.split(".").length !== 3) {
    console.error("Invalid token format");
    return null;
  }

  try {
    const decodedData = jwtDecode<DecodedUser>(token);

    if (decodedData.exp && decodedData.exp * 1000 < Date.now()) {
      console.error("Token expired");
      return null;
    }

    return decodedData;
  } catch (error) {
    console.error("Token decoding failed:", error);
    return null;
  }
};

export const isUserRole = async (requiredRole: "ADMIN" | "STUDENT" | "TUTOR") => {
  const user = await getCurrentUser();
  return user?.role === requiredRole;
};

export const isUserRoleOneOf = async (requiredRoles: ("ADMIN" | "STUDENT" | "TUTOR")[]) => {
  const user = await getCurrentUser();
  return user && requiredRoles.includes(user.role);
};

export const requireAuth = async (): Promise<DecodedUser> => {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Unauthorized: User not authenticated");
  }
  return user;
};

export const requireRole = async (role: "ADMIN" | "STUDENT" | "TUTOR") => {
  const user = await requireAuth();
  if (user.role !== role) {
    throw new Error(`Forbidden: User must have ${role} role`);
  }
  return user;
};

export const requireRoleOneOf = async (roles: ("ADMIN" | "STUDENT" | "TUTOR")[]) => {
  const user = await requireAuth();
  if (!roles.includes(user.role)) {
    throw new Error(`Forbidden: User must have one of these roles: ${roles.join(", ")}`);
  }
  return user;
};

export const validateToken = async (token: string): Promise<boolean> => {
  try {
    const decodedData = jwtDecode<DecodedUser>(token);
    if (decodedData.exp && decodedData.exp * 1000 < Date.now()) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
};


export const logOut = async () => {
  const cookieStore = await cookies();
  cookieStore.delete("token");
cookieStore.delete("accessToken");
cookieStore.delete("refreshToken");
cookieStore.delete("better-auth.session_token");
};