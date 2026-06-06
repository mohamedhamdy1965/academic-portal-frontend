import { useTranslation } from 'react-i18next'
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
  const { t } = useTranslation()
  return (
    <Card style={{ marginBottom: '1.25rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
        <div>
          <CardTitle>{t('admin.quickActions')}</CardTitle>
          <p style={{ color: 'var(--muted)', fontSize: '.8rem', marginTop: '-.65rem' }}>
            {t('admin.quickActionsDesc')}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '.55rem', flexWrap: 'wrap' }}>
          <Button type="button" variant="primary" size="sm" onClick={onCreateCourse}>{t('admin.createCourse')}</Button>
          <Button type="button" variant="ghost" size="sm" onClick={onFocusStudents}>{t('admin.students')}</Button>
          <Button type="button" variant="ghost" size="sm" onClick={onFocusCourses}>{t('admin.courses')}</Button>
        </div>
      </div>
    </Card>
  )
}
