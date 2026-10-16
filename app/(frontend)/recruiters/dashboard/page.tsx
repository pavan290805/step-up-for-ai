"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiRequest, getErrorMessage } from "../../_lib/api";

interface RecruiterDashboard {
  totalInternships: number;
  publishedCount: number;
  draftCount: number;
  closedCount: number;
  totalApplications: number;
}

export default function RecruiterDashboardPage() {
  const [dashboard, setDashboard] = useState<RecruiterDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    apiRequest<RecruiterDashboard>("/api/v1/recruiters/dashboard")
      .then(setDashboard)
      .catch((requestError: unknown) => setError(getErrorMessage(requestError)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="content-wrap">
      <header className="page-heading"><div><p className="eyebrow">Hiring workspace</p><h1 className="page-title">Recruiter dashboard</h1><p className="page-description">Manage your open roles, review candidates, and keep the hiring process moving.</p></div><Link className="button" href="/recruiters/internships/new">Post a role</Link></header>
      {loading && <div className="surface empty-state">Loading your hiring dashboard…</div>}
      {error && <div className="alert alert-error" role="alert" style={{ marginBottom: 16 }}>{error} <Link className="text-link" href="/recruiters/company">Set up your company profile</Link></div>}
      {dashboard && (
        <>
          <section className="stat-grid">
            <article className="stat-card"><p className="stat-label">Total roles</p><p className="stat-value">{dashboard.totalInternships}</p></article>
            <article className="stat-card"><p className="stat-label">Published</p><p className="stat-value">{dashboard.publishedCount}</p></article>
            <article className="stat-card"><p className="stat-label">Drafts</p><p className="stat-value">{dashboard.draftCount}</p></article>
            <article className="stat-card"><p className="stat-label">Applications</p><p className="stat-value">{dashboard.totalApplications}</p></article>
          </section>
          <div className="form-row" style={{ marginTop: 20 }}>
            <section className="surface surface-pad">
              <h2 style={{ marginTop: 0, fontSize: 18 }}>Hiring overview</h2>
              <p className="muted">You have {dashboard.publishedCount} published roles and {dashboard.closedCount} closed roles.</p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 18 }}>
                <Link className="button button-secondary" href="/recruiters/internships">Manage roles</Link>
                <Link className="button button-secondary" href="/recruiters/applicants">Review applicants</Link>
              </div>
            </section>
            <section className="surface surface-pad">
              <h2 style={{ marginTop: 0, fontSize: 18 }}>Get ready to hire</h2>
              <div className="list-stack">
                <Link className="list-row" href="/recruiters/company"><span><strong>Complete company profile</strong><span className="list-meta">Present your organization to candidates.</span></span><span>→</span></Link>
                <Link className="list-row" href="/recruiters/internships/new"><span><strong>Create a role</strong><span className="list-meta">Draft and publish an opportunity.</span></span><span>→</span></Link>
                <Link className="list-row" href="/recruiters/interviews"><span><strong>Plan interviews</strong><span className="list-meta">Coordinate next steps with candidates.</span></span><span>→</span></Link>
              </div>
            </section>
          </div>
        </>
      )}
    </div>
  );
}
