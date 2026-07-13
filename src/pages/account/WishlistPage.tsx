import { Heart } from 'lucide-react'
import { Link } from 'react-router-dom'
import { books } from '@/data/books'
import { useWishlist } from '@/context/WishlistContext'
import { BookCard } from '@/components/book/BookCard'
import { Button } from '@/components/ui/Button'

export function WishlistPage() {
  const { ids } = useWishlist()
  const items = books.filter((b) => ids.has(b.id))

  return (
    <div>
      <h2 className="mb-5 font-heading text-lg font-bold text-ink">My Wishlist ({items.length})</h2>
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-ink/15 py-24 text-center">
          <Heart size={40} className="text-ink/15" />
          <p className="mt-4 font-heading font-semibold text-ink">Your wishlist is empty</p>
          <p className="mt-1 text-sm text-ink-muted">Save books you love to find them here later.</p>
          <Link to="/shop">
            <Button className="mt-5">Browse Books</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 xl:grid-cols-4">
          {items.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}
    </div>
  )
}
