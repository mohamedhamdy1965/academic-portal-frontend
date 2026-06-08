import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { userApi } from '@/shared/api/services'
import { queryKeys } from '@/shared/api/queryKeys'
import { useAuth } from '@/providers/AuthProvider'
import { toast } from '@/providers/ToastProvider'
import type { PreferredDepartment } from '@/shared/types'

// ─── Profile query ─────────────────────────────────────────────────────────────

export function useProfile() {
  const { isAuthenticated } = useAuth()

  return useQuery({
    queryKey: queryKeys.user.profile(),
    queryFn: userApi.getProfile,
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 2,
  })
}

// ─── Add course mutation ───────────────────────────────────────────────────────

export function useAddCourse() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ courseCode, grade, regulationSatisfied, studentId }: { courseCode: string; grade: number; regulationSatisfied?: boolean; studentId?: string }) =>
      userApi.addCourse(courseCode, grade, regulationSatisfied, studentId),
    onSuccess: (data, variables) => {
      toast(`تمت إضافة ${data.course?.courseName ?? ''} بنجاح ✅`, 'success')
      if (variables.studentId) {
        queryClient.invalidateQueries({ queryKey: ['admin', 'students'] })
        queryClient.invalidateQueries({ queryKey: queryKeys.admin.analytics() })
      } else {
        queryClient.invalidateQueries({ queryKey: queryKeys.user.profile() })
      }
    },
    onError: (err: { message: string }) => {
      toast(err.message, 'error')
    },
  })
}

// ─── Edit course mutation ──────────────────────────────────────────────────────

export function useEditCourse() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ courseId, grade, regulationSatisfied, studentId }: { courseId: string; grade: number; regulationSatisfied?: boolean; studentId?: string }) =>
      userApi.editCourse(courseId, grade, regulationSatisfied, studentId),
    onSuccess: (data, variables) => {
      toast('تم تعديل الدرجة ✓', 'success')
      if (variables.studentId) {
        queryClient.invalidateQueries({ queryKey: ['admin', 'students'] })
        queryClient.invalidateQueries({ queryKey: queryKeys.admin.analytics() })
      } else {
        queryClient.invalidateQueries({ queryKey: queryKeys.user.profile() })
      }
    },
    onError: (err: { message: string }) => {
      toast(err.message, 'error')
    },
  })
}

// ─── Delete course mutation ────────────────────────────────────────────────────

export function useDeleteCourse() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: string | { courseId: string; studentId?: string }) => {
      const courseId = typeof payload === 'string' ? payload : payload.courseId
      const studentId = typeof payload === 'string' ? undefined : payload.studentId
      return userApi.deleteCourse(courseId, studentId)
    },
    onSuccess: (data, variables) => {
      toast('تم حذف المادة', 'info')
      const studentId = typeof variables === 'string' ? undefined : variables.studentId
      if (studentId) {
        queryClient.invalidateQueries({ queryKey: ['admin', 'students'] })
        queryClient.invalidateQueries({ queryKey: queryKeys.admin.analytics() })
      } else {
        queryClient.invalidateQueries({ queryKey: queryKeys.user.profile() })
      }
    },
    onError: (err: { message: string }) => {
      toast(err.message, 'error')
    },
  })
}

// ─── Update preferred department ──────────────────────────────────────────────

export function useUpdatePreferredDept() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (dept: PreferredDepartment) =>
      userApi.updatePreferredDepartment(dept),
    onSuccess: () => {
      toast('تم تحديث القسم المفضل ✓', 'success')
      queryClient.invalidateQueries({ queryKey: queryKeys.user.profile() })
    },
    onError: (err: { message: string }) => {
      toast(err.message, 'error')
    },
  })
}

// ─── Update profile mutation ───────────────────────────────────────────────────

export function useUpdateProfile() {
  const queryClient = useQueryClient()
  const { t } = useTranslation()
  const { refreshUser } = useAuth()

  return useMutation({
    mutationFn: (payload: {
      fullNameAr?: string
      fullNameEn?: string
      phoneNumber?: string
      email?: string
      address?: string
      profileImage?: string
    }) => userApi.updateProfile(payload),
    onSuccess: (data) => {
      toast(t('profile.saveSuccess') || 'تم حفظ الملف الشخصي بنجاح ✓', 'success')
      queryClient.setQueryData(queryKeys.user.profile(), data.user)
      refreshUser()
    },
    onError: (err: { message: string }) => {
      toast(err.message, 'error')
    },
  })
}

