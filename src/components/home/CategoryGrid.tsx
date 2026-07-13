import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { categories } from '@/data/categories'
import { SectionHeading } from './SectionHeading'

export function CategoryGrid() {
  return (
    <section className="container-app py-16 sm:py-20">
      <SectionHeading eyebrow="Browse" title="Featured Categories" subtitle="Find your next favorite genre." />
      <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
        {categories.map((c, i) => (
          <motion.div
            key={c.id}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: i * 0.05 }}
          >
            <Link to={`/shop?category=${c.slug}`} className="group relative block overflow-hidden rounded-2xl">
              <div className="aspect-square overflow-hidden">
                <img
                  src={c.image}
                  alt={c.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-4">
                <p className="font-heading text-lg font-bold text-white">{c.name}</p>
                <p className="text-xs text-white/70">{c.bookCount.toLocaleString()} books</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
