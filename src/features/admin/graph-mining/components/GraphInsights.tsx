import { Card, CardTitle } from '@/shared/components/ui/Card'
import { useTranslation } from 'react-i18next'

export function GraphInsights() {
  const { t } = useTranslation()

  const cardStyle = {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '1rem',
    padding: '1rem 1.25rem',
    background: 'rgba(255, 255, 255, 0.01)',
    border: '1px solid rgba(255, 255, 255, 0.03)',
    borderRadius: 12,
  }

  const iconStyle = {
    fontSize: '1.4rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 38,
    height: 38,
    borderRadius: 8,
    background: 'rgba(59, 130, 246, 0.08)',
    border: '1px solid rgba(59, 130, 246, 0.15)',
    flexShrink: 0,
  }

  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <CardTitle>{t('graphMining.insightsTitle')}</CardTitle>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1rem',
        }}
      >
        <Card style={cardStyle}>
          <div style={iconStyle}>💡</div>
          <div>
            <h4 style={{ margin: '0 0 .25rem 0', fontSize: '.88rem', fontWeight: 700, color: 'var(--text)' }}>
              {t('common.student') === 'طالب' ? 'رتبة الصفحة الأكثر تأثيراً' : 'Most Influential PageRank'}
            </h4>
            <p style={{ margin: 0, fontSize: '.82rem', color: 'var(--muted2)', lineHeight: 1.5 }}>
              {t('graphMining.insight1')}
            </p>
          </div>
        </Card>

        <Card style={cardStyle}>
          <div style={{ ...iconStyle, background: 'rgba(6, 182, 212, 0.08)', borderColor: 'rgba(6, 182, 212, 0.15)' }}>🕸️</div>
          <div>
            <h4 style={{ margin: '0 0 .25rem 0', fontSize: '.88rem', fontWeight: 700, color: 'var(--text)' }}>
              {t('common.student') === 'طالب' ? 'موزع شبكة الاتصال' : 'Curriculum Network Hub'}
            </h4>
            <p style={{ margin: 0, fontSize: '.82rem', color: 'var(--muted2)', lineHeight: 1.5 }}>
              {t('graphMining.insight2')}
            </p>
          </div>
        </Card>

        <Card style={cardStyle}>
          <div style={{ ...iconStyle, background: 'rgba(245, 158, 11, 0.08)', borderColor: 'rgba(245, 158, 11, 0.15)' }}>🌉</div>
          <div>
            <h4 style={{ margin: '0 0 .25rem 0', fontSize: '.88rem', fontWeight: 700, color: 'var(--text)' }}>
              {t('common.student') === 'طالب' ? 'عنق زجاجة المنهج الدراسي' : 'Gateway Course Bridge'}
            </h4>
            <p style={{ margin: 0, fontSize: '.82rem', color: 'var(--muted2)', lineHeight: 1.5 }}>
              {t('graphMining.insight3')}
            </p>
          </div>
        </Card>

        <Card style={cardStyle}>
          <div style={{ ...iconStyle, background: 'rgba(168, 85, 247, 0.08)', borderColor: 'rgba(168, 85, 247, 0.15)' }}>🧠</div>
          <div>
            <h4 style={{ margin: '0 0 .25rem 0', fontSize: '.88rem', fontWeight: 700, color: 'var(--text)' }}>
              {t('common.student') === 'طالب' ? 'التمهيد الرياضي للذكاء الاصطناعي' : 'Mathematical Foundation'}
            </h4>
            <p style={{ margin: 0, fontSize: '.82rem', color: 'var(--muted2)', lineHeight: 1.5 }}>
              {t('graphMining.insight4')}
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}
