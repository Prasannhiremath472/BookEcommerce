import { createContext, useContext, useState, type ReactNode } from 'react'

interface WishlistContextValue {
  ids: Set<string>
  toggle: (bookId: string) => void
  has: (bookId: string) => boolean
  count: number
}

const WishlistContext = createContext<WishlistContextValue | null>(null)

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [ids, setIds] = useState<Set<string>>(new Set())

  const toggle = (bookId: string) => {
    setIds((prev) => {
      const next = new Set(prev)
      if (next.has(bookId)) next.delete(bookId)
      else next.add(bookId)
      return next
    })
  }

  return (
    <WishlistContext.Provider value={{ ids, toggle, has: (id) => ids.has(id), count: ids.size }}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider')
  return ctx
}
