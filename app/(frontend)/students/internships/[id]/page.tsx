"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { apiRequest, getErrorMessage } from "../../../_lib/api";
import { useAuth } from "../../../_context/AuthContext";

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

interface Resume {
  _id: string;
  fileName: string;
  createdAt?: string;
}

export default function InternshipDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const [job, setJob] = useState<Internship | null>(null);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [resumeId, setResumeId] = useState("");
  const [coverNote, setCoverNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const result = await apiRequest<Internship>(`/api/v1/students/internships/${id}`);
        if (active) setJob(result);
      } catch (requestError) {
        if (active) setError(getErrorMessage(requestError));
      } finally {
        if (active) setLoading(false);
      }
    };
    void load();
    return () => { active = false; };
  }, [id]);

  useEffect(() => {
    if (!user || user.role !== "student") return;
    apiRequest<Resume[]>("/api/v1/students/resume")
      .then((list) => {
        setResumes(list);
        if (list[0]) setResumeId(list[0]._id);
      })
      .catch((requestError: unknown) => setError(getErrorMessage(requestError)));
  }, [user]);

  const save = async () => {
    if (!user) {
      router.push(`/auth/login?next=${encodeURIComponent(`/students/internships/${id}`)}`);
      return;
    }
    setSaving(true);
    setError("");
    setNotice("");
    try {
      await apiRequest("/api/v1/students/saved-internships", {
        method: "POST",
        body: JSON.stringify({ internshipId: id }),
      });
      setNotice("This opportunity has been added to your saved list.");
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setSaving(false);
    }
  };

  const apply = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user) {
      router.push(`/auth/login?next=${encodeURIComponent(`/students/internships/${id}`)}`);
      return;
    }
    setSaving(true);
    setError("");
    setNotice("");
    try {
      await apiRequest("/api/v1/students/applications", {
        method: "POST",
        body: JSON.stringify({ internshipId: id, resumeId, coverNote: coverNote.trim() || undefined }),
      });
      setNotice("Your application was submitted successfully.");
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="content-wrap"><div className="surface empty-state">Loading opportunity…</div></div>;
  if (!job) return <div className="content-wrap"><div className="alert alert-error" role="alert">{error || "This opportunity could not be found."}</div><p style={{ marginTop: 16 }}><Link className="text-link" href="/students/internships">Back to search</Link></p></div>;

  return (
    <div className="content-wrap">
      <p className="eyebrow"><Link className="text-link" href="/students/internships">Internships</Link> / Opportunity details</p>
      <div className="page-heading">
        <div>
          <h1 className="page-title">{job.title}</h1>
          <p className="page-description">{job.location} · {job.type.replace("-", " ")}{job.stipend != null ? ` · ₹${job.stipend.toLocaleString("en-IN")} / month` : ""}</p>
        </div>
        {user?.role === "student" && <button className="button button-secondary" onClick={() => void save()} disabled={saving}>Save opportunity</button>}
      </div>
      {error && <div className="alert alert-error" role="alert" style={{ marginBottom: 14 }}>{error}</div>}
      {notice && <div className="alert alert-success" role="status" style={{ marginBottom: 14 }}>{notice}</div>}
      <div className="form-row" style={{ alignItems: "start" }}>
        <article className="surface surface-pad">
          <h2 style={{ marginTop: 0, fontSize: 18 }}>About the role</h2>
          <p style={{ color: "#475467", whiteSpace: "pre-wrap" }}>{job.description}</p>
          {job.skillsRequired?.length ? (
            <>
              <hr className="divider" style={{ margin: "22px 0" }} />
              <h2 style={{ fontSize: 16 }}>Skills</h2>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                {job.skillsRequired.map((skill) => <span className="badge badge-blue" key={skill}>{skill}</span>)}
              </div>
            </>
          ) : null}
          {job.applicationDeadline && <p className="muted" style={{ marginTop: 22 }}>Applications close {new Date(job.applicationDeadline).toLocaleDateString()}.</p>}
        </article>
        {user?.role === "student" ? (
          <form className="surface surface-pad form-grid" onSubmit={apply}>
            <h2 style={{ margin: 0, fontSize: 18 }}>Apply for this role</h2>
            {resumes.length ? (
              <label className="field">
                <span className="field-label">Resume</span>
                <select className="field-select" value={resumeId} onChange={(event) => setResumeId(event.target.value)} required>
                  {resumes.map((resume) => <option key={resume._id} value={resume._id}>{resume.fileName}</option>)}
                </select>
              </label>
            ) : (
              <div className="alert alert-info">Upload a resume before applying. <Link className="text-link" href="/students/resume">Manage resumes</Link></div>
            )}
            <label className="field">
              <span className="field-label">Note to the hiring team <span className="muted">(optional)</span></span>
              <textarea className="field-textarea" maxLength={2000} value={coverNote} onChange={(event) => setCoverNote(event.target.value)} placeholder="Briefly share why this role interests you." />
            </label>
            <button className="button" type="submit" disabled={saving || resumes.length === 0}>{saving ? "Submitting…" : "Submit application"}</button>
            <p className="help-text">You can track the status of your application from your dashboard.</p>
          </form>
        ) : (
          <aside className="surface surface-pad">
            <h2 style={{ marginTop: 0, fontSize: 18 }}>Interested?</h2>
            <p className="muted">Sign in as a student or create an account to apply for this role.</p>
            <Link className="button" href="/auth/login">Sign in to apply</Link>
          </aside>
        )}
      </div>
    </div>
  );
}
