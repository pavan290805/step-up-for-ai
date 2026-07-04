'use client';

import { useState } from 'react';

type Stage = 'Applied' | 'Reviewed' | 'Interview' | 'Offer' | 'Hired' | 'Rejected';

interface Applicant {
  id: number;
  name: string;
  role: string;
  avatar: string;
  stage: Stage;
  applied: string;
  match: number;
}

const INITIAL: Applicant[] = [
  { id: 1, name: 'Arjun Sharma', role: 'Frontend Dev Intern', avatar: 'A', stage: 'Applied', applied: '2h ago', match: 87 },
  { id: 2, name: 'Priya Mehta', role: 'Data Science Intern', avatar: 'P', stage: 'Reviewed', applied: '5h ago', match: 92 },
  { id: 3, name: 'Rohan Gupta', role: 'Backend Dev Intern', avatar: 'R', stage: 'Interview', applied: '1d ago', match: 79 },
  { id: 4, name: 'Sneha Nair', role: 'UI/UX Design Intern', avatar: 'S', stage: 'Offer', applied: '2d ago', match: 95 },
  { id: 5, name: 'Karan Patel', role: 'Full Stack Intern', avatar: 'K', stage: 'Applied', applied: '3d ago', match: 83 },
  { id: 6, name: 'Meera Iyer', role: 'ML Research Intern', avatar: 'M', stage: 'Hired', applied: '1w ago', match: 98 },
  { id: 7, name: 'Vikram Singh', role: 'Frontend Dev Intern', avatar: 'V', stage: 'Rejected', applied: '1w ago', match: 54 },
];

const STAGES: Stage[] = ['Applied', 'Reviewed', 'Interview', 'Offer', 'Hired', 'Rejected'];

const STAGE_COLORS: Record<Stage, { bg: string; border: string; text: string; head: string }> = {
  Applied: { bg: 'rgba(99,102,241,.1)', border: 'rgba(99,102,241,.25)', text: '#a5b4fc', head: '#6366f1' },
  Reviewed: { bg: 'rgba(59,130,246,.1)', border: 'rgba(59,130,246,.25)', text: '#93c5fd', head: '#3b82f6' },
  Interview: { bg: 'rgba(245,158,11,.1)', border: 'rgba(245,158,11,.25)', text: '#fbbf24', head: '#f59e0b' },
  Offer: { bg: 'rgba(47,191,100,.12)', border: 'rgba(47,191,100,.3)', text: '#6ee09c', head: '#2fbf64' },
  Hired: { bg: 'rgba(34,197,94,.1)', border: 'rgba(34,197,94,.25)', text: '#86efac', head: '#22c55e' },
  Rejected: { bg: 'rgba(239,68,68,.07)', border: 'rgba(239,68,68,.18)', text: '#fca5a5', head: '#ef4444' },
};

