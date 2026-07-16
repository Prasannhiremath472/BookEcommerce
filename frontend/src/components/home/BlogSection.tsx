import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { books } from '@/data/books'
import { SectionHeading } from './SectionHeading'
import { useLanguage } from '@/context/LanguageContext'

const spotlight = books.filter((b) => b.isBestseller).slice(0, 3)

export function BlogSection() {
  const { t } = useLanguage()
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="container-app">
        <SectionHeading eyebrow={t('spotlightEyebrow')} title={t('spotlightTitle')} cta={t('browseShop')} ctaTo="/shop" />
        <div className="grid gap-8 md:grid-cols-3">
          {spotlight.map((book, i) => (
            <motion.article
              key={book.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group"
            >
              <Link to={`/book/${book.id}`} className="mb-4 block overflow-hidden rounded-2xl bg-ink/5">
                <img
                  src={book.cover}
                  alt={book.title}
                  className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </Link>
              <span className="text-xs font-semibold uppercase tracking-wide text-primary">{book.category}</span>
              <Link to={`/book/${book.id}`}>
                <h3 className="mt-2 font-heading text-lg font-semibold leading-snug text-ink group-hover:text-primary">
                  {book.title}
                </h3>
              </Link>
              <p className="mt-2 line-clamp-2 text-sm text-ink-muted">{book.description}</p>
              <div className="mt-4 flex items-center gap-2 text-xs text-ink-muted">
                <span>{book.author}</span>
                <span>·</span>
                <span>{book.language}</span>
                <span>·</span>
                <span>{book.pages} {t('specPages').toLowerCase()}</span>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
