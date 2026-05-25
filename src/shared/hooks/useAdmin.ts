import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { adminApi } from '@/shared/api/services'
import { queryKeys } from '@/shared/api/queryKeys'
import { toast } from '@/providers/ToastProvider'
import type { AdminCoursePayload } from '@/shared/types'

export function useAdminAnalytics() {
  return useQuery({
    queryKey: queryKeys.admin.analytics(),
    queryFn: adminApi.getAnalytics,
    staleTime: 1000 * 60,
  })
}

export function useAdminStudents() {
  return useQuery({
    queryKey: queryKeys.admin.students(),
    queryFn: adminApi.getStudents,
    staleTime: 1000 * 60,
  })
}

export function useAdminStudent(studentId: string) {
  return useQuery({
    queryKey: queryKeys.admin.student(studentId),
    queryFn: () => adminApi.getStudent(studentId),
    enabled: Boolean(studentId),
  })
}

export function useDeleteStudent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: adminApi.deleteStudent,
    onSuccess: () => {
      toast('تم حذف الطالب', 'info')
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.students() })
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.analytics() })
    },
    onError: (err: { message: string }) => toast(err.message, 'error'),
  })
}

export function useAdminCourses() {
  return useQuery({
    queryKey: queryKeys.admin.courses(),
    queryFn: adminApi.getCourses,
    staleTime: 1000 * 60,
  })
}

export function useCreateAdminCourse() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: AdminCoursePayload) => adminApi.createCourse(payload),
    onSuccess: () => {
      toast('تم إنشاء المادة', 'success')
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.courses() })
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.analytics() })
    },
    onError: (err: { message: string }) => toast(err.message, 'error'),
  })
}

export function useUpdateAdminCourse() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ courseCode, payload }: { courseCode: string; payload: Partial<AdminCoursePayload> }) =>
      adminApi.updateCourse(courseCode, payload),
    onSuccess: () => {
      toast('تم تحديث المادة', 'success')
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.courses() })
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.analytics() })
    },
    onError: (err: { message: string }) => toast(err.message, 'error'),
  })
}
