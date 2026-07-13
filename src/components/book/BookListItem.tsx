import { motion } from 'framer-motion'
import { Heart, ShoppingBag } from 'lucide-react'
import { Link } from 'react-router-dom'
import clsx from 'clsx'
import type { Book } from '@/data/types'
import { Badge } from '@/components/ui/Badge'
import { formatPrice, discountPercent } from '@/lib/utils'
import { useCart } from '@/context/CartContext'
import { useWishlist } from '@/context/WishlistContext'

export function BookListItem({ book }: { book: Book }) {
  const { addItem } = useCart()
  const { toggle, has } = useWishlist()
  const wished = has(book.id)
  const discount = discountPercent(book.price, book.originalPrice)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4 }}
      className="flex gap-5 rounded-2xl border border-ink/5 bg-white p-4 shadow-soft transition-shadow hover:shadow-card sm:p-5"
    >
      <Link to={`/book/${book.id}`} className="block w-24 flex-shrink-0 overflow-hidden rounded-xl bg-ink/5 sm:w-32">
        <img src={book.cover} alt={book.title} className="aspect-[3/4] h-full w-full object-cover" />
      </Link>

      <div className="flex flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className="text-xs font-medium uppercase tracking-wide text-primary">{book.category}</span>
            <Link to={`/book/${book.id}`} className="mt-1 block font-heading text-base font-semibold text-ink hover:text-primary sm:text-lg">
              {book.title}
            </Link>
            <span className="text-sm text-ink-muted">{book.author}</span>
          </div>
          <div className="flex gap-1.5">
            {book.badge && <Badge tone="accent">{book.badge}</Badge>}
            {!book.inStock && <Badge tone="dark">Out of Stock</Badge>}
          </div>
        </div>

        <p className="mt-2 hidden max-w-lg text-sm text-ink-muted sm:line-clamp-2">{book.description}</p>

        <div className="mt-auto flex items-center justify-between pt-3">
          <div className="flex items-baseline gap-2">
            <span className="font-heading text-lg font-bold text-ink">{formatPrice(book.price)}</span>
            {book.originalPrice && (
              <>
                <span className="text-sm text-ink-muted line-through">{formatPrice(book.originalPrice)}</span>
                <span className="text-xs font-semibold text-success">-{discount}%</span>
              </>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => toggle(book.id)}
              className={clsx(
                'flex h-9 w-9 items-center justify-center rounded-full border transition-colors',
                wished ? 'border-danger bg-danger text-white' : 'border-ink/10 text-ink-soft hover:text-danger',
              )}
            >
              <Heart size={15} className={clsx(wished && 'fill-current')} />
            </button>
            <button
              onClick={() => addItem(book)}
              disabled={!book.inStock}
              className="flex items-center gap-1.5 rounded-full bg-ink px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-primary disabled:opacity-50"
            >
              <ShoppingBag size={14} /> Add to Cart
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
