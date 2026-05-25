import { DEPT_COLORS, PREFERRED_DEPT_OPTIONS } from '@/shared/constants'
import { Card, CardTitle } from '@/shared/components/ui/Card'
import { Spinner } from '@/shared/components/ui/Spinner'
import type { PreferredDepartment } from '@/shared/types'

export function PreferredDepartmentSelector({
  current,
  isPending,
  onSelect,
}: {
  current: PreferredDepartment
  isPending: boolean
  onSelect: (department: PreferredDepartment) => void
}) {
  return (
    <Card>
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: '.75rem',
          marginBottom: '.75rem',
        }}
      >
        <div>
          <CardTitle>القسم المفضل</CardTitle>
          <p style={{ color: 'var(--muted)', fontSize: '.8rem', marginTop: '-.65rem' }}>
            يؤثر الاختيار على توصيات الخطة الأكاديمية.
          </p>
        </div>
        {isPending && <Spinner size={16} />}
      </div>

      <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap' }}>
        {PREFERRED_DEPT_OPTIONS.map(({ value, label }) => {
          const color = DEPT_COLORS[value as keyof typeof DEPT_COLORS] ?? 'var(--accent)'
          const active = current === value

          return (
            <button
              key={value}
              type="button"
              onClick={() => onSelect(value)}
              disabled={isPending}
              style={{
                minHeight: 34,
                padding: '.34rem .75rem',
                borderRadius: 8,
                border: `1px solid ${active ? color : 'var(--border)'}`,
                background: active ? `${color}20` : 'var(--surface)',
                color: active ? color : 'var(--muted2)',
                fontSize: '.78rem',
                fontWeight: 800,
                fontFamily: 'Cairo, sans-serif',
                opacity: isPending ? 0.65 : 1,
              }}
            >
              {label}
            </button>
          )
        })}
      </div>
    </Card>
  )
}
