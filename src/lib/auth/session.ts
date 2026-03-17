/**
 * Session token management using jose JWT
 * This module is Edge Runtime compatible (used in Middleware)
 */

import { jwtVerify, SignJWT } from 'jose'
import { SessionPayload } from '@/lib/types/auth'

const SESSION_EXPIRATION_TIME = 24 * 60 * 60 * 1000 // 24 hours in milliseconds

/**
 * Get the secret key for JWT signing
 * @returns Uint8Array - Secret key for jose
 */
function getSecretKey(): Uint8Array {
  const secret = process.env.ADMIN_SESSION_SECRET
  if (!secret) {
    throw new Error('ADMIN_SESSION_SECRET environment variable is not set')
  }
  return new TextEncoder().encode(secret)
}

/**
 * Create a new JWT session token
 * @param username - Admin username
 * @returns Promise<string> - Signed JWT token
 */
export async function createSessionToken(username: string): Promise<string> {
  const secretKey = getSecretKey()
  const now = Math.floor(Date.now() / 1000)
  const expirationTime = now + SESSION_EXPIRATION_TIME / 1000

  const token = await new SignJWT({ username })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt(now)
    .setExpirationTime(expirationTime)
    .sign(secretKey)

  return token
}

/**
 * Verify and decode a JWT session token
 * @param token - JWT token to verify
 * @returns Promise<SessionPayload> - Decoded token payload
 * @throws Error if token is invalid or expired
 */
export async function verifySessionToken(
  token: string
): Promise<SessionPayload> {
  const secretKey = getSecretKey()

  try {
    const verified = await jwtVerify(token, secretKey)
    const payload = verified.payload as unknown as SessionPayload

    return {
      username: payload.username,
      iat: payload.iat || 0,
      exp: payload.exp || 0,
    }
  } catch (error) {
    throw new Error('Invalid or expired session token')
  }
}

/**
 * Get session expiration time in seconds
 * @returns number - Expiration time in seconds
 */
export function getSessionExpirationSeconds(): number {
  return SESSION_EXPIRATION_TIME / 1000
}
