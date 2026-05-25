import { Card } from '@/shared/components/ui/Card'
import { SkeletonBlock, SkeletonRow } from '@/shared/components/ui/Spinner'
import { Table } from '@/shared/components/ui/Table'

export function StudentDashboardSkeleton() {
  return (
    <div className="animate-in">
      <Card style={{ marginBottom: '1.4rem' }}>
        <SkeletonBlock height={24} width="42%" />
        <div style={{ height: 12 }} />
        <SkeletonBlock height={14} width="64%" />
      </Card>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1rem',
          marginBottom: '1.4rem',
        }}
      >
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index}>
            <SkeletonBlock height={18} width="35%" />
            <div style={{ height: 18 }} />
            <SkeletonBlock height={32} width="55%" />
            <div style={{ height: 12 }} />
            <SkeletonBlock height={12} width="78%" />
          </Card>
        ))}
      </div>

      <Card>
        <SkeletonBlock height={20} width="28%" />
        <div style={{ height: 18 }} />
        <Table headers={['الكود', 'اسم المادة', 'الساعات', 'الدرجة', 'الحالة', 'إجراءات']}>
          <SkeletonRow cols={6} />
          <SkeletonRow cols={6} />
          <SkeletonRow cols={6} />
        </Table>
      </Card>
    </div>
  )
}
