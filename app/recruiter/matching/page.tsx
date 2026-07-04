'use client';

const IS_PREMIUM = true;

import { useState } from 'react';
import PremiumGate from '@/Components/recruiter/PremiumGate';

const MATCHES = [
  { name: 'Meera Iyer', avatar: 'M', role: 'ML Research', college: 'IIT Delhi', match: 98, skills: ['Python', 'TensorFlow', 'NLP', 'SQL'], why: 'Skills perfectly align with role requirements. Strong academic background + project portfolio.' },
  { name: 'Priya Mehta', avatar: 'P', role: 'Data Science', college: 'IIT Bombay', match: 92, skills: ['Python', 'ML', 'SQL', 'Tableau'], why: 'Excellent ML fundamentals with 3 completed data projects. Minor gap: no cloud experience.' },
  { name: 'Arjun Sharma', avatar: 'A', role: 'Frontend Dev', college: 'BITS Pilani', match: 87, skills: ['React', 'TypeScript', 'CSS', 'Git'], why: 'Strong React skills and impressive portfolio. Recommend for technical screen.' },
  { name: 'Karan Patel', avatar: 'K', role: 'Full Stack', college: 'IIIT Hyderabad', match: 83, skills: ['Next.js', 'MongoDB', 'AWS', 'Node.js'], why: 'Good full-stack profile. AWS experience is a bonus. Recommend voice screening first.' },
];

function MatchRing({ value }: { value: number }) {
  const r = 28, circ = 2 * Math.PI * r;
  const dash = (value / 100) * circ;
  return (
    <svg width={72} height={72} viewBox="0 0 72 72">
      <circle cx={36} cy={36} r={r} fill="none" stroke="rgba(47,191,100,.15)" strokeWidth={7} />
      <circle
        cx={36} cy={36} r={r}
        fill="none"
        stroke="url(#matchGrad)"
        strokeWidth={7}
        strokeLinecap="round"
        strokeDasharray={`${dash} ${circ}`}
        transform="rotate(-90 36 36)"
      />
      <defs>
        <linearGradient id="matchGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2fbf64" />
          <stop offset="100%" stopColor="#1a9e4a" />
        </linearGradient>
      </defs>
      <text x="50%" y="52%" dominantBaseline="middle" textAnchor="middle" fill="#6ee09c" fontSize="13" fontWeight="800">{value}%</text>
    </svg>
  );
}

