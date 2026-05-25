import { useMemo, useState } from 'react'
import { Card, CardTitle, EmptyState } from '@/shared/components/ui/Card'
import { Button } from '@/shared/components/ui/Button'
import { Input, Select } from '@/shared/components/ui/FormPrimitives'
import { Table, HoverRow, TABLE_TD } from '@/shared/components/ui/Table'
import type { AdminCourse, AdminCoursePayload } from '@/shared/types'
import { AdminCourseModal } from './AdminCourseModal'

const PAGE_SIZE = 6

export function CoursesManagementTable({
  courses,
  createPending,
  updatePending,
  createOpen,
  onCreateOpenChange,
  onCreate,
  onUpdate,
}: {
  courses: AdminCourse[]
  createPending: boolean
  updatePending: boolean
  createOpen: boolean
  onCreateOpenChange: (open: boolean) => void
  onCreate: (payload: AdminCoursePayload, onSuccess: () => void) => void
  onUpdate: (courseCode: string, payload: Partial<AdminCoursePayload>, onSuccess: () => void) => void
}) {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')
  const [page, setPage] = useState(1)
  const [editingCourse, setEditingCourse] = useState<AdminCourse | null>(null)

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase()
    return courses.filter((course) => {
      const matchesSearch = !query || course.Code.toLowerCase().includes(query) || course.name.toLowerCase().includes(query)
      const matchesStatus = status === 'all' || (status === 'active' ? course.isActive : !course.isActive)
      return matchesSearch && matchesStatus
    })
  }, [courses, search, status])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, pageCount)
  const pageRows = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  return (
    <>
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
          <div>
            <CardTitle>إدارة المواد</CardTitle>
            <p style={{ color: 'var(--muted)', fontSize: '.8rem', marginTop: '-.65rem' }}>إنشاء وتعديل المواد وحالة إتاحتها.</p>
          </div>
          <Button type="button" variant="primary" size="sm" onClick={() => onCreateOpenChange(true)}>إنشاء مادة</Button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(220px,1fr) 170px', gap: '.75rem', marginBottom: '1rem' }} className="admin-filter-grid">
          <Input placeholder="بحث بالكود أو الاسم" value={search} onChange={(event) => { setSearch(event.target.value); setPage(1) }} />
          <Select value={status} onChange={(event) => { setStatus(event.target.value); setPage(1) }}>
            <option value="all">كل الحالات</option>
            <option value="active">نشطة</option>
            <option value="inactive">غير نشطة</option>
          </Select>
        </div>

        {!pageRows.length ? (
          <EmptyState icon="□" message="لا توجد مواد مطابقة للفلاتر الحالية." />
        ) : (
          <Table headers={['الكود', 'اسم المادة', 'الساعات', 'الفصل', 'المستوى', 'الحالة', 'إجراءات']}>
            {pageRows.map((course) => (
              <CourseRow key={course.Code} course={course} onEdit={() => setEditingCourse(course)} />
            ))}
          </Table>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '.75rem', marginTop: '1rem', color: 'var(--muted)', fontSize: '.78rem' }}>
          <span>صفحة {safePage} من {pageCount}</span>
          <div style={{ display: 'flex', gap: '.45rem' }}>
            <Button type="button" variant="ghost" size="sm" disabled={safePage <= 1} onClick={() => setPage(safePage - 1)}>السابق</Button>
            <Button type="button" variant="ghost" size="sm" disabled={safePage >= pageCount} onClick={() => setPage(safePage + 1)}>التالي</Button>
          </div>
        </div>
      </Card>

      <AdminCourseModal
        open={createOpen}
        loading={createPending}
        onClose={() => onCreateOpenChange(false)}
        onSubmit={(payload) => onCreate(payload, () => onCreateOpenChange(false))}
      />

      <AdminCourseModal
        open={Boolean(editingCourse)}
        course={editingCourse}
        loading={updatePending}
        onClose={() => setEditingCourse(null)}
        onSubmit={(payload) => {
          if (!editingCourse) return
          onUpdate(editingCourse.Code, payload, () => setEditingCourse(null))
        }}
      />

      <style>{`@media(max-width:760px){.admin-filter-grid{grid-template-columns:1fr!important;}}`}</style>
    </>
  )
}

function CourseRow({ course, onEdit }: { course: AdminCourse; onEdit: () => void }) {
  return (
    <HoverRow>
      <td style={TABLE_TD}><span style={codeBadgeStyle}>{course.Code}</span></td>
      <td style={{ ...TABLE_TD, minWidth: 240 }}>{course.name}</td>
      <td style={{ ...TABLE_TD, textAlign: 'center' }}>{course.Credits}</td>
      <td style={{ ...TABLE_TD, textAlign: 'center' }}>{course.Semester}</td>
      <td style={{ ...TABLE_TD, textAlign: 'center' }}>{course.Required_level}</td>
      <td style={{ ...TABLE_TD, textAlign: 'center' }}>
        <span style={{
          color: course.isActive ? 'var(--success)' : 'var(--danger)',
          background: course.isActive ? 'rgba(34,197,94,.12)' : 'rgba(239,68,68,.12)',
          border: `1px solid ${course.isActive ? 'rgba(34,197,94,.25)' : 'rgba(239,68,68,.25)'}`,
          borderRadius: 6,
          padding: '.18rem .55rem',
          fontSize: '.74rem',
          fontWeight: 900,
        }}>
          {course.isActive ? 'نشطة' : 'غير نشطة'}
        </span>
      </td>
      <td style={{ ...TABLE_TD, textAlign: 'center' }}>
        <Button type="button" variant="ghost" size="sm" onClick={onEdit}>تعديل</Button>
      </td>
    </HoverRow>
  )
}

const codeBadgeStyle = {
  background: 'rgba(59,130,246,.1)',
  color: 'var(--accent)',
  border: '1px solid rgba(59,130,246,.18)',
  borderRadius: 6,
  padding: '.2rem .58rem',
  fontSize: '.74rem',
  fontWeight: 800,
  whiteSpace: 'nowrap',
} as const
