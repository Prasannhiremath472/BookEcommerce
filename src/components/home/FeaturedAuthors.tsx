import { motion } from 'framer-motion'
import { authors } from '@/data/authors'
import { SectionHeading } from './SectionHeading'
import { useLanguage } from '@/context/LanguageContext'

export function FeaturedAuthors() {
  const { t } = useLanguage()
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="container-app">
        <SectionHeading eyebrow={t('authorsEyebrow')} title={t('authorsTitle')} subtitle={t('authorsSubtitle')} />
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-6">
          {authors.map((a, i) => (
            <motion.div
              key={a.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className="group flex flex-col items-center text-center"
            >
              <div className="relative mb-4 h-24 w-24 overflow-hidden rounded-full ring-4 ring-primary-50 transition-transform group-hover:scale-105">
                <img src={a.photo} alt={a.name} className="h-full w-full object-cover" />
              </div>
              <p className="font-heading text-sm font-semibold text-ink">{a.name}</p>
              <p className="text-xs text-ink-muted">{a.bookCount} {t('booksSuffix')}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
