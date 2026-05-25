import { forwardRef, type InputHTMLAttributes, type SelectHTMLAttributes, type ReactNode, type CSSProperties } from 'react'

// ─── Base styles ───────────────────────────────────────────────────────────────

const baseInputStyle: CSSProperties = {
  width: '100%',
  padding: '.82rem 1rem',
  background: 'rgba(255,255,255,.04)',
  border: '1px solid rgba(255,255,255,.08)',
  borderRadius: 12,
  color: 'var(--text)',
  fontSize: '.92rem',
  outline: 'none',
  fontFamily: 'Cairo, sans-serif',
  transition: 'border-color .2s, background .2s, box-shadow .2s',
  boxSizing: 'border-box',
}

// ─── Input ─────────────────────────────────────────────────────────────────────

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ error, style, className = '', ...rest }, ref) => (
    <div style={{ width: '100%' }}>
      <input
        ref={ref}
        className={`input-ui ${error ? 'input-error' : ''} ${className}`}
        style={style}
        {...rest}
      />
      {error && (
        <p style={{ color: '#fca5a5', fontSize: '.78rem', marginTop: '.3rem', margin: '.3rem 0 0' }}>
          {error}
        </p>
      )}
    </div>
  ),
)
Input.displayName = 'Input'

// ─── Select ────────────────────────────────────────────────────────────────────

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  error?: string
  children: ReactNode
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ error, children, style, className = '', ...rest }, ref) => (
    <div style={{ width: '100%' }}>
      <select
        ref={ref}
        className={`input-ui ${error ? 'input-error' : ''} ${className}`}
        style={{
          cursor: 'pointer',
          ...style,
        }}
        {...rest}
      >
        {children}
      </select>
      {error && (
        <p style={{ color: '#fca5a5', fontSize: '.78rem', margin: '.3rem 0 0' }}>
          {error}
        </p>
      )}
    </div>
  ),
)
Select.displayName = 'Select'

// ─── Field wrapper ─────────────────────────────────────────────────────────────

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div style={{ marginBottom: '1.1rem' }}>
      <label
        style={{
          display: 'block',
          fontSize: '.82rem',
          color: 'var(--muted2)',
          marginBottom: '.4rem',
          fontWeight: 600,
        }}
      >
        {label}
      </label>
      {children}
    </div>
  )
}
