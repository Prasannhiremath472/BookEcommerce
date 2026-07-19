import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { CreditCard, Landmark, ShieldCheck, ArrowLeft, ArrowRight, Loader2, MapPin } from 'lucide-react'
import clsx from 'clsx'
import { useCart } from '@/context/CartContext'
import { useAuth } from '@/context/AuthContext'
import { fetchAddresses, createAddress, ApiError, type ApiAddress } from '@/lib/api'
import { formatPrice } from '@/lib/utils'
import { Button } from '@/components/ui/Button'
import { StepProgress } from '@/components/checkout/StepProgress'
import { AddressCard } from '@/components/checkout/AddressCard'
import { openRazorpayCheckout } from '@/lib/razorpay'
import { useLanguage } from '@/context/LanguageContext'

type PaymentMethod = 'razorpay' | 'card' | 'upi'

const emptyAddressForm = { label: '', name: '', line1: '', city: '', state: '', zip: '', phone: '' }

export function Checkout() {
  const { items, subtotal, closeCart, clearCart } = useCart()
  const { token, user } = useAuth()
  const navigate = useNavigate()
  const { t } = useLanguage()
  const steps = [t('stepAddress'), t('stepPayment'), t('stepReview')]
  const [step, setStep] = useState(0)
  const [addresses, setAddresses] = useState<ApiAddress[]>([])
  const [addressesLoading, setAddressesLoading] = useState(true)
  const [addressId, setAddressId] = useState<string | undefined>(undefined)
  const [showAddForm, setShowAddForm] = useState(false)
  const [addressForm, setAddressForm] = useState(emptyAddressForm)
  const [addressError, setAddressError] = useState<string | null>(null)
  const [savingAddress, setSavingAddress] = useState(false)
  const [method, setMethod] = useState<PaymentMethod>('razorpay')
  const [processing, setProcessing] = useState(false)
  const [placed, setPlaced] = useState(false)
  const [paymentError, setPaymentError] = useState<string | null>(null)

  const shipping = subtotal > 500 || subtotal === 0 ? 0 : 49
  const total = subtotal + shipping
  const selectedAddress = addresses.find((a) => a.id === addressId)

  useEffect(() => {
    if (!token) return
    fetchAddresses(token)
      .then(({ addresses }) => {
        setAddresses(addresses)
        const preferred = addresses.find((a) => a.isDefault) ?? addresses[0]
        if (preferred) setAddressId(preferred.id)
        setShowAddForm(addresses.length === 0)
      })
      .catch(() => setShowAddForm(true))
      .finally(() => setAddressesLoading(false))
  }, [token])

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) return
    setAddressError(null)
    if (Object.values(addressForm).some((v) => !v.trim())) {
      setAddressError(t('addAddressTitle'))
      return
    }
    setSavingAddress(true)
    try {
      const { address } = await createAddress(token, addressForm)
      setAddresses((prev) => [address, ...prev])
      setAddressId(address.id)
      setShowAddForm(false)
      setAddressForm(emptyAddressForm)
    } catch (err) {
      setAddressError(err instanceof ApiError ? err.message : t('addAddressTitle'))
    } finally {
      setSavingAddress(false)
    }
  }

  if (items.length === 0 && !processing && !placed) {
    navigate('/cart')
    return null
  }

  const placeOrder = async () => {
    setProcessing(true)
    setPaymentError(null)
    closeCart()

    if (method === 'razorpay') {
      const result = await openRazorpayCheckout({
        amount: total,
        description: `${t('cosmosOrderNote')} ${items.length} ${t('items').toLowerCase()}`,
        email: user?.email,
        userId: user?.id,
        items: items.map((item) => ({
          bookId: item.book.id,
          title: item.book.title,
          cover: item.book.cover,
          price: item.book.price,
          quantity: item.quantity,
        })),
        address: selectedAddress
          ? {
              label: selectedAddress.label,
              name: selectedAddress.name,
              line1: selectedAddress.line1,
              city: selectedAddress.city,
              state: selectedAddress.state,
              zip: selectedAddress.zip,
              phone: selectedAddress.phone,
            }
          : undefined,
        subtotal,
        shipping,
      })
      setProcessing(false)
      if (result.success) {
        setPlaced(true)
        clearCart()
        navigate('/order-confirmation', { state: { orderId: result.orderId, paymentId: result.paymentId, total } })
      } else {
        setPaymentError(result.error ?? t('paymentFailed'))
      }
      return
    }

    // Card / UPI — simulate gateway processing without a backend.
    await new Promise((r) => setTimeout(r, 1400))
    setProcessing(false)
    setPlaced(true)
    clearCart()
    navigate('/order-confirmation', { state: { paymentId: `pay_sim_${Date.now()}`, total } })
  }

  return (
    <div className="bg-surface pb-24 pt-32">
      <div className="container-app max-w-5xl">
        <h1 className="mb-10 font-heading text-3xl font-bold text-ink">{t('checkoutTitle')}</h1>

        <div className="mb-12">
          <StepProgress steps={steps} current={step} />
        </div>

        <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
          <div>
            <AnimatePresence mode="wait">
              {step === 0 && (
                <motion.div key="address" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                  {addressesLoading ? (
                    <p className="text-sm text-ink-muted">{t('loadingAddresses')}</p>
                  ) : showAddForm ? (
                    <>
                      <div className="mb-5 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary">
                          <MapPin size={18} />
                        </div>
                        <div>
                          <h2 className="font-heading text-lg font-bold text-ink">{t('addAddressTitle')}</h2>
                          <p className="text-sm text-ink-muted">{t('addAddressSubtitle')}</p>
                        </div>
                      </div>
                      <form onSubmit={handleSaveAddress} className="grid gap-4 rounded-2xl border border-ink/8 bg-white p-5 sm:grid-cols-2">
                        <input
                          placeholder={t('addressLabelField')}
                          value={addressForm.label}
                          onChange={(e) => setAddressForm((f) => ({ ...f, label: e.target.value }))}
                          className="rounded-xl border border-ink/10 px-4 py-3 text-sm outline-none focus:border-primary sm:col-span-2"
                        />
                        <input
                          placeholder={t('fullNameField')}
                          value={addressForm.name}
                          onChange={(e) => setAddressForm((f) => ({ ...f, name: e.target.value }))}
                          className="rounded-xl border border-ink/10 px-4 py-3 text-sm outline-none focus:border-primary sm:col-span-2"
                        />
                        <input
                          placeholder={t('addressLine1Field')}
                          value={addressForm.line1}
                          onChange={(e) => setAddressForm((f) => ({ ...f, line1: e.target.value }))}
                          className="rounded-xl border border-ink/10 px-4 py-3 text-sm outline-none focus:border-primary sm:col-span-2"
                        />
                        <input
                          placeholder={t('cityField')}
                          value={addressForm.city}
                          onChange={(e) => setAddressForm((f) => ({ ...f, city: e.target.value }))}
                          className="rounded-xl border border-ink/10 px-4 py-3 text-sm outline-none focus:border-primary"
                        />
                        <input
                          placeholder={t('stateField')}
                          value={addressForm.state}
                          onChange={(e) => setAddressForm((f) => ({ ...f, state: e.target.value }))}
                          className="rounded-xl border border-ink/10 px-4 py-3 text-sm outline-none focus:border-primary"
                        />
                        <input
                          placeholder={t('zipField')}
                          value={addressForm.zip}
                          onChange={(e) => setAddressForm((f) => ({ ...f, zip: e.target.value }))}
                          className="rounded-xl border border-ink/10 px-4 py-3 text-sm outline-none focus:border-primary"
                        />
                        <input
                          placeholder={t('phoneField')}
                          value={addressForm.phone}
                          onChange={(e) => setAddressForm((f) => ({ ...f, phone: e.target.value }))}
                          className="rounded-xl border border-ink/10 px-4 py-3 text-sm outline-none focus:border-primary"
                        />

                        {addressError && <p className="text-sm text-danger sm:col-span-2">{addressError}</p>}

                        <div className="flex items-center gap-3 sm:col-span-2">
                          <Button type="submit" size="lg" disabled={savingAddress}>
                            {savingAddress ? t('savingAddress') : t('saveAddress')}
                          </Button>
                          {addresses.length > 0 && (
                            <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                              {t('back')}
                            </Button>
                          )}
                        </div>
                      </form>
                    </>
                  ) : (
                    <>
                      <h2 className="mb-5 font-heading text-lg font-bold text-ink">{t('chooseAddress')}</h2>
                      <div className="flex flex-col gap-4">
                        {addresses.map((a) => (
                          <AddressCard key={a.id} address={a} selected={addressId === a.id} onSelect={() => setAddressId(a.id)} />
                        ))}
                        <button
                          onClick={() => setShowAddForm(true)}
                          className="rounded-2xl border-2 border-dashed border-ink/15 p-5 text-sm font-semibold text-ink-muted hover:border-primary hover:text-primary"
                        >
                          {t('addNewAddress')}
                        </button>
                      </div>
                      <Button className="mt-8" size="lg" disabled={!addressId} onClick={() => setStep(1)}>
                        {t('continueToPayment')} <ArrowRight size={18} />
                      </Button>
                    </>
                  )}
                </motion.div>
              )}

              {step === 1 && (
                <motion.div key="payment" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                  <h2 className="mb-5 font-heading text-lg font-bold text-ink">{t('paymentMethod')}</h2>
                  <div className="flex flex-col gap-3">
                    {[
                      { id: 'razorpay' as const, label: t('razorpayOption'), icon: ShieldCheck, tag: t('recommended') },
                      { id: 'card' as const, label: t('cardOption'), icon: CreditCard },
                      { id: 'upi' as const, label: t('upiOption'), icon: Landmark },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => setMethod(opt.id)}
                        className={clsx(
                          'flex items-center gap-4 rounded-2xl border-2 p-5 text-left transition-colors',
                          method === opt.id ? 'border-primary bg-primary-50/50' : 'border-ink/8 bg-white hover:border-ink/20',
                        )}
                      >
                        <div className={clsx('flex h-10 w-10 items-center justify-center rounded-xl', method === opt.id ? 'bg-primary text-white' : 'bg-ink/5 text-ink-soft')}>
                          <opt.icon size={18} />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-ink">{opt.label}</p>
                          {opt.tag && <span className="text-xs font-medium text-success">{opt.tag}</span>}
                        </div>
                        <div className={clsx('h-5 w-5 flex-shrink-0 rounded-full border-2', method === opt.id ? 'border-primary bg-primary' : 'border-ink/20')}>
                          {method === opt.id && <div className="h-full w-full scale-50 rounded-full bg-white" />}
                        </div>
                      </button>
                    ))}
                  </div>

                  {method === 'card' && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-5 grid gap-4 rounded-2xl border border-ink/8 bg-white p-5">
                      <input placeholder={t('cardNumberPlaceholder')} className="rounded-xl border border-ink/10 px-4 py-3 text-sm outline-none focus:border-primary" />
                      <div className="grid grid-cols-2 gap-4">
                        <input placeholder={t('cardExpiryPlaceholder')} className="rounded-xl border border-ink/10 px-4 py-3 text-sm outline-none focus:border-primary" />
                        <input placeholder={t('cardCvvPlaceholder')} className="rounded-xl border border-ink/10 px-4 py-3 text-sm outline-none focus:border-primary" />
                      </div>
                      <input placeholder={t('cardNamePlaceholder')} className="rounded-xl border border-ink/10 px-4 py-3 text-sm outline-none focus:border-primary" />
                    </motion.div>
                  )}
                  {method === 'upi' && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-5 rounded-2xl border border-ink/8 bg-white p-5">
                      <input placeholder={t('upiPlaceholder')} className="w-full rounded-xl border border-ink/10 px-4 py-3 text-sm outline-none focus:border-primary" />
                    </motion.div>
                  )}

                  <div className="mt-8 flex gap-3">
                    <Button variant="outline" onClick={() => setStep(0)}>
                      <ArrowLeft size={18} /> {t('back')}
                    </Button>
                    <Button onClick={() => setStep(2)}>
                      {t('reviewOrder')} <ArrowRight size={18} />
                    </Button>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="review" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
                  <h2 className="mb-5 font-heading text-lg font-bold text-ink">{t('reviewYourOrder')}</h2>

                  <div className="rounded-2xl border border-ink/8 bg-white p-5">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-muted">{t('deliveringTo')}</p>
                    {selectedAddress && (
                      <p className="text-sm text-ink-soft">
                        {selectedAddress.name} — {selectedAddress.line1}, {selectedAddress.city}, {selectedAddress.state} {selectedAddress.zip}
                      </p>
                    )}
                  </div>

                  <div className="mt-4 rounded-2xl border border-ink/8 bg-white p-5">
                    <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink-muted">{t('items')} ({items.length})</p>
                    <div className="flex flex-col gap-4">
                      {items.map((item) => (
                        <div key={item.book.id} className="flex items-center gap-3">
                          <img src={item.book.cover} alt="" className="h-14 w-10 rounded object-cover" />
                          <div className="flex-1">
                            <p className="line-clamp-1 text-sm font-medium text-ink">{item.book.title}</p>
                            <p className="text-xs text-ink-muted">{t('qty')} {item.quantity}</p>
                          </div>
                          <span className="text-sm font-semibold text-ink">{formatPrice(item.book.price * item.quantity)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {paymentError && (
                    <p className="mt-4 rounded-xl bg-danger/10 px-4 py-3 text-sm font-medium text-danger">{paymentError}</p>
                  )}

                  <div className="mt-8 flex gap-3">
                    <Button variant="outline" onClick={() => setStep(1)}>
                      <ArrowLeft size={18} /> {t('back')}
                    </Button>
                    <Button onClick={placeOrder} disabled={processing} className="flex-1">
                      {processing ? (
                        <>
                          <Loader2 size={18} className="animate-spin" /> {t('processingPayment')}
                        </>
                      ) : (
                        <>{t('placeOrderWithTotal')} {formatPrice(total)}</>
                      )}
                    </Button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="h-fit rounded-2xl border border-ink/8 bg-white p-6 shadow-card lg:sticky lg:top-28">
            <h3 className="mb-5 font-heading text-lg font-bold text-ink">{t('orderSummary')}</h3>
            <div className="flex flex-col gap-3 text-sm">
              <div className="flex justify-between text-ink-soft">
                <span>{t('subtotalWithItems')} ({items.length} {t('items').toLowerCase()})</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-ink-soft">
                <span>{t('shipping')}</span>
                <span>{shipping === 0 ? t('free') : formatPrice(shipping)}</span>
              </div>
              <div className="flex justify-between border-t border-ink/8 pt-3 font-heading text-lg font-bold text-ink">
                <span>{t('total')}</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
            <div className="mt-5 flex items-center gap-2 rounded-xl bg-primary-50 p-3 text-xs text-primary">
              <ShieldCheck size={16} /> {t('securePaymentNote')}
            </div>
            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-ink-muted">
              <span>{t('securedBy')}</span>
              <img src="https://badges.razorpay.com/badge-dark.png" alt="Razorpay" className="h-6" loading="lazy" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
