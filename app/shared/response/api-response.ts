import { NextResponse } from "next/server";
import { HTTP_STATUS } from "../constants/http-status";

export interface ApiSuccessBody<T> {
  success: true;
  message: string;
  data: T;
}

export interface ApiErrorBody {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
    requestId?: string;
  };
}

export const ApiResponse = {
  success<T>(data: T, message = "Request completed successfully", status = HTTP_STATUS.OK) {
    return NextResponse.json<ApiSuccessBody<T>>({ success: true, message, data }, { status });
  },

  created<T>(data: T, message = "Resource created successfully") {
    return NextResponse.json<ApiSuccessBody<T>>(
      { success: true, message, data },
      { status: HTTP_STATUS.CREATED }
    );
  },

  error(
    code: string,
    message: string,
    status: number = HTTP_STATUS.INTERNAL_SERVER_ERROR,
    details?: unknown,
    metadata?: { requestId?: string }
  ) {
    return NextResponse.json<ApiErrorBody>(
      {
        success: false,
        error: {
          code,
          message,
          ...(details === undefined ? {} : { details }),
          ...(metadata?.requestId ? { requestId: metadata.requestId } : {}),
        },
      },
      { status }
    );
  },
};
