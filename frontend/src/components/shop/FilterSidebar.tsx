import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, X } from 'lucide-react'
import { categories } from '@/data/categories'
import { authors } from '@/data/authors'
import { formatPrice } from '@/lib/utils'
import { useLanguage } from '@/context/LanguageContext'

export interface Filters {
  categories: string[]
  authors: string[]
  languages: string[]
  publishers: string[]
  formats: string[]
  maxPrice: number
  inStockOnly: boolean
}

export const defaultFilters: Filters = {
  categories: [],
  authors: [],
  languages: [],
  publishers: [],
  formats: [],
  maxPrice: 500,
  inStockOnly: false,
}

const languages = ['Marathi', 'Hindi', 'English']
const publishers = ['New Era Publishing House']
const formats = ['Paperback']

function FilterGroup({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b border-ink/8 py-5">
      <button onClick={() => setOpen((o) => !o)} className="flex w-full items-center justify-between text-left">
        <span className="font-heading text-sm font-semibold text-ink">{title}</span>
        <ChevronDown size={16} className={`text-ink-muted transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="pt-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function Checkbox({ label, checked, onChange, count }: { label: string; checked: boolean; onChange: () => void; count?: number }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-2 py-1.5 text-sm text-ink-soft">
      <span className="flex items-center gap-2.5">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          className="h-4 w-4 rounded border-ink/20 text-primary accent-primary"
        />
        {label}
      </span>
      {count !== undefined && <span className="text-xs text-ink-muted">{count}</span>}
    </label>
  )
}

export function FilterSidebar({ filters, setFilters }: { filters: Filters; setFilters: (f: Filters) => void }) {
  const { t } = useLanguage()
  const toggleArr = (key: 'categories' | 'authors' | 'languages' | 'publishers' | 'formats', value: string) => {
    const arr = filters[key]
    setFilters({
      ...filters,
      [key]: arr.includes(value) ? arr.filter((v) => v !== value) : [...arr, value],
    })
  }

  const activeCount =
    filters.categories.length +
    filters.authors.length +
    filters.languages.length +
    filters.publishers.length +
    filters.formats.length +
    (filters.inStockOnly ? 1 : 0)

  return (
    <aside className="w-full lg:w-64 lg:flex-shrink-0">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="font-heading text-lg font-bold text-ink">{t('filters')}</h3>
        {activeCount > 0 && (
          <button
            onClick={() => setFilters(defaultFilters)}
            className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
          >
            <X size={12} /> {t('clear')} ({activeCount})
          </button>
        )}
      </div>

      <FilterGroup title={t('priceRange')}>
        <input
          type="range"
          min={50}
          max={500}
          step={10}
          value={filters.maxPrice}
          onChange={(e) => setFilters({ ...filters, maxPrice: Number(e.target.value) })}
          className="w-full accent-primary"
        />
        <div className="mt-2 flex justify-between text-xs text-ink-muted">
          <span>₹0</span>
          <span className="font-semibold text-ink">{t('upTo')} {formatPrice(filters.maxPrice)}</span>
        </div>
      </FilterGroup>

      <FilterGroup title={t('category')}>
        {categories.map((c) => (
          <Checkbox
            key={c.id}
            label={c.name}
            checked={filters.categories.includes(c.id)}
            onChange={() => toggleArr('categories', c.id)}
            count={c.bookCount}
          />
        ))}
      </FilterGroup>

      <FilterGroup title={t('author')} defaultOpen={false}>
        {authors.map((a) => (
          <Checkbox key={a.id} label={a.name} checked={filters.authors.includes(a.id)} onChange={() => toggleArr('authors', a.id)} />
        ))}
      </FilterGroup>

      <FilterGroup title={t('format')} defaultOpen={false}>
        {formats.map((f) => (
          <Checkbox key={f} label={f} checked={filters.formats.includes(f)} onChange={() => toggleArr('formats', f)} />
        ))}
      </FilterGroup>

      <FilterGroup title={t('language')} defaultOpen={false}>
        {languages.map((l) => (
          <Checkbox key={l} label={l} checked={filters.languages.includes(l)} onChange={() => toggleArr('languages', l)} />
        ))}
      </FilterGroup>

      <FilterGroup title={t('publisher')} defaultOpen={false}>
        {publishers.map((p) => (
          <Checkbox key={p} label={p} checked={filters.publishers.includes(p)} onChange={() => toggleArr('publishers', p)} />
        ))}
      </FilterGroup>

      <FilterGroup title={t('availability')}>
        <Checkbox label={t('inStockOnly')} checked={filters.inStockOnly} onChange={() => setFilters({ ...filters, inStockOnly: !filters.inStockOnly })} />
      </FilterGroup>
    </aside>
  )
}
