'use client';

const IS_PREMIUM = true;

import PremiumGate from '@/Components/recruiter/PremiumGate';

function Bar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <span style={{ fontSize: 13, color: '#c4b5e4' }}>{label}</span>
        <span style={{ fontSize: 13, fontWeight: 700, color }}>{value}</span>
      </div>
      <div style={{ height: 8, borderRadius: 99, background: 'rgba(255,255,255,.06)', overflow: 'hidden' }}>
        <div style={{ width: `${(value / max) * 100}%`, height: '100%', borderRadius: 99, background: color, transition: 'width .8s' }} />
      </div>
    </div>
  );
}

function MiniDonut({ slices }: { slices: { value: number; color: string; label: string }[] }) {
  const total = slices.reduce((s, v) => s + v.value, 0);
  let cum = 0;
  const r = 40, cx = 50, cy = 50, stroke = 14;
  return (
    <svg viewBox="0 0 100 100" width={140} height={140}>
      {slices.map((s) => {
        const start = (cum / total) * 360 - 90;
        cum += s.value;
        const end = (cum / total) * 360 - 90;
        const largeArc = end - start > 180 ? 1 : 0;
        const toRad = (d: number) => (d * Math.PI) / 180;
        const x1 = cx + r * Math.cos(toRad(start));
        const y1 = cy + r * Math.sin(toRad(start));
        const x2 = cx + r * Math.cos(toRad(end));
        const y2 = cy + r * Math.sin(toRad(end));
        const circ = 2 * Math.PI * r;
        const pct = s.value / total;
        return (
          <circle
            key={s.label}
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke={s.color}
            strokeWidth={stroke}
            strokeDasharray={`${pct * circ} ${circ}`}
            strokeDashoffset={-(cum - s.value) / total * circ}
            transform={`rotate(-90 ${cx} ${cy})`}
          />
        );
      })}
      <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fill="#e8faf0" fontSize="11" fontWeight="700">{total}</text>
      <text x="50%" y="62%" dominantBaseline="middle" textAnchor="middle" fill="#4a8a5e" fontSize="7">Total</text>
    </svg>
  );
}

