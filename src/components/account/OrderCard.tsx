import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Check } from 'lucide-react'
import clsx from 'clsx'
import type { Order } from '@/data/types'
import { formatPrice } from '@/lib/utils'
import { Badge } from '@/components/ui/Badge'
import { useLanguage } from '@/context/LanguageContext'

const statusTone: Record<Order['status'], 'primary' | 'accent' | 'success' | 'danger' | 'dark' | 'outline'> = {
  Processing: 'outline',
  Shipped: 'primary',
  'Out for Delivery': 'accent',
  Delivered: 'success',
  Cancelled: 'danger',
}

export function OrderCard({ order }: { order: Order }) {
  const [open, setOpen] = useState(false)
  const { t } = useLanguage()

  return (
    <div className="rounded-2xl border border-ink/8 bg-white shadow-soft">
      <button onClick={() => setOpen((o) => !o)} className="flex w-full items-center justify-between gap-4 p-5 text-left">
        <div className="flex items-center gap-4">
          <div className="flex -space-x-3">
            {order.items.slice(0, 3).map((item) => (
              <img key={item.bookId} src={item.cover} alt="" className="h-14 w-10 rounded-md border-2 border-white object-cover shadow-soft" />
            ))}
          </div>
          <div>
            <p className="font-heading text-sm font-semibold text-ink">{order.id}</p>
            <p className="text-xs text-ink-muted">{order.date} · {order.items.length} {t('items').toLowerCase()}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Badge tone={statusTone[order.status]}>{order.status}</Badge>
          <span className="hidden font-heading text-sm font-bold text-ink sm:block">{formatPrice(order.total)}</span>
          <ChevronDown size={18} className={clsx('text-ink-muted transition-transform', open && 'rotate-180')} />
        </div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
            <div className="border-t border-ink/8 p-5">
              {order.eta && <p className="mb-4 text-sm font-medium text-primary">{order.eta}</p>}

              <div className="mb-6 flex items-center">
                {order.timeline.map((step, i) => (
                  <div key={step.status} className="flex flex-1 items-center last:flex-none">
                    <div className="flex flex-col items-center gap-1.5">
                      <div className={clsx('flex h-7 w-7 items-center justify-center rounded-full text-xs', step.done ? 'bg-success text-white' : 'bg-ink/10 text-ink-muted')}>
                        {step.done && <Check size={13} />}
                      </div>
                      <span className={clsx('whitespace-nowrap text-[10px]', step.done ? 'text-ink' : 'text-ink-muted')}>{step.status}</span>
                    </div>
                    {i < order.timeline.length - 1 && <div className={clsx('mx-2 h-0.5 flex-1', step.done ? 'bg-success' : 'bg-ink/10')} />}
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-3">
                {order.items.map((item) => (
                  <div key={item.bookId} className="flex items-center gap-3">
                    <img src={item.cover} alt="" className="h-12 w-9 rounded object-cover" />
                    <span className="line-clamp-1 flex-1 text-sm text-ink-soft">{item.title}</span>
                    <span className="text-xs text-ink-muted">{t('qty')} {item.quantity}</span>
                    <span className="text-sm font-semibold text-ink">{formatPrice(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              <p className="mt-4 border-t border-ink/8 pt-4 text-xs text-ink-muted">{t('deliveringToLabel')} {order.address}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
