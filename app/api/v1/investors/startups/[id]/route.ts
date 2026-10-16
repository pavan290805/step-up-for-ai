import type { NextRequest } from "next/server";
import { connectToDatabase } from "@/config/db.config";
import { investorController } from "@/modules/investors/investor.controller";
import { withErrorHandler } from "@/middlewares/error-handler.middleware";
import { withRequestLogger } from "@/middlewares/request-logger.middleware";
import { withSecurityHeaders } from "@/middlewares/security-headers.middleware";
import { resolveRouteContext, type RouteContext } from "@/middlewares/error-handler.middleware";

async function getHandler(request: NextRequest, context?: RouteContext) {
  await connectToDatabase();
  const resolvedContext = await resolveRouteContext(context);
  return investorController.getStartup(request, { params: resolvedContext?.params });
}

export const GET = withSecurityHeaders(withRequestLogger(withErrorHandler(getHandler)));
