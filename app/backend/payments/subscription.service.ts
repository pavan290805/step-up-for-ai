import type { SubscriptionStatus } from "@/database/models/subscription.model";
import { ValidationError } from "@/shared/errors";

const RAZORPAY_SUBSCRIPTION_STATUSES: Record<string, SubscriptionStatus> = {
  created: "pending",
  authenticated: "pending",
  pending: "pending",
  active: "active",
  halted: "past_due",
  cancelled: "cancelled",
  completed: "expired",
  expired: "expired",
};

export function mapRazorpaySubscriptionStatus(status: string): SubscriptionStatus {
  const mappedStatus = RAZORPAY_SUBSCRIPTION_STATUSES[status];
  if (!mappedStatus) {
    throw new ValidationError(`Unsupported Razorpay subscription status: ${status}`);
  }
  return mappedStatus;
}
