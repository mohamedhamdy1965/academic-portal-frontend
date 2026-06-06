import { useTranslation } from 'react-i18next'
import type { SuperAdminAnalytics } from '@/shared/types'

export function SuperAdminAnalyticsCards({ analytics }: { analytics: SuperAdminAnalytics }) {
  const { t } = useTranslation()
  const cards = [
    { label: t('admin.analytics.totalStudents') || t('admin.studentName'), value: analytics.totalStudents, color: 'var(--accent)' },
    { label: t('super.totalAdmins'), value: analytics.totalAdmins, color: 'var(--accent2)' },
    { label: t('super.totalCourses'), value: analytics.totalCourses, color: 'var(--gold)' },
    { label: t('super.activeAccounts'), value: analytics.activeAccounts, color: 'var(--success)' },
  ]

  return (
    <section
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '1rem',
        marginBottom: '1.25rem',
      }}
      aria-label={t('super.systemStats')}
    >
      {cards.map((card) => (
        <div
          key={card.label}
          style={{
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 14,
            padding: '1.15rem',
            minHeight: 112,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ color: 'var(--muted)', fontSize: '.76rem', fontWeight: 800 }}>{card.label}</div>
          <div
            style={{
              color: card.color,
              fontFamily: 'Tajawal, sans-serif',
              fontSize: '1.95rem',
              fontWeight: 900,
              marginTop: '.65rem',
              lineHeight: 1,
            }}
          >
            {card.value}
          </div>
        </div>
      ))}
    </section>
  )
}
