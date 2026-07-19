import { Router } from 'express'
import { z } from 'zod'
import { pool } from '../db/pool.js'
import { requireAuth } from '../middleware/requireAuth.js'
import { requireAdmin } from '../middleware/requireAdmin.js'
import { asyncHandler } from '../lib/asyncHandler.js'
import { buildTimeline } from '../lib/orderTimeline.js'

export const adminOrdersRouter = Router()
adminOrdersRouter.use(requireAuth, requireAdmin)

const STATUS_VALUES = ['Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled'] as const

const listOrdersSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  status: z.enum(STATUS_VALUES).optional(),
})

const updateStatusSchema = z.object({
  status: z.enum(STATUS_VALUES),
})

function mapOrderRow(row: any, items: any[]) {
  return {
    id: row.id,
    date: new Date(row.created_at).toDateString(),
    status: row.status,
    items: items.map((i) => ({
      bookId: i.book_id,
      title: i.title,
      cover: i.cover_path,
      price: Number(i.price),
      quantity: i.quantity,
    })),
    total: Number(row.total),
    address: `${row.address_label} — ${row.address_line1}, ${row.address_city}, ${row.address_state} ${row.address_zip}`,
    eta: row.eta ?? undefined,
    timeline: buildTimeline(row.status, new Date(row.updated_at)),
    customerEmail: row.email,
    customerName: row.name,
    razorpayOrderId: row.razorpay_order_id,
    razorpayPaymentId: row.razorpay_payment_id,
  }
}

adminOrdersRouter.get('/', asyncHandler(async (req, res) => {
  const parsed = listOrdersSchema.safeParse(req.query)
  if (!parsed.success) {
    return res.status(400).json({ error: 'Invalid query parameters.' })
  }
  const { page, pageSize, status } = parsed.data

  const where = status ? 'WHERE o.status = ?' : ''
  const params = status ? [status] : []

  const [countRows] = await pool.query(`SELECT COUNT(*) AS total FROM orders o ${where}`, params)
  const total = (countRows as any[])[0].total as number

  const offset = (page - 1) * pageSize
  const [rows] = await pool.query(
    `SELECT o.*, u.email, u.name FROM orders o JOIN users u ON u.id = o.user_id ${where} ORDER BY o.created_at DESC LIMIT ? OFFSET ?`,
    [...params, pageSize, offset],
  )
  const orderRows = rows as any[]

  const orderIds = orderRows.map((r) => r.id)
  const itemsMap = new Map<string, any[]>()
  if (orderIds.length > 0) {
    const [itemRows] = await pool.query(
      `SELECT * FROM order_items WHERE order_id IN (${orderIds.map(() => '?').join(',')})`,
      orderIds,
    )
    for (const item of itemRows as any[]) {
      const list = itemsMap.get(item.order_id) ?? []
      list.push(item)
      itemsMap.set(item.order_id, list)
    }
  }

  res.json({ orders: orderRows.map((r) => mapOrderRow(r, itemsMap.get(r.id) ?? [])), total, page, pageSize })
}))

adminOrdersRouter.get('/:id', asyncHandler(async (req, res) => {
  const [rows] = await pool.query(
    'SELECT o.*, u.email, u.name FROM orders o JOIN users u ON u.id = o.user_id WHERE o.id = ? LIMIT 1',
    [req.params.id],
  )
  const order = (rows as any[])[0]
  if (!order) return res.status(404).json({ error: 'Order not found.' })

  const [itemRows] = await pool.query('SELECT * FROM order_items WHERE order_id = ?', [order.id])
  res.json({ order: mapOrderRow(order, itemRows as any[]) })
}))

adminOrdersRouter.patch('/:id/status', asyncHandler(async (req, res) => {
  const parsed = updateStatusSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ error: 'A valid status is required.' })
  }

  const [existing] = await pool.query('SELECT id FROM orders WHERE id = ? LIMIT 1', [req.params.id])
  if ((existing as any[]).length === 0) {
    return res.status(404).json({ error: 'Order not found.' })
  }

  await pool.query('UPDATE orders SET status = ? WHERE id = ?', [parsed.data.status, req.params.id])
  res.json({ ok: true })
}))
