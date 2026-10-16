"use client";

import { useEffect, useState } from "react";
import { ApiError, apiRequest, getErrorMessage } from "../../_lib/api";

interface Company {
  _id: string;
  name: string;
  website?: string | null;
  industry?: string | null;
  size?: string | null;
  description?: string | null;
}

interface CompanyFields {
  name: string;
  website: string;
  industry: string;
  size: string;
  description: string;
}

const blankCompany: CompanyFields = { name: "", website: "", industry: "", size: "", description: "" };

export default function RecruiterCompanyPage() {
  const [company, setCompany] = useState<CompanyFields>(blankCompany);
  const [exists, setExists] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    apiRequest<Company>("/api/v1/recruiters/company")
      .then((result) => {
        setExists(true);
        setCompany({
          name: result.name ?? "",
          website: result.website ?? "",
          industry: result.industry ?? "",
          size: result.size ?? "",
          description: result.description ?? "",
        });
      })
      .catch((requestError: unknown) => {
        if (!(requestError instanceof ApiError && requestError.status === 404)) setError(getErrorMessage(requestError));
      })
      .finally(() => setLoading(false));
  }, []);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");
    const payload = {
      name: company.name.trim(),
      ...(company.website.trim() ? { website: company.website.trim() } : {}),
      ...(company.industry.trim() ? { industry: company.industry.trim() } : {}),
      ...(company.size ? { size: company.size } : {}),
      ...(company.description.trim() ? { description: company.description.trim() } : {}),
    };
    try {
      const saved = await apiRequest<Company>("/api/v1/recruiters/company", {
        method: exists ? "PUT" : "POST",
        body: JSON.stringify(payload),
      });
      setExists(true);
      setCompany({
        name: saved.name ?? "",
        website: saved.website ?? "",
        industry: saved.industry ?? "",
        size: saved.size ?? "",
        description: saved.description ?? "",
      });
      setNotice("Your company profile has been saved.");
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="content-wrap">
      <header className="page-heading"><div><p className="eyebrow">Hiring workspace</p><h1 className="page-title">Company profile</h1><p className="page-description">Add the organization details candidates need to understand your team.</p></div></header>
      {loading ? <div className="surface empty-state">Loading company profile…</div> : (
        <form className="surface surface-pad form-grid" onSubmit={submit}>
          {error && <div className="alert alert-error" role="alert">{error}</div>}
          {notice && <div className="alert alert-success" role="status">{notice}</div>}
          <label className="field"><span className="field-label">Company name</span><input className="field-input" minLength={2} maxLength={150} required value={company.name} onChange={(event) => setCompany({ ...company, name: event.target.value })} /></label>
          <div className="form-row">
            <label className="field"><span className="field-label">Website</span><input className="field-input" type="url" value={company.website} onChange={(event) => setCompany({ ...company, website: event.target.value })} placeholder="https://example.com" /></label>
            <label className="field"><span className="field-label">Industry</span><input className="field-input" maxLength={100} value={company.industry} onChange={(event) => setCompany({ ...company, industry: event.target.value })} placeholder="Technology" /></label>
          </div>
          <label className="field"><span className="field-label">Company size</span><select className="field-select" value={company.size} onChange={(event) => setCompany({ ...company, size: event.target.value })}><option value="">Select size</option>{["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"].map((size) => <option value={size} key={size}>{size} employees</option>)}</select></label>
          <label className="field"><span className="field-label">About the company</span><textarea className="field-textarea" maxLength={5000} value={company.description} onChange={(event) => setCompany({ ...company, description: event.target.value })} placeholder="Tell candidates about your work, team, and mission." /></label>
          <div><button className="button" type="submit" disabled={saving}>{saving ? "Saving…" : exists ? "Save changes" : "Create company profile"}</button></div>
          {!exists && <p className="help-text">Create this profile before publishing your first opportunity.</p>}
        </form>
      )}
    </div>
  );
}
