'use client';

import { useState } from "react";
import Link from "next/link";

type Role = "student" | "recruiter" | "investor" | "admin";
type Mode = "login" | "signup";

type FieldConfig = {
  icon: string;
  placeholder: string;
  type: "text" | "email" | "password";
  name: string;
};

type RoleConfig = {
  role: Role;
  label: string;
  shortLabel: string;
  badge: string;
  headline: [string, string];
  tagline: string;
  stats: { value: string; label: string }[];
  formTitle: string;
  formHint: string;
  loginFields: FieldConfig[];
  signupFields: FieldConfig[];
  accent: string;
  accentSoft: string;
  panelBg: string;
  glow: string;
};

const ROLES: RoleConfig[] = [
  {
    role: "student",
    label: "Student",
    shortLabel: "Student",
    badge: "AI-Powered Career Platform",
    headline: ["Learn. Build Skills.", "Get Hired."],
    tagline: "Join thousands of students and start your career journey today.",
    stats: [
      { value: "10K+", label: "Students" },
      { value: "2K+", label: "Companies" },
      { value: "15K+", label: "Opportunities" },
    ],
    formTitle: "Welcome Student!",
    formHint: "Login to your account or create a new one",
    loginFields: [
      { icon: "user", placeholder: "Email or Username", type: "text", name: "email" },
      { icon: "lock", placeholder: "Password", type: "password", name: "password" },
    ],
    signupFields: [
      { icon: "user", placeholder: "Full Name", type: "text", name: "fullName" },
      { icon: "mail", placeholder: "Email Address", type: "email", name: "email" },
      { icon: "lock", placeholder: "Password", type: "password", name: "password" },
      { icon: "lock", placeholder: "Confirm Password", type: "password", name: "confirmPassword" },
    ],
    accent: "#2563ff",
    accentSoft: "rgba(37, 99, 255, .17)",
    panelBg: "#020712",
    glow: "rgba(37, 99, 255, .45)",
  },
  {
    role: "recruiter",
    label: "Recruiter",
    shortLabel: "Recruiter",
    badge: "Hire Top Talent",
    headline: ["Find. Connect.", "Hire the Best."],
    tagline: "Access a pool of skilled candidates and build your dream team.",
    stats: [
      { value: "5K+", label: "Recruiters" },
      { value: "8K+", label: "Companies" },
      { value: "20K+", label: "Hires Made" },
    ],
    formTitle: "Welcome Recruiter!",
    formHint: "Login to your account or create a new one",
    loginFields: [
      { icon: "mail", placeholder: "Work Email", type: "email", name: "email" },
      { icon: "lock", placeholder: "Password", type: "password", name: "password" },
    ],
    signupFields: [
      { icon: "building", placeholder: "Company Name", type: "text", name: "companyName" },
      { icon: "mail", placeholder: "Work Email", type: "email", name: "email" },
      { icon: "lock", placeholder: "Password", type: "password", name: "password" },
      { icon: "lock", placeholder: "Confirm Password", type: "password", name: "confirmPassword" },
    ],
    accent: "#a855f7",
    accentSoft: "rgba(168, 85, 247, .17)",
    panelBg: "#080511",
    glow: "rgba(168, 85, 247, .48)",
  },
  {
    role: "investor",
    label: "Investor",
    shortLabel: "Investor",
    badge: "Invest in the Future",
    headline: ["Discover. Evaluate.", "Invest in Impact."],
    tagline: "Explore high-potential startups and AI-driven opportunities.",
    stats: [
      { value: "1K+", label: "Investors" },
      { value: "3K+", label: "Startups" },
      { value: "500+", label: "Deals Closed" },
    ],
    formTitle: "Welcome Investor!",
    formHint: "Login to your account or create a new one",
    loginFields: [
      { icon: "mail", placeholder: "Email Address", type: "email", name: "email" },
      { icon: "lock", placeholder: "Password", type: "password", name: "password" },
    ],
    signupFields: [
      { icon: "user", placeholder: "Full Name", type: "text", name: "fullName" },
      { icon: "mail", placeholder: "Email Address", type: "email", name: "email" },
      { icon: "building", placeholder: "Fund / Organization", type: "text", name: "organization" },
      { icon: "lock", placeholder: "Password", type: "password", name: "password" },
    ],
    accent: "#2fbf64",
    accentSoft: "rgba(47, 191, 100, .17)",
    panelBg: "#020d09",
    glow: "rgba(47, 191, 100, .44)",
  },
  {
    role: "admin",
    label: "Admin",
    shortLabel: "Admin",
    badge: "Secure the Platform",
    headline: ["Manage. Monitor.", "Keep It Secure."],
    tagline: "Power the platform and ensure a safe experience for everyone.",
    stats: [
      { value: "100%", label: "Secure" },
      { value: "24/7", label: "Monitoring" },
      { value: "99.9%", label: "Uptime" },
    ],
    formTitle: "Welcome Admin!",
    formHint: "Login to your account",
    loginFields: [
      { icon: "user", placeholder: "Admin Email", type: "email", name: "email" },
      { icon: "lock", placeholder: "Password", type: "password", name: "password" },
    ],
    signupFields: [
      { icon: "user", placeholder: "Admin Name", type: "text", name: "fullName" },
      { icon: "mail", placeholder: "Admin Email", type: "email", name: "email" },
      { icon: "key", placeholder: "Admin Invite Code", type: "text", name: "inviteCode" },
      { icon: "lock", placeholder: "Password", type: "password", name: "password" },
    ],
    accent: "#ef3434",
    accentSoft: "rgba(239, 52, 52, .17)",
    panelBg: "#120405",
    glow: "rgba(239, 52, 52, .44)",
  },
];

