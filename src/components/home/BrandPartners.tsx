import { publishers } from '@/data/testimonials'
import { useLanguage } from '@/context/LanguageContext'

export function BrandPartners() {
  const { t } = useLanguage()
  const loop = [...publishers, ...publishers]

  return (
    <section className="border-y border-ink/5 bg-white py-10">
      <p className="mb-6 text-center text-xs font-semibold uppercase tracking-widest text-ink-muted">
        {t('trustedBy')}
      </p>
      <div className="overflow-hidden">
        <div className="flex w-max animate-marquee gap-16">
          {loop.map((p, i) => (
            <span key={`${p.id}-${i}`} className="whitespace-nowrap font-heading text-xl font-bold text-ink/25">
              {p.name}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
