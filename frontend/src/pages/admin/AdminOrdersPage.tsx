import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { fetchAdminOrders } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'
import { formatPrice } from '@/lib/utils'
import { Badge } from '@/components/ui/Badge'
import type { Order } from '@/data/types'

const statusTone: Record<Order['status'], 'primary' | 'accent' | 'success' | 'danger' | 'dark' | 'outline'> = {
  Processing: 'outline',
  Shipped: 'primary',
  'Out for Delivery': 'accent',
  Delivered: 'success',
  Cancelled: 'danger',
}

const PAGE_SIZE = 20

export function AdminOrdersPage() {
  const { token } = useAuth()
  const [orders, setOrders] = useState<(Order & { customerEmail?: string })[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [status, setStatus] = useState('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!token) return
    setIsLoading(true)
    fetchAdminOrders(token, { page, pageSize: PAGE_SIZE, status: status || undefined })
      .then((res) => {
        setOrders(res.orders)
        setTotal(res.total)
      })
      .finally(() => setIsLoading(false))
  }, [token, page, status])

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-heading text-lg font-bold text-ink">Orders ({total})</h2>
        <select
          value={status}
          onChange={(e) => { setStatus(e.target.value); setPage(1) }}
          className="rounded-xl border border-ink/10 px-4 py-2 text-sm outline-none focus:border-primary"
        >
          <option value="">All statuses</option>
          <option>Processing</option>
          <option>Shipped</option>
          <option>Out for Delivery</option>
          <option>Delivered</option>
          <option>Cancelled</option>
        </select>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-ink/8 bg-white">
        {isLoading ? (
          <div className="flex items-center justify-center gap-2 p-10 text-ink-muted">
            <Loader2 size={18} className="animate-spin" /> Loading…
          </div>
        ) : orders.length === 0 ? (
          <p className="p-6 text-sm text-ink-muted">No orders found.</p>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="border-b border-ink/8 text-xs uppercase text-ink-muted">
              <tr>
                <th className="px-4 py-3">Order</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Items</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-ink/5 last:border-0">
                  <td className="px-4 py-3">
                    <Link to={`/admin/orders/${order.id}`} className="font-medium text-primary hover:underline">{order.id}</Link>
                  </td>
                  <td className="px-4 py-3 text-ink-soft">{order.customerEmail}</td>
                  <td className="px-4 py-3 text-ink-soft">{order.date}</td>
                  <td className="px-4 py-3 text-ink-soft">{order.items.length}</td>
                  <td className="px-4 py-3 font-semibold text-ink">{formatPrice(order.total)}</td>
                  <td className="px-4 py-3"><Badge tone={statusTone[order.status]}>{order.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="rounded-lg border border-ink/10 px-3 py-1.5 text-sm disabled:opacity-40">Prev</button>
          <span className="text-sm text-ink-muted">Page {page} of {totalPages}</span>
          <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="rounded-lg border border-ink/10 px-3 py-1.5 text-sm disabled:opacity-40">Next</button>
        </div>
      )}
    </div>
  )
}
