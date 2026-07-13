import { useMemo, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, ShoppingBag, Truck, ShieldCheck, RotateCcw, Check } from 'lucide-react'
import clsx from 'clsx'
import { getBookById, books } from '@/data/books'
import { ImageGallery } from '@/components/book/ImageGallery'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { BookCard } from '@/components/book/BookCard'
import { formatPrice, discountPercent } from '@/lib/utils'
import { useCart } from '@/context/CartContext'
import { useWishlist } from '@/context/WishlistContext'
import { useRecentlyViewed } from '@/hooks/useRecentlyViewed'
import { ComingSoon } from './ComingSoon'
import { useLanguage } from '@/context/LanguageContext'

type Tab = 'description' | 'specs'

export function BookDetails() {
  const { id } = useParams()
  const book = id ? getBookById(id) : undefined
  const { addItem } = useCart()
  const { toggle, has } = useWishlist()
  const { t } = useLanguage()
  const [qty, setQty] = useState(1)
  const [tab, setTab] = useState<Tab>('description')
  const recentIds = useRecentlyViewed(book?.id)

  const related = useMemo(
    () => (book ? books.filter((b) => b.categoryId === book.categoryId && b.id !== book.id).slice(0, 4) : []),
    [book],
  )
  const recommended = useMemo(
    () => (book ? books.filter((b) => b.id !== book.id).sort(() => 0.5 - Math.random()).slice(0, 4) : []),
    [book],
  )
  const frequentlyBought = useMemo(() => (book ? books.filter((b) => b.id !== book.id).slice(0, 2) : []), [book])
  const recentlyViewed = useMemo(
    () => books.filter((b) => recentIds.includes(b.id) && b.id !== book?.id).slice(0, 4),
    [recentIds, book],
  )

  if (!book) return <ComingSoon title={t('bookNotFound')} />

  const discount = discountPercent(book.price, book.originalPrice)
  const bundlePrice = book.price + frequentlyBought.reduce((s, b) => s + b.price, 0)
  const wished = has(book.id)

  return (
    <div className="bg-surface pb-24 pt-32">
      <div className="container-app">
        <nav className="mb-8 flex items-center gap-2 text-xs text-ink-muted">
          <Link to="/" className="hover:text-primary">{t('breadcrumbHome')}</Link> /
          <Link to="/shop" className="hover:text-primary">{t('breadcrumbShop')}</Link> /
          <span className="text-ink">{book.title}</span>
        </nav>

        <div className="grid gap-12 lg:grid-cols-[420px_1fr_340px]">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <ImageGallery images={[book.cover]} alt={book.title} />
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
            <span className="text-xs font-semibold uppercase tracking-wide text-primary">{book.category}</span>
            <h1 className="mt-2 font-heading text-3xl font-bold text-ink sm:text-4xl">{book.title}</h1>
            <Link to={`/shop?author=${book.authorId}`} className="mt-1 inline-block text-ink-muted hover:text-primary">
              {t('by')} {book.author}
            </Link>

            {book.isBestseller && (
              <div className="mt-4 flex items-center gap-4">
                <Badge tone="accent">{t('bestsellerBadge')}</Badge>
              </div>
            )}

            <div className="mt-6 flex items-baseline gap-3">
              <span className="font-heading text-3xl font-bold text-ink">{formatPrice(book.price)}</span>
              {book.originalPrice && (
                <>
                  <span className="text-lg text-ink-muted line-through">{formatPrice(book.originalPrice)}</span>
                  <Badge tone="success">{t('save')} {discount}%</Badge>
                </>
              )}
            </div>

            <div className="mt-8 border-t border-ink/8 pt-6">
              <div className="flex gap-1 rounded-full bg-ink/5 p-1">
                {(['description', 'specs'] as Tab[]).map((tabKey) => (
                  <button
                    key={tabKey}
                    onClick={() => setTab(tabKey)}
                    className={clsx(
                      'flex-1 rounded-full py-2.5 text-sm font-semibold capitalize transition-colors',
                      tab === tabKey ? 'bg-white text-ink shadow-soft' : 'text-ink-muted',
                    )}
                  >
                    {tabKey === 'specs' ? t('tabSpecs') : t('tabDescription')}
                  </button>
                ))}
              </div>

              <div className="pt-6">
                {tab === 'description' && (
                  <p className="leading-relaxed text-ink-soft">{book.description}</p>
                )}
                {tab === 'specs' && (
                  <dl className="grid grid-cols-2 gap-y-4 text-sm">
                    {[
                      [t('specFormat'), book.format],
                      [t('specLanguage'), book.language],
                      [t('specPublisher'), book.publisher],
                      [t('specPages'), String(book.pages)],
                      [t('specPublished'), String(book.publishedYear)],
                      [t('specISBN'), book.isbn],
                    ].map(([label, value]) => (
                      <div key={label}>
                        <dt className="text-ink-muted">{label}</dt>
                        <dd className="mt-0.5 font-medium text-ink">{value}</dd>
                      </div>
                    ))}
                  </dl>
                )}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="lg:sticky lg:top-28 lg:self-start"
          >
            <div className="rounded-2xl border border-ink/8 bg-white p-6 shadow-card">
              <div className="mb-4 flex items-center gap-2 text-sm">
                {book.inStock ? (
                  <span className="flex items-center gap-1.5 font-medium text-success">
                    <Check size={16} /> {t('inStockLeft')} {book.stockCount} {t('left')}
                  </span>
                ) : (
                  <span className="font-medium text-danger">{t('outOfStock')}</span>
                )}
              </div>

              <div className="mb-4 flex items-center gap-3">
                <span className="text-sm font-medium text-ink">{t('quantity')}</span>
                <div className="flex items-center gap-3 rounded-full border border-ink/10 px-3 py-1.5">
                  <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="text-ink-soft">−</button>
                  <span className="w-4 text-center text-sm font-semibold">{qty}</span>
                  <button onClick={() => setQty((q) => q + 1)} className="text-ink-soft">+</button>
                </div>
              </div>

              <Button className="w-full" size="lg" disabled={!book.inStock} onClick={() => addItem(book, qty)}>
                <ShoppingBag size={18} /> {t('addToCart')}
              </Button>
              <button
                onClick={() => toggle(book.id)}
                className={clsx(
                  'mt-3 flex w-full items-center justify-center gap-2 rounded-full border py-3 text-sm font-semibold transition-colors',
                  wished ? 'border-danger bg-danger/5 text-danger' : 'border-ink/10 text-ink hover:border-danger hover:text-danger',
                )}
              >
                <Heart size={16} className={clsx(wished && 'fill-current')} /> {wished ? t('inWishlist') : t('addToWishlist')}
              </button>

              <div className="mt-6 flex flex-col gap-3 border-t border-ink/8 pt-6 text-sm text-ink-soft">
                <div className="flex items-center gap-2.5">
                  <Truck size={16} className="text-primary" /> {t('freeShippingOver')}
                </div>
                <div className="flex items-center gap-2.5">
                  <RotateCcw size={16} className="text-primary" /> {t('easyReturns')}
                </div>
                <div className="flex items-center gap-2.5">
                  <ShieldCheck size={16} className="text-primary" /> {t('secureCheckout')}
                </div>
              </div>
            </div>

            {frequentlyBought.length > 0 && (
              <div className="mt-6 rounded-2xl border border-ink/8 bg-white p-6 shadow-soft">
                <h3 className="mb-4 font-heading text-sm font-semibold text-ink">{t('frequentlyBought')}</h3>
                <div className="flex flex-col gap-3">
                  {[book, ...frequentlyBought].map((b) => (
                    <div key={b.id} className="flex items-center gap-3">
                      <img src={b.cover} alt="" className="h-12 w-9 rounded object-cover" />
                      <span className="line-clamp-1 flex-1 text-xs text-ink-soft">{b.title}</span>
                      <span className="text-xs font-semibold text-ink">{formatPrice(b.price)}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-ink/8 pt-4">
                  <span className="text-sm font-semibold text-ink">{t('bundleTotal')}</span>
                  <span className="font-heading text-lg font-bold text-primary">{formatPrice(bundlePrice)}</span>
                </div>
                <Button variant="outline" className="mt-3 w-full" onClick={() => [book, ...frequentlyBought].forEach((b) => addItem(b))}>
                  {t('addBundleToCart')}
                </Button>
              </div>
            )}
          </motion.div>
        </div>

        {related.length > 0 && (
          <section className="mt-20">
            <h2 className="mb-8 font-heading text-2xl font-bold text-ink">{t('relatedBooks')}</h2>
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
              {related.map((b) => (
                <BookCard key={b.id} book={b} />
              ))}
            </div>
          </section>
        )}

        {recommended.length > 0 && (
          <section className="mt-20">
            <h2 className="mb-8 font-heading text-2xl font-bold text-ink">{t('recommendedForYou')}</h2>
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
              {recommended.map((b) => (
                <BookCard key={b.id} book={b} />
              ))}
            </div>
          </section>
        )}

        {recentlyViewed.length > 0 && (
          <section className="mt-20">
            <h2 className="mb-8 font-heading text-2xl font-bold text-ink">{t('recentlyViewed')}</h2>
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
              {recentlyViewed.map((b) => (
                <BookCard key={b.id} book={b} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
