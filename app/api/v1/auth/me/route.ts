import type { NextRequest } from "next/server";
import { ApiResponse } from "@/shared/response/api-response";
import { withAuth, type AuthContext } from "@/middlewares/auth.middleware";
import { withErrorHandler } from "@/middlewares/error-handler.middleware";

const handler = async (_request: NextRequest, { user }: AuthContext) => {
  return ApiResponse.success({ user }, "User profile retrieved successfully");
};

export const GET = withErrorHandler(withAuth(handler));
