import { Loader2 } from 'lucide-react'
import { useOrders } from '@/hooks/useOrders'
import { OrderCard } from '@/components/account/OrderCard'
import { useLanguage } from '@/context/LanguageContext'

export function Orders() {
  const { t } = useLanguage()
  const { orders, isLoading, error } = useOrders()

  return (
    <div>
      <h2 className="mb-5 font-heading text-lg font-bold text-ink">{t('myOrders')}</h2>
      {isLoading ? (
        <div className="flex items-center gap-2 py-10 text-sm text-ink-muted">
          <Loader2 size={16} className="animate-spin" /> {t('loadingOrders')}
        </div>
      ) : error ? (
        <p className="text-sm text-danger">{error}</p>
      ) : orders.length === 0 ? (
        <p className="text-sm text-ink-muted">No orders yet.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {orders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  )
}
