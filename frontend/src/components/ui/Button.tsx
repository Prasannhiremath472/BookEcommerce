import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { motion, type HTMLMotionProps } from 'framer-motion'
import clsx from 'clsx'

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'dark'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onDrag' | 'onDragStart' | 'onDragEnd' | 'onAnimationStart'> {
  variant?: Variant
  size?: Size
}

const variantStyles: Record<Variant, string> = {
  primary: 'bg-gradient-primary text-white shadow-glow hover:brightness-110',
  secondary: 'bg-secondary text-white hover:bg-secondary-600',
  outline: 'border-2 border-ink/15 text-ink hover:border-primary hover:text-primary bg-transparent',
  ghost: 'bg-transparent text-ink hover:bg-ink/5',
  dark: 'bg-ink text-white hover:bg-ink-soft',
}

const sizeStyles: Record<Size, string> = {
  sm: 'px-4 py-2 text-sm rounded-full',
  md: 'px-6 py-3 text-sm rounded-full',
  lg: 'px-8 py-4 text-base rounded-full',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps & HTMLMotionProps<'button'>>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        className={clsx(
          'relative inline-flex items-center justify-center gap-2 font-semibold font-body transition-colors duration-200 disabled:opacity-50 disabled:pointer-events-none',
          variantStyles[variant],
          sizeStyles[size],
          className,
        )}
        {...props}
      >
        {children}
      </motion.button>
    )
  },
)
Button.displayName = 'Button'
