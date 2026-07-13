import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import clsx from 'clsx'

export function StepProgress({ steps, current }: { steps: string[]; current: number }) {
  return (
    <div className="flex items-center">
      {steps.map((label, i) => (
        <div key={label} className="flex flex-1 items-center last:flex-none">
          <div className="flex flex-col items-center gap-2">
            <motion.div
              animate={{
                backgroundColor: i < current ? '#4C7F2A' : i === current ? '#4C7F2A' : '#E5E7EB',
                scale: i === current ? 1.1 : 1,
              }}
              className={clsx(
                'flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-white',
                i > current && 'text-ink-muted',
              )}
              style={{ backgroundColor: i <= current ? '#4C7F2A' : '#E5E7EB', color: i <= current ? '#fff' : '#6B7280' }}
            >
              {i < current ? <Check size={16} /> : i + 1}
            </motion.div>
            <span className={clsx('text-xs font-medium', i <= current ? 'text-ink' : 'text-ink-muted')}>{label}</span>
          </div>
          {i < steps.length - 1 && (
            <div className="mx-3 h-0.5 flex-1 bg-ink/10">
              <motion.div
                className="h-full bg-primary"
                initial={{ width: '0%' }}
                animate={{ width: i < current ? '100%' : '0%' }}
                transition={{ duration: 0.4 }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
