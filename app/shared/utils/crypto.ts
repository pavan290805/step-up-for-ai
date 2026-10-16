import { createHash, randomBytes } from "node:crypto";

export function generateSecureToken(bytes = 32): { rawToken: string; tokenHash: string } {
  const rawToken = randomBytes(bytes).toString("hex");
  return { rawToken, tokenHash: hashToken(rawToken) };
}

export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}
