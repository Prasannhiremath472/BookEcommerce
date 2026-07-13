import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  cta,
  ctaTo,
}: {
  eyebrow?: string
  title: string
  subtitle?: string
  cta?: string
  ctaTo?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="mb-10 flex flex-wrap items-end justify-between gap-4"
    >
      <div>
        {eyebrow && <p className="mb-2 text-xs font-bold uppercase tracking-widest text-primary">{eyebrow}</p>}
        <h2 className="text-display-md font-heading font-bold text-ink">{title}</h2>
        {subtitle && <p className="mt-2 max-w-lg text-ink-muted">{subtitle}</p>}
      </div>
      {cta && ctaTo && (
        <Link to={ctaTo} className="group flex items-center gap-1.5 text-sm font-semibold text-primary">
          {cta}
          <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
        </Link>
      )}
    </motion.div>
  )
}
