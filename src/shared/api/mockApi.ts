import { COURSES_RAW } from '@/shared/constants/curriculum'
import type {
  AddCourseResponse,
  AdminAnalytics,
  AdminCourse,
  AdminCoursePayload,
  ApiError,
  ApiHealth,
  EditCourseResponse,
  EnrolledCourse,
  LoginResponse,
  PreferredDepartment,
  RegisterPayload,
  User,
  SuperAdminAnalytics,
} from '@/shared/types'

const MOCK_USERS_KEY = 'gp_mock_users'
const MOCK_ADMIN_COURSES_KEY = 'gp_mock_admin_courses'
const TOKEN_PREFIX = 'mock-jwt'
const DEMO_PASSWORD = 'password123'

type StoredUser = User & { password: string }

const delay = <T,>(value: T, ms = 450) =>
  new Promise<T>((resolve) => window.setTimeout(() => resolve(value), ms))

const reject = (message: string, status = 400): Promise<never> => {
  const error: ApiError = { message, status }
  return delay(null, 300).then(() => Promise.reject(error))
}

function gradeToPoints(grade: number) {
  if (grade >= 90) return 4
  if (grade >= 85) return 3.75
  if (grade >= 80) return 3.4
  if (grade >= 75) return 3.1
  if (grade >= 70) return 2.8
  if (grade >= 65) return 2.5
  if (grade >= 60) return 2.25
  if (grade >= 50) return 2
  return 0
}

function recalculateAcademicStats(user: StoredUser) {
  const courses = user.enrolledCourses ?? []
  const attemptedHours = courses.reduce((sum, c) => sum + (c.creditHours ?? 0), 0)
  const qualityPoints = courses.reduce(
    (sum, c) => sum + (c.gradePoints ?? 0) * (c.creditHours ?? 0),
    0,
  )

  user.gpa = attemptedHours ? Number((qualityPoints / attemptedHours).toFixed(2)) : 0
  user.totalCreditHours = courses
    .filter((c) => c.grade >= 60)
    .reduce((sum, c) => sum + (c.creditHours ?? 0), 0)
  user.AI_plan = {
    plan: buildPlan(user),
    updatedAt: new Date().toISOString(),
  }
}

function buildPlan(user: User) {
  const passedCodes = new Set(
    (user.enrolledCourses ?? [])
      .filter((course) => course.grade >= 60)
      .map((course) => course.courseCode),
  )
  const preferred = user.preferredDepartment === 'General' ? user.department : user.preferredDepartment

  return COURSES_RAW
    .filter((course) => !passedCodes.has(course.code))
    .filter((course) => course.prereqs.every((code) => passedCodes.has(code)))
    .filter((course) => {
      if (!preferred || preferred === 'General') return course.specs.includes('GENERAL')
      return course.specs.includes(preferred) || course.specs.includes('GENERAL')
    })
    .slice(0, 6)
    .map((course) => ({
      courseCode: course.code,
      courseName: course.name,
      creditHours: course.credits,
    }))
}

function makeCourse(courseCode: string, grade: number, regulationSatisfied?: boolean): EnrolledCourse | null {
  const code = courseCode.replace(/\s+/g, '').toUpperCase()
  const course = COURSES_RAW.find((item) => item.code === code)
  if (!course) return null

  return {
    _id: crypto.randomUUID(),
    courseCode: course.code,
    courseName: course.name,
    creditHours: course.credits,
    grade,
    gradePoints: gradeToPoints(grade),
    regulationSatisfied: regulationSatisfied ?? true,
  }
}

