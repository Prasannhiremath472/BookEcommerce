import { motion } from 'framer-motion'
import { Gift, Sparkles } from 'lucide-react'
import { rewardPoints, rewardHistory } from '@/data/account'
import { useLanguage } from '@/context/LanguageContext'

export function RewardsPage() {
  const { t } = useLanguage()
  const nextTier = 2000
  const progress = Math.min(100, (rewardPoints / nextTier) * 100)

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative mb-8 overflow-hidden rounded-2xl bg-gradient-dark p-8 text-white shadow-lifted"
      >
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-accent-500/20 blur-2xl" />
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-accent-400">
            <Gift size={20} />
          </div>
          <span className="text-sm text-white/70">{t('rewardPoints')}</span>
        </div>
        <p className="mt-4 font-heading text-4xl font-bold">{rewardPoints.toLocaleString()} {t('pts')}</p>
        <p className="mt-1 text-sm text-white/60">≈ {(rewardPoints / 20).toFixed(2)} {t('redeemableCredit')}</p>

        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between text-xs text-white/60">
            <span className="flex items-center gap-1"><Sparkles size={12} /> {t('goldTier')}</span>
            <span>{rewardPoints} / {nextTier} {t('pts')}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-white/10">
            <motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.8 }} className="h-full rounded-full bg-gradient-accent" />
          </div>
        </div>
      </motion.div>

      <h2 className="mb-4 font-heading text-lg font-bold text-ink">{t('pointsHistory')}</h2>
      <div className="flex flex-col divide-y divide-ink/8 rounded-2xl border border-ink/8 bg-white">
        {rewardHistory.map((r) => (
          <div key={r.id} className="flex items-center justify-between p-5">
            <div>
              <p className="text-sm font-medium text-ink">{r.label}</p>
              <p className="text-xs text-ink-muted">{r.date}</p>
            </div>
            <span className="font-heading text-sm font-bold text-accent-600">+{r.points} {t('pts')}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
