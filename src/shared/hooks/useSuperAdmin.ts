import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { superAdminApi } from '@/shared/api/services'
import { queryKeys } from '@/shared/api/queryKeys'
import { toast } from '@/providers/ToastProvider'
import type { User } from '@/shared/types'

export function useSuperAdminAnalytics() {
  return useQuery({
    queryKey: queryKeys.superAdmin.analytics(),
    queryFn: superAdminApi.getAnalytics,
    staleTime: 1000 * 60,
  })
}

export function useSuperAdminAdmins() {
  return useQuery({
    queryKey: queryKeys.superAdmin.admins(),
    queryFn: superAdminApi.getAdmins,
    staleTime: 1000 * 60,
  })
}

export function useCreateAdmin() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: Omit<User, '_id' | 'role'> & { password?: string }) =>
      superAdminApi.createAdmin(payload),
    onSuccess: (data) => {
      toast(data.msg || 'تم إنشاء حساب المشرف بنجاح', 'success')
      queryClient.invalidateQueries({ queryKey: queryKeys.superAdmin.admins() })
      queryClient.invalidateQueries({ queryKey: queryKeys.superAdmin.analytics() })
    },
    onError: (err: { message: string }) => {
      toast(err.message || 'خطأ أثناء إنشاء حساب المشرف', 'error')
    },
  })
}

export function useUpdateAdmin() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ adminId, payload }: { adminId: string; payload: Partial<User> }) =>
      superAdminApi.updateAdmin(adminId, payload),
    onSuccess: (data) => {
      toast(data.msg || 'تم تحديث حساب المشرف بنجاح', 'success')
      queryClient.invalidateQueries({ queryKey: queryKeys.superAdmin.admins() })
      queryClient.invalidateQueries({ queryKey: queryKeys.superAdmin.analytics() })
    },
    onError: (err: { message: string }) => {
      toast(err.message || 'خطأ أثناء تحديث حساب المشرف', 'error')
    },
  })
}

export function useDeleteAdmin() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: superAdminApi.deleteAdmin,
    onSuccess: (data) => {
      toast(data.msg || 'تم حذف حساب المشرف بنجاح', 'info')
      queryClient.invalidateQueries({ queryKey: queryKeys.superAdmin.admins() })
      queryClient.invalidateQueries({ queryKey: queryKeys.superAdmin.analytics() })
    },
    onError: (err: { message: string }) => {
      toast(err.message || 'خطأ أثناء حذف حساب المشرف', 'error')
    },
  })
}
