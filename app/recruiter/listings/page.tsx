'use client';

import Link from 'next/link';
import { useState } from 'react';

const LISTINGS = [
  { id: 1, title: 'Frontend Developer Intern', dept: 'Engineering', type: 'Remote', stipend: '₹8,000/mo', duration: '3 months', applicants: 42, status: 'Active', featured: false, posted: '2 days ago' },
  { id: 2, title: 'Data Science Intern', dept: 'Data & AI', type: 'Hybrid', stipend: '₹10,000/mo', duration: '6 months', applicants: 58, status: 'Active', featured: false, posted: '5 days ago' },
  { id: 3, title: 'UI/UX Design Intern', dept: 'Design', type: 'Remote', stipend: '₹6,000/mo', duration: '3 months', applicants: 27, status: 'Closed', featured: false, posted: '12 days ago' },
];

export default function ListingsPage() {
  const [filter, setFilter] = useState<'All' | 'Active' | 'Closed'>('All');
  const filtered = filter === 'All' ? LISTINGS : LISTINGS.filter(l => l.status === filter);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        .li-page { font-family: Inter, sans-serif; }
        .li-topbar { display: flex; align-items: center; justify-content: space-between; margin-bottom: 28px; flex-wrap: wrap; gap: 14px; }
        .li-title { font-size: 26px; font-weight: 800; color: #e8faf0; letter-spacing: -.02em; }
        .li-sub { font-size: 13px; color: #4a8a5e; margin-top: 4px; }
        .li-post-btn { padding: 12px 22px; border-radius: 12px; background: linear-gradient(135deg, #2fbf64, #1a9e4a); color: #fff; font: 700 13px Inter; text-decoration: none; transition: all .2s; box-shadow: 0 8px 20px rgba(47,191,100,.35); white-space: nowrap; display: inline-flex; align-items: center; gap: 7px; }
        .li-post-btn:hover { transform: translateY(-2px); box-shadow: 0 12px 28px rgba(47,191,100,.48); }

        .li-filters { display: flex; gap: 8px; margin-bottom: 22px; }
        .li-filter-btn { padding: 8px 18px; border-radius: 10px; background: rgba(255,255,255,.04); border: 1px solid rgba(47,191,100,.15); color: #4a8a5e; font: 600 13px Inter; cursor: pointer; transition: all .15s; }
        .li-filter-btn.active { background: rgba(47,191,100,.18); border-color: rgba(47,191,100,.4); color: #6ee09c; }
        .li-filter-btn:hover:not(.active) { color: #d4f5e2; border-color: rgba(47,191,100,.25); }
        .li-grid { display: flex; flex-direction: column; gap: 16px; }
        .li-card { background: linear-gradient(145deg, rgba(4,18,8,.9), rgba(2,12,5,.9)); border: 1px solid rgba(47,191,100,.15); border-radius: 18px; padding: 24px; display: flex; align-items: center; gap: 20px; transition: all .2s; }
        .li-card:hover { border-color: rgba(47,191,100,.35); transform: translateY(-2px); box-shadow: 0 12px 30px rgba(0,0,0,.3); }
        .li-icon { width: 52px; height: 52px; border-radius: 14px; background: linear-gradient(135deg, rgba(47,191,100,.2), rgba(26,158,74,.15)); border: 1px solid rgba(47,191,100,.2); display: grid; place-items: center; font-size: 22px; flex-shrink: 0; }
        .li-info { flex: 1; min-width: 0; }
        .li-job-title { font-size: 15.5px; font-weight: 700; color: #e8faf0; margin-bottom: 6px; }
        .li-tags { display: flex; flex-wrap: wrap; gap: 7px; }
        .li-tag { font-size: 11.5px; font-weight: 600; padding: 3px 10px; border-radius: 7px; background: rgba(47,191,100,.1); border: 1px solid rgba(47,191,100,.2); color: #6ee09c; }
        .li-meta { display: flex; align-items: center; gap: 20px; flex-shrink: 0; text-align: right; }
        .li-applicants { font-size: 22px; font-weight: 800; color: #2fbf64; }
        .li-applicants-label { font-size: 11px; color: #4a8a5e; }
        .li-status { font-size: 11.5px; font-weight: 700; padding: 4px 12px; border-radius: 20px; }
        .li-status.active { background: rgba(34,197,94,.15); color: #86efac; border: 1px solid rgba(34,197,94,.25); }
        .li-status.closed { background: rgba(107,114,128,.1); color: #9ca3af; border: 1px solid rgba(107,114,128,.2); }
        .li-actions { display: flex; gap: 8px; flex-shrink: 0; }
        .li-action-btn { padding: 8px 14px; border-radius: 9px; font: 600 12px Inter; cursor: pointer; transition: all .15s; border: 1px solid; }
        .li-action-btn.edit { background: rgba(47,191,100,.1); border-color: rgba(47,191,100,.25); color: #6ee09c; }
        .li-action-btn.edit:hover { background: rgba(47,191,100,.2); }
        .li-action-btn.del { background: rgba(239,68,68,.07); border-color: rgba(239,68,68,.2); color: #f87171; }
        .li-action-btn.del:hover { background: rgba(239,68,68,.15); }
        .li-posted { font-size: 11px; color: #2e5040; margin-top: 5px; }
        .li-empty { text-align: center; padding: 80px 0; color: #2e5040; }
        .li-empty-icon { font-size: 52px; margin-bottom: 16px; }
        .li-empty h3 { font-size: 18px; color: #4a8a5e; margin-bottom: 8px; }
        .li-empty p { font-size: 13px; }
        @media (max-width: 700px) { .li-card { flex-direction: column; align-items: flex-start; } .li-meta { flex-direction: row; text-align: left; } }
      `}</style>
      <div className="li-page">
        <div className="li-topbar">
          <div>
            <h1 className="li-title">Internship Listings</h1>
            <p className="li-sub">Manage your internship postings and track applicants.</p>
          </div>
          <Link href="/recruiter/listings/new" className="li-post-btn">
             Post New Listing
          </Link>
        </div>

        {/* Filters */}
        <div className="li-filters">
          {(['All', 'Active', 'Closed'] as const).map((f) => (
            <button key={f} className={`li-filter-btn${filter === f ? ' active' : ''}`} onClick={() => setFilter(f)}>
              {f}
            </button>
          ))}
        </div>

        {/* Listings */}
        <div className="li-grid">
          {filtered.length === 0 ? (
            <div className="li-empty">
              <div className="li-empty-icon"></div>
              <h3>No listings found</h3>
              <p>Post your first internship to start getting applicants.</p>
            </div>
          ) : (
            filtered.map((l) => (
              <div className="li-card" key={l.id}>
                <div className="li-icon"></div>
                <div className="li-info">
                  <div className="li-job-title">{l.title}</div>
                  <div className="li-tags">
                    <span className="li-tag">{l.dept}</span>
                    <span className="li-tag">{l.type}</span>
                    <span className="li-tag">{l.stipend}</span>
                    <span className="li-tag">{l.duration}</span>
                  </div>
                  <div className="li-posted">Posted {l.posted}</div>
                </div>
                <div className="li-meta">
                  <div>
                    <div className="li-applicants">{l.applicants}</div>
                    <div className="li-applicants-label">Applicants</div>
                  </div>
                  <div>
                    <span className={`li-status ${l.status.toLowerCase()}`}>{l.status}</span>
                  </div>
                </div>
                <div className="li-actions">
                  <button className="li-action-btn edit"> Edit</button>
                  <button className="li-action-btn del"></button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
