import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"
import type { User } from "@/types/user"

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "fallback-secret-change-in-production")
const COOKIE_NAME = "auth_token"

export interface JWTPayload {
  sub: string
  email: string
  name: string
  isAdmin: boolean
}

export async function signToken(user: Pick<User, "_id" | "email" | "name" | "isAdmin">): Promise<string> {
  return new SignJWT({
    sub: user._id.toString(),
    email: user.email,
    name: user.name,
    isAdmin: user.isAdmin,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(JWT_SECRET)
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload as unknown as JWTPayload
  } catch {
    return null
  }
}

export function getAuthCookieOptions() {
  return {
    name: COOKIE_NAME,
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 días
  }
}

export async function getSession(): Promise<JWTPayload | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value

  if (!token) return null

  return verifyToken(token)
}

export function getCookieName() {
  return COOKIE_NAME
}
