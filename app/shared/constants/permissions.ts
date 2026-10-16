import { ROLES, type Role } from "./roles";

export const PERMISSIONS = {
  USERS_READ: "users:read",
  USERS_MANAGE: "users:manage",
  INTERNSHIPS_MANAGE: "internships:manage",
  EVENTS_MANAGE: "events:manage",
  COMMUNITY_MODERATE: "community:moderate",
  PAYMENTS_READ: "payments:read",
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  [ROLES.STUDENT]: [],
  [ROLES.RECRUITER]: [],
  [ROLES.MENTOR]: [],
  [ROLES.INVESTOR]: [],
  [ROLES.ADMIN]: Object.values(PERMISSIONS),
  [ROLES.SUPER_ADMIN]: Object.values(PERMISSIONS),
};
