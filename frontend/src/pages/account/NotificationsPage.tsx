import { useState } from 'react'
import clsx from 'clsx'
import { Package, Tag, Settings, Circle } from 'lucide-react'
import { notifications as initial } from '@/data/account'
import { useLanguage } from '@/context/LanguageContext'

const iconMap = { order: Package, offer: Tag, system: Settings }

export function NotificationsPage() {
  const [items, setItems] = useState(initial)
  const { t } = useLanguage()

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <h2 className="font-heading text-lg font-bold text-ink">{t('notifications')}</h2>
        <button
          onClick={() => setItems((prev) => prev.map((n) => ({ ...n, read: true })))}
          className="text-xs font-semibold text-primary hover:underline"
        >
          {t('markAllRead')}
        </button>
      </div>
      <div className="flex flex-col divide-y divide-ink/8 rounded-2xl border border-ink/8 bg-white">
        {items.map((n) => {
          const Icon = iconMap[n.type]
          return (
            <button
              key={n.id}
              onClick={() => setItems((prev) => prev.map((x) => (x.id === n.id ? { ...x, read: true } : x)))}
              className={clsx('flex items-start gap-4 p-5 text-left transition-colors hover:bg-ink/[0.02]', !n.read && 'bg-primary-50/40')}
            >
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-ink/5 text-ink-soft">
                <Icon size={16} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold text-ink">{n.title}</p>
                  {!n.read && <Circle size={7} className="fill-primary text-primary" />}
                </div>
                <p className="mt-0.5 text-sm text-ink-muted">{n.body}</p>
                <p className="mt-1 text-xs text-ink-muted">{n.date}</p>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
