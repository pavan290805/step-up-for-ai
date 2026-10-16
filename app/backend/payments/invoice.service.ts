import { randomUUID } from "node:crypto";

interface ReceiptLineItem {
  description: string;
  amountInPaise: number;
}

interface ReceiptInput {
  invoiceNumber: string;
  issuedAt: Date;
  billingName: string | null;
  billingEmail: string;
  lineItems: ReceiptLineItem[];
  amountInPaise: number;
  currency: string;
}

export function generateInvoiceNumber(date = new Date()): string {
  const datePart = date.toISOString().slice(0, 10).replaceAll("-", "");
  return `INV-${datePart}-${randomUUID().slice(0, 8).toUpperCase()}`;
}

export function renderReceiptText(input: ReceiptInput): string {
  const lines = [
    "STEP-UP FOR AI",
    `Invoice: ${input.invoiceNumber}`,
    `Issued: ${input.issuedAt.toISOString()}`,
    `Billed to: ${input.billingName?.trim() || input.billingEmail}`,
    `Email: ${input.billingEmail}`,
    "",
    ...input.lineItems.map(
      (item) => `${item.description} — ${(item.amountInPaise / 100).toFixed(2)} ${input.currency}`
    ),
    "",
    `Total: ${(input.amountInPaise / 100).toFixed(2)} ${input.currency}`,
  ];
  return lines.join("\n");
}
