interface SpinnerProps {
  size?: number
  color?: string
}

export function Spinner({ size = 22, color = 'var(--accent)' }: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label="جاري التحميل"
      style={{
        display: 'inline-block',
        width: size,
        height: size,
        border: '2px solid rgba(255,255,255,.12)',
        borderTopColor: color,
        borderRadius: '50%',
        animation: 'spin .7s linear infinite',
        flexShrink: 0,
      }}
    />
  )
}

export function PageLoader({ message = 'جاري التحميل...' }: { message?: string }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 220,
        flexDirection: 'column',
        gap: '.85rem',
        color: 'var(--muted)',
      }}
    >
      <Spinner />
      <span style={{ fontSize: '.85rem' }}>{message}</span>
    </div>
  )
}

export function SkeletonBlock({ height = 14, width = '100%', radius = 6 }: {
  height?: number
  width?: number | string
  radius?: number
}) {
  return (
    <div
      aria-hidden="true"
      className="skeleton-block"
      style={{
        height,
        width,
        borderRadius: radius,
      }}
    />
  )
}

export function SkeletonRow({ cols = 5 }: { cols?: number }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} style={{ padding: '.78rem .9rem' }}>
          <SkeletonBlock />
        </td>
      ))}
    </tr>
  )
}
