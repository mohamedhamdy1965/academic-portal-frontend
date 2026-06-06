import { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslation } from 'react-i18next'
import { Modal } from '@/shared/components/ui/Modal'
import { Button } from '@/shared/components/ui/Button'
import { Field, Input, Select } from '@/shared/components/ui/FormPrimitives'
import type { User } from '@/shared/types'

type AdminFormValues = {
  firstName: string
  lastName: string
  username: string
  email: string
  password?: string
  phoneNumber?: string
  status: 'active' | 'inactive'
}

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
  const { t } = useTranslation()
  const isEdit = Boolean(admin)

  const createSchema = useMemo(() => z.object({
    firstName: z.string().min(2, t('super.adminForm.firstNameRequired')),
    lastName: z.string().min(2, t('super.adminForm.lastNameRequired')),
    username: z.string().min(3, t('super.adminForm.usernameMin')).regex(/^[a-zA-Z0-9._-]+$/, t('super.adminForm.usernameFormat')),
    email: z.string().email(t('super.adminForm.emailError')),
    password: z.string().min(6, t('super.adminForm.passwordError')),
    phoneNumber: z.string().optional().or(z.literal('')),
    status: z.enum(['active', 'inactive']),
  }), [t])

  const editSchema = useMemo(() => z.object({
    firstName: z.string().min(2, t('super.adminForm.firstNameRequired')),
    lastName: z.string().min(2, t('super.adminForm.lastNameRequired')),
    username: z.string().min(3, t('super.adminForm.usernameMin')).regex(/^[a-zA-Z0-9._-]+$/, t('super.adminForm.usernameFormat')),
    email: z.string().email(t('super.adminForm.emailError')),
    password: z.string().optional().or(z.literal('')),
    phoneNumber: z.string().optional().or(z.literal('')),
    status: z.enum(['active', 'inactive']),
  }), [t])

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
      title={isEdit ? t('super.adminForm.editTitle') : t('super.adminForm.createTitle')}
      onClose={loading ? () => {} : onClose}
      maxWidth={540}
      footer={
        <>
          <Button type="submit" form="admin-form" variant="primary" size="md" loading={loading}>
            {isEdit ? t('super.adminForm.saveBtn') : t('super.adminForm.createBtn')}
          </Button>
          <Button type="button" variant="ghost" size="md" onClick={onClose} disabled={loading}>
            {t('common.cancel')}
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
          <Field label={t('login.firstName')}>
            <Input error={errors.firstName?.message} {...register('firstName')} />
          </Field>
          <Field label={t('login.lastName')}>
            <Input error={errors.lastName?.message} {...register('lastName')} />
          </Field>
          <Field label={t('login.username')}>
            <Input error={errors.username?.message} {...register('username')} />
          </Field>
          <Field label={t('login.email')}>
            <Input type="email" error={errors.email?.message} {...register('email')} />
          </Field>
          {!isEdit && (
            <Field label={t('login.password')}>
              <Input type="password" placeholder="••••••••" error={errors.password?.message} {...register('password')} />
            </Field>
          )}
          {isEdit && (
            <Field label={t('super.adminForm.newPasswordLabel')}>
              <Input type="password" placeholder={t('super.adminForm.newPasswordPlaceholder')} error={errors.password?.message} {...register('password')} />
            </Field>
          )}
          <Field label={t('login.phoneNumber')}>
            <Input type="tel" placeholder="+2010xxxxxxxx" error={errors.phoneNumber?.message} {...register('phoneNumber')} />
          </Field>
          <Field label={t('super.adminForm.statusLabel')}>
            <Select {...register('status')}>
              <option value="active">{t('super.adminForm.active')}</option>
              <option value="inactive">{t('super.adminForm.inactive')}</option>
            </Select>
          </Field>
        </div>
        <style>{`@media(max-width:600px){.admin-form-grid{grid-template-columns:1fr!important;}}`}</style>
      </form>
    </Modal>
  )
}
