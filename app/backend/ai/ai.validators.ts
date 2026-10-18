import { z } from "zod";
import { mongoIdSchema } from "@/shared/types/common.schemas";

export const analyzeResumeSchema = z
  .object({
    resumeId: mongoIdSchema.optional(),
    resumeText: z.string().trim().min(50).max(20_000).optional(),
    targetRole: z.string().trim().max(150).optional(),
  })
  .refine((data) => Boolean(data.resumeId) !== Boolean(data.resumeText), {
    message: "Provide either a saved resumeId or resumeText, but not both",
  });

export type AnalyzeResumeDto = z.infer<typeof analyzeResumeSchema>;

export const generateJdSchema = z.object({
  roleTitle: z.string().min(2).max(150),
  companyDescription: z.string().max(2000).optional(),
  skillsRequired: z.array(z.string().min(1)).max(30).default([]),
  location: z.string().min(1).max(150),
  type: z.enum(["internship", "full-time", "hybrid", "remote"]).default("internship"),
});

export type GenerateJdDto = z.infer<typeof generateJdSchema>;
