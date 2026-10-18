"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { ApiError, apiRequest, getErrorMessage } from "../_lib/api";

function humanize(segment: string): string {
  return segment
    .replace(/\[|\]/g, "")
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function displayValue(value: unknown): string {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  if (Array.isArray(value)) return `${value.length} item${value.length === 1 ? "" : "s"}`;
  return JSON.stringify(value);
}

function getRecords(data: unknown): Record<string, unknown>[] {
  if (Array.isArray(data)) return data.filter(isRecord);
  if (!isRecord(data)) return [];
  if (Array.isArray(data.items)) return data.items.filter(isRecord);
  return [data];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function getText(record: Record<string, unknown>, keys: string[]): string | null {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return null;
}

function getRecordTitle(record: Record<string, unknown>, fallback: string): string {
  return getText(record, ["title", "name", "roleTitle", "fileName", "companyName", "email"]) ?? fallback;
}

function getRecordSummary(record: Record<string, unknown>): string | null {
  return getText(record, ["description", "summary", "content", "tagline", "headline", "message"]);
}

function getRecordStatus(record: Record<string, unknown>): string | null {
  return getText(record, ["status", "state", "stage"]);
}

type ActionValue = string | boolean;

interface WorkspaceField {
  name: string;
  label: string;
  type: "text" | "email" | "url" | "textarea" | "datetime-local" | "number" | "select" | "checkbox";
  required?: boolean;
  options?: { value: string; label: string }[];
  defaultValue?: string | boolean;
  helpText?: string;
}

interface WorkspaceAction {
  label: string;
  method: "POST" | "PUT" | "PATCH" | "DELETE";
  endpoint: string;
  confirmMessage?: string;
  fields?: WorkspaceField[];
  buildPayload?: (values: Record<string, ActionValue>) => unknown;
}

interface WorkspaceDefinition {
  endpoint: string;
  actions?: WorkspaceAction[];
}

function workspaceDefinition(pathname: string): WorkspaceDefinition {
  const api = "/api/v1";
  const segments = pathname.split("/").filter(Boolean);
  const id = segments.find((segment) => /^[\da-f]{24}$/i.test(segment));

  if (pathname === "/community/posts/create") {
    return {
      endpoint: `${api}/community/posts`,
      actions: [{
        label: "Publish post",
        method: "POST",
        endpoint: `${api}/community/posts`,
        fields: [
          { name: "title", label: "Title", type: "text", required: true },
          { name: "content", label: "Post", type: "textarea", required: true },
          { name: "category", label: "Category", type: "text" },
          { name: "tags", label: "Tags", type: "text", helpText: "Separate tags with commas." },
        ],
        buildPayload: (values) => ({
          title: values.title,
          content: values.content,
          category: values.category || undefined,
          tags: String(values.tags ?? "").split(",").map((tag) => tag.trim()).filter(Boolean),
        }),
      }],
    };
  }

  if (pathname === "/events/create") {
    return {
      endpoint: `${api}/events`,
      actions: [{
        label: "Create event",
        method: "POST",
        endpoint: `${api}/events`,
        fields: [
          { name: "title", label: "Event title", type: "text", required: true },
          { name: "description", label: "Description", type: "textarea", required: true },
          { name: "type", label: "Event type", type: "select", required: true, options: ["webinar", "hackathon", "workshop", "bootcamp", "seminar", "founder-talk", "podcast", "networking"].map((value) => ({ value, label: humanize(value) })) },
          { name: "startAt", label: "Starts at", type: "datetime-local", required: true },
          { name: "endAt", label: "Ends at", type: "datetime-local", required: true },
          { name: "location", label: "Location", type: "text", required: true },
          { name: "isOnline", label: "Online event", type: "checkbox", defaultValue: true },
          { name: "capacity", label: "Capacity", type: "number" },
          { name: "category", label: "Category", type: "text" },
          { name: "tags", label: "Tags", type: "text", helpText: "Separate tags with commas." },
        ],
        buildPayload: (values) => ({
          title: values.title,
          description: values.description,
          type: values.type,
          startAt: new Date(String(values.startAt)).toISOString(),
          endAt: new Date(String(values.endAt)).toISOString(),
          location: values.location,
          isOnline: values.isOnline === true,
          capacity: values.capacity ? Number(values.capacity) : null,
          category: values.category || undefined,
          tags: String(values.tags ?? "").split(",").map((tag) => tag.trim()).filter(Boolean),
        }),
      }],
    };
  }

  if (segments[0] === "events" && id && segments[2] === "register") {
    return {
      endpoint: `${api}/events/${id}`,
      actions: [
        { label: "Register for event", method: "POST", endpoint: `${api}/events/${id}/register` },
        { label: "Cancel registration", method: "DELETE", endpoint: `${api}/events/${id}/register` },
      ],
    };
  }

  if (segments[0] === "events" && id && segments[2] === "attendance") {
    return {
      endpoint: `${api}/events/${id}`,
      actions: [{
        label: "Mark attendance",
        method: "POST",
        endpoint: `${api}/events/${id}/attendance`,
        fields: [{ name: "userId", label: "Attendee user ID", type: "text", required: true }],
      }],
    };
  }

  if (pathname === "/payments/checkout") {
    return {
      endpoint: `${api}/payments/plans`,
      actions: [{
        label: "Create secure checkout order",
        method: "POST",
        endpoint: `${api}/payments/checkout`,
        fields: [{ name: "planId", label: "Plan ID", type: "text", required: true }],
      }],
    };
  }

  if (pathname === "/payments/subscriptions/cancel") {
    return {
      endpoint: `${api}/payments/subscriptions`,
      actions: [{
        label: "Schedule cancellation",
        method: "POST",
        endpoint: `${api}/payments/subscriptions/cancel`,
        fields: [{ name: "atPeriodEnd", label: "Keep access through the paid period", type: "checkbox", defaultValue: true }],
        buildPayload: (values) => ({ atPeriodEnd: values.atPeriodEnd === true }),
      }],
    };
  }

  if (pathname === "/students/ai/resume-analyzer") {
    return {
      endpoint: `${api}/students/resume`,
      actions: [{
        label: "Analyze resume",
        method: "POST",
        endpoint: `${api}/students/ai/resume-analyzer`,
        fields: [
          { name: "resumeText", label: "Resume text", type: "textarea", required: true, helpText: "Paste at least 50 characters of resume text." },
          { name: "targetRole", label: "Target role", type: "text" },
        ],
      }],
    };
  }

  if (pathname === "/recruiters/ai/jd-generator") {
    return {
      endpoint: `${api}/recruiters/internships`,
      actions: [{
        label: "Generate job description",
        method: "POST",
        endpoint: `${api}/recruiters/ai/jd-generator`,
        fields: [
          { name: "roleTitle", label: "Role title", type: "text", required: true },
          { name: "location", label: "Location", type: "text", required: true },
          { name: "companyDescription", label: "Company description", type: "textarea" },
          { name: "skillsRequired", label: "Required skills", type: "text", helpText: "Separate skills with commas." },
          { name: "type", label: "Work type", type: "select", required: true, options: ["internship", "full-time", "hybrid", "remote"].map((value) => ({ value, label: humanize(value) })) },
        ],
        buildPayload: (values) => ({
          roleTitle: values.roleTitle,
          location: values.location,
          companyDescription: values.companyDescription || undefined,
          skillsRequired: String(values.skillsRequired ?? "").split(",").map((skill) => skill.trim()).filter(Boolean),
          type: values.type,
        }),
      }],
    };
  }

  if (segments[0] === "admin" && segments[1] === "users" && id && segments.length === 4) {
    const actionName = segments[3];
    if (actionName === "approve") {
      return {
        endpoint: `${api}/admin/users/${id}`,
        actions: [{ label: "Approve user", method: "POST", endpoint: `${api}/admin/users/${id}/approve` }],
      };
    }
    if (actionName === "ban") {
      return {
        endpoint: `${api}/admin/users/${id}`,
        actions: [{
          label: "Update user status",
          method: "POST",
          endpoint: `${api}/admin/users/${id}/ban`,
          fields: [
            { name: "status", label: "Status", type: "select", required: true, defaultValue: "banned", options: ["pending", "active", "suspended", "banned"].map((value) => ({ value, label: humanize(value) })) },
            { name: "reason", label: "Reason", type: "textarea" },
          ],
        }],
      };
    }
    if (actionName === "role") {
      return {
        endpoint: `${api}/admin/users/${id}`,
        actions: [{
          label: "Update user role",
          method: "PUT",
          endpoint: `${api}/admin/users/${id}/role`,
          fields: [{ name: "role", label: "Role", type: "select", required: true, options: ["student", "recruiter", "investor", "mentor", "admin", "super_admin"].map((value) => ({ value, label: humanize(value) })) }],
        }],
      };
    }
  }

  if (segments[0] === "admin" && id && segments[1] === "community" && segments[3] === "moderate") {
    return {
      endpoint: `${api}/community/posts/${id}`,
      actions: [{
        label: "Moderate post",
        method: "POST",
        endpoint: `${api}/admin/community/${id}/moderate`,
        fields: [
          { name: "status", label: "Status", type: "select", required: true, options: ["published", "hidden", "removed"].map((value) => ({ value, label: humanize(value) })) },
          { name: "reason", label: "Reason", type: "textarea" },
        ],
      }],
    };
  }

  if (segments[0] === "admin" && id && segments[1] === "events" && segments[3] === "moderate") {
    return {
      endpoint: `${api}/events/${id}`,
      actions: [{
        label: "Moderate event",
        method: "POST",
        endpoint: `${api}/admin/events/${id}/moderate`,
        fields: [{ name: "status", label: "Status", type: "select", required: true, options: ["draft", "published", "cancelled", "archived"].map((value) => ({ value, label: humanize(value) })) }],
        buildPayload: (values) => ({ status: values.status }),
      }],
    };
  }

  if (segments[0] === "admin" && id && segments[1] === "internships" && segments[3] === "moderate") {
    return {
      endpoint: `${api}/students/internships/${id}`,
      actions: [{
        label: "Moderate internship",
        method: "POST",
        endpoint: `${api}/admin/internships/${id}/moderate`,
        fields: [{ name: "status", label: "Status", type: "select", required: true, options: ["draft", "published", "closed", "expired"].map((value) => ({ value, label: humanize(value) })) }],
        buildPayload: (values) => ({ status: values.status }),
      }],
    };
  }

  if (segments[0] === "mentors" && segments[1] === "sessions" && id) {
    return {
      endpoint: `${api}/mentors/sessions`,
      actions: [
        { label: "Confirm session", method: "POST", endpoint: `${api}/mentors/sessions/${id}/confirm` },
        { label: "Complete session", method: "POST", endpoint: `${api}/mentors/sessions/${id}/complete` },
        { label: "Cancel session", method: "POST", endpoint: `${api}/mentors/sessions/${id}/cancel` },
      ],
    };
  }

  if (segments[0] === "events" && segments[1] === "create") {
    return workspaceDefinition("/events/create");
  }

  if (segments[0] === "mentors" && segments[1] === "sessions" && segments[2] === "history") {
    return { endpoint: `${api}/mentors/sessions/history` };
  }

  if (segments[0] === "recruiters" && segments[1] === "applicants" && id) {
    return { endpoint: `${api}/recruiters/applicants` };
  }

  if (segments[0] === "students" && segments[1] === "saved-internships" && id) {
    return {
      endpoint: `${api}/students/saved-internships`,
      actions: [{
        label: "Remove saved opportunity",
        method: "DELETE",
        endpoint: `${api}/students/saved-internships/${id}`,
        confirmMessage: "Remove this opportunity from your saved list?",
      }],
    };
  }

  if (segments[0] === "students" && segments[1] === "applications" && id) {
    return {
      endpoint: `${api}/students/applications`,
      actions: [{
        label: "Withdraw application",
        method: "DELETE",
        endpoint: `${api}/students/applications/${id}`,
        confirmMessage: "Withdraw this application? This action cannot be undone.",
      }],
    };
  }

  if (segments[0] === "students" && segments[1] === "resume" && id) {
    return {
      endpoint: `${api}/students/resume`,
      actions: [
        { label: "Set as active resume", method: "PATCH", endpoint: `${api}/students/resume/${id}` },
        {
          label: "Delete resume",
          method: "DELETE",
          endpoint: `${api}/students/resume/${id}`,
          confirmMessage: "Delete this resume permanently?",
        },
      ],
    };
  }

  if (segments[0] === "recruiters" && segments[1] === "internships" && id) {
    return {
      endpoint: `${api}/recruiters/internships`,
      actions: [
        { label: "Publish internship", method: "POST", endpoint: `${api}/recruiters/internships/${id}/publish` },
        { label: "Close internship", method: "POST", endpoint: `${api}/recruiters/internships/${id}/close` },
        {
          label: "Delete internship",
          method: "DELETE",
          endpoint: `${api}/recruiters/internships/${id}`,
          confirmMessage: "Delete this internship posting? This action cannot be undone.",
        },
      ],
    };
  }

  if (segments[0] === "investors" && segments[1] === "saved-startups" && id) {
    return {
      endpoint: `${api}/investors/saved-startups`,
      actions: [{
        label: "Remove saved startup",
        method: "DELETE",
        endpoint: `${api}/investors/saved-startups/${id}`,
        confirmMessage: "Remove this startup from your saved list?",
      }],
    };
  }

  if (segments[0] === "investors" && segments[1] === "deal-pipeline" && id) {
    return { endpoint: `${api}/investors/deal-pipeline` };
  }

  return { endpoint: `${api}${pathname}` };
}

function getDetailHref(pathname: string, id: string): string | null {
  const routes: Record<string, string> = {
    "/admin/users": "/admin/users",
    "/community/posts": "/community/posts",
    "/events": "/events",
    "/investors/deal-pipeline": "/investors/deal-pipeline",
    "/investors/saved-startups": "/investors/saved-startups",
    "/investors/startups": "/investors/startups",
    "/mentors/sessions": "/mentors/sessions",
    "/payments/invoices": "/payments/invoices",
    "/recruiters/internships": "/recruiters/internships",
    "/students/applications": "/students/applications",
    "/students/resume": "/students/resume",
    "/students/saved-internships": "/students/saved-internships",
  };
  const baseRoute = routes[pathname];
  return baseRoute ? `${baseRoute}/${id}` : null;
}

export default function ApiWorkspacePage() {
  const pathname = usePathname();
  const [data, setData] = useState<unknown>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [errorStatus, setErrorStatus] = useState<number | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [busyAction, setBusyAction] = useState("");
  const [notice, setNotice] = useState("");
  const [actionResult, setActionResult] = useState<unknown>(null);
  const [actionValues, setActionValues] = useState<Record<string, ActionValue>>({});
  const [recordSearch, setRecordSearch] = useState("");

  const title = useMemo(
    () => pathname.split("/").filter(Boolean).map(humanize).join(" / ") || "Workspace",
    [pathname],
  );
  const definition = useMemo(() => workspaceDefinition(pathname), [pathname]);
  const endpoint = definition.endpoint;

  useEffect(() => {
    let active = true;
    void apiRequest<unknown>(endpoint)
      .then((result) => {
        if (active) {
          setData(result);
          setError("");
          setErrorStatus(null);
        }
      })
      .catch((requestError: unknown) => {
        if (active) {
          setError(getErrorMessage(requestError));
          setErrorStatus(requestError instanceof ApiError ? requestError.status : null);
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [endpoint, reloadKey]);

  const records = getRecords(data);
  const filteredRecords = useMemo(() => {
    const query = recordSearch.trim().toLowerCase();
    if (!query) return records;
    return records.filter((record) => JSON.stringify(record).toLowerCase().includes(query));
  }, [records, recordSearch]);
  const isNotFound = errorStatus === 404;

  async function runAction(action: WorkspaceAction, formValues: Record<string, ActionValue>) {
    if (action.confirmMessage && !window.confirm(action.confirmMessage)) return;
    setBusyAction(action.label);
    setError("");
    setErrorStatus(null);
    setNotice("");
    try {
      const payload = action.buildPayload ? action.buildPayload(formValues) : formValues;
      const result = await apiRequest<unknown>(action.endpoint, {
        method: action.method,
        ...(action.method === "DELETE" ? {} : { body: JSON.stringify(payload) }),
      });
      setActionResult(result);
      setData(result);
      setNotice(`${action.label} completed successfully.`);
      setReloadKey((key) => key + 1);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
      setErrorStatus(requestError instanceof ApiError ? requestError.status : null);
    } finally {
      setBusyAction("");
    }
  }

  return (
    <div className="content-wrap">
      <header className="page-heading" style={{ alignItems: "center" }}>
        <div>
          <p className="eyebrow">Step-up for AI workspace</p>
          <h1 className="page-title">{title}</h1>
          <p className="page-description">View and manage the information connected to this workspace.</p>
        </div>
        <button
          className="button button-secondary"
          type="button"
          onClick={() => {
            setLoading(true);
            setReloadKey((key) => key + 1);
          }}
          disabled={loading}
        >
          {loading ? "Loading…" : "Refresh"}
        </button>
      </header>

      {error && (
        <div className="alert alert-error" role="alert">
          {error}
          {isNotFound && " This workspace does not have a matching API resource yet."}
        </div>
      )}
      {notice && <div className="alert alert-success" role="status">{notice}</div>}
      {actionResult !== null && (
        <details className="surface surface-pad" style={{ marginBottom: 16 }}>
          <summary style={{ cursor: "pointer", fontWeight: 600 }}>View response details</summary>
          <pre style={{ overflowX: "auto", whiteSpace: "pre-wrap" }}>{JSON.stringify(actionResult, null, 2)}</pre>
        </details>
      )}

      {loading ? (
        <div className="surface empty-state" aria-live="polite">Loading workspace…</div>
      ) : records.length === 0 && !error ? (
        <div className="surface empty-state">
          <h2>No records yet</h2>
          <p>Items created for this workspace will appear here.</p>
        </div>
      ) : records.length > 0 ? (
        <>
          {records.length > 3 && (
            <label className="field portal-workspace-search">
              <span className="visually-hidden">Filter this workspace</span>
              <input
                className="field-input"
                onChange={(event) => setRecordSearch(event.target.value)}
                placeholder={`Filter ${records.length} records`}
                type="search"
                value={recordSearch}
              />
            </label>
          )}
          {filteredRecords.length === 0 ? (
            <div className="surface empty-state"><h2>No matching records</h2><p>Try a different search term.</p></div>
          ) : (
        <div className="list-stack">
          {filteredRecords.map((record, index) => {
            const recordId = record._id ?? record.id;
            const detailHref = typeof recordId === "string" ? getDetailHref(pathname, recordId) : null;
            const titleValue = getRecordTitle(record, `${title} ${index + 1}`);
            const summary = getRecordSummary(record);
            const status = getRecordStatus(record);
            const summaryKey = ["description", "summary", "content", "tagline", "headline", "message"]
              .find((key) => typeof record[key] === "string" && record[key] === summary);
            const visibleEntries = Object.entries(record).filter(([key]) => key !== summaryKey && !["description", "summary", "content", "tagline", "headline", "message"].includes(key));
            return (
              <article className="surface surface-pad portal-workspace-record" key={String(recordId ?? index)}>
                <div className="portal-card-heading">
                  <div>
                    <h2 className="portal-workspace-title">{titleValue}</h2>
                    {summary && <p className="portal-workspace-summary">{summary}</p>}
                  </div>
                  {status && <span className="badge badge-blue">{status}</span>}
                </div>
                {visibleEntries.length > 0 && (
                  <details className="portal-record-details">
                    <summary>Record details</summary>
                    <dl className="detail-grid">
                      {visibleEntries.map(([key, value]) => (
                        <div className="detail-item" key={key}>
                          <dt className="field-label">{humanize(key)}</dt>
                          <dd style={{ margin: "4px 0 0", overflowWrap: "anywhere" }}>{displayValue(value)}</dd>
                        </div>
                      ))}
                    </dl>
                  </details>
                )}
                {detailHref && <p style={{ margin: "14px 0 0" }}><Link className="text-link" href={detailHref}>Open record →</Link></p>}
              </article>
            );
          })}
        </div>
          )}
        </>
      ) : null}
      {definition.actions?.map((action) => (
        <form
          className="surface surface-pad form-grid"
          key={`${action.method}:${action.endpoint}`}
          style={{ marginTop: 18 }}
          onSubmit={(event) => {
            event.preventDefault();
            void runAction(action, actionValues);
          }}
        >
          <h2 style={{ margin: 0, fontSize: 18 }}>{action.label}</h2>
          {action.fields?.map((field) => (
            <label className="field" key={field.name}>
              {field.type === "checkbox" ? (
                <span className="field-label">
                  <input
                    type="checkbox"
                    checked={Boolean(actionValues[field.name] ?? field.defaultValue ?? false)}
                    onChange={(event) => setActionValues((values) => ({ ...values, [field.name]: event.target.checked }))}
                  />{" "}
                  {field.label}
                </span>
              ) : (
                <>
                  <span className="field-label">{field.label}</span>
                  {field.type === "textarea" ? (
                    <textarea
                      className="field-textarea"
                      required={field.required}
                      value={String(actionValues[field.name] ?? field.defaultValue ?? "")}
                      onChange={(event) => setActionValues((values) => ({ ...values, [field.name]: event.target.value }))}
                    />
                  ) : field.type === "select" ? (
                    <select
                      className="field-select"
                      required={field.required}
                      value={String(actionValues[field.name] ?? field.defaultValue ?? "")}
                      onChange={(event) => setActionValues((values) => ({ ...values, [field.name]: event.target.value }))}
                    >
                      <option value="" disabled>Select an option</option>
                      {field.options?.map((option) => <option value={option.value} key={option.value}>{option.label}</option>)}
                    </select>
                  ) : (
                    <input
                      className="field-input"
                      type={field.type}
                      required={field.required}
                      value={String(actionValues[field.name] ?? field.defaultValue ?? "")}
                      onChange={(event) => setActionValues((values) => ({ ...values, [field.name]: event.target.value }))}
                    />
                  )}
                </>
              )}
              {field.helpText && <span className="help-text">{field.helpText}</span>}
            </label>
          ))}
          <div><button className="button" type="submit" disabled={Boolean(busyAction)}>{busyAction === action.label ? "Saving…" : action.label}</button></div>
        </form>
      ))}
      {data !== null && !records.length && !error && (
        <pre className="surface surface-pad" style={{ overflowX: "auto", whiteSpace: "pre-wrap" }}>
          {JSON.stringify(data, null, 2)}
        </pre>
      )}
      {error && errorStatus !== null && errorStatus >= 500 && (
        <p className="help-text">The server could not load this workspace. Try again later or contact support.</p>
      )}
    </div>
  );
}
