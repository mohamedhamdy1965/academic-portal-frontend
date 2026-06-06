import { useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useProfile } from '@/shared/hooks/useProfile'
import { queryKeys } from '@/shared/api/queryKeys'
import { toast } from '@/providers/ToastProvider'
import { COURSES_RAW } from '@/shared/constants/curriculum'
import { Card, CardTitle, EmptyState } from '@/shared/components/ui/Card'
import { Button } from '@/shared/components/ui/Button'
import { PageLoader } from '@/shared/components/ui/Spinner'
import type { AIPlanCourse } from '@/shared/types'

// ─── Semester slot grouping ────────────────────────────────────────────────────
// The AI plan is a flat list of recommended courses. We enrich it by:
//   1. Looking up each course in COURSES_RAW to get semester affinity (sem: '1'|'2'|'x')
//   2. Grouping into "recommended next", "first semester", "second semester", "open"
// This gives the plan a schedule shape rather than a generic numbered list.

interface SemesterGroup {
  label: string
  sublabel: string
  color: string
  icon: string
  courses: EnrichedCourse[]
}

interface EnrichedCourse extends AIPlanCourse {
  sem: '1' | '2' | 'x'
  prereqs: string[]
}

function enrichAndGroup(
  plan: AIPlanCourse[],
  passedCodes: Set<string>,
  t: (key: string) => string
): SemesterGroup[] {
  // Enrich each plan course with static curriculum metadata
  const enriched: EnrichedCourse[] = plan.map((c) => {
    const meta = COURSES_RAW.find((r) => r.code === c.courseCode)
    return {
      ...c,
      sem: meta?.sem ?? 'x',
      prereqs: meta?.prereqs ?? [],
    }
  })

  // A course is "immediately available" if all its prereqs are already passed
  const available  = enriched.filter((c) => c.prereqs.every((p) => passedCodes.has(p)))
  const semester1  = enriched.filter((c) => c.sem === '1' && !available.includes(c))
  const semester2  = enriched.filter((c) => c.sem === '2' && !available.includes(c))
  const open       = enriched.filter(
    (c) => c.sem === 'x' && !available.includes(c),
  )

  const groups: SemesterGroup[] = []

  if (available.length > 0) {
    groups.push({
      label: t('aiplan.availableLabel'),
      sublabel: t('aiplan.availableDesc'),
      color: 'var(--success)',
      icon: '✅',
      courses: available,
    })
  }
  if (semester1.length > 0) {
    groups.push({
      label: t('aiplan.semester1Label'),
      sublabel: t('aiplan.semester1Desc'),
      color: 'var(--accent)',
      icon: '📘',
      courses: semester1,
    })
  }
  if (semester2.length > 0) {
    groups.push({
      label: t('aiplan.semester2Label'),
      sublabel: t('aiplan.semester2Desc'),
      color: 'var(--accent2)',
      icon: '📗',
      courses: semester2,
    })
  }
  if (open.length > 0) {
    groups.push({
      label: t('aiplan.electiveLabel'),
      sublabel: t('aiplan.electiveDesc'),
      color: 'var(--gold)',
      icon: '📙',
      courses: open,
    })
  }

  return groups
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function AIPlanPage() {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const { data: profile, isLoading, isFetching } = useProfile()

  const plan        = profile?.AI_plan?.plan ?? []
  const passedCodes = new Set(
    (profile?.enrolledCourses ?? [])
      .filter((c) => c.grade >= 60)
      .map((c) => c.courseCode),
  )

  const handleRefresh = async () => {
    await queryClient.invalidateQueries({ queryKey: queryKeys.user.profile() })
    const fresh = queryClient.getQueryData<typeof profile>(queryKeys.user.profile())
    if (!fresh?.AI_plan?.plan?.length) {
      toast(t('aiplan.toastNotGenerated'), 'info')
    } else {
      toast(t('aiplan.toastUpdated'), 'success')
    }
  }

  if (isLoading && !profile) return <PageLoader />

  const groups       = enrichAndGroup(plan, passedCodes, t)
  const totalCredits = plan.reduce((s, c) => s + (c.creditHours ?? 3), 0)

  return (
    <div className="animate-in">

      {/* ── Page header card ──────────────────────────────────────────────── */}
      <Card style={{ marginBottom: '1.4rem' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '.75rem',
          }}
        >
          <div>
            <CardTitle>🤖 {t('aiplan.title')}</CardTitle>
            <p style={{ fontSize: '.83rem', color: 'var(--muted)', marginTop: '-.6rem' }}>
              {t('aiplan.desc')}
            </p>
          </div>
          <Button variant="ghost" size="sm" loading={isFetching} onClick={handleRefresh}>
            🔄 {t('aiplan.refreshBtn')}
          </Button>
        </div>

        {plan.length > 0 && (
          <div
            style={{
              display: 'flex',
              gap: '1.5rem',
              marginTop: '1rem',
              paddingTop: '1rem',
              borderTop: '1px solid var(--border)',
              flexWrap: 'wrap',
            }}
          >
            <PlanStat icon="📚" value={plan.length} label={t('aiplan.suggestedCourse')} />
            <PlanStat icon="⏱" value={totalCredits} label={t('aiplan.creditHour')} />
            <PlanStat
              icon="✅"
              value={groups.find((g) => g.label === t('aiplan.availableLabel'))?.courses.length ?? 0}
              label={t('aiplan.availableLabel')}
              color="var(--success)"
            />
          </div>
        )}
      </Card>

      {/* ── Plan content ──────────────────────────────────────────────────── */}
      {plan.length === 0 ? (
        <EmptyState
          icon="🤖"
          message={t('aiplan.emptyPlan')}
          action={
            <Button variant="primary" size="md" loading={isFetching} onClick={handleRefresh}>
              🔄 {t('aiplan.checkPlan')}
            </Button>
          }
        />
      ) : (
        groups.map((group) => (
          <SemesterGroupSection key={group.label} group={group} passedCodes={passedCodes} />
        ))
      )}
    </div>
  )
}

// ─── Stat pill ─────────────────────────────────────────────────────────────────

function PlanStat({ icon, value, label, color }: {
  icon: string
  value: number
  label: string
  color?: string
}) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '.4rem' }}>
      <span style={{ fontSize: '.95rem' }}>{icon}</span>
      <span
        style={{
          fontFamily: 'Tajawal, sans-serif',
          fontWeight: 800,
          fontSize: '1rem',
          color: color ?? 'var(--text)',
        }}
      >
        {value}
      </span>
      <span style={{ fontSize: '.8rem', color: 'var(--muted)' }}>{label}</span>
    </div>
  )
}

