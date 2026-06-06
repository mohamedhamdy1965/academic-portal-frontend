import { useState, useMemo, type ReactNode } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslation } from 'react-i18next'

import { useProfile, useAddCourse, useEditCourse, useDeleteCourse } from '@/shared/hooks/useProfile'
import { gradeLabel, GRADE_BG } from '@/shared/constants'
import { Card, CardTitle, StatCard, EmptyState } from '@/shared/components/ui/Card'
import { Table, HoverRow, TABLE_TD } from '@/shared/components/ui/Table'
import { Button } from '@/shared/components/ui/Button'
import { Input, Field } from '@/shared/components/ui/FormPrimitives'
import { PageLoader, Spinner } from '@/shared/components/ui/Spinner'
import type { EnrolledCourse } from '@/shared/types'

// Static schemas for type inference
const staticAddCourseSchema = z.object({
  courseCode: z.string(),
  grade: z.number(),
})

type AddCourseForm = z.infer<typeof staticAddCourseSchema>

export default function ResultsPage() {
  const { t } = useTranslation()
  const { data: profile, isLoading } = useProfile()

  const addCourse    = useAddCourse()
  const editCourse   = useEditCourse()
  const deleteCourse = useDeleteCourse()

  const [editId, setEditId]         = useState<string | null>(null)
  const [editGrade, setEditGrade]   = useState('')
  const [editError, setEditError]   = useState('')
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

  const editGradeSchema = useMemo(() => z
    .number({ invalid_type_error: t('dashboard.gradeRequired') })
    .min(0, t('dashboard.gradeMin'))
    .max(100, t('dashboard.gradeMax')), [t])

  if (isLoading && !profile) return <PageLoader />

  const courses = profile?.enrolledCourses ?? []
  const passed  = courses.filter((c) => c.grade >= 60)
  const failed  = courses.filter((c) => c.grade < 60)

  const startEdit = (course: EnrolledCourse) => {
    setEditId(course._id)
    setEditGrade(String(course.grade))
    setEditError('')
    setConfirmDeleteId(null)
  }

  const cancelEdit = () => {
    setEditId(null)
    setEditGrade('')
    setEditError('')
  }

  const submitEdit = () => {
    const parsed = editGradeSchema.safeParse(Number(editGrade))
    if (!parsed.success) {
      setEditError(parsed.error.errors[0]?.message ?? 'Invalid grade')
      return
    }
    if (!editId) return
    editCourse.mutate(
      { courseId: editId, grade: parsed.data },
      { onSuccess: cancelEdit },
    )
  }

  const confirmDelete = (courseId: string) => {
    setConfirmDeleteId(courseId)
    setEditId(null)
  }

  const executeDelete = (courseId: string) => {
    deleteCourse.mutate(courseId, {
      onSuccess: () => setConfirmDeleteId(null),
    })
  }

  return (
    <div className="animate-in">
      <AddCourseCard
        onSuccess={() => {}}
        isPending={addCourse.isPending}
        mutate={(data) => addCourse.mutate(data)}
      />

      {/* Summary stats */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '1rem',
          marginBottom: '1.8rem',
        }}
      >
        <StatCard icon="⭐" value={profile?.gpa?.toFixed(2) ?? '—'} label={t('dashboard.gpa')} color="var(--accent)" />
        <StatCard icon="📖" value={profile?.totalCreditHours ?? 0}   label={t('sidebar.curriculum')} />
        <StatCard icon="✅" value={passed.length}                      label={t('dashboard.passedCourses')} color="var(--success)" />
        <StatCard icon="⚠️" value={failed.length}                      label={t('dashboard.failedCourses')} color={failed.length > 0 ? 'var(--danger)' : 'var(--muted)'} />
      </div>

      {/* Grades table */}
      <Card>
        <CardTitle>{t('results.title')} 📊</CardTitle>

        {!courses.length ? (
          <EmptyState
            icon="📭"
            message={t('dashboard.emptyCourses')}
          />
        ) : (
          <Table
            headers={[t('dashboard.code'), t('dashboard.name'), t('dashboard.credits'), t('dashboard.grade'), t('dashboard.status') === 'الحالة' ? 'التقدير' : 'Grade', 'GPA', t('dashboard.status'), t('dashboard.actions')]}
          >
            {courses.map((course) => (
              <GradeRow
                key={course._id}
                course={course}
                isEditing={editId === course._id}
                editGrade={editGrade}
                editError={editError}
                isEditPending={editCourse.isPending}
                isConfirmingDelete={confirmDeleteId === course._id}
                isDeletePending={deleteCourse.isPending && confirmDeleteId === course._id}
                onEditStart={() => startEdit(course)}
                onEditChange={(v) => { setEditGrade(v); setEditError('') }}
                onEditSubmit={submitEdit}
                onEditCancel={cancelEdit}
                onDeleteRequest={() => confirmDelete(course._id)}
                onDeleteConfirm={() => executeDelete(course._id)}
                onDeleteCancel={() => setConfirmDeleteId(null)}
              />
            ))}
          </Table>
        )}
      </Card>

      <style>{`
        @media (max-width: 768px) {
          .results-table-wrap { font-size: .8rem; }
        }
      `}</style>
    </div>
  )
}

