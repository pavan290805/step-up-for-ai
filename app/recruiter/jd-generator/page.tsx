'use client';

const IS_PREMIUM = true;

import { useState } from 'react';
import PremiumGate from '@/Components/recruiter/PremiumGate';

const SAMPLE_JD = `## Frontend Developer Intern

**Location:** Remote | **Duration:** 3 Months | **Stipend:** ₹8,000/month

### About the Role
We are looking for a passionate Frontend Developer Intern to join our engineering team. You will work closely with senior developers to build and maintain modern web interfaces that power our products.

### Responsibilities
- Develop responsive and accessible web components using React.js
- Collaborate with UI/UX designers to implement designs pixel-perfectly
- Write clean, maintainable, and well-documented code
- Participate in code reviews and team standups
- Assist in debugging and performance optimization

### Requirements
- Pursuing B.Tech/BCA in Computer Science or related field
- Proficiency in HTML, CSS, and JavaScript
- Basic knowledge of React.js or any modern frontend framework
- Familiarity with Git version control
- Strong problem-solving skills and attention to detail

### What We Offer
 Certificate of Completion  
 Letter of Recommendation  
 Pre-Placement Offer opportunity  
 Mentorship from senior engineers  
 Flexible work hours  

*We are an equal opportunity employer committed to diversity and inclusion.*`;

