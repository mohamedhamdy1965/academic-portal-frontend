import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Sidebar } from './Sidebar'
import { LanguageSwitcher } from '../ui/LanguageSwitcher'

const TITLE_KEYS: Record<string, string> = {
  '/dashboard':            'sidebar.dashboard',
  '/dashboard/curriculum': 'sidebar.curriculum',
  '/dashboard/results':    'sidebar.results',
  '/dashboard/predictor':  'sidebar.gradePredictor',
  '/dashboard/aiplan':     'sidebar.academicPlanner',
  '/dashboard/admin':      'sidebar.adminDashboard',
  '/dashboard/super-admin': 'sidebar.superAdminDashboard',
  '/guest':                'sidebar.guestPortal',
}

export function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { pathname } = useLocation()
  const { t, i18n } = useTranslation()

  const isRtl = i18n.dir() === 'rtl'

  const titleKey = TITLE_KEYS[pathname]
  let title = titleKey ? t(titleKey) : ''
  if (!title) {
    if (pathname.startsWith('/dashboard/admin/students')) {
      title = t('admin.adminDetailsTitle')
    } else {
      title = t('sidebar.mainHeader')
    }
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div
        style={{
          marginRight: isRtl ? 'var(--sidebar-w)' : 0,
          marginLeft: isRtl ? 0 : 'var(--sidebar-w)',
          flex: 1,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
        }}
        className="main-area"
      >
        <header
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 40,
            background: 'rgba(7,9,15,.9)',
            backdropFilter: 'blur(20px)',
            borderBottom: '1px solid var(--border)',
            padding: '1rem 1.8rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
          }}
        >
          {/* Right/Left depending on RTL: hamburger + page title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '.8rem', minWidth: 0 }}>
            <button
              className="hamburger"
              onClick={() => setSidebarOpen(true)}
              aria-label="فتح القائمة"
              style={{
                display: 'none',
                background: 'none',
                border: 'none',
                color: 'var(--text)',
                fontSize: '1.4rem',
                cursor: 'pointer',
                flexShrink: 0,
              }}
            >
              ☰
            </button>
            <h1
              style={{
                fontFamily: 'Tajawal, sans-serif',
                fontSize: '1.15rem',
                fontWeight: 800,
                margin: 0,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {title}
            </h1>
          </div>

          {/* Left/Right depending on RTL: LanguageSwitcher + current academic semester indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <LanguageSwitcher />

            <div
              className="semester-badge"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '.45rem',
                background: 'rgba(59,130,246,.07)',
                border: '1px solid rgba(59,130,246,.15)',
                borderRadius: 8,
                padding: '.32rem .75rem',
                flexShrink: 0,
              }}
            >
              <span style={{ fontSize: '.72rem' }}>🗓️</span>
              <span
                style={{
                  fontSize: '.75rem',
                  color: 'var(--muted2)',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                }}
              >
                {t('dashboard.currentSemester')}
              </span>
            </div>
          </div>
        </header>

        <main style={{ flex: 1, padding: '1.8rem' }} className="animate-in">
          <Outlet />
        </main>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .main-area { margin-right: 0 !important; margin-left: 0 !important; }
          .hamburger { display: block !important; }
          aside { transform: ${isRtl ? 'translateX(100%)' : 'translateX(-100%)'}; }
          .semester-badge { display: none !important; }
        }
      `}</style>
    </div>
  )
}

