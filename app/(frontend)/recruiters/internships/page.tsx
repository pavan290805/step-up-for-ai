"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { apiRequest, getErrorMessage, getPageItems, type PageResult } from "../../_lib/api";

interface Internship {
  _id: string;
  title: string;
  location: string;
  type: string;
  status: "draft" | "published" | "closed" | "expired";
  applicationCount: number;
  viewCount: number;
  createdAt: string;
}

export default function RecruiterInternshipsPage() {
  const [internships, setInternships] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const result = await apiRequest<PageResult<Internship>>("/api/v1/recruiters/internships?limit=50");
      setInternships(getPageItems(result));
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void Promise.resolve().then(load); }, [load]);

  const changeStatus = async (internship: Internship) => {
    setBusyId(internship._id);
    setError("");
    setNotice("");
    try {
      if (internship.status === "draft") {
        await apiRequest(`/api/v1/recruiters/internships/${internship._id}/publish`, { method: "POST" });
        setNotice("Opportunity published.");
      } else {
        await apiRequest(`/api/v1/recruiters/internships/${internship._id}/close`, { method: "POST" });
        setNotice("Opportunity closed.");
      }
      await load();
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setBusyId("");
    }
  };

  return (
    <div className="content-wrap">
      <header className="page-heading"><div><p className="eyebrow">Hiring workspace</p><h1 className="page-title">Your opportunities</h1><p className="page-description">Review role performance and manage what is visible to candidates.</p></div><Link className="button" href="/recruiters/internships/new">Post a role</Link></header>
      {error && <div className="alert alert-error" role="alert" style={{ marginBottom: 14 }}>{error}</div>}
      {notice && <div className="alert alert-success" role="status" style={{ marginBottom: 14 }}>{notice}</div>}
      {loading ? <div className="surface empty-state">Loading your roles…</div> : internships.length === 0 ? (
        <div className="surface empty-state"><h2>No roles posted yet</h2><p>Create your first opportunity and start meeting candidates.</p><Link className="button" href="/recruiters/internships/new">Create opportunity</Link></div>
      ) : (
        <div className="list-stack">
          {internships.map((internship) => (
            <article className="list-row" key={internship._id}>
              <div><h2 className="list-title">{internship.title}</h2><div className="list-meta"><span>{internship.location}</span><span>{internship.type.replace("-", " ")}</span><span>{internship.applicationCount} applications</span><span>{internship.viewCount} views</span><span className={`badge ${internship.status === "published" ? "badge-green" : "badge-blue"}`}>{internship.status}</span></div><p className="help-text" style={{ marginTop: 10 }}>Created {new Date(internship.createdAt).toLocaleDateString()}</p></div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                <Link className="button button-secondary" href={`/recruiters/applicants?internshipId=${internship._id}`}>View applicants</Link>
                {["draft", "published"].includes(internship.status) && <button className="button button-secondary" onClick={() => void changeStatus(internship)} disabled={busyId === internship._id}>{busyId === internship._id ? "Updating…" : internship.status === "draft" ? "Publish" : "Close role"}</button>}
                {internship.status === "published" && <Link className="button button-quiet" href={`/students/internships/${internship._id}`}>Preview</Link>}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
