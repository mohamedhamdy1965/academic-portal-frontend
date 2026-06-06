import { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslation } from 'react-i18next'
import { Modal } from '@/shared/components/ui/Modal'
import { Button } from '@/shared/components/ui/Button'
import { Field, Input } from '@/shared/components/ui/FormPrimitives'
import { Alert } from '@/shared/components/ui/Card'
import { isAcademicConflict } from '@/features/academic/utils/academic'
import type { EnrolledCourse } from '@/shared/types'

// Static type schema (for typescript helper type inference)
const courseSchema = z.object({
  courseCode: z.string(),
  grade: z.number(),
  regulationSatisfied: z.boolean(),
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
  const { t } = useTranslation()

  // Dynamic schema resolved inside components
  const localSchema = useMemo(() => z.object({
    courseCode: z
      .string()
      .min(1, t('dashboard.courseCodeRequired'))
      .regex(/^[A-Za-z]{2,3}\d{3}$/, t('dashboard.courseCodeFormat')),
    grade: z
      .number({ invalid_type_error: t('dashboard.gradeRequired') })
      .min(0, t('dashboard.gradeMin'))
      .max(100, t('dashboard.gradeMax')),
    regulationSatisfied: z.boolean().default(false),
  }), [t])

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<CourseFormValues>({
    resolver: zodResolver(localSchema),
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

  const title = mode === 'add' ? t('common.addCourse') : t('common.editCourse')

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
            {mode === 'add' ? t('common.save') : t('common.save')}
          </Button>
          <Button type="button" variant="ghost" size="md" onClick={onClose} disabled={loading}>
            {t('common.cancel')}
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
        <Field label={t('dashboard.courseCodeLabel')}>
          <Input
            placeholder="CS316"
            disabled={mode === 'edit'}
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
            {t('common.regulationSatisfied')}
          </label>
        </div>
        <p style={{ color: 'var(--muted)', fontSize: '.75rem', marginTop: '0.2rem', marginBottom: '1.25rem', paddingRight: '1.65rem', paddingLeft: '1.65rem', lineHeight: 1.4 }}>
          {t('common.regulationDescription')}
        </p>

        {showConflictWarning && (
          <div style={{ marginTop: '0.5rem', marginBottom: '1rem' }}>
            <Alert type="warning">
              {t('dashboard.courseConflictWarning')}
            </Alert>
          </div>
        )}
      </form>
    </Modal>
  )
}
