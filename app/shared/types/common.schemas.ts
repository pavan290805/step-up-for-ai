import { z } from "zod";

export const mongoIdSchema = z.string().regex(/^[a-f\d]{24}$/i, "Invalid MongoDB id");
export const emailSchema = z.string().trim().email().transform((email) => email.toLowerCase());
export const otpCodeSchema = z.string().regex(/^\d{6}$/, "Code must contain 6 digits");
export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(128, "Password must be no more than 128 characters");
