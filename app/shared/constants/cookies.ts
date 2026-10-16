export const COOKIE_NAMES = {
  SESSION: "stepup_session",
  REFRESH: "stepup_refresh",
} as const;

export const SESSION_COOKIE_MAX_AGE_SECONDS = 15 * 60;
export const REFRESH_COOKIE_MAX_AGE_SECONDS = 30 * 24 * 60 * 60;
