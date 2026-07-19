import { Router } from 'express'
import crypto from 'crypto'
import Razorpay from 'razorpay'
import { z } from 'zod'
import { config } from '../config.js'
import { pool } from '../db/pool.js'
import { asyncHandler } from '../lib/asyncHandler.js'

export const paymentsRouter = Router()

const razorpay = new Razorpay({
  key_id: config.razorpay.keyId,
  key_secret: config.razorpay.keySecret,
})

const createOrderSchema = z.object({
  amount: z.number().int().min(100),
  currency: z.string().trim().toUpperCase().default('INR'),
  receipt: z.string().trim().min(1).max(64).optional(),
})

const orderItemSchema = z.object({
  bookId: z.string().trim().min(1),
  title: z.string().trim().min(1),
  cover: z.string().trim().min(1),
  price: z.number().min(0),
  quantity: z.number().int().min(1),
})

const orderAddressSchema = z.object({
  label: z.string().trim().min(1),
  name: z.string().trim().min(1),
  line1: z.string().trim().min(1),
  city: z.string().trim().min(1),
  state: z.string().trim().min(1),
  zip: z.string().trim().min(1),
  phone: z.string().trim().min(1),
})

const verifyPaymentSchema = z.object({
  razorpay_order_id: z.string().trim().min(1),
  razorpay_payment_id: z.string().trim().min(1),
  razorpay_signature: z.string().trim().min(1),
  // Optional order-creation fields — sent only by frontend builds that know
  // about the orders table. Kept optional so older, already-deployed
  // frontend builds (sending none of these) still verify payments
  // successfully; they just don't get an order row created for them.
  userId: z.number().int().optional(),
  items: z.array(orderItemSchema).optional(),
  address: orderAddressSchema.optional(),
  subtotal: z.number().min(0).optional(),
  shipping: z.number().min(0).optional(),
  total: z.number().min(0).optional(),
})

function generateOrderId() {
  const n = Math.floor(100000 + Math.random() * 900000)
  return `FOL-${n}`
}

paymentsRouter.post('/create-order', asyncHandler(async (req, res) => {
  const parsed = createOrderSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ error: 'A valid amount (in paise, minimum 100) is required.' })
  }
  const { amount, currency, receipt } = parsed.data

  try {
    const order = await razorpay.orders.create({
      amount,
      currency,
      receipt: receipt ?? `receipt_${Date.now()}`,
    })
    res.json({ order_id: order.id, amount: order.amount, currency: order.currency })
  } catch (err: any) {
    if (err?.statusCode === 401) {
      return res.status(401).json({ error: 'Razorpay authentication failed. Check server API keys.' })
    }
    console.error('Razorpay order creation failed:', err)
    return res.status(500).json({ error: 'Could not create the payment order. Please try again.' })
  }
}))

paymentsRouter.post('/verify-payment', asyncHandler(async (req, res) => {
  const parsed = verifyPaymentSchema.safeParse(req.body)
  if (!parsed.success) {
    return res.status(400).json({ error: 'Missing payment verification fields.' })
  }
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userId, items, address, subtotal, shipping, total } = parsed.data

  const expectedSignature = crypto
    .createHmac('sha256', config.razorpay.keySecret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex')

  if (expectedSignature !== razorpay_signature) {
    return res.status(400).json({ verified: false, error: 'Payment signature verification failed.' })
  }

  let order: { id: string; total: number } | undefined

  if (userId !== undefined && items && items.length > 0 && address && total !== undefined) {
    const connection = await pool.getConnection()
    try {
      await connection.beginTransaction()
      const orderId = generateOrderId()

      await connection.query(
        `INSERT INTO orders (id, user_id, subtotal, shipping, total, razorpay_order_id, razorpay_payment_id, address_label, address_name, address_line1, address_city, address_state, address_zip, address_phone)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [orderId, userId, subtotal ?? total, shipping ?? 0, total, razorpay_order_id, razorpay_payment_id, address.label, address.name, address.line1, address.city, address.state, address.zip, address.phone],
      )

      for (const item of items) {
        await connection.query(
          'INSERT INTO order_items (order_id, book_id, title, cover_path, price, quantity) VALUES (?, ?, ?, ?, ?, ?)',
          [orderId, item.bookId, item.title, item.cover, item.price, item.quantity],
        )
      }

      await connection.commit()
      order = { id: orderId, total }
    } catch (err) {
      await connection.rollback()
      console.error('Order creation failed after verified payment:', err)
      // Payment is still verified even if order-row creation failed — never
      // tell the customer their payment failed when it actually succeeded.
    } finally {
      connection.release()
    }
  }

  res.json({ verified: true, orderId: razorpay_order_id, paymentId: razorpay_payment_id, order })
}))
