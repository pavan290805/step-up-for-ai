'use client';

import { useState } from 'react';
import Link from 'next/link';

const CANDIDATES = [
  { id: 1, name: 'Arjun Sharma', role: 'Frontend Developer', location: 'Hyderabad', skills: ['React', 'TypeScript', 'CSS'], gpa: '8.7', college: 'BITS Pilani', avatar: 'A', downloaded: false },
  { id: 2, name: 'Priya Mehta', role: 'Data Scientist', location: 'Bangalore', skills: ['Python', 'ML', 'SQL'], gpa: '9.1', college: 'IIT Bombay', avatar: 'P', downloaded: true },
  { id: 3, name: 'Rohan Gupta', role: 'Backend Developer', location: 'Pune', skills: ['Node.js', 'PostgreSQL', 'Docker'], gpa: '8.4', college: 'VIT Vellore', avatar: 'R', downloaded: false },
  { id: 4, name: 'Sneha Nair', role: 'UI/UX Designer', location: 'Chennai', skills: ['Figma', 'Prototyping', 'CSS'], gpa: '8.9', college: 'NIT Trichy', avatar: 'S', downloaded: true },
  { id: 5, name: 'Karan Patel', role: 'Full Stack Developer', location: 'Mumbai', skills: ['Next.js', 'MongoDB', 'AWS'], gpa: '8.2', college: 'IIIT Hyderabad', avatar: 'K', downloaded: false },
];

const FREE_LIMIT = 5;

