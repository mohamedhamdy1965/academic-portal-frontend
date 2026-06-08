import { apiClient, aiClient, USE_MOCK_API } from './client'
import { mockAdminApi, mockAiApi, mockAuthApi, mockSystemApi, mockUserApi, mockSuperAdminApi } from './mockApi'
import type {
  AdminCoursePayload,
  AdminCourse,
  AdminAnalytics,
  LoginResponse,
  RegisterPayload,
  User,
  AddCourseResponse,
  EditCourseResponse,
  PreferredDepartment,
  ApiHealth,
  SuperAdminAnalytics,
} from '@/shared/types'

const remoteAuthApi = {
  login: (email: string, password: string) =>
    apiClient.post<LoginResponse>('/auth/login', { email, password }).then((r) => r.data),

  register: (payload: RegisterPayload) =>
    apiClient.post<{ msg: string; user: Pick<User, '_id' | 'studentId' | 'email'> }>(
      '/auth/register',
      payload,
    ).then((r) => r.data),

  loginGuest: () =>
    apiClient.post<LoginResponse>('/auth/guest').then((r) => r.data),
}

const remoteUserApi = {
  getProfile: () =>
    apiClient.get<User>('/user/profile').then((r) => r.data),

  addCourse: (courseCode: string, grade: number, regulationSatisfied?: boolean, studentId?: string) =>
    apiClient.post<AddCourseResponse>('/user/course', { courseCode, grade, regulationSatisfied, studentId }).then((r) => r.data),

  editCourse: (courseId: string, grade: number, regulationSatisfied?: boolean, studentId?: string) =>
    apiClient.put<EditCourseResponse>(`/user/course/${courseId}`, { grade, regulationSatisfied, studentId }).then((r) => r.data),

  deleteCourse: (courseId: string, studentId?: string) =>
    apiClient.delete<{ msg: string }>(`/user/course/${courseId}`, { data: { studentId } }).then((r) => r.data),

  updatePreferredDepartment: (preferredDepartment: PreferredDepartment) =>
    apiClient
      .put<{ msg: string; preferredDepartment: PreferredDepartment }>('/user/preferred-department', {
        preferredDepartment,
      })
      .then((r) => r.data),

  updateProfile: (payload: {
    fullNameAr?: string
    fullNameEn?: string
    phoneNumber?: string
    email?: string
    address?: string
    profileImage?: string
  }) =>
    apiClient.put<{ msg: string; user: User }>('/user/profile', payload).then((r) => r.data),
}

const remoteAiApi = {
  predict: (coursework: number, midterm: number) =>
    aiClient.post<{ result?: string }>('/predict', { coursework, midterm }).then((r) => r.data),
}

const remoteSystemApi = {
  getHealth: () =>
    apiClient.get<ApiHealth>('/health').then((r) => r.data),
}

const remoteAdminApi = {
  getAnalytics: () =>
    apiClient.get<AdminAnalytics>('/admin/analytics').then((r) => r.data),

  getStudents: () =>
    apiClient.get<User[]>('/admin/students').then((r) => r.data),

  getStudent: (studentId: string) =>
    apiClient.get<User>(`/admin/student/${studentId}`).then((r) => r.data),

  deleteStudent: (studentId: string) =>
    apiClient.delete<{ msg: string }>(`/admin/student/${studentId}`).then((r) => r.data),

  getCourses: () =>
    apiClient.get<AdminCourse[]>('/admin/courses').then((r) => r.data),

  createCourse: (payload: AdminCoursePayload) =>
    apiClient.post<{ msg: string; course: AdminCourse }>('/admin/course', payload).then((r) => r.data),

  updateCourse: (courseCode: string, payload: Partial<AdminCoursePayload>) =>
    apiClient
      .patch<{ msg: string; course: AdminCourse }>(`/admin/course/${courseCode}`, payload)
      .then((r) => r.data),
}

const remoteSuperAdminApi = {
  getAnalytics: () =>
    apiClient.get<SuperAdminAnalytics>('/super-admin/analytics').then((r) => r.data),

  getAdmins: () =>
    apiClient.get<User[]>('/super-admin/admins').then((r) => r.data),

  createAdmin: (payload: Omit<User, '_id' | 'role'> & { password?: string }) =>
    apiClient.post<{ msg: string; admin: User }>('/super-admin/admin', payload).then((r) => r.data),

  updateAdmin: (adminId: string, payload: Partial<User>) =>
    apiClient.patch<{ msg: string; admin: User }>(`/super-admin/admin/${adminId}`, payload).then((r) => r.data),

  deleteAdmin: (adminId: string) =>
    apiClient.delete<{ msg: string }>(`/super-admin/admin/${adminId}`).then((r) => r.data),
}

export const authApi = USE_MOCK_API ? mockAuthApi : remoteAuthApi
export const userApi = USE_MOCK_API ? mockUserApi : remoteUserApi
export const aiApi = USE_MOCK_API ? mockAiApi : remoteAiApi
export const systemApi = USE_MOCK_API ? mockSystemApi : remoteSystemApi
export const adminApi = USE_MOCK_API ? mockAdminApi : remoteAdminApi
export const superAdminApi = USE_MOCK_API ? mockSuperAdminApi : remoteSuperAdminApi
