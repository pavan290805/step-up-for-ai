import type { NextRequest } from "next/server";
import { ValidationError } from "../errors";

export async function parseJsonBody(request: NextRequest): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    throw new ValidationError("Request body must contain valid JSON");
  }
}
