import { useState, useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/providers/AuthProvider'
import { toast } from '@/providers/ToastProvider'
import { authApi } from '@/shared/api/services'
import { USE_MOCK_API } from '@/shared/api/client'
import { Button } from '@/shared/components/ui/Button'
import { Input, Select, Field } from '@/shared/components/ui/FormPrimitives'
import { Alert } from '@/shared/components/ui/Card'
import fciBranding from '@/assets/fci-branding.png'

import { LanguageSwitcher } from '@/shared/components/ui/LanguageSwitcher'

// ─── Schemas ───────────────────────────────────────────────────────────────────

const loginSchema = z.object({
  email:    z.string().email('بريد إلكتروني غير صحيح'),
  password: z.string().min(6, 'كلمة المرور 6 أحرف على الأقل'),
})

// z.enum produces a type that matches PreferredDepartment exactly,
// avoiding the string → PreferredDepartment mismatch at authApi.register().
const PREFERRED_DEPT_VALUES = ['General', 'IS', 'IT', 'AI', 'CS'] as const

const registerSchema = z.object({
  firstName:           z.string().min(2, 'الاسم مطلوب'),
  lastName:            z.string().min(2, 'الاسم مطلوب'),
  username:            z.string().min(3, 'اسم المستخدم 3 أحرف على الأقل'),
  email:               z.string().email('بريد إلكتروني غير صحيح'),
  password:            z.string().min(6, 'كلمة المرور 6 أحرف على الأقل'),
  department:          z.string().min(1, 'يرجى اختيار القسم'),
  academicYear:        z.string().optional(),
  preferredDepartment: z.enum(PREFERRED_DEPT_VALUES).optional(),
  phoneNumber:         z.string().optional(),
})

type LoginData    = z.infer<typeof loginSchema>
type RegisterData = z.infer<typeof registerSchema>

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function LoginPage() {
  const { i18n } = useTranslation()
  const [tab, setTab]       = useState<'login' | 'register'>('login')
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  const isRtl = i18n.dir() === 'rtl'

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        padding: '2rem 1.5rem',
      }}
    >
      <AnimatedBg />

      <div
        style={{
          position: 'absolute',
          top: '1.5rem',
          right: isRtl ? 'auto' : '1.5rem',
          left: isRtl ? '1.5rem' : 'auto',
          zIndex: 10,
        }}
      >
        <LanguageSwitcher />
      </div>

      <div
        style={{
          width: '100%',
          maxWidth: 520,
          position: 'relative',
          zIndex: 2,
          opacity: mounted ? 1 : 0,
          transform: mounted ? 'translateY(0)' : 'translateY(24px)',
          transition: 'opacity .5s ease, transform .5s ease',
        }}
      >
        <Banner />
        <FormCard tab={tab} setTab={setTab} />
      </div>
    </div>
  )
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function AnimatedBg() {
  return (
    <>
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, background: 'var(--bg)' }} />
      <div style={{ position: 'fixed', inset: 0, zIndex: 0, backgroundImage: 'linear-gradient(rgba(59,130,246,.04) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,.04) 1px, transparent 1px)', backgroundSize: '44px 44px' }} />
      <div style={{ position: 'fixed', top: '-20%', right: '-10%', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(59,130,246,.12) 0%, transparent 70%)', zIndex: 0, animation: 'float1 8s ease-in-out infinite' }} />
      <div style={{ position: 'fixed', bottom: '-15%', left: '-10%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(6,182,212,.1) 0%, transparent 70%)', zIndex: 0, animation: 'float2 10s ease-in-out infinite' }} />
      <div style={{ position: 'fixed', top: '40%', left: '20%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,.07) 0%, transparent 70%)', zIndex: 0, animation: 'float1 12s ease-in-out infinite reverse' }} />
      <style>{`
        @keyframes float1 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-20px)} }
        @keyframes float2 { 0%,100%{transform:translateY(0)} 50%{transform:translateY(20px)} }
        @keyframes bgGlow { 0%,100%{box-shadow:0 0 25px rgba(59,130,246,.45),0 0 70px rgba(59,130,246,.2),inset 0 0 25px rgba(59,130,246,.06)} 50%{box-shadow:0 0 35px rgba(59,130,246,.65),0 0 100px rgba(59,130,246,.3),inset 0 0 35px rgba(59,130,246,.1)} }
        @keyframes scanline { 0%{top:-100%} 100%{top:100%} }
      `}</style>
    </>
  )
}

