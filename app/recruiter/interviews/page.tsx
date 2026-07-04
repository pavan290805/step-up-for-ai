'use client';

const IS_PREMIUM = true;

import { useState } from 'react';
import PremiumGate from '@/Components/recruiter/PremiumGate';

const SCHEDULED = [
  { id: 1, name: 'Arjun Sharma', role: 'Frontend Developer Intern', date: 'Jul 5, 2026', time: '10:00 AM', type: 'Video Call', status: 'Confirmed', avatar: 'A' },
  { id: 2, name: 'Priya Mehta', role: 'Data Science Intern', date: 'Jul 6, 2026', time: '2:30 PM', type: 'Video Call', status: 'Pending', avatar: 'P' },
  { id: 3, name: 'Rohan Gupta', role: 'Backend Dev Intern', date: 'Jul 8, 2026', time: '11:00 AM', type: 'Phone Call', status: 'Confirmed', avatar: 'R' },
];

const CALENDAR_DAYS = Array.from({ length: 31 }, (_, i) => i + 1);
const BUSY_DAYS = [5, 6, 8, 14, 19, 22];

function PremiumContent() {
  const [step, setStep] = useState(0);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedType, setSelectedType] = useState('Video Call');
  const [sent, setSent] = useState(false);

  const send = () => {
    if (selectedDay && selectedTime) { setSent(true); setTimeout(() => { setSent(false); setStep(0); setSelectedDay(null); setSelectedTime(''); }, 2500); }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        .iv-page { font-family: Inter, sans-serif; }
        .iv-header { margin-bottom: 28px; }
        .iv-title { font-size: 26px; font-weight: 800; color: #e8faf0; letter-spacing: -.02em; }
        .iv-sub { font-size: 13px; color: #4a8a5e; margin-top: 4px; }
        .iv-layout { display: grid; grid-template-columns: 1fr 380px; gap: 24px; }
        .iv-panel { background: linear-gradient(145deg,rgba(4,18,8,.9),rgba(2,12,5,.9)); border: 1px solid rgba(47,191,100,.15); border-radius: 22px; padding: 28px; }
        .iv-panel-title { font-size: 15px; font-weight: 700; color: #d4f5e2; margin-bottom: 22px; }
        .iv-scheduled-list { display: flex; flex-direction: column; gap: 12px; }
        .iv-sched-card { display: flex; align-items: center; gap: 16px; padding: 16px; border-radius: 14px; background: rgba(47,191,100,.06); border: 1px solid rgba(47,191,100,.12); transition: all .2s; }
        .iv-sched-card:hover { border-color: rgba(47,191,100,.3); background: rgba(47,191,100,.1); }
        .iv-av { width: 42px; height: 42px; border-radius: 12px; background: linear-gradient(135deg,#2fbf64,#1a9e4a); display:grid; place-items:center; font-size:15px; font-weight:700; color:#fff; flex-shrink:0; }
        .iv-info { flex: 1; }
        .iv-name { font-size: 14px; font-weight: 700; color: #e8faf0; }
        .iv-role { font-size: 12px; color: #4a8a5e; margin-top: 2px; }
        .iv-datetime { font-size: 12px; color: #6ee09c; font-weight: 600; margin-top: 4px; display: flex; align-items: center; gap: 6px; }
        .iv-status { font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: 20px; flex-shrink: 0; }
        .iv-status.confirmed { background: rgba(34,197,94,.15); color: #86efac; }
        .iv-status.pending { background: rgba(251,191,36,.12); color: #fbbf24; }
        .iv-cal-header { display: grid; grid-template-columns: repeat(7,1fr); gap: 4px; margin-bottom: 6px; }
        .iv-cal-day-label { text-align: center; font-size: 11px; font-weight: 700; color: #3d6b52; text-transform: uppercase; }
        .iv-cal-grid { display: grid; grid-template-columns: repeat(7,1fr); gap: 4px; }
        .iv-cal-day { aspect-ratio: 1; border-radius: 10px; display:grid; place-items:center; font-size: 13px; font-weight: 600; cursor: pointer; border: 1px solid transparent; transition: all .15s; color: #5cb87a; }
        .iv-cal-day:hover { background: rgba(47,191,100,.15); color: #d4f5e2; }
        .iv-cal-day.busy { background: rgba(47,191,100,.08); border-color: rgba(47,191,100,.2); color: #6ee09c; position: relative; }
        .iv-cal-day.busy::after { content: ''; position: absolute; bottom: 4px; left: 50%; transform: translateX(-50%); width: 4px; height: 4px; border-radius: 50%; background: #2fbf64; }
        .iv-cal-day.selected { background: linear-gradient(135deg,#2fbf64,#1a9e4a); color: #fff; border-color: transparent; box-shadow: 0 4px 12px rgba(47,191,100,.4); }
        .iv-wizard { margin-top: 22px; }
        .iv-wiz-label { font-size: 12px; font-weight: 600; color: #5cb87a; text-transform: uppercase; letter-spacing: .04em; margin-bottom: 10px; }
        .iv-time-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 16px; }
        .iv-time-btn { padding: 10px; border-radius: 10px; border: 1px solid rgba(47,191,100,.2); background: rgba(47,191,100,.06); color: #c4b5e4; font: 600 13px Inter; cursor: pointer; transition: all .15s; }
        .iv-time-btn:hover { background: rgba(47,191,100,.14); }
        .iv-time-btn.selected { background: rgba(47,191,100,.25); border-color: rgba(47,191,100,.55); color: #d4f5e2; }
        .iv-type-row { display: flex; gap: 8px; margin-bottom: 18px; }
        .iv-type-btn { flex: 1; padding: 9px; border-radius: 10px; border: 1px solid rgba(47,191,100,.2); background: rgba(47,191,100,.06); color: #c4b5e4; font: 600 12px Inter; cursor: pointer; transition: all .15s; }
        .iv-type-btn.selected { background: rgba(47,191,100,.22); border-color: rgba(47,191,100,.5); color: #d4f5e2; }
        .iv-send-btn { width: 100%; padding: 13px; border-radius: 12px; background: linear-gradient(135deg,#2fbf64,#1a9e4a); color:#fff; font: 700 14px Inter; border: none; cursor: pointer; transition: all .2s; box-shadow: 0 8px 22px rgba(47,191,100,.38); }
        .iv-send-btn:hover { transform: translateY(-2px); }
        .iv-send-btn:disabled { opacity:.5; cursor:not-allowed; transform:none; }
        .iv-sent-msg { display: flex; align-items: center; gap: 8px; padding: 12px 16px; border-radius: 12px; background: rgba(34,197,94,.1); border: 1px solid rgba(34,197,94,.25); color: #86efac; font: 700 13px Inter; margin-top: 12px; animation: fadeIn .3s; }
        @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
        @media (max-width: 900px) { .iv-layout { grid-template-columns: 1fr; } }
      `}</style>
      <div className="iv-page">
        <div className="iv-header">
          <h1 className="iv-title">Interview Scheduling</h1>
          <p className="iv-sub">Automate interview invites and manage your calendar seamlessly.</p>
        </div>

        <div className="iv-layout">
          {/* Scheduled list */}
          <div className="iv-panel">
            <div className="iv-panel-title">📅 Upcoming Interviews</div>
            <div className="iv-scheduled-list">
              {SCHEDULED.map(s => (
                <div className="iv-sched-card" key={s.id}>
                  <div className="iv-av">{s.avatar}</div>
                  <div className="iv-info">
                    <div className="iv-name">{s.name}</div>
                    <div className="iv-role">{s.role}</div>
                    <div className="iv-datetime">
                      <span>📅 {s.date}</span>
                      <span>⏰ {s.time}</span>
                      <span>🎥 {s.type}</span>
                    </div>
                  </div>
                  <div className={`iv-status ${s.status.toLowerCase()}`}>{s.status}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Scheduler */}
          <div className="iv-panel">
            <div className="iv-panel-title">🗓 Schedule New Interview — July 2026</div>
            <div className="iv-cal-header">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                <div key={i} className="iv-cal-day-label">{d}</div>
              ))}
            </div>
            <div className="iv-cal-grid">
              {/* Empty offset for July starting on Wednesday (index 3) */}
              {[0,1,2].map(i => <div key={`empty-${i}`} />)}
              {CALENDAR_DAYS.map(day => (
                <div
                  key={day}
                  className={`iv-cal-day${BUSY_DAYS.includes(day) ? ' busy' : ''}${selectedDay === day ? ' selected' : ''}`}
                  onClick={() => setSelectedDay(day === selectedDay ? null : day)}
                >
                  {day}
                </div>
              ))}
            </div>

            {selectedDay && (
              <div className="iv-wizard">
                <div className="iv-wiz-label">Select Time for July {selectedDay}</div>
                <div className="iv-time-grid">
                  {['9:00 AM', '10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM'].map(t => (
                    <button key={t} className={`iv-time-btn${selectedTime === t ? ' selected' : ''}`} onClick={() => setSelectedTime(t)}>{t}</button>
                  ))}
                </div>
                <div className="iv-wiz-label">Interview Type</div>
                <div className="iv-type-row">
                  {['Video Call', 'Phone Call', 'In-Person'].map(ty => (
                    <button key={ty} className={`iv-type-btn${selectedType === ty ? ' selected' : ''}`} onClick={() => setSelectedType(ty)}>{ty}</button>
                  ))}
                </div>
                <button className="iv-send-btn" onClick={send} disabled={!selectedTime}>
                  📩 Send Interview Invite
                </button>
                {sent && <div className="iv-sent-msg">✓ Invite sent! The candidate will be notified.</div>}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default function InterviewsPage() {
  if (!IS_PREMIUM) return (
    <PremiumGate
      feature="Automated Interview Scheduling"
      description="Send interview invites automatically, manage your calendar, and let candidates pick their preferred slot — all in one place."
    />
  );
  return <PremiumContent />;
}