export default function ApplicantsPage() {
  const [applicants, setApplicants] = useState<Applicant[]>(INITIAL);
  const [selected, setSelected] = useState<number | null>(null);

  const move = (id: number, dir: 'forward' | 'back') => {
    setApplicants(prev => prev.map(a => {
      if (a.id !== id) return a;
      const idx = STAGES.indexOf(a.stage);
      const next = dir === 'forward' ? idx + 1 : idx - 1;
      if (next < 0 || next >= STAGES.length) return a;
      return { ...a, stage: STAGES[next] };
    }));
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        .ap-page { font-family: Inter, sans-serif; }
        .ap-header { margin-bottom: 28px; }
        .ap-title { font-size: 26px; font-weight: 800; color: #e8faf0; letter-spacing: -.02em; }
        .ap-sub { font-size: 13px; color: #4a8a5e; margin-top: 4px; }
        .ap-premium-note { display: inline-flex; align-items: center; gap: 7px; margin-top: 10px; padding: 6px 14px; border-radius: 99px; background: rgba(47,191,100,.1); border: 1px solid rgba(47,191,100,.25); font-size: 12px; color: #6ee09c; font-weight: 600; }
        .ap-board { display: flex; gap: 16px; overflow-x: auto; padding-bottom: 12px; }
        .ap-col { min-width: 210px; flex-shrink: 0; display: flex; flex-direction: column; gap: 0; }
        .ap-col-head { padding: 12px 14px; border-radius: 12px 12px 0 0; display: flex; align-items: center; justify-content: space-between; }
        .ap-col-name { font-size: 12px; font-weight: 700; letter-spacing: .04em; text-transform: uppercase; }
        .ap-col-count { font-size: 12px; font-weight: 700; width: 22px; height: 22px; border-radius: 50%; display: grid; place-items: center; background: rgba(255,255,255,.12); }
        .ap-col-body { flex: 1; border-radius: 0 0 12px 12px; padding: 10px; display: flex; flex-direction: column; gap: 10px; min-height: 200px; }
        .ap-card { background: linear-gradient(145deg, rgba(4,18,8,.95), rgba(2,12,5,.95)); border: 1px solid rgba(47,191,100,.14); border-radius: 14px; padding: 14px; cursor: pointer; transition: all .18s; }
        .ap-card:hover { border-color: rgba(47,191,100,.4); transform: translateY(-2px); box-shadow: 0 8px 20px rgba(0,0,0,.35); }
        .ap-card.selected { border-color: rgba(47,191,100,.65); box-shadow: 0 0 0 2px rgba(47,191,100,.25); }
        .ap-card-top { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
        .ap-av { width: 34px; height: 34px; border-radius: 10px; background: linear-gradient(135deg,#2fbf64,#1a9e4a); display:grid; place-items:center; font-size:13px; font-weight:700; color:#fff; flex-shrink:0; }
        .ap-cn { font-size: 13px; font-weight: 600; color: #d4f5e2; }
        .ap-cr { font-size: 11px; color: #4a8a5e; margin-top: 2px; }
        .ap-match { font-size: 11px; font-weight: 700; padding: 2px 8px; border-radius: 6px; background: rgba(47,191,100,.15); color: #6ee09c; margin-bottom: 8px; }
        .ap-time { font-size: 10.5px; color: #2e5040; }
        .ap-moves { display: flex; gap: 6px; margin-top: 10px; }
        .ap-move-btn { flex: 1; padding: 6px; border-radius: 7px; border: 1px solid rgba(47,191,100,.2); background: rgba(47,191,100,.07); color: #6ee09c; font: 600 11px Inter; cursor: pointer; transition: all .15s; }
        .ap-move-btn:hover { background: rgba(47,191,100,.18); }
        .ap-move-btn:disabled { opacity: .35; cursor: not-allowed; }
        @media (max-width: 700px) { .ap-board { gap: 12px; } .ap-col { min-width: 170px; } }
      `}</style>
      <div className="ap-page">
        <div className="ap-header">
          <h1 className="ap-title">Applicant Tracking</h1>
          <p className="ap-sub">Track your candidates through the hiring pipeline.</p>
        </div>

        <div className="ap-board">
          {STAGES.map(stage => {
            const col = applicants.filter(a => a.stage === stage);
            const c = STAGE_COLORS[stage];
            return (
              <div className="ap-col" key={stage}>
                <div className="ap-col-head" style={{ background: c.bg, border: `1px solid ${c.border}`, borderBottom: 'none' }}>
                  <span className="ap-col-name" style={{ color: c.text }}>{stage}</span>
                  <span className="ap-col-count" style={{ color: c.text }}>{col.length}</span>
                </div>
                <div className="ap-col-body" style={{ background: `${c.bg}`, border: `1px solid ${c.border}`, borderTop: 'none' }}>
                  {col.map(a => (
                    <div
                      key={a.id}
                      className={`ap-card${selected === a.id ? ' selected' : ''}`}
                      onClick={() => setSelected(selected === a.id ? null : a.id)}
                    >
                      <div className="ap-card-top">
                        <div className="ap-av">{a.avatar}</div>
                        <div>
                          <div className="ap-cn">{a.name}</div>
                          <div className="ap-cr">{a.role}</div>
                        </div>
                      </div>
                      <div className="ap-match">🎯 {a.match}% match</div>
                      <div className="ap-time">Applied {a.applied}</div>
                      <div className="ap-moves">
                        <button className="ap-move-btn" disabled={STAGES.indexOf(stage) === 0} onClick={e => { e.stopPropagation(); move(a.id, 'back'); }}>← Back</button>
                        <button className="ap-move-btn" disabled={STAGES.indexOf(stage) === STAGES.length - 1} onClick={e => { e.stopPropagation(); move(a.id, 'forward'); }}>Next →</button>
                      </div>
                    </div>
                  ))}
                  {col.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '24px 10px', color: '#2e5040', fontSize: 12 }}>No candidates</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
