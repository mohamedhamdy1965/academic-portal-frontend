import { lazy, Suspense, type ReactNode } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from '@/providers/AuthProvider'
import { DashboardLayout } from '@/shared/components/layout/DashboardLayout'
import { PageLoader } from '@/shared/components/ui/Spinner'

// ─── Lazy-loaded pages ────────────────────────────────────────────────────────

const LoginPage      = lazy(() => import('@/features/auth/LoginPage'))
const DashboardPage  = lazy(() => import('@/features/dashboard/DashboardPage'))
const ResultsPage    = lazy(() => import('@/features/results/ResultsPage'))
const CurriculumPage = lazy(() => import('@/features/curriculum/CurriculumPage'))
const PredictorPage  = lazy(() => import('@/features/predictor/PredictorPage'))
const AIPlanPage     = lazy(() => import('@/features/ai-plan/AIPlanPage'))
const AdminDashboardPage = lazy(() => import('@/features/admin/AdminDashboardPage'))
const StudentDetailsPage = lazy(() => import('@/features/admin/StudentDetailsPage'))
const SuperAdminDashboardPage = lazy(() => import('@/features/super-admin/SuperAdminDashboardPage'))
const GuestDashboardPage = lazy(() => import('@/features/guest/GuestDashboardPage'))

// ─── Route guards ──────────────────────────────────────────────────────────────

function ProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, user } = useAuth()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (user?.role === 'guest') return <Navigate to="/guest" replace />
  return <>{children}</>
}

function GuestRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, user } = useAuth()
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (user?.role !== 'guest') return <Navigate to="/dashboard" replace />
  return <>{children}</>
}

function PublicRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, user } = useAuth()
  if (!isAuthenticated) return <>{children}</>
  return <Navigate to={user?.role === 'guest' ? '/guest' : '/dashboard'} replace />
}

// ─── Router ────────────────────────────────────────────────────────────────────

export function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index            element={<DashboardPage />} />
            <Route path="curriculum" element={<CurriculumPage />} />
            <Route path="results"    element={<ResultsPage />} />
            <Route path="predictor"  element={<PredictorPage />} />
            <Route path="aiplan"     element={<AIPlanPage />} />
            <Route path="admin"      element={<AdminDashboardPage />} />
            <Route path="admin/students/:studentId" element={<StudentDetailsPage />} />
            <Route path="super-admin" element={<SuperAdminDashboardPage />} />
          </Route>

          <Route
            path="/guest"
            element={
              <GuestRoute>
                <DashboardLayout />
              </GuestRoute>
            }
          >
            <Route index element={<GuestDashboardPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
