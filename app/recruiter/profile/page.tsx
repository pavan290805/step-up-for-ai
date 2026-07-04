'use client';

import { useState } from 'react';

export default function CompanyProfilePage() {
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        .cp-page { font-family: Inter, sans-serif; max-width: 860px; }
        .cp-header { margin-bottom: 32px; }
        .cp-title { font-size: 26px; font-weight: 800; color: #f1eeff; letter-spacing: -.02em; }
        .cp-sub { color: #7c6d9e; font-size: 14px; margin-top: 6px; }
        .cp-card { background: linear-gradient(145deg, rgba(13, 7, 24,.9), rgba(8, 4, 26,.9)); border: 1px solid rgba(168, 85, 247,.15); border-radius: 22px; padding: 32px; margin-bottom: 24px; }
        .cp-card-title { font-size: 15px; font-weight: 700; color: #e2d9ff; margin-bottom: 22px; display: flex; align-items: center; gap: 8px; }
        .cp-card-title span { width: 28px; height: 28px; border-radius: 8px; background: rgba(168, 85, 247,.2); display: grid; place-items: center; font-size: 14px; }
        .cp-logo-section { display: flex; align-items: center; gap: 28px; margin-bottom: 28px; }
        .cp-logo-box { width: 100px; height: 100px; border-radius: 20px; background: linear-gradient(135deg, rgba(168, 85, 247,.2), rgba(124, 58, 237,.15)); border: 2px dashed rgba(168, 85, 247,.4); display: flex; align-items: center; justify-content: center; font-size: 38px; cursor: pointer; transition: all .2s; }
        .cp-logo-box:hover { border-color: rgba(168, 85, 247,.7); background: rgba(168, 85, 247,.15); }
        .cp-logo-info h4 { font-size: 14px; font-weight: 600; color: #e2d9ff; margin-bottom: 4px; }
        .cp-logo-info p { font-size: 12px; color: #7c6d9e; line-height: 1.6; }
        .cp-logo-upload { display: inline-block; margin-top: 10px; padding: 7px 16px; border-radius: 10px; background: rgba(168, 85, 247,.15); border: 1px solid rgba(168, 85, 247,.3); color: #c084fc; font-size: 12px; font-weight: 600; cursor: pointer; transition: all .18s; }
        .cp-logo-upload:hover { background: rgba(168, 85, 247,.25); }
        .cp-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
        .cp-field { display: flex; flex-direction: column; gap: 7px; }
        .cp-field.full { grid-column: 1 / -1; }
        .cp-label { font-size: 12px; font-weight: 600; color: #9d7ec7; letter-spacing: .03em; text-transform: uppercase; }
        .cp-input, .cp-select, .cp-textarea { width: 100%; padding: 12px 14px; border-radius: 11px; background: rgba(255,255,255,.03); border: 1px solid rgba(168, 85, 247,.15); color: #f1eeff; font: 500 13.5px Inter; outline: none; transition: border-color .2s, box-shadow .2s; }
        .cp-input::placeholder, .cp-textarea::placeholder { color: #4a3f5c; }
        .cp-input:focus, .cp-select:focus, .cp-textarea:focus { border-color: rgba(168, 85, 247,.55); box-shadow: 0 0 0 4px rgba(168, 85, 247,.12); }
        .cp-select { cursor: pointer; }
        .cp-select option { background: #0d0718; }
        .cp-textarea { resize: vertical; min-height: 110px; line-height: 1.6; }
        .cp-social-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .cp-social-row { display: flex; align-items: center; gap: 10px; }
        .cp-social-icon { width: 38px; height: 38px; border-radius: 10px; background: rgba(168, 85, 247,.1); border: 1px solid rgba(168, 85, 247,.2); display: grid; place-items: center; font-size: 16px; flex-shrink: 0; }
        .cp-save-row { display: flex; align-items: center; gap: 16px; margin-top: 8px; }
        .cp-save-btn { padding: 13px 32px; border-radius: 12px; background: linear-gradient(135deg, #a855f7, #7c3aed); color: #fff; font: 700 14px Inter; border: none; cursor: pointer; transition: all .2s; box-shadow: 0 10px 28px rgba(168, 85, 247,.35); }
        .cp-save-btn:hover { transform: translateY(-2px); box-shadow: 0 14px 36px rgba(168, 85, 247,.48); }
        .cp-save-msg { font-size: 13px; color: #86efac; font-weight: 600; opacity: 0; transition: opacity .3s; }
        .cp-save-msg.show { opacity: 1; }
        .cp-divider { height: 1px; background: rgba(168, 85, 247,.08); margin: 4px 0 20px; }
        @media (max-width: 640px) { .cp-form-grid { grid-template-columns: 1fr; } .cp-social-grid { grid-template-columns: 1fr; } }
      `}</style>
      <div className="cp-page">
        <div className="cp-header">
          <h1 className="cp-title">Company Profile</h1>
          <p className="cp-sub">Showcase your company to attract top talent. A complete profile gets 3× more applications.</p>
        </div>

        <form onSubmit={handleSave}>
          {/* Logo & Basic */}
          <div className="cp-card">
            <div className="cp-card-title"><span></span> Company Identity</div>
            <div className="cp-logo-section">
              <div className="cp-logo-box"></div>
              <div className="cp-logo-info">
                <h4>Company Logo</h4>
                <p>Upload a square logo (PNG, JPG)<br />Recommended: 400×400px</p>
                <div className="cp-logo-upload"> Upload Logo</div>
              </div>
            </div>
            <div className="cp-divider" />
            <div className="cp-form-grid">
              <div className="cp-field">
                <label className="cp-label">Company Name *</label>
                <input className="cp-input" type="text" placeholder="e.g. TechNova Solutions" defaultValue="TechNova Solutions" />
              </div>
              <div className="cp-field">
                <label className="cp-label">Industry *</label>
                <select className="cp-select">
                  <option>Technology</option>
                  <option>Finance</option>
                  <option>Healthcare</option>
                  <option>Education</option>
                  <option>E-Commerce</option>
                  <option>Manufacturing</option>
                  <option>Consulting</option>
                </select>
              </div>
              <div className="cp-field">
                <label className="cp-label">Company Size</label>
                <select className="cp-select">
                  <option>1–10 employees</option>
                  <option>11–50 employees</option>
                  <option selected>51–200 employees</option>
                  <option>201–500 employees</option>
                  <option>500+ employees</option>
                </select>
              </div>
              <div className="cp-field">
                <label className="cp-label">Founded Year</label>
                <input className="cp-input" type="number" placeholder="e.g. 2018" defaultValue="2018" />
              </div>
              <div className="cp-field">
                <label className="cp-label">Headquarters</label>
                <input className="cp-input" type="text" placeholder="e.g. Hyderabad, India" defaultValue="Hyderabad, India" />
              </div>
              <div className="cp-field">
                <label className="cp-label">Website</label>
                <input className="cp-input" type="url" placeholder="https://yourcompany.com" />
              </div>
              <div className="cp-field full">
                <label className="cp-label">About Company *</label>
                <textarea className="cp-textarea" placeholder="Tell candidates about your company culture, mission, and what makes you unique..." defaultValue="TechNova Solutions is a fast-growing SaaS company building next-generation productivity tools for modern teams. We believe in innovation, inclusivity, and giving our interns real responsibility from day one." />
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="cp-card">
            <div className="cp-card-title"><span></span> Contact Information</div>
            <div className="cp-form-grid">
              <div className="cp-field">
                <label className="cp-label">HR Contact Name</label>
                <input className="cp-input" type="text" placeholder="Full name" defaultValue="Rohan Kapoor" />
              </div>
              <div className="cp-field">
                <label className="cp-label">HR Email</label>
                <input className="cp-input" type="email" placeholder="hr@company.com" defaultValue="hr@technova.io" />
              </div>
              <div className="cp-field">
                <label className="cp-label">Phone Number</label>
                <input className="cp-input" type="tel" placeholder="+91 XXXXX XXXXX" defaultValue="+91 98765 43210" />
              </div>
              <div className="cp-field">
                <label className="cp-label">GST / CIN Number</label>
                <input className="cp-input" type="text" placeholder="Optional — for verified badge" />
              </div>
            </div>
          </div>

          {/* Social */}
          <div className="cp-card">
            <div className="cp-card-title"><span></span> Social & Web Presence</div>
            <div className="cp-social-grid">
              {[
                { icon: '', label: 'LinkedIn', placeholder: 'linkedin.com/company/...' },
                { icon: '', label: 'Twitter / X', placeholder: 'twitter.com/...' },
                { icon: '', label: 'Instagram', placeholder: 'instagram.com/...' },
                { icon: '', label: 'GitHub', placeholder: 'github.com/...' },
              ].map((s) => (
                <div key={s.label} className="cp-field">
                  <label className="cp-label">{s.label}</label>
                  <div className="cp-social-row">
                    <div className="cp-social-icon">{s.icon}</div>
                    <input className="cp-input" type="url" placeholder={s.placeholder} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Save */}
          <div className="cp-save-row">
            <button type="submit" className="cp-save-btn"> Save Profile</button>
            <span className={`cp-save-msg${saved ? ' show' : ''}`}> Profile saved successfully!</span>
          </div>
        </form>
      </div>
    </>
  );
}
