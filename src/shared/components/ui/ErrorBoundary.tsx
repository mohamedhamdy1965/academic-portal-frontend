import { Component, type ReactNode, type ErrorInfo } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    if (import.meta.env.DEV) {
      console.error('ErrorBoundary caught:', error, info)
    }
  }

  render() {
    if (!this.state.hasError) return this.props.children

    if (this.props.fallback) return this.props.fallback

    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: '1rem',
          padding: '2rem',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: '3rem' }}>⚠️</div>
        <h2
          style={{
            fontFamily: 'Tajawal, sans-serif',
            fontSize: '1.3rem',
            fontWeight: 800,
            color: 'var(--text)',
          }}
        >
          حدث خطأ غير متوقع
        </h2>
        {import.meta.env.DEV && this.state.error && (
          <p style={{ color: 'var(--muted)', fontSize: '.9rem', maxWidth: 400 }}>
            {this.state.error.message}
          </p>
        )}
        <button
          onClick={() => {
            this.setState({ hasError: false, error: null })
            window.location.href = '/dashboard'
          }}
          style={{
            padding: '.75rem 2rem',
            border: 'none',
            borderRadius: 12,
            background: 'var(--accent)',
            color: '#fff',
            fontWeight: 700,
            cursor: 'pointer',
            fontFamily: 'Cairo, sans-serif',
            fontSize: '.92rem',
          }}
        >
          العودة للرئيسية
        </button>
      </div>
    )
  }
}
