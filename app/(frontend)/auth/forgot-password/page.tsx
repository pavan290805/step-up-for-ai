"use client";

import Link from "next/link";
import { useState } from "react";
import { apiRequest, getErrorMessage } from "../../_lib/api";

interface ForgotPasswordResult {
  resetToken?: string | null;
}

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [resetHref, setResetHref] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const result = await apiRequest<ForgotPasswordResult>("/api/v1/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      if (result?.resetToken) setResetHref(`/auth/reset-password?token=${encodeURIComponent(result.resetToken)}`);
      setSubmitted(true);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="content-wrap">
      <section className="surface auth-card">
        <div className="auth-heading"><p className="eyebrow">Account recovery</p><h1>Reset your password</h1><p>Enter your account email and we’ll help you regain access.</p></div>
        {submitted ? (
          <>
            <div className="alert alert-info" role="status">If an account with that email exists, a password reset link has been sent.</div>
            {resetHref && <p style={{ marginTop: 16 }}><Link className="button" href={resetHref}>Continue to reset password</Link></p>}
            <p className="auth-footer"><Link className="text-link" href="/auth/login">Return to sign in</Link></p>
          </>
        ) : (
          <form className="form-grid" onSubmit={submit}>
            {error && <div className="alert alert-error" role="alert">{error}</div>}
            <label className="field"><span className="field-label">Email address</span><input className="field-input" autoComplete="email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} /></label>
            <button className="button" type="submit" disabled={loading}>{loading ? "Sending…" : "Send reset link"}</button>
            <p className="auth-footer"><Link className="text-link" href="/auth/login">Return to sign in</Link></p>
          </form>
        )}
      </section>
    </div>
  );
}