interface AddCourseCardProps {
  isPending: boolean
  onSuccess: () => void
  mutate: (data: { courseCode: string; grade: number }) => void
}

function AddCourseCard({ isPending, mutate }: AddCourseCardProps) {
  const { t } = useTranslation()

  const dynamicAddCourseSchema = useMemo(() => z.object({
    courseCode: z
      .string()
      .min(1, t('dashboard.courseCodeRequired'))
      .regex(/^[A-Za-z]{2,3}\d{3}$/, t('dashboard.courseCodeFormat')),
    grade: z
      .number({ invalid_type_error: t('dashboard.gradeRequired') })
      .min(0, t('dashboard.gradeMin'))
      .max(100, t('dashboard.gradeMax')),
  }), [t])

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddCourseForm>({
    resolver: zodResolver(dynamicAddCourseSchema),
  })

  const onSubmit = (data: AddCourseForm) => {
    mutate(
      { courseCode: data.courseCode.toUpperCase().trim(), grade: data.grade },
    )
    reset()
  }

  return (
    <Card style={{ marginBottom: '1.8rem' }}>
      <CardTitle>{t('common.addCourse')} ➕</CardTitle>
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr auto',
          gap: '.9rem',
          alignItems: 'start',
        }}
        className="add-course-form"
      >
        <Field label={t('dashboard.courseCodeLabel')}>
          <Input
            placeholder="CS316"
            error={errors.courseCode?.message}
            style={{ textTransform: 'uppercase' }}
            {...register('courseCode')}
          />
        </Field>

        <Field label={t('dashboard.gradeLabel')}>
          <Input
            type="number"
            placeholder={t('dashboard.gradePlaceholder')}
            min={0}
            max={100}
            error={errors.grade?.message}
            {...register('grade', { valueAsNumber: true })}
          />
        </Field>

        <div style={{ paddingTop: '1.55rem' }}>
          <Button
            type="submit"
            variant="primary"
            size="md"
            loading={isPending}
            style={{ whiteSpace: 'nowrap', height: 46 }}
          >
            {t('common.save') === 'حفظ' ? 'إضافة' : 'Add'}
          </Button>
        </div>
      </form>

      <style>{`
        @media (max-width: 640px) {
          .add-course-form { grid-template-columns: 1fr !important; }
          .add-course-form > div:last-child { padding-top: 0 !important; }
        }
      `}</style>
    </Card>
  )
}

interface GradeRowProps {
  course: EnrolledCourse
  isEditing: boolean
  editGrade: string
  editError: string
  isEditPending: boolean
  isConfirmingDelete: boolean
  isDeletePending: boolean
  onEditStart: () => void
  onEditChange: (v: string) => void
  onEditSubmit: () => void
  onEditCancel: () => void
  onDeleteRequest: () => void
  onDeleteConfirm: () => void
  onDeleteCancel: () => void
}

