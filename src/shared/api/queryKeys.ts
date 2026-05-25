export const queryKeys = {
  user: {
    profile: () => ['user', 'profile'] as const,
  },
  courses: {
    all: () => ['courses'] as const,
    active: () => ['courses', 'active'] as const,
    byCode: (code: string) => ['courses', code] as const,
    relations: (code: string) => ['courses', code, 'relations'] as const,
  },
  system: {
    health: () => ['system', 'health'] as const,
  },
  admin: {
    analytics: () => ['admin', 'analytics'] as const,
    students: () => ['admin', 'students'] as const,
    student: (studentId: string) => ['admin', 'students', studentId] as const,
    courses: () => ['admin', 'courses'] as const,
  },
  superAdmin: {
    analytics: () => ['superAdmin', 'analytics'] as const,
    admins: () => ['superAdmin', 'admins'] as const,
  },
} as const
