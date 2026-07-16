import { Router } from 'express'
import crypto from 'crypto'
import { z } from 'zod'
import { pool } from '../db/pool.js'
import { generateOtpCode, hashOtpCode } from '../lib/otp.js'
import { sendOtpEmail } from '../lib/mailer.js'
import { signAuthToken } from '../lib/jwt.js'
import { requireAuth } from '../middleware/requireAuth.js'
import { asyncHandler } from '../lib/asyncHandler.js'
import { config } from '../config.js'

export const authRouter = Router()

const emailSchema = z.object({ email: z.string().trim().toLowerCase().email() })
const verifySchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  code: z.string().trim().length(config.otp.length).regex(/^\d+$/),
})

authRouter.post('/send-otp', asyncHandler(async (req, res) => {
  const parsed = emailSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ error: 'A valid email address is required.' })
  }
  const { email } = parsed.data

  // Cooldown: don't allow resending within OTP_RESEND_COOLDOWN_SECONDS.
  const [recentRows] = await pool.query(
    'SELECT created_at FROM otp_codes WHERE email = ? ORDER BY created_at DESC LIMIT 1',
    [email],
  )
  const recent = (recentRows as any[])[0]
  if (recent) {
    const secondsSince = (Date.now() - new Date(recent.created_at).getTime()) / 1000
    if (secondsSince < config.otp.resendCooldownSeconds) {
      return res.status(429).json({
        error: `Please wait ${Math.ceil(config.otp.resendCooldownSeconds - secondsSince)}s before requesting another code.`,
      })
    }
  }

  const code = generateOtpCode(config.otp.length)
  const codeHash = hashOtpCode(code)
  const expiresAt = new Date(Date.now() + config.otp.ttlMinutes * 60_000)

  await pool.query(
    'INSERT INTO otp_codes (email, code_hash, max_attempts, expires_at) VALUES (?, ?, ?, ?)',
    [email, codeHash, config.otp.maxAttempts, expiresAt],
  )

  try {
    await sendOtpEmail(email, code)
  } catch (err) {
    console.error('Failed to send OTP email:', err)
    return res.status(502).json({ error: 'Could not send the email. Please try again shortly.' })
  }

  res.json({ ok: true, expiresInMinutes: config.otp.ttlMinutes })
}))

authRouter.post('/verify-otp', asyncHandler(async (req, res) => {
  const parsed = verifySchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ error: 'A valid email and code are required.' })
  }
  const { email, code } = parsed.data

  const [rows] = await pool.query(
    'SELECT id, code_hash, attempts, max_attempts, expires_at, consumed_at FROM otp_codes WHERE email = ? ORDER BY created_at DESC LIMIT 1',
    [email],
  )
  const otp = (rows as any[])[0]

  if (!otp) {
    return res.status(400).json({ error: 'No code was requested for this email.' })
  }
  if (otp.consumed_at) {
    return res.status(400).json({ error: 'This code has already been used. Request a new one.' })
  }
  if (new Date(otp.expires_at) < new Date()) {
    return res.status(400).json({ error: 'This code has expired. Request a new one.' })
  }
  if (otp.attempts >= otp.max_attempts) {
    return res.status(429).json({ error: 'Too many incorrect attempts. Request a new code.' })
  }

  const isValid = hashOtpCode(code) === otp.code_hash

  if (!isValid) {
    await pool.query('UPDATE otp_codes SET attempts = attempts + 1 WHERE id = ?', [otp.id])
    const attemptsLeft = otp.max_attempts - (otp.attempts + 1)
    return res.status(400).json({ error: `Incorrect code. ${Math.max(attemptsLeft, 0)} attempt(s) left.` })
  }

  await pool.query('UPDATE otp_codes SET consumed_at = NOW() WHERE id = ?', [otp.id])

  // Upsert user
  await pool.query(
    'INSERT INTO users (email, last_login_at) VALUES (?, NOW()) ON DUPLICATE KEY UPDATE last_login_at = NOW()',
    [email],
  )
  const [userRows] = await pool.query('SELECT id, email, name FROM users WHERE email = ? LIMIT 1', [email])
  const user = (userRows as any[])[0]

  const tokenId = crypto.randomUUID()
  const sessionExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
  await pool.query(
    'INSERT INTO sessions (user_id, token_id, expires_at) VALUES (?, ?, ?)',
    [user.id, tokenId, sessionExpiresAt],
  )

  const token = signAuthToken({ userId: user.id, email: user.email, tokenId })

  res.json({ token, user: { id: user.id, email: user.email, name: user.name } })
}))

authRouter.get('/me', requireAuth, asyncHandler(async (req, res) => {
  const [rows] = await pool.query('SELECT id, email, name FROM users WHERE id = ? LIMIT 1', [req.auth!.userId])
  const user = (rows as any[])[0]
  if (!user) return res.status(404).json({ error: 'User not found.' })
  res.json({ user })
}))

authRouter.post('/logout', requireAuth, asyncHandler(async (req, res) => {
  await pool.query('UPDATE sessions SET revoked_at = NOW() WHERE token_id = ?', [req.auth!.tokenId])
  res.json({ ok: true })
}))
