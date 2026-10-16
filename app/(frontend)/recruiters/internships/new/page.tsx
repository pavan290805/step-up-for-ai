"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ApiError, apiRequest, getErrorMessage } from "../../../_lib/api";

interface Company {
  _id: string;
  name: string;
}

export default function NewInternshipPage() {
  const [company, setCompany] = useState<Company | null>(null);
  const [companyLoading, setCompanyLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("internship");
  const [stipend, setStipend] = useState("");
  const [deadline, setDeadline] = useState("");
  const [skills, setSkills] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    apiRequest<Company>("/api/v1/recruiters/company")
      .then(setCompany)
      .catch((requestError: unknown) => {
        if (!(requestError instanceof ApiError && requestError.status === 404)) setError(getErrorMessage(requestError));
      })
      .finally(() => setCompanyLoading(false));
  }, []);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!company) return;
    setSaving(true);
    setError("");
    setNotice("");
    try {
      const created = await apiRequest<{ _id: string }>("/api/v1/recruiters/internships", {
        method: "POST",
        body: JSON.stringify({
          companyId: company._id,
          title: title.trim(),
          description: description.trim(),
          location: location.trim(),
          type,
          stipend: stipend.trim() ? Number(stipend) : null,
          applicationDeadline: deadline ? new Date(deadline).toISOString() : null,
          skillsRequired: skills.split(",").map((skill) => skill.trim()).filter(Boolean),
        }),
      });
      await apiRequest(`/api/v1/recruiters/internships/${created._id}/publish`, { method: "POST" });
      setNotice("Your opportunity is now published and visible in student search.");
      setTitle("");
      setDescription("");
      setLocation("");
      setSkills("");
      setStipend("");
      setDeadline("");
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="content-wrap">
      <header className="page-heading"><div><p className="eyebrow">Hiring workspace</p><h1 className="page-title">Post an opportunity</h1><p className="page-description">Create a clear, useful listing. New listings are published after all required information is validated.</p></div><Link className="button button-secondary" href="/recruiters/internships">Manage roles</Link></header>
      {companyLoading ? <div className="surface empty-state">Checking company profile…</div> : !company ? (
        <div className="surface surface-pad"><h2 style={{ marginTop: 0 }}>Set up your company first</h2><p className="muted">Your listings need to be connected to a company profile.</p><Link className="button" href="/recruiters/company">Create company profile</Link></div>
      ) : (
        <form className="surface surface-pad form-grid" onSubmit={submit}>
          <div className="alert alert-info">Posting as <strong>{company.name}</strong></div>
          {error && <div className="alert alert-error" role="alert">{error}</div>}
          {notice && <div className="alert alert-success" role="status">{notice} <Link className="text-link" href="/recruiters/internships">View your listings</Link></div>}
          <label className="field"><span className="field-label">Role title</span><input className="field-input" minLength={3} maxLength={150} required value={title} onChange={(event) => setTitle(event.target.value)} placeholder="e.g. Software Engineering Intern" /></label>
          <div className="form-row">
            <label className="field"><span className="field-label">Location</span><input className="field-input" maxLength={150} required value={location} onChange={(event) => setLocation(event.target.value)} placeholder="Bengaluru, India or Remote" /></label>
            <label className="field"><span className="field-label">Work type</span><select className="field-select" value={type} onChange={(event) => setType(event.target.value)}><option value="internship">Internship</option><option value="full-time">Full time</option><option value="hybrid">Hybrid</option><option value="remote">Remote</option></select></label>
          </div>
          <label className="field"><span className="field-label">Role description</span><textarea className="field-textarea" minLength={20} maxLength={10000} required value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Describe the work, responsibilities, learning opportunities, and what a successful candidate will bring." /></label>
          <div className="form-row">
            <label className="field"><span className="field-label">Monthly stipend (INR)</span><input className="field-input" type="number" min="0" step="1" value={stipend} onChange={(event) => setStipend(event.target.value)} placeholder="Optional" /></label>
            <label className="field"><span className="field-label">Application deadline</span><input className="field-input" type="date" value={deadline} onChange={(event) => setDeadline(event.target.value)} /></label>
          </div>
          <label className="field"><span className="field-label">Required skills</span><input className="field-input" value={skills} onChange={(event) => setSkills(event.target.value)} placeholder="React, TypeScript, communication" /><span className="help-text">Separate skills with commas.</span></label>
          <div><button className="button" type="submit" disabled={saving}>{saving ? "Publishing…" : "Publish opportunity"}</button></div>
        </form>
      )}
    </div>
  );
}
