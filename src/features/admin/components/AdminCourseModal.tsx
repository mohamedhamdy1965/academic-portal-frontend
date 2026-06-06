import { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslation } from 'react-i18next'
import { Modal } from '@/shared/components/ui/Modal'
import { Button } from '@/shared/components/ui/Button'
import { Field, Input, Select } from '@/shared/components/ui/FormPrimitives'
import type { AdminCourse, AdminCoursePayload, PreferredDepartment } from '@/shared/types'

type CourseForm = {
  Code: string
  name: string
  Credits: number
  Semester: number
  Required_level: number
  Required_Hours: number
  isActive: boolean
  department?: 'General' | 'IS' | 'IT' | 'AI' | 'CS'
}

export function AdminCourseModal({
  open,
  course,
  loading,
  onClose,
  onSubmit,
}: {
  open: boolean
  course?: AdminCourse | null
  loading: boolean
  onClose: () => void
  onSubmit: (payload: AdminCoursePayload) => void
}) {
  const { t } = useTranslation()

  const schema = useMemo(() => z.object({
    Code: z.string().min(1, t('admin.courseForm.codeRequired')).regex(/^[A-Za-z]{2,3}\d{3}$/, t('admin.courseForm.codeFormat')),
    name: z.string().min(2, t('admin.courseForm.nameRequired')),
    Credits: z.number().min(1).max(6),
    Semester: z.coerce.number().refine((value) => value === 1 || value === 2),
    Required_level: z.coerce.number().refine((value) => [1, 2, 3, 4].includes(value)),
    Required_Hours: z.number().min(0).max(136),
    isActive: z.preprocess((value) => value === true || value === 'true', z.boolean()),
    department: z.enum(['General', 'IS', 'IT', 'AI', 'CS']).optional(),
  }), [t])

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CourseForm>({
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    reset({
      Code: course?.Code ?? '',
      name: course?.name ?? '',
      Credits: course?.Credits ?? 3,
      Semester: course?.Semester ?? 1,
      Required_level: course?.Required_level ?? 1,
      Required_Hours: course?.Required_Hours ?? 0,
      isActive: course?.isActive ?? true,
      department: course?.department ?? 'General',
    })
  }, [course, open, reset])

  return (
    <Modal
      open={open}
      title={course ? t('admin.courseForm.editTitle') : t('admin.courseForm.createTitle')}
      onClose={loading ? () => {} : onClose}
      maxWidth={560}
      footer={
        <>
          <Button type="submit" form="admin-course-form" variant="primary" size="md" loading={loading}>
            {course ? t('common.save') : t('admin.courseForm.createBtn')}
          </Button>
          <Button type="button" variant="ghost" size="md" onClick={onClose} disabled={loading}>{t('common.cancel')}</Button>
        </>
      }
    >
      <form
        id="admin-course-form"
        onSubmit={handleSubmit((values) => onSubmit({
          ...values,
          Code: values.Code.toUpperCase().trim(),
          Semester: values.Semester as 1 | 2,
          Required_level: values.Required_level as 1 | 2 | 3 | 4,
          department: values.department as PreferredDepartment,
        }))}
        noValidate
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.85rem' }} className="admin-form-grid">
          <Field label={t('admin.courseForm.codeLabel')}>
            <Input disabled={Boolean(course)} error={errors.Code?.message} {...register('Code')} />
          </Field>
          <Field label={t('admin.courseForm.nameLabel')}>
            <Input error={errors.name?.message} {...register('name')} />
          </Field>
          <Field label={t('admin.courseForm.creditsLabel')}>
            <Input type="number" error={errors.Credits?.message} {...register('Credits', { valueAsNumber: true })} />
          </Field>
          <Field label={t('admin.courseForm.semesterLabel')}>
            <Select {...register('Semester')}>
              <option value={1}>{t('admin.courseForm.semester1')}</option>
              <option value={2}>{t('admin.courseForm.semester2')}</option>
            </Select>
          </Field>
          <Field label={t('admin.courseForm.levelLabel')}>
            <Select {...register('Required_level')}>
              {[1, 2, 3, 4].map((level) => <option key={level} value={level}>{level}</option>)}
            </Select>
          </Field>
          <Field label={t('admin.courseForm.hoursLabel')}>
            <Input type="number" error={errors.Required_Hours?.message} {...register('Required_Hours', { valueAsNumber: true })} />
          </Field>
          <Field label={t('admin.courseForm.departmentLabel')}>
            <Select {...register('department')}>
              <option value="General">{t('admin.courseForm.deptGeneral')}</option>
              <option value="IS">IS</option>
              <option value="IT">IT</option>
              <option value="AI">AI</option>
              <option value="CS">CS</option>
            </Select>
          </Field>
          <Field label={t('admin.courseForm.statusLabel')}>
            <Select {...register('isActive')}>
              <option value="true">{t('admin.courseForm.active')}</option>
              <option value="false">{t('admin.courseForm.inactive')}</option>
            </Select>
          </Field>
        </div>
        <style>{`@media(max-width:640px){.admin-form-grid{grid-template-columns:1fr!important;}}`}</style>
      </form>
    </Modal>
  )
}
