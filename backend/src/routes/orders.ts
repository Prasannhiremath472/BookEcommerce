import { Router } from 'express'
import { pool } from '../db/pool.js'
import { requireAuth } from '../middleware/requireAuth.js'
import { asyncHandler } from '../lib/asyncHandler.js'
import { buildTimeline } from '../lib/orderTimeline.js'

export const ordersRouter = Router()
ordersRouter.use(requireAuth)

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
    address: `${row.address_label} — ${row.address_line1}, ${row.address_city}`,
    eta: row.eta ?? undefined,
    timeline: buildTimeline(row.status, new Date(row.updated_at)),
  }
}

async function loadItemsForOrders(orderIds: string[]) {
  if (orderIds.length === 0) return new Map<string, any[]>()
  const [rows] = await pool.query(
    `SELECT * FROM order_items WHERE order_id IN (${orderIds.map(() => '?').join(',')})`,
    orderIds,
  )
  const map = new Map<string, any[]>()
  for (const row of rows as any[]) {
    const list = map.get(row.order_id) ?? []
    list.push(row)
    map.set(row.order_id, list)
  }
  return map
}

ordersRouter.get('/', asyncHandler(async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC', [req.auth!.userId])
  const orderRows = rows as any[]
  const itemsMap = await loadItemsForOrders(orderRows.map((r) => r.id))
  res.json({ orders: orderRows.map((r) => mapOrderRow(r, itemsMap.get(r.id) ?? [])) })
}))

ordersRouter.get('/:id', asyncHandler(async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM orders WHERE id = ? AND user_id = ? LIMIT 1', [req.params.id, req.auth!.userId])
  const order = (rows as any[])[0]
  if (!order) return res.status(404).json({ error: 'Order not found.' })

  const [itemRows] = await pool.query('SELECT * FROM order_items WHERE order_id = ?', [order.id])
  res.json({ order: mapOrderRow(order, itemRows as any[]) })
}))
