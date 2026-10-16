import Razorpay from "razorpay";
import { getRazorpayConfig } from "@/config/razorpay.config";

interface CreateOrderInput {
  amountInPaise: number;
  currency: string;
  receipt: string;
  notes: Record<string, string>;
}

export const razorpayClient = {
  async createOrder(input: CreateOrderInput) {
    const config = getRazorpayConfig();
    const razorpay = new Razorpay({
      key_id: config.RAZORPAY_KEY_ID,
      key_secret: config.RAZORPAY_KEY_SECRET,
    });

    return razorpay.orders.create({
      amount: input.amountInPaise,
      currency: input.currency,
      receipt: input.receipt,
      notes: input.notes,
    });
  },

  async cancelSubscription(subscriptionId: string, atPeriodEnd: boolean) {
    const config = getRazorpayConfig();
    const razorpay = new Razorpay({
      key_id: config.RAZORPAY_KEY_ID,
      key_secret: config.RAZORPAY_KEY_SECRET,
    });

    return razorpay.subscriptions.cancel(subscriptionId, atPeriodEnd);
  },
};
