import clsx from 'clsx'
import { MapPin, Home, Briefcase } from 'lucide-react'
import type { Address } from '@/data/types'

export function AddressCard({ address, selected, onSelect }: { address: Address; selected: boolean; onSelect: () => void }) {
  const Icon = address.label === 'Home' ? Home : address.label === 'Office' ? Briefcase : MapPin

  return (
    <button
      onClick={onSelect}
      className={clsx(
        'flex w-full items-start gap-4 rounded-2xl border-2 p-5 text-left transition-colors',
        selected ? 'border-primary bg-primary-50/50' : 'border-ink/8 bg-white hover:border-ink/20',
      )}
    >
      <div className={clsx('flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl', selected ? 'bg-primary text-white' : 'bg-ink/5 text-ink-soft')}>
        <Icon size={18} />
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <p className="font-heading text-sm font-semibold text-ink">{address.label}</p>
          {address.isDefault && <span className="rounded-full bg-primary-100 px-2 py-0.5 text-[10px] font-semibold text-primary">Default</span>}
        </div>
        <p className="mt-1 text-sm text-ink-soft">{address.name}</p>
        <p className="text-sm text-ink-muted">{address.line1}, {address.city}, {address.state} {address.zip}</p>
        <p className="mt-1 text-xs text-ink-muted">{address.phone}</p>
      </div>
      <div className={clsx('mt-1 h-5 w-5 flex-shrink-0 rounded-full border-2', selected ? 'border-primary bg-primary' : 'border-ink/20')}>
        {selected && <div className="h-full w-full scale-50 rounded-full bg-white" />}
      </div>
    </button>
  )
}
