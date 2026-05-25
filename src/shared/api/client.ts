import axios, { AxiosError, type AxiosInstance, type InternalAxiosRequestConfig } from 'axios'
import type { ApiError } from '@/shared/types'

// ─── Axios instance ────────────────────────────────────────────────────────────

const API_URL    = import.meta.env.VITE_API_URL    ?? 'http://localhost:5000/api'
const AI_API_URL = import.meta.env.VITE_AI_API_URL ?? 'https://ai-grad-project-1ifh.vercel.app'
export const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API !== 'false'

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15_000,
})

export const aiClient: AxiosInstance = axios.create({
  baseURL: AI_API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 20_000,
})

// ─── Token injection ───────────────────────────────────────────────────────────

export function setAuthToken(token: string | null) {
  if (token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`
  } else {
    delete apiClient.defaults.headers.common['Authorization']
  }
}

// ─── Unauthorized callback ─────────────────────────────────────────────────────

let _onUnauthorized: (() => void) | null = null

export function setUnauthorizedHandler(fn: () => void) {
  _onUnauthorized = fn
}

// ─── Response interceptor – normalize errors ──────────────────────────────────

function normalizeError(error: AxiosError): ApiError {
  const data = error.response?.data as Record<string, unknown> | undefined
  const message =
    (typeof data?.msg === 'string' ? data.msg : null) ||
    (typeof data?.message === 'string' ? data.message : null) ||
    error.message ||
    'حدث خطأ غير متوقع'

  return { message, status: error.response?.status }
}

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      _onUnauthorized?.()
    }
    const normalized = normalizeError(error)
    return Promise.reject(normalized)
  },
)

aiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    return Promise.reject(normalizeError(error))
  },
)

// ─── Request interceptor (optional logging in dev) ────────────────────────────

if (import.meta.env.DEV) {
  apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    return config
  })
}
