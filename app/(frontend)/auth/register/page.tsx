"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { apiRequest, getErrorMessage } from "../../_lib/api";

interface RegistrationResult {
  userId: string;
  verificationToken?: string;
}

interface ResendResult {
  verificationToken?: string | null;
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="content-wrap"><div className="surface empty-state">Loading registration…</div></div>}>
      <RegisterPageForm />
    </Suspense>
  );
}

function RegisterPageForm() {
  const searchParams = useSearchParams();
  const requestedRole = searchParams.get("role");
  const initialRole = (["student", "recruiter", "mentor", "investor"] as const)
    .find((roleOption) => roleOption === requestedRole) ?? "student";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState<string>(initialRole);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [resendError, setResendError] = useState("");
  const [resendToken, setResendToken] = useState("");
  const [result, setResult] = useState<RegistrationResult | null>(null);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      const response = await apiRequest<RegistrationResult>("/api/v1/auth/register", {
        method: "POST",
        body: JSON.stringify({ email, password, confirmPassword, role }),
      });
      setResult(response);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  };

  const resendVerification = async () => {
    setResending(true);
    setResendError("");
    setResendToken("");
    try {
      const response = await apiRequest<ResendResult>("/api/v1/auth/resend-verification", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      if (response.verificationToken) setResendToken(response.verificationToken);
    } catch (requestError) {
      setResendError(getErrorMessage(requestError));
    } finally {
      setResending(false);
    }
  };

  if (result) {
    const verificationToken = result.verificationToken || resendToken;
    const verifyHref = verificationToken
      ? `/auth/verify-email?token=${encodeURIComponent(verificationToken)}`
      : null;
    return (
      <div className="content-wrap">
        <section className="surface auth-card">
          <div className="auth-heading">
            <p className="eyebrow">Account created</p>
            <h1>One more step</h1>
            <p>Your account is ready. Verify your email address to sign in.</p>
          </div>
          {verifyHref ? (
            <div className="alert alert-info" role="status">
              Email delivery is not configured yet. For local development, use the verification link below.
            </div>
          ) : (
            <>
              <div className="alert alert-info" role="status">Check your inbox for a verification link.</div>
              {resendError && <div className="alert alert-error" role="alert">{resendError}</div>}
              {resendToken && <div className="alert alert-info" role="status">Email delivery is unavailable in this development environment; use the verification link below.</div>}
              <button className="button button-secondary" type="button" onClick={() => void resendVerification()} disabled={resending}>
                {resending ? "Sending…" : "Resend verification email"}
              </button>
            </>
          )}
          {verifyHref && <p style={{ margin: "16px 0" }}><Link className="button" href={verifyHref}>Verify email</Link></p>}
          <p className="auth-footer"><Link className="text-link" href="/auth/login">Continue to sign in</Link></p>
        </section>
      </div>
    );
  }

  return (
    <div className="content-wrap">
      <section className="surface auth-card">
        <div className="auth-heading">
          <p className="eyebrow">Get started</p>
          <h1>Create your account</h1>
          <p>Join Step-up for AI as a student, recruiter, mentor, or investor.</p>
        </div>
        <form className="form-grid" onSubmit={submit}>
          {error && <div className="alert alert-error" role="alert">{error}</div>}
          <label className="field">
            <span className="field-label">I am joining as</span>
            <select className="field-select" value={role} onChange={(event) => setRole(event.target.value)}>
              <option value="student">Student / job seeker</option>
              <option value="recruiter">Recruiter / hiring team</option>
              <option value="mentor">Mentor</option>
              <option value="investor">Investor</option>
            </select>
          </label>
          <label className="field">
            <span className="field-label">Email address</span>
            <input className="field-input" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} />
          </label>
          <div className="form-row">
            <label className="field">
              <span className="field-label">Password</span>
              <input className="field-input" type="password" autoComplete="new-password" minLength={8} required value={password} onChange={(event) => setPassword(event.target.value)} />
            </label>
            <label className="field">
              <span className="field-label">Confirm password</span>
              <input className="field-input" type="password" autoComplete="new-password" minLength={8} required value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} />
            </label>
          </div>
          <p className="help-text">Use at least 8 characters and a strong, unique password.</p>
          <button className="button" type="submit" disabled={loading}>{loading ? "Creating account…" : "Create account"}</button>
        </form>
        <p className="auth-footer">Already have an account? <Link className="text-link" href="/auth/login">Sign in</Link></p>
      </section>
    </div>
  );
}
