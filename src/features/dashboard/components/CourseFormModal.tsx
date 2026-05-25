import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Modal } from '@/shared/components/ui/Modal'
import { Button } from '@/shared/components/ui/Button'
import { Field, Input } from '@/shared/components/ui/FormPrimitives'
import { Alert } from '@/shared/components/ui/Card'
import { isAcademicConflict } from '@/features/academic/utils/academic'
import type { EnrolledCourse } from '@/shared/types'

const courseSchema = z.object({
  courseCode: z
    .string()
    .min(1, 'كود المادة مطلوب')
    .regex(/^[A-Za-z]{2,3}\d{3}$/, 'اكتب الكود بصيغة مثل CS316'),
  grade: z
    .number({ invalid_type_error: 'الدرجة مطلوبة' })
    .min(0, 'أقل درجة 0')
    .max(100, 'أعلى درجة 100'),
  regulationSatisfied: z.boolean().default(false),
})

export type CourseFormValues = z.infer<typeof courseSchema>

interface CourseFormModalProps {
  mode: 'add' | 'edit'
  open: boolean
  course?: EnrolledCourse | null
  loading?: boolean
  onClose: () => void
  onSubmit: (values: CourseFormValues) => void
}

export function CourseFormModal({
  mode,
  open,
  course,
  loading = false,
  onClose,
  onSubmit,
}: CourseFormModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      courseCode: course?.courseCode ?? '',
      grade: course?.grade ?? undefined,
      regulationSatisfied: course?.regulationSatisfied ?? false,
    },
  })

  useEffect(() => {
    reset({
      courseCode: course?.courseCode ?? '',
      grade: course?.grade ?? undefined,
      regulationSatisfied: course?.regulationSatisfied ?? false,
    })
  }, [course, open, reset])

  const watchedGrade = watch('grade')
  const watchedRegulationSatisfied = watch('regulationSatisfied')

  const showConflictWarning = isAcademicConflict({
    grade: Number(watchedGrade) || 0,
    regulationSatisfied: watchedRegulationSatisfied,
  })

  const title = mode === 'add' ? 'إضافة مادة' : 'تعديل درجة المادة'

  return (
    <Modal
      open={open}
      title={title}
      onClose={loading ? () => {} : onClose}
      footer={
        <>
          <Button
            type="submit"
            variant="primary"
            size="md"
            loading={loading}
            form="course-form"
          >
            {mode === 'add' ? 'إضافة' : 'حفظ'}
          </Button>
          <Button type="button" variant="ghost" size="md" onClick={onClose} disabled={loading}>
            إلغاء
          </Button>
        </>
      }
    >
      <form
        id="course-form"
        onSubmit={handleSubmit((values) => {
          onSubmit({
            courseCode: values.courseCode.toUpperCase().trim(),
            grade: values.grade,
            regulationSatisfied: values.regulationSatisfied,
          })
        })}
        noValidate
      >
        <Field label="كود المادة">
          <Input
            placeholder="CS316"
            disabled={mode === 'edit'}
            error={errors.courseCode?.message}
            style={{ textTransform: 'uppercase' }}
            {...register('courseCode')}
          />
        </Field>
        <Field label="الدرجة من 100">
          <Input
            type="number"
            placeholder="85"
            min={0}
            max={100}
            error={errors.grade?.message}
            {...register('grade', { valueAsNumber: true })}
          />
        </Field>

        <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem', marginBottom: '0.4rem', marginTop: '1.25rem' }}>
          <input
            type="checkbox"
            id="regulationSatisfied"
            style={{
              width: '18px',
              height: '18px',
              accentColor: 'var(--accent)',
              cursor: 'pointer',
            }}
            {...register('regulationSatisfied')}
          />
          <label htmlFor="regulationSatisfied" style={{ fontSize: '.85rem', color: 'var(--muted2)', fontWeight: 600, cursor: 'pointer' }}>
            تم استيفاء اللائحة
          </label>
        </div>
        <p style={{ color: 'var(--muted)', fontSize: '.75rem', marginTop: '0.2rem', marginBottom: '1.25rem', paddingRight: '1.65rem', lineHeight: 1.4 }}>
          حدد هذا الخيار إذا كانت المادة مستوفية للائحة الأكاديمية.
        </p>

        {showConflictWarning && (
          <div style={{ marginTop: '0.5rem', marginBottom: '1rem' }}>
            <Alert type="warning">
              قد تتطلب هذه المادة مراجعة أكاديمية.
            </Alert>
          </div>
        )}
      </form>
    </Modal>
  )
}
