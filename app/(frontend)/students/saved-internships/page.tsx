"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { apiRequest, getErrorMessage } from "../../_lib/api";

type SavedInternship = string | { _id: string; title?: string; location?: string; type?: string };

function savedId(saved: SavedInternship): string {
  return typeof saved === "string" ? saved : saved._id;
}

export default function SavedInternshipsPage() {
  const [saved, setSaved] = useState<SavedInternship[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const result = await apiRequest<SavedInternship[]>("/api/v1/students/saved-internships");
      setSaved(result);
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void Promise.resolve().then(load); }, [load]);

  const remove = async (id: string) => {
    setError("");
    try {
      await apiRequest(`/api/v1/students/saved-internships/${id}`, { method: "DELETE" });
      await load();
    } catch (requestError) {
      setError(getErrorMessage(requestError));
    }
  };

  return (
    <div className="content-wrap">
      <header className="page-heading"><div><p className="eyebrow">Job search</p><h1 className="page-title">Saved opportunities</h1><p className="page-description">Keep interesting roles close while you prepare an application.</p></div><Link className="button" href="/students/internships">Browse internships</Link></header>
      {error && <div className="alert alert-error" role="alert" style={{ marginBottom: 14 }}>{error}</div>}
      {loading ? <div className="surface empty-state">Loading saved opportunities…</div> : saved.length === 0 ? (
        <div className="surface empty-state"><h2>No saved opportunities</h2><p>Save a role from its details page to find it here later.</p><Link className="button" href="/students/internships">Explore opportunities</Link></div>
      ) : (
        <div className="list-stack">
          {saved.map((item) => {
            const id = savedId(item);
            return <article className="list-row" key={id}><div><h2 className="list-title">{typeof item === "string" ? "Saved opportunity" : item.title || "Saved opportunity"}</h2>{typeof item !== "string" && <div className="list-meta"><span>{item.location}</span><span>{item.type}</span></div>}<p style={{ marginBottom: 0, marginTop: 9 }}><Link className="text-link" href={`/students/internships/${id}`}>View opportunity</Link></p></div><button className="button button-secondary" onClick={() => void remove(id)}>Remove saved role</button></article>;
          })}
        </div>
      )}
    </div>
  );
}