function seedUsers(): StoredUser[] {
  const now = new Date().toISOString()
  const studentCourses = [
    makeCourse('CS111', 92),
    makeCourse('CS112', 88),
    makeCourse('CS214', 81),
    makeCourse('IS211', 76),
    makeCourse('ST121', 73),
  ].filter(Boolean) as EnrolledCourse[]

  const users: StoredUser[] = [
    {
      _id: 'mock-student-1',
      studentId: 'STU-2026-DEMO01',
      firstName: 'Demo',
      lastName: 'Student',
      username: 'demo.student',
      email: 'student@demo.com',
      password: DEMO_PASSWORD,
      role: 'student',
      status: 'active',
      academicYear: 3,
      department: 'CS',
      preferredDepartment: 'AI',
      gpa: 0,
      totalCreditHours: 0,
      enrolledCourses: studentCourses,
      AI_plan: { plan: [] },
      phoneNumber: '+201000000001',
      createdAt: now,
      updatedAt: now,
    },
    makeStudent({
      id: 'mock-student-2',
      studentId: 'STU-2026-DEMO02',
      firstName: 'Nour',
      lastName: 'Ali',
      username: 'nour.ali',
      email: 'nour@demo.com',
      department: 'AI',
      preferredDepartment: 'AI',
      academicYear: 4,
      phoneNumber: '+201000000004',
      courses: [
        ['CS111', 86],
        ['CS112', 79],
        ['CS214', 68],
        ['AI310', 91],
        ['AI330', 83],
      ],
      now,
    }),
    makeStudent({
      id: 'mock-student-3',
      studentId: 'STU-2026-DEMO03',
      firstName: 'Omar',
      lastName: 'Samir',
      username: 'omar.samir',
      email: 'omar@demo.com',
      department: 'IS',
      preferredDepartment: 'IS',
      academicYear: 2,
      phoneNumber: '+201000000005',
      courses: [
        ['CS111', 62],
        ['CS112', 58],
        ['IS211', 72],
      ],
      now,
    }),
    makeStudent({
      id: 'mock-student-4',
      studentId: 'STU-2026-DEMO04',
      firstName: 'Mariam',
      lastName: 'Hany',
      username: 'mariam.hany',
      email: 'mariam@demo.com',
      department: 'IT',
      preferredDepartment: 'CS',
      academicYear: 3,
      phoneNumber: '+201000000006',
      courses: [
        ['CS111', 95],
        ['CS112', 90],
        ['IT221', 78],
        ['IT222', 82],
      ],
      now,
    }),
    {
      _id: 'mock-admin-1',
      firstName: 'Demo',
      lastName: 'Admin',
      username: 'demo.admin',
      email: 'admin@demo.com',
      password: DEMO_PASSWORD,
      role: 'admin',
      status: 'active',
      phoneNumber: '+201000000002',
      createdAt: now,
      updatedAt: now,
    },
    {
      _id: 'mock-admin-2',
      firstName: 'Sarah',
      lastName: 'Ahmed',
      username: 'sarah.ahmed',
      email: 'sarah@demo.com',
      password: DEMO_PASSWORD,
      role: 'admin',
      status: 'inactive',
      phoneNumber: '+201000000007',
      createdAt: now,
      updatedAt: now,
    },
    {
      _id: 'mock-super-1',
      firstName: 'Demo',
      lastName: 'Super',
      username: 'demo.super',
      email: 'super@demo.com',
      password: DEMO_PASSWORD,
      role: 'super_admin',
      status: 'active',
      phoneNumber: '+201000000003',
      createdAt: now,
      updatedAt: now,
    },
  ]

  users.forEach(recalculateAcademicStats)
  return users
}

function makeStudent({
  id,
  studentId,
  firstName,
  lastName,
  username,
  email,
  department,
  preferredDepartment,
  academicYear,
  phoneNumber,
  courses,
  now,
}: {
  id: string
  studentId: string
  firstName: string
  lastName: string
  username: string
  email: string
  department: string
  preferredDepartment: PreferredDepartment
  academicYear: number
  phoneNumber: string
  courses: [string, number][]
  now: string
}): StoredUser {
  return {
    _id: id,
    studentId,
    firstName,
    lastName,
    username,
    email,
    password: DEMO_PASSWORD,
    role: 'student',
    status: 'active',
    academicYear,
    department,
    preferredDepartment,
    gpa: 0,
    totalCreditHours: 0,
    enrolledCourses: courses.map(([code, grade]) => makeCourse(code, grade)).filter(Boolean) as EnrolledCourse[],
    AI_plan: { plan: [] },
    phoneNumber,
    createdAt: now,
    updatedAt: now,
  }
}

function ensureStudentFixtures(users: StoredUser[]) {
  const seeded = seedUsers()
  const byEmail = new Set(users.map((user) => user.email))
  seeded
    .filter((user) => user.role === 'student' && !byEmail.has(user.email))
    .forEach((student) => users.push(student))
  users.forEach(recalculateAcademicStats)
  return users
}

