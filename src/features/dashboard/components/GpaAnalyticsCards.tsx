import { useTranslation } from 'react-i18next'
import { GRADUATION_HOURS } from '@/shared/constants'

interface GpaAnalyticsCardsProps {
  gpa: number
  hours: number
  passedCount: number
  failedCount: number
  progress: number
  standing: { label: string; color: string }
}

export function GpaAnalyticsCards({
  gpa,
  hours,
  passedCount,
  failedCount,
  progress,
  standing,
}: GpaAnalyticsCardsProps) {
  const { t } = useTranslation()

  return (
    <section
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '1rem',
        marginBottom: '1.35rem',
      }}
    >
      <AnalyticsCard
        icon="★"
        label={t('dashboard.gpa')}
        value={gpa ? gpa.toFixed(2) : '0.00'}
        sublabel={gpa > 0 ? t(`standing.${standing.label}`) : t('dashboard.gpaEmpty')}
        color={standing.color}
      />
      <AnalyticsCard
        icon="▣"
        label={t('dashboard.hoursPassed')}
        value={hours}
        sublabel={t('dashboard.hoursFrom', { total: GRADUATION_HOURS })}
        color="var(--accent)"
        progress={progress}
      />
      <AnalyticsCard
        icon="✓"
        label={t('dashboard.passedCourses')}
        value={passedCount}
        sublabel={t('dashboard.passedCoursesSub')}
        color="var(--success)"
      />
      <AnalyticsCard
        icon="!"
        label={t('dashboard.failedCourses')}
        value={failedCount}
        sublabel={failedCount ? t('dashboard.failedCoursesSub') : t('dashboard.noFailedCourses')}
        color={failedCount ? 'var(--danger)' : 'var(--muted2)'}
      />
    </section>
  )
}

function AnalyticsCard({
  icon,
  label,
  value,
  sublabel,
  color,
  progress,
}: {
  icon: string
  label: string
  value: string | number
  sublabel: string
  color: string
  progress?: number
}) {
  return (
    <div
      style={{
        background: 'var(--card)',
        border: '1px solid var(--border)',
        borderRadius: 14,
        padding: '1.05rem 1.1rem',
        minHeight: 138,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '.75rem' }}>
        <div style={{ color: 'var(--muted)', fontSize: '.78rem', fontWeight: 700 }}>{label}</div>
        <span
          style={{
            width: 30,
            height: 30,
            borderRadius: 8,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: `${color}18`,
            color,
            border: `1px solid ${color}30`,
            fontWeight: 900,
          }}
        >
          {icon}
        </span>
      </div>
      <div
        style={{
          fontFamily: 'Tajawal, sans-serif',
          fontSize: '1.8rem',
          lineHeight: 1,
          fontWeight: 900,
          color,
          marginTop: '.75rem',
        }}
      >
        {value}
      </div>
      <div style={{ color: 'var(--muted2)', fontSize: '.76rem', marginTop: '.35rem' }}>{sublabel}</div>
      {progress !== undefined && (
        <div style={{ marginTop: '.75rem' }}>
          <div style={{ height: 5, background: 'var(--border)', borderRadius: 4, overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                width: `${progress}%`,
                background: 'linear-gradient(90deg, var(--accent), var(--accent2))',
                borderRadius: 4,
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}
