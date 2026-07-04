'use client';

import Link from 'next/link';

function StatIcon({ type }: { type: string }) {
  const s = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  return (
    <svg viewBox="0 0 24 24" width={24} height={24}>
      {type === 'listings' && <><rect x="3" y="4" width="18" height="17" rx="2" {...s} /><path d="M8 2v4M16 2v4M3 10h18M8 14h2M14 14h2M8 18h2" {...s} /></>}
      {type === 'applicants' && <><circle cx="9" cy="7" r="3" {...s} /><path d="M3 21v-1a6 6 0 0 1 6-6h.5" {...s} /><circle cx="17" cy="11" r="3" {...s} /><path d="M21 21v-1a6 6 0 0 0-6-6h-.5" {...s} /></>}
      {type === 'downloads' && <><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" {...s} /><path d="M7 10l5 5 5-5" {...s} /><path d="M12 15V3" {...s} /></>}
      {type === 'interviews' && <><rect x="3" y="4" width="18" height="18" rx="2" {...s} /><path d="M16 2v4M8 2v4M3 10h18" {...s} /></>}
    </svg>
  );
}

const STATS = [
  { label: 'Active Listings', value: '3', sub: 'Unlimited listings', iconType: 'listings', accent: '#a855f7' },
  { label: 'Total Applicants', value: '127', sub: '+18 this week', iconType: 'applicants', accent: '#818cf8' },
  { label: 'Resume Downloads', value: '5', sub: 'Unlimited downloads', iconType: 'downloads', accent: '#c084fc' },
  { label: 'Interviews Scheduled', value: '4', sub: 'This month', iconType: 'interviews', accent: '#a78bfa' },
];

const RECENT_APPLICANTS = [
  { name: 'Arjun Sharma', role: 'Frontend Developer Intern', status: 'New', time: '2h ago', avatar: 'A' },
  { name: 'Priya Mehta', role: 'Data Science Intern', status: 'Reviewed', time: '5h ago', avatar: 'P' },
  { name: 'Rohan Gupta', role: 'Backend Developer Intern', status: 'Interview', time: '1d ago', avatar: 'R' },
  { name: 'Sneha Nair', role: 'UI/UX Design Intern', status: 'Offer', time: '2d ago', avatar: 'S' },
];

const STATUS_COLORS: Record<string, string> = {
  New: 'rgba(168, 85, 247,.2)',
  Reviewed: 'rgba(59,130,246,.2)',
  Interview: 'rgba(245,158,11,.2)',
  Offer: 'rgba(168, 85, 247,.2)',
};

const STATUS_TEXT: Record<string, string> = {
  New: '#c084fc',
  Reviewed: '#93c5fd',
  Interview: '#fbbf24',
  Offer: '#86efac',
};

const QUICK_ACTIONS = [
  { label: 'Post New Listing', href: '/recruiter/listings/new', sub: 'Add a new internship' },
  { label: 'View Candidates', href: '/recruiter/candidates', sub: 'Browse talent pool' },
  { label: 'Track Applicants', href: '/recruiter/applicants', sub: 'Manage pipeline' },
  { label: 'AI Ranking', href: '/recruiter/ai-ranking', sub: 'AI-powered candidate scores' },
  { label: 'Smart Matching', href: '/recruiter/matching', sub: 'Match candidates to roles' },
];

export default function RecruiterDashboard() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        .dash-page { font-family: Inter, sans-serif; }
        .dash-header { margin-bottom: 36px; }
        .dash-greeting { font-size: 28px; font-weight: 800; color: #f1eeff; letter-spacing: -.02em; }
        .dash-greeting span { color: #a855f7; }
        .dash-sub { color: #7c6d9e; font-size: 14px; margin-top: 6px; }
        .dash-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; margin-bottom: 36px; }
        .stat-card { background: linear-gradient(145deg, rgba(8,26,14,.85), rgba(5,15,7,.9)); border: 1px solid rgba(168, 85, 247,.12); border-radius: 18px; padding: 24px; position: relative; overflow: hidden; transition: border-color .2s, transform .2s; }
        .stat-card:hover { border-color: rgba(168, 85, 247,.3); transform: translateY(-3px); }
        .stat-glow { position: absolute; top: -30px; right: -30px; width: 100px; height: 100px; border-radius: 50%; opacity: .12; pointer-events: none; }
        .stat-icon-wrap { width: 44px; height: 44px; border-radius: 12px; display: grid; place-items: center; margin-bottom: 16px; }
        .stat-value { font-size: 34px; font-weight: 800; color: #f1eeff; letter-spacing: -.02em; margin-bottom: 4px; }
        .stat-label { font-size: 13px; font-weight: 600; color: #9d7ec7; }
        .stat-sub { font-size: 11.5px; color: #6b5d85; margin-top: 4px; }
        .dash-grid { display: grid; grid-template-columns: 1fr 360px; gap: 24px; margin-bottom: 28px; }
        .dash-panel { background: linear-gradient(145deg, rgba(8,26,14,.85), rgba(5,15,7,.9)); border: 1px solid rgba(168, 85, 247,.12); border-radius: 18px; padding: 28px; }
        .panel-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 22px; }
        .panel-title { font-size: 16px; font-weight: 700; color: #f1eeff; }
        .panel-link { font-size: 12px; color: #a855f7; text-decoration: none; font-weight: 600; transition: color .15s; }
        .panel-link:hover { color: #c084fc; }
        .applicant-row { display: flex; align-items: center; gap: 14px; padding: 12px 0; border-bottom: 1px solid rgba(168, 85, 247,.06); }
        .applicant-row:last-child { border-bottom: none; }
        .a-avatar { width: 38px; height: 38px; border-radius: 12px; background: linear-gradient(135deg, #a855f7, #7c3aed); display: grid; place-items: center; font-size: 14px; font-weight: 700; color: #fff; flex-shrink: 0; }
        .a-info { flex: 1; min-width: 0; }
        .a-name { font-size: 13.5px; font-weight: 600; color: #e2d9ff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .a-role { font-size: 11.5px; color: #7c6d9e; margin-top: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .a-right { text-align: right; flex-shrink: 0; }
        .a-status { font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: 20px; }
        .a-time { font-size: 11px; color: #6b5d85; margin-top: 4px; }
        .quick-actions { display: flex; flex-direction: column; gap: 8px; }
        .qa-card { display: flex; align-items: center; gap: 14px; padding: 14px; border-radius: 12px; background: rgba(168, 85, 247,.04); border: 1px solid rgba(168, 85, 247,.1); text-decoration: none; transition: all .18s; cursor: pointer; }
        .qa-card:hover { background: rgba(168, 85, 247,.1); border-color: rgba(168, 85, 247,.25); transform: translateX(3px); }
        .qa-arrow { color: #6b5d85; transition: color .15s; font-size: 16px; margin-left: auto; }
        .qa-card:hover .qa-arrow { color: #a855f7; }
        .qa-label { font-size: 13.5px; font-weight: 600; color: #e2d9ff; }
        .qa-sub { font-size: 11.5px; color: #7c6d9e; margin-top: 2px; }
        @media (max-width: 1100px) { .dash-stats { grid-template-columns: repeat(2,1fr); } }
        @media (max-width: 800px) { .dash-grid { grid-template-columns: 1fr; } }
        @media (max-width: 540px) { .dash-stats { grid-template-columns: 1fr 1fr; } }
      `}</style>
      <div className="dash-page">
        <div className="dash-header">
          <h1 className="dash-greeting">Welcome back, <span>Recruiter</span></h1>
          <p className="dash-sub">Here&apos;s what&apos;s happening with your hiring pipeline today.</p>
        </div>

        <div className="dash-stats">
          {STATS.map((s) => (
            <div className="stat-card" key={s.label}>
              <div className="stat-glow" style={{ background: s.accent }} />
              <div className="stat-icon-wrap" style={{ background: `${s.accent}18`, color: s.accent }}>
                <StatIcon type={s.iconType} />
              </div>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
              <div className="stat-sub">{s.sub}</div>
            </div>
          ))}
        </div>

        <div className="dash-grid">
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

          <div className="dash-panel">
            <div className="panel-head">
              <span className="panel-title">Quick Actions</span>
            </div>
            <div className="quick-actions">
              {QUICK_ACTIONS.map((qa) => (
                <Link href={qa.href} key={qa.label} className="qa-card">
                  <div>
                    <div className="qa-label">{qa.label}</div>
                    <div className="qa-sub">{qa.sub}</div>
                  </div>
                  <span className="qa-arrow">→</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
