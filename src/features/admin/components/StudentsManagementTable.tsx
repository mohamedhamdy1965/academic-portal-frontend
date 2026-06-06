import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Card, CardTitle, EmptyState } from '@/shared/components/ui/Card'
import { Button } from '@/shared/components/ui/Button'
import { ConfirmDialog } from '@/shared/components/ui/Modal'
import { Input, Select } from '@/shared/components/ui/FormPrimitives'
import { Table, HoverRow, TABLE_TD } from '@/shared/components/ui/Table'
import { gpaStanding } from '@/shared/constants'
import type { Department, User } from '@/shared/types'

const PAGE_SIZE = 5

export function StudentsManagementTable({
  students,
  deletePending,
  onDelete,
}: {
  students: User[]
  deletePending: boolean
  onDelete: (studentId: string, onSuccess: () => void) => void
}) {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [search, setSearch] = useState('')
  const [department, setDepartment] = useState('all')
  const [standing, setStanding] = useState('all')
  const [page, setPage] = useState(1)
  const [deletingStudent, setDeletingStudent] = useState<User | null>(null)

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    return students.filter((student) => {
      const matchesSearch = !query ||
        `${student.firstName} ${student.lastName}`.toLowerCase().includes(query) ||
        student.email.toLowerCase().includes(query) ||
        (student.studentId ?? '').toLowerCase().includes(query)
      const matchesDepartment = department === 'all' || student.department === department
      const gpa = student.gpa ?? 0
      const status = gpa < 2 && gpa > 0 ? 'risk' : 'good'
      const matchesStanding = standing === 'all' || standing === status
      return matchesSearch && matchesDepartment && matchesStanding
    })
  }, [department, search, standing, students])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, pageCount)
  const pageRows = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  return (
    <>
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
          <div>
            <CardTitle>{t('admin.studentsManagement')}</CardTitle>
            <p style={{ color: 'var(--muted)', fontSize: '.8rem', marginTop: '-.65rem' }}>
              {t('admin.studentsManagementDesc')}
            </p>
          </div>
          <span style={{ color: 'var(--accent)', fontSize: '.8rem', fontWeight: 800 }}>
            {t('admin.studentCount', { count: filtered.length })}
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(220px,1fr) 180px 180px', gap: '.75rem', marginBottom: '1rem' }} className="admin-filter-grid">
          <Input placeholder={t('admin.searchPlaceholder')} value={search} onChange={(event) => { setSearch(event.target.value); setPage(1) }} />
          <Select value={department} onChange={(event) => { setDepartment(event.target.value); setPage(1) }}>
            <option value="all">{t('admin.allDepts')}</option>
            <option value="AI">AI</option>
            <option value="CS">CS</option>
            <option value="IS">IS</option>
            <option value="IT">IT</option>
          </Select>
          <Select value={standing} onChange={(event) => { setStanding(event.target.value); setPage(1) }}>
            <option value="all">{t('admin.allStatuses')}</option>
            <option value="good">{t('admin.statusStable')}</option>
            <option value="risk">{t('admin.statusAtRisk')}</option>
          </Select>
        </div>

        {!pageRows.length ? (
          <EmptyState icon="□" message={t('admin.noResults')} />
        ) : (
          <Table headers={[
            t('admin.tableHeader.student'),
            t('admin.tableHeader.code'),
            t('admin.tableHeader.dept'),
            t('admin.tableHeader.year'),
            t('admin.tableHeader.gpa'),
            t('admin.tableHeader.status'),
            t('admin.tableHeader.actions')
          ]}>
            {pageRows.map((student) => (
              <StudentRow
                key={student._id}
                student={student}
                onDetails={() => navigate(`/dashboard/admin/students/${student.studentId}`)}
                onDelete={() => setDeletingStudent(student)}
              />
            ))}
          </Table>
        )}

        <Pagination page={safePage} pageCount={pageCount} onPage={setPage} />
      </Card>

      <ConfirmDialog
        open={Boolean(deletingStudent)}
        title={t('admin.deleteStudentConfirmTitle')}
        message={t('admin.deleteStudentConfirmMessage', { name: `${deletingStudent?.firstName ?? ''} ${deletingStudent?.lastName ?? ''}` })}
        confirmLabel={t('common.delete')}
        loading={deletePending}
        onClose={() => setDeletingStudent(null)}
        onConfirm={() => {
          if (!deletingStudent?.studentId) return
          onDelete(deletingStudent.studentId, () => setDeletingStudent(null))
        }}
      />

      <style>{`@media(max-width:760px){.admin-filter-grid{grid-template-columns:1fr!important;}}`}</style>
    </>
  )
}

function StudentRow({ student, onDetails, onDelete }: { student: User; onDetails: () => void; onDelete: () => void }) {
  const { t } = useTranslation()
  const standing = gpaStanding(student.gpa ?? 0)
  const isRisk = (student.gpa ?? 0) > 0 && (student.gpa ?? 0) < 2
  return (
    <HoverRow>
      <td style={TABLE_TD}>
        <div style={{ fontWeight: 800 }}>{student.firstName} {student.lastName}</div>
        <div style={{ color: 'var(--muted)', fontSize: '.72rem' }}>{student.email}</div>
      </td>
      <td style={TABLE_TD}>{student.studentId}</td>
      <td style={TABLE_TD}>
        {t('departments.' + student.department, { defaultValue: student.department })}
      </td>
      <td style={{ ...TABLE_TD, textAlign: 'center' }}>{student.academicYear ?? '-'}</td>
      <td style={{ ...TABLE_TD, textAlign: 'center', color: standing.color, fontWeight: 900 }}>{(student.gpa ?? 0).toFixed(2)}</td>
      <td style={{ ...TABLE_TD, textAlign: 'center' }}>
        <StatusBadge color={isRisk ? 'var(--danger)' : 'var(--success)'}>
          {isRisk ? t('admin.statusAtRisk') : t('admin.statusStable')}
        </StatusBadge>
      </td>
      <td style={{ ...TABLE_TD, textAlign: 'center' }}>
        <div style={{ display: 'flex', gap: '.4rem', justifyContent: 'center' }}>
          <Button type="button" variant="ghost" size="sm" onClick={onDetails}>{t('admin.detailsBtn')}</Button>
          <Button type="button" variant="danger" size="sm" onClick={onDelete}>{t('common.delete')}</Button>
        </div>
      </td>
    </HoverRow>
  )
}

function StatusBadge({ color, children }: { color: string; children: string }) {
  return (
    <span style={{ color, background: `${color}18`, border: `1px solid ${color}33`, borderRadius: 6, padding: '.18rem .55rem', fontSize: '.74rem', fontWeight: 900, whiteSpace: 'nowrap' }}>
      {children}
    </span>
  )
}

function Pagination({ page, pageCount, onPage }: { page: number; pageCount: number; onPage: (page: number) => void }) {
  const { t } = useTranslation()
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '.75rem', marginTop: '1rem', color: 'var(--muted)', fontSize: '.78rem' }}>
      <span>{t('admin.paginationText', { page, pageCount })}</span>
      <div style={{ display: 'flex', gap: '.45rem' }}>
        <Button type="button" variant="ghost" size="sm" disabled={page <= 1} onClick={() => onPage(page - 1)}>{t('admin.paginationPrev')}</Button>
        <Button type="button" variant="ghost" size="sm" disabled={page >= pageCount} onClick={() => onPage(page + 1)}>{t('admin.paginationNext')}</Button>
      </div>
    </div>
  )
}