function readUsers(): StoredUser[] {
  const raw = localStorage.getItem(MOCK_USERS_KEY)
  if (!raw) {
    const users = seedUsers()
    writeUsers(users)
    return users
  }

  try {
    const users = ensureStudentFixtures(JSON.parse(raw) as StoredUser[])
    writeUsers(users)
    return users
  } catch {
    const users = seedUsers()
    writeUsers(users)
    return users
  }
}

function seedAdminCourses(): AdminCourse[] {
  return COURSES_RAW.slice(0, 28).map((course, index) => ({
    Code: course.code,
    name: course.name,
    Credits: course.credits,
    Semester: course.sem === '2' ? 2 : 1,
    Required_level: Math.min(4, Math.max(1, Number(course.code.match(/\d/)?.[0] ?? 1))) as 1 | 2 | 3 | 4,
    Required_Hours: index < 8 ? 0 : index < 18 ? 36 : 72,
    isActive: index % 7 !== 0,
    department: course.specs.find((spec) => ['AI', 'CS', 'IT', 'IS'].includes(spec)) as PreferredDepartment | undefined,
  }))
}

function readAdminCourses(): AdminCourse[] {
  const raw = localStorage.getItem(MOCK_ADMIN_COURSES_KEY)
  if (!raw) {
    const courses = seedAdminCourses()
    writeAdminCourses(courses)
    return courses
  }

  try {
    return JSON.parse(raw) as AdminCourse[]
  } catch {
    const courses = seedAdminCourses()
    writeAdminCourses(courses)
    return courses
  }
}

function writeAdminCourses(courses: AdminCourse[]) {
  localStorage.setItem(MOCK_ADMIN_COURSES_KEY, JSON.stringify(courses))
}

function requireAdmin() {
  const user = getCurrentStoredUser()
  return user?.role === 'admin' || user?.role === 'super_admin'
}

function requireSuperAdmin() {
  const user = getCurrentStoredUser()
  return user?.role === 'super_admin'
}

function writeUsers(users: StoredUser[]) {
  localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(users))
}

function sanitizeUser(user: StoredUser): User {
  const { password: _password, ...safeUser } = user
  return safeUser
}

function createToken(userId: string) {
  return `${TOKEN_PREFIX}:${userId}:${Date.now()}`
}

function userIdFromToken() {
  const token = localStorage.getItem('gp_token') ?? ''
  const [prefix, userId] = token.split(':')
  return prefix === TOKEN_PREFIX ? userId : null
}

function getCurrentStoredUser() {
  const userId = userIdFromToken()
  if (!userId) return null
  return readUsers().find((user) => user._id === userId) ?? null
}

function updateCurrentUser(mutator: (user: StoredUser) => void) {
  const userId = userIdFromToken()
  if (!userId) return null

  const users = readUsers()
  const user = users.find((item) => item._id === userId)
  if (!user) return null

  mutator(user)
  user.updatedAt = new Date().toISOString()
  recalculateAcademicStats(user)
  writeUsers(users)
  localStorage.setItem('gp_user', JSON.stringify(sanitizeUser(user)))
  return user
}

function updateTargetUser(studentId: string | undefined, mutator: (user: StoredUser) => void) {
  const userId = userIdFromToken()
  if (!userId) return null

  const users = readUsers()
  let targetUser: StoredUser | undefined

  if (studentId && requireAdmin()) {
    targetUser = users.find((item) => item.studentId === studentId || item._id === studentId)
  } else {
    targetUser = users.find((item) => item._id === userId)
  }

  if (!targetUser) return null

  mutator(targetUser)
  targetUser.updatedAt = new Date().toISOString()
  recalculateAcademicStats(targetUser)
  writeUsers(users)

  if (targetUser._id === userId) {
    localStorage.setItem('gp_user', JSON.stringify(sanitizeUser(targetUser)))
  }
  return targetUser
}

