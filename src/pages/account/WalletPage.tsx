import { motion } from 'framer-motion'
import { ArrowUpRight, ArrowDownRight, Wallet } from 'lucide-react'
import { walletBalance, walletTransactions } from '@/data/account'
import { formatPrice } from '@/lib/utils'

export function WalletPage() {
  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative mb-8 overflow-hidden rounded-2xl bg-gradient-primary p-8 text-white shadow-glow"
      >
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15">
            <Wallet size={20} />
          </div>
          <span className="text-sm text-white/80">Cosmos Edge Wallet Balance</span>
        </div>
        <p className="mt-4 font-heading text-4xl font-bold">{formatPrice(walletBalance)}</p>
      </motion.div>

      <h2 className="mb-4 font-heading text-lg font-bold text-ink">Transaction History</h2>
      <div className="flex flex-col divide-y divide-ink/8 rounded-2xl border border-ink/8 bg-white">
        {walletTransactions.map((t) => (
          <div key={t.id} className="flex items-center gap-4 p-5">
            <div className={`flex h-10 w-10 items-center justify-center rounded-full ${t.type === 'credit' ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>
              {t.type === 'credit' ? <ArrowDownRight size={17} /> : <ArrowUpRight size={17} />}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-ink">{t.reason}</p>
              <p className="text-xs text-ink-muted">{t.date}</p>
            </div>
            <span className={`font-heading text-sm font-bold ${t.type === 'credit' ? 'text-success' : 'text-danger'}`}>
              {t.type === 'credit' ? '+' : '−'}{formatPrice(t.amount)}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
