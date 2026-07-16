import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { books } from '@/data/books'
import { useLanguage } from '@/context/LanguageContext'

const featuredBook = books.find((b) => b.id === 'bk-156')
const heroBooks = featuredBook
  ? [books[0], featuredBook, books[2]].filter(Boolean)
  : books.slice(0, 3)
const languageCount = new Set(books.map((b) => b.language)).size
const authorCount = new Set(books.map((b) => b.authorId)).size

export function Hero() {
  const { t } = useLanguage()
  return (
    <section className="relative overflow-hidden bg-gradient-dark pb-24 pt-40 sm:pb-32 sm:pt-48">
      <div className="pointer-events-none absolute inset-0 bg-gradient-radial-soft" />
      <div className="pointer-events-none absolute -left-40 top-20 h-96 w-96 rounded-full bg-primary/30 blur-[100px]" />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-secondary/30 blur-[100px]" />

      <div className="container-app relative grid items-center gap-16 lg:grid-cols-2">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-display-lg font-heading font-bold text-white"
          >
            {t('heroTitleLine1')}
            <br />
            <span className="bg-gradient-to-r from-primary-300 via-secondary-300 to-accent-300 bg-clip-text text-transparent">
              {t('heroTitleLine2')}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-6 max-w-md text-lg text-white/70"
          >
            {t('heroSubtitle')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-9 flex flex-wrap gap-4"
          >
            <Link to="/shop">
              <Button size="lg">
                {t('shopCollection')} <ArrowRight size={18} />
              </Button>
            </Link>
            <Link to="/shop?filter=bestsellers">
              <Button size="lg" variant="ghost" className="text-white hover:bg-white/10">
                {t('exploreBestsellers')}
              </Button>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.5 }}
            className="mt-14 flex gap-10"
          >
            {[
              [`${books.length}+`, t('statTitles')],
              [`${authorCount}+`, t('statAuthors')],
              [`${languageCount}`, t('statLanguages')],
            ].map(([stat, label]) => (
              <div key={label}>
                <p className="font-heading text-3xl font-bold text-white">{stat}</p>
                <p className="text-sm text-white/50">{label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        <div className="relative hidden h-[520px] items-center justify-center lg:flex">
          {heroBooks.map((book, i) => (
            <motion.div
              key={book.id}
              initial={{ opacity: 0, y: 60, rotate: -6 + i * 6 }}
              animate={{ opacity: 1, y: 0, rotate: -6 + i * 6 }}
              transition={{ duration: 0.8, delay: 0.2 + i * 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="absolute w-56 animate-float"
              style={{
                left: `${i * 22}%`,
                zIndex: i === 1 ? 10 : 5 - i,
                animationDelay: `${i * 0.8}s`,
              }}
            >
              {i === 1 && book.id === 'bk-156' && (
                <span className="absolute -top-3 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-full bg-gradient-accent px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white shadow-lifted">
                  {t('mostSelling')}
                </span>
              )}
              <Link to={`/book/${book.id}`}>
                <img
                  src={book.cover}
                  alt={book.title}
                  className="w-full rounded-xl shadow-lifted ring-1 ring-white/10"
                />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
