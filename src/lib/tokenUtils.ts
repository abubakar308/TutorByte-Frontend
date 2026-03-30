"use server"

import jwt, { JwtPayload } from "jsonwebtoken";
import { setCookie } from "./cookieUtils";

export type UserRole = "ADMIN" | "STUDENT" | "TUTOR";

export interface TokenPayload extends JwtPayload {
    userId: string;
    name: string;
    email: string;
    role: UserRole;
    isDeleted?: boolean;
    emailVerified?: boolean;
    iat?: number;
    exp?: number;
}

const getTokenSecondsRemaining = (token: string): number => {
    if (!token) return 0;
    try {
        const tokenPayload = jwt.decode(token) as JwtPayload;

        if (tokenPayload && !tokenPayload.exp) {
            return 0;
        }

        const remainingSeconds = tokenPayload.exp as number - Math.floor(Date.now() / 1000)

        return remainingSeconds > 0 ? remainingSeconds : 0;

    } catch (error) {
        console.error("Error decoding token:", error);
        return 0;
    }
}

export const setTokenInCookies = async (
    name: string,
    token: string,
    fallbackMaxAgeInSeconds = 60 * 60 * 24 // 1 day
) => {
    let maxAgeInSeconds;

    if (name !== "better-auth.session_token") {
        maxAgeInSeconds = getTokenSecondsRemaining(token);
    }

    await setCookie(name, token, maxAgeInSeconds || fallbackMaxAgeInSeconds);
}

export async function decodeToken(token: string): Promise<TokenPayload | null> {
    try {
        const decoded = jwt.decode(token) as TokenPayload;
        return decoded || null;
    } catch (error) {
        console.error("Error decoding token:", error);
        return null;
    }
}

export async function isTokenExpiringSoon(token: string, thresholdInSeconds = 300): Promise<boolean> {
    const remainingSeconds = getTokenSecondsRemaining(token);
    return remainingSeconds > 0 && remainingSeconds <= thresholdInSeconds;
}

export async function isTokenExpired(token: string): Promise<boolean> {
    const remainingSeconds = getTokenSecondsRemaining(token);
    return remainingSeconds === 0;
}

export async function getTokenExpiration(token: string): Promise<Date | null> {
    try {
        const decoded = jwt.decode(token) as JwtPayload;
        if (decoded?.exp) {
            return new Date(decoded.exp * 1000);
        }
        return null;
    } catch (error) {
        console.error("Error getting token expiration:", error);
        return null;
    }
}

export async function getTokenSecondsFromNow(token: string): Promise<number> {
    return getTokenSecondsRemaining(token);
}