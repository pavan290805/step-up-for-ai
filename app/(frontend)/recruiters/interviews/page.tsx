"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { apiRequest, getErrorMessage } from "../../_lib/api";

interface Interview {
  _id: string;
  applicationId: string | { _id: string };
  scheduledAt: string;
  mode: "online" | "onsite";
  status: string;
  meetingLink?: string | null;
  location?: string | null;
  notes?: string | null;
}

function applicationReference(value: Interview["applicationId"]): string {
  return typeof value === "string" ? value : value._id;
}

function InterviewsWorkspace() {
  const searchParams = useSearchParams();
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [applicationId, setApplicationId] = useState(searchParams.get("applicationId") ?? "");
  const [scheduledAt, setScheduledAt] = useState("");
  const [mode, setMode] = useState<"online" | "onsite">("online");
  const [meetingLink, setMeetingLink] = useState("");
  const [location, setLocation] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setInterviews(await apiRequest<Interview[]>("/api/v1/recruiters/interviews"));
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void Promise.resolve().then(load); }, [load]);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setNotice("");
    try {
      await apiRequest("/api/v1/recruiters/interviews", {
        method: "POST",
        body: JSON.stringify({
          applicationId,
          scheduledAt: new Date(scheduledAt).toISOString(),
          mode,
          ...(meetingLink.trim() ? { meetingLink: meetingLink.trim() } : {}),
          ...(location.trim() ? { location: location.trim() } : {}),
          ...(notes.trim() ? { notes: notes.trim() } : {}),
        }),
      });
      setNotice("Interview scheduled.");
      setApplicationId("");
      setScheduledAt("");
      setMeetingLink("");
      setLocation("");
      setNotes("");
      await load();
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="content-wrap">
      <header className="page-heading"><div><p className="eyebrow">Hiring workspace</p><h1 className="page-title">Interviews</h1><p className="page-description">Schedule conversations and keep the details for each meeting in one place.</p></div></header>
      <form className="surface surface-pad form-grid" onSubmit={submit}>
        <h2 style={{ margin: 0, fontSize: 18 }}>Schedule an interview</h2>
        {error && <div className="alert alert-error" role="alert">{error}</div>}
        {notice && <div className="alert alert-success" role="status">{notice}</div>}
        <label className="field"><span className="field-label">Application ID</span><input className="field-input" minLength={24} maxLength={24} required value={applicationId} onChange={(event) => setApplicationId(event.target.value)} placeholder="Use the ID from the applicant pipeline" /><span className="help-text">Open this form from an applicant’s Schedule interview action to prefill the ID.</span></label>
        <div className="form-row">
          <label className="field"><span className="field-label">Date and time</span><input className="field-input" type="datetime-local" required value={scheduledAt} onChange={(event) => setScheduledAt(event.target.value)} /></label>
          <label className="field"><span className="field-label">Meeting format</span><select className="field-select" value={mode} onChange={(event) => setMode(event.target.value as "online" | "onsite")}><option value="online">Online</option><option value="onsite">On site</option></select></label>
        </div>
        {mode === "online" ? <label className="field"><span className="field-label">Meeting link</span><input className="field-input" type="url" value={meetingLink} onChange={(event) => setMeetingLink(event.target.value)} placeholder="https://meet.example.com/…" /></label> : <label className="field"><span className="field-label">Meeting location</span><input className="field-input" maxLength={300} value={location} onChange={(event) => setLocation(event.target.value)} placeholder="Office address or room" /></label>}
        <label className="field"><span className="field-label">Notes for the candidate</span><textarea className="field-textarea" maxLength={1000} value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Share preparation details or an agenda." /></label>
        <div><button className="button" type="submit" disabled={saving}>{saving ? "Scheduling…" : "Schedule interview"}</button></div>
      </form>
      <h2 style={{ margin: "28px 0 12px", fontSize: 18 }}>Scheduled interviews</h2>
      {loading ? <div className="surface empty-state">Loading interviews…</div> : interviews.length === 0 ? <div className="surface empty-state"><h2>No interviews scheduled</h2><p>Schedule an interview from an applicant’s profile or enter an application ID above.</p></div> : (
        <div className="list-stack">
          {interviews.map((interview) => (
            <article className="list-row" key={interview._id}>
              <div><h3 className="list-title">{new Date(interview.scheduledAt).toLocaleString()}</h3><div className="list-meta"><span className="badge badge-blue">{interview.mode}</span><span>{interview.status}</span><span>Application {applicationReference(interview.applicationId)}</span></div>{interview.location && <p className="muted">{interview.location}</p>}{interview.meetingLink && <p><a className="text-link" href={interview.meetingLink} target="_blank" rel="noreferrer">Open meeting link</a></p>}{interview.notes && <p className="muted">{interview.notes}</p>}</div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

export default function RecruiterInterviewsPage() {
  return (
    <Suspense fallback={<div className="content-wrap"><div className="surface empty-state">Loading interviews…</div></div>}>
      <InterviewsWorkspace />
    </Suspense>
  );
}
