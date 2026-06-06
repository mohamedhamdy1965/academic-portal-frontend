import { useTranslation } from 'react-i18next'
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
  const { t } = useTranslation()

  const getDeptOptionLabel = (val: string) => {
    if (val === 'General') return t('common.general')
    const mapping: Record<string, string> = {
      IS: t('common.general') === 'عام' ? 'IS — نظم المعلومات' : 'IS — Information Systems',
      IT: t('common.general') === 'عام' ? 'IT — تكنولوجيا المعلومات' : 'IT — Information Technology',
      AI: t('common.general') === 'عام' ? 'AI — الذكاء الاصطناعي' : 'AI — Artificial Intelligence',
      CS: t('common.general') === 'عام' ? 'CS — علوم الحاسب' : 'CS — Computer Science',
    }
    return mapping[val] || val
  }

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
          <CardTitle>{t('dashboard.preferredDept')}</CardTitle>
          <p style={{ color: 'var(--muted)', fontSize: '.8rem', marginTop: '-.65rem' }}>
            {t('dashboard.preferredDeptDesc')}
          </p>
        </div>
        {isPending && <Spinner size={16} />}
      </div>

      <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap' }}>
        {PREFERRED_DEPT_OPTIONS.map(({ value }) => {
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
              {getDeptOptionLabel(value)}
            </button>
          )
        })}
      </div>
    </Card>
  )
}
