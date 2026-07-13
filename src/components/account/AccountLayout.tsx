import { NavLink, Outlet } from 'react-router-dom'
import { motion } from 'framer-motion'
import { User, Package, Heart, Wallet, Gift, FileText, Star, Bell, LogOut } from 'lucide-react'
import clsx from 'clsx'

const navItems = [
  { to: '/account', label: 'Overview', icon: User, end: true },
  { to: '/account/orders', label: 'Orders', icon: Package },
  { to: '/account/wishlist', label: 'Wishlist', icon: Heart },
  { to: '/account/wallet', label: 'Wallet', icon: Wallet },
  { to: '/account/rewards', label: 'Reward Points', icon: Gift },
  { to: '/account/invoices', label: 'Invoices', icon: FileText },
  { to: '/account/reviews', label: 'My Reviews', icon: Star },
  { to: '/account/notifications', label: 'Notifications', icon: Bell },
]

export function AccountLayout() {
  return (
    <div className="bg-surface pb-24 pt-32">
      <div className="container-app">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-10 flex items-center gap-4">
          <img src="https://i.pravatar.cc/150?img=13" alt="" className="h-16 w-16 rounded-full object-cover ring-4 ring-primary-50" />
          <div>
            <h1 className="font-heading text-2xl font-bold text-ink">Welcome back, Prasann</h1>
            <p className="text-sm text-ink-muted">prasannhiremath333@gmail.com</p>
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
              <button className="mt-2 flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-danger transition-colors hover:bg-danger/5">
                <LogOut size={17} /> Sign Out
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
