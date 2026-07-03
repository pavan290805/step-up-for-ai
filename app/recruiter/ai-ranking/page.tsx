'use client';

// Toggle this to true to preview premium view
const IS_PREMIUM = false;

import PremiumGate from '@/Components/recruiter/PremiumGate';

const RANKED = [
  { rank: 1, name: 'Meera Iyer', role: 'ML Research', score: 98, skills: 95, exp: 100, culture: 99, avatar: 'M', college: 'IIT Delhi', reason: 'Perfect match for ML role — published research paper, strong Python & TensorFlow skills.' },
  { rank: 2, name: 'Priya Mehta', role: 'Data Science', score: 92, skills: 89, exp: 94, culture: 93, avatar: 'P', college: 'IIT Bombay', reason: 'Excellent academic record with relevant project experience in NLP and data analysis.' },
  { rank: 3, name: 'Arjun Sharma', role: 'Frontend Dev', score: 87, skills: 90, exp: 82, culture: 89, avatar: 'A', college: 'BITS Pilani', reason: 'Strong React.js skills with 2 live projects. Minor gap in TypeScript depth.' },
  { rank: 4, name: 'Karan Patel', role: 'Full Stack', score: 83, skills: 85, exp: 80, culture: 84, avatar: 'K', college: 'IIIT Hyderabad', reason: 'Solid full-stack fundamentals. Recommend technical screening on Node.js architecture.' },
  { rank: 5, name: 'Rohan Gupta', role: 'Backend Dev', score: 79, skills: 76, exp: 82, culture: 79, avatar: 'R', college: 'VIT Vellore', reason: 'Good backend experience but limited exposure to distributed systems at scale.' },
];

function RankBadge({ rank }: { rank: number }) {
  const colors = ['#fbbf24', '#94a3b8', '#cd7c5b'];
  const icons = ['🥇', '🥈', '🥉'];
  return (
    <span style={{ fontSize: rank <= 3 ? 22 : 14, color: rank <= 3 ? colors[rank - 1] : '#3d6b52', fontWeight: 700, minWidth: 32, textAlign: 'center' }}>
      {rank <= 3 ? icons[rank - 1] : `#${rank}`}
    </span>
  );
}

function ScoreBar({ value, color }: { value: number; color: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ flex: 1, height: 6, borderRadius: 99, background: 'rgba(255,255,255,.06)', overflow: 'hidden' }}>
        <div style={{ width: `${value}%`, height: '100%', borderRadius: 99, background: color, transition: 'width .6s' }} />
      </div>
      <span style={{ fontSize: 11, fontWeight: 700, color, minWidth: 28, textAlign: 'right' }}>{value}</span>
    </div>
  );
}

