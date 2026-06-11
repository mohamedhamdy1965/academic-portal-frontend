import { Card } from '@/shared/components/ui/Card'
import { useTranslation } from 'react-i18next'
import type { CourseMetric } from '../types'

interface OverviewCardsProps {
  metrics: CourseMetric[]
}

export function OverviewCards({ metrics }: OverviewCardsProps) {
  const { t } = useTranslation()

  if (!metrics || metrics.length === 0) return null

  // Calc highest degree
  const highestDegree = metrics.reduce((max, c) => c.degree_score > max.degree_score ? c : max, metrics[0])
  // Calc highest PageRank
  const highestPageRank = metrics.reduce((max, c) => c.pagerank_score > max.pagerank_score ? c : max, metrics[0])
  // Calc highest Betweenness
  const highestBetweenness = metrics.reduce((max, c) => c.betweenness_score > max.betweenness_score ? c : max, metrics[0])

  const cardStyle = {
    display: 'flex',
    flexDirection: 'column' as const,
    justifyContent: 'space-between',
    minHeight: '120px',
  }

  const valueStyle = {
    fontSize: '1.8rem',
    fontWeight: 800,
    color: 'var(--text)',
    lineHeight: 1.25,
    margin: '.25rem 0',
  }

  const courseStyle = {
    fontSize: '.78rem',
    color: 'var(--accent)',
    fontWeight: 700,
    whiteSpace: 'nowrap' as const,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    marginTop: '.2rem',
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1.25rem',
        marginBottom: '1.5rem',
      }}
    >
      {/* Total Courses */}
      <Card style={cardStyle}>
        <div style={{ fontSize: '1.4rem' }}>📚</div>
        <div>
          <div style={{ color: 'var(--muted)', fontSize: '.8rem', fontWeight: 600 }}>
            {t('graphMining.totalCourses')}
          </div>
          <div style={valueStyle}>{metrics.length}</div>
        </div>
        <div style={{ fontSize: '.75rem', color: 'var(--muted2)' }}>{t('common.all')}</div>
      </Card>

      {/* Highest Degree */}
      <Card style={cardStyle}>
        <div style={{ fontSize: '1.4rem' }}>🕸️</div>
        <div>
          <div style={{ color: 'var(--muted)', fontSize: '.8rem', fontWeight: 600 }}>
            {t('graphMining.highestDegree')}
          </div>
          <div style={valueStyle}>{highestDegree.degree_score}</div>
        </div>
        <div style={courseStyle} title={highestDegree.course}>
          {highestDegree.course}
        </div>
      </Card>

      {/* Highest PageRank */}
      <Card style={cardStyle}>
        <div style={{ fontSize: '1.4rem' }}>🔮</div>
        <div>
          <div style={{ color: 'var(--muted)', fontSize: '.8rem', fontWeight: 600 }}>
            {t('graphMining.highestPageRank')}
          </div>
          <div style={valueStyle}>{highestPageRank.pagerank_score.toFixed(4)}</div>
        </div>
        <div style={courseStyle} title={highestPageRank.course}>
          {highestPageRank.course}
        </div>
      </Card>

      {/* Highest Betweenness */}
      <Card style={cardStyle}>
        <div style={{ fontSize: '1.4rem' }}>🌉</div>
        <div>
          <div style={{ color: 'var(--muted)', fontSize: '.8rem', fontWeight: 600 }}>
            {t('graphMining.highestBetweenness')}
          </div>
          <div style={valueStyle}>{highestBetweenness.betweenness_score}</div>
        </div>
        <div style={courseStyle} title={highestBetweenness.course}>
          {highestBetweenness.course}
        </div>
      </Card>
    </div>
  )
}
