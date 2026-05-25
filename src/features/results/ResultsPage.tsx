import { useState, type ReactNode } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { useProfile, useAddCourse, useEditCourse, useDeleteCourse } from '@/shared/hooks/useProfile'
import { gradeLabel, GRADE_BG } from '@/shared/constants'
import { Card, CardTitle, StatCard, EmptyState } from '@/shared/components/ui/Card'
import { Table, HoverRow, TABLE_TD } from '@/shared/components/ui/Table'
import { Button } from '@/shared/components/ui/Button'
import { Input, Field } from '@/shared/components/ui/FormPrimitives'
import { PageLoader, Spinner } from '@/shared/components/ui/Spinner'
import type { EnrolledCourse } from '@/shared/types'

// ─── Add-course form schema ────────────────────────────────────────────────────

const addCourseSchema = z.object({
  courseCode: z
    .string()
    .min(1, 'يرجى إدخال كود المادة')
    .regex(/^[A-Za-z]{2,3}\d{3}$/, 'صيغة الكود غير صحيحة (مثال: CS316)'),
  grade: z
    .number({ invalid_type_error: 'يرجى إدخال رقم' })
    .min(0, 'الدرجة الدنيا 0')
    .max(100, 'الدرجة القصوى 100'),
})

type AddCourseForm = z.infer<typeof addCourseSchema>

// ─── Edit grade schema ─────────────────────────────────────────────────────────

