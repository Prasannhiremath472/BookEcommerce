import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LayoutDashboard, BookOpen, FolderTree, Users, Package, LogOut, Shield } from 'lucide-react'
import clsx from 'clsx'
import { useAuth } from '@/context/AuthContext'

export function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = () => {
    logout()
    navigate('/')
  }

  const navItems = [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
    { to: '/admin/books', label: 'Books', icon: BookOpen },
    { to: '/admin/categories', label: 'Categories', icon: FolderTree },
    { to: '/admin/authors', label: 'Authors', icon: Users },
    { to: '/admin/orders', label: 'Orders', icon: Package },
  ]

  return (
    <div className="bg-surface pb-24 pt-32">
      <div className="container-app">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-10 flex items-center gap-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-50 text-primary ring-4 ring-primary-50">
            <Shield size={28} />
          </div>
          <div>
            <h1 className="font-heading text-2xl font-bold text-ink">Admin Panel</h1>
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
