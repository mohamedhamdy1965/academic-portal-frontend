import { useTranslation } from 'react-i18next'
import type { AdminAnalytics } from '@/shared/types'

export function AdminAnalyticsCards({ analytics }: { analytics: AdminAnalytics }) {
  const { t } = useTranslation()
  const cards = [
    { label: t('admin.analytics.totalStudents') || t('admin.studentName'), value: analytics.totalStudents, color: 'var(--accent)' },
    { label: t('admin.analytics.activeCourses'), value: analytics.activeCourses, color: 'var(--success)' },
    { label: t('admin.analytics.inactiveCourses'), value: analytics.inactiveCourses, color: 'var(--gold)' },
    { label: t('admin.analytics.averageGpa'), value: analytics.averageGpa.toFixed(2), color: 'var(--accent2)' },
    { label: t('admin.analytics.atRiskStudents'), value: analytics.atRiskStudents, color: analytics.atRiskStudents ? 'var(--danger)' : 'var(--muted2)' },
  ]

  return (
    <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
      {cards.map((card) => (
        <div
          key={card.label}
          style={{
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 14,
            padding: '1rem',
            minHeight: 112,
          }}
        >
          <div style={{ color: 'var(--muted)', fontSize: '.76rem', fontWeight: 800 }}>{card.label}</div>
          <div style={{ color: card.color, fontFamily: 'Tajawal, sans-serif', fontSize: '1.85rem', fontWeight: 900, marginTop: '.65rem', lineHeight: 1 }}>
            {card.value}
          </div>
        </div>
      ))}
    </section>
  )
}
