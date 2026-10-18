import type { NextRequest } from "next/server";
import { connectToDatabase } from "@/config/db.config";
import { withAuth, type AuthContext } from "@/middlewares/auth.middleware";
import { withErrorHandler } from "@/middlewares/error-handler.middleware";
import { withRequestLogger } from "@/middlewares/request-logger.middleware";
import { withSecurityHeaders } from "@/middlewares/security-headers.middleware";
import { withRole } from "@/middlewares/rbac.middleware";
import { jsearchService } from "@/modules/external-jobs/jsearch.service";
import { trackExternalApplicationSchema } from "@/modules/external-jobs/external-job.validators";
import { ROLES } from "@/shared/constants/roles";
import { ApiResponse } from "@/shared/response/api-response";
import { ValidationError } from "@/shared/errors";
import { parseJsonBody } from "@/shared/utils/request";

async function getHandler(_request: NextRequest, context: AuthContext) {
  await connectToDatabase();
  const applications = await jsearchService.listApplications(context.user.id);
  return ApiResponse.success(applications, "External application activity retrieved");
}

async function postHandler(request: NextRequest, context: AuthContext) {
  const body = await parseJsonBody(request);
  const parsed = trackExternalApplicationSchema.safeParse(body);
  if (!parsed.success) {
    throw new ValidationError("Invalid external application payload", parsed.error.flatten());
  }

  await connectToDatabase();
  const application = await jsearchService.trackApplication(context.user.id, parsed.data);
  return ApiResponse.created(
    application,
    "Application activity saved. Complete and submit the application on the employer's website."
  );
}

export const GET = withSecurityHeaders(
  withRequestLogger(
    withErrorHandler(withAuth((request, context) => withRole([ROLES.STUDENT], getHandler)(request, context)))
  )
);
export const POST = withSecurityHeaders(
  withRequestLogger(
    withErrorHandler(withAuth((request, context) => withRole([ROLES.STUDENT], postHandler)(request, context)))
  )
);

/**
 * @openapi
 * /students/external-applications:
 *   get:
 *     operationId: listExternalApplicationActivity
 *     summary: List the authenticated student's external job activity
 *     tags: [Students]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       '200':
 *         description: External application activity retrieved
 *       '401':
 *         description: Authentication required
 *       '403':
 *         description: Student role required
 *   post:
 *     operationId: trackExternalApplication
 *     summary: Record an external job application-page visit
 *     description: Records the job and student association when a student opens the employer application page. It does not submit or verify an employer application.
 *     tags: [Students]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       '201':
 *         description: External application activity saved
 *       '401':
 *         description: Authentication required
 *       '403':
 *         description: Student role required
 *       '422':
 *         description: Invalid external job data
 */
