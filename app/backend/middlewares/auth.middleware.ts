import type { NextRequest, NextResponse } from "next/server";
import { authService } from "@/modules/auth/auth.service";
import { COOKIE_NAMES } from "@/shared/constants/cookies";
import { UnauthorizedError } from "@/shared/errors";
import type { AuthenticatedUser } from "@/modules/auth/auth.types";
import { resolveRouteContext, type RouteContext } from "@/middlewares/error-handler.middleware";

/**
 * Route handlers wrapped with `withAuth` receive the authenticated user as
 * the third argument. Next.js route handler signatures are `(req, ctx)`, so
 * we extend `ctx` with a `user` field rather than changing the handler
 * arity — this keeps handlers composable with `withRole`/`withOwnership`.
 */
export interface AuthContext {
  params?: Record<string, string>;
  user: AuthenticatedUser;
}

export type AuthenticatedRouteHandler = (
  request: NextRequest,
  context: AuthContext
) => Promise<NextResponse>;

export function withAuth(handler: AuthenticatedRouteHandler) {
  return async (request: NextRequest, context?: RouteContext) => {
    const resolvedContext = await resolveRouteContext(context);
    const sessionToken = request.cookies.get(COOKIE_NAMES.SESSION)?.value;

    if (!sessionToken) {
      throw new UnauthorizedError("Authentication required. Please log in.");
    }

    const user = await authService.getSessionUser(sessionToken);

    return handler(request, { params: resolvedContext?.params, user });
  };
}
