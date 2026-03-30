"use server";

import { cookies } from "next/headers";
import { ApiResponse } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface RequestOptions extends RequestInit {
  auth?: boolean;
}

function buildCookieHeader(cookieValues: Record<string, string | undefined>) {
  return Object.entries(cookieValues)
    .filter(([, value]) => Boolean(value))
    .map(([key, value]) => `${key}=${value}`)
    .join("; ");
}

// export function createQuery(
//   params: Record<string, string | number | boolean | undefined | null>
// ) {
//   const searchParams = new URLSearchParams();

//   Object.entries(params).forEach(([key, value]) => {
//     if (value !== undefined && value !== null && value !== "") {
//       searchParams.append(key, String(value));
//     }
//   });

//   const queryString = searchParams.toString();
//   return queryString ? `?${queryString}` : "";
// }

export async function getAuthHeader() {
  const cookieStore = await cookies();

  const accessToken = cookieStore.get("accessToken")?.value;
  const sessionToken = cookieStore.get("better-auth.session_token")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
    console.log(
      `[Auth] Access token found and added to Authorization header (length: ${accessToken.length})`
    );
  } else {
    console.warn("[Auth] No accessToken found in cookies.");
  }

  const cookieHeader = buildCookieHeader({
    accessToken,
    "better-auth.session_token": sessionToken,
    refreshToken,
  });

  if (cookieHeader) {
    headers.Cookie = cookieHeader;
    console.log("[Auth] Cookies added to Cookie header for server-side request");
  } else {
    console.warn("[Auth] No auth cookies found to forward.");
  }

  return headers;
}

export async function apiRequest<T = unknown>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  try {
    if (!API_URL) {
      return {
        success: false,
        message: "API base URL is not configured",
      };
    }

    const { auth = true, headers: customHeaders, ...restOptions } = options;

    const baseHeaders = auth
      ? await getAuthHeader()
      : { "Content-Type": "application/json" };

    const res = await fetch(`${API_URL}${endpoint}`, {
      ...restOptions,
      credentials: "include",
      headers: {
        ...baseHeaders,
        ...(customHeaders || {}),
      },
      cache: "no-store",
    });

    const contentType = res.headers.get("content-type") || "";

    if (!res.ok) {
      console.error(`[API] Request to ${endpoint} failed with status ${res.status}`);

      if (!contentType.includes("application/json")) {
        const text = await res.text();
        console.error(
          `[API] Expected JSON but got ${contentType}. Response (first 200 chars): ${text.substring(
            0,
            200
          )}`
        );
      }

      if (res.status === 401 || res.status === 403) {
        return {
          success: false,
          message: "Authentication failed. Please log in again.",
        };
      }

      return {
        success: false,
        message: `Server error: ${res.status}`,
      };
    }

    if (!contentType.includes("application/json")) {
      return {
        success: false,
        message: "Invalid response format from server",
      };
    }

    const result = await res.json();

    return {
      success: result?.success ?? true,
      message: result?.message,
      data: result?.data ?? result,
    };
  } catch (error) {
    console.error(`[API] Request failed for ${endpoint}:`, error);
    return {
      success: false,
      message: "Something went wrong while fetching data",
    };
  }
}

export async function apiGet<T = unknown>(endpoint: string, auth = true) {
  return apiRequest<T>(endpoint, {
    method: "GET",
    auth,
  });
}

export async function apiPost<T = unknown, B = unknown>(
  endpoint: string,
  body: B,
  auth = true
) {
  return apiRequest<T>(endpoint, {
    method: "POST",
    auth,
    body: JSON.stringify(body),
  });
}

export async function apiPatch<T = unknown, B = unknown>(
  endpoint: string,
  body: B,
  auth = true
) {
  return apiRequest<T>(endpoint, {
    method: "PATCH",
    auth,
    body: JSON.stringify(body),
  });
}

export async function apiPut<T = unknown, B = unknown>(
  endpoint: string,
  body: B,
  auth = true
) {
  return apiRequest<T>(endpoint, {
    method: "PUT",
    auth,
    body: JSON.stringify(body),
  });
}

export async function apiDelete<T = unknown>(endpoint: string, auth = true) {
  return apiRequest<T>(endpoint, {
    method: "DELETE",
    auth,
  });
}