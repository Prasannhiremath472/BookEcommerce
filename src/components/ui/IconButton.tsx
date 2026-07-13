import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { motion, type HTMLMotionProps } from 'framer-motion'
import clsx from 'clsx'

interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart'> {
  active?: boolean
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps & HTMLMotionProps<'button'>>(
  ({ className, active, children, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        className={clsx(
          'relative inline-flex h-10 w-10 items-center justify-center rounded-full transition-colors',
          active ? 'bg-primary-50 text-primary' : 'text-ink-soft hover:bg-ink/5',
          className,
        )}
        {...props}
      >
        {children}
      </motion.button>
    )
  },
)
IconButton.displayName = 'IconButton'
