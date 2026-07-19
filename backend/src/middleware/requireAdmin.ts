import type { Request, Response, NextFunction } from 'express'
import { pool } from '../db/pool.js'

export async function requireAdmin(req: Request, res: Response, next: NextFunction) {
  try {
    const [rows] = await pool.query('SELECT role FROM users WHERE id = ? LIMIT 1', [req.auth!.userId])
    const user = (rows as any[])[0]

    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required.' })
    }

    next()
  } catch {
    return res.status(500).json({ error: 'Could not verify admin access.' })
  }
}