function Banner() {
  return (
    <div
      style={{
        marginBottom: '1.8rem',
        textAlign: 'center',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
      }}
    >
      <img
        src={fciBranding}
        alt="كلية الحاسبات والذكاء الإصطناعي - Faculty of Computer & Artificial Intelligence"
        className="branding-image"
        style={{
          width: '100%',
          maxWidth: '480px',
          height: 'auto',
          display: 'block',
          objectFit: 'contain',
          borderRadius: '16px',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          cursor: 'pointer',
        }}
      />
      <style>{`
        .branding-image {
          box-shadow: 0 4px 20px rgba(59, 130, 246, 0.15);
        }
        .branding-image:hover {
          transform: translateY(-2px) scale(1.01);
          box-shadow: 0 8px 30px rgba(59, 130, 246, 0.35);
        }
      `}</style>
    </div>
  )
}

function FormCard({ tab, setTab }: { tab: 'login' | 'register'; setTab: (t: 'login' | 'register') => void }) {
  const { t } = useTranslation()

  return (
    <div
      style={{
        background: 'rgba(10,14,24,.96)',
        border: '1px solid rgba(59,130,246,.2)',
        borderRadius: 22,
        padding: '2rem',
        boxShadow: '0 25px 60px rgba(0,0,0,.7)',
        backdropFilter: 'blur(20px)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg, transparent, rgba(59,130,246,.4), transparent)' }} />

      {/* Tab switcher */}
      <div
        style={{
          display: 'flex',
          background: 'rgba(255,255,255,.03)',
          borderRadius: 12,
          padding: 4,
          marginBottom: '1.8rem',
          border: '1px solid rgba(255,255,255,.06)',
        }}
      >
        {(['login', 'register'] as const).map((tVal, i) => (
          <button
            key={tVal}
            onClick={() => setTab(tVal)}
            style={{
              flex: 1,
              padding: '.65rem',
              border: 'none',
              borderRadius: 9,
              cursor: 'pointer',
              background: tab === tVal ? 'linear-gradient(135deg, var(--accent), #1d4ed8)' : 'transparent',
              color: tab === tVal ? '#fff' : 'var(--muted)',
              fontSize: '.92rem',
              fontWeight: 700,
              transition: 'all .25s',
              boxShadow: tab === tVal ? '0 4px 15px rgba(59,130,246,.5)' : 'none',
              fontFamily: 'Cairo, sans-serif',
            }}
          >
            {i === 0 ? t('login.title') : t('login.newAccount')}
          </button>
        ))}
      </div>

      {tab === 'login' ? <LoginForm /> : <RegisterForm onSuccess={() => setTab('login')} />}
    </div>
  )
}

// ─── Login Form ────────────────────────────────────────────────────────────────

