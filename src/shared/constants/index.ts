import type { Department, PreferredDepartment, CourseGroup } from '@/shared/types'

export const DEPT_NAMES: Record<Department, string> = {
  IS: 'نظم المعلومات',
  IT: 'تكنولوجيا المعلومات',
  AI: 'الذكاء الاصطناعي',
  CS: 'علوم الحاسب',
}

export const DEPT_COLORS: Record<Department, string> = {
  IS: 'var(--is)',
  IT: 'var(--it)',
  AI: 'var(--ai)',
  CS: 'var(--cs)',
}

export const YEAR_NAMES: Record<number, string> = {
  1: 'السنة الأولى',
  2: 'السنة الثانية',
  3: 'السنة الثالثة',
  4: 'السنة الرابعة',
}

export const PREFERRED_DEPT_OPTIONS: { value: PreferredDepartment; label: string }[] = [
  { value: 'General', label: 'عام' },
  { value: 'IS', label: 'IS — نظم المعلومات' },
  { value: 'IT', label: 'IT — تكنولوجيا المعلومات' },
  { value: 'AI', label: 'AI — الذكاء الاصطناعي' },
  { value: 'CS', label: 'CS — علوم الحاسب' },
]

export const DEPT_OPTIONS = ['IS', 'IT', 'AI', 'CS'] as const

export const ROLE_LABELS: Record<string, string> = {
  admin: 'مشرف',
  super_admin: 'مشرف عام',
  guest: 'زائر',
}

export const GROUP_NAMES: Record<CourseGroup, string> = {
  FACULTY_CORE:         'متطلبات الكلية الإجبارية',
  UNIVERSITY_MANDATORY: 'متطلبات الجامعة الإجبارية',
  FACULTY_CHOOSE_3:     'اختياري من متطلبات الكلية',
  UNIVERSITY_CHOOSE_2:  'اختياري من متطلبات الجامعة',
  AI_CORE:    'متطلبات قسم AI الإجبارية',
  AI_ELECTIVE:'اختيارية قسم AI',
  CS_CORE:    'متطلبات قسم CS الإجبارية',
  CS_ELECTIVE:'اختيارية قسم CS',
  IS_CORE:    'متطلبات قسم IS الإجبارية',
  IS_ELECTIVE:'اختيارية قسم IS',
  IT_CORE:    'متطلبات قسم IT الإجبارية',
  IT_ELECTIVE:'اختيارية قسم IT',
}

export type GradeClass = 'A' | 'B' | 'C' | 'D' | 'F'

export interface GradeLabel {
  ar: string
  cls: GradeClass
  color: string
}

export function gradeLabel(g: number): GradeLabel {
  if (g >= 90) return { ar: 'ممتاز',    cls: 'A', color: '#86efac' }
  if (g >= 75) return { ar: 'جيد جداً', cls: 'B', color: '#93c5fd' }
  if (g >= 65) return { ar: 'جيد',      cls: 'C', color: '#fcd34d' }
  if (g >= 60) return { ar: 'مقبول',    cls: 'D', color: '#fdba74' }
  return              { ar: 'راسب',     cls: 'F', color: '#fca5a5' }
}

export const GRADE_BG: Record<GradeClass, string> = {
  A: 'rgba(34,197,94,.15)',
  B: 'rgba(59,130,246,.15)',
  C: 'rgba(245,158,11,.15)',
  D: 'rgba(249,115,22,.15)',
  F: 'rgba(239,68,68,.15)',
}

export const GRADE_TABLE = [
  { range: '90 – 100', label: 'ممتاز A+',    gpa: '4.00' },
  { range: '85 – 89',  label: 'ممتاز A',     gpa: '3.75' },
  { range: '80 – 84',  label: 'جيد جداً B+', gpa: '3.40' },
  { range: '75 – 79',  label: 'جيد جداً B',  gpa: '3.10' },
  { range: '70 – 74',  label: 'جيد C+',      gpa: '2.80' },
  { range: '65 – 69',  label: 'جيد C',       gpa: '2.50' },
  { range: '60 – 64',  label: 'مقبول D+',    gpa: '2.25' },
  { range: '50 – 59',  label: 'مقبول D',     gpa: '2.00' },
  { range: '< 50',     label: 'راسب F',      gpa: '0.00' },
]

// ─── Academic progress constants ───────────────────────────────────────────────

/** Total credit hours required to graduate — Faculty of Computers & AI */
export const GRADUATION_HOURS = 136

export interface GpaStanding {
  label: string       // Arabic label shown on the transcript
  color: string       // CSS color value
  minGpa: number
}

/**
 * Returns the student's academic standing based on their GPA.
 * Matches the faculty's official GPA classification bands.
 */
export function gpaStanding(gpa: number): GpaStanding {
  if (gpa >= 3.75) return { label: 'ممتاز',         color: '#86efac', minGpa: 3.75 }
  if (gpa >= 3.10) return { label: 'جيد جداً',      color: '#93c5fd', minGpa: 3.10 }
  if (gpa >= 2.50) return { label: 'جيد',            color: '#fcd34d', minGpa: 2.50 }
  if (gpa >= 2.00) return { label: 'مقبول',          color: '#fdba74', minGpa: 2.00 }
  if (gpa >  0)    return { label: 'تحت المراقبة',   color: '#fca5a5', minGpa: 0    }
  return                   { label: 'لا يوجد معدل',  color: '#64748b', minGpa: 0    }
}
