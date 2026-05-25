import type { ReactNode } from 'react'
import { DEPT_COLORS, DEPT_NAMES, ROLE_LABELS, YEAR_NAMES } from '@/shared/constants'
import type { Department, User } from '@/shared/types'

export function ProfileOverview({ user }: { user: User }) {
  const dept = user.department ?? 'General'
  const deptColor = DEPT_COLORS[dept as Department] ?? 'var(--accent)'
  const deptLabel = DEPT_NAMES[dept as Department] ?? dept
  const yearLabel = YEAR_NAMES[user.academicYear ?? 0]
  const isStudent = !user.role || user.role === 'student'

  return (
    <section
      style={{
        background: 'linear-gradient(135deg, rgba(59,130,246,.1), rgba(6,182,212,.05))',
        border: '1px solid rgba(59,130,246,.18)',
        borderRadius: 18,
        padding: '1.45rem 1.6rem',
        marginBottom: '1.35rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <span
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: '1.2rem',
          top: '50%',
          transform: 'translateY(-50%)',
          fontSize: '5.5rem',
          opacity: 0.04,
          lineHeight: 1,
        }}
      >
        🎓
      </span>

      <div style={{ position: 'relative', zIndex: 1 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: '1rem',
            flexWrap: 'wrap',
          }}
        >
          <div>
            <h2
              style={{
                fontFamily: 'Tajawal, sans-serif',
                fontSize: '1.35rem',
                fontWeight: 900,
                margin: 0,
                marginBottom: '.35rem',
              }}
            >
              أهلاً، {user.firstName} {user.lastName}
            </h2>
            <div style={{ color: 'var(--muted2)', fontSize: '.86rem' }}>
              {isStudent ? `${yearLabel ?? 'طالب'} · ${user.studentId ?? 'طالب تجريبي'}` : ROLE_LABELS[user.role] ?? user.role}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap' }}>
            {isStudent && <ProfileBadge color={deptColor}>قسم {dept} — {deptLabel}</ProfileBadge>}
            {user.email && <ProfileBadge color="var(--muted2)">{user.email}</ProfileBadge>}
          </div>
        </div>
      </div>
    </section>
  )
}

function ProfileBadge({ children, color }: { children: ReactNode; color: string }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        minHeight: 30,
        padding: '.25rem .7rem',
        borderRadius: 8,
        background: `${color}18`,
        border: `1px solid ${color}33`,
        color,
        fontSize: '.78rem',
        fontWeight: 800,
      }}
    >
      {children}
    </span>
  )
}
