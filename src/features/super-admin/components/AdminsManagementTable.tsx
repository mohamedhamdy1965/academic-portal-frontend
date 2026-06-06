import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Card, CardTitle, EmptyState } from '@/shared/components/ui/Card'
import { Button } from '@/shared/components/ui/Button'
import { ConfirmDialog } from '@/shared/components/ui/Modal'
import { Input, Select } from '@/shared/components/ui/FormPrimitives'
import { Table, HoverRow, TABLE_TD } from '@/shared/components/ui/Table'
import type { User } from '@/shared/types'

const PAGE_SIZE = 5

export function AdminsManagementTable({
  admins,
  deletePending,
  onEdit,
  onDelete,
}: {
  admins: User[]
  deletePending: boolean
  onEdit: (admin: User) => void
  onDelete: (adminId: string, onSuccess: () => void) => void
}) {
  const { t, i18n } = useTranslation()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [deletingAdmin, setDeletingAdmin] = useState<User | null>(null)

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    return admins.filter((admin) => {
      const matchesSearch =
        !query ||
        `${admin.firstName} ${admin.lastName}`.toLowerCase().includes(query) ||
        admin.email.toLowerCase().includes(query) ||
        admin.username.toLowerCase().includes(query)

      const status = admin.status ?? 'active'
      const matchesStatus = statusFilter === 'all' || status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [search, statusFilter, admins])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, pageCount)
  const pageRows = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-'
    try {
      return new Date(dateStr).toLocaleDateString(i18n.language === 'ar' ? 'ar-EG' : 'en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    } catch {
      return dateStr
    }
  }

  return (
    <>
      <Card>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: '1rem',
            flexWrap: 'wrap',
            marginBottom: '1rem',
          }}
        >
          <div>
            <CardTitle>{t('super.adminsManagement')}</CardTitle>
            <p style={{ color: 'var(--muted)', fontSize: '.8rem', marginTop: '-.65rem' }}>
              {t('super.adminsManagementDesc')}
            </p>
          </div>
          <span style={{ color: 'var(--accent)', fontSize: '.8rem', fontWeight: 800 }}>
            {t('super.adminsCount', { count: filtered.length })}
          </span>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(220px, 1fr) 180px',
            gap: '.75rem',
            marginBottom: '1rem',
          }}
          className="admin-filter-grid"
        >
          <Input
            placeholder={t('super.searchPlaceholder')}
            value={search}
            onChange={(event) => {
              setSearch(event.target.value)
              setPage(1)
            }}
          />
          <Select
            value={statusFilter}
            onChange={(event) => {
              setStatusFilter(event.target.value)
              setPage(1)
            }}
          >
            <option value="all">{t('admin.allStatuses')}</option>
            <option value="active">{t('super.statusActive')}</option>
            <option value="inactive">{t('super.statusInactive')}</option>
          </Select>
        </div>

        {!pageRows.length ? (
          <EmptyState icon="□" message={t('super.noResults')} />
        ) : (
          <Table headers={[
            t('super.tableHeader.admin'),
            t('super.tableHeader.username'),
            t('super.tableHeader.phone'),
            t('super.tableHeader.createdAt'),
            t('super.tableHeader.status'),
            t('super.tableHeader.actions')
          ]}>
            {pageRows.map((admin) => (
              <HoverRow key={admin._id}>
                <td style={TABLE_TD}>
                  <div style={{ fontWeight: 800 }}>
                    {admin.firstName} {admin.lastName}
                  </div>
                  <div style={{ color: 'var(--muted)', fontSize: '.72rem' }}>{admin.email}</div>
                </td>
                <td style={TABLE_TD}>{admin.username}</td>
                <td style={TABLE_TD}>{admin.phoneNumber ?? '-'}</td>
                <td style={{ ...TABLE_TD, textAlign: 'center' }}>{formatDate(admin.createdAt)}</td>
                <td style={{ ...TABLE_TD, textAlign: 'center' }}>
                  <StatusBadge color={(admin.status ?? 'active') === 'active' ? 'var(--success)' : 'var(--danger)'}>
                    {(admin.status ?? 'active') === 'active' ? t('super.statusActive') : t('super.statusInactive')}
                  </StatusBadge>
                </td>
                <td style={{ ...TABLE_TD, textAlign: 'center' }}>
                  <div style={{ display: 'flex', gap: '.4rem', justifyContent: 'center' }}>
                    <Button type="button" variant="ghost" size="sm" onClick={() => onEdit(admin)}>
                      {t('common.edit')}
                    </Button>
                    <Button type="button" variant="danger" size="sm" onClick={() => setDeletingAdmin(admin)}>
                      {t('common.delete')}
                    </Button>
                  </div>
                </td>
              </HoverRow>
            ))}
          </Table>
        )}

        <Pagination page={safePage} pageCount={pageCount} onPage={setPage} />
      </Card>

      <ConfirmDialog
        open={Boolean(deletingAdmin)}
        title={t('super.deleteAdminConfirmTitle')}
        message={t('super.deleteAdminConfirmMessage', { name: `${deletingAdmin?.firstName ?? ''} ${deletingAdmin?.lastName ?? ''}` })}
        confirmLabel={t('super.deleteAdminConfirmBtn')}
        loading={deletePending}
        onClose={() => setDeletingAdmin(null)}
        onConfirm={() => {
          if (!deletingAdmin?._id) return
          onDelete(deletingAdmin._id, () => setDeletingAdmin(null))
        }}
      />

      <style>{`@media(max-width:760px){.admin-filter-grid{grid-template-columns:1fr!important;}}`}</style>
    </>
  )
}

function StatusBadge({ color, children }: { color: string; children: string }) {
  return (
    <span
      style={{
        color,
        background: `${color}18`,
        border: `1px solid ${color}33`,
        borderRadius: 6,
        padding: '.18rem .55rem',
        fontSize: '.74rem',
        fontWeight: 900,
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </span>
  )
}

function Pagination({ page, pageCount, onPage }: { page: number; pageCount: number; onPage: (page: number) => void }) {
  const { t } = useTranslation()
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '.75rem',
        marginTop: '1rem',
        color: 'var(--muted)',
        fontSize: '.78rem',
      }}
    >
      <span>
        {t('admin.paginationText', { page, pageCount })}
      </span>
      <div style={{ display: 'flex', gap: '.45rem' }}>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={page <= 1}
          onClick={() => onPage(page - 1)}
        >
          {t('admin.paginationPrev')}
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={page >= pageCount}
          onClick={() => onPage(page + 1)}
        >
          {t('admin.paginationNext')}
        </Button>
      </div>
    </div>
  )
}