function PremiumContent() {
  const [selectedListing, setSelectedListing] = useState('Frontend Developer Intern');
  const [ran, setRan] = useState(false);
  const [loading, setLoading] = useState(false);

  const run = () => {
    setLoading(true); setRan(false);
    setTimeout(() => { setLoading(false); setRan(true); }, 1600);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        .sm-page { font-family: Inter, sans-serif; }
        .sm-header { margin-bottom: 28px; }
        .sm-title { font-size: 26px; font-weight: 800; color: #e8faf0; letter-spacing: -.02em; }
        .sm-sub { font-size: 13px; color: #4a8a5e; margin-top: 4px; }
        .sm-ai-badge { display: inline-flex; align-items: center; gap: 7px; margin-top: 10px; padding: 7px 16px; border-radius: 99px; background: linear-gradient(135deg,rgba(47,191,100,.2),rgba(26,158,74,.15)); border: 1px solid rgba(47,191,100,.4); font-size: 12px; color: #6ee09c; font-weight: 700; }
        .sm-controls { display: flex; align-items: center; gap: 14px; margin-bottom: 28px; flex-wrap: wrap; }
        .sm-select { padding: 11px 14px; border-radius: 11px; background: rgba(255,255,255,.04); border: 1px solid rgba(47,191,100,.18); color: #e8faf0; font: 500 13px Inter; outline: none; cursor: pointer; min-width: 240px; }
        .sm-select option { background: #041208; }
        .sm-run-btn { padding: 11px 24px; border-radius: 11px; background: linear-gradient(135deg,#2fbf64,#1a9e4a); color:#fff; font: 700 13px Inter; border: none; cursor: pointer; transition: all .2s; box-shadow: 0 8px 20px rgba(47,191,100,.35); display:flex; align-items:center; gap:7px; }
        .sm-run-btn:hover { transform: translateY(-1px); }
        .sm-run-btn:disabled { opacity:.6; cursor:not-allowed; transform:none; }
        .sm-results { display: flex; flex-direction: column; gap: 16px; }
        .sm-card { background: linear-gradient(145deg,rgba(4,18,8,.9),rgba(2,12,5,.9)); border: 1px solid rgba(47,191,100,.15); border-radius: 20px; padding: 22px 24px; display: flex; align-items: flex-start; gap: 20px; transition: all .2s; animation: smIn .4s ease; }
        @keyframes smIn { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        .sm-card:hover { border-color: rgba(47,191,100,.35); transform: translateY(-2px); }
        .sm-av { width: 46px; height: 46px; border-radius: 13px; background: linear-gradient(135deg,#2fbf64,#1a9e4a); display:grid; place-items:center; font-size:16px; font-weight:700; color:#fff; flex-shrink:0; }
        .sm-info { flex: 1; min-width: 0; }
        .sm-name { font-size: 15px; font-weight: 700; color: #e8faf0; margin-bottom: 2px; }
        .sm-meta { font-size: 12px; color: #4a8a5e; margin-bottom: 12px; }
        .sm-skills { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 12px; }
        .sm-skill { font-size: 11px; font-weight: 600; padding: 3px 10px; border-radius: 7px; background: rgba(47,191,100,.1); border: 1px solid rgba(47,191,100,.2); color: #6ee09c; }
        .sm-why { font-size: 12px; color: #5cb87a; line-height: 1.6; background: rgba(47,191,100,.06); border: 1px solid rgba(47,191,100,.1); border-radius: 10px; padding: 9px 12px; }
        .sm-actions { display: flex; gap: 8px; margin-top: 12px; }
        .sm-btn-ghost { padding: 8px 14px; border-radius: 9px; border: 1px solid rgba(47,191,100,.25); background: rgba(47,191,100,.08); color: #6ee09c; font: 600 12px Inter; cursor: pointer; transition: all .15s; }
        .sm-btn-solid { padding: 8px 14px; border-radius: 9px; border: none; background: linear-gradient(135deg,#2fbf64,#1a9e4a); color:#fff; font: 700 12px Inter; cursor: pointer; transition: all .15s; }
        .sm-placeholder { text-align: center; padding: 80px 0; color: #2e5040; }
        .sm-placeholder-icon { font-size: 48px; margin-bottom: 14px; }
      `}</style>
      <div className="sm-page">
        <div className="sm-header">
          <h1 className="sm-title">Smart Candidate Matching</h1>
          <p className="sm-sub">AI finds the best-fit candidates for each of your open listings.</p>
          <div className="sm-ai-badge">🎯 Powered by StepUp AI Engine</div>
        </div>

        <div className="sm-controls">
          <select className="sm-select" value={selectedListing} onChange={e => setSelectedListing(e.target.value)}>
            <option>Frontend Developer Intern</option>
            <option>Data Science Intern</option>
            <option>UI/UX Design Intern</option>
          </select>
          <button className="sm-run-btn" onClick={run} disabled={loading}>
            {loading ? '⏳ Matching...' : '🎯 Find Matches'}
          </button>
        </div>

        {!ran && !loading && (
          <div className="sm-placeholder">
            <div className="sm-placeholder-icon">🎯</div>
            <p style={{ fontSize: 14, color: '#3d6b52' }}>Select a listing and click <strong>Find Matches</strong> to discover your best candidates.</p>
          </div>
        )}

        {ran && (
          <div className="sm-results">
            {MATCHES.map((c, i) => (
              <div className="sm-card" key={c.name} style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="sm-av">{c.avatar}</div>
                <div className="sm-info">
                  <div className="sm-name">{c.name}</div>
                  <div className="sm-meta">{c.role} · {c.college}</div>
                  <div className="sm-skills">{c.skills.map(s => <span key={s} className="sm-skill">{s}</span>)}</div>
                  <div className="sm-why">💡 {c.why}</div>
                  <div className="sm-actions">
                    <button className="sm-btn-ghost">👁 View Profile</button>
                    <button className="sm-btn-solid">📩 Invite to Apply</button>
                  </div>
                </div>
                <MatchRing value={c.match} />
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default function MatchingPage() {
  if (!IS_PREMIUM) return (
    <PremiumGate
      feature="Smart Candidate Matching"
      description="Our AI scans the entire candidate pool and surfaces the best matches for each of your listings — automatically."
    />
  );
  return <PremiumContent />;
}
