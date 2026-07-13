import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { books } from '@/data/books'
import { formatPrice } from '@/lib/utils'
import { useLanguage } from '@/context/LanguageContext'

export function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [query, setQuery] = useState('')
  const { t } = useLanguage()

  useEffect(() => {
    if (!open) setQuery('')
  }, [open])

  const results = useMemo(() => {
    if (!query.trim()) return []
    const q = query.toLowerCase()
    return books.filter((b) => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q)).slice(0, 6)
  }, [query])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] flex items-start justify-center bg-ink/50 backdrop-blur-sm pt-24 sm:pt-32"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: -24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -24, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-xl px-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="overflow-hidden rounded-2xl bg-white shadow-lifted">
              <div className="flex items-center gap-3 border-b border-ink/10 px-5 py-4">
                <Search size={20} className="text-ink-muted" />
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={t('searchPlaceholder')}
                  className="flex-1 bg-transparent text-base outline-none placeholder:text-ink-muted"
                />
                <button onClick={onClose} className="text-ink-muted hover:text-ink">
                  <X size={20} />
                </button>
              </div>
              {results.length > 0 && (
                <div className="max-h-96 overflow-y-auto p-2">
                  {results.map((b) => (
                    <Link
                      key={b.id}
                      to={`/book/${b.id}`}
                      onClick={onClose}
                      className="flex items-center gap-3 rounded-xl p-2.5 hover:bg-primary-50"
                    >
                      <img src={b.cover} alt="" className="h-14 w-10 rounded object-cover" />
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-ink">{b.title}</p>
                        <p className="text-xs text-ink-muted">{b.author}</p>
                      </div>
                      <span className="text-sm font-semibold text-ink">{formatPrice(b.price)}</span>
                    </Link>
                  ))}
                </div>
              )}
              {query && results.length === 0 && (
                <p className="p-6 text-center text-sm text-ink-muted">{t('noResultsFor')} "{query}"</p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
