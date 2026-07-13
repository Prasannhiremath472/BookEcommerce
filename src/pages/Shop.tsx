import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { LayoutGrid, List, SlidersHorizontal, X } from 'lucide-react'
import { books } from '@/data/books'
import { categories } from '@/data/categories'
import { BookCard } from '@/components/book/BookCard'
import { BookListItem } from '@/components/book/BookListItem'
import { FilterSidebar, defaultFilters, type Filters } from '@/components/shop/FilterSidebar'
import { SkeletonCard } from '@/components/ui/SkeletonCard'
import { QuickViewModal } from '@/components/book/QuickViewModal'
import type { Book } from '@/data/types'

type SortKey = 'featured' | 'price-asc' | 'price-desc' | 'newest'

export function Shop() {
  const [searchParams] = useSearchParams()
  const [filters, setFilters] = useState<Filters>(defaultFilters)
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [sort, setSort] = useState<SortKey>('featured')
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [quickViewBook, setQuickViewBook] = useState<Book | null>(null)

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    const categorySlug = searchParams.get('category')
    if (categorySlug) {
      const cat = categories.find((c) => c.slug === categorySlug)
      if (cat) setFilters((f) => ({ ...f, categories: [cat.id] }))
    }
  }, [searchParams])

  const filterLabel = searchParams.get('filter')

  const filtered = useMemo(() => {
    let result = books.slice()

    if (filterLabel === 'bestsellers') result = result.filter((b) => b.isBestseller)
    if (filterLabel === 'new') result = result.filter((b) => b.isNew)
    if (filterLabel === 'trending') result = result.filter((b) => b.isTrending)
    if (filterLabel === 'deals') result = result.filter((b) => b.originalPrice)

    if (filters.categories.length) result = result.filter((b) => filters.categories.includes(b.categoryId))
    if (filters.authors.length) result = result.filter((b) => filters.authors.includes(b.authorId))
    if (filters.languages.length) result = result.filter((b) => filters.languages.includes(b.language))
    if (filters.publishers.length) result = result.filter((b) => filters.publishers.includes(b.publisher))
    if (filters.formats.length) result = result.filter((b) => filters.formats.includes(b.format))
    if (filters.inStockOnly) result = result.filter((b) => b.inStock)
    result = result.filter((b) => b.price <= filters.maxPrice)

    switch (sort) {
      case 'price-asc':
        result.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        result.sort((a, b) => b.price - a.price)
        break
      case 'newest':
        result.sort((a, b) => b.publishedYear - a.publishedYear)
        break
    }

    return result
  }, [filters, sort, filterLabel])

  const pageTitle = filterLabel
    ? filterLabel.charAt(0).toUpperCase() + filterLabel.slice(1)
    : searchParams.get('category')
      ? categories.find((c) => c.slug === searchParams.get('category'))?.name
      : 'All Books'

  return (
    <div className="bg-surface pb-24 pt-32">
      <div className="container-app">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">Shop</p>
          <h1 className="mt-2 text-display-md font-heading font-bold text-ink">{pageTitle}</h1>
          <p className="mt-2 text-ink-muted">{filtered.length} books found</p>
        </motion.div>

        <div className="flex gap-10">
          <div className="hidden lg:block">
            <FilterSidebar filters={filters} setFilters={setFilters} />
          </div>

          <div className="flex-1">
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-ink/5 bg-white px-4 py-3 shadow-soft">
              <button
                onClick={() => setMobileFiltersOpen(true)}
                className="flex items-center gap-2 text-sm font-semibold text-ink lg:hidden"
              >
                <SlidersHorizontal size={16} /> Filters
              </button>

              <div className="ml-auto flex items-center gap-3">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortKey)}
                  className="rounded-full border border-ink/10 bg-white px-4 py-2 text-sm font-medium text-ink outline-none"
                >
                  <option value="featured">Featured</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="newest">Newest</option>
                </select>

                <div className="flex items-center rounded-full border border-ink/10 p-1">
                  <button
                    onClick={() => setView('grid')}
                    className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${view === 'grid' ? 'bg-ink text-white' : 'text-ink-muted'}`}
                  >
                    <LayoutGrid size={15} />
                  </button>
                  <button
                    onClick={() => setView('list')}
                    className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${view === 'list' ? 'bg-ink text-white' : 'text-ink-muted'}`}
                  >
                    <List size={15} />
                  </button>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-ink/15 py-24 text-center">
                <p className="font-heading text-lg font-semibold text-ink">No books match your filters</p>
                <p className="mt-1 text-sm text-ink-muted">Try adjusting or clearing your filters.</p>
              </div>
            ) : view === 'grid' ? (
              <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 xl:grid-cols-4">
                {filtered.map((book) => (
                  <BookCard key={book.id} book={book} onQuickView={setQuickViewBook} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {filtered.map((book) => (
                  <BookListItem key={book.id} book={book} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileFiltersOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] bg-ink/40 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileFiltersOpen(false)}
          >
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 260 }}
              className="flex h-full w-80 flex-col overflow-y-auto bg-white p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-heading text-lg font-bold">Filters</h3>
                <button onClick={() => setMobileFiltersOpen(false)}>
                  <X size={20} />
                </button>
              </div>
              <FilterSidebar filters={filters} setFilters={setFilters} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <QuickViewModal book={quickViewBook} onClose={() => setQuickViewBook(null)} />
    </div>
  )
}
