import { useTranslation } from 'react-i18next'
import { useCourseMetrics, useDeptPrerequisites } from './hooks/useGraphData'
import { OverviewCards } from './components/OverviewCards'
import { CourseRankingTable } from './components/CourseRankingTable'
import { TopImportantCourses } from './components/TopImportantCourses'
import { DepartmentAnalysis } from './components/DepartmentAnalysis'
import { GraphInsights } from './components/GraphInsights'
import { InteractiveGraph } from './components/InteractiveGraph'
import { PageLoader } from '@/shared/components/ui/Spinner'

export default function GraphMiningPage() {
  const { t } = useTranslation()

  // Fetch queries
  const { data: metrics, isLoading: isMetricsLoading } = useCourseMetrics()
  const { data: deptData, isLoading: isDeptLoading } = useDeptPrerequisites()

  if (isMetricsLoading || isDeptLoading) {
    return <PageLoader message={t('common.loading')} />
  }

  return (
    <div className="animate-in" style={{ paddingBottom: '2.5rem' }}>
      {/* Page Title */}
      <h1
        style={{
          fontFamily: 'Tajawal, sans-serif',
          fontSize: '1.5rem',
          fontWeight: 900,
          marginBottom: '1.25rem',
          color: 'var(--text)',
        }}
      >
        {t('graphMining.title')}
      </h1>

      {/* Section 1: KPI Overview Cards */}
      {metrics && <OverviewCards metrics={metrics} />}

      {/* Grid containing Outlier details & Insights */}
      <div
        className="graph-mining-top-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.2fr) minmax(300px, 0.8fr)',
          gap: '1.25rem',
          alignItems: 'start',
          marginBottom: '1.5rem',
        }}
      >
        {/* Section 3: Feature Outlier Cards */}
        {metrics && <TopImportantCourses metrics={metrics} />}

        {/* Section 5: Graph Insights Panel */}
        <GraphInsights />
      </div>

      {/* Section 6: Interactive Network Map */}
      <InteractiveGraph />

      {/* Section 4: Department Prerequisite Mapping Flow */}
      {deptData && <DepartmentAnalysis data={deptData} />}

      {/* Section 2: Course Ranking Table */}
      {metrics && <CourseRankingTable metrics={metrics} />}

      {/* Responsive media overrides style */}
      <style>{`
        @media (max-width: 990px) {
          .graph-mining-top-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}
