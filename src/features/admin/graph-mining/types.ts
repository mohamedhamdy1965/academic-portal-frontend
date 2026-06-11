export interface CourseMetric {
  course: string
  degree_score: number
  pagerank_score: number
  betweenness_score: number
}

export interface DepartmentPrerequisiteItem {
  general_course: string
  code: string
  unlocks: string[]
}

export interface DepartmentPrerequisitesSemester {
  semester_1: DepartmentPrerequisiteItem[]
  semester_2: DepartmentPrerequisiteItem[]
}

export interface DepartmentPrerequisitesData {
  description: string
  departments: Record<string, DepartmentPrerequisitesSemester>
}
