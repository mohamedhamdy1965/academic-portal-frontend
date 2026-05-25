import { Card, CardTitle } from '@/shared/components/ui/Card'
import { Button } from '@/shared/components/ui/Button'

export function QuickAdminActions({
  onCreateCourse,
  onFocusStudents,
  onFocusCourses,
}: {
  onCreateCourse: () => void
  onFocusStudents: () => void
  onFocusCourses: () => void
}) {
  return (
    <Card style={{ marginBottom: '1.25rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div>
          <CardTitle>إجراءات سريعة</CardTitle>
          <p style={{ color: 'var(--muted)', fontSize: '.8rem', marginTop: '-.65rem' }}>
            اختصارات لإدارة بيانات البوابة التجريبية.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '.55rem', flexWrap: 'wrap' }}>
          <Button type="button" variant="primary" size="sm" onClick={onCreateCourse}>إنشاء مادة</Button>
          <Button type="button" variant="ghost" size="sm" onClick={onFocusStudents}>الطلاب</Button>
          <Button type="button" variant="ghost" size="sm" onClick={onFocusCourses}>المواد</Button>
        </div>
      </div>
    </Card>
  )
}
