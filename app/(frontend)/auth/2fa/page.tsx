import Link from "next/link";

export default function TwoFactorPage() {
  return (
    <div className="content-wrap">
      <section className="surface auth-card">
        <div className="auth-heading"><p className="eyebrow">Account security</p><h1>Two-factor authentication</h1><p>Enter the code from your authenticator app during sign in.</p></div>
        <div className="alert alert-info">After you enter your email and password, the sign-in form will ask for your six-digit authenticator code.</div>
        <p style={{ marginTop: 18 }}><Link className="button" href="/auth/login">Continue to sign in</Link></p>
      </section>
    </div>
  );
}
