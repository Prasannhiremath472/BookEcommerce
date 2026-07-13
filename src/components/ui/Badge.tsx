import clsx from 'clsx'
import type { ReactNode } from 'react'

type Tone = 'primary' | 'accent' | 'success' | 'danger' | 'dark' | 'outline'

const toneStyles: Record<Tone, string> = {
  primary: 'bg-primary text-white',
  accent: 'bg-gradient-accent text-white',
  success: 'bg-success text-white',
  danger: 'bg-danger text-white',
  dark: 'bg-ink text-white',
  outline: 'bg-white/90 text-ink border border-ink/10 backdrop-blur',
}

export function Badge({ children, tone = 'primary', className }: { children: ReactNode; tone?: Tone; className?: string }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide shadow-soft',
        toneStyles[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}
