"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { apiRequest, getErrorMessage, getPageItems, type PageResult } from "../../_lib/api";

interface Application {
  _id: string;
  internshipId: string | { _id: string; title?: string };
  status: string;
  createdAt: string;
}

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const result = await apiRequest<PageResult<Application>>("/api/v1/students/applications?limit=50");
      setApplications(getPageItems(result));
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void Promise.resolve().then(load); }, [load]);

  const withdraw = async (applicationId: string) => {
    if (!window.confirm("Withdraw this application?")) return;
    setBusyId(applicationId);
    setError("");
    try {
      await apiRequest(`/api/v1/students/applications/${applicationId}`, { method: "DELETE" });
      await load();
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setBusyId("");
    }
  };

  return (
    <div className="content-wrap">
      <header className="page-heading"><div><p className="eyebrow">Job search</p><h1 className="page-title">My applications</h1><p className="page-description">Track each opportunity and the latest update from the hiring team.</p></div><Link className="button" href="/students/internships">Find opportunities</Link></header>
      {error && <div className="alert alert-error" role="alert" style={{ marginBottom: 14 }}>{error}</div>}
      {loading ? <div className="surface empty-state">Loading applications…</div> : applications.length === 0 ? (
        <div className="surface empty-state"><h2>No applications yet</h2><p>When you apply to an opportunity, it will appear here.</p><Link className="button" href="/students/internships">Browse internships</Link></div>
      ) : (
        <div className="list-stack">
          {applications.map((application) => {
            const internshipId = typeof application.internshipId === "string" ? application.internshipId : application.internshipId._id;
            const title = typeof application.internshipId === "string" ? "Application" : application.internshipId.title || "Application";
            return (
              <article className="list-row" key={application._id}>
                <div>
                  <h2 className="list-title">{title}</h2>
                  <div className="list-meta"><span>Applied {new Date(application.createdAt).toLocaleDateString()}</span><span className={`badge ${["shortlisted", "interview", "hired"].includes(application.status) ? "badge-green" : "badge-blue"}`}>{application.status}</span></div>
                  <p style={{ marginBottom: 0, marginTop: 10 }}><Link className="text-link" href={`/students/internships/${internshipId}`}>View opportunity</Link></p>
                </div>
                {["applied", "pending", "reviewed"].includes(application.status) && <button className="button button-secondary" onClick={() => void withdraw(application._id)} disabled={busyId === application._id}>{busyId === application._id ? "Withdrawing…" : "Withdraw"}</button>}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
