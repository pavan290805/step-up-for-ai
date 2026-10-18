import { z } from "zod";

const httpsUrlSchema = z.string().url().refine((value) => new URL(value).protocol === "https:", {
  message: "Job links must use HTTPS",
});

export const externalJobSearchQuerySchema = z.object({
  q: z.string().trim().min(2).max(120),
  location: z.string().trim().max(100).optional(),
  type: z.enum(["internship", "full-time", "hybrid", "remote"]).optional(),
});

export const trackExternalApplicationSchema = z.object({
  provider: z.literal("jsearch"),
  externalJobId: z.string().trim().min(1).max(300),
  title: z.string().trim().min(1).max(300),
  companyName: z.string().trim().min(1).max(300),
  location: z.string().trim().max(300),
  employmentType: z.string().trim().max(100).nullable().optional(),
  applyUrl: httpsUrlSchema,
  sourceUrl: httpsUrlSchema.nullable().optional(),
  employerLogoUrl: httpsUrlSchema.nullable().optional(),
  postedAt: z.string().trim().max(100).nullable().optional(),
});

export type ExternalJobSearchQuery = z.infer<typeof externalJobSearchQuerySchema>;
export type TrackExternalApplicationDto = z.infer<typeof trackExternalApplicationSchema>;
