import { useState, useMemo } from 'react'

import { useProfile } from '@/shared/hooks/useProfile'
import { COURSES_RAW } from '@/shared/constants/curriculum'
import { DEPT_NAMES, GROUP_NAMES } from '@/shared/constants'
import { Table, HoverRow, TABLE_TD, TABLE_TH } from '@/shared/components/ui/Table'
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
// General groups first, then department-specific groups derived from the selected dept.
const BASE_GROUPS: CourseGroup[] = [
  'FACULTY_CORE',
  'UNIVERSITY_MANDATORY',
  'FACULTY_CHOOSE_3',
  'UNIVERSITY_CHOOSE_2',
]

// ─── Pure helpers ──────────────────────────────────────────────────────────────

/**
 * Groups curriculum courses into ordered sections for display.
 * Pure function — no side effects, no Set mutation inside render.
 * Returns only sections that have at least one course.
 */
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

function semLabel(sem: CurriculumCourse['sem']): string {
  if (sem === '1') return 'الأول'
  if (sem === '2') return 'الثاني'
  return 'اختياري'
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function CurriculumPage() {
  // Use profile to get user's dept for default tab and to mark passed courses.
  // The page is still fully functional even before the profile loads —
  // it defaults to 'IS' and shows no "passed" indicators until data arrives.
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

  // groupCourses is a pure derivation — memoized on dept change.
  // No loading state needed because COURSES_RAW is synchronous static data.
  const sections = useMemo(
    () => groupCourses(COURSES_RAW, dept),
    [dept],
  )

  return (
    <div className="animate-in">

      {/* Dept tabs */}
      <div
        style={{ display: 'flex', gap: '.65rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}
        role="tablist"
        aria-label="اختر القسم"
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
              {d} — {DEPT_NAMES[d]}
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
  const totalCredits = courses.reduce((sum, c) => sum + c.credits, 0)

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
          {GROUP_NAMES[group] ?? group}
        </span>
        <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
        <span style={{ fontSize: '.78rem', color: 'var(--muted)', whiteSpace: 'nowrap' }}>
          {courses.length} مادة · {totalCredits} ساعة
        </span>
      </div>

      {/* Section table */}
      <Table
        headers={['الكود', 'اسم المادة', 'الساعات', 'الفصل', 'المتطلب السابق', 'النوع', 'الحالة']}
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
          {isCore ? 'إجباري' : 'اختياري'}
        </span>
      </td>

      <td style={{ ...TABLE_TD, textAlign: 'center' }}>
        {passed && (
          <span
            style={{ color: 'var(--success)', fontWeight: 700, fontSize: '.82rem' }}
            title="مجتاز"
          >
            ✓ مجتاز
          </span>
        )}
      </td>
    </HoverRow>
  )
}
