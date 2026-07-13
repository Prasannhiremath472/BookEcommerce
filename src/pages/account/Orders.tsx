import { orders } from '@/data/account'
import { OrderCard } from '@/components/account/OrderCard'

export function Orders() {
  return (
    <div>
      <h2 className="mb-5 font-heading text-lg font-bold text-ink">My Orders</h2>
      <div className="flex flex-col gap-4">
        {orders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>
    </div>
  )
}
