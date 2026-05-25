import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '@/providers/AuthProvider'
import { Card, CardTitle, EmptyState } from '@/shared/components/ui/Card'
import { Button } from '@/shared/components/ui/Button'
import { PageLoader } from '@/shared/components/ui/Spinner'
import { Table, HoverRow, TABLE_TD } from '@/shared/components/ui/Table'
import { DEPT_NAMES, gpaStanding, gradeLabel } from '@/shared/constants'
import { useAdminStudent } from '@/shared/hooks/useAdmin'
import type { Department } from '@/shared/types'

export default function StudentDetailsPage() {
  const { user } = useAuth()
  const { studentId = '' } = useParams()
  const navigate = useNavigate()
  const { data: student, isLoading } = useAdminStudent(studentId)
  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin'

  if (!isAdmin) return <Navigate to="/dashboard" replace />
  if (isLoading) return <PageLoader />
  if (!student) {
    return <EmptyState icon="□" message="لم يتم العثور على الطالب." />
  }

  const standing = gpaStanding(student.gpa ?? 0)
  const courses = student.enrolledCourses ?? []

  return (
    <div className="animate-in">
      <Card style={{ marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
          <div>
            <CardTitle>تفاصيل الطالب</CardTitle>
            <h2 style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '1.25rem', margin: 0 }}>
              {student.firstName} {student.lastName}
            </h2>
            <div style={{ color: 'var(--muted2)', fontSize: '.84rem', marginTop: '.25rem' }}>
              {student.studentId} · {student.email}
            </div>
          </div>
          <Button type="button" variant="ghost" size="sm" onClick={() => navigate('/dashboard/admin')}>
            رجوع
          </Button>
        </div>
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
        <DetailStat label="القسم" value={DEPT_NAMES[student.department as Department] ?? student.department ?? '-'} color="var(--accent)" />
        <DetailStat label="السنة" value={student.academicYear ?? '-'} color="var(--accent2)" />
        <DetailStat label="GPA" value={(student.gpa ?? 0).toFixed(2)} color={standing.color} />
        <DetailStat label="الساعات" value={student.totalCreditHours ?? 0} color="var(--gold)" />
      </div>

      <Card>
        <CardTitle>سجل المواد</CardTitle>
        {!courses.length ? (
          <EmptyState icon="□" message="لا توجد مواد مسجلة لهذا الطالب." />
        ) : (
          <Table headers={['الكود', 'اسم المادة', 'الساعات', 'الدرجة', 'التقدير', 'GPA']}>
            {courses.map((course) => {
              const grade = gradeLabel(course.grade)
              return (
                <HoverRow key={course._id}>
                  <td style={TABLE_TD}>{course.courseCode}</td>
                  <td style={TABLE_TD}>{course.courseName}</td>
                  <td style={{ ...TABLE_TD, textAlign: 'center' }}>{course.creditHours}</td>
                  <td style={{ ...TABLE_TD, textAlign: 'center', fontWeight: 900 }}>{course.grade}</td>
                  <td style={{ ...TABLE_TD, textAlign: 'center', color: grade.color, fontWeight: 900 }}>{grade.ar}</td>
                  <td style={{ ...TABLE_TD, textAlign: 'center' }}>{course.gradePoints.toFixed(2)}</td>
                </HoverRow>
              )
            })}
          </Table>
        )}
      </Card>
    </div>
  )
}

function DetailStat({ label, value, color }: { label: string; value: string | number; color: string }) {
  return (
    <Card>
      <div style={{ color: 'var(--muted)', fontSize: '.76rem', fontWeight: 800 }}>{label}</div>
      <div style={{ color, fontSize: '1.35rem', fontWeight: 900, marginTop: '.45rem' }}>{value}</div>
    </Card>
  )
}
