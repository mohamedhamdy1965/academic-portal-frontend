import { useAuth } from '@/providers/AuthProvider'
import { Navigate } from 'react-router-dom'
import {
  useAddCourse,
  useDeleteCourse,
  useEditCourse,
  useProfile,
  useUpdatePreferredDept,
} from '@/shared/hooks/useProfile'
import type { PreferredDepartment } from '@/shared/types'
import { ApiStatusCard } from './components/ApiStatusCard'
import { AiRecommendationSection } from './components/AiRecommendationSection'
import { CoursesPanel } from './components/CoursesPanel'
import { GpaAnalyticsCards } from './components/GpaAnalyticsCards'
import { GraduationProgressSection } from './components/GraduationProgressSection'
import { PreferredDepartmentSelector } from './components/PreferredDepartmentSelector'
import { ProfileOverview } from './components/ProfileOverview'
import { StudentDashboardSkeleton } from './components/StudentDashboardSkeleton'
import { getStudentStats } from './components/dashboardUtils'

export default function DashboardPage() {
  const { user: authUser } = useAuth()
  const { data: profile, isLoading } = useProfile()
  const addCourse = useAddCourse()
  const editCourse = useEditCourse()
  const deleteCourse = useDeleteCourse()
  const updatePreferredDepartment = useUpdatePreferredDept()

  const user = profile ?? authUser

  if (user?.role === 'admin') {
    return <Navigate to="/dashboard/admin" replace />
  }
  if (user?.role === 'super_admin') {
    return <Navigate to="/dashboard/super-admin" replace />
  }

  if (isLoading && !user) {
    return <StudentDashboardSkeleton />
  }

  if (!user) {
    return <StudentDashboardSkeleton />
  }

  const stats = getStudentStats(user)
  const preferredDepartment = (user.preferredDepartment ?? 'General') as PreferredDepartment
  const isStudent = !user.role || user.role === 'student'

  return (
    <div className="animate-in">
      <ProfileOverview user={user} />
      <ApiStatusCard />

      <GpaAnalyticsCards
        gpa={stats.gpa}
        hours={stats.hours}
        passedCount={stats.passed.length}
        failedCount={stats.failed.length}
        progress={stats.progress}
        standing={stats.standing}
      />

      <div
        className="student-dashboard-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.05fr) minmax(320px, .95fr)',
          gap: '1.25rem',
          alignItems: 'start',
          marginBottom: '1.25rem',
        }}
      >
        <GraduationProgressSection
          hours={stats.hours}
          progress={stats.progress}
          remaining={stats.remaining}
          passedCount={stats.passed.length}
          failedCount={stats.failed.length}
        />

        {isStudent && (
          <PreferredDepartmentSelector
            current={preferredDepartment}
            isPending={updatePreferredDepartment.isPending}
            onSelect={(department) => updatePreferredDepartment.mutate(department)}
          />
        )}
      </div>

      <div style={{ marginBottom: '1.25rem' }}>
        <CoursesPanel
          courses={stats.courses}
          addPending={addCourse.isPending}
          editPending={editCourse.isPending}
          deletePending={deleteCourse.isPending}
          onAddCourse={(values, onSuccess) => {
            addCourse.mutate(values, { onSuccess })
          }}
          onEditCourse={(courseId, grade, onSuccess) => {
            editCourse.mutate({ courseId, grade }, { onSuccess })
          }}
          onDeleteCourse={(courseId, onSuccess) => {
            deleteCourse.mutate(courseId, { onSuccess })
          }}
        />
      </div>

      {isStudent && (
        <AiRecommendationSection
          plan={user.AI_plan?.plan ?? []}
          courses={stats.courses}
        />
      )}

      <style>{`
        @media (max-width: 920px) {
          .student-dashboard-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}
