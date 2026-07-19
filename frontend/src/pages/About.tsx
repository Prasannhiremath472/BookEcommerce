import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { BookOpen, Mail, Phone, MapPin } from 'lucide-react'
import { fetchCatalogStats } from '@/lib/api'
import { useLanguage } from '@/context/LanguageContext'

export function About() {
  const { t } = useLanguage()
  const [stats, setStats] = useState({ totalBooks: 0, totalAuthors: 0, totalLanguages: 0 })

  useEffect(() => {
    fetchCatalogStats().then(setStats).catch(() => {})
  }, [])

  return (
    <div className="bg-surface pb-24 pt-32">
      <div className="container-app max-w-3xl">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-primary text-white">
            <BookOpen size={24} />
          </div>
          <h1 className="font-heading text-3xl font-bold text-ink sm:text-4xl">{t('brandName')}</h1>
          <p className="mt-4 text-ink-soft leading-relaxed">{t('footerTagline')}</p>

          <div className="mt-8 grid grid-cols-3 gap-4">
            {[
              [`${stats.totalBooks}+`, t('statTitles')],
              [`${stats.totalAuthors}+`, t('statAuthors')],
              [`${stats.totalLanguages}`, t('statLanguages')],
            ].map(([stat, label]) => (
              <div key={label} className="rounded-2xl border border-ink/8 bg-white p-5 text-center shadow-soft">
                <p className="font-heading text-2xl font-bold text-ink">{stat}</p>
                <p className="text-xs text-ink-muted">{label}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-2xl border border-ink/8 bg-white p-6 shadow-soft">
            <h2 className="font-heading text-lg font-bold text-ink">{t('footerContact')}</h2>
            <div className="mt-4 flex flex-col gap-3 text-sm text-ink-soft">
              <a href="mailto:rhlraje007@gmail.com" className="flex items-center gap-2.5 hover:text-primary">
                <Mail size={16} className="text-primary" /> rhlraje007@gmail.com
              </a>
              <a href="tel:+919028290713" className="flex items-center gap-2.5 hover:text-primary">
                <Phone size={16} className="text-primary" /> +91 90282 90713
              </a>
              <div className="flex items-center gap-2.5">
                <MapPin size={16} className="text-primary" /> {t('footerAddress')}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
