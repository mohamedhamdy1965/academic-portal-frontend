import { useTranslation } from 'react-i18next'
import { Card, CardTitle } from '@/shared/components/ui/Card'
import { Button } from '@/shared/components/ui/Button'

export function QuickSuperAdminActions({
  onCreateAdmin,
  onFocusAdmins,
}: {
  onCreateAdmin: () => void
  onFocusAdmins: () => void
}) {
  const { t } = useTranslation()
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
          <CardTitle>{t('super.quickActions')}</CardTitle>
          <p style={{ color: 'var(--muted)', fontSize: '.8rem', marginTop: '-.65rem' }}>
            {t('super.quickActionsDesc')}
          </p>
        </div>
        <div style={{ display: 'flex', gap: '.55rem', flexWrap: 'wrap' }}>
          <Button type="button" variant="primary" size="sm" onClick={onCreateAdmin}>
            {t('super.addAdminBtn')}
          </Button>
          <Button type="button" variant="ghost" size="sm" onClick={onFocusAdmins}>
            {t('super.adminsTableBtn')}
          </Button>
        </div>
      </div>
    </Card>
  )
}
