import { useTranslation } from 'react-i18next'
import { Card, CardTitle, EmptyState } from '@/shared/components/ui/Card'
import type { AIPlanCourse, EnrolledCourse } from '@/shared/types'

interface AiRecommendationSectionProps {
  plan: AIPlanCourse[]
  courses: EnrolledCourse[]
}

export function AiRecommendationSection({ plan, courses }: AiRecommendationSectionProps) {
  const { t } = useTranslation()
  const passedCodes = new Set(courses.filter((course) => course.grade >= 60).map((course) => course.courseCode))

  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '.75rem', flexWrap: 'wrap' }}>
        <div>
          <CardTitle>{t('dashboard.recommendations')}</CardTitle>
          <p style={{ color: 'var(--muted)', fontSize: '.8rem', marginTop: '-.65rem', marginBottom: '1rem' }}>
            {t('dashboard.recommendationsDesc')}
          </p>
        </div>
        {plan.length > 0 && (
          <span style={{ color: 'var(--accent)', fontWeight: 800, fontSize: '.8rem' }}>
            {t('dashboard.recommendationsCount', { count: plan.length })}
          </span>
        )}
      </div>

      {plan.length === 0 ? (
        <EmptyState
          icon="◎"
          message={t('dashboard.recommendationsEmpty')}
        />
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
            gap: '.7rem',
          }}
        >
          {plan.map((course) => (
            <RecommendationCard
              key={course.courseCode}
              course={course}
              completed={passedCodes.has(course.courseCode)}
            />
          ))}
        </div>
      )}
    </Card>
  )
}

function RecommendationCard({ course, completed }: { course: AIPlanCourse; completed: boolean }) {
  const { t } = useTranslation()

  return (
    <div
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 10,
        padding: '.85rem',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '.6rem' }}>
        <span
          style={{
            color: 'var(--accent)',
            background: 'rgba(59,130,246,.1)',
            border: '1px solid rgba(59,130,246,.18)',
            borderRadius: 6,
            padding: '.18rem .5rem',
            fontSize: '.72rem',
            fontWeight: 800,
          }}
        >
          {course.courseCode}
        </span>
        <span style={{ color: 'var(--gold)', fontSize: '.72rem', fontWeight: 800 }}>
          {t('dashboard.recommendationsHour', { count: course.creditHours ?? 3 })}
        </span>
      </div>
      <div style={{ fontSize: '.84rem', fontWeight: 700, lineHeight: 1.5, marginTop: '.55rem' }}>
        {course.courseName}
      </div>
      <div style={{ color: completed ? 'var(--success)' : 'var(--muted)', fontSize: '.72rem', marginTop: '.45rem' }}>
        {completed ? t('dashboard.completedLabel') : t('dashboard.suitableLabel')}
      </div>
    </div>
  )
}
