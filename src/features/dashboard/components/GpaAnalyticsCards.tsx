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
        label="المعدل التراكمي"
        value={gpa ? gpa.toFixed(2) : '0.00'}
        sublabel={gpa > 0 ? standing.label : 'لا يوجد معدل بعد'}
        color={standing.color}
      />
      <AnalyticsCard
        icon="▣"
        label="الساعات المجتازة"
        value={hours}
        sublabel={`من ${GRADUATION_HOURS} ساعة`}
        color="var(--accent)"
        progress={progress}
      />
      <AnalyticsCard
        icon="✓"
        label="مواد ناجحة"
        value={passedCount}
        sublabel="ضمن السجل الحالي"
        color="var(--success)"
      />
      <AnalyticsCard
        icon="!"
        label="مواد تحتاج متابعة"
        value={failedCount}
        sublabel={failedCount ? 'راجع خطة التعويض' : 'لا توجد مواد راسبة'}
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
