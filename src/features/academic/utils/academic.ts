export const ACADEMIC_CONFLICT_MIN = 50
export const ACADEMIC_CONFLICT_MAX = 68

export type AcademicConflictInput = {
  grade: number
  regulationSatisfied?: boolean
}

/**
 * Checks if a course grade and regulation status represents an academic conflict.
 * NOTE: This is a temporary frontend academic regulation rule.
 * Backend validation should eventually become the source of truth.
 */
export function isAcademicConflict(input: AcademicConflictInput): boolean {
  const { grade, regulationSatisfied } = input
  return grade >= ACADEMIC_CONFLICT_MIN && grade <= ACADEMIC_CONFLICT_MAX && !regulationSatisfied
}
