import { motion } from 'framer-motion'
import { Heart, ShoppingBag, Eye } from 'lucide-react'
import { Link } from 'react-router-dom'
import clsx from 'clsx'
import type { Book } from '@/data/types'
import { Badge } from '@/components/ui/Badge'
import { formatPrice, discountPercent } from '@/lib/utils'
import { useCart } from '@/context/CartContext'
import { useWishlist } from '@/context/WishlistContext'
import { useLanguage } from '@/context/LanguageContext'

export function BookCard({ book, onQuickView }: { book: Book; onQuickView?: (book: Book) => void }) {
  const { addItem } = useCart()
  const { toggle, has } = useWishlist()
  const { t } = useLanguage()
  const wished = has(book.id)
  const discount = discountPercent(book.price, book.originalPrice)

  return (
    <motion.div
      className="group relative flex flex-col"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="relative overflow-hidden rounded-2xl bg-white shadow-card">
        <Link to={`/book/${book.id}`} className="block aspect-[3/4] overflow-hidden bg-ink/5">
          <motion.img
            src={book.cover}
            alt={book.title}
            loading="lazy"
            className="h-full w-full object-cover"
            whileHover={{ scale: 1.06 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          />
        </Link>

        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {book.badge && <Badge tone="accent">{book.badge}</Badge>}
          {book.isNew && <Badge tone="primary">{t('new')}</Badge>}
          {!book.inStock && <Badge tone="dark">{t('outOfStock')}</Badge>}
        </div>

        <motion.button
          onClick={() => toggle(book.id)}
          whileTap={{ scale: 0.85 }}
          className={clsx(
            'absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full backdrop-blur shadow-soft transition-colors',
            wished ? 'bg-danger text-white' : 'bg-white/90 text-ink-soft hover:text-danger',
          )}
          aria-label={t('toggleWishlist')}
        >
          <Heart size={16} className={clsx(wished && 'fill-current')} />
        </motion.button>

        <motion.div
          className="absolute inset-x-3 bottom-3 flex gap-2 opacity-0 translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0"
        >
          <button
            onClick={() => addItem(book)}
            disabled={!book.inStock}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-ink py-2.5 text-xs font-semibold text-white shadow-lifted transition-colors hover:bg-primary disabled:opacity-50"
          >
            <ShoppingBag size={14} /> {t('addToCart')}
          </button>
          <button
            onClick={() => onQuickView?.(book)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-ink shadow-lifted transition-colors hover:text-primary"
            aria-label={t('quickView')}
          >
            <Eye size={16} />
          </button>
        </motion.div>
      </div>

      <div className="mt-4 flex flex-1 flex-col gap-1.5 rounded-xl bg-white px-3 py-3 shadow-soft">
        <span className="text-xs font-medium uppercase tracking-wide text-primary">{book.category}</span>
        <Link to={`/book/${book.id}`} className="line-clamp-2 font-heading text-[15px] font-semibold text-ink hover:text-primary">
          {book.title}
        </Link>
        <span className="text-sm text-ink-muted">{book.author}</span>
        <div className="mt-1 flex items-baseline gap-2">
          <span className="font-heading text-lg font-bold text-ink">{formatPrice(book.price)}</span>
          {book.originalPrice && (
            <>
              <span className="text-sm text-ink-muted line-through">{formatPrice(book.originalPrice)}</span>
              <span className="text-xs font-semibold text-success">-{discount}%</span>
            </>
          )}
        </div>
      </div>
    </motion.div>
  )
}
