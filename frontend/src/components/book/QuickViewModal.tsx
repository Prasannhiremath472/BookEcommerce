import { motion, AnimatePresence } from 'framer-motion'
import { X, Heart, ShoppingBag, Check } from 'lucide-react'
import { Link } from 'react-router-dom'
import clsx from 'clsx'
import type { Book } from '@/data/types'
import { Badge } from '@/components/ui/Badge'
import { formatPrice, discountPercent } from '@/lib/utils'
import { useCart } from '@/context/CartContext'
import { useWishlist } from '@/context/WishlistContext'
import { Button } from '@/components/ui/Button'
import { useLanguage } from '@/context/LanguageContext'

export function QuickViewModal({ book, onClose }: { book: Book | null; onClose: () => void }) {
  const { addItem } = useCart()
  const { toggle, has } = useWishlist()
  const { t } = useLanguage()

  return (
    <AnimatePresence>
      {book && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/50 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="relative grid w-full max-w-3xl grid-cols-1 gap-8 overflow-hidden rounded-3xl bg-white p-6 shadow-lifted sm:grid-cols-2 sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={onClose} className="absolute right-5 top-5 z-10 text-ink-muted hover:text-ink">
              <X size={22} />
            </button>

            <div className="overflow-hidden rounded-2xl bg-ink/5">
              <img src={book.cover} alt={book.title} className="aspect-[3/4] w-full object-cover" />
            </div>

            <div className="flex flex-col">
              <span className="text-xs font-semibold uppercase tracking-wide text-primary">{book.category}</span>
              <h2 className="mt-1 font-heading text-2xl font-bold text-ink">{book.title}</h2>
              <p className="text-sm text-ink-muted">{t('by')} {book.author}</p>

              <div className="mt-4 flex items-baseline gap-2">
                <span className="font-heading text-2xl font-bold text-ink">{formatPrice(book.price)}</span>
                {book.originalPrice && (
                  <>
                    <span className="text-ink-muted line-through">{formatPrice(book.originalPrice)}</span>
                    <Badge tone="accent">-{discountPercent(book.price, book.originalPrice)}%</Badge>
                  </>
                )}
              </div>

              <p className="mt-4 line-clamp-4 text-sm leading-relaxed text-ink-soft">{book.description}</p>

              <div className="mt-4 flex items-center gap-2 text-sm">
                {book.inStock ? (
                  <span className="flex items-center gap-1.5 text-success">
                    <Check size={15} /> {t('inStock')} ({book.stockCount})
                  </span>
                ) : (
                  <span className="text-danger">{t('outOfStock')}</span>
                )}
              </div>

              <div className="mt-6 flex gap-3">
                <Button className="flex-1" onClick={() => addItem(book)} disabled={!book.inStock}>
                  <ShoppingBag size={16} /> {t('addToCart')}
                </Button>
                <button
                  onClick={() => toggle(book.id)}
                  className={clsx(
                    'flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full border transition-colors',
                    has(book.id) ? 'border-danger bg-danger text-white' : 'border-ink/10 text-ink-soft hover:text-danger',
                  )}
                >
                  <Heart size={18} className={clsx(has(book.id) && 'fill-current')} />
                </button>
              </div>

              <Link to={`/book/${book.id}`} onClick={onClose} className="mt-4 text-center text-sm font-semibold text-primary hover:underline">
                {t('viewFullDetails')}
              </Link>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
