import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, Package, Users } from 'lucide-react'
import { fetchCatalogStats } from '@/lib/api'

export function AdminDashboardPage() {
  const [stats, setStats] = useState<{ totalBooks: number; totalAuthors: number; totalLanguages: number } | null>(null)

  useEffect(() => {
    fetchCatalogStats().then(setStats).catch(() => {})
  }, [])

  return (
    <div>
      <h2 className="mb-5 font-heading text-lg font-bold text-ink">Overview</h2>
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-ink/8 bg-white p-5">
          <BookOpen className="mb-2 text-primary" size={20} />
          <p className="font-heading text-2xl font-bold text-ink">{stats?.totalBooks ?? '—'}</p>
          <p className="text-sm text-ink-muted">Total Books</p>
        </div>
        <div className="rounded-2xl border border-ink/8 bg-white p-5">
          <Users className="mb-2 text-primary" size={20} />
          <p className="font-heading text-2xl font-bold text-ink">{stats?.totalAuthors ?? '—'}</p>
          <p className="text-sm text-ink-muted">Total Authors</p>
        </div>
        <div className="rounded-2xl border border-ink/8 bg-white p-5">
          <Package className="mb-2 text-primary" size={20} />
          <Link to="/admin/orders" className="font-heading text-2xl font-bold text-ink hover:text-primary">
            View Orders →
          </Link>
          <p className="text-sm text-ink-muted">Manage recent orders</p>
        </div>
      </div>
      <div className="mt-6 flex gap-3">
        <Link to="/admin/books/new" className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white">
          + Add Book
        </Link>
        <Link to="/admin/books" className="rounded-xl border border-ink/10 px-4 py-2 text-sm font-semibold text-ink">
          Manage Books
        </Link>
      </div>
    </div>
  )
}