export const mockAuthApi = {
  async login(email: string, password: string): Promise<LoginResponse> {
    const user = readUsers().find((item) => item.email.toLowerCase() === email.toLowerCase())
    if (!user || user.password !== password) {
      return reject('Invalid credentials', 400)
    }

    return delay({
      token: createToken(user._id),
      user: sanitizeUser(user),
    })
  },

  async register(payload: RegisterPayload) {
    const users = readUsers()
    const emailExists = users.some((user) => user.email.toLowerCase() === payload.email.toLowerCase())
    const usernameExists = users.some((user) => user.username === payload.username)

    if (emailExists) return reject('User already exists', 400)
    if (usernameExists) return reject('Username already exists', 400)

    const now = new Date().toISOString()
    const user: StoredUser = {
      _id: crypto.randomUUID(),
      studentId: `STU-2026-${Math.random().toString(16).slice(2, 8).toUpperCase()}`,
      firstName: payload.firstName,
      lastName: payload.lastName,
      username: payload.username,
      email: payload.email.toLowerCase(),
      password: payload.password,
      role: 'student',
      academicYear: payload.academicYear ?? 1,
      department: payload.department ?? 'General',
      preferredDepartment: payload.preferredDepartment ?? 'General',
      gpa: 0,
      totalCreditHours: 0,
      enrolledCourses: [],
      AI_plan: { plan: [] },
      phoneNumber: payload.phoneNumber,
      createdAt: now,
      updatedAt: now,
    }

    users.push(user)
    writeUsers(users)

    return delay({
      msg: 'User registered successfully',
      user: {
        _id: user._id,
        studentId: user.studentId,
        email: user.email,
      },
    })
  },

  async loginGuest(): Promise<LoginResponse> {
    const guestId = 'mock-guest-session'
    const now = new Date().toISOString()
    const users = readUsers()

    let guest = users.find((u) => u._id === guestId)
    if (!guest) {
      guest = {
        _id: guestId,
        firstName: 'زائر',
        lastName: 'المنصة',
        username: 'guest',
        email: 'guest@portal.local',
        password: '',
        role: 'guest',
        status: 'active',
        createdAt: now,
        updatedAt: now,
      }
      users.push(guest)
      writeUsers(users)
    }

    return delay({
      token: createToken(guest._id),
      user: sanitizeUser(guest),
    })
  },
}

export const mockUserApi = {
  async getProfile(): Promise<User> {
    const user = getCurrentStoredUser()
    if (!user) return reject('Not authorized', 401)
    return delay(sanitizeUser(user))
  },

  async addCourse(courseCode: string, grade: number, regulationSatisfied?: boolean, studentId?: string): Promise<AddCourseResponse> {
    const nextCourse = makeCourse(courseCode, Number(grade), regulationSatisfied)
    if (!nextCourse) return reject('Course not found', 404)

    const user = updateTargetUser(studentId, (draft) => {
      const attempts = draft.enrolledCourses?.filter((course) => course.courseCode === nextCourse.courseCode) ?? []
      if (attempts.some((course) => course.grade >= 60)) {
        throw new Error('You already passed this course')
      }
      draft.enrolledCourses = [...(draft.enrolledCourses ?? []), nextCourse]
    })

    if (!user) return reject('Not authorized', 401)
    return delay({ msg: 'Course added successfully', course: nextCourse })
  },

  async editCourse(courseId: string, grade: number, regulationSatisfied?: boolean, studentId?: string): Promise<EditCourseResponse> {
    let updatedCourse: EnrolledCourse | null = null
    const user = updateTargetUser(studentId, (draft) => {
      const course = draft.enrolledCourses?.find((item) => item._id === courseId)
      if (!course) throw new Error('Course not found')
      course.grade = Number(grade)
      course.gradePoints = gradeToPoints(Number(grade))
      if (regulationSatisfied !== undefined) {
        course.regulationSatisfied = regulationSatisfied
      }
      updatedCourse = course
    })

    if (!user) return reject('Not authorized', 401)
    if (!updatedCourse) return reject('Course not found', 404)
    return delay({ msg: 'Course updated successfully', course: updatedCourse })
  },

  async deleteCourse(courseId: string, studentId?: string) {
    const user = updateTargetUser(studentId, (draft) => {
      const before = draft.enrolledCourses?.length ?? 0
      draft.enrolledCourses = (draft.enrolledCourses ?? []).filter((course) => course._id !== courseId)
      if ((draft.enrolledCourses?.length ?? 0) === before) {
        throw new Error('Course not found')
      }
    })

    if (!user) return reject('Not authorized', 401)
    return delay({ msg: 'Course deleted successfully' })
  },

  async updatePreferredDepartment(preferredDepartment: PreferredDepartment) {
    const allowed: PreferredDepartment[] = ['AI', 'CS', 'IT', 'IS', 'General']
    if (!allowed.includes(preferredDepartment)) return reject('Invalid preferred department', 400)

    const user = updateCurrentUser((draft) => {
      if (draft.role !== 'student') throw new Error('Only students can set preferred department')
      draft.preferredDepartment = preferredDepartment
    })

    if (!user) return reject('Not authorized', 401)
    return delay({
      msg: 'Preferred department updated successfully',
      preferredDepartment: user.preferredDepartment ?? 'General',
    })
  },
}

