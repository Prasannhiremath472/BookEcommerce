import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Zap, ChevronDown, ChevronUp } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getDeals, withFeaturedFirst } from '@/data/books'
import { BookCard } from '@/components/book/BookCard'
import { Button } from '@/components/ui/Button'
import { useLanguage } from '@/context/LanguageContext'

const INITIAL_COUNT = 8

function useCountdown(hours: number) {
  const [remaining, setRemaining] = useState(hours * 3600)
  useEffect(() => {
    const id = setInterval(() => setRemaining((r) => (r > 0 ? r - 1 : 0)), 1000)
    return () => clearInterval(id)
  }, [])
  const h = Math.floor(remaining / 3600)
  const m = Math.floor((remaining % 3600) / 60)
  const s = remaining % 60
  return { h, m, s }
}

export function FlashSale() {
  const { h, m, s } = useCountdown(11)
  const deals = withFeaturedFirst(getDeals())
  const { t } = useLanguage()
  const [expanded, setExpanded] = useState(false)
  const visibleDeals = expanded ? deals : deals.slice(0, INITIAL_COUNT)
  const hasMore = deals.length > INITIAL_COUNT

  return (
    <section className="relative overflow-hidden bg-gradient-primary py-16 sm:py-20">
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
      <div className="container-app relative">
        <div className="mb-10 flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-white">
              <Zap size={22} fill="currentColor" />
            </div>
            <div>
              <h2 className="font-heading text-2xl font-bold text-white sm:text-3xl">{t('flashSaleTitle')}</h2>
              <p className="text-sm text-white/70">{t('flashSaleSubtitle')}</p>
            </div>
          </div>

          <div className="flex gap-2">
            {[
              ['H', h],
              ['M', m],
              ['S', s],
            ].map(([label, value]) => (
              <motion.div
                key={label as string}
                className="flex h-16 w-16 flex-col items-center justify-center rounded-xl bg-white/15 backdrop-blur"
              >
                <span className="font-heading text-xl font-bold text-white">{String(value).padStart(2, '0')}</span>
                <span className="text-[10px] text-white/60">{label}</span>
              </motion.div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
          <AnimatePresence initial={false}>
            {visibleDeals.map((book) => (
              <motion.div
                key={book.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <BookCard book={book} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          {hasMore && (
            <Button
              size="lg"
              variant="ghost"
              className="text-white hover:bg-white/10"
              onClick={() => setExpanded((e) => !e)}
            >
              {expanded ? t('showLess') : t('showMore')}
              {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </Button>
          )}
          <Link to="/shop?filter=deals">
            <Button size="lg" className="!bg-none !bg-white !text-primary hover:!bg-white/90">
              {t('viewAllDeals')}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
