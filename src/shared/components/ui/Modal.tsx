import type { ReactNode, CSSProperties } from 'react'
import { Button } from './Button'

interface ModalProps {
  open: boolean
  title: string
  children: ReactNode
  onClose: () => void
  footer?: ReactNode
  maxWidth?: number
}

export function Modal({ open, title, children, onClose, footer, maxWidth = 460 }: ModalProps) {
  if (!open) return null

  return (
    <div
      role="presentation"
      onMouseDown={onClose}
      className="modal-overlay"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        background: 'rgba(0,0,0,.65)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onMouseDown={(event) => event.stopPropagation()}
        className="modal-content-ui"
        style={{
          width: '100%',
          maxWidth,
          background: 'var(--card)',
          border: '1px solid var(--border)',
          borderRadius: 14,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            padding: '1rem 1.15rem',
            borderBottom: '1px solid var(--border)',
          }}
        >
          <div
            style={{
              fontFamily: 'Tajawal, sans-serif',
              fontSize: '.98rem',
              fontWeight: 800,
            }}
          >
            {title}
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            style={{
              width: 30,
              height: 30,
              borderRadius: 8,
              border: '1px solid var(--border)',
              background: 'var(--surface)',
              color: 'var(--muted2)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontFamily: 'Cairo, sans-serif',
            }}
          >
            x
          </button>
        </div>

        <div style={{ padding: '1.15rem' }}>{children}</div>

        {footer && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              gap: '.65rem',
              padding: '1rem 1.15rem',
              borderTop: '1px solid var(--border)',
              background: 'rgba(15,23,42,.42)',
            }}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel,
  cancelLabel = 'إلغاء',
  loading = false,
  onConfirm,
  onClose,
}: {
  open: boolean
  title: string
  message: string
  confirmLabel: string
  cancelLabel?: string
  loading?: boolean
  onConfirm: () => void
  onClose: () => void
}) {
  return (
    <Modal
      open={open}
      title={title}
      onClose={onClose}
      maxWidth={420}
      footer={
        <>
          <Button variant="danger" size="md" loading={loading} onClick={onConfirm}>
            {confirmLabel}
          </Button>
          <Button variant="ghost" size="md" onClick={onClose} disabled={loading}>
            {cancelLabel}
          </Button>
        </>
      }
    >
      <p style={dialogMessageStyle}>{message}</p>
    </Modal>
  )
}

const dialogMessageStyle: CSSProperties = {
  color: 'var(--muted2)',
  fontSize: '.9rem',
  lineHeight: 1.8,
}