function MiniIcon({ name }: { name: string }) {
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round", strokeLinejoin: "round" } as const;

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="mini-icon">
      {name === "user" && <><circle cx="12" cy="8" r="3.4" {...common} /><path d="M5.8 20c.8-3.8 3-5.7 6.2-5.7s5.4 1.9 6.2 5.7" {...common} /></>}
      {name === "mail" && <><rect x="4" y="6" width="16" height="12" rx="2.2" {...common} /><path d="m5.5 8 6.5 5 6.5-5" {...common} /></>}
      {name === "lock" && <><rect x="5.8" y="10" width="12.4" height="9" rx="2" {...common} /><path d="M8.5 10V7.5a3.5 3.5 0 0 1 7 0V10" {...common} /></>}
      {name === "key" && <><circle cx="8" cy="12" r="3.2" {...common} /><path d="M11.2 12H20m-3 0v3m-3-3v2" {...common} /></>}
      {name === "building" && <><rect x="5" y="5" width="14" height="15" rx="1.8" {...common} /><path d="M9 9h.1M12 9h.1M15 9h.1M9 13h.1M12 13h.1M15 13h.1M10 20v-3h4v3" {...common} /></>}
      {name === "eye" && <><path d="M3.8 12s3-5 8.2-5 8.2 5 8.2 5-3 5-8.2 5-8.2-5-8.2-5Z" {...common} /><circle cx="12" cy="12" r="2.3" {...common} /></>}
      {name === "eyeOff" && <><path d="m4 4 16 16" {...common} /><path d="M9.6 6.5A8.7 8.7 0 0 1 12 6c5.2 0 8.2 6 8.2 6a13 13 0 0 1-2.1 3" {...common} /><path d="M6.2 8.3A13.7 13.7 0 0 0 3.8 12s3 6 8.2 6c.9 0 1.8-.2 2.6-.5" {...common} /></>}
    </svg>
  );
}

