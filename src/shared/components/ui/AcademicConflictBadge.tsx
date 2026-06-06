import { useTranslation } from 'react-i18next'
import { Badge } from './Card'

export function AcademicConflictBadge() {
  const { t } = useTranslation()
  return (
    <Badge color="var(--gold)">
      ⚠️ {t('common.conflictBadge')}
    </Badge>
  )
}
