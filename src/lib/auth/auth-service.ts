/**
 * Authentication service layer
 * High-level authentication operations
 */

import { hashPassword, verifyPassword } from './password'
import {
  createSessionToken,
  verifySessionToken,
  getSessionExpirationSeconds,
} from './session'
import { env } from '@/lib/env'
import { SessionPayload } from '@/lib/types/auth'

// In-memory login attempt tracking (reset on server restart)
const loginAttempts: Map<
  string,
  { count: number; lastAttempt: number; blockedUntil: number }
> = new Map()

const MAX_LOGIN_ATTEMPTS = 5
const ATTEMPT_RESET_TIMEOUT = 15 * 60 * 1000 // 15 minutes
const LOCKOUT_DURATION = 5 * 60 * 1000 // 5 minutes

/**
 * Check if an IP/identifier is blocked due to too many failed attempts
 * @param identifier - IP or identifier to check
 * @returns boolean - True if blocked
 */
function isLoginBlocked(identifier: string): boolean {
  const attempts = loginAttempts.get(identifier)
  if (!attempts) return false

  const now = Date.now()

  // Clear old attempts if timeout has passed
  if (now - attempts.lastAttempt > ATTEMPT_RESET_TIMEOUT) {
    loginAttempts.delete(identifier)
    return false
  }

  // Check if still in lockout period
  if (now < attempts.blockedUntil) {
    return true
  }

  // Lockout expired, reset attempts
  loginAttempts.delete(identifier)
  return false
}

/**
 * Record a failed login attempt
 * @param identifier - IP or identifier
 */
function recordFailedAttempt(identifier: string): void {
  const now = Date.now()
  const attempts = loginAttempts.get(identifier) || {
    count: 0,
    lastAttempt: now,
    blockedUntil: 0,
  }

  attempts.count++
  attempts.lastAttempt = now

  if (attempts.count >= MAX_LOGIN_ATTEMPTS) {
    attempts.blockedUntil = now + LOCKOUT_DURATION
  }

  loginAttempts.set(identifier, attempts)
}

/**
 * Clear login attempts for an identifier
 * @param identifier - IP or identifier
 */
function clearLoginAttempts(identifier: string): void {
  loginAttempts.delete(identifier)
}

/**
 * Authenticate admin user
 * @param username - Admin username
 * @param password - Admin password (plaintext)
 * @param identifier - IP or client identifier for rate limiting
 * @returns Promise<{success: boolean, token?: string, error?: string}>
 */
export async function login(
  username: string,
  password: string,
  identifier: string = 'default'
): Promise<{ success: boolean; token?: string; error?: string }> {
  // Check if login is blocked
  if (isLoginBlocked(identifier)) {
    return {
      success: false,
      error: '너무 많은 로그인 시도. 5분 후에 다시 시도해주세요.',
    }
  }

  // Verify username
  if (username !== env.ADMIN_USERNAME) {
    recordFailedAttempt(identifier)
    return {
      success: false,
      error: '사용자명 또는 비밀번호가 잘못되었습니다.',
    }
  }

  // Verify password
  const passwordHash = env.ADMIN_PASSWORD_HASH
  if (!passwordHash) {
    return {
      success: false,
      error: 'Admin password not configured',
    }
  }

  const passwordMatch = await verifyPassword(password, passwordHash)
  if (!passwordMatch) {
    recordFailedAttempt(identifier)
    return {
      success: false,
      error: '사용자명 또는 비밀번호가 잘못되었습니다.',
    }
  }

  // Clear previous attempts on successful login
  clearLoginAttempts(identifier)

  // Create session token
  const token = await createSessionToken(username)

  return {
    success: true,
    token,
  }
}

/**
 * Verify an existing session token
 * @param token - JWT token to verify
 * @returns Promise<{valid: boolean, username?: string, expiresAt?: number, error?: string}>
 */
export async function verifySession(
  token: string
): Promise<{
  valid: boolean
  username?: string
  expiresAt?: number
  error?: string
}> {
  try {
    const payload = await verifySessionToken(token)
    return {
      valid: true,
      username: payload.username,
      expiresAt: payload.exp * 1000, // Convert to milliseconds
    }
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : 'Invalid session',
    }
  }
}

/**
 * Get current authenticated user from session token
 * @param token - JWT token
 * @returns Promise<{username: string} | null> - User info or null if invalid
 */
export async function getCurrentUser(
  token: string
): Promise<{ username: string } | null> {
  try {
    const payload = await verifySessionToken(token)
    return { username: payload.username }
  } catch {
    return null
  }
}

/**
 * Get session configuration (for cookie settings)
 * @returns Object with cookie configuration
 */
export function getSessionConfig() {
  return {
    maxAge: getSessionExpirationSeconds(),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/admin',
  }
}
