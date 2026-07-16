// Razorpay Standard Checkout: the backend creates a signed order (server/src/routes/payments.ts)
// and verifies the HMAC-SHA256 payment signature after the modal succeeds. The key secret never
// reaches this file — only the public key id (VITE_RAZORPAY_KEY_ID) is used client-side.

import { createRazorpayOrder, verifyRazorpayPayment, ApiError } from './api'

const RAZORPAY_SCRIPT_SRC = 'https://checkout.razorpay.com/v1/checkout.js'
const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID as string | undefined

let scriptPromise: Promise<boolean> | null = null

function loadRazorpayScript(): Promise<boolean> {
  if (scriptPromise) return scriptPromise
  scriptPromise = new Promise((resolve) => {
    if (document.querySelector(`script[src="${RAZORPAY_SCRIPT_SRC}"]`)) {
      resolve(true)
      return
    }
    const script = document.createElement('script')
    script.src = RAZORPAY_SCRIPT_SRC
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
  return scriptPromise
}

export interface RazorpayResult {
  success: boolean
  paymentId: string
  method: string
  error?: string
}

export async function openRazorpayCheckout(opts: {
  amount: number // in rupees
  name?: string
  description?: string
  email?: string
  contact?: string
}): Promise<RazorpayResult> {
  if (!RAZORPAY_KEY_ID) {
    return { success: false, paymentId: '', method: 'razorpay', error: 'Payment gateway is not configured.' }
  }

  let order
  try {
    order = await createRazorpayOrder(Math.round(opts.amount * 100))
  } catch (err) {
    const message = err instanceof ApiError ? err.message : 'Could not start the payment. Please try again.'
    return { success: false, paymentId: '', method: 'razorpay', error: message }
  }

  const loaded = await loadRazorpayScript()
  if (!loaded || !(window as any).Razorpay) {
    return { success: false, paymentId: '', method: 'razorpay', error: 'Could not load the payment gateway. Check your connection.' }
  }

  return new Promise((resolve) => {
    const rzp = new (window as any).Razorpay({
      key: RAZORPAY_KEY_ID,
      order_id: order.order_id,
      amount: order.amount,
      currency: order.currency,
      name: opts.name ?? 'Cosmos Edge Bookstore',
      description: opts.description ?? 'Order payment',
      image: '/favicon.svg',
      prefill: {
        email: opts.email ?? '',
        contact: opts.contact ?? '',
      },
      theme: { color: '#4C7F2A' },
      handler: async (response: any) => {
        try {
          const result = await verifyRazorpayPayment({
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          })
          if (result.verified) {
            resolve({ success: true, paymentId: result.paymentId, method: 'razorpay' })
          } else {
            resolve({ success: false, paymentId: '', method: 'razorpay', error: 'Payment could not be verified.' })
          }
        } catch (err) {
          const message = err instanceof ApiError ? err.message : 'Payment verification failed.'
          resolve({ success: false, paymentId: '', method: 'razorpay', error: message })
        }
      },
      modal: {
        ondismiss: () => resolve({ success: false, paymentId: '', method: 'razorpay', error: 'Payment cancelled.' }),
      },
    })
    rzp.on('payment.failed', (resp: any) => {
      resolve({
        success: false,
        paymentId: '',
        method: 'razorpay',
        error: resp?.error?.description ?? 'Payment failed.',
      })
    })
    rzp.open()
  })
}
