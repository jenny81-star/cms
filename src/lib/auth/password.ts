/**
 * Password hashing and verification utilities (Node.js only)
 * Note: This module uses bcrypt which is Node.js only and cannot be used in Edge Runtime
 */

import bcryptjs from 'bcryptjs'

const SALT_ROUNDS = 10

/**
 * Hash a plaintext password using bcrypt
 * @param password - Plaintext password to hash
 * @returns Promise<string> - Hashed password
 */
export async function hashPassword(password: string): Promise<string> {
  return bcryptjs.hash(password, SALT_ROUNDS)
}

/**
 * Verify a plaintext password against a bcrypt hash
 * @param password - Plaintext password to verify
 * @param hash - Bcrypt hash to compare against
 * @returns Promise<boolean> - True if password matches hash
 */
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcryptjs.compare(password, hash)
}
