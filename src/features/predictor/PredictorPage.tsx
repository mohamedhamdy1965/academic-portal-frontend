import { useState, type ReactNode, useMemo } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslation } from 'react-i18next'

import { aiApi } from '@/shared/api/services'
import { gradeLabel, GRADE_BG, GRADE_TABLE } from '@/shared/constants'
import { Card, CardTitle } from '@/shared/components/ui/Card'
import { Table, HoverRow, TABLE_TD } from '@/shared/components/ui/Table'
import { Button } from '@/shared/components/ui/Button'
import { Input, Field } from '@/shared/components/ui/FormPrimitives'
import type { PredictorResult } from '@/shared/types'

// ─── Form schema helper ────────────────────────────────────────────────────────
// The schema is built inside the component to support dynamic translations of validation messages.

type PredictorForm = {
  cw: number
  mt: number
}

// ─── AI response parser ────────────────────────────────────────────────────────
// Extracted from the component so it is named, pure, and easy to update
// if the AI service response format changes.

interface ParsedPrediction {
  predF: number       // Final exam prediction (out of 50)
  predT: number       // Total prediction (out of 100)
  advice: string
  isEstimate: boolean // True when parsed from fallback math, not AI response
}

function parseAiResponse(
  rawHtml: string | undefined,
  cw: number,
  mt: number,
  fallbackAdvice: string,
  defaultAdvice: string,
): ParsedPrediction {
  if (!rawHtml) return buildFallback(cw, mt, fallbackAdvice)

  const tmp = document.createElement('div')
  tmp.innerHTML = rawHtml
  const text = tmp.textContent ?? ''

  const finalMatch = text.match(/([\d.]+)\s*\/\s*50/)
  const totalMatch = text.match(/([\d.]+)\s*\/\s*100/)

  if (!finalMatch || !totalMatch) return buildFallback(cw, mt, fallbackAdvice)

  const predF = parseFloat(finalMatch[1])
  const predT = parseFloat(totalMatch[1])

  const advice = text
    .replace(/Predicted.*?100/s, '')
    .replace(/AI Advice:?/i, '')
    .trim() || defaultAdvice

  return { predF, predT, advice, isEstimate: false }
}

function buildFallback(cw: number, mt: number, fallbackAdvice: string): ParsedPrediction {
  const predF = Math.max(0, Math.min(50, (cw + mt) / 2 * 1.05 + (mt - cw) * 0.3))
  return {
    predF,
    predT: cw + mt + predF,
    advice: fallbackAdvice,
    isEstimate: true,
  }
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function PredictorPage() {
  const { t } = useTranslation()
  const [result, setResult] = useState<(PredictorResult & { isEstimate: boolean }) | null>(null)

  const fallbackAdvice = t('predictor.fallbackAdvice')
  const defaultAdvice = t('predictor.defaultAdvice')

  const predict = useMutation({
    mutationFn: ({ cw, mt }: PredictorForm) => aiApi.predict(cw, mt),
    onSuccess: (data, variables) => {
      const parsed = parseAiResponse(data.result, variables.cw, variables.mt, fallbackAdvice, defaultAdvice)
      setResult({ ...variables, ...parsed })
    },
    onError: (_err, variables) => {
      // AI service is down — show fallback estimate instead of an error state.
      // The user still gets a useful result; the UI indicates it's an estimate.
      const fallback = buildFallback(variables.cw, variables.mt, fallbackAdvice)
      setResult({ ...variables, ...fallback })
    },
  })

  const predictorSchema = useMemo(() => z.object({
    cw: z.number({ invalid_type_error: t('predictor.validation.invalidNumber') }).min(0).max(25, t('predictor.validation.max25')),
    mt: z.number({ invalid_type_error: t('predictor.validation.invalidNumber') }).min(0).max(25, t('predictor.validation.max25')),
  }), [t])

  const { register, handleSubmit, formState: { errors } } = useForm<PredictorForm>({
    resolver: zodResolver(predictorSchema),
  })

  const onSubmit = (data: PredictorForm) => {
    setResult(null)
    predict.mutate(data)
  }

  return (
    <div
      className="animate-in predictor-grid"
      style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}
    >
      {/* ── Input panel ──────────────────────────────────────────────────── */}
      <Card>
        <CardTitle>🔮 {t('predictor.title')}</CardTitle>
        <p style={{ fontSize: '.83rem', color: 'var(--muted)', marginBottom: '1.2rem' }}>
          {t('predictor.desc')}
        </p>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <Field label={t('predictor.cwLabel')}>
            <Input
              type="number"
              placeholder="20"
              min={0}
              max={25}
              error={errors.cw?.message}
              style={{ textAlign: 'center', fontSize: '1.1rem', fontWeight: 700 }}
              {...register('cw', { valueAsNumber: true })}
            />
          </Field>

          <Field label={t('predictor.mtLabel')}>
            <Input
              type="number"
              placeholder="18"
              min={0}
              max={25}
              error={errors.mt?.message}
              style={{ textAlign: 'center', fontSize: '1.1rem', fontWeight: 700 }}
              {...register('mt', { valueAsNumber: true })}
            />
          </Field>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            fullWidth
            loading={predict.isPending}
          >
            🔮 {t('predictor.predictBtn')}
          </Button>
        </form>
      </Card>

      {/* ── Results panel ────────────────────────────────────────────────── */}
      <div>
        {result && <ResultCard result={result} />}
        <GradeTableCard />
      </div>

      <style>{`@media(max-width:768px){.predictor-grid{grid-template-columns:1fr!important;}}`}</style>
    </div>
  )
}

