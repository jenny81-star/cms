/**
 * Authentication related types and interfaces
 */

export interface AdminCredentials {
  username: string
  password: string
}

export interface SessionPayload {
  username: string
  iat: number
  exp: number
}

export interface AuthResult {
  success: boolean
  message?: string
  error?: string
}

export interface SessionResponse {
  username: string
  expiresAt: number
}
