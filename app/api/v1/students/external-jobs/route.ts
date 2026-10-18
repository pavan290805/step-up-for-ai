import type { NextRequest } from "next/server";
import { withErrorHandler } from "@/middlewares/error-handler.middleware";
import { withRateLimit } from "@/middlewares/rate-limit.middleware";
import { withRequestLogger } from "@/middlewares/request-logger.middleware";
import { withSecurityHeaders } from "@/middlewares/security-headers.middleware";
import { jsearchService } from "@/modules/external-jobs/jsearch.service";
import { externalJobSearchQuerySchema } from "@/modules/external-jobs/external-job.validators";
import { ValidationError } from "@/shared/errors";
import { ApiResponse } from "@/shared/response/api-response";

async function handler(request: NextRequest) {
  const parsed = externalJobSearchQuerySchema.safeParse(
    Object.fromEntries(request.nextUrl.searchParams.entries())
  );
  if (!parsed.success) {
    throw new ValidationError("Invalid external job search parameters", parsed.error.flatten());
  }

  const result = await jsearchService.search(parsed.data);
  return ApiResponse.success(result, "External jobs retrieved");
}

export const GET = withSecurityHeaders(
  withRequestLogger(
    withErrorHandler((request) =>
      withRateLimit(handler, { key: "external-jobs:search", max: 12, windowMs: 60_000 })(request)
    )
  )
);

/**
 * @openapi
 * /students/external-jobs:
 *   get:
 *     operationId: searchExternalJobs
 *     summary: Search external job listings through JSearch
 *     description: Searches JSearch on RapidAPI. Requires the server-side RAPIDAPI_KEY.
 *     tags: [Students]
 *     parameters:
 *       - in: query
 *         name: q
 *         required: true
 *         schema: { type: string, minLength: 2, maxLength: 120 }
 *       - in: query
 *         name: location
 *         schema: { type: string, maxLength: 100 }
 *       - in: query
 *         name: type
 *         schema: { type: string, enum: [internship, full-time, hybrid, remote] }
 *     responses:
 *       '200':
 *         description: External jobs retrieved
 *       '422':
 *         description: Invalid search parameters
 *       '429':
 *         description: Search rate limit exceeded
 *       '503':
 *         description: RAPIDAPI_KEY is not configured
 *       '502':
 *         description: JSearch is unavailable
 */
