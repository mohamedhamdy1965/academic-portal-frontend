import { useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '@/providers/AuthProvider'
import { Card, CardTitle, EmptyState } from '@/shared/components/ui/Card'
import { Button } from '@/shared/components/ui/Button'
import { PageLoader } from '@/shared/components/ui/Spinner'
import { Table, HoverRow, TABLE_TD } from '@/shared/components/ui/Table'
import { DEPT_NAMES, gpaStanding, gradeLabel } from '@/shared/constants'
import { useAdminStudent } from '@/shared/hooks/useAdmin'
import { useAddCourse, useEditCourse, useDeleteCourse } from '@/shared/hooks/useProfile'
import { isAcademicConflict } from '@/features/academic/utils/academic'
import { AcademicConflictBadge } from '@/shared/components/ui/AcademicConflictBadge'
import { CourseFormModal } from '@/features/dashboard/components/CourseFormModal'
import { ConfirmDialog } from '@/shared/components/ui/Modal'
import type { EnrolledCourse, Department } from '@/shared/types'

export default function StudentDetailsPage() {
  const { user } = useAuth()
  const { studentId = '' } = useParams()
  const navigate = useNavigate()
  const { data: student, isLoading } = useAdminStudent(studentId)
  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin'

  const [addOpen, setAddOpen] = useState(false)
  const [editingCourse, setEditingCourse] = useState<EnrolledCourse | null>(null)
  const [deletingCourse, setDeletingCourse] = useState<EnrolledCourse | null>(null)

  const addCourse = useAddCourse()
  const editCourse = useEditCourse()
  const deleteCourse = useDeleteCourse()

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
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: '1rem',
            flexWrap: 'wrap',
            marginBottom: '.85rem',
          }}
        >
          <div>
            <CardTitle>سجل المواد</CardTitle>
            <p style={{ color: 'var(--muted)', fontSize: '.8rem', marginTop: '-.65rem' }}>
              إضافة وتعديل وحذف المواد والدرجات الخاصة بالطالب.
            </p>
          </div>
          <Button type="button" variant="primary" size="sm" onClick={() => setAddOpen(true)}>
            إضافة مادة
          </Button>
        </div>

        {!courses.length ? (
          <EmptyState
            icon="□"
            message="لا توجد مواد مسجلة لهذا الطالب."
            action={
              <Button type="button" variant="primary" size="md" onClick={() => setAddOpen(true)}>
                إضافة مادة
              </Button>
            }
          />
        ) : (
          <Table headers={['الكود', 'اسم المادة', 'الساعات', 'الدرجة', 'التقدير', 'GPA', 'الحالة', 'إجراءات']}>
            {courses.map((course) => {
              const grade = gradeLabel(course.grade)
              const passed = course.grade >= 60
              const hasConflict = isAcademicConflict(course)
              return (
                <HoverRow key={course._id}>
                  <td style={TABLE_TD}>{course.courseCode}</td>
                  <td style={TABLE_TD}>{course.courseName}</td>
                  <td style={{ ...TABLE_TD, textAlign: 'center' }}>{course.creditHours}</td>
                  <td style={{ ...TABLE_TD, textAlign: 'center', fontWeight: 900 }}>{course.grade}</td>
                  <td style={{ ...TABLE_TD, textAlign: 'center', color: grade.color, fontWeight: 900 }}>{grade.ar}</td>
                  <td style={{ ...TABLE_TD, textAlign: 'center' }}>{course.gradePoints.toFixed(2)}</td>
                  <td style={{ ...TABLE_TD, textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '.35rem', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          borderRadius: 6,
                          padding: '.15rem .45rem',
                          color: passed ? 'var(--success)' : 'var(--danger)',
                          background: `${passed ? 'var(--success)' : 'var(--danger)'}18`,
                          fontSize: '.74rem',
                          fontWeight: 900,
                        }}
                      >
                        {passed ? 'ناجح' : 'متابعة'}
                      </span>
                      {hasConflict && <AcademicConflictBadge />}
                    </div>
                  </td>
                  <td style={{ ...TABLE_TD, textAlign: 'center' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '.4rem' }}>
                      <SmallAction label="تعديل" color="var(--accent)" onClick={() => setEditingCourse(course)} />
                      <SmallAction label="حذف" color="var(--danger)" onClick={() => setDeletingCourse(course)} />
                    </div>
                  </td>
                </HoverRow>
              )
            })}
          </Table>
        )}
      </Card>

      <CourseFormModal
        mode="add"
        open={addOpen}
        loading={addCourse.isPending}
        onClose={() => setAddOpen(false)}
        onSubmit={(values) => {
          addCourse.mutate(
            { ...values, studentId },
            { onSuccess: () => setAddOpen(false) }
          )
        }}
      />

      <CourseFormModal
        mode="edit"
        open={Boolean(editingCourse)}
        course={editingCourse}
        loading={editCourse.isPending}
        onClose={() => setEditingCourse(null)}
        onSubmit={(values) => {
          if (!editingCourse) return
          editCourse.mutate(
            {
              courseId: editingCourse._id,
              grade: values.grade,
              regulationSatisfied: values.regulationSatisfied,
              studentId,
            },
            { onSuccess: () => setEditingCourse(null) }
          )
        }}
      />

      <ConfirmDialog
        open={Boolean(deletingCourse)}
        title="حذف المادة"
        message={`هل تريد حذف ${deletingCourse?.courseName ?? 'هذه المادة'} من سجل الطالب؟`}
        confirmLabel="حذف"
        loading={deleteCourse.isPending}
        onClose={() => setDeletingCourse(null)}
        onConfirm={() => {
          if (!deletingCourse) return
          deleteCourse.mutate(
            { courseId: deletingCourse._id, studentId },
            { onSuccess: () => setDeletingCourse(null) }
          )
        }}
      />
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

function SmallAction({
  label,
  color,
  onClick,
}: {
  label: string
  color: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        minHeight: 28,
        padding: '.22rem .55rem',
        borderRadius: 7,
        border: `1px solid ${color}33`,
        background: 'transparent',
        color,
        fontSize: '.76rem',
        fontWeight: 800,
        fontFamily: 'Cairo, sans-serif',
        cursor: 'pointer',
      }}
    >
      {label}
    </button>
  )
}
