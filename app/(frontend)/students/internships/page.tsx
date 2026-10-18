"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { apiRequest, getErrorMessage, getPageItems, type PageResult } from "../../_lib/api";
import { useAuth } from "../../_context/AuthContext";

interface Internship {
  _id: string;
  title: string;
  description: string;
  location: string;
  type: string;
  stipend?: number | null;
  skillsRequired?: string[];
  applicationDeadline?: string | null;
}

interface ExternalJob {
  provider: "jsearch";
  externalJobId: string;
  title: string;
  companyName: string;
  location: string;
  employmentType: string | null;
  applyUrl: string;
  sourceUrl: string | null;
  employerLogoUrl: string | null;
  postedAt: string | null;
  salary: string | null;
}

const emptyFilters = { q: "", location: "", type: "" };

export default function InternshipsPage() {
  const { user, loading: authLoading } = useAuth();
  const [filters, setFilters] = useState(emptyFilters);
  const [items, setItems] = useState<Internship[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [externalJobs, setExternalJobs] = useState<ExternalJob[]>([]);
  const [externalLoading, setExternalLoading] = useState(false);
  const [externalError, setExternalError] = useState("");
  const [trackingJobId, setTrackingJobId] = useState("");
  const [trackedJobIds, setTrackedJobIds] = useState<string[]>([]);

  const loadJobs = useCallback(async (cursor?: string) => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (filters.q.trim()) params.set("q", filters.q.trim());
      if (filters.location.trim()) params.set("location", filters.location.trim());
      if (filters.type) params.set("type", filters.type);
      if (cursor) params.set("cursor", cursor);
      params.set("limit", "20");
      const result = await apiRequest<PageResult<Internship>>(`/api/v1/students/internships?${params.toString()}`);
      setItems((current) => cursor ? [...current, ...getPageItems(result)] : getPageItems(result));
      setNextCursor(Array.isArray(result) ? null : result.nextCursor ?? null);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const searchExternalJobs = async () => {
    const query = filters.q.trim();
    if (query.length < 2) {
      setExternalJobs([]);
      setExternalError("Enter at least 2 characters in Role or skill to search external jobs.");
      return;
    }

    setExternalLoading(true);
    setExternalError("");
    try {
      const params = new URLSearchParams({ q: query });
      if (filters.location.trim()) params.set("location", filters.location.trim());
      if (filters.type) params.set("type", filters.type);
      const result = await apiRequest<{ items: ExternalJob[] }>(
        `/api/v1/students/external-jobs?${params.toString()}`
      );
      setExternalJobs(result.items);
    } catch (requestError) {
      setExternalError(getErrorMessage(requestError));
      setExternalJobs([]);
    } finally {
      setExternalLoading(false);
    }
  };

  const trackExternalApplication = async (job: ExternalJob) => {
    if (user?.role !== "student") return;
    setExternalError("");
    setTrackingJobId(job.externalJobId);
    window.open(job.applyUrl, "_blank", "noopener,noreferrer");
    try {
      await apiRequest("/api/v1/students/external-applications", {
        method: "POST",
        body: JSON.stringify(job),
      });
      setTrackedJobIds((current) => current.includes(job.externalJobId)
        ? current
        : [...current, job.externalJobId]);
    } catch (requestError) {
      setExternalError(
        `${getErrorMessage(requestError)} The employer page was opened, but this activity was not saved.`
      );
    } finally {
      setTrackingJobId("");
    }
  };

  useEffect(() => {
    void Promise.resolve().then(() => loadJobs());
  }, [loadJobs]);

  return (
    <div className="content-wrap">
      <header className="page-heading">
        <div>
          <p className="eyebrow">Opportunities</p>
          <h1 className="page-title">Find your next internship</h1>
          <p className="page-description">Search current opportunities from teams looking for early-career talent.</p>
        </div>
      </header>
      <form className="surface surface-pad" onSubmit={(event) => { event.preventDefault(); void loadJobs(); void searchExternalJobs(); }}>
        <div className="form-row">
          <label className="field">
            <span className="field-label">Role or skill</span>
            <input className="field-input" value={filters.q} onChange={(event) => setFilters({ ...filters, q: event.target.value })} placeholder="e.g. Software engineering" />
          </label>
          <label className="field">
            <span className="field-label">Location</span>
            <input className="field-input" value={filters.location} onChange={(event) => setFilters({ ...filters, location: event.target.value })} placeholder="City or remote" />
          </label>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "end", gap: 12, marginTop: 16 }}>
          <label className="field" style={{ minWidth: 220 }}>
            <span className="field-label">Work type</span>
            <select className="field-select" value={filters.type} onChange={(event) => setFilters({ ...filters, type: event.target.value })}>
              <option value="">All work types</option>
              <option value="internship">Internship</option>
              <option value="full-time">Full time</option>
              <option value="hybrid">Hybrid</option>
              <option value="remote">Remote</option>
            </select>
          </label>
          <button className="button" type="submit" disabled={loading}>Search opportunities</button>
          {(filters.q || filters.location || filters.type) && (
            <button className="button button-secondary" type="button" onClick={() => setFilters(emptyFilters)}>Clear filters</button>
          )}
        </div>
      </form>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "24px 0 12px" }}>
        <h2 style={{ margin: 0, fontSize: 17 }}>Open opportunities</h2>
        <span className="muted" style={{ fontSize: 13 }}>{items.length} shown</span>
      </div>
      {error && <div className="alert alert-error" role="alert">{error}</div>}
      {loading && items.length === 0 ? (
        <div className="surface empty-state" aria-live="polite">Loading opportunities…</div>
      ) : !error && items.length === 0 ? (
        <div className="surface empty-state">
          <h2>No opportunities found</h2>
          <p>Try a broader search or check back soon for new roles.</p>
        </div>
      ) : (
        <div className="list-stack">
          {items.map((job) => (
            <article className="list-row" key={job._id}>
              <div style={{ minWidth: 0 }}>
                <h3 className="list-title"><Link className="text-link" href={`/students/internships/${job._id}`}>{job.title}</Link></h3>
                <div className="list-meta">
                  <span>{job.location}</span>
                  <span>{job.type.replace("-", " ")}</span>
                  {job.stipend != null && <span>₹{job.stipend.toLocaleString("en-IN")} / month</span>}
                  {job.applicationDeadline && <span>Apply by {new Date(job.applicationDeadline).toLocaleDateString()}</span>}
                </div>
                {job.skillsRequired?.length ? (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 12 }}>
                    {job.skillsRequired.slice(0, 6).map((skill) => <span className="badge" key={skill}>{skill}</span>)}
                  </div>
                ) : null}
              </div>
              <Link className="button button-secondary" href={`/students/internships/${job._id}`}>View role</Link>
            </article>
          ))}
        </div>
      )}
      <section aria-labelledby="external-jobs-heading" style={{ marginTop: 32 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
          <div>
            <h2 id="external-jobs-heading" style={{ margin: 0, fontSize: 20 }}>Jobs from across the web</h2>
            <p className="muted" style={{ margin: "6px 0 0", fontSize: 13 }}>
              External listings powered by JSearch. Apply on the employer’s website.
            </p>
          </div>
          {externalJobs.length > 0 && <span className="muted" style={{ fontSize: 13 }}>{externalJobs.length} shown</span>}
        </div>
        {!authLoading && user?.role !== "student" && (
          <p className="help-text">
            <Link className="text-link" href="/auth/login">Sign in as a student</Link> to open employer application pages and save their activity to your account.
          </p>
        )}
        {externalError && <div className="alert alert-error" role="alert">{externalError}</div>}
        {externalLoading ? (
          <div className="surface empty-state" aria-live="polite">Searching external job listings…</div>
        ) : externalJobs.length > 0 ? (
          <div className="list-stack">
            {externalJobs.map((job) => (
              <article className="list-row" key={`${job.provider}-${job.externalJobId}`}>
                <div style={{ minWidth: 0 }}>
                  <h3 className="list-title">{job.title}</h3>
                  <div className="list-meta">
                    <span>{job.companyName}</span>
                    <span>{job.location}</span>
                    {job.employmentType && <span>{job.employmentType.replaceAll("_", " ").toLowerCase()}</span>}
                    {job.salary && <span>{job.salary}</span>}
                    {job.postedAt && <span>Posted {new Date(job.postedAt).toLocaleDateString()}</span>}
                  </div>
                  <span className="badge" style={{ marginTop: 10, display: "inline-flex" }}>External listing</span>
                </div>
                {user?.role === "student" ? (
                  <button
                    className="button button-secondary"
                    type="button"
                    onClick={() => void trackExternalApplication(job)}
                    disabled={authLoading || trackingJobId === job.externalJobId}
                  >
                    {trackingJobId === job.externalJobId
                      ? "Saving…"
                      : trackedJobIds.includes(job.externalJobId)
                        ? "Open employer site again"
                        : "Apply on employer site"}
                  </button>
                ) : (
                  <Link className="button button-secondary" href="/auth/login">Sign in to apply</Link>
                )}
              </article>
            ))}
          </div>
        ) : !externalError ? (
          <div className="surface empty-state">
            <p>Search by job title or skill to find listings from external employers.</p>
            <p className="help-text" style={{ marginBottom: 0 }}>
              External application activity is saved to your account when you open an employer’s application page. You must submit the application on that external site.
            </p>
          </div>
        ) : null}
      </section>
      {nextCursor && (
        <div style={{ display: "flex", justifyContent: "center", marginTop: 20 }}>
          <button className="button button-secondary" onClick={() => void loadJobs(nextCursor)} disabled={loading}>Load more</button>
        </div>
      )}
    </div>
  );
}
