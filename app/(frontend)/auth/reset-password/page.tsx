"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { apiRequest, getErrorMessage } from "../../_lib/api";

function ResetPasswordForm() {
  const token = useSearchParams().get("token") ?? "";
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");
    setNotice("");
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      await apiRequest("/api/v1/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ token, password, confirmPassword }),
      });
      setNotice("Your password has been updated. You can sign in with your new password.");
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="content-wrap">
      <section className="surface auth-card">
        <div className="auth-heading"><p className="eyebrow">Account recovery</p><h1>Choose a new password</h1><p>Use a new, unique password for your account.</p></div>
        {error && <div className="alert alert-error" role="alert" style={{ marginBottom: 14 }}>{error}</div>}
        {notice ? <><div className="alert alert-success" role="status">{notice}</div><p className="auth-footer"><Link className="text-link" href="/auth/login">Go to sign in</Link></p></> : (
          <form className="form-grid" onSubmit={submit}>
            {!token && <div className="alert alert-error" role="alert">The reset link is missing its token. Request a new link to continue.</div>}
            <label className="field"><span className="field-label">New password</span><input className="field-input" type="password" autoComplete="new-password" minLength={8} maxLength={128} required value={password} onChange={(event) => setPassword(event.target.value)} /></label>
            <label className="field"><span className="field-label">Confirm new password</span><input className="field-input" type="password" autoComplete="new-password" minLength={8} maxLength={128} required value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} /></label>
            <button className="button" type="submit" disabled={loading || !token}>{loading ? "Updating…" : "Update password"}</button>
          </form>
        )}
      </section>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="content-wrap"><div className="surface empty-state">Loading password reset…</div></div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}
