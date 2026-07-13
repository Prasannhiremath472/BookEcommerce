import { motion, AnimatePresence } from 'framer-motion'
import { X, Minus, Plus, ShoppingBag } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useCart } from '@/context/CartContext'
import { formatPrice } from '@/lib/utils'
import { Button } from '@/components/ui/Button'

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, subtotal } = useCart()

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] bg-ink/40 backdrop-blur-sm"
          onClick={closeCart}
        >
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 280 }}
            className="ml-auto flex h-full w-full max-w-md flex-col bg-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-ink/10 px-6 py-5">
              <h3 className="font-heading text-lg font-bold">Your Cart ({items.length})</h3>
              <button onClick={closeCart} className="text-ink-muted hover:text-ink">
                <X size={22} />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
                <ShoppingBag size={48} className="text-ink/15" />
                <p className="text-ink-muted">Your cart is empty.</p>
                <Button onClick={closeCart}>Continue Shopping</Button>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-6 py-4">
                  <AnimatePresence initial={false}>
                    {items.map((item) => (
                      <motion.div
                        key={item.book.id}
                        layout
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex gap-4 border-b border-ink/5 py-4 last:border-0"
                      >
                        <img src={item.book.cover} alt="" className="h-24 w-16 rounded-lg object-cover shadow-soft" />
                        <div className="flex flex-1 flex-col justify-between">
                          <div>
                            <p className="line-clamp-1 text-sm font-semibold text-ink">{item.book.title}</p>
                            <p className="text-xs text-ink-muted">{item.book.author}</p>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 rounded-full border border-ink/10 px-2 py-1">
                              <button onClick={() => updateQuantity(item.book.id, item.quantity - 1)}>
                                <Minus size={12} />
                              </button>
                              <span className="w-4 text-center text-xs font-semibold">{item.quantity}</span>
                              <button onClick={() => updateQuantity(item.book.id, item.quantity + 1)}>
                                <Plus size={12} />
                              </button>
                            </div>
                            <span className="text-sm font-bold text-ink">{formatPrice(item.book.price * item.quantity)}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => removeItem(item.book.id)}
                          className="self-start text-ink-muted hover:text-danger"
                        >
                          <X size={16} />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>

                <div className="border-t border-ink/10 px-6 py-5">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-sm text-ink-muted">Subtotal</span>
                    <span className="font-heading text-xl font-bold text-ink">{formatPrice(subtotal)}</span>
                  </div>
                  <Link to="/checkout" onClick={closeCart}>
                    <Button className="w-full" size="lg">
                      Checkout
                    </Button>
                  </Link>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
