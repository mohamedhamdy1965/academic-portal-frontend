import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardTitle, EmptyState } from '@/shared/components/ui/Card'
import { Button } from '@/shared/components/ui/Button'
import { ConfirmDialog } from '@/shared/components/ui/Modal'
import { Table, HoverRow, TABLE_TD } from '@/shared/components/ui/Table'
import { GRADE_BG, gradeLabel } from '@/shared/constants'
import type { EnrolledCourse } from '@/shared/types'
import { CourseFormModal, type CourseFormValues } from './CourseFormModal'
import { isAcademicConflict } from '@/features/academic/utils/academic'
import { AcademicConflictBadge } from '@/shared/components/ui/AcademicConflictBadge'

interface CoursesPanelProps {
  courses: EnrolledCourse[]
  addPending: boolean
  editPending: boolean
  deletePending: boolean
  onAddCourse: (values: CourseFormValues, onSuccess: () => void) => void
  onEditCourse: (courseId: string, grade: number, regulationSatisfied: boolean, onSuccess: () => void) => void
  onDeleteCourse: (courseId: string, onSuccess: () => void) => void
}

export function CoursesPanel({
  courses,
  addPending,
  editPending,
  deletePending,
  onAddCourse,
  onEditCourse,
  onDeleteCourse,
}: CoursesPanelProps) {
  const { t } = useTranslation()
  const [addOpen, setAddOpen] = useState(false)
  const [editingCourse, setEditingCourse] = useState<EnrolledCourse | null>(null)
  const [deletingCourse, setDeletingCourse] = useState<EnrolledCourse | null>(null)

  return (
    <>
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
            <CardTitle>{t('dashboard.coursesPanelTitle')}</CardTitle>
            <p style={{ color: 'var(--muted)', fontSize: '.8rem', marginTop: '-.65rem' }}>
              {t('common.general') === 'عام' ? 'إدارة المواد والدرجات من نفس لوحة الطالب.' : 'Manage courses and grades from the student dashboard.'}
            </p>
          </div>
          <Button type="button" variant="primary" size="sm" onClick={() => setAddOpen(true)}>
            {t('common.addCourse')}
          </Button>
        </div>

        {!courses.length ? (
          <EmptyState
            icon="▦"
            message={t('dashboard.emptyCourses')}
            action={
              <Button type="button" variant="primary" size="md" onClick={() => setAddOpen(true)}>
                {t('common.addCourse')}
              </Button>
            }
          />
        ) : (
          <Table headers={[t('dashboard.code'), t('dashboard.name'), t('dashboard.credits'), t('dashboard.grade'), 'GPA', t('dashboard.status'), t('dashboard.actions')]}>
            {courses.map((course) => (
              <CourseRow
                key={course._id}
                course={course}
                onEdit={() => setEditingCourse(course)}
                onDelete={() => setDeletingCourse(course)}
              />
            ))}
          </Table>
        )}
      </Card>

      <CourseFormModal
        mode="add"
        open={addOpen}
        loading={addPending}
        onClose={() => setAddOpen(false)}
        onSubmit={(values) => onAddCourse(values, () => setAddOpen(false))}
      />

      <CourseFormModal
        mode="edit"
        open={Boolean(editingCourse)}
        course={editingCourse}
        loading={editPending}
        onClose={() => setEditingCourse(null)}
        onSubmit={(values) => {
          if (!editingCourse) return
          onEditCourse(editingCourse._id, values.grade, values.regulationSatisfied, () => setEditingCourse(null))
        }}
      />

      <ConfirmDialog
        open={Boolean(deletingCourse)}
        title={t('common.deleteCourse')}
        message={t('common.general') === 'عام' ? `هل تريد حذف ${deletingCourse?.courseName ?? 'هذه المادة'} من السجل؟` : `Are you sure you want to delete ${deletingCourse?.courseName ?? 'this course'} from the record?`}
        confirmLabel={t('common.delete')}
        loading={deletePending}
        onClose={() => setDeletingCourse(null)}
        onConfirm={() => {
          if (!deletingCourse) return
          onDeleteCourse(deletingCourse._id, () => setDeletingCourse(null))
        }}
      />
    </>
  )
}

function CourseRow({
  course,
  onEdit,
  onDelete,
}: {
  course: EnrolledCourse
  onEdit: () => void
  onDelete: () => void
}) {
  const { t } = useTranslation()
  const grade = gradeLabel(course.grade)
  const passed = course.grade >= 60
  const hasConflict = isAcademicConflict(course)

  return (
    <HoverRow>
      <td style={TABLE_TD}>
        <span style={codeBadgeStyle}>{course.courseCode}</span>
      </td>
      <td style={{ ...TABLE_TD, minWidth: 220 }}>{course.courseName || course.courseCode}</td>
      <td style={{ ...TABLE_TD, textAlign: 'center' }}>{course.creditHours ?? 3}</td>
      <td style={{ ...TABLE_TD, textAlign: 'center', fontWeight: 900 }}>{course.grade}</td>
      <td style={{ ...TABLE_TD, textAlign: 'center' }}>{(course.gradePoints ?? 0).toFixed(2)}</td>
      <td style={{ ...TABLE_TD, textAlign: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '.35rem' }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '.35rem',
              minHeight: 26,
              borderRadius: 6,
              padding: '0 .55rem',
              color: passed ? 'var(--success)' : 'var(--danger)',
              background: GRADE_BG[grade.cls],
              fontSize: '.76rem',
              fontWeight: 900,
              whiteSpace: 'nowrap',
            }}
          >
            {passed ? t('dashboard.statusPassed') : t('dashboard.statusFailed').split(' / ')[0]} · {t(`grades.${grade.ar}`)}
          </span>
          {hasConflict && <AcademicConflictBadge />}
        </div>
      </td>
      <td style={{ ...TABLE_TD, textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '.4rem' }}>
          <SmallAction label={t('common.edit')} color="var(--accent)" onClick={onEdit} />
          <SmallAction label={t('common.delete')} color="var(--danger)" onClick={onDelete} />
        </div>
      </td>
    </HoverRow>
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
      }}
    >
      {label}
    </button>
  )
}

const codeBadgeStyle = {
  background: 'rgba(59,130,246,.1)',
  color: 'var(--accent)',
  border: '1px solid rgba(59,130,246,.18)',
  borderRadius: 6,
  padding: '.2rem .58rem',
  fontSize: '.74rem',
  fontWeight: 800,
  whiteSpace: 'nowrap',
} as const
