import { orders } from '@/data/account'
import { OrderCard } from '@/components/account/OrderCard'
import { useLanguage } from '@/context/LanguageContext'

export function Orders() {
  const { t } = useLanguage()
  return (
    <div>
      <h2 className="mb-5 font-heading text-lg font-bold text-ink">{t('myOrders')}</h2>
      <div className="flex flex-col gap-4">
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>
    </div>
  )
}
