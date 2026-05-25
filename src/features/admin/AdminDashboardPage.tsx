import { useMemo, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/providers/AuthProvider'
import {
  useAdminAnalytics,
  useAdminCourses,
  useAdminStudents,
  useCreateAdminCourse,
  useDeleteStudent,
  useUpdateAdminCourse,
} from '@/shared/hooks/useAdmin'
import { AdminAnalyticsCards } from './components/AdminAnalyticsCards'
import { AdminSkeleton } from './components/AdminSkeleton'
import { CoursesManagementTable } from './components/CoursesManagementTable'
import { QuickAdminActions } from './components/QuickAdminActions'
import { StudentsManagementTable } from './components/StudentsManagementTable'

export default function AdminDashboardPage() {
  const { user } = useAuth()
  const [createCourseOpen, setCreateCourseOpen] = useState(false)
  const studentsQuery = useAdminStudents()
  const coursesQuery = useAdminCourses()
  const analyticsQuery = useAdminAnalytics()
  const deleteStudent = useDeleteStudent()
  const createCourse = useCreateAdminCourse()
  const updateCourse = useUpdateAdminCourse()

  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin'
  if (!isAdmin) return <Navigate to="/dashboard" replace />

  const loading = studentsQuery.isLoading || coursesQuery.isLoading || analyticsQuery.isLoading
  const analytics = analyticsQuery.data
  const students = studentsQuery.data ?? []
  const courses = coursesQuery.data ?? []

  const focusTargets = useMemo(() => ({
    students: () => document.getElementById('admin-students')?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
    courses: () => document.getElementById('admin-courses')?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
  }), [])

  if (loading || !analytics) return <AdminSkeleton />

  return (
    <div className="animate-in">
      <AdminAnalyticsCards analytics={analytics} />

      <QuickAdminActions
        onCreateCourse={() => setCreateCourseOpen(true)}
        onFocusStudents={focusTargets.students}
        onFocusCourses={focusTargets.courses}
      />

      <section id="admin-students" style={{ marginBottom: '1.25rem', scrollMarginTop: 90 }}>
        <StudentsManagementTable
          students={students}
          deletePending={deleteStudent.isPending}
          onDelete={(studentId, onSuccess) => deleteStudent.mutate(studentId, { onSuccess })}
        />
      </section>

      <section id="admin-courses" style={{ scrollMarginTop: 90 }}>
        <CoursesManagementTable
          courses={courses}
          createPending={createCourse.isPending}
          updatePending={updateCourse.isPending}
          createOpen={createCourseOpen}
          onCreateOpenChange={setCreateCourseOpen}
          onCreate={(payload, onSuccess) => createCourse.mutate(payload, { onSuccess })}
          onUpdate={(courseCode, payload, onSuccess) => updateCourse.mutate({ courseCode, payload }, { onSuccess })}
        />
      </section>
    </div>
  )
}
