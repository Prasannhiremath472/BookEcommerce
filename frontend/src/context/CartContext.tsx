import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import type { Book } from '@/data/types'

export interface CartItem {
  book: Book
  quantity: number
}

interface CartContextValue {
  items: CartItem[]
  isOpen: boolean
  openCart: () => void
  closeCart: () => void
  addItem: (book: Book, quantity?: number) => void
  removeItem: (bookId: string) => void
  updateQuantity: (bookId: string, quantity: number) => void
  clearCart: () => void
  subtotal: number
  itemCount: number
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isOpen, setIsOpen] = useState(false)

  const addItem = (book: Book, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.book.id === book.id)
      if (existing) {
        return prev.map((i) => (i.book.id === book.id ? { ...i, quantity: i.quantity + quantity } : i))
      }
      return [...prev, { book, quantity }]
    })
    setIsOpen(true)
  }

  const removeItem = (bookId: string) => {
    setItems((prev) => prev.filter((i) => i.book.id !== bookId))
  }

  const updateQuantity = (bookId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(bookId)
      return
    }
    setItems((prev) => prev.map((i) => (i.book.id === bookId ? { ...i, quantity } : i)))
  }

  const subtotal = useMemo(() => items.reduce((sum, i) => sum + i.book.price * i.quantity, 0), [items])
  const itemCount = useMemo(() => items.reduce((sum, i) => sum + i.quantity, 0), [items])

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        openCart: () => setIsOpen(true),
        closeCart: () => setIsOpen(false),
        addItem,
        removeItem,
        updateQuantity,
        clearCart: () => setItems([]),
        subtotal,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