function FormField({ config, value, onChange }: { config: FieldConfig; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) {
  const [visible, setVisible] = useState(false);
  const isPassword = config.type === "password";
  const inputType = isPassword && visible ? "text" : config.type;

  return (
    <label className="field-wrap">
      <span className="field-icon"><MiniIcon name={config.icon} /></span>
      <input type={inputType} name={config.name} value={value} onChange={onChange} placeholder={config.placeholder} />
      {isPassword && (
        <button type="button" className="field-action" onClick={() => setVisible((next) => !next)} aria-label={visible ? "Hide password" : "Show password"}>
          <MiniIcon name={visible ? "eyeOff" : "eye"} />
        </button>
      )}
    </label>
  );
}

function BrandMark({ accent }: { accent: string }) {
  return (
    <div className="brand-mark">
      <span>step up</span>
      <span>for <b style={{ color: accent }}>AI</b></span>
    </div>
  );
}

function HeroVisual({ config }: { config: RoleConfig }) {
  const role = config.role;

  return (
    <div className={`hero-visual ${role}`}>
      <div className="person" />
      <div className="screen screen-one" />
      <div className="screen screen-two" />
      <div className="screen screen-three" />
      <svg className="hero-svg" viewBox="0 0 420 300" aria-hidden="true">
        <defs>
          <filter id={`glow-${role}`} x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        {role === "student" && <>
          <polygon points="230,118 274,144 274,196 230,222 186,196 186,144" fill="rgba(255,255,255,.03)" stroke={config.accent} strokeWidth="2" filter={`url(#glow-${role})`} />
          <text x="206" y="178" fill={config.accent} fontSize="32" fontWeight="800">AI</text>
          <path d="M102 180h55M274 148h58M230 118V65M202 208l-32 35" stroke={config.accent} strokeOpacity=".42" />
          <rect x="70" y="146" width="52" height="40" rx="5" stroke={config.accent} fill="rgba(255,255,255,.025)" strokeOpacity=".48" />
          <rect x="318" y="116" width="54" height="44" rx="5" stroke={config.accent} fill="rgba(255,255,255,.025)" strokeOpacity=".48" />
          <rect x="288" y="214" width="54" height="44" rx="5" stroke={config.accent} fill="rgba(255,255,255,.025)" strokeOpacity=".48" />
          <path d="M84 174h8v-16h10v16h8M331 141l10-9 10 9M302 242l11-14 9 8 11-18" stroke={config.accent} strokeOpacity=".75" fill="none" />
        </>}
        {role === "recruiter" && <>
          {[72, 152, 236, 322].map((x, i) => <g key={x} opacity={i === 2 ? .9 : .55}><rect x={x} y={80 + i * 12} width="62" height="86" rx="7" stroke={config.accent} fill="rgba(255,255,255,.025)" /><circle cx={x + 31} cy={106 + i * 12} r="12" fill="none" stroke={config.accent} /><path d={`M${x + 15} ${135 + i * 12}h32M${x + 18} ${149 + i * 12}h26`} stroke={config.accent} /></g>)}
          <path d="M90 224c62-46 139-47 226 0" stroke={config.accent} strokeOpacity=".32" fill="none" />
        </>}
        {role === "investor" && <>
          <circle cx="248" cy="143" r="78" fill="none" stroke={config.accent} strokeOpacity=".45" />
          <ellipse cx="248" cy="143" rx="78" ry="18" fill="none" stroke={config.accent} strokeOpacity=".3" />
          <path d="M170 143h156M248 65c-24 24-36 50-36 78s12 54 36 78M248 65c24 24 36 50 36 78s-12 54-36 78" stroke={config.accent} strokeOpacity=".24" fill="none" />
          <rect x="80" y="190" width="82" height="58" rx="6" stroke={config.accent} fill="rgba(255,255,255,.025)" strokeOpacity=".48" />
          <rect x="288" y="182" width="78" height="66" rx="6" stroke={config.accent} fill="rgba(255,255,255,.025)" strokeOpacity=".48" />
          <path d="M92 230l20-22 17 12 23-28M304 232V206M322 232v-38M340 232v-24" stroke={config.accent} strokeWidth="3" strokeOpacity=".7" fill="none" />
        </>}
        {role === "admin" && <>
          <path d="M230 52 290 82v70c0 48-60 84-60 84s-60-36-60-84V82l60-30Z" fill="rgba(255,255,255,.025)" stroke={config.accent} strokeWidth="3" filter={`url(#glow-${role})`} />
          <rect x="208" y="136" width="44" height="36" rx="5" fill="none" stroke={config.accent} strokeWidth="3" />
          <path d="M218 136v-16c0-16 24-16 24 0v16" fill="none" stroke={config.accent} strokeWidth="3" />
          <rect x="72" y="192" width="92" height="48" rx="6" stroke={config.accent} fill="rgba(255,255,255,.025)" strokeOpacity=".45" />
          <rect x="298" y="188" width="82" height="54" rx="6" stroke={config.accent} fill="rgba(255,255,255,.025)" strokeOpacity=".45" />
          <path d="M88 208h24M88 222h52M314 206h36M314 222h48" stroke={config.accent} strokeOpacity=".65" />
        </>}
      </svg>
    </div>
  );
}

function HeroPanel({ config, activeRole, setActiveRole }: { config: RoleConfig; activeRole: Role; setActiveRole: (role: Role) => void }) {
  return (
    <section className="hero-panel">
      <div className="hero-bg" />
      <div className="hero-top">
        <BrandMark accent={config.accent} />
        <div className="role-switch" aria-label="Choose role">
          {ROLES.map((role) => (
            <button key={role.role} type="button" onClick={() => setActiveRole(role.role)} className={activeRole === role.role ? "active" : ""} style={{ "--role-accent": role.accent } as React.CSSProperties}>
              {role.shortLabel}
            </button>
          ))}
        </div>
      </div>

      <div className="hero-copy">
        <span className="badge">{config.badge}</span>
        <h1>{config.headline[0]}<span>{config.headline[1]}</span></h1>
        <p>{config.tagline}</p>
      </div>

      <HeroVisual config={config} />

      <div className="stat-row">
        {config.stats.map((stat) => <div key={stat.label}><strong>{stat.value}</strong><span>{stat.label}</span></div>)}
      </div>
    </section>
  );
}

function AuthPanel({ config, mode, formData, handleInputChange, handleSubmit }: { config: RoleConfig; mode: Mode; formData: Record<string, string>; handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void; handleSubmit: (e: React.FormEvent) => void }) {
  const fields = mode === "login" ? config.loginFields : config.signupFields;
  const submitLabel = mode === "login" ? "Login" : config.role === "admin" ? "Create Admin Account" : "Create Account";

  return (
    <section className="auth-panel">
      <h2>{config.formTitle}</h2>
      <p>{mode === "login" ? config.formHint : "Create your account to get started"}</p>

      <div className="tabs">
        <Link href="/login" className={mode === "login" ? "selected" : ""}>Login</Link>
        <Link href="/signup" className={mode === "signup" ? "selected" : ""}>Sign Up</Link>
      </div>

      <form onSubmit={handleSubmit}>
        {fields.map((field) => <FormField key={field.name + field.placeholder} config={field} value={formData[field.name] ?? ""} onChange={handleInputChange} />)}

        {mode === "login" ? (
          <div className="form-row">
            <label><input type="checkbox" /> <span>Remember me</span></label>
            <Link href="#">Forgot Password?</Link>
          </div>
        ) : (
          <label className="terms"><input type="checkbox" /> <span>I agree to the <Link href="#">Terms &amp; Conditions</Link></span></label>
        )}

        <button className="submit-button" type="submit">{submitLabel}</button>
      </form>

      <div className="divider"><span />{mode === "login" ? "or continue with" : "or sign up with"}<span /></div>
      <div className="social-row">
        <button type="button"><span className="google-mark">G</span>Google</button>
        <button type="button"><span className="github-mark">GH</span>GitHub</button>
      </div>

      <p className="switch-copy">
        {mode === "login" ? "Don't have an account? " : "Already have an account? "}
        <Link href={mode === "login" ? "/signup" : "/login"}>{mode === "login" ? "Sign up" : "Login"}</Link>
      </p>
    </section>
  );
}

export default function AuthExperience({ mode }: { mode: Mode }) {
  const [activeRole, setActiveRole] = useState<Role>("student");
  const [formData, setFormData] = useState<Record<string, string>>({
    fullName: "",
    companyName: "",
    organization: "",
    inviteCode: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const config = ROLES.find((role) => role.role === activeRole)!;

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
  };

  return (
    <main className="auth-shell" style={{ "--accent": config.accent, "--accent-soft": config.accentSoft, "--hero-bg": config.panelBg, "--hero-glow": config.glow } as React.CSSProperties}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; }
        .auth-shell { min-height: 100vh; padding: 18px; display: grid; place-items: center; font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; color: #f8fafc; background: radial-gradient(circle at 28% 50%, var(--hero-glow), transparent 34%), radial-gradient(circle at 80% 18%, rgba(255,255,255,.05), transparent 24%), #02040a; }
        .auth-layout { width: min(1180px, 100%); min-height: min(650px, calc(100vh - 36px)); display: grid; grid-template-columns: minmax(0, 1.1fr) minmax(380px, .82fr); background: rgba(3, 8, 18, .96); border: 1px solid rgba(148, 163, 184, .15); overflow: hidden; box-shadow: 0 30px 90px rgba(0,0,0,.54); }
        .hero-panel { position: relative; min-height: 610px; padding: 38px 44px 34px; display: flex; flex-direction: column; justify-content: space-between; background: var(--hero-bg); overflow: hidden; }
        .hero-bg { position: absolute; inset: 0; background: linear-gradient(90deg, rgba(2,6,23,.98) 0%, rgba(2,6,23,.76) 48%, rgba(2,6,23,.18) 100%), radial-gradient(circle at 67% 53%, var(--hero-glow), transparent 30%), linear-gradient(180deg, rgba(255,255,255,.035), transparent 38%); }
        .hero-top, .hero-copy, .stat-row, .hero-visual { position: relative; z-index: 1; }
        .hero-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 20px; }
        .brand-mark { display: grid; gap: 0; color: white; font-weight: 800; font-size: 22px; line-height: .98; }
        .brand-mark b { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; }
        .role-switch { display: flex; gap: 4px; padding: 4px; max-width: 360px; overflow-x: auto; background: rgba(7, 12, 24, .68); border: 1px solid rgba(148, 163, 184, .12); border-radius: 8px; }
        .role-switch button { border: 1px solid transparent; background: transparent; color: #7f8ca3; cursor: pointer; border-radius: 6px; padding: 7px 10px; font: 600 11px/1 Inter, sans-serif; white-space: nowrap; }
        .role-switch button.active { color: var(--role-accent); background: color-mix(in srgb, var(--role-accent) 14%, transparent); border-color: color-mix(in srgb, var(--role-accent) 34%, transparent); }
        .hero-copy { margin-top: 72px; max-width: 360px; }
        .badge { display: inline-flex; align-items: center; min-height: 28px; padding: 0 12px; margin-bottom: 24px; border: 1px solid color-mix(in srgb, var(--accent) 26%, transparent); border-radius: 6px; background: var(--accent-soft); color: var(--accent); font-size: 12px; font-weight: 700; }
        .hero-copy h1 { margin: 0; color: #fff; font-size: clamp(32px, 4vw, 46px); line-height: 1.08; font-weight: 800; letter-spacing: 0; }
        .hero-copy h1 span { display: block; color: var(--accent); }
        .hero-copy p { max-width: 300px; margin: 16px 0 0; color: #a7b0c0; font-size: 15px; line-height: 1.7; }
        .hero-visual { position: absolute; inset: 145px 34px 90px 38px; pointer-events: none; }
        .hero-svg { position: absolute; right: 0; bottom: 0; width: min(72%, 480px); height: auto; opacity: .88; overflow: visible; }
        .person { position: absolute; left: 52px; bottom: 0; width: 130px; height: 228px; border-radius: 48% 48% 8px 8px; background: radial-gradient(circle at 52% 12%, rgba(220,230,255,.32) 0 8%, transparent 9%), linear-gradient(105deg, rgba(255,255,255,.06), rgba(255,255,255,0) 44%), linear-gradient(180deg, color-mix(in srgb, var(--accent) 28%, #060914), #02040a 68%); box-shadow: 0 0 42px color-mix(in srgb, var(--accent) 36%, transparent); clip-path: polygon(35% 0, 66% 0, 78% 18%, 76% 36%, 92% 52%, 100% 100%, 0 100%, 8% 52%, 24% 36%, 22% 18%); opacity: .76; }
        .screen { position: absolute; border: 1px solid color-mix(in srgb, var(--accent) 48%, transparent); background: color-mix(in srgb, var(--accent) 8%, transparent); box-shadow: inset 0 0 24px rgba(255,255,255,.025), 0 0 24px color-mix(in srgb, var(--accent) 18%, transparent); }
        .screen-one { width: 108px; height: 70px; right: 24%; top: 26%; border-radius: 7px; transform: rotate(-7deg); }
        .screen-two { width: 78px; height: 96px; right: 7%; top: 36%; border-radius: 7px; transform: rotate(3deg); }
        .screen-three { width: 112px; height: 56px; right: 34%; bottom: 8%; border-radius: 7px; transform: rotate(4deg); }
        .stat-row { display: flex; gap: 34px; align-items: flex-end; }
        .stat-row div { min-width: 84px; border-right: 1px solid rgba(148, 163, 184, .16); }
        .stat-row div:last-child { border-right: 0; }
        .stat-row strong { display: block; color: var(--accent); font-size: 22px; line-height: 1; }
        .stat-row span { display: block; color: #a7b0c0; font-size: 12px; margin-top: 8px; }
        .auth-panel { align-self: center; justify-self: center; width: min(430px, calc(100% - 48px)); padding: 36px; border-radius: 8px; border: 1px solid rgba(148, 163, 184, .13); background: rgba(9, 15, 27, .88); box-shadow: 0 26px 70px rgba(0, 0, 0, .35), inset 0 1px 0 rgba(255,255,255,.035); backdrop-filter: blur(18px); }
        .auth-panel h2 { margin: 0 0 8px; font-size: 22px; font-weight: 800; letter-spacing: 0; }
        .auth-panel p { margin: 0 0 26px; color: #a7b0c0; font-size: 13px; }
        .tabs { display: grid; grid-template-columns: 1fr 1fr; margin-bottom: 20px; border-bottom: 1px solid rgba(148, 163, 184, .12); }
        .tabs a { color: #cbd5e1; text-align: center; text-decoration: none; padding: 11px 0; font-size: 13px; font-weight: 600; border-bottom: 2px solid transparent; }
        .tabs a.selected { color: var(--accent); border-bottom-color: var(--accent); }
        .field-wrap { position: relative; display: block; margin-bottom: 14px; }
        .field-wrap input { width: 100%; height: 48px; padding: 0 45px; border: 1px solid rgba(148, 163, 184, .13); border-radius: 6px; background: rgba(5, 10, 20, .74); color: #f8fafc; outline: none; font: 500 13px/1 Inter, sans-serif; transition: border-color .2s, box-shadow .2s, background .2s; }
        .field-wrap input::placeholder { color: #7f8ca3; }
        .field-wrap input:focus { border-color: color-mix(in srgb, var(--accent) 62%, transparent); box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 13%, transparent); background: rgba(8, 14, 27, .92); }
        .field-icon, .field-action { position: absolute; top: 50%; transform: translateY(-50%); color: #7f8ca3; }
        .field-icon { left: 16px; }
        .field-action { right: 14px; width: 24px; height: 24px; border: 0; padding: 0; display: grid; place-items: center; background: transparent; cursor: pointer; }
        .mini-icon { width: 17px; height: 17px; display: block; }
        .form-row, .terms { display: flex; align-items: center; gap: 10px; margin: 8px 0 20px; color: #cbd5e1; font-size: 12px; }
        .form-row { justify-content: space-between; }
        .form-row label, .terms { cursor: pointer; }
        .form-row a, .terms a, .switch-copy a { color: var(--accent); text-decoration: none; }
        input[type="checkbox"] { width: 14px; height: 14px; margin: 0; accent-color: var(--accent); }
        .submit-button { width: 100%; height: 48px; border: 0; border-radius: 6px; background: linear-gradient(90deg, color-mix(in srgb, var(--accent) 82%, #111827), var(--accent)); color: white; cursor: pointer; font: 800 14px/1 Inter, sans-serif; box-shadow: 0 14px 34px color-mix(in srgb, var(--accent) 23%, transparent); }
        .divider { display: flex; align-items: center; gap: 12px; margin: 22px 0 16px; color: #a7b0c0; font-size: 12px; }
        .divider span { height: 1px; flex: 1; background: rgba(148, 163, 184, .12); }
        .social-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .social-row button { height: 46px; border: 1px solid rgba(148, 163, 184, .13); border-radius: 6px; background: rgba(5, 10, 20, .58); color: #f8fafc; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; gap: 9px; font: 700 13px/1 Inter, sans-serif; }
        .google-mark { color: #4285f4; font-size: 18px; font-weight: 800; }
        .github-mark { width: 22px; height: 22px; border-radius: 50%; display: grid; place-items: center; background: white; color: #111827; font-size: 8px; font-weight: 900; }
        .switch-copy { text-align: center; margin: 20px 0 0 !important; }
        @media (max-width: 920px) { .auth-layout { grid-template-columns: 1fr; } .hero-panel { min-height: 520px; } .auth-panel { width: min(520px, calc(100% - 32px)); margin: 28px 0; } }
        @media (max-width: 620px) { .auth-shell { padding: 0; place-items: stretch; } .auth-layout { min-height: 100vh; border: 0; } .hero-panel { min-height: 500px; padding: 28px 22px; } .hero-top { flex-direction: column; } .role-switch { width: 100%; } .hero-copy { margin-top: 38px; } .hero-visual { inset: 180px 12px 82px 12px; } .person { left: 18px; width: 108px; height: 190px; } .hero-svg { width: 82%; } .stat-row { gap: 14px; justify-content: space-between; } .stat-row div { min-width: 0; flex: 1; } .auth-panel { width: calc(100% - 28px); padding: 26px 18px; } }
      `}</style>
      <div className="auth-layout">
        <HeroPanel config={config} activeRole={activeRole} setActiveRole={setActiveRole} />
        <AuthPanel config={config} mode={mode} formData={formData} handleInputChange={handleInputChange} handleSubmit={handleSubmit} />
      </div>
    </main>
  );
}
