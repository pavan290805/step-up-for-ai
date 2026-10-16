"use client";

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { apiRequest, getErrorMessage } from "../../_lib/api";

function VerifyEmailContent() {
  const token = useSearchParams().get("token") ?? "";
  const [error, setError] = useState("");
  const [verified, setVerified] = useState(false);

  useEffect(() => {
    if (!token) return;
    let active = true;
    const verify = async () => {
      try {
        await apiRequest("/api/v1/auth/verify-email", { method: "POST", body: JSON.stringify({ token }) });
        if (active) setVerified(true);
      } catch (requestError) {
        if (active) setError(getErrorMessage(requestError));
      }
    };
    void verify();
    return () => {
      active = false;
    };
  }, [token]);

  return (
    <div className="content-wrap">
      <section className="surface auth-card">
        <div className="auth-heading"><p className="eyebrow">Account verification</p><h1>Verify your email</h1><p>Confirm your email address to activate your Step-up for AI account.</p></div>
        {!token ? <><div className="alert alert-error" role="alert">The verification link is missing its token.</div><p className="auth-footer"><Link className="text-link" href="/auth/register">Create a new account</Link></p></> : verified ? <><div className="alert alert-success" role="status">Your email has been verified. You can now sign in.</div><p style={{ marginTop: 16 }}><Link className="button" href="/auth/login">Sign in</Link></p></> : error ? <><div className="alert alert-error" role="alert">{error}</div><p className="auth-footer"><Link className="text-link" href="/auth/register">Create a new account</Link></p></> : <div className="alert alert-info" aria-live="polite">Verifying your email…</div>}
      </section>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="content-wrap"><div className="surface empty-state">Verifying your email…</div></div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