export const mockAiApi = {
  async predict(coursework: number, midterm: number) {
    const final = Math.max(0, Math.min(50, coursework * 0.55 + midterm * 0.85 + 12))
    const total = coursework + midterm + final

    return delay({
      result: `
        <strong>Predicted final exam:</strong> ${final.toFixed(1)} / 50
        <br />
        <strong>Predicted total:</strong> ${total.toFixed(1)} / 100
        <br />
        AI Advice: Keep practicing exam-style problems and focus revision on the topics where midterm marks were lowest.
      `,
    })
  },
}

export const mockSystemApi = {
  async getHealth(): Promise<ApiHealth> {
    return delay({
      status: 'ok',
      service: 'mock-frontend-api',
      timestamp: new Date().toISOString(),
    }, 200)
  },
}

export const mockAdminApi = {
  async getAnalytics(): Promise<AdminAnalytics> {
    if (!requireAdmin()) return reject('Admin only', 403)
    const students = readUsers().filter((user) => user.role === 'student')
    const courses = readAdminCourses()
    const gpas = students.map((student) => student.gpa ?? 0).filter((gpa) => gpa > 0)

    return delay({
      totalStudents: students.length,
      activeCourses: courses.filter((course) => course.isActive).length,
      inactiveCourses: courses.filter((course) => !course.isActive).length,
      averageGpa: gpas.length ? Number((gpas.reduce((sum, gpa) => sum + gpa, 0) / gpas.length).toFixed(2)) : 0,
      atRiskStudents: students.filter((student) => (student.gpa ?? 0) > 0 && (student.gpa ?? 0) < 2).length,
    })
  },

  async getStudents(): Promise<User[]> {
    if (!requireAdmin()) return reject('Admin only', 403)
    return delay(readUsers().filter((user) => user.role === 'student').map(sanitizeUser))
  },

  async getStudent(studentId: string): Promise<User> {
    if (!requireAdmin()) return reject('Admin only', 403)
    const student = readUsers().find((user) => user.studentId === studentId || user._id === studentId)
    if (!student || student.role !== 'student') return reject('Student not found', 404)
    return delay(sanitizeUser(student))
  },

  async deleteStudent(studentId: string) {
    if (!requireAdmin()) return reject('Admin only', 403)
    const users = readUsers()
    const nextUsers = users.filter((user) => user.studentId !== studentId && user._id !== studentId)
    if (nextUsers.length === users.length) return reject('Student not found', 404)
    writeUsers(nextUsers)
    return delay({ msg: 'Student deleted successfully' })
  },

  async getCourses(): Promise<AdminCourse[]> {
    if (!requireAdmin()) return reject('Admin only', 403)
    return delay(readAdminCourses())
  },

  async createCourse(payload: AdminCoursePayload) {
    if (!requireAdmin()) return reject('Admin only', 403)
    const courses = readAdminCourses()
    const Code = payload.Code.replace(/\s+/g, '').toUpperCase()
    if (courses.some((course) => course.Code === Code)) return reject('Course already exists', 409)

    const course = { ...payload, Code }
    courses.unshift(course)
    writeAdminCourses(courses)
    return delay({ msg: 'Course added successfully', course })
  },

  async updateCourse(courseCode: string, payload: Partial<AdminCoursePayload>) {
    if (!requireAdmin()) return reject('Admin only', 403)
    const courses = readAdminCourses()
    const course = courses.find((item) => item.Code === courseCode)
    if (!course) return reject('Course not found', 404)

    Object.assign(course, payload, { Code: course.Code })
    writeAdminCourses(courses)
    return delay({ msg: 'Course updated successfully', course })
  },
}

