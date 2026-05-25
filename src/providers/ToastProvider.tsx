import { useState, useEffect, type ReactNode, type CSSProperties } from 'react'

// ─── Types ─────────────────────────────────────────────────────────────────────

export type ToastType = 'success' | 'error' | 'info' | 'warning'

interface ToastMessage {
  id: number
  msg: string
  type: ToastType
}

// ─── Global event bus ──────────────────────────────────────────────────────────

type ToastListener = (msg: string, type: ToastType) => void
let _listener: ToastListener | null = null

export function toast(msg: string, type: ToastType = 'info') {
  _listener?.(msg, type)
}

// ─── Toast styles ──────────────────────────────────────────────────────────────

const TYPE_STYLES: Record<ToastType, CSSProperties> = {
  success: { borderColor: 'rgba(34,197,94,.4)',   color: '#86efac' },
  error:   { borderColor: 'rgba(239,68,68,.4)',    color: '#fca5a5' },
  info:    { borderColor: 'rgba(59,130,246,.4)',   color: '#93c5fd' },
  warning: { borderColor: 'rgba(245,158,11,.4)',   color: '#fcd34d' },
}

const TYPE_ICONS: Record<ToastType, string> = {
  success: '✓',
  error:   '✕',
  info:    'ℹ',
  warning: '⚠',
}

// ─── Component ────────────────────────────────────────────────────────────────

let _counter = 0

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  useEffect(() => {
    _listener = (msg, type) => {
      const id = ++_counter
      setToasts((prev) => [...prev, { id, msg, type }])
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id))
      }, 3000)
    }
    return () => { _listener = null }
  }, [])

  return (
    <>
      {children}
      <div
        style={{
          position: 'fixed',
          bottom: '1.8rem',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: '.5rem',
          alignItems: 'center',
          pointerEvents: 'none',
        }}
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            className="toast-ui"
            style={{
              borderRadius: 11,
              padding: '.75rem 1.4rem',
              fontSize: '.88rem',
              fontWeight: 600,
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center',
              gap: '.6rem',
              animation: 'toastIn .35s cubic-bezier(.34, 1.56, .64, 1)',
              ...TYPE_STYLES[t.type],
            }}
          >
            <span style={{ fontSize: '.9rem', fontWeight: 900 }}>{TYPE_ICONS[t.type]}</span>
            {t.msg}
          </div>
        ))}
      </div>
      <style>{`
        @keyframes toastIn {
          from { opacity: 0; transform: translateY(12px) scale(.95); }
          to   { opacity: 1; transform: translateY(0)  scale(1); }
        }
      `}</style>
    </>
  )
}
