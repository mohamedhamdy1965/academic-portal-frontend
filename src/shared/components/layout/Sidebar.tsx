import { useNavigate, useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useAuth } from '@/providers/AuthProvider'
import { toast } from '@/providers/ToastProvider'
import { ROLE_LABELS } from '@/shared/constants'

const NAV_ITEMS = [
  { to: '/dashboard',            icon: '🏠', label: 'لوحة التحكم',     group: 'main'  },
  { to: '/dashboard/curriculum', icon: '📚', label: 'اللائحة الدراسية', group: 'main'  },
  { to: '/dashboard/results',    icon: '📊', label: 'النتائج والدرجات', group: 'main'  },
  { to: '/dashboard/predictor',  icon: '🔮', label: 'توقع الدرجة',      group: 'smart' },
  { to: '/dashboard/aiplan',     icon: '🤖', label: 'الخطة الأكاديمية', group: 'smart' },
  { to: '/dashboard/admin',      icon: '▦', label: 'لوحة الإدارة', group: 'admin' },
  { to: '/dashboard/super-admin', icon: '🛡️', label: 'الإشراف العام', group: 'super' },
] as const

interface SidebarProps {
  open: boolean
  onClose: () => void
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const { user, logout } = useAuth()
  const navigate         = useNavigate()
  const { pathname }     = useLocation()

  const handleLogout = () => {
    logout()
    toast('تم تسجيل الخروج', 'info')
    navigate('/login')
  }

  const initials = (
    (user?.firstName?.[0] ?? '') + (user?.lastName?.[0] ?? '')
  ).toUpperCase() || 'ST'

  const isStudent = !user?.role || user.role === 'student'
  const isAdmin = user?.role === 'admin' || user?.role === 'super_admin'

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
        aria-label="القائمة الجانبية"
        style={{
          width: 'var(--sidebar-w)',
          minHeight: '100vh',
          background: 'var(--surface)',
          borderLeft: '1px solid var(--border)',
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          right: 0,
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
              background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.2rem',
              flexShrink: 0,
            }}
          >
            🎓
          </div>
          <div
            style={{
              fontFamily: 'Tajawal, sans-serif',
              fontSize: '.85rem',
              fontWeight: 800,
              lineHeight: 1.35,
            }}
          >
            جامعة العاصمة
            <span
              style={{
                display: 'block',
                color: 'var(--accent)',
                fontSize: '.78rem',
              }}
            >
              Faculty of Computers & AI
            </span>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '.75rem 0', overflowY: 'auto' }} aria-label="التنقل">
          <SectionLabel>القائمة الرئيسية</SectionLabel>
          {NAV_ITEMS.filter((n) => n.group === 'main').map((n) => (
            <NavItem
              key={n.to}
              item={n}
              active={pathname === n.to}
              onClick={() => { navigate(n.to); onClose() }}
            />
          ))}

          {isStudent && (
            <>
              <SectionLabel>أدوات ذكية</SectionLabel>
              {NAV_ITEMS.filter((n) => n.group === 'smart').map((n) => (
                <NavItem
                  key={n.to}
                  item={n}
                  active={pathname === n.to}
                  onClick={() => { navigate(n.to); onClose() }}
                />
              ))}
            </>
          )}

          {isAdmin && (
            <>
              <SectionLabel>الإدارة</SectionLabel>
              {NAV_ITEMS.filter((n) => n.group === 'admin').map((n) => (
                <NavItem
                  key={n.to}
                  item={n}
                  active={pathname === n.to || pathname.startsWith(`${n.to}/`)}
                  onClick={() => { navigate(n.to); onClose() }}
                />
              ))}
            </>
          )}

          {user?.role === 'super_admin' && (
            <>
              <SectionLabel>الإشراف العام</SectionLabel>
              {NAV_ITEMS.filter((n) => n.group === 'super').map((n) => (
                <NavItem
                  key={n.to}
                  item={n}
                  active={pathname === n.to || pathname.startsWith(`${n.to}/`)}
                  onClick={() => { navigate(n.to); onClose() }}
                />
              ))}
            </>
          )}
        </nav>

        {/* User footer */}
        <div style={{ padding: '1.1rem 1.3rem', borderTop: '1px solid var(--border)' }}>
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
                    {ROLE_LABELS[user?.role ?? ''] ?? user?.role}
                  </span>
                ) : (
                  user?.studentId
                )}
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="تسجيل الخروج"
              aria-label="تسجيل الخروج"
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--muted)',
                fontSize: '1.1rem',
                padding: '.3rem',
                borderRadius: 6,
                cursor: 'pointer',
                transition: 'color .2s',
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = 'var(--danger)')}
              onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = 'var(--muted)')}
            >
              ⏻
            </button>
          </div>
        </div>
      </aside>
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
