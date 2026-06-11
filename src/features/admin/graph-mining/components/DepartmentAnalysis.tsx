import { useState } from 'react'
import { Card, CardTitle } from '@/shared/components/ui/Card'
import { useTranslation } from 'react-i18next'
import type { DepartmentPrerequisitesData } from '../types'

interface DepartmentAnalysisProps {
  data: DepartmentPrerequisitesData
}

export function DepartmentAnalysis({ data }: DepartmentAnalysisProps) {
  const { t, i18n } = useTranslation()
  const isRtl = i18n.dir() === 'rtl'

  const [expandedDept, setExpandedDept] = useState<string | null>('Computer Science')

  if (!data || !data.departments) return null

  const depts = Object.keys(data.departments)

  const toggleDept = (dept: string) => {
    setExpandedDept(expandedDept === dept ? null : dept)
  }

  const containerStyle = {
    marginBottom: '1.5rem',
  }

  const deptHeaderStyle = (isActive: boolean) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1.1rem 1.4rem',
    background: isActive ? 'rgba(59, 130, 246, 0.08)' : 'rgba(255, 255, 255, 0.02)',
    border: isActive ? '1px solid rgba(59, 130, 246, 0.2)' : '1px solid var(--border)',
    borderRadius: 12,
    cursor: 'pointer',
    fontFamily: 'Tajawal, sans-serif',
    fontWeight: 800,
    fontSize: '.96rem',
    color: isActive ? 'var(--accent)' : 'var(--text)',
    transition: 'all .25s ease',
    marginBottom: '.65rem',
  })

  return (
    <div style={containerStyle}>
      <div style={{ marginBottom: '1rem' }}>
        <CardTitle>
          {t('common.student') === 'طالب' ? 'تحليل متطلبات التخصصات' : 'Department Prerequisite Analysis'}
        </CardTitle>
      </div>

      {depts.map((deptName) => {
        const isActive = expandedDept === deptName
        const deptData = data.departments[deptName]

        return (
          <div key={deptName} style={{ marginBottom: '.75rem' }}>
            <div style={deptHeaderStyle(isActive)} onClick={() => toggleDept(deptName)}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '.6rem' }}>
                <span>{deptName === 'Computer Science' ? (t('common.student') === 'طالب' ? 'علوم الحاسب (CS)' : 'Computer Science') :
                       deptName === 'Information Systems' ? (t('common.student') === 'طالب' ? 'نظم المعلومات (IS)' : 'Information Systems') :
                       deptName === 'Internet Technology' ? (t('common.student') === 'طالب' ? 'تكنولوجيا المعلومات (IT)' : 'Internet Technology') :
                       deptName === 'Artificial Intelligence' ? (t('common.student') === 'طالب' ? 'الذكاء الاصطناعي (AI)' : 'Artificial Intelligence') :
                       deptName}</span>
              </div>
              <span style={{ fontSize: '.8rem', transition: 'transform .2s', transform: isActive ? 'rotate(180deg)' : undefined }}>
                ▼
              </span>
            </div>

            {isActive && (
              <div
                style={{
                  padding: '1.2rem 1.4rem',
                  background: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderTop: 'none',
                  borderRadius: '0 0 12px 12px',
                  marginTop: '-1rem',
                  marginBottom: '1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.25rem',
                  animation: 'fadeIn .25s ease',
                }}
              >
                {/* Semester 1 & 2 blocks */}
                {['semester_1', 'semester_2'].map((semKey) => {
                  const items = deptData[semKey as 'semester_1' | 'semester_2'] || []
                  if (items.length === 0) return null

                  return (
                    <div key={semKey}>
                      <h4
                        style={{
                          fontFamily: 'Tajawal, sans-serif',
                          fontSize: '.82rem',
                          color: 'var(--muted)',
                          textTransform: 'uppercase',
                          letterSpacing: '.05em',
                          borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                          paddingBottom: '.35rem',
                          marginBottom: '.75rem',
                          fontWeight: 700,
                        }}
                      >
                        {semKey === 'semester_1' ? t('graphMining.semester1') : t('graphMining.semester2')}
                      </h4>

                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                          gap: '.85rem',
                        }}
                      >
                        {items.map((item) => (
                          <div
                            key={item.code}
                            style={{
                              padding: '1rem',
                              background: 'rgba(255, 255, 255, 0.02)',
                              border: '1px solid rgba(255, 255, 255, 0.04)',
                              borderRadius: 10,
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '.5rem',
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                              <span style={{ fontSize: '.86rem', fontWeight: 700, color: 'var(--text)' }}>
                                {item.general_course}
                              </span>
                              <span style={{ fontSize: '.72rem', color: 'var(--muted2)', fontFamily: 'monospace', background: 'rgba(255, 255, 255, 0.04)', padding: '.1rem .3rem', borderRadius: 4 }}>
                                {item.code}
                              </span>
                            </div>

                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '.4rem',
                                color: 'var(--muted2)',
                                fontSize: '.74rem',
                                marginTop: '.2rem',
                              }}
                            >
                              <span>{t('graphMining.unlockedPaths')}</span>
                              <span>{isRtl ? '←' : '→'}</span>
                            </div>

                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.35rem' }}>
                              {item.unlocks.map((unl) => (
                                <span
                                  key={unl}
                                  style={{
                                    fontSize: '.74rem',
                                    padding: '.15rem .45rem',
                                    borderRadius: 6,
                                    background: 'rgba(59, 130, 246, 0.08)',
                                    border: '1px solid rgba(59, 130, 246, 0.2)',
                                    color: 'var(--accent)',
                                    fontWeight: 600,
                                  }}
                                >
                                  {unl}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
