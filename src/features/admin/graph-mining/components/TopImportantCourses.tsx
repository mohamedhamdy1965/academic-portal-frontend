import { Card } from '@/shared/components/ui/Card'
import { useTranslation } from 'react-i18next'
import type { CourseMetric } from '../types'

interface TopImportantCoursesProps {
  metrics: CourseMetric[]
}

export function TopImportantCourses({ metrics }: TopImportantCoursesProps) {
  const { t } = useTranslation()

  if (!metrics || metrics.length === 0) return null

  // Find maximums
  const maxDegree = metrics.reduce((max, c) => c.degree_score > max.degree_score ? c : max, metrics[0])
  const maxPageRank = metrics.reduce((max, c) => c.pagerank_score > max.pagerank_score ? c : max, metrics[0])
  const maxBetweenness = metrics.reduce((max, c) => c.betweenness_score > max.betweenness_score ? c : max, metrics[0])

  const cardStyle = {
    display: 'flex',
    flexDirection: 'column' as const,
    padding: '1.5rem',
    background: 'rgba(30, 41, 59, 0.2)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    borderRadius: 14,
    minHeight: '210px',
    justifyContent: 'space-between',
  }

  const badgeStyle = (color: string) => ({
    display: 'inline-flex',
    alignItems: 'center',
    background: `${color}15`,
    border: `1px solid ${color}33`,
    borderRadius: 8,
    padding: '.25rem .6rem',
    fontSize: '.75rem',
    fontWeight: 700,
    color: color,
    width: 'fit-content',
    marginBottom: '1rem',
  })

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.25rem',
        marginBottom: '1.5rem',
      }}
    >
      {/* Highest Degree Card */}
      <Card style={cardStyle} className="stat-card-hover">
        <div>
          <div style={badgeStyle('var(--accent)')}>
            🕸️ {t('graphMining.degreeTitle')}
          </div>
          <h3
            style={{
              fontFamily: 'Tajawal, sans-serif',
              fontSize: '1.1rem',
              fontWeight: 800,
              margin: '0 0 .5rem 0',
              color: 'var(--text)',
            }}
          >
            {maxDegree.course}
          </h3>
          <p style={{ fontSize: '.84rem', color: 'var(--muted2)', lineHeight: 1.6, margin: 0 }}>
            {t('graphMining.highestDegreeExplain')}
          </p>
        </div>
        <div
          style={{
            fontSize: '1.4rem',
            fontWeight: 800,
            color: 'var(--accent)',
            textAlign: 'right',
            marginTop: '1rem',
          }}
        >
          {maxDegree.degree_score} {t('graphMining.degreeScore').toLowerCase()}
        </div>
      </Card>

      {/* Highest PageRank Card */}
      <Card style={cardStyle} className="stat-card-hover">
        <div>
          <div style={badgeStyle('var(--accent2)')}>
            🔮 {t('graphMining.pagerankTitle')}
          </div>
          <h3
            style={{
              fontFamily: 'Tajawal, sans-serif',
              fontSize: '1.1rem',
              fontWeight: 800,
              margin: '0 0 .5rem 0',
              color: 'var(--text)',
            }}
          >
            {maxPageRank.course}
          </h3>
          <p style={{ fontSize: '.84rem', color: 'var(--muted2)', lineHeight: 1.6, margin: 0 }}>
            {t('graphMining.highestPageRankExplain')}
          </p>
        </div>
        <div
          style={{
            fontSize: '1.4rem',
            fontWeight: 800,
            color: 'var(--accent2)',
            textAlign: 'right',
            marginTop: '1rem',
          }}
        >
          {maxPageRank.pagerank_score.toFixed(4)} {t('graphMining.pagerank').toLowerCase()}
        </div>
      </Card>

      {/* Highest Betweenness Card */}
      <Card style={cardStyle} className="stat-card-hover">
        <div>
          <div style={badgeStyle('var(--gold)')}>
            🌉 {t('graphMining.betweennessTitle')}
          </div>
          <h3
            style={{
              fontFamily: 'Tajawal, sans-serif',
              fontSize: '1.1rem',
              fontWeight: 800,
              margin: '0 0 .5rem 0',
              color: 'var(--text)',
            }}
          >
            {maxBetweenness.course}
          </h3>
          <p style={{ fontSize: '.84rem', color: 'var(--muted2)', lineHeight: 1.6, margin: 0 }}>
            {t('graphMining.highestBetweennessExplain')}
          </p>
        </div>
        <div
          style={{
            fontSize: '1.4rem',
            fontWeight: 800,
            color: 'var(--gold)',
            textAlign: 'right',
            marginTop: '1rem',
          }}
        >
          {maxBetweenness.betweenness_score} {t('graphMining.betweenness').toLowerCase()}
        </div>
      </Card>
    </div>
  )
}
