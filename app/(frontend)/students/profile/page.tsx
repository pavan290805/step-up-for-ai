"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ApiError, apiRequest, getErrorMessage } from "../../_lib/api";

interface StudentProfile {
  fullName: string;
  headline?: string | null;
  bio?: string | null;
  skills?: string[];
  education?: unknown[];
  experience?: unknown[];
  githubUrl?: string | null;
  linkedinUrl?: string | null;
  portfolioUrl?: string | null;
}

export default function StudentProfilePage() {
  const [profile, setProfile] = useState<StudentProfile>({ fullName: "", skills: [] });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    apiRequest<StudentProfile>("/api/v1/students/profile")
      .then((result) => setProfile({ ...result, skills: result.skills ?? [] }))
      .catch((requestError: unknown) => {
        if (!(requestError instanceof ApiError && requestError.status === 404)) setError(getErrorMessage(requestError));
      })
      .finally(() => setLoading(false));
  }, []);

  const save = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");
    try {
      const saved = await apiRequest<StudentProfile>("/api/v1/students/profile", {
        method: "PUT",
        body: JSON.stringify({
          ...profile,
          skills: (profile.skills ?? []).filter(Boolean),
        }),
      });
      setProfile({ ...saved, skills: saved.skills ?? [] });
      setNotice("Your profile has been saved.");
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="content-wrap">
      <header className="page-heading"><div><p className="eyebrow">Your account</p><h1 className="page-title">Professional profile</h1><p className="page-description">Help employers understand your experience, strengths, and career interests.</p></div></header>
      {loading ? <div className="surface empty-state">Loading profile…</div> : (
        <form className="surface surface-pad form-grid" onSubmit={save}>
          {error && <div className="alert alert-error" role="alert">{error}</div>}
          {notice && <div className="alert alert-success" role="status">{notice}</div>}
          <label className="field"><span className="field-label">Full name</span><input className="field-input" minLength={2} maxLength={120} required value={profile.fullName} onChange={(event) => setProfile({ ...profile, fullName: event.target.value })} /></label>
          <label className="field"><span className="field-label">Professional headline</span><input className="field-input" maxLength={150} value={profile.headline ?? ""} onChange={(event) => setProfile({ ...profile, headline: event.target.value })} placeholder="e.g. Computer science student focused on data engineering" /></label>
          <label className="field"><span className="field-label">About you</span><textarea className="field-textarea" maxLength={2000} value={profile.bio ?? ""} onChange={(event) => setProfile({ ...profile, bio: event.target.value })} placeholder="Summarize your interests, experience, and what you hope to work on." /></label>
          <label className="field"><span className="field-label">Skills</span><input className="field-input" value={(profile.skills ?? []).join(", ")} onChange={(event) => setProfile({ ...profile, skills: event.target.value.split(",").map((skill) => skill.trim()) })} placeholder="TypeScript, Python, user research" /><span className="help-text">Separate skills with commas.</span></label>
          <div className="form-row">
            <label className="field"><span className="field-label">GitHub profile</span><input className="field-input" type="url" value={profile.githubUrl ?? ""} onChange={(event) => setProfile({ ...profile, githubUrl: event.target.value })} placeholder="https://github.com/you" /></label>
            <label className="field"><span className="field-label">LinkedIn profile</span><input className="field-input" type="url" value={profile.linkedinUrl ?? ""} onChange={(event) => setProfile({ ...profile, linkedinUrl: event.target.value })} placeholder="https://linkedin.com/in/you" /></label>
          </div>
          <label className="field"><span className="field-label">Portfolio</span><input className="field-input" type="url" value={profile.portfolioUrl ?? ""} onChange={(event) => setProfile({ ...profile, portfolioUrl: event.target.value })} placeholder="https://your-portfolio.example" /></label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}><button className="button" type="submit" disabled={saving}>{saving ? "Saving…" : "Save profile"}</button><Link className="button button-secondary" href="/students/resume">Manage resumes</Link></div>
        </form>
      )}
    </div>
  );
}
