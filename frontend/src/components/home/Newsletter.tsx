import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useLanguage } from '@/context/LanguageContext'

export function Newsletter() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const { t } = useLanguage()

  return (
    <section className="container-app py-16 sm:py-20">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-primary px-8 py-16 text-center sm:px-16"
      >
        <div className="pointer-events-none absolute -left-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -right-16 -bottom-16 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

        <div className="relative mx-auto max-w-lg">
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/15 text-white">
            <Mail size={24} />
          </div>
          <h2 className="font-heading text-3xl font-bold text-white">{t('newsletterTitle')}</h2>
          <p className="mt-3 text-white/75">{t('newsletterSubtitle')}</p>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mt-8 flex items-center justify-center gap-2 text-white"
            >
              <CheckCircle2 size={20} /> {t('newsletterThanks')}
            </motion.div>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault()
                setSubmitted(true)
              }}
              className="mt-8 flex flex-col gap-3 sm:flex-row"
            >
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={t('emailPlaceholder')}
                className="flex-1 rounded-full bg-white/95 px-5 py-3.5 text-sm text-ink outline-none placeholder:text-ink-muted"
              />
              <Button type="submit" className="!bg-none !bg-white !text-primary hover:!bg-white/90">
                {t('subscribe')}
              </Button>
            </form>
          )}
        </div>
      </motion.div>
    </section>
  )
}
