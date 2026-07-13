import { useLocation, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle2, Package, Home } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { formatPrice } from '@/lib/utils'

export function OrderConfirmation() {
  const location = useLocation()
  const state = location.state as { paymentId?: string; total?: number } | null
  const orderId = `FOL-${Math.floor(100000 + Math.random() * 900000)}`

  return (
    <div className="flex min-h-[80vh] items-center justify-center bg-surface px-4 pt-24">
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-lg rounded-3xl border border-ink/8 bg-white p-10 text-center shadow-lifted"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 12 }}
          className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-success/10 text-success"
        >
          <CheckCircle2 size={44} />
        </motion.div>

        <h1 className="font-heading text-2xl font-bold text-ink">Order Placed Successfully!</h1>
        <p className="mt-2 text-ink-muted">Thank you for shopping with Cosmos Edge. A confirmation email is on its way.</p>

        <div className="mt-8 flex flex-col gap-3 rounded-2xl bg-ink/[0.03] p-5 text-left text-sm">
          <div className="flex justify-between">
            <span className="text-ink-muted">Order ID</span>
            <span className="font-semibold text-ink">{orderId}</span>
          </div>
          {state?.paymentId && (
            <div className="flex justify-between">
              <span className="text-ink-muted">Payment ID</span>
              <span className="font-mono text-xs font-semibold text-ink">{state.paymentId}</span>
            </div>
          )}
          {state?.total !== undefined && (
            <div className="flex justify-between border-t border-ink/8 pt-3">
              <span className="text-ink-muted">Amount Paid</span>
              <span className="font-heading text-base font-bold text-ink">{formatPrice(state.total)}</span>
            </div>
          )}
        </div>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Link to="/account/orders" className="flex-1">
            <Button variant="outline" className="w-full">
              <Package size={16} /> Track Order
            </Button>
          </Link>
          <Link to="/" className="flex-1">
            <Button className="w-full">
              <Home size={16} /> Continue Shopping
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
