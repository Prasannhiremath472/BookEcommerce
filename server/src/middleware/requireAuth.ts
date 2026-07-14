import type { Request, Response, NextFunction } from 'express'
import { verifyAuthToken, type AuthTokenPayload } from '../lib/jwt.js'
import { pool } from '../db/pool.js'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      auth?: AuthTokenPayload
    }
  }
}

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization
  const token = header?.startsWith('Bearer ') ? header.slice(7) : undefined

  if (!token) {
    return res.status(401).json({ error: 'Missing authorization token.' })
  }

  try {
    const payload = verifyAuthToken(token)

    const [rows] = await pool.query(
      'SELECT revoked_at, expires_at FROM sessions WHERE token_id = ? LIMIT 1',
      [payload.tokenId],
    )
    const session = (rows as any[])[0]

    if (!session || session.revoked_at || new Date(session.expires_at) < new Date()) {
      return res.status(401).json({ error: 'Session expired or revoked.' })
    }

    req.auth = payload
    next()
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token.' })
  }
}
