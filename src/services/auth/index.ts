"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { jwtDecode } from "jwt-decode";

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

      cookieStore.set("token", result.data.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      });

      cookieStore.set("refreshToken", result.data.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
      });

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

export const getCurrentUser = async (): Promise<DecodedUser | null> => {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

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


export const logOut = async () => {
  const storeCookies = await cookies();
  storeCookies.delete("token");
};