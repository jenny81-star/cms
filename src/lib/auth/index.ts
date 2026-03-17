/**
 * Authentication module exports
 */

// Session token management (Edge Runtime compatible)
export {
  createSessionToken,
  verifySessionToken,
  getSessionExpirationSeconds,
} from './session'

// Authentication service (Node.js only - bcrypt)
export {
  login,
  verifySession,
  getCurrentUser,
  getSessionConfig,
} from './auth-service'

// Password utilities (Node.js only)
export { hashPassword, verifyPassword } from './password'