// ─── Semester group section ────────────────────────────────────────────────────

function SemesterGroupSection({
  group,
  passedCodes,
}: {
  group: SemesterGroup
  passedCodes: Set<string>
}) {
  const { t } = useTranslation()
  const semCredits = group.courses.reduce((s, c) => s + (c.creditHours ?? 3), 0)

  return (
    <div style={{ marginBottom: '1.6rem' }}>
      {/* Section header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '.85rem',
          marginBottom: '.9rem',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '.5rem',
            background: group.color + '18',
            border: `1px solid ${group.color}33`,
            borderRadius: 10,
            padding: '.35rem .9rem',
          }}
        >
          <span style={{ fontSize: '.9rem' }}>{group.icon}</span>
          <span
            style={{
              color: group.color,
              fontWeight: 800,
              fontSize: '.86rem',
              fontFamily: 'Tajawal, sans-serif',
            }}
          >
            {group.label}
          </span>
        </div>
        <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
        <span style={{ fontSize: '.75rem', color: 'var(--muted)', whiteSpace: 'nowrap' }}>
          {t('guest.courseCount', { count: group.courses.length })} · {t('guest.statsCreditsVal', { count: semCredits })}
        </span>
      </div>

      {/* Section sublabel */}
      <p style={{ fontSize: '.78rem', color: 'var(--muted)', marginBottom: '.85rem', marginTop: '-.3rem' }}>
        {group.sublabel}
      </p>

      {/* Course cards grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '.7rem',
        }}
      >
        {group.courses.map((course, i) => (
          <PlanCourseCard
            key={course.courseCode}
            course={course}
            groupColor={group.color}
            index={i}
            passedCodes={passedCodes}
          />
        ))}
      </div>
    </div>
  )
}

// ─── Course card ───────────────────────────────────────────────────────────────

function PlanCourseCard({
  course,
  groupColor,
  index,
  passedCodes,
}: {
  course: EnrichedCourse
  groupColor: string
  index: number
  passedCodes: Set<string>
}) {
  const { t } = useTranslation()
  // Show which prereqs are met vs pending
  const prereqStatus = course.prereqs.map((p) => ({
    code: p,
    met: passedCodes.has(p),
  }))
  const allMet = prereqStatus.every((p) => p.met)

  return (
    <div
      style={{
        background: 'var(--card)',
        border: `1px solid var(--border)`,
        borderRadius: 12,
        padding: '1rem 1.1rem',
        transition: 'border-color .2s, transform .2s',
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLDivElement
        el.style.borderColor = groupColor + '44'
        el.style.transform = 'translateY(-1px)'
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLDivElement
        el.style.borderColor = 'var(--border)'
        el.style.transform = 'translateY(0)'
      }}
    >
      {/* Top row: code + credit hours */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '.5rem',
        }}
      >
        <span
          style={{
            background: groupColor + '18',
            color: groupColor,
            border: `1px solid ${groupColor}33`,
            borderRadius: 6,
            padding: '.2rem .6rem',
            fontSize: '.73rem',
            fontWeight: 700,
          }}
        >
          {course.courseCode}
        </span>
        <span
          style={{
            background: 'rgba(245,158,11,.1)',
            color: 'var(--gold)',
            borderRadius: 6,
            padding: '.18rem .55rem',
            fontSize: '.72rem',
            fontWeight: 700,
          }}
        >
          {t('guest.statsCreditsVal', { count: course.creditHours ?? 3 })}
        </span>
      </div>

      {/* Course name */}
      <div
        style={{
          fontSize: '.87rem',
          fontWeight: 600,
          marginBottom: '.5rem',
          lineHeight: 1.4,
        }}
      >
        {course.courseName || course.courseCode}
      </div>

      {/* Prerequisites status — only shown if course has prereqs */}
      {prereqStatus.length > 0 && (
        <div style={{ display: 'flex', gap: '.3rem', flexWrap: 'wrap', marginTop: '.3rem' }}>
          {prereqStatus.map(({ code, met }) => (
            <span
              key={code}
              style={{
                fontSize: '.68rem',
                fontWeight: 600,
                padding: '.12rem .42rem',
                borderRadius: 4,
                background: met ? 'rgba(34,197,94,.1)' : 'rgba(100,116,139,.1)',
                color: met ? 'var(--success)' : 'var(--muted)',
                border: `1px solid ${met ? 'rgba(34,197,94,.2)' : 'rgba(100,116,139,.15)'}`,
              }}
            >
              {met ? '✓' : '○'} {code}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
