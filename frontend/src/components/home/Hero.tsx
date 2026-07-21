import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, ShoppingBag, Check } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/Button'
import { useBook } from '@/hooks/useBook'
import { useCart } from '@/context/CartContext'
import { useLanguage } from '@/context/LanguageContext'
import { formatPrice, discountPercent } from '@/lib/utils'

const FEATURED_ID = 'bk-156'

export function Hero() {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const { book } = useBook(FEATURED_ID)
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)

  const discount = book ? discountPercent(book.price, book.originalPrice) : 0

  const handleAddToCart = () => {
    if (!book) return
    addItem(book)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const handleBuyNow = () => {
    if (!book) return
    addItem(book)
    navigate('/checkout')
  }

  return (
    <section className="relative overflow-hidden bg-gradient-dark pb-24 pt-40 sm:pb-32 sm:pt-48">
      {book && (
        <div
          className="pointer-events-none absolute inset-0 scale-110 bg-cover bg-center opacity-40 blur-md"
          style={{ backgroundImage: `url(${book.cover})` }}
        />
      )}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-ink/70 via-ink/60 to-ink/90" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-radial-soft" />
      <div className="pointer-events-none absolute -left-40 top-20 h-96 w-96 rounded-full bg-primary/30 blur-[100px]" />
      <div className="pointer-events-none absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-secondary/30 blur-[100px]" />

      <div className="container-app relative grid items-center gap-16 lg:grid-cols-2">
        <div className="text-center lg:text-left">
          {book && (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="mb-6 flex justify-center lg:hidden"
            >
              <Link to={`/book/${book.id}`} className="relative w-48">
                <span className="absolute -top-3 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-full bg-gradient-accent px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white shadow-lifted">
                  {t('mostSelling')}
                </span>
                <img
                  src={book.cover}
                  alt={book.title}
                  className="w-full rounded-xl shadow-lifted ring-1 ring-white/10"
                />
              </Link>
            </motion.div>
          )}

          <motion.span
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex justify-center lg:justify-start"
          >
            <span className="inline-flex items-center gap-2 rounded-full bg-gradient-accent px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-white shadow-lifted">
              {t('heroFeaturedEyebrow')}
            </span>
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mt-6 text-display-lg font-heading font-bold text-white"
          >
            {t('heroTitleLine1')}
            <br />
            <span className="bg-gradient-to-r from-primary-300 via-secondary-300 to-accent-300 bg-clip-text text-transparent">
              {t('heroTitleLine2')}
            </span>
          </motion.h1>

          {book && (
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="mt-6"
            >
              <Link to={`/book/${book.id}`} className="inline-block">
                <h2 className="font-heading text-2xl font-bold text-white hover:text-primary-200 sm:text-3xl">
                  {book.title}
                </h2>
              </Link>
              <p className="mt-1 text-white/60">{book.author}</p>

              <div className="mt-4 flex items-center justify-center gap-3 lg:justify-start">
                <span className="font-heading text-3xl font-bold text-white">{formatPrice(book.price)}</span>
                {book.originalPrice && book.originalPrice > book.price && (
                  <>
                    <span className="text-lg text-white/40 line-through">{formatPrice(book.originalPrice)}</span>
                    <span className="rounded-full bg-gradient-accent px-3 py-1 text-xs font-bold text-white">
                      {discount}% OFF
                    </span>
                  </>
                )}
              </div>

              <p className="mx-auto mt-4 max-w-md text-white/70 lg:mx-0">{book.description}</p>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-8 flex flex-wrap justify-center gap-4 lg:justify-start"
          >
            <Button size="lg" onClick={handleBuyNow} disabled={!book}>
              {t('heroBuyNow')} <ArrowRight size={18} />
            </Button>
            <Button size="lg" variant="ghost" className="text-white hover:bg-white/10" onClick={handleAddToCart} disabled={!book}>
              {added ? (
                <>
                  <Check size={18} /> {t('heroAddedToCart')}
                </>
              ) : (
                <>
                  <ShoppingBag size={18} /> {t('heroAddToCart')}
                </>
              )}
            </Button>
          </motion.div>
        </div>

        <div className="relative hidden h-[520px] items-center justify-center lg:flex">
          {book && (
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-80 animate-float"
            >
              <span className="absolute -top-4 left-1/2 z-10 -translate-x-1/2 whitespace-nowrap rounded-full bg-gradient-accent px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-white shadow-lifted">
                {t('mostSelling')}
              </span>
              <Link to={`/book/${book.id}`}>
                <img
                  src={book.cover}
                  alt={book.title}
                  className="w-full rounded-2xl shadow-lifted ring-1 ring-white/10"
                />
              </Link>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  )
}
