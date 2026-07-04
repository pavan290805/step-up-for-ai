'use client';

import Link from 'next/link';

const STATS = [
  { label: 'Active Listings', value: '3', sub: 'Unlimited listings', icon: '📋', accent: '#2fbf64' },
  { label: 'Total Applicants', value: '127', sub: '+18 this week', icon: '👥', accent: '#818cf8' },
  { label: 'Resume Downloads', value: '5', sub: 'Unlimited downloads', icon: '📄', accent: '#6ee09c' },
  { label: 'Interview Scheduled', value: '4', sub: 'This month', icon: '📅', accent: '#a78bfa' },
];

const RECENT_APPLICANTS = [
  { name: 'Arjun Sharma', role: 'Frontend Developer Intern', status: 'New', time: '2h ago', avatar: 'A' },
  { name: 'Priya Mehta', role: 'Data Science Intern', status: 'Reviewed', time: '5h ago', avatar: 'P' },
  { name: 'Rohan Gupta', role: 'Backend Developer Intern', status: 'Interview', time: '1d ago', avatar: 'R' },
  { name: 'Sneha Nair', role: 'UI/UX Design Intern', status: 'Offer', time: '2d ago', avatar: 'S' },
];

const STATUS_COLORS: Record<string, string> = {
  New: 'rgba(47,191,100,.2)',
  Reviewed: 'rgba(59,130,246,.2)',
  Interview: 'rgba(245,158,11,.2)',
  Offer: 'rgba(34,197,94,.2)',
};

const STATUS_TEXT: Record<string, string> = {
  New: '#6ee09c',
  Reviewed: '#93c5fd',
  Interview: '#fbbf24',
  Offer: '#86efac',
};

const QUICK_ACTIONS = [
  { label: 'Post New Listing', href: '/recruiter/listings/new', icon: '➕', sub: 'Add a new internship' },
  { label: 'View Candidates', href: '/recruiter/candidates', icon: '👤', sub: 'Browse talent pool' },
  { label: 'Track Applicants', href: '/recruiter/applicants', icon: '📊', sub: 'Manage pipeline' },
  { label: 'AI Ranking', href: '/recruiter/ai-ranking', icon: '🤖', sub: 'AI-powered candidate scores' },
  { label: 'Smart Matching', href: '/recruiter/matching', icon: '🎯', sub: 'Match candidates to roles' },
];