function LoginForm() {
  const { t } = useTranslation()
  const { login } = useAuth()
  const navigate  = useNavigate()
  const [serverError, setServerError] = useState('')
  const [guestLoading, setGuestLoading] = useState(false)

  const schema = useMemo(() => z.object({
    email:    z.string().email(t('login.emailError')),
    password: z.string().min(6, t('login.passwordError')),
  }), [t])

  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<LoginData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: LoginData) => {
    setServerError('')
    try {
      const res = await authApi.login(data.email, data.password)
      login(res.token, res.user)
      toast(t('common.welcome'), 'success')
      navigate('/dashboard')
    } catch (err) {
      setServerError((err as { message: string }).message)
    }
  }

  const handleGuestLogin = async () => {
    setServerError('')
    setGuestLoading(true)
    try {
      const res = await authApi.loginGuest()
      login(res.token, res.user)
      toast(t('common.welcomeGuest'), 'success')
      navigate('/guest')
    } catch (err) {
      setServerError((err as { message: string }).message)
    } finally {
      setGuestLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      {serverError && <Alert type="error">{serverError}</Alert>}

      {USE_MOCK_API && (
        <DemoAccounts
          onSelect={(email) => {
            setValue('email', email, { shouldValidate: true })
            setValue('password', 'password123', { shouldValidate: true })
          }}
        />
      )}

      <Field label={t('login.email')}>
        <Input
          type="email"
          placeholder="ahmed@example.com"
          error={errors.email?.message}
          {...register('email')}
        />
      </Field>

      <Field label={t('login.password')}>
        <Input
          type="password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register('password')}
        />
      </Field>

      <Button type="submit" variant="primary" size="lg" fullWidth loading={isSubmitting}>
        {t('login.loginBtn')}
      </Button>

      <div style={{ position: 'relative', textAlign: 'center', margin: '1.2rem 0' }}>
        <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: 1, background: 'var(--border)' }} />
        <span style={{ position: 'relative', background: 'rgba(10,14,24,.96)', padding: '0 .75rem', fontSize: '.78rem', color: 'var(--muted)' }}>{t('login.or')}</span>
      </div>

      <Button
        type="button"
        variant="ghost"
        size="lg"
        fullWidth
        loading={guestLoading}
        onClick={handleGuestLogin}
        style={{
          border: '1px solid rgba(59,130,246,.2)',
          background: 'rgba(59,130,246,.04)',
        }}
      >
        🌐 {t('login.continueAsGuest')}
      </Button>
    </form>
  )
}

// ─── Register Form ─────────────────────────────────────────────────────────────

function DemoAccounts({ onSelect }: { onSelect: (email: string) => void }) {
  const { t } = useTranslation()
  const accounts = [
    { label: 'Student', email: 'student@demo.com' },
    { label: 'Admin', email: 'admin@demo.com' },
    { label: 'Super admin', email: 'super@demo.com' },
  ]

  return (
    <div
      style={{
        background: 'rgba(59,130,246,.06)',
        border: '1px solid rgba(59,130,246,.16)',
        borderRadius: 12,
        padding: '.75rem',
        marginBottom: '1rem',
      }}
    >
      <div
        style={{
          color: 'var(--muted2)',
          fontSize: '.78rem',
          fontWeight: 700,
          marginBottom: '.55rem',
        }}
      >
        {t('login.demoAccounts')}
      </div>
      <div style={{ display: 'flex', gap: '.45rem', flexWrap: 'wrap' }}>
        {accounts.map((account) => (
          <button
            key={account.email}
            type="button"
            onClick={() => onSelect(account.email)}
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              color: 'var(--muted2)',
              fontSize: '.76rem',
              fontWeight: 700,
              padding: '.32rem .6rem',
              fontFamily: 'Cairo, sans-serif',
            }}
          >
            {account.label}
          </button>
        ))}
      </div>
    </div>
  )
}

