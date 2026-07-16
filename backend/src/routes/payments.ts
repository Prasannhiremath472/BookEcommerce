import { Router } from 'express'
import crypto from 'crypto'
import Razorpay from 'razorpay'
import { z } from 'zod'
import { config } from '../config.js'
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

const verifyPaymentSchema = z.object({
  razorpay_order_id: z.string().trim().min(1),
  razorpay_payment_id: z.string().trim().min(1),
  razorpay_signature: z.string().trim().min(1),
})

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
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = parsed.data

  const expectedSignature = crypto
    .createHmac('sha256', config.razorpay.keySecret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex')

  if (expectedSignature !== razorpay_signature) {
    return res.status(400).json({ verified: false, error: 'Payment signature verification failed.' })
  }

  res.json({ verified: true, orderId: razorpay_order_id, paymentId: razorpay_payment_id })
}))
