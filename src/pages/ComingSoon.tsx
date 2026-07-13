import { motion } from 'framer-motion'
import { BookOpen } from 'lucide-react'
import { useLanguage } from '@/context/LanguageContext'

export function ComingSoon({ title }: { title: string }) {
  const { t } = useLanguage()
  return (
    <div className="container-app flex min-h-[60vh] flex-col items-center justify-center py-32 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-primary text-white">
          <BookOpen size={28} />
        </div>
        <h1 className="font-heading text-3xl font-bold text-ink">{title}</h1>
        <p className="mt-3 text-ink-muted">{t('comingSoonMessage')}</p>
      </motion.div>
    </div>
  )
}
