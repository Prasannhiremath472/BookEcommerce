import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Minus, Plus, X, ShoppingBag, Tag, ArrowRight } from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { formatPrice } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { useLanguage } from '@/context/LanguageContext'

export function CartPage() {
  const { items, updateQuantity, removeItem, subtotal } = useCart()
  const navigate = useNavigate()
  const { t } = useLanguage()
  const [coupon, setCoupon] = useState('')
  const [applied, setApplied] = useState<string | null>(null)
  const [couponError, setCouponError] = useState('')

  const discount = applied === 'FOLIO15' ? subtotal * 0.15 : 0
  const shipping = subtotal > 500 || subtotal === 0 ? 0 : 49
  const total = subtotal - discount + shipping

  const applyCoupon = () => {
    if (coupon.trim().toUpperCase() === 'FOLIO15') {
      setApplied('FOLIO15')
      setCouponError('')
    } else {
      setCouponError(t('invalidCoupon'))
    }
  }

  if (items.length === 0) {
    return (
      <div className="container-app flex min-h-[60vh] flex-col items-center justify-center py-32 text-center">
        <ShoppingBag size={48} className="text-ink/15" />
        <h1 className="mt-6 font-heading text-2xl font-bold text-ink">{t('cartEmptyTitle')}</h1>
        <p className="mt-2 text-ink-muted">{t('cartEmptySubtitle')}</p>
        <Link to="/shop">
          <Button className="mt-6" size="lg">{t('startShopping')}</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-surface pb-24 pt-32">
      <div className="container-app">
        <h1 className="mb-10 font-heading text-3xl font-bold text-ink">{t('shoppingCart')}</h1>

        <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
          <div className="flex flex-col gap-4">
            <AnimatePresence initial={false}>
              {items.map((item) => (
                <motion.div
                  key={item.book.id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex gap-5 rounded-2xl border border-ink/8 bg-white p-5 shadow-soft"
                >
                  <img src={item.book.cover} alt="" className="h-28 w-20 flex-shrink-0 rounded-xl object-cover" />
                  <div className="flex flex-1 flex-col justify-between">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <Link to={`/book/${item.book.id}`} className="font-heading font-semibold text-ink hover:text-primary">
                          {item.book.title}
                        </Link>
                        <p className="text-sm text-ink-muted">{item.book.author}</p>
                        <p className="mt-1 text-xs text-ink-muted">{item.book.format}</p>
                      </div>
                      <button onClick={() => removeItem(item.book.id)} className="text-ink-muted hover:text-danger">
                        <X size={18} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 rounded-full border border-ink/10 px-3 py-1.5">
                        <button onClick={() => updateQuantity(item.book.id, item.quantity - 1)}><Minus size={13} /></button>
                        <span className="w-5 text-center text-sm font-semibold">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.book.id, item.quantity + 1)}><Plus size={13} /></button>
                      </div>
                      <span className="font-heading text-lg font-bold text-ink">{formatPrice(item.book.price * item.quantity)}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="h-fit rounded-2xl border border-ink/8 bg-white p-6 shadow-card lg:sticky lg:top-28">
            <h3 className="mb-5 font-heading text-lg font-bold text-ink">{t('orderSummary')}</h3>

            <div className="mb-5">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
                  <input
                    value={coupon}
                    onChange={(e) => setCoupon(e.target.value)}
                    placeholder={t('couponPlaceholder')}
                    className="w-full rounded-full border border-ink/10 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-primary"
                  />
                </div>
                <button onClick={applyCoupon} className="rounded-full bg-ink px-4 text-sm font-semibold text-white hover:bg-primary">
                  {t('apply')}
                </button>
              </div>
              <AnimatePresence>
                {applied && (
                  <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="mt-2 text-xs font-medium text-success">
                    {t('couponLabel')} "{applied}" {t('couponApplied')}
                  </motion.p>
                )}
                {couponError && (
                  <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} className="mt-2 text-xs font-medium text-danger">
                    {couponError}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>

            <div className="flex flex-col gap-3 border-t border-ink/8 pt-5 text-sm">
              <div className="flex justify-between text-ink-soft">
                <span>{t('subtotal')}</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-success">
                  <span>{t('discount')}</span>
                  <span>−{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-ink-soft">
                <span>{t('shipping')}</span>
                <span>{shipping === 0 ? t('free') : formatPrice(shipping)}</span>
              </div>
              <div className="flex justify-between border-t border-ink/8 pt-3 font-heading text-lg font-bold text-ink">
                <span>{t('total')}</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            <Button className="mt-6 w-full" size="lg" onClick={() => navigate('/checkout')}>
              {t('proceedToCheckout')} <ArrowRight size={18} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
