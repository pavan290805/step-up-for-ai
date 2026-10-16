"use client";

import React, { useState } from "react";
import { useAuth } from "../../_context/AuthContext";
import Link from "next/link";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [requiresTwoFactor, setRequiresTwoFactor] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login({ email, password, ...(requiresTwoFactor ? { twoFactorCode } : {}) });
    } catch (err: unknown) {
      if (err instanceof Error && err.message === "2FA_REQUIRED") {
        setRequiresTwoFactor(true);
        setError("Enter the current code from your authenticator app to continue.");
      } else {
        setError(err instanceof Error ? err.message : "Invalid credentials");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="content-wrap">
      <section className="surface auth-card">
        <div className="auth-heading">
          <p className="eyebrow">Welcome back</p>
          <h1>Sign in to Step-up for AI</h1>
          <p>Continue your hiring or job search journey.</p>
        </div>
        <form className="form-grid" onSubmit={handleSubmit}>
          {error && <div className={requiresTwoFactor && !twoFactorCode ? "alert alert-info" : "alert alert-error"} role="alert">{error}</div>}
          <label className="field">
            <span className="field-label">Email address</span>
            <input className="field-input" autoComplete="email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} />
          </label>
          <label className="field">
            <span className="field-label">Password</span>
            <input className="field-input" autoComplete="current-password" type="password" required value={password} onChange={(event) => setPassword(event.target.value)} />
          </label>
          {requiresTwoFactor && (
            <label className="field">
              <span className="field-label">Authenticator code</span>
              <input className="field-input" inputMode="numeric" autoComplete="one-time-code" maxLength={6} required value={twoFactorCode} onChange={(event) => setTwoFactorCode(event.target.value.replace(/\D/g, "").slice(0, 6))} />
            </label>
          )}
          <div style={{ textAlign: "right" }}>
            <Link href="/auth/forgot-password" className="text-link">Forgot password?</Link>
          </div>
          <button className="button" type="submit" disabled={loading}>
            {loading ? "Signing in…" : requiresTwoFactor ? "Verify and sign in" : "Sign in"}
          </button>
        </form>
        <p className="auth-footer">
          New to Step-up for AI? <Link className="text-link" href="/auth/register">Create an account</Link>
        </p>
      </section>
    </div>
  );
}
