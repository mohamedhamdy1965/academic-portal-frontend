import type { ButtonHTMLAttributes, ReactNode, CSSProperties } from 'react'
import { Spinner } from './Spinner'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'danger' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  fullWidth?: boolean
  children: ReactNode
}

const variantStyles: Record<NonNullable<ButtonProps['variant']>, CSSProperties> = {
  primary: {
    background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
    color: '#fff',
    border: 'none',
    boxShadow: '0 4px 20px rgba(59,130,246,.35)',
  },
  ghost: {
    background: 'transparent',
    color: 'var(--muted2)',
    border: '1px solid var(--border)',
  },
  danger: {
    background: 'transparent',
    color: 'var(--danger)',
    border: '1px solid rgba(239,68,68,.3)',
  },
  outline: {
    background: 'var(--surface)',
    color: 'var(--muted2)',
    border: '1px solid var(--border)',
  },
}

const sizeStyles: Record<NonNullable<ButtonProps['size']>, CSSProperties> = {
  sm:  { padding: '.28rem .65rem', fontSize: '.82rem', borderRadius: 8 },
  md:  { padding: '.65rem 1.2rem', fontSize: '.9rem',  borderRadius: 11 },
  lg:  { padding: '.88rem 1.6rem', fontSize: '.98rem', borderRadius: 12 },
}

export function Button({
  variant = 'ghost',
  size    = 'md',
  loading = false,
  fullWidth = false,
  children,
  disabled,
  style,
  className = '',
  ...rest
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={`btn-ui btn-${variant} btn-${size} ${className}`}
      style={{
        cursor: disabled || loading ? 'not-allowed' : 'pointer',
        opacity: disabled || loading ? 0.65 : 1,
        width: fullWidth ? '100%' : undefined,
        ...style,
      }}
      {...rest}
    >
      {loading ? <Spinner size={size === 'sm' ? 14 : 18} color="#fff" /> : children}
    </button>
  )
}
