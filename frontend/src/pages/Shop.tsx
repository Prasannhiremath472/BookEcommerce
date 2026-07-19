import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { LayoutGrid, List, SlidersHorizontal, X } from 'lucide-react'
import { useBooks } from '@/hooks/useBooks'
import { useCatalog } from '@/context/CatalogContext'
import { BookCard } from '@/components/book/BookCard'
import { BookListItem } from '@/components/book/BookListItem'
import { FilterSidebar, defaultFilters, type Filters } from '@/components/shop/FilterSidebar'
import { SkeletonCard } from '@/components/ui/SkeletonCard'
import { QuickViewModal } from '@/components/book/QuickViewModal'
import type { Book } from '@/data/types'
import { useLanguage } from '@/context/LanguageContext'

type SortKey = 'featured' | 'price-asc' | 'price-desc' | 'newest'
const PAGE_SIZE = 24

export function Shop() {
  const [searchParams] = useSearchParams()
  const { t } = useLanguage()
  const { categories } = useCatalog()
  const [filters, setFilters] = useState<Filters>(defaultFilters)
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [sort, setSort] = useState<SortKey>('featured')
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [quickViewBook, setQuickViewBook] = useState<Book | null>(null)

  useEffect(() => {
    const categorySlug = searchParams.get('category')
    if (categorySlug) {
      const cat = categories.find((c) => c.slug === categorySlug)
      if (cat) setFilters((f) => ({ ...f, categories: [cat.id] }))
    }
  }, [searchParams, categories])

  const filterLabel = searchParams.get('filter') as 'bestsellers' | 'new' | 'trending' | 'deals' | null

  useEffect(() => {
    setPage(1)
  }, [filters, sort, filterLabel])

  const { books: filtered, total, isLoading } = useBooks({
    page,
    pageSize: PAGE_SIZE,
    category: filters.categories[0],
    author: filters.authors[0],
    language: filters.languages[0],
    publisher: filters.publishers[0],
    format: filters.formats[0] as any,
    inStock: filters.inStockOnly || undefined,
    maxPrice: filters.maxPrice,
    filter: filterLabel ?? undefined,
    sort,
  })

  const pageTitle = filterLabel
    ? filterLabel.charAt(0).toUpperCase() + filterLabel.slice(1)
    : searchParams.get('category')
      ? categories.find((c) => c.slug === searchParams.get('category'))?.name
      : t('allBooks')

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  return (
    <div className="bg-surface pb-24 pt-32">
      <div className="container-app">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-primary">{t('shopEyebrow')}</p>
          <h1 className="mt-2 text-display-md font-heading font-bold text-ink">{pageTitle}</h1>
          <p className="mt-2 text-ink-muted">{total} {t('booksFound')}</p>
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
                <SlidersHorizontal size={16} /> {t('filters')}
              </button>

              <div className="ml-auto flex items-center gap-3">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortKey)}
                  className="rounded-full border border-ink/10 bg-white px-4 py-2 text-sm font-medium text-ink outline-none"
                >
                  <option value="featured">{t('sortFeatured')}</option>
                  <option value="price-asc">{t('sortPriceLowHigh')}</option>
                  <option value="price-desc">{t('sortPriceHighLow')}</option>
                  <option value="newest">{t('sortNewest')}</option>
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

            {isLoading ? (
              <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <SkeletonCard key={i} />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-ink/15 py-24 text-center">
                <p className="font-heading text-lg font-semibold text-ink">{t('noBooksMatch')}</p>
                <p className="mt-1 text-sm text-ink-muted">{t('tryAdjusting')}</p>
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

            {!isLoading && totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="rounded-full border border-ink/10 px-4 py-2 text-sm font-medium disabled:opacity-40"
                >
                  Prev
                </button>
                <span className="text-sm text-ink-muted">Page {page} of {totalPages}</span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="rounded-full border border-ink/10 px-4 py-2 text-sm font-medium disabled:opacity-40"
                >
                  Next
                </button>
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
                <h3 className="font-heading text-lg font-bold">{t('filters')}</h3>
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
