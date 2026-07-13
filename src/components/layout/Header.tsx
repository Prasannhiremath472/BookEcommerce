import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Heart, ShoppingBag, User, Menu, X, ChevronDown, Moon, Sun, Languages } from 'lucide-react'
import { categories } from '@/data/categories'
import { useCart } from '@/context/CartContext'
import { useWishlist } from '@/context/WishlistContext'
import { useLanguage } from '@/context/LanguageContext'
import { IconButton } from '@/components/ui/IconButton'
import { SearchOverlay } from './SearchOverlay'

export function Header() {
  const location = useLocation()
  const isHome = location.pathname === '/'
  const [scrolled, setScrolled] = useState(false)
  const [megaOpen, setMegaOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [dark, setDark] = useState(false)
  const { itemCount, openCart } = useCart()
  const { count: wishCount } = useWishlist()
  const { lang, setLang, t } = useLanguage()

  const navLinks = [
    { label: t('navShop'), to: '/shop' },
    { label: t('navBestsellers'), to: '/shop?filter=bestsellers' },
    { label: t('navNewArrivals'), to: '/shop?filter=new' },
    { label: t('navDeals'), to: '/shop?filter=deals' },
  ]

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])

  const transparent = isHome && !scrolled

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
          transparent ? 'bg-transparent' : 'bg-white/80 backdrop-blur-lg shadow-soft'
        }`}
      >
        <div className="container-app flex h-20 items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 font-heading text-2xl font-bold">
            <img src="/brand/logo.jpeg" alt={t('brandName')} className="h-11 w-11 rounded-full object-cover shadow-soft ring-1 ring-black/5" />
            <span className={transparent ? 'text-white' : 'text-gradient'}>{t('brandName')}</span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            <div
              className="relative"
              onMouseEnter={() => setMegaOpen(true)}
              onMouseLeave={() => setMegaOpen(false)}
            >
              <button
                className={`flex items-center gap-1 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                  transparent ? 'text-white hover:bg-white/10' : 'text-ink hover:bg-ink/5'
                }`}
              >
                {t('navCategories')} <ChevronDown size={14} />
              </button>
              <AnimatePresence>
                {megaOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.2 }}
                    className="absolute left-1/2 top-full w-[640px] -translate-x-1/2 pt-3"
                  >
                    <div className="grid grid-cols-2 gap-1 rounded-2xl border border-ink/5 bg-white p-4 shadow-lifted">
                      {categories.map((c) => (
                        <Link
                          key={c.id}
                          to={`/shop?category=${c.slug}`}
                          className="flex items-center gap-3 rounded-xl p-2.5 transition-colors hover:bg-primary-50"
                        >
                          <img src={c.image} alt="" className="h-12 w-12 rounded-lg object-cover" />
                          <div>
                            <p className="text-sm font-semibold text-ink">{c.name}</p>
                            <p className="text-xs text-ink-muted">
                              {c.bookCount.toLocaleString()} {t('booksSuffix')}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {navLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                  transparent ? 'text-white hover:bg-white/10' : 'text-ink hover:bg-ink/5'
                }`}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1">
            <IconButton onClick={() => setSearchOpen(true)} className={transparent ? 'text-white hover:bg-white/10' : ''}>
              <Search size={19} />
            </IconButton>
            <motion.button
              onClick={() => setLang(lang === 'en' ? 'mr' : 'en')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex h-10 items-center gap-1.5 rounded-full px-3 text-xs font-semibold transition-colors ${
                transparent ? 'text-white hover:bg-white/10' : 'text-ink-soft hover:bg-ink/5'
              }`}
              aria-label={t('toggleLanguageAria')}
            >
              <Languages size={17} />
              <span>{t('languageToggle')}</span>
            </motion.button>
            <IconButton onClick={() => setDark((d) => !d)} className={transparent ? 'text-white hover:bg-white/10' : ''}>
              {dark ? <Sun size={19} /> : <Moon size={19} />}
            </IconButton>
            <Link to="/wishlist">
              <IconButton className={transparent ? 'text-white hover:bg-white/10' : ''}>
                <div className="relative">
                  <Heart size={19} />
                  {wishCount > 0 && (
                    <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-danger text-[10px] font-bold text-white">
                      {wishCount}
                    </span>
                  )}
                </div>
              </IconButton>
            </Link>
            <IconButton onClick={openCart} className={transparent ? 'text-white hover:bg-white/10' : ''}>
              <div className="relative">
                <ShoppingBag size={19} />
                <AnimatePresence>
                  {itemCount > 0 && (
                    <motion.span
                      key={itemCount}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white"
                    >
                      {itemCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </IconButton>
            <Link to="/account">
              <IconButton className={transparent ? 'text-white hover:bg-white/10' : ''}>
                <User size={19} />
              </IconButton>
            </Link>
            <button
              onClick={() => setMobileOpen(true)}
              className={`ml-1 flex h-10 w-10 items-center justify-center rounded-full lg:hidden ${
                transparent ? 'text-white' : 'text-ink'
              }`}
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-ink/40 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileOpen(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 260 }}
              className="ml-auto flex h-full w-80 flex-col bg-white p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-8 flex items-center justify-between">
                <span className="flex items-center gap-2 font-heading text-xl font-bold text-gradient">
                  <img src="/brand/logo.jpeg" alt={t('brandName')} className="h-9 w-9 rounded-full object-cover" />
                  {t('brandName')}
                </span>
                <button onClick={() => setMobileOpen(false)}>
                  <X size={22} />
                </button>
              </div>
              <button
                onClick={() => setLang(lang === 'en' ? 'mr' : 'en')}
                className="mb-4 flex items-center justify-center gap-1.5 self-start rounded-full border border-ink/10 px-4 py-2 text-sm font-semibold text-ink-soft"
              >
                <Languages size={16} /> {t('languageToggle')}
              </button>
              <nav className="flex flex-col gap-1">
                {navLinks.map((l) => (
                  <Link
                    key={l.to}
                    to={l.to}
                    onClick={() => setMobileOpen(false)}
                    className="rounded-xl px-3 py-3 text-base font-semibold text-ink hover:bg-primary-50"
                  >
                    {l.label}
                  </Link>
                ))}
              </nav>
              <div className="mt-6 border-t border-ink/10 pt-6">
                <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wide text-ink-muted">{t('navCategories')}</p>
                {categories.map((c) => (
                  <Link
                    key={c.id}
                    to={`/shop?category=${c.slug}`}
                    onClick={() => setMobileOpen(false)}
                    className="block rounded-xl px-3 py-2.5 text-sm text-ink-soft hover:bg-primary-50"
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  )
}
