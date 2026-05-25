import { Card } from '@/shared/components/ui/Card'
import { SkeletonBlock, SkeletonRow } from '@/shared/components/ui/Spinner'
import { Table } from '@/shared/components/ui/Table'

export function AdminSkeleton() {
  return (
    <div className="animate-in">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(170px,1fr))', gap: '1rem', marginBottom: '1.2rem' }}>
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index}>
            <SkeletonBlock width="45%" height={14} />
            <div style={{ height: 14 }} />
            <SkeletonBlock width="60%" height={30} />
          </Card>
        ))}
      </div>
      <Card>
        <SkeletonBlock width="28%" height={20} />
        <div style={{ height: 18 }} />
        <Table headers={['الاسم', 'الكود', 'القسم', 'GPA', 'الحالة', 'إجراءات']}>
          <SkeletonRow cols={6} />
          <SkeletonRow cols={6} />
          <SkeletonRow cols={6} />
        </Table>
      </Card>
    </div>
  )
}