function PremiumContent() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        .an-page { font-family: Inter, sans-serif; }
        .an-header { margin-bottom: 28px; }
        .an-title { font-size: 26px; font-weight: 800; color: #e8faf0; letter-spacing: -.02em; }
        .an-sub { font-size: 13px; color: #4a8a5e; margin-top: 4px; }
        .an-date-row { display: flex; gap: 8px; margin-top: 14px; margin-bottom: 28px; }
        .an-date-btn { padding: 8px 16px; border-radius: 10px; background: rgba(255,255,255,.04); border: 1px solid rgba(47,191,100,.15); color: #5cb87a; font: 600 12px Inter; cursor: pointer; transition: all .15s; }
        .an-date-btn.active { background: rgba(47,191,100,.18); border-color: rgba(47,191,100,.4); color: #6ee09c; }
        .an-kpi-row { display: grid; grid-template-columns: repeat(4,1fr); gap: 18px; margin-bottom: 28px; }
        .an-kpi { background: linear-gradient(145deg,rgba(4,18,8,.9),rgba(2,12,5,.9)); border: 1px solid rgba(47,191,100,.15); border-radius: 18px; padding: 22px; transition: all .2s; }
        .an-kpi:hover { border-color: rgba(47,191,100,.35); transform: translateY(-2px); }
        .an-kpi-icon { font-size: 26px; margin-bottom: 12px; }
        .an-kpi-val { font-size: 32px; font-weight: 800; color: #e8faf0; letter-spacing: -.02em; }
        .an-kpi-label { font-size: 13px; color: #5cb87a; margin-top: 4px; }
        .an-kpi-delta { font-size: 11.5px; font-weight: 600; margin-top: 6px; }
        .an-kpi-delta.up { color: #86efac; }
        .an-kpi-delta.down { color: #fca5a5; }
        .an-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 22px; margin-bottom: 22px; }
        .an-panel { background: linear-gradient(145deg,rgba(4,18,8,.9),rgba(2,12,5,.9)); border: 1px solid rgba(47,191,100,.15); border-radius: 20px; padding: 26px; }
        .an-panel-title { font-size: 15px; font-weight: 700; color: #d4f5e2; margin-bottom: 22px; }
        .an-funnel { display: flex; flex-direction: column; gap: 10px; }
        .an-funnel-row { }
        .an-funnel-label { display: flex; justify-content: space-between; font-size: 12.5px; color: #c4b5e4; margin-bottom: 5px; }
        .an-funnel-bar { height: 28px; border-radius: 8px; display: flex; align-items: center; padding-left: 12px; font-size: 12px; font-weight: 700; color: #fff; transition: width .6s; }
        .an-chart-bars { display: flex; align-items: flex-end; gap: 10px; height: 140px; padding-top: 16px; }
        .an-chart-bar-wrap { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 7px; }
        .an-chart-bar { width: 100%; border-radius: 8px 8px 0 0; background: linear-gradient(180deg, #2fbf64, #1a9e4a); transition: height .5s; }
        .an-chart-label { font-size: 11px; color: #3d6b52; }
        .an-chart-val { font-size: 11px; color: #6ee09c; font-weight: 600; }
        .an-donut-row { display: flex; align-items: center; gap: 28px; }
        .an-donut-legend { display: flex; flex-direction: column; gap: 10px; }
        .an-legend-item { display: flex; align-items: center; gap: 8px; }
        .an-legend-dot { width: 10px; height: 10px; border-radius: 50%; flex-shrink: 0; }
        .an-legend-label { font-size: 12px; color: #c4b5e4; }
        .an-legend-val { font-size: 12px; font-weight: 700; color: #e8faf0; margin-left: auto; }
        .an-skills-list { display: flex; flex-direction: column; gap: 14px; }
        @media (max-width: 900px) { .an-kpi-row { grid-template-columns: repeat(2,1fr); } .an-grid { grid-template-columns: 1fr; } }
      `}</style>
      <div className="an-page">
        <div className="an-header">
          <h1 className="an-title">Advanced Analytics</h1>
          <p className="an-sub">Deep insights into your hiring pipeline and listing performance.</p>
        </div>

        <div className="an-date-row">
          {['7 Days', '30 Days', '90 Days', 'This Year'].map((d, i) => (
            <button key={d} className={`an-date-btn${i === 1 ? ' active' : ''}`}>{d}</button>
          ))}
        </div>

        {/* KPIs */}
        <div className="an-kpi-row">
          {[
            { icon: '', val: '3,420', label: 'Listing Views', delta: '+18%', dir: 'up' },
            { icon: '', val: '127', label: 'Applications', delta: '+12%', dir: 'up' },
            { icon: '', val: '68%', label: 'Response Rate', delta: '-3%', dir: 'down' },
            { icon: '⏱', val: '4.2d', label: 'Avg Time to Hire', delta: '-1.1d', dir: 'up' },
          ].map(k => (
            <div className="an-kpi" key={k.label}>
              <div className="an-kpi-icon">{k.icon}</div>
              <div className="an-kpi-val">{k.val}</div>
              <div className="an-kpi-label">{k.label}</div>
              <div className={`an-kpi-delta ${k.dir}`}>{k.dir === 'up' ? '↑' : '↓'} {k.delta} vs last period</div>
            </div>
          ))}
        </div>

        <div className="an-grid">
          {/* Views chart */}
          <div className="an-panel">
            <div className="an-panel-title"> Daily Listing Views</div>
            <div className="an-chart-bars">
              {[{ d: 'Mon', v: 340 }, { d: 'Tue', v: 520 }, { d: 'Wed', v: 480 }, { d: 'Thu', v: 610 }, { d: 'Fri', v: 580 }, { d: 'Sat', v: 390 }, { d: 'Sun', v: 290 }].map(b => (
                <div className="an-chart-bar-wrap" key={b.d}>
                  <div className="an-chart-val">{b.v}</div>
                  <div className="an-chart-bar" style={{ height: `${(b.v / 610) * 100}%` }} />
                  <div className="an-chart-label">{b.d}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Funnel */}
          <div className="an-panel">
            <div className="an-panel-title"> Application Funnel</div>
            <div className="an-funnel">
              {[
                { label: 'Viewed', n: 3420, pct: 100, color: '#6366f1' },
                { label: 'Applied', n: 127, pct: 37, color: '#2fbf64' },
                { label: 'Reviewed', n: 84, pct: 24, color: '#6ee09c' },
                { label: 'Interviewed', n: 22, pct: 6, color: '#818cf8' },
                { label: 'Offered', n: 6, pct: 2, color: '#86efac' },
              ].map(f => (
                <div className="an-funnel-row" key={f.label}>
                  <div className="an-funnel-label"><span>{f.label}</span><span>{f.n}</span></div>
                  <div className="an-funnel-bar" style={{ width: `${f.pct}%`, background: f.color }}>{f.pct}%</div>
                </div>
              ))}
            </div>
          </div>

          {/* Location donut */}
          <div className="an-panel">
            <div className="an-panel-title"> Applicant Locations</div>
            <div className="an-donut-row">
              <MiniDonut slices={[
                { value: 45, color: '#2fbf64', label: 'Hyderabad' },
                { value: 28, color: '#6366f1', label: 'Bangalore' },
                { value: 18, color: '#818cf8', label: 'Mumbai' },
                { value: 9, color: '#6ee09c', label: 'Others' },
              ]} />
              <div className="an-donut-legend">
                {[
                  { label: 'Hyderabad', val: '45%', color: '#2fbf64' },
                  { label: 'Bangalore', val: '28%', color: '#6366f1' },
                  { label: 'Mumbai', val: '18%', color: '#818cf8' },
                  { label: 'Others', val: '9%', color: '#6ee09c' },
                ].map(l => (
                  <div className="an-legend-item" key={l.label}>
                    <div className="an-legend-dot" style={{ background: l.color }} />
                    <span className="an-legend-label">{l.label}</span>
                    <span className="an-legend-val">{l.val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top skills */}
          <div className="an-panel">
            <div className="an-panel-title"> Top Candidate Skills</div>
            <div className="an-skills-list">
              {[
                { skill: 'React.js', count: 68, color: '#2fbf64' },
                { skill: 'Python', count: 54, color: '#6366f1' },
                { skill: 'Node.js', count: 41, color: '#818cf8' },
                { skill: 'Figma', count: 29, color: '#6ee09c' },
                { skill: 'SQL', count: 22, color: '#a78bfa' },
              ].map(s => (
                <Bar key={s.skill} label={s.skill} value={s.count} max={68} color={s.color} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function AnalyticsPage() {
  if (!IS_PREMIUM) return (
    <PremiumGate
      feature="Advanced Analytics"
      description="Get deep insights into your hiring funnel — views, applications, location data, skill trends, and conversion rates."
    />
  );
  return <PremiumContent />;
}
