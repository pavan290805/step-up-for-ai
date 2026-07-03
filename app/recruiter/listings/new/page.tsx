'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function NewListingPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        .nl-success { font-family: Inter, sans-serif; display: flex; align-items: center; justify-content: center; min-height: 70vh; }
        .ns-card { background: linear-gradient(145deg,rgba(4,18,8,.9),rgba(2,12,5,.9)); border:1px solid rgba(34,197,94,.3); border-radius:24px; padding:56px 48px; text-align:center; max-width:440px; width:100%; }
        .ns-icon { font-size: 56px; margin-bottom: 20px; }
        .ns-title { font-size: 24px; font-weight: 800; color: #86efac; margin-bottom: 10px; }
        .ns-sub { font-size: 14px; color: #4a8a5e; margin-bottom: 28px; line-height: 1.6; }
        .ns-btn { display: inline-block; padding: 12px 28px; border-radius: 12px; background: linear-gradient(135deg, #2fbf64, #1a9e4a); color:#fff; font: 700 13px Inter; text-decoration: none; transition: all .2s; }
        .ns-btn:hover { transform: translateY(-2px); }
      `}</style>
      <div className="nl-success">
        <div className="ns-card">
          <div className="ns-icon">🎉</div>
          <div className="ns-title">Listing Published!</div>
          <p className="ns-sub">Your internship listing is now live. Candidates can start applying immediately.</p>
          <Link href="/recruiter/listings" className="ns-btn">View All Listings →</Link>
        </div>
      </div>
    </>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        .nl-page { font-family: Inter, sans-serif; max-width: 760px; }
        .nl-header { margin-bottom: 28px; }
        .nl-back { display: inline-flex; align-items: center; gap: 6px; color: #4a8a5e; font: 600 13px Inter; text-decoration: none; margin-bottom: 16px; transition: color .15s; }
        .nl-back:hover { color: #6ee09c; }
        .nl-title { font-size: 26px; font-weight: 800; color: #e8faf0; letter-spacing: -.02em; }
        .nl-sub { color: #4a8a5e; font-size: 14px; margin-top: 6px; }
        .nl-card { background: linear-gradient(145deg, rgba(4,18,8,.9), rgba(2,12,5,.9)); border: 1px solid rgba(47,191,100,.15); border-radius: 22px; padding: 32px; margin-bottom: 22px; }
        .nl-card-title { font-size: 15px; font-weight: 700; color: #d4f5e2; margin-bottom: 22px; display: flex; align-items: center; gap: 8px; }
        .nl-card-title span { width: 28px; height: 28px; border-radius: 8px; background: rgba(47,191,100,.2); display: grid; place-items: center; font-size: 14px; }
        .nl-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
        .nl-field { display: flex; flex-direction: column; gap: 7px; }
        .nl-field.full { grid-column: 1 / -1; }
        .nl-label { font-size: 12px; font-weight: 600; color: #5cb87a; letter-spacing: .03em; text-transform: uppercase; }
        .nl-input, .nl-select, .nl-textarea { width: 100%; padding: 12px 14px; border-radius: 11px; background: rgba(255,255,255,.03); border: 1px solid rgba(47,191,100,.15); color: #e8faf0; font: 500 13.5px Inter; outline: none; transition: border-color .2s, box-shadow .2s; }
        .nl-input::placeholder, .nl-textarea::placeholder { color: #2e5040; }
        .nl-input:focus, .nl-select:focus, .nl-textarea:focus { border-color: rgba(47,191,100,.55); box-shadow: 0 0 0 4px rgba(47,191,100,.12); }
        .nl-select option { background: #041208; }
        .nl-textarea { resize: vertical; min-height: 130px; line-height: 1.6; }
        .nl-skills-row { display: flex; flex-wrap: wrap; gap: 8px; }
        .nl-skill-tag { padding: 6px 14px; border-radius: 8px; background: rgba(47,191,100,.15); border: 1px solid rgba(47,191,100,.3); color: #6ee09c; font: 600 12px Inter; display: flex; align-items: center; gap: 6px; }
        .nl-skill-x { cursor: pointer; color: #4a8a5e; font-size: 14px; transition: color .15s; }
        .nl-skill-x:hover { color: #f87171; }
        .nl-skill-add { padding: 6px 14px; border-radius: 8px; border: 1px dashed rgba(47,191,100,.3); background: transparent; color: #4a8a5e; font: 600 12px Inter; cursor: pointer; transition: all .15s; }
        .nl-skill-add:hover { border-color: rgba(47,191,100,.6); color: #6ee09c; }
        .nl-perks-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .nl-perk-toggle { display: flex; align-items: center; gap: 10px; padding: 12px 14px; border-radius: 12px; background: rgba(255,255,255,.02); border: 1px solid rgba(47,191,100,.12); cursor: pointer; transition: all .15s; }
        .nl-perk-toggle:hover { border-color: rgba(47,191,100,.3); background: rgba(47,191,100,.06); }
        .nl-perk-cb { width: 16px; height: 16px; accent-color: #2fbf64; }
        .nl-perk-label { font-size: 13px; color: #c4b5e4; }
        .nl-submit-row { display: flex; gap: 14px; align-items: center; margin-top: 8px; }
        .nl-submit-btn { padding: 14px 36px; border-radius: 12px; background: linear-gradient(135deg, #2fbf64, #1a9e4a); color: #fff; font: 700 14px Inter; border: none; cursor: pointer; transition: all .2s; box-shadow: 0 10px 28px rgba(47,191,100,.38); }
        .nl-submit-btn:hover { transform: translateY(-2px); box-shadow: 0 14px 36px rgba(47,191,100,.5); }
        .nl-draft-btn { padding: 14px 24px; border-radius: 12px; background: transparent; border: 1px solid rgba(47,191,100,.3); color: #6ee09c; font: 600 14px Inter; cursor: pointer; transition: all .15s; }
        .nl-draft-btn:hover { background: rgba(47,191,100,.08); }
        @media (max-width: 600px) { .nl-grid { grid-template-columns: 1fr; } .nl-perks-grid { grid-template-columns: 1fr; } }
      `}</style>
      <div className="nl-page">
        <div className="nl-header">
          <Link href="/recruiter/listings" className="nl-back">← Back to Listings</Link>
          <h1 className="nl-title">Post New Internship</h1>
          <p className="nl-sub">Fill in the details below to publish your internship listing.</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Basic Info */}
          <div className="nl-card">
            <div className="nl-card-title"><span>📋</span> Basic Information</div>
            <div className="nl-grid">
              <div className="nl-field full">
                <label className="nl-label">Job Title *</label>
                <input className="nl-input" type="text" placeholder="e.g. Frontend Developer Intern" required />
              </div>
              <div className="nl-field">
                <label className="nl-label">Department *</label>
                <select className="nl-select">
                  <option value="">Select department</option>
                  <option>Engineering</option>
                  <option>Data & AI</option>
                  <option>Design</option>
                  <option>Marketing</option>
                  <option>Sales</option>
                  <option>Operations</option>
                  <option>Finance</option>
                  <option>HR</option>
                </select>
              </div>
              <div className="nl-field">
                <label className="nl-label">Work Mode *</label>
                <select className="nl-select">
                  <option>Remote</option>
                  <option>Hybrid</option>
                  <option>On-site</option>
                </select>
              </div>
              <div className="nl-field">
                <label className="nl-label">Location</label>
                <input className="nl-input" type="text" placeholder="e.g. Hyderabad / Remote" />
              </div>
              <div className="nl-field">
                <label className="nl-label">Duration *</label>
                <select className="nl-select">
                  <option>1 month</option>
                  <option>2 months</option>
                  <option>3 months</option>
                  <option>6 months</option>
                  <option>1 year</option>
                </select>
              </div>
              <div className="nl-field">
                <label className="nl-label">Stipend (₹/month)</label>
                <input className="nl-input" type="number" placeholder="e.g. 8000 (0 for unpaid)" />
              </div>
              <div className="nl-field">
                <label className="nl-label">Openings</label>
                <input className="nl-input" type="number" placeholder="e.g. 3" defaultValue="1" />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="nl-card">
            <div className="nl-card-title"><span>📝</span> Job Description</div>
            <div className="nl-grid">
              <div className="nl-field full">
                <label className="nl-label">About the Role *</label>
                <textarea className="nl-textarea" placeholder="Describe the internship role, responsibilities, and what the intern will work on..." required />
              </div>
              <div className="nl-field full">
                <label className="nl-label">Responsibilities</label>
                <textarea className="nl-textarea" style={{ minHeight: 90 }} placeholder="• Build and maintain frontend components&#10;• Collaborate with the design team..." />
              </div>
              <div className="nl-field full">
                <label className="nl-label">Requirements</label>
                <textarea className="nl-textarea" style={{ minHeight: 90 }} placeholder="• Proficiency in React.js&#10;• Basic knowledge of REST APIs..." />
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="nl-card">
            <div className="nl-card-title"><span>🛠️</span> Required Skills</div>
            <div className="nl-skills-row">
              {['React.js', 'TypeScript', 'Tailwind CSS', 'Git'].map(s => (
                <div key={s} className="nl-skill-tag">
                  {s}<span className="nl-skill-x">×</span>
                </div>
              ))}
              <button type="button" className="nl-skill-add">+ Add Skill</button>
            </div>
          </div>

          {/* Perks */}
          <div className="nl-card">
            <div className="nl-card-title"><span>🎁</span> Perks & Benefits</div>
            <div className="nl-perks-grid">
              {['Certificate on completion', 'Letter of Recommendation', 'Pre-placement offer possibility', 'Flexible hours', 'Mentorship program', 'Equity / ESOP'].map(p => (
                <label key={p} className="nl-perk-toggle">
                  <input type="checkbox" className="nl-perk-cb" />
                  <span className="nl-perk-label">{p}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="nl-submit-row">
            <button type="submit" className="nl-submit-btn">🚀 Publish Listing</button>
            <button type="button" className="nl-draft-btn">Save as Draft</button>
          </div>
        </form>
      </div>
    </>
  );
}
