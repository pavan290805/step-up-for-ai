"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { apiRequest, getErrorMessage } from "../../_lib/api";

interface StudentDashboard {
  profileCompleteness: number;
  resumeCount: number;
  savedInternshipCount: number;
  totalApplications: number;
  applicationsByStatus: Record<string, number>;
  subscriptionTier: string;
}

export default function StudentDashboardPage() {
  const [dashboard, setDashboard] = useState<StudentDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    apiRequest<StudentDashboard>("/api/v1/students/dashboard")
      .then(setDashboard)
      .catch((requestError: unknown) => setError(getErrorMessage(requestError)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="content-wrap">
      <header className="page-heading">
        <div><p className="eyebrow">Your workspace</p><h1 className="page-title">Student dashboard</h1><p className="page-description">Keep your profile and applications moving forward.</p></div>
        <Link className="button" href="/students/internships">Browse opportunities</Link>
      </header>
      {loading && <div className="surface empty-state">Loading your dashboard…</div>}
      {error && <div className="alert alert-error" role="alert">{error} <Link className="text-link" href="/students/profile">Set up your profile</Link></div>}
      {dashboard && (
        <>
          <section className="stat-grid" aria-label="Account summary">
            <article className="stat-card"><p className="stat-label">Profile completed</p><p className="stat-value">{dashboard.profileCompleteness}%</p></article>
            <article className="stat-card"><p className="stat-label">Applications</p><p className="stat-value">{dashboard.totalApplications}</p></article>
            <article className="stat-card"><p className="stat-label">Saved opportunities</p><p className="stat-value">{dashboard.savedInternshipCount}</p></article>
            <article className="stat-card"><p className="stat-label">Resumes</p><p className="stat-value">{dashboard.resumeCount}</p></article>
          </section>
          <div className="form-row" style={{ marginTop: 20 }}>
            <section className="surface surface-pad">
              <h2 style={{ marginTop: 0, fontSize: 18 }}>Application progress</h2>
              <div className="list-stack">
                {Object.entries(dashboard.applicationsByStatus).length ? Object.entries(dashboard.applicationsByStatus).map(([status, count]) => (
                  <div key={status} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span className="badge badge-blue">{status}</span><strong>{count}</strong>
                  </div>
                )) : <p className="muted">Your applications and their status will appear here.</p>}
              </div>
              <p style={{ marginBottom: 0, marginTop: 16 }}><Link className="text-link" href="/students/applications">View all applications →</Link></p>
            </section>
            <section className="surface surface-pad">
              <h2 style={{ marginTop: 0, fontSize: 18 }}>Recommended next steps</h2>
              <div className="list-stack">
                <Link className="list-row" href="/students/profile"><span><strong>Complete your profile</strong><span className="list-meta">Help hiring teams understand your experience.</span></span><span aria-hidden="true">→</span></Link>
                <Link className="list-row" href="/students/resume"><span><strong>Manage your resume</strong><span className="list-meta">Keep your latest resume ready to share.</span></span><span aria-hidden="true">→</span></Link>
                <Link className="list-row" href="/students/ai/resume-analyzer"><span><strong>Review your resume with AI</strong><span className="list-meta">Get structured feedback before you apply.</span></span><span aria-hidden="true">→</span></Link>
              </div>
              <p className="help-text" style={{ marginTop: 14 }}>Plan: {dashboard.subscriptionTier}</p>
            </section>
          </div>
        </>
      )}
    </div>
  );
}
