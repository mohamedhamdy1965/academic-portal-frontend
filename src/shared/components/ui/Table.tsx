import type { ReactNode, CSSProperties } from 'react'

export const TABLE_TH: CSSProperties = {
  textAlign: 'right',
  padding: '.68rem .9rem',
  fontSize: '.76rem',
  color: 'var(--muted)',
  fontWeight: 700,
  borderBottom: '1px solid var(--border)',
  background: 'var(--surface)',
  whiteSpace: 'nowrap',
}

export const TABLE_TD: CSSProperties = {
  padding: '.78rem .9rem',
  borderBottom: '1px solid rgba(30,41,59,.4)',
  fontSize: '.85rem',
}

export function Table({ headers, children }: { headers: string[]; children: ReactNode }) {
  return (
    <div className="table-container">
      <table className="table-ui">
        <thead>
          <tr>
            {headers.map((h) => (
              <th key={h} style={TABLE_TH}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  )
}

export function HoverRow({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <tr style={style}>
      {children}
    </tr>
  )
}