function PremiumContent() {
  const [role, setRole] = useState('Frontend Developer Intern');
  const [dept, setDept] = useState('Engineering');
  const [skills, setSkills] = useState('React.js, TypeScript, CSS');
  const [mode, setMode] = useState('Remote');
  const [duration, setDuration] = useState('3 months');
  const [stipend, setStipend] = useState('8000');
  const [generated, setGenerated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const generate = () => {
    setLoading(true);
    setGenerated(false);
    setTimeout(() => { setLoading(false); setGenerated(true); }, 1800);
  };

  const copy = () => {
    navigator.clipboard.writeText(SAMPLE_JD);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        .jd-page { font-family: Inter, sans-serif; }
        .jd-header { margin-bottom: 28px; }
        .jd-title { font-size: 26px; font-weight: 800; color: #f1eeff; letter-spacing: -.02em; }
        .jd-sub { font-size: 13px; color: #7c6d9e; margin-top: 4px; }
        .jd-ai-badge { display: inline-flex; align-items: center; gap: 7px; margin-top: 10px; padding: 7px 16px; border-radius: 99px; background: linear-gradient(135deg,rgba(168, 85, 247,.2),rgba(124, 58, 237,.15)); border: 1px solid rgba(168, 85, 247,.4); font-size: 12px; color: #c084fc; font-weight: 700; }
        .jd-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
        .jd-panel { background: linear-gradient(145deg,rgba(13, 7, 24,.9),rgba(8, 4, 26,.9)); border: 1px solid rgba(168, 85, 247,.15); border-radius: 22px; padding: 28px; }
        .jd-panel-title { font-size: 15px; font-weight: 700; color: #e2d9ff; margin-bottom: 22px; display: flex; align-items: center; gap: 8px; }
        .jd-field { display: flex; flex-direction: column; gap: 7px; margin-bottom: 16px; }
        .jd-label { font-size: 12px; font-weight: 600; color: #9d7ec7; letter-spacing: .03em; text-transform: uppercase; }
        .jd-input, .jd-select { width: 100%; padding: 11px 13px; border-radius: 11px; background: rgba(255,255,255,.03); border: 1px solid rgba(168, 85, 247,.15); color: #f1eeff; font: 500 13.5px Inter; outline: none; transition: all .2s; }
        .jd-input::placeholder { color: #4a3f5c; }
        .jd-input:focus, .jd-select:focus { border-color: rgba(168, 85, 247,.55); box-shadow: 0 0 0 4px rgba(168, 85, 247,.12); }
        .jd-select option { background: #0d0718; }
        .jd-gen-btn { width: 100%; padding: 14px; border-radius: 12px; background: linear-gradient(135deg,#a855f7,#7c3aed); color:#fff; font: 700 14px Inter; border: none; cursor: pointer; transition: all .2s; box-shadow: 0 10px 28px rgba(168, 85, 247,.38); margin-top: 8px; display: flex; align-items: center; justify-content: center; gap: 8px; }
        .jd-gen-btn:hover { transform: translateY(-2px); box-shadow: 0 14px 36px rgba(168, 85, 247,.5); }
        .jd-gen-btn:disabled { opacity: .6; cursor: not-allowed; transform: none; }
        .jd-output { }
        .jd-output-head { display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; }
        .jd-copy-btn { padding: 8px 16px; border-radius: 10px; border: 1px solid rgba(168, 85, 247,.3); background: rgba(168, 85, 247,.1); color: #c084fc; font: 600 12px Inter; cursor: pointer; transition: all .15s; }
        .jd-copy-btn:hover { background: rgba(168, 85, 247,.2); }
        .jd-use-btn { padding: 8px 16px; border-radius: 10px; border: none; background: linear-gradient(135deg,#a855f7,#7c3aed); color:#fff; font: 700 12px Inter; cursor: pointer; transition: all .15s; }
        .jd-use-btn:hover { transform: translateY(-1px); }
        .jd-output-body { background: rgba(255,255,255,.025); border: 1px solid rgba(168, 85, 247,.12); border-radius: 14px; padding: 20px; max-height: 520px; overflow-y: auto; white-space: pre-wrap; font: 500 13.5px/1.7 Inter; color: #d4c9f0; }
        .jd-skeleton { display: flex; flex-direction: column; gap: 12px; }
        .jd-skel-line { border-radius: 8px; background: rgba(168, 85, 247,.08); animation: skelpulse 1.2s ease-in-out infinite; }
        @keyframes skelpulse { 0%,100% { opacity:.4; } 50% { opacity:.9; } }
        .jd-placeholder { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 300px; color: #4a3f5c; text-align: center; }
        .jd-placeholder-icon { font-size: 48px; margin-bottom: 14px; }
        .jd-placeholder p { font-size: 13px; line-height: 1.6; max-width: 240px; }
        @media (max-width: 800px) { .jd-layout { grid-template-columns: 1fr; } }
      `}</style>
      <div className="jd-page">
        <div className="jd-header">
          <h1 className="jd-title">AI JD Generator</h1>
          <p className="jd-sub">Describe your role and let AI write a compelling job description in seconds.</p>
          <div className="jd-ai-badge"> Powered by StepUp AI Engine</div>
        </div>

        <div className="jd-layout">
          {/* Input */}
          <div className="jd-panel">
            <div className="jd-panel-title"> Role Details</div>
            <div className="jd-field">
              <label className="jd-label">Job Title</label>
              <input className="jd-input" value={role} onChange={e => setRole(e.target.value)} placeholder="e.g. Frontend Developer Intern" />
            </div>
            <div className="jd-field">
              <label className="jd-label">Department</label>
              <select className="jd-select" value={dept} onChange={e => setDept(e.target.value)}>
                <option>Engineering</option><option>Design</option><option>Data & AI</option>
                <option>Marketing</option><option>Sales</option><option>Operations</option>
              </select>
            </div>
            <div className="jd-field">
              <label className="jd-label">Key Skills (comma separated)</label>
              <input className="jd-input" value={skills} onChange={e => setSkills(e.target.value)} placeholder="e.g. React.js, TypeScript, REST APIs" />
            </div>
            <div className="jd-field">
              <label className="jd-label">Work Mode</label>
              <select className="jd-select" value={mode} onChange={e => setMode(e.target.value)}>
                <option>Remote</option><option>Hybrid</option><option>On-site</option>
              </select>
            </div>
            <div className="jd-field">
              <label className="jd-label">Duration</label>
              <select className="jd-select" value={duration} onChange={e => setDuration(e.target.value)}>
                <option>1 month</option><option>2 months</option><option>3 months</option><option>6 months</option>
              </select>
            </div>
            <div className="jd-field">
              <label className="jd-label">Stipend (₹/month)</label>
              <input className="jd-input" value={stipend} onChange={e => setStipend(e.target.value)} type="number" placeholder="e.g. 8000" />
            </div>
            <button className="jd-gen-btn" onClick={generate} disabled={loading}>
              {loading ? '⏳ Generating...' : ' Generate Job Description'}
            </button>
          </div>

          {/* Output */}
          <div className="jd-panel jd-output">
            <div className="jd-output-head">
              <div className="jd-panel-title" style={{ marginBottom: 0 }}> Generated JD</div>
              {generated && (
                <div style={{ display: 'flex', gap: 8 }}>
                  <button className="jd-copy-btn" onClick={copy}>{copied ? ' Copied!' : ' Copy'}</button>
                  <button className="jd-use-btn"> Use This JD</button>
                </div>
              )}
            </div>

            {loading ? (
              <div className="jd-skeleton">
                {[120, 80, 200, 60, 160, 100, 180].map((w, i) => (
                  <div key={i} className="jd-skel-line" style={{ height: 14, width: `${w / 200 * 100}%` }} />
                ))}
              </div>
            ) : generated ? (
              <div className="jd-output-body">{SAMPLE_JD}</div>
            ) : (
              <div className="jd-placeholder">
                <div className="jd-placeholder-icon"></div>
                <p>Fill in the role details and click <strong>Generate</strong> to create a professional job description.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default function JDGeneratorPage() {
  if (!IS_PREMIUM) return (
    <PremiumGate
      feature="AI JD Generator"
      description="Describe your role and let our AI write a professional, compelling job description in under 5 seconds."
    />
  );
  return <PremiumContent />;
}