export default function RecruiterDashboard() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        .dash-page { font-family: Inter, sans-serif; }
        .dash-header { margin-bottom: 36px; }
        .dash-greeting { font-size: 28px; font-weight: 800; color: #e8faf0; letter-spacing: -.02em; }
        .dash-greeting span { color: #2fbf64; }
        .dash-sub { color: #4a8a5e; font-size: 14px; margin-top: 6px; }
        .dash-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 36px; }
        .stat-card { background: linear-gradient(145deg, rgba(4,18,8,.9), rgba(2,12,5,.9)); border: 1px solid rgba(47,191,100,.15); border-radius: 20px; padding: 24px; position: relative; overflow: hidden; transition: border-color .2s, transform .2s; }
        .stat-card:hover { border-color: rgba(47,191,100,.35); transform: translateY(-3px); }
        .stat-glow { position: absolute; top: -30px; right: -30px; width: 100px; height: 100px; border-radius: 50%; opacity: .15; pointer-events: none; }
        .stat-icon { font-size: 26px; margin-bottom: 14px; }
        .stat-value { font-size: 34px; font-weight: 800; color: #e8faf0; letter-spacing: -.02em; margin-bottom: 4px; }
        .stat-label { font-size: 13px; font-weight: 600; color: #5cb87a; }
        .stat-sub { font-size: 11.5px; color: #3d6b52; margin-top: 4px; }
        .dash-grid { display: grid; grid-template-columns: 1fr 360px; gap: 24px; margin-bottom: 28px; }
        .dash-panel { background: linear-gradient(145deg, rgba(4,18,8,.9), rgba(2,12,5,.9)); border: 1px solid rgba(47,191,100,.15); border-radius: 20px; padding: 28px; }
        .panel-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 22px; }
        .panel-title { font-size: 16px; font-weight: 700; color: #e8faf0; }
        .panel-link { font-size: 12px; color: #2fbf64; text-decoration: none; font-weight: 600; }
        .panel-link:hover { text-decoration: underline; }
        .applicant-row { display: flex; align-items: center; gap: 14px; padding: 12px 0; border-bottom: 1px solid rgba(47,191,100,.08); }
        .applicant-row:last-child { border-bottom: none; }
        .a-avatar { width: 38px; height: 38px; border-radius: 12px; background: linear-gradient(135deg, #2fbf64, #1a9e4a); display: grid; place-items: center; font-size: 14px; font-weight: 700; color: #fff; flex-shrink: 0; }
        .a-info { flex: 1; min-width: 0; }
        .a-name { font-size: 13.5px; font-weight: 600; color: #d4f5e2; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .a-role { font-size: 11.5px; color: #4a8a5e; margin-top: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .a-right { text-align: right; flex-shrink: 0; }
        .a-status { font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: 20px; }
        .a-time { font-size: 11px; color: #3d6b52; margin-top: 4px; }
        .quick-actions { display: flex; flex-direction: column; gap: 12px; }
        .qa-card { display: flex; align-items: center; gap: 14px; padding: 14px; border-radius: 14px; background: rgba(47,191,100,.06); border: 1px solid rgba(47,191,100,.12); text-decoration: none; transition: all .18s; cursor: pointer; }
        .qa-card:hover { background: rgba(47,191,100,.12); border-color: rgba(47,191,100,.3); transform: translateX(4px); }
        .qa-card.highlight { background: linear-gradient(135deg, rgba(47,191,100,.2), rgba(26,158,74,.15)); border-color: rgba(47,191,100,.4); }
        .qa-card.highlight:hover { background: linear-gradient(135deg, rgba(47,191,100,.28), rgba(26,158,74,.22)); }
        .qa-icon { font-size: 22px; flex-shrink: 0; }
        .qa-text { }
        .qa-label { font-size: 13.5px; font-weight: 600; color: #d4f5e2; }
        .qa-sub { font-size: 11.5px; color: #4a8a5e; margin-top: 2px; }
        .upgrade-banner { display: none; }
        @media (max-width: 1100px) { .dash-stats { grid-template-columns: repeat(2,1fr); } }
        @media (max-width: 800px) { .dash-grid { grid-template-columns: 1fr; } }
        @media (max-width: 540px) { .dash-stats { grid-template-columns: 1fr 1fr; } .upgrade-banner { flex-direction: column; } }
      `}</style>
      <div className="dash-page">
        <div className="dash-header">
          <h1 className="dash-greeting">Good morning, <span>Recruiter</span> 👋</h1>
          <p className="dash-sub">Here's what's happening with your hiring pipeline today.</p>
        </div>

        {/* Stats */}
        <div className="dash-stats">
          {STATS.map((s) => (
            <div className="stat-card" key={s.label}>
              <div className="stat-glow" style={{ background: s.accent }} />
              <div className="stat-icon">{s.icon}</div>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
              <div className="stat-sub">{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Main grid */}
        <div className="dash-grid">
          {/* Recent applicants */}
          <div className="dash-panel">
            <div className="panel-head">
              <span className="panel-title">Recent Applicants</span>
              <Link href="/recruiter/applicants" className="panel-link">View all →</Link>
            </div>
            {RECENT_APPLICANTS.map((a) => (
              <div className="applicant-row" key={a.name}>
                <div className="a-avatar">{a.avatar}</div>
                <div className="a-info">
                  <div className="a-name">{a.name}</div>
                  <div className="a-role">{a.role}</div>
                </div>
                <div className="a-right">
                  <span className="a-status" style={{ background: STATUS_COLORS[a.status], color: STATUS_TEXT[a.status] }}>
                    {a.status}
                  </span>
                  <div className="a-time">{a.time}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick actions */}
          <div className="dash-panel">
            <div className="panel-head">
              <span className="panel-title">Quick Actions</span>
            </div>
            <div className="quick-actions">
              {QUICK_ACTIONS.map((qa) => (
                <Link href={qa.href} key={qa.label} className={`qa-card${qa.highlight ? ' highlight' : ''}`}>
                  <span className="qa-icon">{qa.icon}</span>
                  <div className="qa-text">
                    <div className="qa-label">{qa.label}</div>
                    <div className="qa-sub">{qa.sub}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
