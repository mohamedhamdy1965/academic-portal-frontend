import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
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
    mutationFn: ({ courseCode, grade }: { courseCode: string; grade: number }) =>
      userApi.addCourse(courseCode, grade),
    onSuccess: (data) => {
      toast(`تمت إضافة ${data.course?.courseName ?? ''} بنجاح ✅`, 'success')
      queryClient.invalidateQueries({ queryKey: queryKeys.user.profile() })
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
    mutationFn: ({ courseId, grade }: { courseId: string; grade: number }) =>
      userApi.editCourse(courseId, grade),
    onSuccess: () => {
      toast('تم تعديل الدرجة ✓', 'success')
      queryClient.invalidateQueries({ queryKey: queryKeys.user.profile() })
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
    mutationFn: (courseId: string) => userApi.deleteCourse(courseId),
    onSuccess: () => {
      toast('تم حذف المادة', 'info')
      queryClient.invalidateQueries({ queryKey: queryKeys.user.profile() })
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
