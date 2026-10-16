"use client";

import Link from "next/link";
import { Suspense, useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { apiRequest, getErrorMessage, getPageItems, type PageResult } from "../../_lib/api";

interface RecruiterApplication {
  _id: string;
  status: string;
  createdAt: string;
  internshipId: string | { _id: string; title?: string; location?: string };
  studentId: string;
  studentProfile?: { fullName?: string; headline?: string } | null;
}

const statuses = ["applied", "shortlisted", "interview", "rejected", "hired"];

function ApplicantsWorkspace() {
  const searchParams = useSearchParams();
  const [applications, setApplications] = useState<RecruiterApplication[]>([]);
  const [filter, setFilter] = useState("");
  const internshipId = searchParams.get("internshipId") ?? "";
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams({ limit: "100" });
      if (filter) params.set("status", filter);
      if (internshipId) params.set("internshipId", internshipId);
      const result = await apiRequest<PageResult<RecruiterApplication>>(`/api/v1/recruiters/applicants?${params}`);
      setApplications(getPageItems(result));
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }, [filter, internshipId]);

  useEffect(() => { void Promise.resolve().then(load); }, [load]);

  const updateStatus = async (applicationId: string, status: string) => {
    setBusyId(applicationId);
    setError("");
    setNotice("");
    try {
      await apiRequest(`/api/v1/recruiters/applicants/${applicationId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      setNotice("Candidate status updated.");
      await load();
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setBusyId("");
    }
  };

  return (
    <div className="content-wrap">
      <header className="page-heading"><div><p className="eyebrow">Hiring workspace</p><h1 className="page-title">Applicants</h1><p className="page-description">Review applicants across your roles and update their pipeline status.</p></div><Link className="button button-secondary" href="/recruiters/interviews">Manage interviews</Link></header>
      <section className="surface surface-pad" style={{ marginBottom: 18 }}>
        <label className="field" style={{ maxWidth: 300 }}><span className="field-label">Filter by status</span><select className="field-select" value={filter} onChange={(event) => setFilter(event.target.value)}><option value="">All statuses</option>{statuses.map((status) => <option value={status} key={status}>{status}</option>)}</select></label>
      </section>
      {error && <div className="alert alert-error" role="alert" style={{ marginBottom: 14 }}>{error}</div>}
      {notice && <div className="alert alert-success" role="status" style={{ marginBottom: 14 }}>{notice}</div>}
      {loading ? <div className="surface empty-state">Loading applicants…</div> : applications.length === 0 ? (
        <div className="surface empty-state"><h2>No applicants found</h2><p>New applications for your published roles will appear here.</p><Link className="text-link" href="/recruiters/internships">Review your listings →</Link></div>
      ) : (
        <div className="list-stack">
          {applications.map((application) => {
            const internship = typeof application.internshipId === "string" ? null : application.internshipId;
            const currentStatus = statuses.includes(application.status) ? application.status : "applied";
            return (
              <article className="list-row" key={application._id}>
                <div>
                  <h2 className="list-title">{application.studentProfile?.fullName || "Candidate"}</h2>
                  <div className="list-meta"><span>{application.studentProfile?.headline || "Applicant"}</span><span>Applied {new Date(application.createdAt).toLocaleDateString()}</span><span className="badge badge-blue">{application.status}</span></div>
                  <p className="muted" style={{ margin: "10px 0 0", fontSize: 13 }}>For <strong>{internship?.title || "your opportunity"}</strong>{internship?.location ? ` · ${internship.location}` : ""}</p>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", alignItems: "end", gap: 8 }}>
                  <label className="field"><span className="field-label">Update stage</span><select className="field-select" value={currentStatus} onChange={(event) => void updateStatus(application._id, event.target.value)} disabled={busyId === application._id}>{statuses.map((status) => <option value={status} key={status}>{status}</option>)}</select></label>
                  <Link className="button button-secondary" href={`/recruiters/interviews?applicationId=${application._id}`}>Schedule interview</Link>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function RecruiterApplicantsPage() {
  return (
    <Suspense fallback={<div className="content-wrap"><div className="surface empty-state">Loading applicants…</div></div>}>
      <ApplicantsWorkspace />
    </Suspense>
  );
}
