import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useProfile } from '@/shared/hooks/useProfile'
import { COURSES_RAW } from '@/shared/constants/curriculum'
import { Table, HoverRow, TABLE_TD } from '@/shared/components/ui/Table'
import type { Department, CurriculumCourse, CourseGroup } from '@/shared/types'

// ─── Constants ─────────────────────────────────────────────────────────────────

const DEPTS = ['IS', 'IT', 'AI', 'CS'] as const

const DEPT_COLOR_MAP: Record<Department, string> = {
  IS: 'var(--is)',
  IT: 'var(--it)',
  AI: 'var(--ai)',
  CS: 'var(--cs)',
}

// The ordered groups to display — determines section order in the curriculum view.
const BASE_GROUPS: CourseGroup[] = [
  'FACULTY_CORE',
  'UNIVERSITY_MANDATORY',
  'FACULTY_CHOOSE_3',
  'UNIVERSITY_CHOOSE_2',
]

// ─── Pure helpers ──────────────────────────────────────────────────────────────

function groupCourses(
  courses: CurriculumCourse[],
  dept: Department,
): Array<{ group: CourseGroup; courses: CurriculumCourse[]; isCore: boolean }> {
  const deptGroups: CourseGroup[] = [`${dept}_CORE`, `${dept}_ELECTIVE`]
  const allGroups = [...BASE_GROUPS, ...deptGroups]

  const seen = new Set<string>()
  const result: Array<{ group: CourseGroup; courses: CurriculumCourse[]; isCore: boolean }> = []

  for (const group of allGroups) {
    const section = courses.filter(
      (c) => c.groups.includes(group) && !seen.has(c.code),
    )
    if (section.length === 0) continue

    section.forEach((c) => seen.add(c.code))

    const isCore =
      group === 'FACULTY_CORE' ||
      group === 'UNIVERSITY_MANDATORY' ||
      group.endsWith('_CORE')

    result.push({ group, courses: section, isCore })
  }

  return result
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function CurriculumPage() {
  const { t } = useTranslation()
  const { data: profile } = useProfile()

  const [dept, setDept] = useState<Department>(
    () => (profile?.department as Department) ?? 'IS',
  )

  const passedCodes = useMemo<Set<string>>(
    () =>
      new Set(
        (profile?.enrolledCourses ?? [])
          .filter((c) => c.grade >= 60)
          .map((c) => c.courseCode),
      ),
    [profile?.enrolledCourses],
  )

  const sections = useMemo(
    () => groupCourses(COURSES_RAW, dept),
    [dept],
  )

  const getDeptLabel = (d: string) => {
    const mapping: Record<string, string> = {
      IS: t('common.general') === 'عام' ? 'نظم المعلومات' : 'Information Systems',
      IT: t('common.general') === 'عام' ? 'تكنولوجيا المعلومات' : 'Information Technology',
      AI: t('common.general') === 'عام' ? 'الذكاء الاصطناعي' : 'Artificial Intelligence',
      CS: t('common.general') === 'عام' ? 'علوم الحاسب' : 'Computer Science',
    }
    return mapping[d] || d
  }

  return (
    <div className="animate-in">
      {/* Dept tabs */}
      <div
        style={{ display: 'flex', gap: '.65rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}
        role="tablist"
        aria-label={t('login.department').replace(' *', '')}
      >
        {DEPTS.map((d) => {
          const active = dept === d
          const color  = DEPT_COLOR_MAP[d]
          return (
            <button
              key={d}
              role="tab"
              aria-selected={active}
              onClick={() => setDept(d)}
              style={{
                padding: '.48rem 1.15rem',
                borderRadius: 20,
                border: `1px solid ${active ? color : 'var(--border)'}`,
                background: active ? color : 'var(--card)',
                color: active ? '#fff' : 'var(--muted)',
                fontSize: '.86rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all .2s',
                boxShadow: active ? `0 4px 15px ${color}44` : 'none',
                fontFamily: 'Cairo, sans-serif',
              }}
            >
              {d} — {getDeptLabel(d)}
            </button>
          )
        })}
      </div>

      {/* Curriculum sections */}
      {sections.map(({ group, courses, isCore }) => (
        <CurriculumSection
          key={group}
          group={group}
          courses={courses}
          isCore={isCore}
          passedCodes={passedCodes}
        />
      ))}
    </div>
  )
}

// ─── Section ───────────────────────────────────────────────────────────────────

interface SectionProps {
  group: CourseGroup
  courses: CurriculumCourse[]
  isCore: boolean
  passedCodes: Set<string>
}

function CurriculumSection({ group, courses, isCore, passedCodes }: SectionProps) {
  const { t } = useTranslation()
  const totalCredits = courses.reduce((sum, c) => sum + c.credits, 0)

  const getGroupLabel = (g: string) => {
    const mapping: Record<string, string> = {
      FACULTY_CORE: t('common.general') === 'عام' ? 'متطلبات الكلية الإجبارية' : 'Faculty Mandatory Requirements',
      UNIVERSITY_MANDATORY: t('common.general') === 'عام' ? 'متطلبات الجامعة الإجبارية' : 'University Mandatory Requirements',
      FACULTY_CHOOSE_3: t('common.general') === 'عام' ? 'اختياري من متطلبات الكلية' : 'Faculty Elective Requirements (Choose 3)',
      UNIVERSITY_CHOOSE_2: t('common.general') === 'عام' ? 'اختياري من متطلبات الجامعة' : 'University Elective Requirements (Choose 2)',
      AI_CORE: t('common.general') === 'عام' ? 'متطلبات قسم AI الإجبارية' : 'AI Core Requirements',
      AI_ELECTIVE: t('common.general') === 'عام' ? 'اختيارية قسم AI' : 'AI Elective Requirements',
      CS_CORE: t('common.general') === 'عام' ? 'متطلبات قسم CS الإجبارية' : 'CS Core Requirements',
      CS_ELECTIVE: t('common.general') === 'عام' ? 'اختيارية قسم CS' : 'CS Elective Requirements',
      IS_CORE: t('common.general') === 'عام' ? 'متطلبات قسم IS الإجبارية' : 'IS Core Requirements',
      IS_ELECTIVE: t('common.general') === 'عام' ? 'اختيارية قسم IS' : 'IS Elective Requirements',
      IT_CORE: t('common.general') === 'عام' ? 'متطلبات قسم IT الإجبارية' : 'IT Core Requirements',
      IT_ELECTIVE: t('common.general') === 'عام' ? 'اختيارية قسم IT' : 'IT Elective Requirements',
    }
    return mapping[g] || g
  }

  return (
    <div style={{ marginBottom: '2rem' }}>
      {/* Section header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '.9rem',
          marginBottom: '.9rem',
        }}
      >
        <span
          style={{
            color: '#fff',
            borderRadius: 9,
            padding: '.35rem .9rem',
            fontWeight: 800,
            fontSize: '.86rem',
            background: isCore
              ? 'linear-gradient(135deg, var(--accent), var(--accent2))'
              : 'linear-gradient(135deg, #374151, #4b5563)',
            whiteSpace: 'nowrap',
          }}
        >
          {getGroupLabel(group)}
        </span>
        <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
        <span style={{ fontSize: '.78rem', color: 'var(--muted)', whiteSpace: 'nowrap' }}>
          {t('guest.courseCount', { count: courses.length })} · {totalCredits} {t('dashboard.credits') === 'الساعات' ? 'ساعة' : 'Credits'}
        </span>
      </div>

      {/* Section table */}
      <Table
        headers={[t('dashboard.code'), t('dashboard.name'), t('dashboard.credits'), t('dashboard.status') === 'الحالة' ? 'الفصل' : 'Semester', t('guest.prereqs'), t('dashboard.status') === 'الحالة' ? 'النوع' : 'Type', t('dashboard.status')]}
      >
        {courses.map((course) => (
          <CurriculumRow
            key={course.code}
            course={course}
            isCore={isCore}
            passed={passedCodes.has(course.code)}
          />
        ))}
      </Table>
    </div>
  )
}

// ─── Row ───────────────────────────────────────────────────────────────────────

function CurriculumRow({
  course,
  isCore,
  passed,
}: {
  course: CurriculumCourse
  isCore: boolean
  passed: boolean
}) {
  const { t } = useTranslation()

  const semLabel = (sem: CurriculumCourse['sem']): string => {
    if (sem === '1') return t('guest.sem1')
    if (sem === '2') return t('guest.sem2')
    return t('guest.semElective')
  }

  return (
    <HoverRow>
      <td style={TABLE_TD}>
        <span
          style={{
            background: 'rgba(59,130,246,.1)',
            color: 'var(--accent)',
            borderRadius: 6,
            padding: '.22rem .62rem',
            fontSize: '.76rem',
            fontWeight: 700,
          }}
        >
          {course.code}
        </span>
      </td>

      <td style={TABLE_TD}>{course.name}</td>

      <td style={{ ...TABLE_TD, textAlign: 'center' }}>{course.credits}</td>

      <td style={{ ...TABLE_TD, textAlign: 'center' }}>{semLabel(course.sem)}</td>

      <td style={TABLE_TD}>
        {course.prereqs.length > 0 ? (
          course.prereqs.map((p) => (
            <span
              key={p}
              style={{
                display: 'inline-block',
                background: 'rgba(100,116,139,.12)',
                color: 'var(--muted2)',
                borderRadius: 5,
                padding: '.15rem .5rem',
                fontSize: '.72rem',
                margin: '.1rem',
              }}
            >
              {p}
            </span>
          ))
        ) : (
          <span style={{ color: 'var(--muted)', fontSize: '.78rem' }}>—</span>
        )}
      </td>

      <td style={TABLE_TD}>
        <span
          style={{
            display: 'inline-block',
            padding: '.18rem .55rem',
            borderRadius: 6,
            fontSize: '.73rem',
            fontWeight: 600,
            background: isCore ? 'rgba(239,68,68,.1)' : 'rgba(34,197,94,.1)',
            color: isCore ? '#fca5a5' : '#86efac',
          }}
        >
          {isCore ? t('guest.mandatory') : t('guest.elective')}
        </span>
      </td>

      <td style={{ ...TABLE_TD, textAlign: 'center' }}>
        {passed && (
          <span
            style={{ color: 'var(--success)', fontWeight: 700, fontSize: '.82rem' }}
            title={t('guest.passedTitle')}
          >
            {t('guest.passed')}
          </span>
        )}
      </td>
    </HoverRow>
  )
}
