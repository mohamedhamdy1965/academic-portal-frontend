import { GRADUATION_HOURS } from '@/shared/constants'
import { Card, CardTitle } from '@/shared/components/ui/Card'

interface GraduationProgressSectionProps {
  hours: number
  progress: number
  remaining: number
  passedCount: number
  failedCount: number
}

export function GraduationProgressSection({
  hours,
  progress,
  remaining,
  passedCount,
  failedCount,
}: GraduationProgressSectionProps) {
  return (
    <Card>
      <CardTitle>تقدم التخرج</CardTitle>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.1rem' }}>
        <div
          style={{
            width: 86,
            height: 86,
            borderRadius: '50%',
            background: `conic-gradient(var(--accent) ${progress * 3.6}deg, rgba(30,41,59,.7) 0deg)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: 62,
              height: 62,
              borderRadius: '50%',
              background: 'var(--card)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
            }}
          >
            <strong style={{ color: 'var(--accent)', fontSize: '1rem', lineHeight: 1 }}>{progress}%</strong>
            <span style={{ color: 'var(--muted)', fontSize: '.62rem' }}>مكتمل</span>
          </div>
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: '.8rem',
              color: 'var(--muted2)',
              fontSize: '.8rem',
              marginBottom: '.55rem',
            }}
          >
            <span>{hours} / {GRADUATION_HOURS} ساعة</span>
            <span>يتبقى {remaining} ساعة</span>
          </div>
          <div style={{ height: 8, background: 'var(--border)', borderRadius: 5, overflow: 'hidden' }}>
            <div
              style={{
                height: '100%',
                width: `${progress}%`,
                borderRadius: 5,
                background: 'linear-gradient(90deg, var(--accent), var(--accent2))',
              }}
            />
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '.65rem',
              marginTop: '1rem',
            }}
          >
            <MiniProgressStat label="مواد ناجحة" value={passedCount} color="var(--success)" />
            <MiniProgressStat label="مواد للمتابعة" value={failedCount} color={failedCount ? 'var(--danger)' : 'var(--muted)'} />
          </div>
        </div>
      </div>
    </Card>
  )
}

function MiniProgressStat({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 9,
        padding: '.65rem .75rem',
      }}
    >
      <div style={{ color, fontWeight: 900, fontSize: '1.15rem', lineHeight: 1 }}>{value}</div>
      <div style={{ color: 'var(--muted)', fontSize: '.72rem', marginTop: '.22rem' }}>{label}</div>
    </div>
  )
}
