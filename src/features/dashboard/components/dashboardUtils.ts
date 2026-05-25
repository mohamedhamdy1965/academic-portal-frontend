import type { EnrolledCourse, User } from '@/shared/types'
import { GRADUATION_HOURS, gpaStanding } from '@/shared/constants'

export function getStudentStats(user?: User | null) {
  const courses = user?.enrolledCourses ?? []
  const passed = courses.filter((course) => course.grade >= 60)
  const failed = courses.filter((course) => course.grade < 60)
  const gpa = user?.gpa ?? 0
  const hours = user?.totalCreditHours ?? 0
  const progress = Math.min(100, Math.round((hours / GRADUATION_HOURS) * 100))
  const remaining = Math.max(0, GRADUATION_HOURS - hours)

  return {
    courses,
    passed,
    failed,
    gpa,
    hours,
    progress,
    remaining,
    standing: gpaStanding(gpa),
  }
}

export function latestCourses(courses: EnrolledCourse[], count = 5) {
  return [...courses].reverse().slice(0, count)
}
