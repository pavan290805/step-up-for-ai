import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { getRazorpayConfig } from "@/config/razorpay.config";
import { UnauthorizedError, ValidationError } from "@/shared/errors";

interface RazorpayPaymentEntity {
  id: string;
  order_id?: string;
  status: string;
}

interface RazorpaySubscriptionEntity {
  id: string;
  status: string;
  current_start?: number;
  current_end?: number;
}

export interface RazorpayWebhookEvent {
  event: string;
  payload: {
    payment?: { entity: RazorpayPaymentEntity };
    subscription?: { entity: RazorpaySubscriptionEntity };
  };
}

function isWebhookEvent(value: unknown): value is RazorpayWebhookEvent {
  if (typeof value !== "object" || value === null || !("event" in value) || !("payload" in value)) {
    return false;
  }

  const candidate = value as { event: unknown; payload: unknown };
  return typeof candidate.event === "string" && typeof candidate.payload === "object" && candidate.payload !== null;
}

export const webhookHandler = {
  verifyAndParse(rawBody: string, signatureHeader: string | null): {
    event: RazorpayWebhookEvent;
    dedupeKey: string;
  } {
    if (!signatureHeader || !/^[a-f\d]{64}$/i.test(signatureHeader)) {
      throw new UnauthorizedError("Invalid Razorpay webhook signature");
    }

    const config = getRazorpayConfig();
    const expectedSignature = createHmac("sha256", config.RAZORPAY_WEBHOOK_SECRET)
      .update(rawBody, "utf8")
      .digest();
    const providedSignature = Buffer.from(signatureHeader, "hex");
    if (
      expectedSignature.length !== providedSignature.length ||
      !timingSafeEqual(expectedSignature, providedSignature)
    ) {
      throw new UnauthorizedError("Invalid Razorpay webhook signature");
    }

    let parsed: unknown;
    try {
      parsed = JSON.parse(rawBody);
    } catch {
      throw new ValidationError("Razorpay webhook body is not valid JSON");
    }
    if (!isWebhookEvent(parsed)) {
      throw new ValidationError("Razorpay webhook body has an invalid event shape");
    }

    return {
      event: parsed,
      dedupeKey: createHash("sha256").update(rawBody, "utf8").digest("hex"),
    };
  },
};
