import { env, getEmailConfig } from "@/config/env";

function actionUrl(path: string, token: string): string {
  const url = new URL(path, env.APP_URL);
  url.searchParams.set("token", token);
  return url.toString();
}

async function sendEmail(to: string, subject: string, text: string): Promise<void> {
  const config = getEmailConfig();
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${config.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: config.EMAIL_FROM,
      to: [to],
      subject,
      text,
    }),
    signal: AbortSignal.timeout(10_000),
  });

  if (!response.ok) {
    throw new Error(`Email delivery failed with status ${response.status}.`);
  }
}

export const authEmailService = {
  sendVerificationEmail(email: string, token: string): Promise<void> {
    const url = actionUrl("/auth/verify-email", token);
    return sendEmail(
      email,
      "Verify your Step-up for AI account",
      `Verify your email address to activate your Step-up for AI account:\n\n${url}\n\nThis link expires in 24 hours.`,
    );
  },

  sendPasswordResetEmail(email: string, token: string): Promise<void> {
    const url = actionUrl("/auth/reset-password", token);
    return sendEmail(
      email,
      "Reset your Step-up for AI password",
      `Use this link to reset your Step-up for AI password:\n\n${url}\n\nThis link expires in 15 minutes. If you did not request this, you can ignore this email.`,
    );
  },
};
