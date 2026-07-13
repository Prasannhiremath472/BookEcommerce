import { Link } from 'react-router-dom'
import { Star } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export function MyReviewsPage() {
  return (
    <div>
      <h2 className="mb-5 font-heading text-lg font-bold text-ink">My Reviews</h2>
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-ink/15 py-24 text-center">
        <Star size={40} className="text-ink/15" />
        <p className="mt-4 font-heading font-semibold text-ink">You haven't written any reviews yet</p>
        <p className="mt-1 text-sm text-ink-muted">Once you review a book, it'll show up here.</p>
        <Link to="/shop">
          <Button className="mt-6">Browse Books</Button>
        </Link>
      </div>
    </div>
  )
}
