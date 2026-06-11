import type { CourseMetric, DepartmentPrerequisitesData } from './types'

export const graphMiningApi = {
  getCourseMetrics: async (): Promise<CourseMetric[]> => {
    const data = await import('@/shared/data/course_metrics.json')
    return data.default as CourseMetric[]
  },

  getDeptPrerequisites: async (): Promise<DepartmentPrerequisitesData> => {
    const data = await import('@/shared/data/department_prerequisites.json')
    return data.default as DepartmentPrerequisitesData
  },
}