function PremiumContent() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        .ar-page { font-family: Inter, sans-serif; }
        .ar-header { margin-bottom: 28px; }
        .ar-title { font-size: 26px; font-weight: 800; color: #e8faf0; letter-spacing: -.02em; }
        .ar-sub { font-size: 13px; color: #4a8a5e; margin-top: 4px; }
        .ar-ai-badge { display: inline-flex; align-items: center; gap: 7px; margin-top: 10px; padding: 7px 16px; border-radius: 99px; background: linear-gradient(135deg,rgba(47,191,100,.2),rgba(26,158,74,.15)); border: 1px solid rgba(47,191,100,.4); font-size: 12px; color: #6ee09c; font-weight: 700; }
        .ar-controls { display: flex; align-items: center; gap: 14px; margin-bottom: 24px; flex-wrap: wrap; }
        .ar-select { padding: 10px 14px; border-radius: 11px; background: rgba(255,255,255,.04); border: 1px solid rgba(47,191,100,.18); color: #e8faf0; font: 500 13px Inter; outline: none; transition: all .2s; cursor: pointer; }
        .ar-select option { background: #041208; }
        .ar-select:focus { border-color: rgba(47,191,100,.5); }
        .ar-btn { padding: 10px 22px; border-radius: 11px; background: linear-gradient(135deg,#2fbf64,#1a9e4a); color:#fff; font: 700 13px Inter; border: none; cursor: pointer; transition: all .2s; box-shadow: 0 6px 16px rgba(47,191,100,.3); }
        .ar-btn:hover { transform: translateY(-1px); }
        .ar-list { display: flex; flex-direction: column; gap: 14px; }
        .ar-card { background: linear-gradient(145deg,rgba(4,18,8,.9),rgba(2,12,5,.9)); border: 1px solid rgba(47,191,100,.15); border-radius: 20px; padding: 22px 24px; display: flex; align-items: flex-start; gap: 18px; transition: all .2s; }
        .ar-card:hover { border-color: rgba(47,191,100,.35); transform: translateY(-2px); }
        .ar-card.top { border-color: rgba(251,191,36,.3); background: linear-gradient(145deg,rgba(4,18,8,.9),rgba(251,191,36,.04)); }
        .ar-rank-col { display: flex; align-items: center; justify-content: center; min-width: 36px; padding-top: 4px; }
        .ar-av { width: 46px; height: 46px; border-radius: 13px; background: linear-gradient(135deg,#2fbf64,#1a9e4a); display:grid; place-items:center; font-size:16px; font-weight:700; color:#fff; flex-shrink:0; }
        .ar-info { flex: 1; min-width: 0; }
        .ar-name { font-size: 15px; font-weight: 700; color: #e8faf0; margin-bottom: 2px; }
        .ar-meta { font-size: 12px; color: #4a8a5e; margin-bottom: 12px; }
        .ar-bars { display: flex; flex-direction: column; gap: 7px; margin-bottom: 12px; }
        .ar-bar-label { font-size: 11px; color: #5cb87a; margin-bottom: 3px; }
        .ar-reason { font-size: 12px; color: #5cb87a; line-height: 1.6; background: rgba(47,191,100,.06); border: 1px solid rgba(47,191,100,.12); border-radius: 10px; padding: 10px 13px; margin-top: 4px; }
        .ar-reason-icon { font-size: 14px; margin-right: 4px; }
        .ar-score-bubble { flex-shrink: 0; text-align: center; background: linear-gradient(135deg,rgba(47,191,100,.18),rgba(26,158,74,.12)); border: 1px solid rgba(47,191,100,.3); border-radius: 14px; padding: 14px 16px; }
        .ar-score-val { font-size: 28px; font-weight: 800; color: #6ee09c; line-height: 1; }
        .ar-score-label { font-size: 10px; color: #4a8a5e; margin-top: 4px; font-weight: 600; text-transform: uppercase; letter-spacing: .04em; }
      `}</style>
      <div className="ar-page">
        <div className="ar-header">
          <h1 className="ar-title">AI Candidate Ranking</h1>
          <p className="ar-sub">Our AI scores and ranks candidates by fit for each listing.</p>
          <div className="ar-ai-badge">🤖 Powered by StepUp AI Engine</div>
        </div>

        <div className="ar-controls">
          <select className="ar-select">
            <option>Frontend Developer Intern</option>
            <option>Data Science Intern</option>
            <option>UI/UX Design Intern</option>
          </select>
          <button className="ar-btn">🔄 Re-rank Candidates</button>
        </div>

        <div className="ar-list">
          {RANKED.map(c => (
            <div className={`ar-card${c.rank === 1 ? ' top' : ''}`} key={c.rank}>
              <div className="ar-rank-col"><RankBadge rank={c.rank} /></div>
              <div className="ar-av">{c.avatar}</div>
              <div className="ar-info">
                <div className="ar-name">{c.name}</div>
                <div className="ar-meta">{c.role} · {c.college}</div>
                <div className="ar-bars">
                  <div><div className="ar-bar-label">Skills Match</div><ScoreBar value={c.skills} color="#2fbf64" /></div>
                  <div><div className="ar-bar-label">Experience</div><ScoreBar value={c.exp} color="#818cf8" /></div>
                  <div><div className="ar-bar-label">Culture Fit</div><ScoreBar value={c.culture} color="#6ee09c" /></div>
                </div>
                <div className="ar-reason"><span className="ar-reason-icon">💡</span>{c.reason}</div>
              </div>
              <div className="ar-score-bubble">
                <div className="ar-score-val">{c.score}</div>
                <div className="ar-score-label">AI Score</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default function AIRankingPage() {
  if (!IS_PREMIUM) return (
    <PremiumGate
      feature="AI Candidate Ranking"
      description="Let our AI automatically score and rank every applicant based on skills, experience, and culture fit — so you focus on the best candidates first."
    />
  );
  return <PremiumContent />;
}
