import { useNavigate, useLocation } from 'react-router-dom'
import { useState, type ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { useAuth } from '@/providers/AuthProvider'
import { toast } from '@/providers/ToastProvider'
import { ConfirmDialog } from '@/shared/components/ui/Modal'
import capitalLogo from '@/assets/capital-logo.jpg'

const NAV_ITEMS = [
  { to: '/dashboard',            icon: '🏠', labelKey: 'sidebar.dashboard',     group: 'main'  },
  { to: '/dashboard/curriculum', icon: '📚', labelKey: 'sidebar.curriculum', group: 'main'  },
  { to: '/dashboard/results',    icon: '📊', labelKey: 'sidebar.results', group: 'main'  },
  { to: '/dashboard/profile',    icon: '👤', labelKey: 'sidebar.profile', group: 'main'  },
  { to: '/dashboard/predictor',  icon: '🔮', labelKey: 'sidebar.gradePredictor',      group: 'smart' },
  { to: '/dashboard/aiplan',     icon: '🤖', labelKey: 'sidebar.academicPlanner', group: 'smart' },
  { to: '/dashboard/admin',      icon: '▦', labelKey: 'sidebar.adminDashboard', group: 'admin' },
  { to: '/dashboard/super-admin', icon: '🛡️', labelKey: 'sidebar.superAdminDashboard', group: 'super' },
] as const

interface SidebarProps {
  open: boolean
  onClose: () => void
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const { user, logout } = useAuth()
  const navigate         = useNavigate()
  const { pathname }     = useLocation()
  const { t, i18n }      = useTranslation()

  const isRtl = i18n.dir() === 'rtl'

  const [logoutConfirmOpen, setLogoutConfirmOpen] = useState(false)

  const handleLogoutConfirm = () => {
    setLogoutConfirmOpen(false)
    logout()
    toast(t('common.logout'), 'info')
    navigate('/login')
  }

  const initials = (
    (user?.firstName?.[0] ?? '') + (user?.lastName?.[0] ?? '')
  ).toUpperCase() || 'ST'

  const isStudent = !user?.role || user.role === 'student'
  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin'

  const getRoleLabel = () => {
    if (!user?.role) return t('common.student')
    if (user.role === 'guest') return t('sidebar.guestPortal')
    if (user.role === 'student') return t('common.student')
    if (user.role === 'admin') return t('sidebar.adminDashboard')
    if (user.role === 'super_admin') return t('sidebar.superAdmin')
    return user.role
  }

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div
          aria-hidden="true"
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 49,
            background: 'rgba(0,0,0,.5)',
          }}
        />
      )}

      <aside
        aria-label={t('sidebar.mainNav')}
        style={{
          width: 'var(--sidebar-w)',
          minHeight: '100vh',
          background: 'var(--surface)',
          borderLeft: isRtl ? '1px solid var(--border)' : 'none',
          borderRight: isRtl ? 'none' : '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          right: isRtl ? 0 : 'auto',
          left: isRtl ? 'auto' : 0,
          top: 0,
          zIndex: 50,
          transition: 'transform .3s ease',
          transform: open ? 'translateX(0)' : undefined,
        }}
      >
        {/* Logo */}
        <div
          style={{
            padding: '1.4rem 1.2rem',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            gap: '.75rem',
          }}
        >
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 10,
              background: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              flexShrink: 0,
              border: '1px solid rgba(255,255,255,.08)',
              padding: '2px',
              boxSizing: 'border-box',
            }}
          >
            <img
              src={capitalLogo}
              alt="Capital University"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'contain',
              }}
            />
          </div>
          <div
            style={{
              fontFamily: 'Tajawal, sans-serif',
              fontSize: '.88rem',
              fontWeight: 800,
              lineHeight: 1.2,
              display: 'flex',
              flexDirection: 'column',
              gap: '1px',
            }}
          >
            <span style={{ color: 'var(--text)', fontSize: '.86rem', fontWeight: 800 }}>
              جامعة العاصمة
            </span>
            <span style={{ color: 'var(--muted2)', fontSize: '.72rem', fontWeight: 600 }}>
              Capital University
            </span>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '.75rem 0', overflowY: 'auto' }} aria-label={t('sidebar.mainNav')}>
          {user?.role === 'guest' ? (
            <>
              <SectionLabel>{t('sidebar.guestPortal')}</SectionLabel>
              <NavItem
                item={{ icon: '🌐', label: t('sidebar.discoveryPortal') }}
                active={pathname === '/guest'}
                onClick={() => { navigate('/guest'); onClose() }}
              />
            </>
          ) : (
            <>
              <SectionLabel>{t('sidebar.mainNav')}</SectionLabel>
              {NAV_ITEMS.filter((n) => n.group === 'main').map((n) => (
                <NavItem
                  key={n.to}
                  item={{ icon: n.icon, label: t(n.labelKey) }}
                  active={pathname === n.to}
                  onClick={() => { navigate(n.to); onClose() }}
                />
              ))}

              {isStudent && (
                <>
                  <SectionLabel>{t('sidebar.smartNav') || t('sidebar.smartTools')}</SectionLabel>
                  {NAV_ITEMS.filter((n) => n.group === 'smart').map((n) => (
                    <NavItem
                      key={n.to}
                      item={{ icon: n.icon, label: t(n.labelKey) }}
                      active={pathname === n.to}
                      onClick={() => { navigate(n.to); onClose() }}
                    />
                  ))}
                </>
              )}

              {isAdmin && (
                <>
                  <SectionLabel>{t('sidebar.administration')}</SectionLabel>
                  {NAV_ITEMS.filter((n) => n.group === 'admin').map((n) => (
                    <NavItem
                      key={n.to}
                      item={{ icon: n.icon, label: t(n.labelKey) }}
                      active={pathname === n.to || pathname.startsWith(`${n.to}/`)}
                      onClick={() => { navigate(n.to); onClose() }}
                    />
                  ))}
                </>
              )}

              {user?.role === 'super_admin' && (
                <>
                  <SectionLabel>{t('sidebar.superAdmin')}</SectionLabel>
                  {NAV_ITEMS.filter((n) => n.group === 'super').map((n) => (
                    <NavItem
                      key={n.to}
                      item={{ icon: n.icon, label: t(n.labelKey) }}
                      active={pathname === n.to || pathname.startsWith(`${n.to}/`)}
                      onClick={() => { navigate(n.to); onClose() }}
                    />
                  ))}
                </>
              )}
            </>
          )}
        </nav>

        {/* User footer */}
        <div style={{ padding: '1.1rem 1.2rem', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '.85rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '.7rem' }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 9,
                background: 'linear-gradient(135deg,var(--accent),var(--accent2))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '.85rem',
                flexShrink: 0,
                color: '#fff',
              }}
            >
              {initials}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: '.85rem',
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {user?.firstName} {user?.lastName}
              </div>
              <div style={{ fontSize: '.72rem', color: 'var(--muted)' }}>
                {!isStudent ? (
                  <span style={{ color: 'var(--gold)' }}>
                    {getRoleLabel()}
                  </span>
                ) : (
                  user?.studentId
                )}
              </div>
            </div>
          </div>

          <button
            onClick={() => setLogoutConfirmOpen(true)}
            title={t('common.logout')}
            aria-label={t('common.logout')}
            className="logout-button-ui"
            style={{
              width: '100%',
              height: '42px',
              padding: '0 1rem',
              background: 'rgba(239, 68, 68, 0.08)',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              borderRadius: 10,
              color: '#f87171',
              fontFamily: 'Tajawal, sans-serif',
              fontSize: '.86rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '.5rem',
              cursor: 'pointer',
              boxSizing: 'border-box',
            }}
          >
            <span style={{ fontSize: '1rem' }}>⏻</span>
            <span>{t('common.logout')}</span>
          </button>
        </div>
      </aside>

      <ConfirmDialog
        open={logoutConfirmOpen}
        title={t('common.logoutConfirmTitle')}
        message={t('common.logoutConfirmMessage')}
        confirmLabel={t('common.logoutConfirmButton')}
        cancelLabel={t('common.cancel')}
        onConfirm={handleLogoutConfirm}
        onClose={() => setLogoutConfirmOpen(false)}
      />

      <style>{`
        .logout-button-ui {
          transition: background .2s, border-color .2s, color .2s, transform .2s !important;
        }
        .logout-button-ui:hover {
          background: rgba(239, 68, 68, 0.15) !important;
          border-color: rgba(239, 68, 68, 0.45) !important;
          color: #ef4444 !important;
          transform: translateY(-1px);
        }
        .logout-button-ui:active {
          transform: translateY(1px);
        }
      `}</style>
    </>
  )
}

function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        padding: '.3rem 1.3rem',
        fontSize: '.7rem',
        color: 'var(--muted)',
        fontWeight: 700,
        letterSpacing: '.07em',
        textTransform: 'uppercase',
        marginTop: '.5rem',
      }}
    >
      {children}
    </div>
  )
}

function NavItem({
  item,
  active,
  onClick,
}: {
  item: { icon: string; label: string }
  active: boolean
  onClick: () => void
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
      aria-current={active ? 'page' : undefined}
      className={`sidebar-nav-item ${active ? 'active' : ''}`}
    >
      <span style={{ width: 20, textAlign: 'center' }}>{item.icon}</span>
      {item.label}
    </div>
  )
}
