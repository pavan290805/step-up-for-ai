import { z } from "zod";
import { mongoIdSchema } from "@/shared/types/common.schemas";

export const createApplicationSchema = z.object({
  internshipId: mongoIdSchema,
  resumeId: mongoIdSchema,
  coverNote: z.string().max(2000).optional(),
});

export type CreateApplicationDto = z.infer<typeof createApplicationSchema>;

export const applicationListQuerySchema = z.object({
  cursor: z.string().optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  status: z.string().optional(),
  internshipId: mongoIdSchema.optional(),
});

export type ApplicationListQuery = z.infer<typeof applicationListQuerySchema>;

export const updateApplicationStatusSchema = z.object({
  status: z.enum(["shortlisted", "interview", "rejected", "hired"]),
  note: z.string().max(1000).optional(),
});

export type UpdateApplicationStatusDto = z.infer<typeof updateApplicationStatusSchema>;
