'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { href: '/recruiter', label: 'Dashboard', icon: 'grid', exact: true },
  { href: '/recruiter/profile', label: 'Company Profile', icon: 'building' },
  { href: '/recruiter/listings', label: 'Listings', icon: 'briefcase' },
  { href: '/recruiter/candidates', label: 'Candidates', icon: 'users' },
  { href: '/recruiter/applicants', label: 'Applicant Tracking', icon: 'kanban' },
  { href: '/recruiter/ai-ranking', label: 'AI Ranking', icon: 'sparkles' },
  { href: '/recruiter/jd-generator', label: 'JD Generator', icon: 'wand' },
  { href: '/recruiter/matching', label: 'Smart Matching', icon: 'target' },
  { href: '/recruiter/analytics', label: 'Analytics', icon: 'chart' },
  { href: '/recruiter/interviews', label: 'Interviews', icon: 'calendar' },
  { href: '/recruiter/pricing', label: 'Pricing', icon: 'star' },
];

function NavIcon({ name }: { name: string }) {
  const s = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  return (
    <svg viewBox="0 0 24 24" width={18} height={18} aria-hidden="true" style={{ flexShrink: 0 }}>
      {name === 'grid' && <><rect x="3" y="3" width="7" height="7" rx="1.5" {...s} /><rect x="14" y="3" width="7" height="7" rx="1.5" {...s} /><rect x="3" y="14" width="7" height="7" rx="1.5" {...s} /><rect x="14" y="14" width="7" height="7" rx="1.5" {...s} /></>}
      {name === 'building' && <><rect x="4" y="4" width="16" height="17" rx="2" {...s} /><path d="M9 9h.01M12 9h.01M15 9h.01M9 13h.01M12 13h.01M15 13h.01M10 21v-4h4v4" {...s} /></>}
      {name === 'briefcase' && <><rect x="3" y="8" width="18" height="13" rx="2" {...s} /><path d="M8 8V6a4 4 0 0 1 8 0v2" {...s} /><path d="M3 14h18" {...s} /></>}
      {name === 'users' && <><circle cx="9" cy="7" r="3" {...s} /><path d="M3 21v-1a6 6 0 0 1 6-6h.5" {...s} /><circle cx="17" cy="11" r="3" {...s} /><path d="M21 21v-1a6 6 0 0 0-6-6h-.5" {...s} /></>}
      {name === 'kanban' && <><rect x="3" y="3" width="5" height="18" rx="1.5" {...s} /><rect x="10" y="3" width="5" height="11" rx="1.5" {...s} /><rect x="17" y="3" width="5" height="15" rx="1.5" {...s} /></>}
      {name === 'sparkles' && <><path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5z" {...s} /><path d="M5 19l.8 2.2L8 22l-2.2.8L5 25" {...s} /><path d="M19 3l.8 2.2L22 6l-2.2.8L19 9" {...s} /></>}
      {name === 'wand' && <><path d="m15 5 4 4" {...s} /><path d="M4 20 15 9" {...s} /><path d="m7.5 7.5 1-1" {...s} /><path d="m16 3 1-1" {...s} /><path d="m3 16 1-1" {...s} /><path d="m3 8 1 1" {...s} /><path d="M20 16l1 1" {...s} /></>}
      {name === 'target' && <><circle cx="12" cy="12" r="10" {...s} /><circle cx="12" cy="12" r="6" {...s} /><circle cx="12" cy="12" r="2" {...s} /></>}
      {name === 'chart' && <><path d="M3 3v18h18" {...s} /><path d="M18 9l-5 5-4-4-3 3" {...s} /></>}
      {name === 'calendar' && <><rect x="3" y="4" width="18" height="18" rx="2" {...s} /><path d="M16 2v4M8 2v4M3 10h18" {...s} /></>}
      {name === 'star' && <><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" {...s} /></>}
      {name === 'menu' && <><path d="M4 6h16M4 12h16M4 18h16" {...s} /></>}
      {name === 'x' && <><path d="M18 6 6 18M6 6l12 12" {...s} /></>}
    </svg>
  );
}

function LogoIcon() {
  return (
    <img 
      src="/logos/logo-recruiter.jpeg" 
      alt="StepUp Logo" 
      className="r-logo-img"
      style={{ width: '160px', height: 'auto', borderRadius: '12px', flexShrink: 0 }} 
    />
  );
}

export default function RecruiterLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; }
        .r-shell { min-height: 100vh; display: flex; background: #080511; font-family: Inter, ui-sans-serif, system-ui, sans-serif; color: #f1eeff; }
        .r-sidebar { width: 260px; min-height: 100vh; background: linear-gradient(180deg, #0d0718 0%, #08041a 100%); border-right: 1px solid rgba(168, 85, 247,.12); display: flex; flex-direction: column; position: sticky; top: 0; height: 100vh; overflow-y: auto; z-index: 100; flex-shrink: 0; }
        .r-sidebar-logo { padding: 32px 20px 24px; display: flex; justify-content: center; border-bottom: 1px solid rgba(168, 85, 247,.08); }
        .r-logo-text { display: none; }
        .r-nav { flex: 1; padding: 12px 12px 8px; display: flex; flex-direction: column; gap: 2px; }
        .r-nav-item { display: flex; align-items: center; gap: 12px; padding: 10px 12px; border-radius: 10px; color: #5a8868; font-size: 13.5px; font-weight: 500; text-decoration: none; transition: all .15s; position: relative; }
        .r-nav-item:hover { color: #c8f0d4; background: rgba(168, 85, 247,.07); }
        .r-nav-item.active { color: #e0faec; background: rgba(168, 85, 247,.14); font-weight: 600; }
        .r-nav-item.active::before { content:''; position:absolute; left:0; top:50%; transform:translateY(-50%); height:55%; width:3px; border-radius:0 3px 3px 0; background:#a855f7; }
        .r-main { flex: 1; min-width: 0; display: flex; flex-direction: column; }
        .r-topbar { display: none; padding: 16px 20px; background: rgba(6,13,8,.95); border-bottom: 1px solid rgba(168, 85, 247,.1); align-items: center; gap: 16px; position: sticky; top: 0; z-index: 50; backdrop-filter: blur(12px); }
        .r-topbar-btn { border: none; background: transparent; color: #5a8868; cursor: pointer; padding: 6px; border-radius: 8px; display: grid; place-items: center; }
        .r-topbar-btn:hover { background: rgba(168, 85, 247,.1); color: #c084fc; }
        .r-topbar-title { font-size: 16px; font-weight: 700; color: #f1eeff; }
        .r-content { flex: 1; padding: 36px 40px; }
        .r-overlay { display: none; position: fixed; inset: 0; background: rgba(0,0,0,.7); z-index: 90; backdrop-filter: blur(4px); }
        @media (max-width: 900px) {
          .r-sidebar { position: fixed; top: 0; left: 0; transform: translateX(-100%); transition: transform .3s; height: 100vh; z-index: 100; }
          .r-sidebar.open { transform: translateX(0); }
          .r-overlay { display: block; }
          .r-topbar { display: flex; }
          .r-content { padding: 24px 20px; }
        }
      `}</style>
      <div className="r-shell">
        {sidebarOpen && <div className="r-overlay" onClick={() => setSidebarOpen(false)} />}

        <aside className={`r-sidebar${sidebarOpen ? ' open' : ''}`}>
          <div className="r-sidebar-logo">
            <LogoIcon />
          </div>

          <nav className="r-nav">
            {NAV_ITEMS.map((item) => {
              const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`r-nav-item${isActive ? ' active' : ''}`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <NavIcon name={item.icon} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        <main className="r-main">
          <div className="r-topbar">
            <button className="r-topbar-btn" onClick={() => setSidebarOpen(true)} aria-label="Open menu">
              <NavIcon name="menu" />
            </button>
            <span className="r-topbar-title">StepUp Recruiter</span>
          </div>
          <div className="r-content">
            {children}
          </div>
        </main>
      </div>
    </>
  );
}
