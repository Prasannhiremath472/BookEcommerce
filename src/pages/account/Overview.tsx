import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Package, Heart, Wallet, Gift, ArrowRight } from 'lucide-react'
import { orders, walletBalance, rewardPoints } from '@/data/account'
import { useWishlist } from '@/context/WishlistContext'
import { formatPrice } from '@/lib/utils'
import { OrderCard } from '@/components/account/OrderCard'
import { useLanguage } from '@/context/LanguageContext'

export function Overview() {
  const { count: wishCount } = useWishlist()
  const { t } = useLanguage()

  const stats = [
    { label: t('totalOrders'), value: orders.length, icon: Package, to: '/account/orders', tone: 'primary' },
    { label: t('wishlistItems'), value: wishCount, icon: Heart, to: '/account/wishlist', tone: 'danger' },
    { label: t('walletBalance'), value: formatPrice(walletBalance), icon: Wallet, to: '/account/wallet', tone: 'success' },
    { label: t('rewardPoints'), value: rewardPoints.toLocaleString(), icon: Gift, to: '/account/rewards', tone: 'accent' },
  ] as const

  const toneClasses = {
    primary: 'bg-primary-50 text-primary',
    danger: 'bg-danger/10 text-danger',
    success: 'bg-success/10 text-success',
    accent: 'bg-accent-50 text-accent-600',
  }

  return (
    <div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
          >
            <Link to={s.to} className="block rounded-2xl border border-ink/8 bg-white p-5 shadow-soft transition-shadow hover:shadow-card">
              <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${toneClasses[s.tone]}`}>
                <s.icon size={18} />
              </div>
              <p className="font-heading text-xl font-bold text-ink">{s.value}</p>
              <p className="text-xs text-ink-muted">{s.label}</p>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="mt-10">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-heading text-lg font-bold text-ink">{t('recentOrders')}</h2>
          <Link to="/account/orders" className="flex items-center gap-1 text-sm font-semibold text-primary hover:underline">
            {t('viewAll')} <ArrowRight size={14} />
          </Link>
        </div>
        <div className="flex flex-col gap-4">
          {orders.slice(0, 2).map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      </div>
    </div>
  )
}
