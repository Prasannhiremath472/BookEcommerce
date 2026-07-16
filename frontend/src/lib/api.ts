const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000'

export interface AuthUser {
  id: number
  email: string
  name: string | null
}

class ApiError extends Error {
  constructor(message: string, public status: number) {
    super(message)
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  let res: Response
  try {
    res = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })
  } catch {
    throw new ApiError('Could not reach the server. Please check your connection and try again.', 0)
  }

  let data: any = null
  try {
    data = await res.json()
  } catch {
    // no body
  }

  if (!res.ok) {
    throw new ApiError(data?.error ?? 'Something went wrong. Please try again.', res.status)
  }

  return data as T
}

export function sendOtp(email: string) {
  return request<{ ok: true; expiresInMinutes: number }>('/api/auth/send-otp', {
    method: 'POST',
    body: JSON.stringify({ email }),
  })
}

export function verifyOtp(email: string, code: string) {
  return request<{ token: string; user: AuthUser }>('/api/auth/verify-otp', {
    method: 'POST',
    body: JSON.stringify({ email, code }),
  })
}

export function fetchMe(token: string) {
  return request<{ user: AuthUser }>('/api/auth/me', {
    headers: { Authorization: `Bearer ${token}` },
  })
}

export function logout(token: string) {
  return request<{ ok: true }>('/api/auth/logout', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  })
}

export interface RazorpayOrder {
  order_id: string
  amount: number
  currency: string
}

export function createRazorpayOrder(amountInPaise: number, receipt?: string) {
  return request<RazorpayOrder>('/api/create-order', {
    method: 'POST',
    body: JSON.stringify({ amount: amountInPaise, currency: 'INR', receipt }),
  })
}

export interface VerifyPaymentPayload {
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
}

export function verifyRazorpayPayment(payload: VerifyPaymentPayload) {
  return request<{ verified: boolean; orderId: string; paymentId: string }>('/api/verify-payment', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export interface ApiAddress {
  id: string
  label: string
  name: string
  line1: string
  city: string
  state: string
  zip: string
  phone: string
  isDefault: boolean
}

export type NewAddress = Omit<ApiAddress, 'id' | 'isDefault'> & { isDefault?: boolean }

export function fetchAddresses(token: string) {
  return request<{ addresses: ApiAddress[] }>('/api/addresses', {
    headers: { Authorization: `Bearer ${token}` },
  })
}

export function createAddress(token: string, address: NewAddress) {
  return request<{ address: ApiAddress }>('/api/addresses', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(address),
  })
}

export { ApiError }
