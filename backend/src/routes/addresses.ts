import { Router } from 'express'
import { z } from 'zod'
import { pool } from '../db/pool.js'
import { requireAuth } from '../middleware/requireAuth.js'
import { asyncHandler } from '../lib/asyncHandler.js'

export const addressesRouter = Router()
addressesRouter.use(requireAuth)

const addressSchema = z.object({
  label: z.string().trim().min(1).max(50),
  name: z.string().trim().min(1).max(255),
  line1: z.string().trim().min(1).max(255),
  city: z.string().trim().min(1).max(100),
  state: z.string().trim().min(1).max(100),
  zip: z.string().trim().min(1).max(20),
  phone: z.string().trim().min(1).max(20),
  isDefault: z.boolean().optional(),
})

function mapRow(row: any) {
  return {
    id: String(row.id),
    label: row.label,
    name: row.name,
    line1: row.line1,
    city: row.city,
    state: row.state,
    zip: row.zip,
    phone: row.phone,
    isDefault: !!row.is_default,
  }
}

addressesRouter.get('/', asyncHandler(async (req, res) => {
  const [rows] = await pool.query(
    'SELECT * FROM addresses WHERE user_id = ? ORDER BY is_default DESC, created_at ASC',
    [req.auth!.userId],
  )
  res.json({ addresses: (rows as any[]).map(mapRow) })
}))

addressesRouter.post('/', asyncHandler(async (req, res) => {
  const parsed = addressSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ error: 'Please fill in all address fields.' })
  }
  const { label, name, line1, city, state, zip, phone, isDefault } = parsed.data

  const [existingRows] = await pool.query('SELECT id FROM addresses WHERE user_id = ? LIMIT 1', [req.auth!.userId])
  const isFirstAddress = (existingRows as any[]).length === 0
  const shouldBeDefault = isFirstAddress || !!isDefault

  if (shouldBeDefault) {
    await pool.query('UPDATE addresses SET is_default = FALSE WHERE user_id = ?', [req.auth!.userId])
  }

  const [result] = await pool.query(
    'INSERT INTO addresses (user_id, label, name, line1, city, state, zip, phone, is_default) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [req.auth!.userId, label, name, line1, city, state, zip, phone, shouldBeDefault],
  )
  const insertId = (result as any).insertId

  const [rows] = await pool.query('SELECT * FROM addresses WHERE id = ? LIMIT 1', [insertId])
  res.status(201).json({ address: mapRow((rows as any[])[0]) })
}))

addressesRouter.put('/:id/default', asyncHandler(async (req, res) => {
  const [rows] = await pool.query('SELECT id FROM addresses WHERE id = ? AND user_id = ? LIMIT 1', [req.params.id, req.auth!.userId])
  if ((rows as any[]).length === 0) {
    return res.status(404).json({ error: 'Address not found.' })
  }
  await pool.query('UPDATE addresses SET is_default = FALSE WHERE user_id = ?', [req.auth!.userId])
  await pool.query('UPDATE addresses SET is_default = TRUE WHERE id = ?', [req.params.id])
  res.json({ ok: true })
}))
