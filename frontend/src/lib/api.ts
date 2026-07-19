const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000'

export interface AuthUser {
  id: number
  email: string
  name: string | null
  role: 'customer' | 'admin'
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

export function signup(email: string, password: string, name?: string) {
  return request<{ token: string; user: AuthUser }>('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ email, password, name }),
  })
}

export function login(email: string, password: string) {
  return request<{ token: string; user: AuthUser }>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
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

export interface VerifyPaymentOrderItem {
  bookId: string
  title: string
  cover: string
  price: number
  quantity: number
}

export interface VerifyPaymentAddress {
  label: string
  name: string
  line1: string
  city: string
  state: string
  zip: string
  phone: string
}

export interface VerifyPaymentPayload {
  razorpay_order_id: string
  razorpay_payment_id: string
  razorpay_signature: string
  userId?: number
  items?: VerifyPaymentOrderItem[]
  address?: VerifyPaymentAddress
  subtotal?: number
  shipping?: number
  total?: number
}

export function verifyRazorpayPayment(payload: VerifyPaymentPayload) {
  return request<{ verified: boolean; orderId: string; paymentId: string; order?: { id: string; total: number } }>('/api/verify-payment', {
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

// --- Catalog (public reads) ---

export interface BooksQuery {
  page?: number
  pageSize?: number
  category?: string
  author?: string
  language?: string
  publisher?: string
  format?: string
  inStock?: boolean
  maxPrice?: number
  filter?: 'bestsellers' | 'new' | 'trending' | 'deals'
  sort?: 'featured' | 'price-asc' | 'price-desc' | 'newest'
  search?: string
  ids?: string[]
}

function buildQueryString(params: object) {
  const search = new URLSearchParams()
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null || value === '') continue
    search.set(key, Array.isArray(value) ? value.join(',') : String(value))
  }
  const qs = search.toString()
  return qs ? `?${qs}` : ''
}

export function fetchBooks(query: BooksQuery = {}) {
  return request<{ books: any[]; total: number; page: number; pageSize: number }>(`/api/books${buildQueryString(query)}`)
}

export function fetchBookById(id: string) {
  return request<{ book: any }>(`/api/books/${id}`)
}

export function fetchCategories() {
  return request<{ categories: any[] }>('/api/categories')
}

export function fetchAuthors() {
  return request<{ authors: any[] }>('/api/authors')
}

export function fetchCatalogStats() {
  return request<{ totalBooks: number; totalAuthors: number; totalLanguages: number }>('/api/catalog/stats')
}

// --- Admin catalog writes ---

export function createBookAdmin(token: string, book: Record<string, unknown>) {
  return request<{ ok: true; id: string }>('/api/admin/books', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(book),
  })
}

export function updateBookAdmin(token: string, id: string, book: Record<string, unknown>) {
  return request<{ ok: true }>(`/api/admin/books/${id}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(book),
  })
}

export function deleteBookAdmin(token: string, id: string) {
  return request<{ ok: true }>(`/api/admin/books/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })
}

export function createCategoryAdmin(token: string, category: Record<string, unknown>) {
  return request<{ ok: true; id: string }>('/api/admin/categories', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(category),
  })
}

export function updateCategoryAdmin(token: string, id: string, category: Record<string, unknown>) {
  return request<{ ok: true }>(`/api/admin/categories/${id}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(category),
  })
}

export function deleteCategoryAdmin(token: string, id: string) {
  return request<{ ok: true }>(`/api/admin/categories/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })
}

export function createAuthorAdmin(token: string, author: Record<string, unknown>) {
  return request<{ ok: true; id: string }>('/api/admin/authors', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(author),
  })
}

export function updateAuthorAdmin(token: string, id: string, author: Record<string, unknown>) {
  return request<{ ok: true }>(`/api/admin/authors/${id}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify(author),
  })
}

export function deleteAuthorAdmin(token: string, id: string) {
  return request<{ ok: true }>(`/api/admin/authors/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })
}

export function importCatalogAdmin(token: string) {
  return request<{ ok: true; categories: number; authors: number; books: number }>('/api/admin/import-catalog', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
  })
}

// --- Orders ---

export function fetchOrders(token: string) {
  return request<{ orders: any[] }>('/api/orders', {
    headers: { Authorization: `Bearer ${token}` },
  })
}

export function fetchOrderById(token: string, id: string) {
  return request<{ order: any }>(`/api/orders/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
}

// --- Admin orders ---

export function fetchAdminOrders(token: string, params: { page?: number; pageSize?: number; status?: string } = {}) {
  return request<{ orders: any[]; total: number; page: number; pageSize: number }>(`/api/admin/orders${buildQueryString(params)}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
}

export function fetchAdminOrderById(token: string, id: string) {
  return request<{ order: any }>(`/api/admin/orders/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
}

export function updateOrderStatusAdmin(token: string, id: string, status: string) {
  return request<{ ok: true }>(`/api/admin/orders/${id}/status`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({ status }),
  })
}

export { ApiError }
