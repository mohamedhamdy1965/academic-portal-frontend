// ─── Auth & User ──────────────────────────────────────────────────────────────

export type UserRole = 'student' | 'admin' | 'super_admin'

export type Department = 'IS' | 'IT' | 'AI' | 'CS'
export type PreferredDepartment = Department | 'General'

export interface EnrolledCourse {
  _id: string
  courseCode: string
  courseName: string
  creditHours: number
  grade: number
  gradePoints: number
  regulationSatisfied?: boolean
}

export interface AIPlan {
  plan: AIPlanCourse[]
  createdAt?: string
  updatedAt?: string
}

export interface AIPlanCourse {
  courseCode: string
  courseName: string
  creditHours: number
}

export interface User {
  _id: string
  studentId?: string
  firstName: string
  lastName: string
  username: string
  email: string
  role: UserRole
  status?: 'active' | 'inactive'
  academicYear?: number
  department?: string
  preferredDepartment?: PreferredDepartment
  gpa?: number
  totalCreditHours?: number
  enrolledCourses?: EnrolledCourse[]
  AI_plan?: AIPlan
  phoneNumber?: string
  createdAt?: string
  updatedAt?: string
}

// ─── Auth Responses ────────────────────────────────────────────────────────────

export interface LoginResponse {
  token: string
  user: User
}

export interface RegisterPayload {
  firstName: string
  lastName: string
  username: string
  email: string
  password: string
  academicYear?: number
  department?: string
  preferredDepartment?: PreferredDepartment
  phoneNumber?: string
}

// ─── Courses ───────────────────────────────────────────────────────────────────

export interface AddCourseResponse {
  msg: string
  course: EnrolledCourse
}

export interface EditCourseResponse {
  msg: string
  course: EnrolledCourse
}

// ─── Curriculum ────────────────────────────────────────────────────────────────

export type CourseGroup =
  | 'FACULTY_CORE'
  | 'UNIVERSITY_MANDATORY'
  | 'FACULTY_CHOOSE_3'
  | 'UNIVERSITY_CHOOSE_2'
  | 'AI_CORE' | 'AI_ELECTIVE'
  | 'CS_CORE' | 'CS_ELECTIVE'
  | 'IS_CORE' | 'IS_ELECTIVE'
  | 'IT_CORE' | 'IT_ELECTIVE'

export interface CurriculumCourse {
  code: string
  name: string
  credits: number
  sem: '1' | '2' | 'x'
  prereqs: string[]
  specs: string[]
  groups: CourseGroup[]
}

export interface AdminCourse {
  Code: string
  name: string
  Credits: number
  Semester: 1 | 2
  Required_level: 1 | 2 | 3 | 4
  Required_Hours: number
  isActive: boolean
  department?: PreferredDepartment
}

export interface AdminCoursePayload {
  Code: string
  name: string
  Credits: number
  Semester: 1 | 2
  Required_level: 1 | 2 | 3 | 4
  Required_Hours: number
  isActive: boolean
  department?: PreferredDepartment
}

export interface AdminAnalytics {
  totalStudents: number
  activeCourses: number
  inactiveCourses: number
  averageGpa: number
  atRiskStudents: number
}

export interface SuperAdminAnalytics {
  totalStudents: number
  totalAdmins: number
  totalCourses: number
  activeAccounts: number
}

// ─── AI Predictor ──────────────────────────────────────────────────────────────

export interface PredictorResult {
  cw: number
  mt: number
  predF: number
  predT: number
  advice: string
}

// ─── API Errors ────────────────────────────────────────────────────────────────

export interface ApiError {
  message: string
  status?: number
}

export interface ApiHealth {
  status: 'ok'
  service: string
  timestamp: string
}
