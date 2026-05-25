import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Modal } from '@/shared/components/ui/Modal'
import { Button } from '@/shared/components/ui/Button'
import { Field, Input, Select } from '@/shared/components/ui/FormPrimitives'
import type { User } from '@/shared/types'

const createSchema = z.object({
  firstName: z.string().min(2, 'الاسم الأول مطلوب'),
  lastName: z.string().min(2, 'الاسم الأخير مطلوب'),
  username: z.string().min(3, 'اسم المستخدم 3 أحرف على الأقل').regex(/^[a-zA-Z0-9._-]+$/, 'حروف وأرقام ونقاط أو شرطات فقط'),
  email: z.string().email('بريد إلكتروني غير صحيح'),
  password: z.string().min(6, 'كلمة المرور 6 أحرف على الأقل'),
  phoneNumber: z.string().optional().or(z.literal('')),
  status: z.enum(['active', 'inactive']),
})

const editSchema = z.object({
  firstName: z.string().min(2, 'الاسم الأول مطلوب'),
  lastName: z.string().min(2, 'الاسم الأخير مطلوب'),
  username: z.string().min(3, 'اسم المستخدم 3 أحرف على الأقل').regex(/^[a-zA-Z0-9._-]+$/, 'حروف وأرقام ونقاط أو شرطات فقط'),
  email: z.string().email('بريد إلكتروني غير صحيح'),
  password: z.string().optional().or(z.literal('')),
  phoneNumber: z.string().optional().or(z.literal('')),
  status: z.enum(['active', 'inactive']),
})

type AdminFormValues = z.infer<typeof createSchema>

export function AdminFormModal({
  open,
  admin,
  loading,
  onClose,
  onSubmit,
}: {
  open: boolean
  admin?: User | null
  loading: boolean
  onClose: () => void
  onSubmit: (payload: Omit<User, '_id' | 'role'> & { password?: string }) => void
}) {
  const isEdit = Boolean(admin)
  const schema = isEdit ? editSchema : createSchema

  const { register, handleSubmit, reset, formState: { errors } } = useForm<AdminFormValues>({
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    reset({
      firstName: admin?.firstName ?? '',
      lastName: admin?.lastName ?? '',
      username: admin?.username ?? '',
      email: admin?.email ?? '',
      password: '',
      phoneNumber: admin?.phoneNumber ?? '',
      status: admin?.status ?? 'active',
    })
  }, [admin, open, reset])

  return (
    <Modal
      open={open}
      title={isEdit ? 'تعديل حساب مشرف' : 'إنشاء حساب مشرف جديد'}
      onClose={loading ? () => {} : onClose}
      maxWidth={540}
      footer={
        <>
          <Button type="submit" form="admin-form" variant="primary" size="md" loading={loading}>
            {isEdit ? 'حفظ التعديلات' : 'إنشاء الحساب'}
          </Button>
          <Button type="button" variant="ghost" size="md" onClick={onClose} disabled={loading}>
            إلغاء
          </Button>
        </>
      }
    >
      <form
        id="admin-form"
        onSubmit={handleSubmit((values) => {
          const payload: Omit<User, '_id' | 'role'> & { password?: string } = {
            firstName: values.firstName.trim(),
            lastName: values.lastName.trim(),
            username: values.username.toLowerCase().trim(),
            email: values.email.toLowerCase().trim(),
            phoneNumber: values.phoneNumber?.trim() || undefined,
            status: values.status,
          }
          if (values.password) {
            payload.password = values.password
          }
          onSubmit(payload)
        })}
        noValidate
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.85rem' }} className="admin-form-grid">
          <Field label="الاسم الأول *">
            <Input error={errors.firstName?.message} {...register('firstName')} />
          </Field>
          <Field label="الاسم الأخير *">
            <Input error={errors.lastName?.message} {...register('lastName')} />
          </Field>
          <Field label="اسم المستخدم *">
            <Input error={errors.username?.message} {...register('username')} />
          </Field>
          <Field label="البريد الإلكتروني *">
            <Input type="email" error={errors.email?.message} {...register('email')} />
          </Field>
          {!isEdit && (
            <Field label="كلمة المرور *">
              <Input type="password" placeholder="••••••••" error={errors.password?.message} {...register('password')} />
            </Field>
          )}
          {isEdit && (
            <Field label="كلمة مرور جديدة (اختياري)">
              <Input type="password" placeholder="اتركه فارغاً للاحتفاظ بالقديمة" error={errors.password?.message} {...register('password')} />
            </Field>
          )}
          <Field label="رقم الهاتف">
            <Input type="tel" placeholder="+2010xxxxxxxx" error={errors.phoneNumber?.message} {...register('phoneNumber')} />
          </Field>
          <Field label="حالة الحساب *">
            <Select {...register('status')}>
              <option value="active">نشط</option>
              <option value="inactive">غير نشط</option>
            </Select>
          </Field>
        </div>
        <style>{`@media(max-width:600px){.admin-form-grid{grid-template-columns:1fr!important;}}`}</style>
      </form>
    </Modal>
  )
}
