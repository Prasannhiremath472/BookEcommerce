import { Router } from 'express'
import crypto from 'crypto'
import bcrypt from 'bcryptjs'
import { z } from 'zod'
import { pool } from '../db/pool.js'
import { signAuthToken } from '../lib/jwt.js'
import { requireAuth } from '../middleware/requireAuth.js'
import { asyncHandler } from '../lib/asyncHandler.js'

export const authRouter = Router()

const credentialsSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(8, 'Password must be at least 8 characters.'),
})

const signupSchema = credentialsSchema.extend({
  name: z.string().trim().min(1).max(255).optional(),
})

const SESSION_DAYS = 30

authRouter.post('/signup', asyncHandler(async (req, res) => {
  const parsed = signupSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.issues[0]?.message ?? 'A valid email and password (8+ characters) are required.' })
  }
  const { email, password, name } = parsed.data

  const [existingRows] = await pool.query('SELECT id FROM users WHERE email = ? LIMIT 1', [email])
  if ((existingRows as any[]).length > 0) {
    return res.status(409).json({ error: 'An account with this email already exists. Try signing in instead.' })
  }

  const passwordHash = await bcrypt.hash(password, 10)
  const [result] = await pool.query(
    'INSERT INTO users (email, password_hash, name, last_login_at) VALUES (?, ?, ?, NOW())',
    [email, passwordHash, name ?? null],
  )
  const userId = (result as any).insertId

  const tokenId = crypto.randomUUID()
  const sessionExpiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000)
  await pool.query('INSERT INTO sessions (user_id, token_id, expires_at) VALUES (?, ?, ?)', [userId, tokenId, sessionExpiresAt])
  const token = signAuthToken({ userId, email, tokenId, role: 'customer' })

  res.status(201).json({ token, user: { id: userId, email, name: name ?? null, role: 'customer' } })
}))

authRouter.post('/login', asyncHandler(async (req, res) => {
  const parsed = credentialsSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ error: 'A valid email and password are required.' })
  }
  const { email, password } = parsed.data

  const [rows] = await pool.query('SELECT id, email, password_hash, name, role FROM users WHERE email = ? LIMIT 1', [email])
  const user = (rows as any[])[0]

  if (!user) {
    return res.status(401).json({ error: 'Incorrect email or password.' })
  }

  const isValid = await bcrypt.compare(password, user.password_hash)
  if (!isValid) {
    return res.status(401).json({ error: 'Incorrect email or password.' })
  }

  await pool.query('UPDATE users SET last_login_at = NOW() WHERE id = ?', [user.id])

  const role = user.role ?? 'customer'
  const tokenId = crypto.randomUUID()
  const sessionExpiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000)
  await pool.query('INSERT INTO sessions (user_id, token_id, expires_at) VALUES (?, ?, ?)', [user.id, tokenId, sessionExpiresAt])
  const token = signAuthToken({ userId: user.id, email: user.email, tokenId, role })

  res.json({ token, user: { id: user.id, email: user.email, name: user.name, role } })
}))

authRouter.get('/me', requireAuth, asyncHandler(async (req, res) => {
  const [rows] = await pool.query('SELECT id, email, name, role FROM users WHERE id = ? LIMIT 1', [req.auth!.userId])
  const user = (rows as any[])[0]
  if (!user) return res.status(404).json({ error: 'User not found.' })
  res.json({ user: { ...user, role: user.role ?? 'customer' } })
}))

authRouter.post('/logout', requireAuth, asyncHandler(async (req, res) => {
  await pool.query('UPDATE sessions SET revoked_at = NOW() WHERE token_id = ?', [req.auth!.tokenId])
  res.json({ ok: true })
}))