export const mockSuperAdminApi = {
  async getAnalytics(): Promise<SuperAdminAnalytics> {
    if (!requireSuperAdmin()) return reject('Super Admin only', 403)
    const users = readUsers()
    const students = users.filter((u) => u.role === 'student')
    const admins = users.filter((u) => u.role === 'admin')
    const courses = readAdminCourses()
    const activeAccounts = users.filter((u) => u.status === 'active' || u.status === undefined).length
    return delay({
      totalStudents: students.length,
      totalAdmins: admins.length,
      totalCourses: courses.length,
      activeAccounts: activeAccounts,
    })
  },

  async getAdmins(): Promise<User[]> {
    if (!requireSuperAdmin()) return reject('Super Admin only', 403)
    return delay(readUsers().filter((u) => u.role === 'admin').map(sanitizeUser))
  },

  async createAdmin(payload: Omit<User, '_id' | 'role'> & { password?: string }): Promise<{ msg: string; admin: User }> {
    if (!requireSuperAdmin()) return reject('Super Admin only', 403)
    const users = readUsers()
    if (users.some((u) => u.email.toLowerCase() === payload.email.toLowerCase())) {
      return reject('هذا البريد الإلكتروني مسجل بالفعل لمستخدم آخر', 400)
    }
    if (users.some((u) => u.username.toLowerCase() === payload.username.toLowerCase())) {
      return reject('اسم المستخدم هذا مستخدم بالفعل', 400)
    }
    const now = new Date().toISOString()
    const admin: StoredUser = {
      _id: crypto.randomUUID(),
      firstName: payload.firstName,
      lastName: payload.lastName,
      username: payload.username.toLowerCase(),
      email: payload.email.toLowerCase(),
      password: payload.password || DEMO_PASSWORD,
      role: 'admin',
      status: payload.status || 'active',
      phoneNumber: payload.phoneNumber,
      createdAt: now,
      updatedAt: now,
    }
    users.push(admin)
    writeUsers(users)
    return delay({ msg: 'تم إنشاء حساب المشرف بنجاح', admin: sanitizeUser(admin) })
  },

  async updateAdmin(adminId: string, payload: Partial<User>): Promise<{ msg: string; admin: User }> {
    if (!requireSuperAdmin()) return reject('Super Admin only', 403)
    const users = readUsers()
    const admin = users.find((u) => u._id === adminId && u.role === 'admin')
    if (!admin) return reject('لم يتم العثور على المشرف', 404)

    if (payload.email && payload.email.toLowerCase() !== admin.email.toLowerCase()) {
      if (users.some((u) => u._id !== adminId && u.email.toLowerCase() === payload.email!.toLowerCase())) {
        return reject('هذا البريد الإلكتروني مسجل بالفعل لمستخدم آخر', 400)
      }
    }
    if (payload.username && payload.username.toLowerCase() !== admin.username.toLowerCase()) {
      if (users.some((u) => u._id !== adminId && u.username.toLowerCase() === payload.username!.toLowerCase())) {
        return reject('اسم المستخدم هذا مستخدم بالفعل', 400)
      }
    }

    Object.assign(admin, payload, { _id: admin._id, role: 'admin' })
    admin.updatedAt = new Date().toISOString()
    writeUsers(users)
    return delay({ msg: 'تم تحديث حساب المشرف بنجاح', admin: sanitizeUser(admin) })
  },

  async deleteAdmin(adminId: string): Promise<{ msg: string }> {
    if (!requireSuperAdmin()) return reject('Super Admin only', 403)
    const users = readUsers()
    const nextUsers = users.filter((u) => !(u._id === adminId && u.role === 'admin'))
    if (nextUsers.length === users.length) return reject('لم يتم العثور على المشرف', 404)
    writeUsers(nextUsers)
    return delay({ msg: 'تم حذف حساب المشرف بنجاح' })
  },
}
