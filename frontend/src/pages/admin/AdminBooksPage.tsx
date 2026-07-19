import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Pencil, Trash2, Plus, Loader2 } from 'lucide-react'
import { useBooks } from '@/hooks/useBooks'
import { useAuth } from '@/context/AuthContext'
import { deleteBookAdmin, importCatalogAdmin, ApiError } from '@/lib/api'
import { formatPrice } from '@/lib/utils'

const PAGE_SIZE = 20

export function AdminBooksPage() {
  const { token } = useAuth()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const { books, total, isLoading, error } = useBooks({ page, pageSize: PAGE_SIZE, search: search || undefined })
  const [actionError, setActionError] = useState<string | null>(null)
  const [importResult, setImportResult] = useState<string | null>(null)
  const [importing, setImporting] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  const handleDelete = async (id: string, title: string) => {
    if (!token) return
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return
    setActionError(null)
    try {
      await deleteBookAdmin(token, id)
      setRefreshKey((k) => k + 1)
      setPage(1)
    } catch (err) {
      setActionError(err instanceof ApiError ? err.message : 'Could not delete book.')
    }
  }

  const handleImport = async () => {
    if (!token) return
    setImporting(true)
    setImportResult(null)
    try {
      const result = await importCatalogAdmin(token)
      setImportResult(`Imported: ${result.categories} categories, ${result.authors} authors, ${result.books} books.`)
      setRefreshKey((k) => k + 1)
    } catch (err) {
      setImportResult(err instanceof ApiError ? `Import failed: ${err.message}` : 'Import failed.')
    } finally {
      setImporting(false)
    }
  }

  return (
    <div key={refreshKey}>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-heading text-lg font-bold text-ink">Books ({total})</h2>
        <div className="flex gap-2">
          <button
            onClick={handleImport}
            disabled={importing}
            className="rounded-xl border border-ink/10 px-4 py-2 text-sm font-semibold text-ink-soft disabled:opacity-50"
          >
            {importing ? 'Importing…' : 'Run Catalog Import'}
          </button>
          <Link to="/admin/books/new" className="flex items-center gap-1 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white">
            <Plus size={16} /> Add Book
          </Link>
        </div>
      </div>

      {importResult && <p className="mb-4 rounded-xl bg-primary-50 px-4 py-2 text-sm text-primary">{importResult}</p>}
      {actionError && <p className="mb-4 rounded-xl bg-danger/10 px-4 py-2 text-sm text-danger">{actionError}</p>}

      <input
        value={search}
        onChange={(e) => { setSearch(e.target.value); setPage(1) }}
        placeholder="Search by title or author…"
        className="mb-4 w-full max-w-sm rounded-xl border border-ink/10 px-4 py-2 text-sm outline-none focus:border-primary"
      />

      <div className="overflow-x-auto rounded-2xl border border-ink/8 bg-white">
        {isLoading ? (
          <div className="flex items-center justify-center gap-2 p-10 text-ink-muted">
            <Loader2 size={18} className="animate-spin" /> Loading…
          </div>
        ) : error ? (
          <p className="p-6 text-sm text-danger">{error}</p>
        ) : books.length === 0 ? (
          <p className="p-6 text-sm text-ink-muted">No books found.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-ink/8 text-xs uppercase text-ink-muted">
              <tr>
                <th className="px-4 py-3">Cover</th>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Author</th>
                <th className="px-4 py-3">Price</th>
                <th className="px-4 py-3">Stock</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book.id} className="border-b border-ink/5 last:border-0">
                  <td className="px-4 py-3">
                    <img src={book.cover} alt="" className="h-14 w-10 rounded object-cover" />
                  </td>
                  <td className="max-w-xs px-4 py-3">
                    <p className="line-clamp-1 font-medium text-ink">{book.title}</p>
                    <p className="text-xs text-ink-muted">{book.id}</p>
                  </td>
                  <td className="px-4 py-3 text-ink-soft">{book.author}</td>
                  <td className="px-4 py-3 text-ink-soft">{formatPrice(book.price)}</td>
                  <td className="px-4 py-3 text-ink-soft">{book.inStock ? (book.stockCount ?? 'In stock') : 'Out of stock'}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Link to={`/admin/books/${book.id}/edit`} className="rounded-lg p-2 text-ink-soft hover:bg-ink/5">
                        <Pencil size={16} />
                      </Link>
                      <button onClick={() => handleDelete(book.id, book.title)} className="rounded-lg p-2 text-danger hover:bg-danger/5">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="rounded-lg border border-ink/10 px-3 py-1.5 text-sm disabled:opacity-40"
          >
            Prev
          </button>
          <span className="text-sm text-ink-muted">Page {page} of {totalPages}</span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="rounded-lg border border-ink/10 px-3 py-1.5 text-sm disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
