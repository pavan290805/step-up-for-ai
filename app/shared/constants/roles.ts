export const ROLES = {
  STUDENT: "student",
  RECRUITER: "recruiter",
  MENTOR: "mentor",
  INVESTOR: "investor",
  ADMIN: "admin",
  SUPER_ADMIN: "super_admin",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export const ALL_ROLES = Object.values(ROLES) as Role[];
export const SELF_REGISTERABLE_ROLES = [
  ROLES.STUDENT,
  ROLES.RECRUITER,
  ROLES.INVESTOR,
  ROLES.MENTOR,
] as const;
export const ROLES_REQUIRING_2FA: Role[] = [ROLES.ADMIN, ROLES.SUPER_ADMIN];

export const USER_STATUS = {
  PENDING: "pending",
  ACTIVE: "active",
  SUSPENDED: "suspended",
  BANNED: "banned",
} as const;

export type UserStatus = (typeof USER_STATUS)[keyof typeof USER_STATUS];
