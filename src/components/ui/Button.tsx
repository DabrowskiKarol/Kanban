import type { ButtonHTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost'
}

export function Button({
  className,
  variant = 'primary',
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        variant === 'primary' && 'premium-button',
        variant === 'secondary' && 'premium-button-secondary',
        variant === 'ghost' &&
          'inline-flex items-center justify-center rounded-2xl px-4 py-3 text-sm font-medium text-copy transition hover:bg-white/60 hover:text-ink',
        'disabled:pointer-events-none disabled:opacity-60',
        className,
      )}
      type={type}
      {...props}
    />
  )
}
