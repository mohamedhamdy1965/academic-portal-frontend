import { useState, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { COURSES_RAW } from '@/shared/constants/curriculum'
import { DEPT_COLORS } from '@/shared/constants'
import type { Department } from '@/shared/types'
import { Card } from '@/shared/components/ui/Card'
import { Input } from '@/shared/components/ui/FormPrimitives'

export default function GuestDashboardPage() {
  const { t } = useTranslation()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDept, setSelectedDept] = useState<string>('ALL')

  // Calculate some static numbers from curriculum
  const totalCourses = COURSES_RAW.length
  const totalCredits = COURSES_RAW.reduce((acc, c) => acc + c.credits, 0)
  const departmentsList = ['ALL', 'AI', 'CS', 'IS', 'IT', 'GENERAL']

  // Filter courses based on department and search query
  const filteredCourses = useMemo(() => {
    return COURSES_RAW.filter((c) => {
      const matchesSearch =
        c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.code.toLowerCase().includes(searchQuery.toLowerCase())

      if (selectedDept === 'ALL') return matchesSearch

      if (selectedDept === 'GENERAL') {
        return matchesSearch && c.specs.includes('GENERAL')
      }

      return matchesSearch && c.specs.includes(selectedDept as Department)
    })
  }, [searchQuery, selectedDept])

  const getDeptLabel = (d: string) => {
    if (d === 'ALL') return t('common.all')
    if (d === 'GENERAL') return t('common.general')

    const mapping: Record<string, string> = {
      IS: t('common.general') === 'عام' ? 'نظم المعلومات' : 'Information Systems',
      IT: t('common.general') === 'عام' ? 'تكنولوجيا المعلومات' : 'Information Technology',
      AI: t('common.general') === 'عام' ? 'الذكاء الاصطناعي' : 'Artificial Intelligence',
      CS: t('common.general') === 'عام' ? 'علوم الحاسب' : 'Computer Science',
    }
    return mapping[d] || d
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Welcome & Overview Card */}
      <section
        style={{
          background: 'linear-gradient(135deg, rgba(59,130,246,.15), rgba(6,182,212,.08))',
          border: '1px solid rgba(59,130,246,.25)',
          borderRadius: 18,
          padding: '1.6rem 1.8rem',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <span
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: '1.5rem',
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: '6.5rem',
            opacity: 0.05,
            lineHeight: 1,
          }}
        >
          🌐
        </span>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2
            style={{
              fontFamily: 'Tajawal, sans-serif',
              fontSize: '1.45rem',
              fontWeight: 900,
              margin: 0,
              marginBottom: '.5rem',
              color: 'var(--text)',
            }}
          >
            {t('guest.welcomeTitle')}
          </h2>
          <p style={{ color: 'var(--muted2)', fontSize: '.9rem', lineHeight: 1.6, margin: 0, maxWidth: '750px' }}>
            {t('guest.welcomeDesc')}
          </p>
        </div>
      </section>

      {/* Platform Statistics */}
      <section
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem',
        }}
      >
        <div
          style={{
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 14,
            padding: '1.1rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <span style={{ fontSize: '2rem', padding: '.4rem', background: 'rgba(59,130,246,.08)', borderRadius: 10 }}>🏫</span>
          <div>
            <div style={{ fontSize: '.76rem', color: 'var(--muted2)', fontWeight: 600 }}>{t('guest.statsDepts')}</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text)' }}>{t('guest.statsDeptsVal')}</div>
          </div>
        </div>

        <div
          style={{
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 14,
            padding: '1.1rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <span style={{ fontSize: '2rem', padding: '.4rem', background: 'rgba(16,185,129,.08)', borderRadius: 10 }}>📚</span>
          <div>
            <div style={{ fontSize: '.76rem', color: 'var(--muted2)', fontWeight: 600 }}>{t('guest.statsCourses')}</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text)' }}>
              {t('guest.statsCoursesVal', { count: totalCourses })}
            </div>
          </div>
        </div>

        <div
          style={{
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 14,
            padding: '1.1rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <span style={{ fontSize: '2rem', padding: '.4rem', background: 'rgba(245,158,11,.08)', borderRadius: 10 }}>⏱️</span>
          <div>
            <div style={{ fontSize: '.76rem', color: 'var(--muted2)', fontWeight: 600 }}>{t('guest.statsCredits')}</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text)' }}>
              {t('guest.statsCreditsVal', { count: totalCredits })}
            </div>
          </div>
        </div>

        <div
          style={{
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 14,
            padding: '1.1rem 1.25rem',
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
          }}
        >
          <span style={{ fontSize: '2rem', padding: '.4rem', background: 'rgba(139,92,246,.08)', borderRadius: 10 }}>🛡️</span>
          <div>
            <div style={{ fontSize: '.76rem', color: 'var(--muted2)', fontWeight: 600 }}>{t('guest.statsValidation')}</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text)' }}>{t('guest.statsValidationVal')}</div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '.75rem' }}>
        <h3 style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>
          {t('guest.featuresTitle')}
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
          <Card style={{ padding: '1.2rem', background: 'rgba(30,41,59,.2)' }}>
            <div style={{ display: 'flex', gap: '.75rem', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '1.35rem' }}>🤖</span>
              <div>
                <h4 style={{ margin: 0, fontSize: '.9rem', fontWeight: 800, marginBottom: '.35rem' }}>{t('guest.featuresAdvisorTitle')}</h4>
                <p style={{ margin: 0, fontSize: '.78rem', color: 'var(--muted)', lineHeight: 1.5 }}>
                  {t('guest.featuresAdvisorDesc')}
                </p>
              </div>
            </div>
          </Card>

          <Card style={{ padding: '1.2rem', background: 'rgba(30,41,59,.2)' }}>
            <div style={{ display: 'flex', gap: '.75rem', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '1.35rem' }}>⚠️</span>
              <div>
                <h4 style={{ margin: 0, fontSize: '.9rem', fontWeight: 800, marginBottom: '.35rem' }}>{t('guest.featuresConflictTitle')}</h4>
                <p style={{ margin: 0, fontSize: '.78rem', color: 'var(--muted)', lineHeight: 1.5 }}>
                  {t('guest.featuresConflictDesc')}
                </p>
              </div>
            </div>
          </Card>

          <Card style={{ padding: '1.2rem', background: 'rgba(30,41,59,.2)' }}>
            <div style={{ display: 'flex', gap: '.75rem', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '1.35rem' }}>🔮</span>
              <div>
                <h4 style={{ margin: 0, fontSize: '.9rem', fontWeight: 800, marginBottom: '.35rem' }}>{t('guest.featuresPredictorTitle')}</h4>
                <p style={{ margin: 0, fontSize: '.78rem', color: 'var(--muted)', lineHeight: 1.5 }}>
                  {t('guest.featuresPredictorDesc')}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Curriculum Browser (Read-only) */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '.85rem', marginTop: '.5rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
          <div>
            <h3 style={{ fontFamily: 'Tajawal, sans-serif', fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>
              {t('guest.browserTitle')}
            </h3>
            <p style={{ color: 'var(--muted2)', fontSize: '.78rem', margin: 0, marginTop: '.2rem' }}>
              {t('guest.browserDesc')}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '.5rem', minWidth: '280px', maxWidth: '400px', width: '100%' }}>
            <Input
              type="text"
              placeholder={t('guest.searchCurriculum')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ fontSize: '.8rem' }}
            />
          </div>
        </div>

        {/* Department Filters */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.35rem', margin: '.2rem 0' }}>
          {departmentsList.map((dept) => {
            const isActive = selectedDept === dept
            return (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept)}
                style={{
                  padding: '.35rem .8rem',
                  borderRadius: 8,
                  fontSize: '.76rem',
                  fontWeight: isActive ? 800 : 600,
                  border: '1px solid var(--border)',
                  background: isActive ? 'var(--accent)' : 'var(--card)',
                  color: isActive ? '#fff' : 'var(--text)',
                  cursor: 'pointer',
                  transition: 'all .2s',
                }}
              >
                {getDeptLabel(dept)}
              </button>
            )
          })}
        </div>

        {/* Courses Table / Cards Grid */}
        <div
          style={{
            background: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: 14,
            overflow: 'hidden',
          }}
        >
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'right' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)', background: 'rgba(255,255,255,.01)' }}>
                  <th style={{ padding: '.9rem 1.1rem', fontSize: '.78rem', color: 'var(--muted)', fontWeight: 700 }}>{t('dashboard.code')}</th>
                  <th style={{ padding: '.9rem 1.1rem', fontSize: '.78rem', color: 'var(--muted)', fontWeight: 700 }}>{t('dashboard.name')}</th>
                  <th style={{ padding: '.9rem 1.1rem', fontSize: '.78rem', color: 'var(--muted)', fontWeight: 700 }}>{t('dashboard.credits')}</th>
                  <th style={{ padding: '.9rem 1.1rem', fontSize: '.78rem', color: 'var(--muted)', fontWeight: 700 }}>{t('guest.statsDepts')}</th>
                  <th style={{ padding: '.9rem 1.1rem', fontSize: '.78rem', color: 'var(--muted)', fontWeight: 700 }}>{t('guest.prereqs')}</th>
                </tr>
              </thead>
              <tbody>
                {filteredCourses.length > 0 ? (
                  filteredCourses.map((c) => (
                    <tr
                      key={c.code}
                      style={{
                        borderBottom: '1px solid var(--border)',
                        transition: 'background .2s',
                      }}
                      onMouseEnter={(e: React.MouseEvent<HTMLTableRowElement>) => (e.currentTarget.style.background = 'rgba(255,255,255,.01)')}
                      onMouseLeave={(e: React.MouseEvent<HTMLTableRowElement>) => (e.currentTarget.style.background = 'transparent')}
                    >
                      <td style={{ padding: '.85rem 1.1rem', fontSize: '.82rem', fontWeight: 800, color: 'var(--accent2)' }}>
                        {c.code}
                      </td>
                      <td style={{ padding: '.85rem 1.1rem', fontSize: '.82rem', fontWeight: 700, color: 'var(--text)' }}>
                        {c.name}
                      </td>
                      <td style={{ padding: '.85rem 1.1rem', fontSize: '.82rem', color: 'var(--muted2)' }}>
                        {c.credits} {t('dashboard.credits') === 'الساعات' ? 'ساعة' : 'Credits'}
                      </td>
                      <td style={{ padding: '.85rem 1.1rem', fontSize: '.82rem' }}>
                        <div style={{ display: 'flex', gap: '.25rem', flexWrap: 'wrap' }}>
                          {c.specs.map((sp) => {
                            const col = DEPT_COLORS[sp as Department] || 'var(--muted2)'
                            return (
                              <span
                                key={sp}
                                style={{
                                  fontSize: '.68rem',
                                  padding: '.15rem .4rem',
                                  borderRadius: 5,
                                  background: `${col}10`,
                                  border: `1px solid ${col}25`,
                                  color: col,
                                  fontWeight: 800,
                                }}
                              >
                                {sp}
                              </span>
                            )
                          })}
                        </div>
                      </td>
                      <td style={{ padding: '.85rem 1.1rem', fontSize: '.82rem', color: 'var(--muted2)' }}>
                        {c.prereqs.length > 0 ? (
                          <div style={{ display: 'flex', gap: '.3rem' }}>
                            {c.prereqs.map((pr) => (
                              <span key={pr} style={{ background: 'rgba(255,255,255,.04)', padding: '.15rem .35rem', borderRadius: 4, fontSize: '.72rem', border: '1px solid var(--border)' }}>
                                {pr}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span style={{ color: 'var(--muted)' }}>{t('guest.noPrereqs')}</span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} style={{ padding: '2.5rem', textAlign: 'center', color: 'var(--muted)' }}>
                      لا توجد مقررات تطابق البحث والتصفية المحددة.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  )
}