function GradeRow({
  course,
  isEditing,
  editGrade,
  editError,
  isEditPending,
  isConfirmingDelete,
  isDeletePending,
  onEditStart,
  onEditChange,
  onEditSubmit,
  onEditCancel,
  onDeleteRequest,
  onDeleteConfirm,
  onDeleteCancel,
}: GradeRowProps) {
  const { t } = useTranslation()
  const g = gradeLabel(course.grade)

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
          {course.courseCode}
        </span>
      </td>

      <td style={TABLE_TD}>{course.courseName || course.courseCode}</td>

      <td style={{ ...TABLE_TD, textAlign: 'center' }}>{course.creditHours ?? 3}</td>

      <td style={{ ...TABLE_TD, textAlign: 'center' }}>
        {isEditing ? (
          <div>
            <input
              type="number"
              value={editGrade}
              onChange={(e) => onEditChange(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && onEditSubmit()}
              autoFocus
              min={0}
              max={100}
              style={{
                width: 65,
                padding: '.3rem .5rem',
                background: 'var(--surface)',
                border: `1px solid ${editError ? 'var(--danger)' : 'var(--accent)'}`,
                borderRadius: 7,
                color: 'var(--text)',
                fontSize: '.85rem',
                textAlign: 'center',
                fontFamily: 'Cairo, sans-serif',
                outline: 'none',
              }}
            />
            {editError && (
              <div style={{ color: '#fca5a5', fontSize: '.72rem', marginTop: '.2rem' }}>
                {editError}
              </div>
            )}
          </div>
        ) : (
          <span style={{ fontWeight: 800 }}>{course.grade}</span>
        )}
      </td>

      <td style={{ ...TABLE_TD, textAlign: 'center' }}>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: 52,
            height: 26,
            borderRadius: 6,
            fontSize: '.8rem',
            fontWeight: 800,
            padding: '0 .5rem',
            background: GRADE_BG[g.cls],
            color: g.color,
          }}
        >
          {t(`grades.${g.ar}`)}
        </span>
      </td>

      <td style={{ ...TABLE_TD, textAlign: 'center', fontWeight: 700 }}>
        {(course.gradePoints ?? 0).toFixed(2)}
      </td>

      <td style={{ ...TABLE_TD, textAlign: 'center' }}>
        <span
          style={{
            color: course.grade >= 60 ? 'var(--success)' : 'var(--danger)',
            fontWeight: 700,
            fontSize: '.8rem',
          }}
        >
          {course.grade >= 60 ? (t('common.save') === 'حفظ' ? 'ناجح ✓' : 'Passed ✓') : (t('common.save') === 'حفظ' ? 'راسب ✗' : 'Failed ✗')}
        </span>
      </td>

      <td style={{ ...TABLE_TD, textAlign: 'center' }}>
        {isConfirmingDelete ? (
          <div style={{ display: 'flex', gap: '.35rem', justifyContent: 'center', alignItems: 'center' }}>
            <span style={{ fontSize: '.75rem', color: 'var(--muted)', marginLeft: '.25rem', marginRight: '.25rem' }}>
              {t('common.save') === 'حفظ' ? 'حذف؟' : 'Delete?'}
            </span>
            <ActionBtn
              color="var(--danger)"
              onClick={onDeleteConfirm}
              disabled={isDeletePending}
            >
              {isDeletePending ? <Spinner size={12} /> : (t('common.save') === 'حفظ' ? 'تأكيد' : 'Confirm')}
            </ActionBtn>
            <ActionBtn color="var(--muted)" onClick={onDeleteCancel}>
              {t('common.cancel')}
            </ActionBtn>
          </div>
        ) : isEditing ? (
          <div style={{ display: 'flex', gap: '.35rem', justifyContent: 'center' }}>
            <ActionBtn
              color="var(--success)"
              onClick={onEditSubmit}
              disabled={isEditPending}
            >
              {isEditPending ? <Spinner size={12} /> : '✓'}
            </ActionBtn>
            <ActionBtn color="var(--muted)" onClick={onEditCancel}>
              ✕
            </ActionBtn>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '.35rem', justifyContent: 'center' }}>
            <ActionBtn color="var(--accent)" onClick={onEditStart}>
              ✏️
            </ActionBtn>
            <ActionBtn color="var(--danger)" onClick={onDeleteRequest}>
              🗑️
            </ActionBtn>
          </div>
        )}
      </td>
    </HoverRow>
  )
}

function ActionBtn({
  children,
  color,
  onClick,
  disabled = false,
}: {
  children: ReactNode
  color: string
  onClick: () => void
  disabled?: boolean
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        background: 'transparent',
        border: `1px solid ${color}33`,
        borderRadius: 7,
        padding: '.25rem .5rem',
        color,
        fontSize: '.82rem',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        transition: 'background .15s',
        minWidth: 28,
        fontFamily: 'Cairo, sans-serif',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      onMouseEnter={(e) => {
        if (!disabled) (e.currentTarget as HTMLButtonElement).style.background = `${color}22`
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background = 'transparent'
      }}
    >
      {children}
    </button>
  )
}
