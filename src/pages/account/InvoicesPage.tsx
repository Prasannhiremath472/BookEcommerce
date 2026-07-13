import { Download, FileText } from 'lucide-react'
import { invoices } from '@/data/account'
import { formatPrice } from '@/lib/utils'

export function InvoicesPage() {
  return (
    <div>
      <h2 className="mb-5 font-heading text-lg font-bold text-ink">Invoices</h2>
      <div className="overflow-hidden rounded-2xl border border-ink/8 bg-white shadow-soft">
        <table className="w-full text-left text-sm">
          <thead className="bg-ink/[0.03] text-xs uppercase tracking-wide text-ink-muted">
            <tr>
              <th className="px-5 py-3 font-semibold">Invoice</th>
              <th className="px-5 py-3 font-semibold">Order</th>
              <th className="px-5 py-3 font-semibold">Date</th>
              <th className="px-5 py-3 font-semibold">Amount</th>
              <th className="px-5 py-3 font-semibold"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/8">
            {invoices.map((inv) => (
              <tr key={inv.id} className="transition-colors hover:bg-ink/[0.02]">
                <td className="flex items-center gap-2 px-5 py-4 font-medium text-ink">
                  <FileText size={14} className="text-ink-muted" /> {inv.id}
                </td>
                <td className="px-5 py-4 text-ink-muted">{inv.orderId}</td>
                <td className="px-5 py-4 text-ink-muted">{inv.date}</td>
                <td className="px-5 py-4 font-semibold text-ink">{formatPrice(inv.total)}</td>
                <td className="px-5 py-4">
                  <button className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline">
                    <Download size={13} /> Download
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
