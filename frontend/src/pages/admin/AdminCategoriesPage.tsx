import { useState } from 'react'
import { Pencil, Trash2, Plus } from 'lucide-react'
import { useCatalog } from '@/context/CatalogContext'
import { useAuth } from '@/context/AuthContext'
import { createCategoryAdmin, updateCategoryAdmin, deleteCategoryAdmin, ApiError } from '@/lib/api'
import type { Category } from '@/data/types'

const emptyForm = { id: '', name: '', slug: '', image: '', description: '' }

export function AdminCategoriesPage() {
  const { categories, isLoading } = useCatalog()
  const { token } = useAuth()
  const [form, setForm] = useState(emptyForm)
  const [editing, setEditing] = useState<Category | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const startCreate = () => { setForm(emptyForm); setEditing(null); setShowForm(true) }
  const startEdit = (c: Category) => {
    setForm({ id: c.id, name: c.name, slug: c.slug, image: c.image ?? '', description: c.description ?? '' })
    setEditing(c)
    setShowForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) return
    setError(null)
    setSaving(true)
    try {
      const payload = { name: form.name, slug: form.slug, image: form.image || null, description: form.description || null }
      if (editing) {
        await updateCategoryAdmin(token, editing.id, payload)
      } else {
        await createCategoryAdmin(token, { ...payload, id: form.id })
      }
      window.location.reload()
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Could not save category.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (c: Category) => {
    if (!token) return
    if (!confirm(`Delete category "${c.name}"?`)) return
    try {
      await deleteCategoryAdmin(token, c.id)
      window.location.reload()
    } catch (err) {
      alert(err instanceof ApiError ? err.message : 'Could not delete category.')
    }
  }

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h2 className="font-heading text-lg font-bold text-ink">Categories ({categories.length})</h2>
        <button onClick={startCreate} className="flex items-center gap-1 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white">
          <Plus size={16} /> Add Category
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-6 grid gap-4 rounded-2xl border border-ink/8 bg-white p-6 sm:grid-cols-2">
          {!editing && (
            <div>
              <label className="mb-1 block text-xs font-semibold text-ink-soft">ID (e.g. novel)</label>
              <input required value={form.id} onChange={(e) => setForm((f) => ({ ...f, id: e.target.value }))} className="w-full rounded-xl border border-ink/10 px-4 py-2.5 text-sm outline-none focus:border-primary" />
            </div>
          )}
          <div>
            <label className="mb-1 block text-xs font-semibold text-ink-soft">Name</label>
            <input required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="w-full rounded-xl border border-ink/10 px-4 py-2.5 text-sm outline-none focus:border-primary" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-ink-soft">Slug</label>
            <input required value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} className="w-full rounded-xl border border-ink/10 px-4 py-2.5 text-sm outline-none focus:border-primary" />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-ink-soft">Image path (optional)</label>
            <input value={form.image} onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))} className="w-full rounded-xl border border-ink/10 px-4 py-2.5 text-sm outline-none focus:border-primary" />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-semibold text-ink-soft">Description</label>
            <textarea rows={2} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} className="w-full rounded-xl border border-ink/10 px-4 py-2.5 text-sm outline-none focus:border-primary" />
          </div>
          {error && <p className="text-sm text-danger sm:col-span-2">{error}</p>}
          <div className="flex gap-3 sm:col-span-2">
            <button type="submit" disabled={saving} className="rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-50">
              {saving ? 'Saving…' : 'Save'}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="rounded-xl border border-ink/10 px-6 py-2.5 text-sm font-semibold text-ink">
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto rounded-2xl border border-ink/8 bg-white">
        {isLoading ? (
          <p className="p-6 text-sm text-ink-muted">Loading…</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-ink/8 text-xs uppercase text-ink-muted">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Slug</th>
                <th className="px-4 py-3">Books</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {categories.map((c) => (
                <tr key={c.id} className="border-b border-ink/5 last:border-0">
                  <td className="px-4 py-3 font-medium text-ink">{c.name}</td>
                  <td className="px-4 py-3 text-ink-soft">{c.slug}</td>
                  <td className="px-4 py-3 text-ink-soft">{c.bookCount}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => startEdit(c)} className="rounded-lg p-2 text-ink-soft hover:bg-ink/5">
                        <Pencil size={16} />
                      </button>
                      <button onClick={() => handleDelete(c)} className="rounded-lg p-2 text-danger hover:bg-danger/5">
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
    </div>
  )
}
