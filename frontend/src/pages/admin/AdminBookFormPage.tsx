import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useBook } from '@/hooks/useBook'
import { useCatalog } from '@/context/CatalogContext'
import { useAuth } from '@/context/AuthContext'
import { createBookAdmin, updateBookAdmin, ApiError } from '@/lib/api'

const emptyForm = {
  id: '',
  title: '',
  author: '',
  authorId: '',
  categoryId: '',
  cover: '',
  price: '',
  originalPrice: '',
  format: 'Paperback' as 'Hardcover' | 'Paperback' | 'eBook' | 'Audiobook',
  language: '',
  publisher: 'New Era Publishing House',
  inStock: true,
  stockCount: '',
  isBestseller: false,
  isNew: false,
  isTrending: false,
  badge: '',
  description: '',
  pages: '',
  publishedYear: String(new Date().getFullYear()),
  isbn: '',
}

export function AdminBookFormPage() {
  const { id } = useParams()
  const isEdit = !!id
  const navigate = useNavigate()
  const { token } = useAuth()
  const { categories, authors } = useCatalog()
  const { book, isLoading } = useBook(id)
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (book) {
      setForm({
        id: book.id,
        title: book.title,
        author: book.author,
        authorId: book.authorId ?? '',
        categoryId: book.categoryId ?? '',
        cover: book.cover,
        price: String(book.price),
        originalPrice: book.originalPrice ? String(book.originalPrice) : '',
        format: book.format,
        language: book.language,
        publisher: book.publisher,
        inStock: book.inStock,
        stockCount: book.stockCount ? String(book.stockCount) : '',
        isBestseller: !!book.isBestseller,
        isNew: !!book.isNew,
        isTrending: !!book.isTrending,
        badge: book.badge ?? '',
        description: book.description,
        pages: String(book.pages),
        publishedYear: String(book.publishedYear),
        isbn: book.isbn,
      })
    }
  }, [book])

  const set = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => setForm((f) => ({ ...f, [key]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) return
    setError(null)
    setSaving(true)
    try {
      const payload = {
        title: form.title,
        author: form.author,
        authorId: form.authorId || null,
        categoryId: form.categoryId || null,
        cover: form.cover,
        price: Number(form.price),
        originalPrice: form.originalPrice ? Number(form.originalPrice) : null,
        format: form.format,
        language: form.language,
        publisher: form.publisher,
        inStock: form.inStock,
        stockCount: form.stockCount ? Number(form.stockCount) : null,
        isBestseller: form.isBestseller,
        isNew: form.isNew,
        isTrending: form.isTrending,
        badge: form.badge || null,
        description: form.description,
        pages: Number(form.pages),
        publishedYear: Number(form.publishedYear),
        isbn: form.isbn,
      }
      if (isEdit) {
        await updateBookAdmin(token, id!, payload)
      } else {
        await createBookAdmin(token, { ...payload, id: form.id })
      }
      navigate('/admin/books')
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not save book.')
    } finally {
      setSaving(false)
    }
  }

  if (isEdit && isLoading) return <p className="text-sm text-ink-muted">Loading…</p>

  return (
    <div>
      <h2 className="mb-5 font-heading text-lg font-bold text-ink">{isEdit ? 'Edit Book' : 'Add Book'}</h2>
      <form onSubmit={handleSubmit} className="grid gap-4 rounded-2xl border border-ink/8 bg-white p-6 sm:grid-cols-2">
        {!isEdit && (
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-semibold text-ink-soft">Book ID (e.g. bk-157)</label>
            <input required value={form.id} onChange={(e) => set('id', e.target.value)} className="w-full rounded-xl border border-ink/10 px-4 py-2.5 text-sm outline-none focus:border-primary" />
          </div>
        )}
        <div className="sm:col-span-2">
          <label className="mb-1 block text-xs font-semibold text-ink-soft">Title</label>
          <input required value={form.title} onChange={(e) => set('title', e.target.value)} className="w-full rounded-xl border border-ink/10 px-4 py-2.5 text-sm outline-none focus:border-primary" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-ink-soft">Author name</label>
          <input required value={form.author} onChange={(e) => set('author', e.target.value)} className="w-full rounded-xl border border-ink/10 px-4 py-2.5 text-sm outline-none focus:border-primary" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-ink-soft">Author (link)</label>
          <select value={form.authorId} onChange={(e) => set('authorId', e.target.value)} className="w-full rounded-xl border border-ink/10 px-4 py-2.5 text-sm outline-none focus:border-primary">
            <option value="">— None —</option>
            {authors.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-ink-soft">Category</label>
          <select value={form.categoryId} onChange={(e) => set('categoryId', e.target.value)} className="w-full rounded-xl border border-ink/10 px-4 py-2.5 text-sm outline-none focus:border-primary">
            <option value="">— None —</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-ink-soft">Cover path (e.g. /covers/cover001.jpeg)</label>
          <input required value={form.cover} onChange={(e) => set('cover', e.target.value)} className="w-full rounded-xl border border-ink/10 px-4 py-2.5 text-sm outline-none focus:border-primary" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-ink-soft">Price (₹)</label>
          <input required type="number" min="0" value={form.price} onChange={(e) => set('price', e.target.value)} className="w-full rounded-xl border border-ink/10 px-4 py-2.5 text-sm outline-none focus:border-primary" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-ink-soft">Original price (₹, optional)</label>
          <input type="number" min="0" value={form.originalPrice} onChange={(e) => set('originalPrice', e.target.value)} className="w-full rounded-xl border border-ink/10 px-4 py-2.5 text-sm outline-none focus:border-primary" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-ink-soft">Format</label>
          <select value={form.format} onChange={(e) => set('format', e.target.value as typeof form.format)} className="w-full rounded-xl border border-ink/10 px-4 py-2.5 text-sm outline-none focus:border-primary">
            <option>Paperback</option>
            <option>Hardcover</option>
            <option>eBook</option>
            <option>Audiobook</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-ink-soft">Language</label>
          <input required value={form.language} onChange={(e) => set('language', e.target.value)} className="w-full rounded-xl border border-ink/10 px-4 py-2.5 text-sm outline-none focus:border-primary" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-ink-soft">Publisher</label>
          <input required value={form.publisher} onChange={(e) => set('publisher', e.target.value)} className="w-full rounded-xl border border-ink/10 px-4 py-2.5 text-sm outline-none focus:border-primary" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-ink-soft">Stock count</label>
          <input type="number" min="0" value={form.stockCount} onChange={(e) => set('stockCount', e.target.value)} className="w-full rounded-xl border border-ink/10 px-4 py-2.5 text-sm outline-none focus:border-primary" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-ink-soft">Pages</label>
          <input required type="number" min="1" value={form.pages} onChange={(e) => set('pages', e.target.value)} className="w-full rounded-xl border border-ink/10 px-4 py-2.5 text-sm outline-none focus:border-primary" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-ink-soft">Published year</label>
          <input required type="number" value={form.publishedYear} onChange={(e) => set('publishedYear', e.target.value)} className="w-full rounded-xl border border-ink/10 px-4 py-2.5 text-sm outline-none focus:border-primary" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-ink-soft">ISBN</label>
          <input required value={form.isbn} onChange={(e) => set('isbn', e.target.value)} className="w-full rounded-xl border border-ink/10 px-4 py-2.5 text-sm outline-none focus:border-primary" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-ink-soft">Badge (optional)</label>
          <input value={form.badge} onChange={(e) => set('badge', e.target.value)} className="w-full rounded-xl border border-ink/10 px-4 py-2.5 text-sm outline-none focus:border-primary" />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1 block text-xs font-semibold text-ink-soft">Description</label>
          <textarea required rows={4} value={form.description} onChange={(e) => set('description', e.target.value)} className="w-full rounded-xl border border-ink/10 px-4 py-2.5 text-sm outline-none focus:border-primary" />
        </div>
        <div className="flex flex-wrap gap-5 sm:col-span-2">
          <label className="flex items-center gap-2 text-sm text-ink-soft">
            <input type="checkbox" checked={form.inStock} onChange={(e) => set('inStock', e.target.checked)} /> In stock
          </label>
          <label className="flex items-center gap-2 text-sm text-ink-soft">
            <input type="checkbox" checked={form.isBestseller} onChange={(e) => set('isBestseller', e.target.checked)} /> Bestseller
          </label>
          <label className="flex items-center gap-2 text-sm text-ink-soft">
            <input type="checkbox" checked={form.isNew} onChange={(e) => set('isNew', e.target.checked)} /> New
          </label>
          <label className="flex items-center gap-2 text-sm text-ink-soft">
            <input type="checkbox" checked={form.isTrending} onChange={(e) => set('isTrending', e.target.checked)} /> Trending
          </label>
        </div>

        {error && <p className="text-sm text-danger sm:col-span-2">{error}</p>}

        <div className="flex gap-3 sm:col-span-2">
          <button type="submit" disabled={saving} className="rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-50">
            {saving ? 'Saving…' : 'Save Book'}
          </button>
          <button type="button" onClick={() => navigate('/admin/books')} className="rounded-xl border border-ink/10 px-6 py-2.5 text-sm font-semibold text-ink">
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
