import { Card, CardTitle } from '@/shared/components/ui/Card'
import { Button } from '@/shared/components/ui/Button'

export function QuickSuperAdminActions({
  onCreateAdmin,
  onFocusAdmins,
}: {
  onCreateAdmin: () => void
  onFocusAdmins: () => void
}) {
  return (
    <Card style={{ marginBottom: '1.25rem' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          gap: '1rem',
          flexWrap: 'wrap',
          alignItems: 'center',
        }}
      >
        <div>
          <CardTitle>إجراءات سريعة</CardTitle>
          <p style={{ color: 'var(--muted)', fontSize: '.8rem', marginTop: '-.65rem' }}>
            اختصارات لإدارة حسابات المشرفين ومتابعة أداء النظام.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '.55rem', flexWrap: 'wrap' }}>
          <Button type="button" variant="primary" size="sm" onClick={onCreateAdmin}>
            إضافة مشرف جديد
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={onFocusAdmins}>
            جدول المشرفين
          </Button>
        </div>
      </div>
    </Card>
  )
}
