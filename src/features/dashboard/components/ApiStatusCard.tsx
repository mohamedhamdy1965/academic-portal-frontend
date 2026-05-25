import { useApiHealth } from '@/shared/hooks/useApiHealth'
import { USE_MOCK_API } from '@/shared/api/client'
import { Card } from '@/shared/components/ui/Card'
import { Button } from '@/shared/components/ui/Button'
import { Spinner } from '@/shared/components/ui/Spinner'

export function ApiStatusCard() {
  const { data, isFetching, isError, refetch } = useApiHealth()
  const isOnline = data?.status === 'ok' && !isError
  const color = isOnline ? 'var(--success)' : 'var(--danger)'

  return (
    <Card
      style={{
        marginBottom: '1.4rem',
        padding: '1rem 1.15rem',
        borderColor: isOnline ? 'rgba(34,197,94,.2)' : 'rgba(239,68,68,.22)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '.9rem',
          flexWrap: 'wrap',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem', minWidth: 0 }}>
          <span
            aria-hidden="true"
            style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              background: color,
              boxShadow: `0 0 16px ${color}66`,
              flexShrink: 0,
            }}
          />
          <div style={{ minWidth: 0 }}>
            <div
              style={{
                fontFamily: 'Tajawal, sans-serif',
                fontSize: '.9rem',
                fontWeight: 800,
                color,
              }}
            >
              {isOnline ? (USE_MOCK_API ? 'Mock API ready' : 'API connected') : 'API unavailable'}
            </div>
            <div
              style={{
                color: 'var(--muted)',
                fontSize: '.76rem',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {isOnline
                ? `${data.service} - ${new Date(data.timestamp).toLocaleTimeString('ar-EG')}`
                : 'Frontend is running without a backend dependency'}
            </div>
          </div>
        </div>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => refetch()}
          disabled={isFetching}
          style={{ minWidth: 86 }}
        >
          {isFetching ? <Spinner size={14} /> : 'Check'}
        </Button>
      </div>
    </Card>
  )
}
