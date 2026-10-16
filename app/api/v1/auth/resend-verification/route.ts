import type { NextRequest } from "next/server";
import { authController } from "@/modules/auth/auth.controller";
import { withErrorHandler } from "@/middlewares/error-handler.middleware";
import { withRequestLogger } from "@/middlewares/request-logger.middleware";
import { withSecurityHeaders } from "@/middlewares/security-headers.middleware";

async function postHandler(request: NextRequest) {
  return authController.resendVerificationEmail(request);
}

export const POST = withSecurityHeaders(withRequestLogger(withErrorHandler(postHandler)));
