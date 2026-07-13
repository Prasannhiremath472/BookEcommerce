export interface Book {
  id: string
  title: string
  author: string
  authorId: string
  cover: string
  price: number
  originalPrice?: number
  category: string
  categoryId: string
  format: 'Hardcover' | 'Paperback' | 'eBook' | 'Audiobook'
  language: string
  publisher: string
  inStock: boolean
  stockCount?: number
  isBestseller?: boolean
  isNew?: boolean
  isTrending?: boolean
  badge?: string
  description: string
  pages: number
  publishedYear: number
  isbn: string
}

export interface Category {
  id: string
  name: string
  slug: string
  image: string
  bookCount: number
  description: string
}

export interface Author {
  id: string
  name: string
  photo: string
  bio: string
  bookCount: number
}

export interface Publisher {
  id: string
  name: string
  logo: string
}

export interface Address {
  id: string
  label: string
  name: string
  line1: string
  city: string
  state: string
  zip: string
  phone: string
  isDefault?: boolean
}

export type OrderStatus = 'Processing' | 'Shipped' | 'Out for Delivery' | 'Delivered' | 'Cancelled'

export interface OrderItem {
  bookId: string
  title: string
  cover: string
  price: number
  quantity: number
}

export interface Order {
  id: string
  date: string
  status: OrderStatus
  items: OrderItem[]
  total: number
  address: string
  eta?: string
  timeline: { status: OrderStatus; date: string; done: boolean }[]
}

export interface WalletTransaction {
  id: string
  type: 'credit' | 'debit'
  amount: number
  reason: string
  date: string
}

export interface Notification {
  id: string
  title: string
  body: string
  date: string
  read: boolean
  type: 'order' | 'offer' | 'system'
}
