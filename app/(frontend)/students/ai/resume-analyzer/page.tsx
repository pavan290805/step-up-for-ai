"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { apiRequest, getErrorMessage } from "@/frontend/_lib/api";

interface ResumeAnalysis {
  score: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  provider: string;
  analyzedAt?: string;
}

interface Resume {
  _id: string;
  fileName: string;
  parsedText: string | null;
  aiAnalysis: ResumeAnalysis | null;
}

export default function ResumeAnalyzerPage() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [targetRole, setTargetRole] = useState("");
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const selectedResume = useMemo(
    () => resumes.find((resume) => resume._id === selectedResumeId) ?? null,
    [resumes, selectedResumeId],
  );

  const loadResumes = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const items = await apiRequest<Resume[]>("/api/v1/students/resume");
      const initialResume = items[0] ?? null;
      setResumes(items);
      setSelectedResumeId(initialResume?._id ?? "");
      setAnalysis(initialResume?.aiAnalysis ?? null);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void Promise.resolve().then(loadResumes);
  }, [loadResumes]);

  const selectResume = (resumeId: string) => {
    setSelectedResumeId(resumeId);
    setAnalysis(resumes.find((resume) => resume._id === resumeId)?.aiAnalysis ?? null);
  };

  const analyze = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const result = await apiRequest<ResumeAnalysis>("/api/v1/students/ai/resume-analyzer", {
        method: "POST",
        body: JSON.stringify({
          ...(selectedResumeId ? { resumeId: selectedResumeId } : { resumeText: resumeText.trim() }),
          ...(targetRole.trim() ? { targetRole: targetRole.trim() } : {}),
        }),
      });
      setAnalysis(result);
      if (selectedResumeId) {
        setResumes((current) =>
          current.map((resume) => (resume._id === selectedResumeId ? { ...resume, aiAnalysis: result } : resume)),
        );
      }
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setSubmitting(false);
    }
  };

  const canAnalyze = selectedResume
    ? Boolean(selectedResume.parsedText)
    : resumeText.trim().length >= 50;

  return (
    <div className="content-wrap">
      <header className="page-heading">
        <div>
          <p className="eyebrow">Career tools</p>
          <h1 className="page-title">AI resume review</h1>
          <p className="page-description">
            Get practical feedback on your resume, tailored to the role you want.
          </p>
        </div>
      </header>

      {error && <div className="alert alert-error" role="alert" style={{ marginBottom: 14 }}>{error}</div>}

      <form className="surface surface-pad form-grid" onSubmit={analyze}>
        <h2 style={{ margin: 0, fontSize: 18 }}>Choose a resume</h2>
        <label className="field">
          <span className="field-label">Resume source</span>
          <select
            className="field-input"
            value={selectedResumeId}
            onChange={(event) => selectResume(event.target.value)}
            disabled={loading || submitting}
          >
            <option value="">Paste resume text</option>
            {resumes.map((resume) => (
              <option key={resume._id} value={resume._id}>
                {resume.fileName}{resume.parsedText ? "" : " (re-upload required)"}
              </option>
            ))}
          </select>
          <span className="help-text">
            {loading ? "Loading your saved resumes…" : "Saved resumes are analyzed securely and their feedback is saved to your resume library."}
          </span>
        </label>

        {selectedResume ? (
          selectedResume.parsedText ? (
            <div className="alert alert-success" role="status">
              Ready to analyze: {selectedResume.fileName}
            </div>
          ) : (
            <div className="alert alert-error" role="status">
              This older resume has no extracted text. <Link className="text-link" href="/students/resume">Re-upload it</Link>, or choose “Paste resume text” and paste its contents below.
            </div>
          )
        ) : (
          <label className="field">
            <span className="field-label">Resume text</span>
            <textarea
              className="field-input"
              rows={10}
              value={resumeText}
              onChange={(event) => setResumeText(event.target.value)}
              placeholder="Paste the text from your resume here (at least 50 characters)."
              minLength={50}
              maxLength={20_000}
              required
              disabled={submitting}
            />
            <span className="help-text">{resumeText.trim().length}/20,000 characters</span>
          </label>
        )}

        <label className="field">
          <span className="field-label">Target role <span className="help-text">(optional)</span></span>
          <input
            className="field-input"
            type="text"
            maxLength={150}
            value={targetRole}
            onChange={(event) => setTargetRole(event.target.value)}
            placeholder="For example, Frontend Developer Intern"
            disabled={submitting}
          />
        </label>

        <div>
          <button className="button" type="submit" disabled={loading || submitting || !canAnalyze}>
            {submitting ? "Reviewing resume…" : "Analyze resume"}
          </button>
          {selectedResume && !selectedResume.parsedText && (
            <p className="help-text" style={{ marginTop: 8 }}>Re-upload the file or switch to pasted text to continue.</p>
          )}
        </div>
      </form>

      {analysis && (
        <section className="surface surface-pad" aria-live="polite" style={{ marginTop: 20 }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
            <div>
              <p className="eyebrow">Resume feedback</p>
              <h2 style={{ margin: 0, fontSize: 22 }}>Your review</h2>
              {analysis.analyzedAt && (
                <p className="help-text">Saved {new Date(analysis.analyzedAt).toLocaleString()}</p>
              )}
            </div>
            <div aria-label={`Resume score ${analysis.score} out of 100`} style={{ minWidth: 140 }}>
              <strong style={{ fontSize: 28 }}>{analysis.score}<span style={{ fontSize: 16, fontWeight: 500 }}>/100</span></strong>
              <progress value={analysis.score} max={100} style={{ display: "block", width: "100%" }} />
            </div>
          </div>
          <div className="form-grid" style={{ marginTop: 22 }}>
            <FeedbackList title="Strengths" items={analysis.strengths} />
            <FeedbackList title="Areas to improve" items={analysis.weaknesses} />
            <FeedbackList title="Recommended next steps" items={analysis.suggestions} />
          </div>
          <p className="help-text" style={{ marginTop: 18 }}>Generated by {analysis.provider}. Review suggestions carefully and keep your resume accurate.</p>
        </section>
      )}
    </div>
  );
}

function FeedbackList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h3 style={{ margin: "0 0 8px", fontSize: 16 }}>{title}</h3>
      <ul style={{ margin: 0, paddingLeft: 20, display: "grid", gap: 6 }}>
        {items.map((item, index) => <li key={`${title}-${index}`}>{item}</li>)}
      </ul>
    </div>
  );
}
