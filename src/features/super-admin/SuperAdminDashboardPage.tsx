import { useMemo, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/providers/AuthProvider'
import {
  useSuperAdminAnalytics,
  useSuperAdminAdmins,
  useCreateAdmin,
  useUpdateAdmin,
  useDeleteAdmin,
} from '@/shared/hooks/useSuperAdmin'
import { SuperAdminAnalyticsCards } from './components/SuperAdminAnalyticsCards'
import { QuickSuperAdminActions } from './components/QuickSuperAdminActions'
import { AdminsManagementTable } from './components/AdminsManagementTable'
import { AdminFormModal } from './components/AdminFormModal'
import { SuperAdminSkeleton } from './components/SuperAdminSkeleton'
import type { User } from '@/shared/types'

export default function SuperAdminDashboardPage() {
  const { user } = useAuth()
  const [adminFormOpen, setAdminFormOpen] = useState(false)
  const [editingAdmin, setEditingAdmin] = useState<User | null>(null)

  const analyticsQuery = useSuperAdminAnalytics()
  const adminsQuery = useSuperAdminAdmins()

  const createAdminMutation = useCreateAdmin()
  const updateAdminMutation = useUpdateAdmin()
  const deleteAdminMutation = useDeleteAdmin()

  const isSuperAdmin = user?.role === 'super_admin'
  if (!isSuperAdmin) {
    return <Navigate to="/dashboard" replace />
  }

  const loading = analyticsQuery.isLoading || adminsQuery.isLoading
  const analytics = analyticsQuery.data
  const admins = adminsQuery.data ?? []

  const focusTargets = useMemo(
    () => ({
      admins: () =>
        document.getElementById('super-admins-table')?.scrollIntoView({ behavior: 'smooth', block: 'start' }),
    }),
    [],
  )

  const handleCreateOrUpdateAdminSubmit = (payload: Omit<User, '_id' | 'role'> & { password?: string }) => {
    if (editingAdmin) {
      updateAdminMutation.mutate(
        { adminId: editingAdmin._id, payload },
        {
          onSuccess: () => {
            setAdminFormOpen(false)
            setEditingAdmin(null)
          },
        },
      )
    } else {
      createAdminMutation.mutate(payload, {
        onSuccess: () => {
          setAdminFormOpen(false)
        },
      })
    }
  }

  if (loading || !analytics) {
    return <SuperAdminSkeleton />
  }

  return (
    <div className="animate-in">
      <SuperAdminAnalyticsCards analytics={analytics} />

      <QuickSuperAdminActions
        onCreateAdmin={() => {
          setEditingAdmin(null)
          setAdminFormOpen(true)
        }}
        onFocusAdmins={focusTargets.admins}
      />

      <section id="super-admins-table" style={{ scrollMarginTop: 90 }}>
        <AdminsManagementTable
          admins={admins}
          deletePending={deleteAdminMutation.isPending}
          onEdit={(admin) => {
            setEditingAdmin(admin)
            setAdminFormOpen(true)
          }}
          onDelete={(adminId, onSuccess) => {
            deleteAdminMutation.mutate(adminId, { onSuccess })
          }}
        />
      </section>

      <AdminFormModal
        open={adminFormOpen}
        admin={editingAdmin}
        loading={createAdminMutation.isPending || updateAdminMutation.isPending}
        onClose={() => {
          setAdminFormOpen(false)
          setEditingAdmin(null)
        }}
        onSubmit={handleCreateOrUpdateAdminSubmit}
      />
    </div>
  )
}
