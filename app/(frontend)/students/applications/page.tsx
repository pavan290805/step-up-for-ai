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

interface ExternalApplication {
  _id: string;
  externalJobId: string;
  title: string;
  companyName: string;
  location: string;
  applyUrl: string;
  lastOpenedAt: string;
  openCount: number;
}

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [externalApplications, setExternalApplications] = useState<ExternalApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [internalResult, externalResult] = await Promise.all([
        apiRequest<PageResult<Application>>("/api/v1/students/applications?limit=50"),
        apiRequest<ExternalApplication[]>("/api/v1/students/external-applications").catch((externalError: unknown) => {
          setError(`External application activity could not be loaded: ${getErrorMessage(externalError)}`);
          return [];
        }),
      ]);
      setApplications(getPageItems(internalResult));
      setExternalApplications(externalResult);
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
      <header className="page-heading"><div><p className="eyebrow">Job search</p><h1 className="page-title">My applications</h1><p className="page-description">Track applications submitted through Step-up for AI and activity on external employer sites.</p></div><Link className="button" href="/students/internships">Find opportunities</Link></header>
      {error && <div className="alert alert-error" role="alert" style={{ marginBottom: 14 }}>{error}</div>}
      {loading ? <div className="surface empty-state">Loading applications…</div> : (
        <>
          {applications.length === 0 && externalApplications.length === 0 ? (
            <div className="surface empty-state"><h2>No applications yet</h2><p>When you apply to an opportunity or open an external application, it will appear here.</p><Link className="button" href="/students/internships">Browse internships</Link></div>
          ) : (
            <>
              {applications.length > 0 && (
                <section aria-labelledby="platform-applications-heading" style={{ marginBottom: 28 }}>
                  <h2 id="platform-applications-heading" style={{ fontSize: 19 }}>Step-up for AI applications</h2>
                  <div className="list-stack">
                    {applications.map((application) => {
                      const internshipId = typeof application.internshipId === "string" ? application.internshipId : application.internshipId._id;
                      const title = typeof application.internshipId === "string" ? "Application" : application.internshipId.title || "Application";
                      return (
                        <article className="list-row" key={application._id}>
                          <div>
                            <h3 className="list-title">{title}</h3>
                            <div className="list-meta"><span>Applied {new Date(application.createdAt).toLocaleDateString()}</span><span className={`badge ${["shortlisted", "interview", "hired"].includes(application.status) ? "badge-green" : "badge-blue"}`}>{application.status}</span></div>
                            <p style={{ marginBottom: 0, marginTop: 10 }}><Link className="text-link" href={`/students/internships/${internshipId}`}>View opportunity</Link></p>
                          </div>
                          {["applied", "pending", "reviewed"].includes(application.status) && <button className="button button-secondary" onClick={() => void withdraw(application._id)} disabled={busyId === application._id}>{busyId === application._id ? "Withdrawing…" : "Withdraw"}</button>}
                        </article>
                      );
                    })}
                  </div>
                </section>
              )}
              {externalApplications.length > 0 && (
                <section aria-labelledby="external-applications-heading">
                  <h2 id="external-applications-heading" style={{ fontSize: 19 }}>External application activity</h2>
                  <p className="help-text">These records show that you opened an employer’s application page. Step-up for AI cannot confirm whether you submitted the external application.</p>
                  <div className="list-stack">
                    {externalApplications.map((application) => (
                      <article className="list-row" key={application._id}>
                        <div>
                          <h3 className="list-title">{application.title}</h3>
                          <div className="list-meta">
                            <span>{application.companyName}</span>
                            <span>{application.location}</span>
                            <span>Opened {new Date(application.lastOpenedAt).toLocaleDateString()}</span>
                            {application.openCount > 1 && <span>Opened {application.openCount} times</span>}
                          </div>
                          <span className="badge" style={{ marginTop: 10, display: "inline-flex" }}>External · application page opened</span>
                        </div>
                        <a className="button button-secondary" href={application.applyUrl} target="_blank" rel="noopener noreferrer">Open employer site</a>
                      </article>
                    ))}
                  </div>
                </section>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
