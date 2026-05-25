import { ReactQueryProvider } from '@/providers/ReactQueryProvider'
import { AuthProvider } from '@/providers/AuthProvider'
import { ToastProvider } from '@/providers/ToastProvider'
import { ErrorBoundary } from '@/shared/components/ui/ErrorBoundary'
import { AppRouter } from '@/routes/AppRouter'

/**
 * Provider hierarchy (outer → inner):
 *
 * ErrorBoundary         — catches render errors before any provider runs
 * ReactQueryProvider    — QueryClient must wrap AuthProvider (AuthProvider
 *                         calls queryClient.clear() on logout)
 * AuthProvider          — reads persisted token, injects into axios
 * ToastProvider         — event-bus toast queue, rendered at root level
 * AppRouter             — routing, lazy-loaded pages
 */
export default function App() {
  return (
    <ErrorBoundary>
      <ReactQueryProvider>
        <AuthProvider>
          <ToastProvider>
            <AppRouter />
          </ToastProvider>
        </AuthProvider>
      </ReactQueryProvider>
    </ErrorBoundary>
  )
}