const editGradeSchema = z
  .number({ invalid_type_error: 'يرجى إدخال رقم' })
  .min(0, 'الدرجة الدنيا 0')
  .max(100, 'الدرجة القصوى 100')

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function ResultsPage() {
  const { data: profile, isLoading } = useProfile()

  // Mutation hooks — each manages its own pending/error state via React Query
  const addCourse    = useAddCourse()
  const editCourse   = useEditCourse()
  const deleteCourse = useDeleteCourse()

  // Local UI state — purely presentational, not data-fetching state
  const [editId, setEditId]         = useState<string | null>(null)
  const [editGrade, setEditGrade]   = useState('')
  const [editError, setEditError]   = useState('')
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

  if (isLoading && !profile) return <PageLoader />

  const courses = profile?.enrolledCourses ?? []
  const passed  = courses.filter((c) => c.grade >= 60)
  const failed  = courses.filter((c) => c.grade < 60)

  // ── Edit handlers ─────────────────────────────────────────────────────────

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
      setEditError(parsed.error.errors[0]?.message ?? 'درجة غير صحيحة')
      return
    }
    if (!editId) return
    editCourse.mutate(
      { courseId: editId, grade: parsed.data },
      { onSuccess: cancelEdit },
    )
  }

  // ── Delete handlers ───────────────────────────────────────────────────────

  const confirmDelete = (courseId: string) => {
    setConfirmDeleteId(courseId)
    setEditId(null) // close any open edit row
  }

  const executeDelete = (courseId: string) => {
    deleteCourse.mutate(courseId, {
      onSuccess: () => setConfirmDeleteId(null),
    })
  }

  return (
    <div className="animate-in">

      {/* ── Add-course form ─────────────────────────────────────────────────── */}
      <AddCourseCard
        onSuccess={() => {}}
        isPending={addCourse.isPending}
        mutate={(data) => addCourse.mutate(data)}
      />

      {/* ── Summary stats ───────────────────────────────────────────────────── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '1rem',
          marginBottom: '1.8rem',
        }}
      >
        <StatCard icon="⭐" value={profile?.gpa?.toFixed(2) ?? '—'} label="المعدل التراكمي" color="var(--accent)" />
        <StatCard icon="📖" value={profile?.totalCreditHours ?? 0}   label="إجمالي الساعات المعتمدة" />
        <StatCard icon="✅" value={passed.length}                      label="مواد ناجحة"    color="var(--success)" />
        <StatCard icon="⚠️" value={failed.length}                      label="مواد راسبة"    color={failed.length > 0 ? 'var(--danger)' : 'var(--muted)'} />
      </div>

      {/* ── Grades table ────────────────────────────────────────────────────── */}
      <Card>
        <CardTitle>سجل الدرجات 📊</CardTitle>

        {!courses.length ? (
          <EmptyState
            icon="📭"
            message="لا توجد درجات مسجلة بعد. أضف مادتك الأولى من الأعلى."
          />
        ) : (
          <Table
            headers={['الكود', 'اسم المادة', 'الساعات', 'الدرجة', 'التقدير', 'GPA', 'الحالة', 'إجراءات']}
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

// ─── Add-course card ───────────────────────────────────────────────────────────
// Isolated into its own component so it has its own form state and
// doesn't re-render the entire page table when typing in the inputs.

interface AddCourseCardProps {
  isPending: boolean
  onSuccess: () => void
  mutate: (data: { courseCode: string; grade: number }) => void
}

function AddCourseCard({ isPending, mutate }: AddCourseCardProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddCourseForm>({
    resolver: zodResolver(addCourseSchema),
  })

  const onSubmit = (data: AddCourseForm) => {
    mutate(
      { courseCode: data.courseCode.toUpperCase().trim(), grade: data.grade },
    )
    reset()
  }

  return (
    <Card style={{ marginBottom: '1.8rem' }}>
      <CardTitle>إضافة مادة ودرجة ➕</CardTitle>
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
        <Field label="كود المادة">
          <Input
            placeholder="CS316"
            error={errors.courseCode?.message}
            style={{ textTransform: 'uppercase' }}
            {...register('courseCode')}
          />
        </Field>

        <Field label="الدرجة (0 – 100)">
          <Input
            type="number"
            placeholder="85"
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
            إضافة
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

// ─── Grade row ─────────────────────────────────────────────────────────────────
// Each row is its own component. This prevents the whole table re-rendering
// when only one row's edit/confirm state changes.

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
  const g = gradeLabel(course.grade)

  return (
    <HoverRow>
      {/* Code */}
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

      {/* Name */}
      <td style={TABLE_TD}>{course.courseName || course.courseCode}</td>

      {/* Credits */}
      <td style={{ ...TABLE_TD, textAlign: 'center' }}>{course.creditHours ?? 3}</td>

      {/* Grade — inline edit */}
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

      {/* Grade label */}
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
          {g.ar}
        </span>
      </td>

      {/* GPA points */}
      <td style={{ ...TABLE_TD, textAlign: 'center', fontWeight: 700 }}>
        {(course.gradePoints ?? 0).toFixed(2)}
      </td>

      {/* Pass/fail */}
      <td style={{ ...TABLE_TD, textAlign: 'center' }}>
        <span
          style={{
            color: course.grade >= 60 ? 'var(--success)' : 'var(--danger)',
            fontWeight: 700,
            fontSize: '.8rem',
          }}
        >
          {course.grade >= 60 ? 'ناجح ✓' : 'راسب ✗'}
        </span>
      </td>

      {/* Actions */}
      <td style={{ ...TABLE_TD, textAlign: 'center' }}>
        {isConfirmingDelete ? (
          // Inline confirm — no window.confirm()
          <div style={{ display: 'flex', gap: '.35rem', justifyContent: 'center', alignItems: 'center' }}>
            <span style={{ fontSize: '.75rem', color: 'var(--muted)', marginLeft: '.25rem' }}>
              حذف؟
            </span>
            <ActionBtn
              color="var(--danger)"
              onClick={onDeleteConfirm}
              disabled={isDeletePending}
            >
              {isDeletePending ? <Spinner size={12} /> : 'تأكيد'}
            </ActionBtn>
            <ActionBtn color="var(--muted)" onClick={onDeleteCancel}>
              إلغاء
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

// ─── Small action button ───────────────────────────────────────────────────────

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
