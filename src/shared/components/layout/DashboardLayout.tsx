import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Sidebar } from './Sidebar'

// Current academic semester — in a real system this would come from the backend
// or a configuration endpoint. Kept as a constant here since the backend
// has no /academic-calendar endpoint.
const CURRENT_SEMESTER = 'الفصل الدراسي الثاني 2024 / 2025'

const TITLES: Record<string, string> = {
  '/dashboard':            'لوحة التحكم',
  '/dashboard/curriculum': 'اللائحة الدراسية',
  '/dashboard/results':    'النتائج والدرجات',
  '/dashboard/predictor':  'توقع الدرجة 🔮',
  '/dashboard/aiplan':     'الخطة الأكاديمية الذكية 🤖',
  '/dashboard/admin':      'لوحة الإدارة',
  '/dashboard/super-admin': 'لوحة الإشراف العام',
}

export function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { pathname } = useLocation()

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div
        style={{
          marginRight: 'var(--sidebar-w)',
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
          {/* Left: hamburger + page title */}
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
              {TITLES[pathname] ?? (pathname.startsWith('/dashboard/admin/students') ? 'تفاصيل الطالب' : 'البوابة الأكاديمية')}
            </h1>
          </div>

          {/* Right: current academic semester indicator */}
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
              {CURRENT_SEMESTER}
            </span>
          </div>
        </header>

        <main style={{ flex: 1, padding: '1.8rem' }} className="animate-in">
          <Outlet />
        </main>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .main-area { margin-right: 0 !important; }
          .hamburger { display: block !important; }
          aside { transform: translateX(100%); }
          .semester-badge { display: none !important; }
        }
      `}</style>
    </div>
  )
}
