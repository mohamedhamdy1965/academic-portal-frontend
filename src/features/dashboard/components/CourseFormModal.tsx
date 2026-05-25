import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Modal } from '@/shared/components/ui/Modal'
import { Button } from '@/shared/components/ui/Button'
import { Field, Input } from '@/shared/components/ui/FormPrimitives'
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
    formState: { errors },
  } = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      courseCode: course?.courseCode ?? '',
      grade: course?.grade ?? undefined,
    },
  })

  useEffect(() => {
    reset({
      courseCode: course?.courseCode ?? '',
      grade: course?.grade ?? undefined,
    })
  }, [course, open, reset])

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
          onSubmit({ courseCode: values.courseCode.toUpperCase().trim(), grade: values.grade })
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
      </form>
    </Modal>
  )
}
