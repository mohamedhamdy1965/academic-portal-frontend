import { useState, useMemo, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/providers/AuthProvider'
import { useProfile, useUpdateProfile } from '@/shared/hooks/useProfile'
import { Card, CardTitle } from '@/shared/components/ui/Card'
import { Button } from '@/shared/components/ui/Button'
import { Input, Field } from '@/shared/components/ui/FormPrimitives'
import { PageLoader } from '@/shared/components/ui/Spinner'
import { DEPT_COLORS } from '@/shared/constants'
import type { Department } from '@/shared/types'

// ─── Component ─────────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const { t, i18n } = useTranslation()
  const { user: authUser } = useAuth()
  const { data: profile, isLoading } = useProfile()
  const updateProfileMutation = useUpdateProfile()

  const user = profile ?? authUser
  const isRtl = i18n.dir() === 'rtl'

  const [isEditing, setIsEditing] = useState(false)
  const [imageError, setImageError] = useState(false)

  // Validation Schema
  const schema = useMemo(() => z.object({
    fullNameAr: z.string().min(1, t('profile.validation.fullNameArRequired')),
    fullNameEn: z.string().min(1, t('profile.validation.fullNameEnRequired')),
    phoneNumber: z.string().min(1, t('profile.validation.phoneRequired')),
    email: z.string().email(t('profile.validation.invalidEmail')).min(1, t('profile.validation.emailRequired')),
    address: z.string().min(1, t('profile.validation.addressRequired')),
    profileImage: z.string().optional().or(z.literal('')),
  }), [t])

  type ProfileFormData = z.infer<typeof schema>

  const { register, handleSubmit, reset, formState: { errors } } = useForm<ProfileFormData>({
    resolver: zodResolver(schema),
  })

  // Reset form default values when user data loads or changes
  useEffect(() => {
    if (user) {
      reset({
        fullNameAr: user.fullNameAr || '',
        fullNameEn: user.fullNameEn || '',
        phoneNumber: user.phoneNumber || '',
        email: user.email || '',
        address: user.address || '',
        profileImage: user.profileImage || '',
      })
      setImageError(false)
    }
  }, [user, reset])

  if (isLoading && !user) {
    return <PageLoader message={t('common.loading')} />
  }

  if (!user) {
    return <PageLoader message={t('common.loading')} />
  }

  const initials = (
    (user.firstName?.[0] ?? '') + (user.lastName?.[0] ?? '')
  ).toUpperCase() || 'ST'

  const isStudent = !user.role || user.role === 'student'
  const dept = user.department ?? 'General'
  const deptColor = DEPT_COLORS[dept as Department] ?? 'var(--accent)'

  const getDeptLabel = (d: string) => {
    if (d === 'General') return t('common.general')
    return t(`departments.${d}`) || d
  }

  const getYearLabel = (y: number) => {
    if (y >= 1 && y <= 4) return t(`login.year${y}`)
    return y.toString()
  }

  const getRoleLabel = (role: string) => {
    if (role === 'guest') return t('sidebar.guestPortal')
    if (role === 'student') return t('common.student')
    if (role === 'admin') return t('sidebar.adminDashboard')
    if (role === 'super_admin') return t('sidebar.superAdmin')
    return role
  }

  const onSubmit = (data: ProfileFormData) => {
    updateProfileMutation.mutate(data, {
      onSuccess: () => {
        setIsEditing(false)
      }
    })
  }

  const handleCancel = () => {
    reset()
    setIsEditing(false)
  }

  return (
    <div className="animate-in" style={{ paddingBottom: '2rem' }}>
      {/* Header Profile Cover Card */}
      <section
        style={{
          background: 'linear-gradient(135deg, rgba(59,130,246,.1), rgba(6,182,212,.05))',
          border: '1px solid rgba(59,130,246,.18)',
          borderRadius: 18,
          padding: '1.5rem 1.8rem',
          marginBottom: '1.35rem',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1.25rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
          {/* Avatar Container */}
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              fontWeight: 800,
              color: '#fff',
              border: '2px solid rgba(255,255,255,0.1)',
              boxShadow: '0 0 20px rgba(59,130,246,0.25)',
              overflow: 'hidden',
              flexShrink: 0,
            }}
          >
            {user.profileImage && !imageError ? (
              <img
                src={user.profileImage}
                alt={user.fullNameEn || user.firstName}
                onError={() => setImageError(true)}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <span>{initials}</span>
            )}
          </div>

          <div>
            <h2
              style={{
                fontFamily: 'Tajawal, sans-serif',
                fontSize: '1.35rem',
                fontWeight: 900,
                margin: 0,
                marginBottom: '.35rem',
              }}
            >
              {isRtl ? (user.fullNameAr || `${user.firstName} ${user.lastName}`) : (user.fullNameEn || `${user.firstName} ${user.lastName}`)}
            </h2>
            <div style={{ color: 'var(--muted2)', fontSize: '.86rem', display: 'flex', alignItems: 'center', gap: '.5rem' }}>
              <span>{getRoleLabel(user.role || 'student')}</span>
              {isStudent && (
                <>
                  <span>·</span>
                  <span>{user.studentId}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {!isEditing && (
          <Button variant="outline" onClick={() => setIsEditing(true)}>
            👤 {t('profile.editProfile')}
          </Button>
        )}
      </section>

      {/* Main Grid Layout */}
      <div
        className="profile-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.25fr) minmax(320px, 0.75fr)',
          gap: '1.25rem',
          alignItems: 'start',
        }}
      >
        {/* Personal Info Area */}
        <div>
          {isEditing ? (
            <Card>
              <CardTitle>{t('profile.personalInfo')}</CardTitle>
              <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                    gap: '1rem',
                  }}
                >
                  <Field label={t('profile.fullNameAr')}>
                    <Input error={errors.fullNameAr?.message} {...register('fullNameAr')} />
                  </Field>

                  <Field label={t('profile.fullNameEn')}>
                    <Input error={errors.fullNameEn?.message} {...register('fullNameEn')} />
                  </Field>

                  <Field label={t('profile.phoneNumber')}>
                    <Input error={errors.phoneNumber?.message} {...register('phoneNumber')} />
                  </Field>

                  <Field label={t('profile.email')}>
                    <Input type="email" error={errors.email?.message} {...register('email')} />
                  </Field>

                  <Field label={t('profile.address')}>
                    <Input error={errors.address?.message} {...register('address')} />
                  </Field>

                  <Field label={t('profile.profileImage')}>
                    <Input error={errors.profileImage?.message} {...register('profileImage')} placeholder="https://example.com/image.png" />
                  </Field>
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: '.75rem',
                    marginTop: '1.5rem',
                  }}
                >
                  <Button variant="outline" type="button" onClick={handleCancel}>
                    {t('common.cancel')}
                  </Button>
                  <Button variant="primary" type="submit" loading={updateProfileMutation.isPending}>
                    {t('common.save')}
                  </Button>
                </div>
              </form>
            </Card>
          ) : (
            <Card>
              <CardTitle>{t('profile.personalInfo')}</CardTitle>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <InfoItem label={t('profile.fullNameAr')} value={user.fullNameAr} />
                <InfoItem label={t('profile.fullNameEn')} value={user.fullNameEn} />
                <InfoItem label={t('profile.phoneNumber')} value={user.phoneNumber} />
                <InfoItem label={t('profile.email')} value={user.email} />
                <InfoItem label={t('profile.address')} value={user.address} />
                {user.profileImage && (
                  <InfoItem label={t('profile.profileImage')} value={user.profileImage} />
                )}
              </div>
            </Card>
          )}
        </div>

        {/* Academic & Account Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {isStudent && (
            <Card>
              <CardTitle>{t('profile.academicInfo')}</CardTitle>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <InfoItem label={t('profile.studentId')} value={user.studentId} />
                <InfoItem label={t('profile.department')} value={getDeptLabel(dept)} />
                <InfoItem label={t('profile.academicYear')} value={getYearLabel(user.academicYear ?? 0)} />
                <InfoItem label={t('profile.gpa')} value={user.gpa ?? t('dashboard.gpaEmpty')} />
                <InfoItem label={t('profile.completedHours')} value={user.totalCreditHours ?? 0} />
              </div>
            </Card>
          )}

          <Card>
            <CardTitle>{t('profile.accountInfo')}</CardTitle>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <InfoItem label={t('profile.role')} value={getRoleLabel(user.role || 'student')} />
              {isStudent && (
                <InfoItem
                  label={t('profile.preferredDept')}
                  value={getDeptLabel(user.preferredDepartment ?? 'General')}
                />
              )}
            </div>
          </Card>
        </div>
      </div>

      <style>{`
        @media (max-width: 920px) {
          .profile-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}

// ─── InfoItem Helper ───────────────────────────────────────────────────────────

interface InfoItemProps {
  label: string
  value: string | number | undefined
}

function InfoItem({ label, value }: InfoItemProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '.25rem',
        padding: '.85rem 0',
        borderBottom: '1px solid rgba(255,255,255,.04)',
      }}
    >
      <span style={{ fontSize: '.8rem', color: 'var(--muted2)' }}>{label}</span>
      <span style={{ fontSize: '.95rem', fontWeight: 600, color: 'var(--text)', wordBreak: 'break-all' }}>
        {value || '—'}
      </span>
    </div>
  )
}
