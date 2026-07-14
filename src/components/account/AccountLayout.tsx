import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { User, Package, Heart, Wallet, Gift, FileText, Star, Bell, LogOut } from 'lucide-react'
import clsx from 'clsx'
import { useLanguage } from '@/context/LanguageContext'
import { useAuth } from '@/context/AuthContext'

export function AccountLayout() {
  const { t } = useLanguage()
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = () => {
    logout()
    navigate('/')
  }

  const navItems = [
    { to: '/account', label: t('accountOverview'), icon: User, end: true },
    { to: '/account/orders', label: t('accountOrders'), icon: Package },
    { to: '/account/wishlist', label: t('accountWishlist'), icon: Heart },
    { to: '/account/wallet', label: t('accountWallet'), icon: Wallet },
    { to: '/account/rewards', label: t('accountRewards'), icon: Gift },
    { to: '/account/invoices', label: t('accountInvoices'), icon: FileText },
    { to: '/account/reviews', label: t('accountReviews'), icon: Star },
    { to: '/account/notifications', label: t('accountNotifications'), icon: Bell },
  ]

  return (
    <div className="bg-surface pb-24 pt-32">
      <div className="container-app">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-10 flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-50 text-primary ring-4 ring-primary-50">
            <User size={28} />
          </div>
          <div>
            <h1 className="font-heading text-2xl font-bold text-ink">
              {t('welcomeBack')}{user?.name ? `, ${user.name}` : ''}
            </h1>
            <p className="text-sm text-ink-muted">{user?.email}</p>
          </div>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
          <aside className="h-fit rounded-2xl border border-ink/8 bg-white p-3 shadow-soft lg:sticky lg:top-28">
            <nav className="flex flex-col gap-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    clsx(
                      'flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors',
                      isActive ? 'bg-primary text-white shadow-glow' : 'text-ink-soft hover:bg-ink/5',
                    )
                  }
                >
                  <item.icon size={17} />
                  {item.label}
                </NavLink>
              ))}
              <button
                onClick={handleSignOut}
                className="mt-2 flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-danger transition-colors hover:bg-danger/5"
              >
                <LogOut size={17} /> {t('signOut')}
              </button>
            </nav>
          </aside>

          <div>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}
