import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { setAuthToken, setUnauthorizedHandler } from '@/shared/api/client'
import { userApi } from '@/shared/api/services'
import { queryKeys } from '@/shared/api/queryKeys'
import type { User } from '@/shared/types'

// ─── Storage helpers ───────────────────────────────────────────────────────────

const TOKEN_KEY = 'gp_token'
const USER_KEY  = 'gp_user'

function loadToken(): string {
  return localStorage.getItem(TOKEN_KEY) ?? ''
}

function loadUser(): User | null {
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? (JSON.parse(raw) as User) : null
  } catch {
    return null
  }
}

// ─── Context types ─────────────────────────────────────────────────────────────

interface AuthContextValue {
  token: string
  user: User | null
  isAuthenticated: boolean
  login: (token: string, user: User) => void
  logout: () => void
  refreshUser: () => Promise<User | null>
}

const AuthContext = createContext<AuthContextValue | null>(null)

// ─── Provider ─────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string>(loadToken)
  const [user, setUser]   = useState<User | null>(loadUser)
  const queryClient       = useQueryClient()

  // Hydrate axios with persisted token on mount
  useEffect(() => {
    if (token) setAuthToken(token)
  }, [])

  const logout = useCallback(() => {
    setToken('')
    setUser(null)
    setAuthToken(null)
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    queryClient.clear()
  }, [queryClient])

  // Wire 401 handler so axios interceptor can trigger logout
  useEffect(() => {
    setUnauthorizedHandler(() => {
      logout()
      // Toast is shown in the interceptor consumer (AppRouter redirect triggers the message)
    })
  }, [logout])

  const login = useCallback((tok: string, userData: User) => {
    setToken(tok)
    setUser(userData)
    setAuthToken(tok)
    localStorage.setItem(TOKEN_KEY, tok)
    localStorage.setItem(USER_KEY, JSON.stringify(userData))
  }, [])

  const refreshUser = useCallback(async (): Promise<User | null> => {
    if (!token) return null
    try {
      const fresh = await userApi.getProfile()
      setUser(fresh)
      localStorage.setItem(USER_KEY, JSON.stringify(fresh))
      // Keep React Query cache warm
      queryClient.setQueryData(queryKeys.user.profile(), fresh)
      return fresh
    } catch {
      return null
    }
  }, [token, queryClient])

  return (
    <AuthContext.Provider value={{
      token,
      user,
      isAuthenticated: Boolean(token),
      login,
      logout,
      refreshUser,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

// ─── Hook ──────────────────────────────────────────────────────────────────────

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