// ─── Result card ───────────────────────────────────────────────────────────────

function ResultCard({
  result,
}: {
  result: PredictorResult & { isEstimate: boolean }
}) {
  const { t } = useTranslation()
  const g = gradeLabel(result.predT)

  const rows: [string, ReactNode][] = [
    [t('predictor.cw'),              `${result.cw} / 25`],
    [t('predictor.mt'),                `${result.mt} / 25`],
    [t('predictor.finalExpected'), (
      <span style={{ color: 'var(--accent)', fontWeight: 800 }}>
        {result.predF.toFixed(1)} / 50
      </span>
    )],
    [t('predictor.totalExpected'), (
      <span
        style={{
          color: result.predT >= 60 ? 'var(--success)' : 'var(--danger)',
          fontWeight: 800,
          fontSize: '1.05rem',
        }}
      >
        {result.predT.toFixed(1)} / 100
      </span>
    )],
    [t('predictor.gradeExpected'), (
      <span
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          height: 26,
          borderRadius: 6,
          padding: '0 .7rem',
          fontWeight: 800,
          fontSize: '.82rem',
          background: GRADE_BG[g.cls],
          color: g.color,
        }}
      >
        {t(`grades.${g.ar}`)}
      </span>
    )],
  ]

  return (
    <div
      style={{
        background: 'linear-gradient(135deg,rgba(59,130,246,.08),rgba(6,182,212,.05))',
        border: '1px solid rgba(59,130,246,.2)',
        borderRadius: 14,
        padding: '1.5rem',
        marginBottom: '1rem',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1rem',
        }}
      >
        <div style={{ fontFamily: 'Tajawal, sans-serif', fontWeight: 700, color: 'var(--accent)' }}>
          📊 {t('predictor.resultTitle')}
        </div>
        {result.isEstimate && (
          <span
            style={{
              background: 'rgba(245,158,11,.15)',
              color: 'var(--gold)',
              borderRadius: 6,
              padding: '.15rem .55rem',
              fontSize: '.72rem',
              fontWeight: 700,
            }}
          >
            {t('predictor.approxEstimate')}
          </span>
        )}
      </div>

      {rows.map(([label, value], i) => (
        <div
          key={label}
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '.5rem 0',
            borderBottom: i < rows.length - 1 ? '1px solid rgba(30,41,59,.4)' : 'none',
            fontSize: '.88rem',
          }}
        >
          <span style={{ color: 'var(--muted2)' }}>{label}</span>
          <span style={{ fontWeight: 700 }}>{value}</span>
        </div>
      ))}

      <div
        style={{
          marginTop: '1rem',
          padding: '1rem',
          background: 'rgba(245,158,11,.07)',
          border: '1px solid rgba(245,158,11,.15)',
          borderRadius: 10,
          fontSize: '.85rem',
          lineHeight: 1.7,
          color: 'var(--muted2)',
        }}
      >
        {result.advice}
      </div>
    </div>
  )
}

// ─── Grade table card ──────────────────────────────────────────────────────────
// Uses GRADE_TABLE constant instead of hardcoded JSX rows.

function GradeTableCard() {
  const { t } = useTranslation()
  return (
    <Card>
      <CardTitle>📌 {t('predictor.gradeTableTitle')}</CardTitle>
      <Table headers={[t('predictor.ratio'), t('predictor.grade'), t('predictor.gpa')]}>
        {GRADE_TABLE.map((row) => (
          <HoverRow key={row.range}>
            <td style={TABLE_TD}>{row.range}</td>
            <td style={TABLE_TD}>{t(`gradeTable.${row.label}`)}</td>
            <td style={TABLE_TD}>{row.gpa}</td>
          </HoverRow>
        ))}
      </Table>
    </Card>
  )
}
