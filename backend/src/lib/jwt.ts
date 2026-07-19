import jwt from 'jsonwebtoken'
import { config } from '../config.js'

export interface AuthTokenPayload {
  userId: number
  email: string
  tokenId: string
  role?: 'customer' | 'admin'
}

export function signAuthToken(payload: AuthTokenPayload): string {
  return jwt.sign(payload, config.jwtSecret, { expiresIn: config.jwtExpiresIn as jwt.SignOptions['expiresIn'] })
}

export function verifyAuthToken(token: string): AuthTokenPayload {
  return jwt.verify(token, config.jwtSecret) as AuthTokenPayload
}