function RegisterForm({ onSuccess }: { onSuccess: () => void }) {
  const { t } = useTranslation()
  const [serverError, setServerError] = useState('')
  const [serverSuccess, setServerSuccess] = useState('')

  const schema = useMemo(() => z.object({
    firstName:           z.string().min(2, t('login.firstNameError')),
    lastName:            z.string().min(2, t('login.lastNameError')),
    username:            z.string().min(3, t('login.usernameError')),
    email:               z.string().email(t('login.emailError')),
    password:            z.string().min(6, t('login.passwordError')),
    department:          z.string().min(1, t('login.departmentError')),
    academicYear:        z.string().optional(),
    preferredDepartment: z.enum(PREFERRED_DEPT_VALUES).optional(),
    phoneNumber:         z.string().optional(),
  }), [t])

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterData>({
    resolver: zodResolver(schema),
    defaultValues: { preferredDepartment: 'General' },
  })

  const onSubmit = async (data: RegisterData) => {
    setServerError('')
    setServerSuccess('')
    try {
      await authApi.register({
        ...data,
        academicYear: data.academicYear ? Number(data.academicYear) : undefined,
      })
      setServerSuccess(t('login.successRegister'))
      setTimeout(onSuccess, 1500)
    } catch (err) {
      setServerError((err as { message: string }).message)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      {serverError   && <Alert type="error">{serverError}</Alert>}
      {serverSuccess && <Alert type="success">{serverSuccess}</Alert>}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.85rem' }}>
        <Field label={t('login.firstName')}>
          <Input placeholder="Ahmed" error={errors.firstName?.message} {...register('firstName')} />
        </Field>
        <Field label={t('login.lastName')}>
          <Input placeholder="Hassan" error={errors.lastName?.message} {...register('lastName')} />
        </Field>
      </div>

      <Field label={t('login.username')}>
        <Input placeholder="ahmed.hassan" error={errors.username?.message} {...register('username')} />
      </Field>

      <Field label={t('login.email')}>
        <Input type="email" placeholder="ahmed@example.com" error={errors.email?.message} {...register('email')} />
      </Field>

      <Field label={t('login.password')}>
        <Input type="password" placeholder={t('login.passwordError')} error={errors.password?.message} {...register('password')} />
      </Field>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.85rem' }}>
        <Field label={t('login.academicYear')}>
          <Select {...register('academicYear')}>
            <option value="">{t('login.select')}</option>
            {[t('login.year1'), t('login.year2'), t('login.year3'), t('login.year4')].map((y, i) => (
              <option key={i} value={i + 1}>{y}</option>
            ))}
          </Select>
        </Field>
        <Field label={t('login.department')}>
          <Select error={errors.department?.message} {...register('department')}>
            <option value="">{t('login.select')}</option>
            <option value="IS">IS — {t('common.general') === 'عام' ? 'نظم المعلومات' : 'Information Systems'}</option>
            <option value="IT">IT — {t('common.general') === 'عام' ? 'تكنولوجيا المعلومات' : 'Information Technology'}</option>
            <option value="AI">AI — {t('common.general') === 'عام' ? 'الذكاء الاصطناعي' : 'Artificial Intelligence'}</option>
            <option value="CS">CS — {t('common.general') === 'عام' ? 'علوم الحاسب' : 'Computer Science'}</option>
          </Select>
        </Field>
      </div>

      <Field label={t('login.preferredDepartment')}>
        <Select {...register('preferredDepartment')}>
          <option value="General">{t('common.general')}</option>
          <option value="IS">IS — {t('common.general') === 'عام' ? 'نظم المعلومات' : 'Information Systems'}</option>
          <option value="IT">IT — {t('common.general') === 'عام' ? 'تكنولوجيا المعلومات' : 'Information Technology'}</option>
          <option value="AI">AI — {t('common.general') === 'عام' ? 'الذكاء الاصطناعي' : 'Artificial Intelligence'}</option>
          <option value="CS">CS — {t('common.general') === 'عام' ? 'علوم الحاسب' : 'Computer Science'}</option>
        </Select>
      </Field>

      <Field label={t('login.phoneNumber')}>
        <Input type="tel" placeholder="+201012345678" {...register('phoneNumber')} />
      </Field>

      <Button type="submit" variant="primary" size="lg" fullWidth loading={isSubmitting} style={{ marginTop: '.25rem' }}>
        {t('login.createAccount')}
      </Button>
    </form>
  )
}
