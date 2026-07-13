// UI-only Razorpay integration: loads the real Checkout.js widget in test mode
// and opens it client-side. There is no backend to create a signed order,
// so this uses a locally-generated receipt id and simulates success —
// no real payment is captured. Swap in a server-created order_id to go live.

const RAZORPAY_SCRIPT_SRC = 'https://checkout.razorpay.com/v1/checkout.js'
const RAZORPAY_TEST_KEY = 'rzp_test_1DP5mmOlF5G5ag' // Razorpay's public sample test key

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
}

export async function openRazorpayCheckout(opts: {
  amount: number
  name?: string
  description?: string
  email?: string
  contact?: string
}): Promise<RazorpayResult> {
  const loaded = await loadRazorpayScript()
  const receiptId = `receipt_${Date.now()}`

  if (!loaded || !(window as any).Razorpay) {
    // Offline fallback: simulate instantly if the script can't load (e.g. no network).
    await new Promise((r) => setTimeout(r, 900))
    return { success: true, paymentId: `pay_sim_${receiptId}`, method: 'simulated' }
  }

  return new Promise((resolve) => {
    const rzp = new (window as any).Razorpay({
      key: RAZORPAY_TEST_KEY,
      amount: Math.round(opts.amount * 100),
      currency: 'INR',
      name: opts.name ?? 'Cosmos Edge Bookstore',
      description: opts.description ?? 'Order payment',
      image: '/favicon.svg',
      prefill: {
        email: opts.email ?? '',
        contact: opts.contact ?? '',
      },
      theme: { color: '#4C7F2A' },
      handler: (response: any) => {
        resolve({ success: true, paymentId: response.razorpay_payment_id ?? `pay_${receiptId}`, method: 'razorpay' })
      },
      modal: {
        ondismiss: () => resolve({ success: false, paymentId: '', method: 'razorpay' }),
      },
    })
    rzp.on('payment.failed', () => resolve({ success: false, paymentId: '', method: 'razorpay' }))
    rzp.open()
  })
}
