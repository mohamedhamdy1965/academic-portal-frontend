import { useState, useMemo } from 'react'
import { Card, CardTitle } from '@/shared/components/ui/Card'
import { Input } from '@/shared/components/ui/FormPrimitives'
import { useTranslation } from 'react-i18next'
import { TABLE_TH, TABLE_TD } from '@/shared/components/ui/Table'
import type { CourseMetric } from '../types'

interface CourseRankingTableProps {
  metrics: CourseMetric[]
}

type SortKey = 'course' | 'degree_score' | 'pagerank_score' | 'betweenness_score'
type SortDir = 'asc' | 'desc'

export function CourseRankingTable({ metrics }: CourseRankingTableProps) {
  const { t, i18n } = useTranslation()
  const isRtl = i18n.dir() === 'rtl'

  const [search, setSearch] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('pagerank_score')
  const [sortDir, setSortDir] = useState<SortDir>('desc')

  // Calculate full sorted PageRank order first to assign stable rankings (1 to N)
  const rankedMetrics = useMemo(() => {
    const sorted = [...metrics].sort((a, b) => b.pagerank_score - a.pagerank_score)
    return metrics.map((item) => {
      const rankIndex = sorted.findIndex((s) => s.course === item.course)
      return {
        ...item,
        rank: rankIndex + 1,
      }
    })
  }, [metrics])

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortDir('desc')
    }
  }

  // Filter and sort the metrics
  const processedMetrics = useMemo(() => {
    const filtered = rankedMetrics.filter((m) =>
      m.course.toLowerCase().includes(search.toLowerCase())
    )

    filtered.sort((a, b) => {
      let aVal = a[sortKey]
      let bVal = b[sortKey]

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
      } else {
        return sortDir === 'asc'
          ? (aVal as number) - (bVal as number)
          : (bVal as number) - (aVal as number)
      }
    })

    return filtered
  }, [rankedMetrics, search, sortKey, sortDir])

  const getPriorityBadge = (pr: number) => {
    let bg = 'rgba(239, 68, 68, 0.08)'
    let border = 'rgba(239, 68, 68, 0.25)'
    let color = '#fca5a5'
    let label = t('graphMining.low')

    if (pr >= 1.0) {
      bg = 'rgba(34, 197, 94, 0.08)'
      border = 'rgba(34, 197, 94, 0.25)'
      color = '#86efac'
      label = t('graphMining.high')
    } else if (pr >= 0.5) {
      bg = 'rgba(245, 158, 11, 0.08)'
      border = 'rgba(245, 158, 11, 0.25)'
      color = '#fcd34d'
      label = t('graphMining.medium')
    }

    return (
      <span
        style={{
          display: 'inline-block',
          background: bg,
          border: `1px solid ${border}`,
          borderRadius: 6,
          padding: '.15rem .45rem',
          fontSize: '.75rem',
          fontWeight: 700,
          color,
        }}
      >
        {label}
      </span>
    )
  }

  const renderSortArrow = (key: SortKey) => {
    if (sortKey !== key) return null
    return sortDir === 'desc' ? ' ▼' : ' ▲'
  }

  const thStyle = (key: SortKey) => ({
    ...TABLE_TH,
    cursor: 'pointer',
    userSelect: 'none' as const,
    textAlign: isRtl ? ('right' as const) : ('left' as const),
  })

  return (
    <Card style={{ marginBottom: '1.5rem' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1rem',
        }}
      >
        <CardTitle>{t('graphMining.title')}</CardTitle>
        <div style={{ width: '100%', maxWidth: '280px' }}>
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('graphMining.searchPlaceholder')}
          />
        </div>
      </div>

      <div className="table-container" style={{ overflowX: 'auto' }}>
        <table className="table-ui" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th onClick={() => handleSort('course')} style={thStyle('course')}>
                {t('graphMining.course')}
                {renderSortArrow('course')}
              </th>
              <th onClick={() => handleSort('degree_score')} style={thStyle('degree_score')}>
                {t('graphMining.degreeScore')}
                {renderSortArrow('degree_score')}
              </th>
              <th onClick={() => handleSort('pagerank_score')} style={thStyle('pagerank_score')}>
                {t('graphMining.pagerank')}
                {renderSortArrow('pagerank_score')}
              </th>
              <th onClick={() => handleSort('betweenness_score')} style={thStyle('betweenness_score')}>
                {t('graphMining.betweenness')}
                {renderSortArrow('betweenness_score')}
              </th>
              <th style={{ ...TABLE_TH, textAlign: isRtl ? 'right' : 'left' }}>
                {t('graphMining.ranking')}
              </th>
              <th style={{ ...TABLE_TH, textAlign: isRtl ? 'right' : 'left' }}>
                {t('graphMining.priority')}
              </th>
            </tr>
          </thead>
          <tbody>
            {processedMetrics.map((item) => {
              const isTop3 = item.rank <= 3
              const rowBg = isTop3
                ? 'rgba(59, 130, 246, 0.06)'
                : 'transparent'
              const rowBorder = isTop3
                ? '1px solid rgba(59, 130, 246, 0.15)'
                : '1px solid rgba(255, 255, 255, 0.04)'

              return (
                <tr
                  key={item.course}
                  style={{
                    background: rowBg,
                    borderBottom: rowBorder,
                    transition: 'background .2s',
                  }}
                  className="table-row-hover"
                >
                  <td style={{ ...TABLE_TD, fontWeight: isTop3 ? 700 : 500, color: isTop3 ? 'var(--text)' : 'inherit' }}>
                    {isTop3 && <span style={{ marginRight: '.4rem', fontSize: '.9rem' }}>🏆</span>}
                    {item.course}
                  </td>
                  <td style={TABLE_TD}>{item.degree_score}</td>
                  <td style={TABLE_TD}>{item.pagerank_score.toFixed(4)}</td>
                  <td style={TABLE_TD}>{item.betweenness_score.toFixed(1)}</td>
                  <td style={TABLE_TD}>
                    <span style={{ fontWeight: isTop3 ? 800 : 500 }}>
                      #{item.rank}
                    </span>
                  </td>
                  <td style={TABLE_TD}>{getPriorityBadge(item.pagerank_score)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
