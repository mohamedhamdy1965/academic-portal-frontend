import type { ReactNode, CSSProperties } from 'react'

// ─── Card ──────────────────────────────────────────────────────────────────────

interface CardProps {
  children: ReactNode
  style?: CSSProperties
  className?: string
}

export function Card({ children, style, className = '' }: CardProps) {
  return (
    <div
      className={`card-ui ${className}`}
      style={{
        background: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: 15,
        padding: '1.4rem',
        ...style,
      }}
    >
      {children}
    </div>
  )
}

export function CardTitle({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        fontFamily: 'Tajawal, sans-serif',
        fontSize: '.95rem',
        fontWeight: 700,
        marginBottom: '1.1rem',
      }}
    >
      {children}
    </div>
  )
}

// ─── StatCard ──────────────────────────────────────────────────────────────────

interface StatCardProps {
  icon: string
  value: string | number
  label: string
  color?: string
}

export function StatCard({ icon, value, label, color }: StatCardProps) {
  return (
    <Card
      className="stat-card-hover"
      style={{ cursor: 'default' }}
    >
      <div style={{ fontSize: '1.7rem', marginBottom: '.65rem' }}>{icon}</div>
      <div
        style={{
          fontFamily: 'Tajawal, sans-serif',
          fontSize: '1.9rem',
          fontWeight: 800,
          lineHeight: 1,
          color: color,
        }}
      >
        {value}
      </div>
      <div style={{ color: 'var(--muted)', fontSize: '.8rem', marginTop: '.25rem' }}>
        {label}
      </div>
    </Card>
  )
}

// ─── Alert ─────────────────────────────────────────────────────────────────────

type AlertType = 'error' | 'success' | 'info' | 'warning'

const ALERT_STYLES: Record<AlertType, CSSProperties> = {
  error:   { background: 'rgba(239,68,68,.08)',  borderColor: 'rgba(239,68,68,.25)',  color: '#fca5a5' },
  success: { background: 'rgba(34,197,94,.08)',  borderColor: 'rgba(34,197,94,.25)',  color: '#86efac' },
  info:    { background: 'rgba(59,130,246,.08)', borderColor: 'rgba(59,130,246,.25)', color: '#93c5fd' },
  warning: { background: 'rgba(245,158,11,.08)', borderColor: 'rgba(245,158,11,.25)', color: '#fcd34d' },
}

export function Alert({ type = 'info', children }: { type?: AlertType; children: ReactNode }) {
  const s = ALERT_STYLES[type]
  return (
    <div
      role="alert"
      style={{
        border: `1px solid ${s.borderColor as string}`,
        borderRadius: 10,
        padding: '.7rem 1rem',
        fontSize: '.86rem',
        marginBottom: '1rem',
        ...s,
      }}
    >
      {children}
    </div>
  )
}

// ─── Badge ─────────────────────────────────────────────────────────────────────

export function Badge({ children, color = 'var(--accent)' }: { children: ReactNode; color?: string }) {
  return (
    <span
      style={{
        display: 'inline-block',
        background: `${color}1a`,
        color,
        border: `1px solid ${color}33`,
        borderRadius: 6,
        padding: '.2rem .6rem',
        fontSize: '.76rem',
        fontWeight: 700,
      }}
    >
      {children}
    </span>
  )
}

// ─── Empty State ───────────────────────────────────────────────────────────────

export function EmptyState({ icon = '📭', message, action }: {
  icon?: string
  message: string
  action?: ReactNode
}) {
  return (
    <div
      style={{
        textAlign: 'center',
        padding: '3.5rem 2rem',
        color: 'var(--muted)',
      }}
    >
      <div style={{ fontSize: '3rem', marginBottom: '.8rem' }}>{icon}</div>
      <p style={{ fontSize: '.9rem', maxWidth: 340, margin: '0 auto .8rem' }}>{message}</p>
      {action}
    </div>
  )
}