export default function CandidatesPage() {
  const [downloadsUsed, setDownloadsUsed] = useState(2);
  const [search, setSearch] = useState('');

  const filtered = CANDIDATES.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.role.toLowerCase().includes(search.toLowerCase()) ||
    c.skills.some(s => s.toLowerCase().includes(search.toLowerCase()))
  );

  const handleDownload = () => {
    if (downloadsUsed < FREE_LIMIT) setDownloadsUsed(d => d + 1);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        .cd-page { font-family: Inter, sans-serif; }
        .cd-topbar { display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 24px; flex-wrap: wrap; gap: 14px; }
        .cd-title { font-size: 26px; font-weight: 800; color: #e8faf0; letter-spacing: -.02em; }
        .cd-sub { font-size: 13px; color: #4a8a5e; margin-top: 4px; }
        .cd-search { position: relative; }
        .cd-search-input { padding: 11px 16px 11px 42px; border-radius: 12px; background: rgba(255,255,255,.04); border: 1px solid rgba(47,191,100,.18); color: #e8faf0; font: 500 13.5px Inter; outline: none; width: 260px; transition: all .2s; }
        .cd-search-input::placeholder { color: #2e5040; }
        .cd-search-input:focus { border-color: rgba(47,191,100,.5); box-shadow: 0 0 0 4px rgba(47,191,100,.1); }
        .cd-search-icon { position: absolute; left: 13px; top: 50%; transform: translateY(-50%); color: #2e5040; font-size: 14px; }
        .cd-limit-bar { background: rgba(255,255,255,.04); border: 1px solid rgba(47,191,100,.15); border-radius: 14px; padding: 14px 20px; margin-bottom: 22px; display: flex; align-items: center; gap: 16px; }
        .cd-limit-info { flex: 1; }
        .cd-limit-label { font-size: 13px; font-weight: 600; color: #d4f5e2; margin-bottom: 8px; }
        .cd-limit-track { height: 6px; border-radius: 99px; background: rgba(255,255,255,.08); overflow: hidden; }
        .cd-limit-fill { height: 100%; border-radius: 99px; background: linear-gradient(90deg, #2fbf64, #1a9e4a); transition: width .4s; }
        .cd-limit-sub { font-size: 11px; color: #4a8a5e; margin-top: 5px; }
        .cd-limit-upgrade { padding: 9px 18px; border-radius: 10px; background: linear-gradient(135deg, #2fbf64, #1a9e4a); color: #fff; font: 700 12px Inter; text-decoration: none; white-space: nowrap; transition: all .2s; }
        .cd-limit-upgrade:hover { transform: translateY(-1px); }
        .cd-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(310px, 1fr)); gap: 18px; }
        .cd-card { background: linear-gradient(145deg, rgba(4,18,8,.9), rgba(2,12,5,.9)); border: 1px solid rgba(47,191,100,.15); border-radius: 20px; padding: 24px; transition: all .2s; }
        .cd-card:hover { border-color: rgba(47,191,100,.35); transform: translateY(-4px); box-shadow: 0 16px 40px rgba(0,0,0,.35); }
        .cd-card-top { display: flex; align-items: center; gap: 14px; margin-bottom: 16px; }
        .cd-avatar { width: 48px; height: 48px; border-radius: 14px; background: linear-gradient(135deg, #2fbf64, #1a9e4a); display: grid; place-items: center; font-size: 18px; font-weight: 700; color: #fff; flex-shrink: 0; }
        .cd-name { font-size: 15px; font-weight: 700; color: #e8faf0; }
        .cd-role { font-size: 12px; color: #5cb87a; margin-top: 2px; }
        .cd-location { font-size: 11.5px; color: #3d6b52; }
        .cd-divider { height: 1px; background: rgba(47,191,100,.08); margin: 14px 0; }
        .cd-stats-row { display: flex; gap: 20px; margin-bottom: 14px; }
        .cd-stat { }
        .cd-stat-val { font-size: 16px; font-weight: 700; color: #2fbf64; }
        .cd-stat-label { font-size: 11px; color: #3d6b52; margin-top: 2px; }
        .cd-skills { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 16px; }
        .cd-skill { font-size: 11px; font-weight: 600; padding: 3px 10px; border-radius: 7px; background: rgba(47,191,100,.1); border: 1px solid rgba(47,191,100,.2); color: #6ee09c; }
        .cd-btn-row { display: flex; gap: 8px; }
        .cd-view-btn { flex: 1; padding: 9px; border-radius: 10px; border: 1px solid rgba(47,191,100,.25); background: rgba(47,191,100,.08); color: #6ee09c; font: 600 12px Inter; cursor: pointer; transition: all .15s; }
        .cd-view-btn:hover { background: rgba(47,191,100,.18); }
        .cd-dl-btn { flex: 1; padding: 9px; border-radius: 10px; border: none; background: linear-gradient(135deg, #2fbf64, #1a9e4a); color: #fff; font: 700 12px Inter; cursor: pointer; transition: all .15s; display: flex; align-items: center; justify-content: center; gap: 5px; }
        .cd-dl-btn:hover:not(:disabled) { transform: translateY(-1px); }
        .cd-dl-btn:disabled { opacity: .5; cursor: not-allowed; }
        .cd-dl-btn.downloaded { background: linear-gradient(135deg, rgba(34,197,94,.6), rgba(22,163,74,.6)); }
        @media (max-width: 600px) { .cd-search-input { width: 100%; } }
      `}</style>
      <div className="cd-page">
        <div className="cd-topbar">
          <div>
            <h1 className="cd-title">Candidate Pool</h1>
            <p className="cd-sub">Browse and download resumes from our verified talent pool.</p>
          </div>
          <div className="cd-search">
            <span className="cd-search-icon">🔍</span>
            <input
              className="cd-search-input"
              type="text"
              placeholder="Search by name, role, skill..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Download limit */}
        <div className="cd-limit-bar">
          <div className="cd-limit-info">
            <div className="cd-limit-label">Resume Downloads — {downloadsUsed}/{FREE_LIMIT} used</div>
            <div className="cd-limit-track">
              <div className="cd-limit-fill" style={{ width: `${(downloadsUsed / FREE_LIMIT) * 100}%` }} />
            </div>
            <div className="cd-limit-sub">Upgrade to Premium for unlimited resume downloads.</div>
          </div>
          <Link href="/recruiter/pricing" className="cd-limit-upgrade">Upgrade →</Link>
        </div>

        {/* Cards */}
        <div className="cd-grid">
          {filtered.map(c => (
            <div className="cd-card" key={c.id}>
              <div className="cd-card-top">
                <div className="cd-avatar">{c.avatar}</div>
                <div>
                  <div className="cd-name">{c.name}</div>
                  <div className="cd-role">{c.role}</div>
                  <div className="cd-location">📍 {c.location}</div>
                </div>
              </div>
              <div className="cd-divider" />
              <div className="cd-stats-row">
                <div className="cd-stat">
                  <div className="cd-stat-val">{c.gpa}</div>
                  <div className="cd-stat-label">GPA / CGPA</div>
                </div>
                <div className="cd-stat">
                  <div className="cd-stat-val" style={{ fontSize: 13, paddingTop: 2 }}>{c.college}</div>
                  <div className="cd-stat-label">College</div>
                </div>
              </div>
              <div className="cd-skills">
                {c.skills.map(s => <span key={s} className="cd-skill">{s}</span>)}
              </div>
              <div className="cd-btn-row">
                <button className="cd-view-btn">👁 View Profile</button>
                <button
                  className={`cd-dl-btn${c.downloaded ? ' downloaded' : ''}`}
                  onClick={handleDownload}
                  disabled={downloadsUsed >= FREE_LIMIT && !c.downloaded}
                >
                  {c.downloaded ? '✓ Downloaded' : '📄 Resume'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
