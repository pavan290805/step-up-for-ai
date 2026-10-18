"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { ApiError, apiRequest, getErrorMessage } from "../../_lib/api";

interface Resume {
  _id: string;
  fileName: string;
  fileUrl: string;
  version: number;
  createdAt: string;
  parsedText?: string | null;
  aiAnalysis?: { score: number };
}

interface ProfileResume {
  activeResumeId?: string | { _id: string } | null;
}

function identifier(value: string | { _id: string } | null | undefined): string {
  return typeof value === "string" ? value : value?._id ?? "";
}

export default function ResumePage() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [activeId, setActiveId] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [busyId, setBusyId] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [list, profile] = await Promise.all([
        apiRequest<Resume[]>("/api/v1/students/resume"),
        apiRequest<ProfileResume>("/api/v1/students/profile").catch((requestError: unknown): ProfileResume => {
          if (requestError instanceof ApiError && requestError.status === 404) return {};
          throw requestError;
        }),
      ]);
      setResumes(list);
      setActiveId(identifier(profile.activeResumeId));
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void Promise.resolve().then(load); }, [load]);

  const upload = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!file) {
      setError("Choose a PDF or DOCX file first.");
      return;
    }
    setUploading(true);
    setError("");
    setNotice("");
    try {
      const body = new FormData();
      body.append("file", file);
      await apiRequest<Resume>("/api/v1/students/resume", { method: "POST", body });
      setFile(null);
      setNotice("Your resume was uploaded.");
      await load();
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setUploading(false);
    }
  };

  const setActive = async (resumeId: string) => {
    setBusyId(resumeId);
    setError("");
    try {
      await apiRequest(`/api/v1/students/resume/${resumeId}`, { method: "PATCH" });
      setActiveId(resumeId);
      setNotice("Your active resume was updated.");
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setBusyId("");
    }
  };

  const remove = async (resumeId: string) => {
    if (!window.confirm("Permanently delete this resume?")) return;
    setBusyId(resumeId);
    setError("");
    try {
      await apiRequest(`/api/v1/students/resume/${resumeId}`, { method: "DELETE" });
      await load();
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setBusyId("");
    }
  };

  return (
    <div className="content-wrap">
      <header className="page-heading"><div><p className="eyebrow">Your account</p><h1 className="page-title">Resume library</h1><p className="page-description">Upload a current resume and choose the version to use when applying.</p></div></header>
      {error && <div className="alert alert-error" role="alert" style={{ marginBottom: 14 }}>{error}</div>}
      {notice && <div className="alert alert-success" role="status" style={{ marginBottom: 14 }}>{notice}</div>}
      <form className="surface surface-pad form-grid" onSubmit={upload}>
        <h2 style={{ margin: 0, fontSize: 18 }}>Upload a resume</h2>
        <label className="field"><span className="field-label">Resume file</span><input className="field-input" type="file" accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={(event) => setFile(event.target.files?.[0] ?? null)} required /><span className="help-text">Text-based PDF or DOCX, up to 10 MB. Scanned image-only PDFs need OCR before upload.</span></label>
        <div><button className="button" type="submit" disabled={uploading}>{uploading ? "Uploading…" : "Upload resume"}</button></div>
      </form>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "26px 0 12px" }}><h2 style={{ margin: 0, fontSize: 18 }}>Your resumes</h2><Link className="text-link" href="/students/ai/resume-analyzer">Analyze resume →</Link></div>
      {loading ? <div className="surface empty-state">Loading resumes…</div> : resumes.length === 0 ? (
        <div className="surface empty-state"><h2>No resumes uploaded</h2><p>Add a resume to make applications quicker.</p></div>
      ) : (
        <div className="list-stack">
          {resumes.map((resume) => (
            <article className="list-row" key={resume._id}>
              <div><h3 className="list-title">{resume.fileName}</h3><div className="list-meta"><span>Version {resume.version}</span><span>Uploaded {new Date(resume.createdAt).toLocaleDateString()}</span>{resume.parsedText ? <span>Ready for AI review</span> : <span>Re-upload to enable AI review</span>}{resume.aiAnalysis && <span>AI score {resume.aiAnalysis.score}/100</span>}</div>{activeId === resume._id && <span className="badge badge-green" style={{ marginTop: 10 }}>Active resume</span>}</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                <a className="button button-secondary" href={resume.fileUrl} target="_blank" rel="noreferrer">View file</a>
                {activeId !== resume._id && <button className="button button-secondary" onClick={() => void setActive(resume._id)} disabled={busyId === resume._id}>Set active</button>}
                <button className="button button-quiet" onClick={() => void remove(resume._id)} disabled={busyId === resume._id}>Delete</button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
