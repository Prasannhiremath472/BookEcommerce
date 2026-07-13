import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Quote } from 'lucide-react'
import { books } from '@/data/books'
import { SectionHeading } from './SectionHeading'

const picks = books.filter((b) => b.isBestseller).slice(0, 3)

export function Testimonials() {
  return (
    <section className="container-app py-16 sm:py-20">
      <SectionHeading eyebrow="Editor's Picks" title="Books Our Editors Can't Stop Talking About" subtitle="Straight from the catalog blurbs." />
      <div className="grid gap-6 md:grid-cols-3">
        {picks.map((b, i) => (
          <motion.div
            key={b.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="relative rounded-2xl border border-ink/5 bg-white p-8 shadow-soft"
          >
            <Quote className="mb-4 text-primary-200" size={32} />
            <p className="mb-6 line-clamp-5 text-sm leading-relaxed text-ink-soft">"{b.description}"</p>
            <Link to={`/book/${b.id}`} className="mt-5 flex items-center gap-3">
              <img src={b.cover} alt={b.title} className="h-14 w-10 rounded object-cover shadow-soft" />
              <div>
                <p className="text-sm font-semibold text-ink hover:text-primary">{b.title}</p>
                <p className="text-xs text-ink-muted">{b.author}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
