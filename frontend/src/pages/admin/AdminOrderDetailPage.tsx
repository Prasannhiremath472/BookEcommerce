import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Loader2, ArrowLeft } from 'lucide-react'
import { fetchAdminOrderById, updateOrderStatusAdmin } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'
import { formatPrice } from '@/lib/utils'
import { Badge } from '@/components/ui/Badge'
import type { Order, OrderStatus } from '@/data/types'

const statusTone: Record<Order['status'], 'primary' | 'accent' | 'success' | 'danger' | 'dark' | 'outline'> = {
  Processing: 'outline',
  Shipped: 'primary',
  'Out for Delivery': 'accent',
  Delivered: 'success',
  Cancelled: 'danger',
}

const STATUSES: OrderStatus[] = ['Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled']

type AdminOrder = Order & { customerEmail?: string; customerName?: string; razorpayOrderId?: string; razorpayPaymentId?: string }

export function AdminOrderDetailPage() {
  const { id } = useParams()
  const { token } = useAuth()
  const [order, setOrder] = useState<AdminOrder | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [updating, setUpdating] = useState(false)

  const load = () => {
    if (!token || !id) return
    setIsLoading(true)
    fetchAdminOrderById(token, id).then(({ order }) => setOrder(order)).finally(() => setIsLoading(false))
  }

  useEffect(load, [token, id])

  const handleStatusChange = async (status: string) => {
    if (!token || !id) return
    setUpdating(true)
    try {
      await updateOrderStatusAdmin(token, id, status)
      load()
    } finally {
      setUpdating(false)
    }
  }

  if (isLoading) {
    return <div className="flex items-center gap-2 py-10 text-ink-muted"><Loader2 size={18} className="animate-spin" /> Loading…</div>
  }
  if (!order) {
    return <p className="text-sm text-danger">Order not found.</p>
  }

  return (
    <div>
      <Link to="/admin/orders" className="mb-5 flex items-center gap-1 text-sm font-semibold text-ink-muted hover:text-primary">
        <ArrowLeft size={16} /> Back to orders
      </Link>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-xl font-bold text-ink">{order.id}</h2>
          <p className="text-sm text-ink-muted">{order.date} · {order.customerEmail}</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge tone={statusTone[order.status]}>{order.status}</Badge>
          <select
            value={order.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            disabled={updating}
            className="rounded-xl border border-ink/10 px-4 py-2 text-sm outline-none focus:border-primary disabled:opacity-50"
          >
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="rounded-2xl border border-ink/8 bg-white p-5">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-ink-muted">Items ({order.items.length})</p>
          <div className="flex flex-col gap-4">
            {order.items.map((item) => (
              <div key={item.bookId} className="flex items-center gap-3">
                <img src={item.cover} alt="" className="h-14 w-10 rounded object-cover" />
                <div className="flex-1">
                  <p className="line-clamp-1 text-sm font-medium text-ink">{item.title}</p>
                  <p className="text-xs text-ink-muted">Qty {item.quantity}</p>
                </div>
                <span className="text-sm font-semibold text-ink">{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 border-t border-ink/8 pt-4 flex justify-between font-heading text-lg font-bold text-ink">
            <span>Total</span>
            <span>{formatPrice(order.total)}</span>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="rounded-2xl border border-ink/8 bg-white p-5">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-muted">Delivery Address</p>
            <p className="text-sm text-ink-soft">{order.address}</p>
          </div>
          <div className="rounded-2xl border border-ink/8 bg-white p-5">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-ink-muted">Payment Reference</p>
            <p className="text-xs text-ink-muted">Order: {order.razorpayOrderId}</p>
            <p className="text-xs text-ink-muted">Payment: {order.razorpayPaymentId}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
