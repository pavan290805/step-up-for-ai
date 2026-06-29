'use client';

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

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
  formTitle: string;
  formHint: string;
  loginFields: FieldConfig[];
  signupFields: FieldConfig[];
  accent: string;
  accentSoft: string;
  panelBg: string;
  glow: string;
  logoSrc: string;
  heroImg: string;
};

const ROLES: RoleConfig[] = [
  {
    role: "student",
    label: "Student",
    shortLabel: "Student",
    badge: "AI-Powered Career Platform",
    headline: ["Learn. Build Skills.", "Get Hired."],
    tagline: "Join thousands of students and start your career journey today.",
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
    glow: "rgba(37, 99, 255, .16)",
    logoSrc: "/logos/logo-student.jpeg",
    heroImg: "/heroes/student.jpeg",
  },
  {
    role: "recruiter",
    label: "Recruiter",
    shortLabel: "Recruiter",
    badge: "Hire Top Talent",
    headline: ["Find. Connect.", "Hire the Best."],
    tagline: "Access a pool of skilled candidates and build your dream team.",
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
    glow: "rgba(168, 85, 247, .16)",
    logoSrc: "/logos/logo-recruiter.jpeg",
    heroImg: "/heroes/recruiter.jpeg",
  },
  {
    role: "investor",
    label: "Investor",
    shortLabel: "Investor",
    badge: "Invest in the Future",
    headline: ["Discover. Evaluate.", "Invest in Impact."],
    tagline: "Explore high-potential startups and AI-driven opportunities.",
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
    glow: "rgba(47, 191, 100, .16)",
    logoSrc: "/logos/logo-investor.jpeg",
    heroImg: "/heroes/investor.jpeg",
  },
  {
    role: "admin",
    label: "Admin",
    shortLabel: "Admin",
    badge: "Secure the Platform",
    headline: ["Manage. Monitor.", "Keep It Secure."],
    tagline: "Power the platform and ensure a safe experience for everyone.",
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
    glow: "rgba(239, 52, 52, .16)",
    logoSrc: "/logos/logo-admin.jpeg",
    heroImg: "/heroes/admin.jpeg",
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

function HeroVisual({ config }: { config: RoleConfig }) {
  return (
    <div className="hero-visual">
      <img src={config.heroImg} alt={`${config.label} hero visual`} />
    </div>
  );
}

function HeroPanel({ config, activeRole, setActiveRole }: { config: RoleConfig; activeRole: Role; setActiveRole: (role: Role) => void }) {
  return (
    <section className="hero-panel">
      <HeroVisual config={config} />
      <div className="hero-overlay" />
      <div className="hero-frame">
        <div className="role-switch" aria-label="Choose role">
          {ROLES.map((role) => (
            <button key={role.role} type="button" onClick={() => setActiveRole(role.role)} className={activeRole === role.role ? "active" : ""} style={{ "--role-accent": role.accent } as React.CSSProperties}>
              {role.shortLabel}
            </button>
          ))}
        </div>
      </div>
      <div className="hero-copy" key={config.role}>
        <span className="hero-badge">{config.badge}</span>
        <h1>{config.headline[0]}<br /><span>{config.headline[1]}</span></h1>
        <p>{config.tagline}</p>
      </div>
    </section>
  );
}

function AuthPanel({ config, mode, activeRole, formData, handleInputChange, handleSubmit }: { config: RoleConfig; mode: Mode; activeRole: Role; formData: Record<string, string>; handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void; handleSubmit: (e: React.FormEvent) => void }) {
  const fields = mode === "login" ? config.loginFields : config.signupFields;
  const submitLabel = mode === "login" ? "Login" : config.role === "admin" ? "Create Admin Account" : "Create Account";

  return (
    <section className="auth-panel">
      <h2>{config.formTitle}</h2>
      <p className="subtitle">{mode === "login" ? config.formHint : "Create your account to get started"}</p>

      <div className="tabs">
        <Link href={`/login?role=${activeRole}`} className={mode === "login" ? "selected" : ""}>Login</Link>
        <Link href={`/signup?role=${activeRole}`} className={mode === "signup" ? "selected" : ""}>Sign Up</Link>
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
        <button type="button"><span className="github-mark">in</span>LinkedIn</button>
      </div>

      <p className="switch-copy">
        {mode === "login" ? "Don't have an account? " : "Already have an account? "}
        <Link href={mode === "login" ? `/signup?role=${activeRole}` : `/login?role=${activeRole}`}>{mode === "login" ? "Sign up" : "Login"}</Link>
      </p>
    </section>
  );
}

export default function AuthExperience({ mode }: { mode: Mode }) {
  const searchParams = useSearchParams();
  const urlRole = searchParams?.get("role") as Role | null;
  const initialRole = urlRole && ROLES.some((role) => role.role === urlRole) ? urlRole : "student";
  const [activeRole, setActiveRole] = useState<Role>(initialRole);
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
    <main className="auth-shell" style={{ "--accent": config.accent, "--accent-soft": config.accentSoft, "--hero-bg": config.panelBg, "--hero-glow": config.glow, "--hero-img": `url(${config.heroImg})` } as React.CSSProperties}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; }
.auth-shell { min-height: 100vh; width: 100%; padding: 28px; display: grid; place-items: center; font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; color: #f8fafc; background-image: radial-gradient(circle at 28% 50%, var(--hero-glow), transparent 34%), radial-gradient(circle at 80% 18%, rgba(255,255,255,.05), transparent 24%), linear-gradient(180deg, rgba(0,0,0,.35), rgba(0,0,0,.18) 24%, rgba(0,0,0,.5) 100%), var(--hero-img); background-size: 140%; background-position: left center; background-repeat: no-repeat; background-attachment: fixed; }
        .auth-layout { width: min(1180px, 100%); min-height: min(760px, calc(100vh - 56px)); display: grid; grid-template-columns: minmax(0, 1.3fr) minmax(360px, .85fr); gap: 28px; align-items: center; justify-content: start; }
        .hero-panel { position: relative; min-height: 680px; padding: 42px 42px 38px; display: flex; flex-direction: column; justify-content: space-between; background: rgba(3, 7, 16, .45); border: 1px solid rgba(255,255,255,.08); border-radius: 32px; box-shadow: 0 40px 110px rgba(0,0,0,.36); backdrop-filter: blur(28px); overflow: hidden; }
        .hero-visual { position: absolute; inset: 0; z-index: 0; overflow: hidden; }
        .hero-overlay { position: absolute; inset: 0; z-index: 1; background: radial-gradient(circle at 76% 18%, rgba(255,255,255,.08), transparent 24%), linear-gradient(180deg, rgba(2,4,10,.18) 0%, rgba(2,4,10,.72) 100%); pointer-events: none; }
        .hero-frame { position: absolute; inset: 28px; z-index: 2; pointer-events: none; }
        .hero-brand, .role-switch { pointer-events: auto; }
        .hero-brand { position: absolute; top: 28px; left: 28px; z-index: 4; display: flex; align-items: center; justify-content: center; width: 140px; height: 140px; padding: 12px; background: rgba(15, 23, 42, .95); border: 1px solid rgba(255,255,255,.16); border-radius: 32px; box-shadow: 0 28px 60px rgba(0,0,0,.38); backdrop-filter: blur(22px); }
        .hero-copy { position: absolute; left: 28px; right: 28px; bottom: 36px; z-index: 2; max-width: 480px; animation: heroIn .6s cubic-bezier(.16,1,.3,1); }
        .brand-logo { width: 104px; height: 104px; object-fit: cover; border-radius: 26px; box-shadow: 0 14px 36px rgba(0,0,0,.35), 0 0 0 1px rgba(255,255,255,.08); }
        .role-switch { position: absolute; top: 28px; right: 28px; display: flex; gap: 4px; padding: 4px; max-width: 360px; overflow-x: auto; background: rgba(8, 12, 24, .55); border: 1px solid rgba(255, 255, 255, .08); border-radius: 10px; backdrop-filter: blur(10px); box-shadow: 0 8px 24px rgba(0,0,0,.3); }
        .role-switch button { border: 1px solid transparent; background: transparent; color: #9aa5b8; cursor: pointer; border-radius: 7px; padding: 8px 12px; font: 600 12px/1 Inter, sans-serif; white-space: nowrap; transition: color .15s, background .15s, border-color .15s; }
        .role-switch button:hover:not(.active) { color: #e2e8f0; }
        .role-switch button.active { color: var(--role-accent); background: color-mix(in srgb, var(--role-accent) 16%, transparent); border-color: color-mix(in srgb, var(--role-accent) 38%, transparent); }
        .hero-copy { position: absolute; left: 28px; right: 28px; bottom: 36px; z-index: 2; max-width: 480px; animation: heroIn .6s cubic-bezier(.16,1,.3,1); }
        .hero-badge { display: inline-flex; align-items: center; gap: 6px; padding: 6px 14px; border-radius: 999px; background: color-mix(in srgb, var(--accent) 22%, rgba(8,12,24,.6)); border: 1px solid color-mix(in srgb, var(--accent) 45%, transparent); color: #fff; font-size: 12px; font-weight: 700; letter-spacing: .02em; backdrop-filter: blur(8px); }
        .hero-badge::before { content: ''; width: 6px; height: 6px; border-radius: 50%; background: var(--accent); box-shadow: 0 0 0 4px color-mix(in srgb, var(--accent) 25%, transparent); }
        .hero-copy h1 { margin: 16px 0 10px; font-size: clamp(32px, 4.2vw, 50px); line-height: 1.08; font-weight: 800; letter-spacing: -.02em; color: #f8fafc; text-shadow: 0 4px 30px rgba(0,0,0,.5); }
        .hero-copy h1 span { color: var(--accent); }
        .hero-copy p { margin: 0; max-width: 420px; color: #cbd5e1; font-size: 15px; line-height: 1.6; text-shadow: 0 2px 12px rgba(0,0,0,.5); }
        @keyframes heroIn { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        .auth-panel { align-self: center; justify-self: center; display: flex; flex-direction: column; justify-content: center; width: 100%; max-width: 420px; padding: 40px; border-radius: 28px; border: 1px solid rgba(255, 255, 255, .07); background: linear-gradient(160deg, rgba(15, 22, 38, .92), rgba(7, 11, 22, .92)); box-shadow: 0 30px 80px -20px rgba(0, 0, 0, .6), inset 0 1px 0 rgba(255,255,255,.04); backdrop-filter: blur(20px); animation: panelIn .6s cubic-bezier(.16,1,.3,1); }
        @keyframes panelIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        a:focus-visible, button:focus-visible, input:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
        .auth-panel h2 { margin: 0 0 8px; font-size: 26px; font-weight: 800; letter-spacing: -.01em; }
        .auth-panel p.subtitle { margin: 0 0 28px; color: #94a0b8; font-size: 13.5px; }
        .tabs { display: grid; grid-template-columns: 1fr 1fr; gap: 4px; margin-bottom: 24px; padding: 4px; background: rgba(255,255,255,.03); border: 1px solid rgba(255,255,255,.06); border-radius: 10px; }
        .tabs a { color: #9aa5b8; text-align: center; text-decoration: none; padding: 9px 0; font-size: 13px; font-weight: 600; border-radius: 7px; transition: color .15s, background .15s; }
        .tabs a.selected { color: #fff; background: color-mix(in srgb, var(--accent) 85%, #0b1220); box-shadow: 0 6px 18px color-mix(in srgb, var(--accent) 30%, transparent); }
        .tabs a:not(.selected):hover { color: #e2e8f0; background: rgba(255,255,255,.04); }
        .field-wrap { position: relative; display: block; margin-bottom: 14px; }
        .field-wrap input { width: 100%; height: 50px; padding: 0 46px; border: 1px solid rgba(255,255,255,.08); border-radius: 10px; background: rgba(255,255,255,.025); color: #f8fafc; outline: none; font: 500 13.5px/1 Inter, sans-serif; transition: border-color .2s, box-shadow .2s, background .2s; }
        .field-wrap input::placeholder { color: #69748a; }
        .field-wrap input:focus { border-color: color-mix(in srgb, var(--accent) 65%, transparent); box-shadow: 0 0 0 4px color-mix(in srgb, var(--accent) 14%, transparent); background: rgba(255,255,255,.04); }
        .field-icon, .field-action { position: absolute; top: 50%; transform: translateY(-50%); color: #69748a; }
        .field-icon { left: 16px; }
        .field-action { right: 14px; width: 24px; height: 24px; border: 0; padding: 0; display: grid; place-items: center; background: transparent; cursor: pointer; transition: color .15s; }
        .field-action:hover { color: #cbd5e1; }
        .mini-icon { width: 17px; height: 17px; display: block; }
        .form-row, .terms { display: flex; align-items: center; gap: 10px; margin: 6px 0 22px; color: #9aa5b8; font-size: 12.5px; }
        .form-row { justify-content: space-between; }
        .form-row label, .terms { cursor: pointer; }
        .form-row a, .terms a, .switch-copy a { color: var(--accent); text-decoration: none; font-weight: 600; }
        .form-row a:hover, .terms a:hover, .switch-copy a:hover { text-decoration: underline; }
        input[type="checkbox"] { width: 15px; height: 15px; margin: 0; accent-color: var(--accent); }
        .submit-button { width: 100%; height: 50px; border: 0; border-radius: 10px; background: linear-gradient(135deg, var(--accent), color-mix(in srgb, var(--accent) 70%, #fff)); color: white; cursor: pointer; font: 800 14px/1 Inter, sans-serif; box-shadow: 0 14px 34px color-mix(in srgb, var(--accent) 35%, transparent); transition: transform .15s, box-shadow .15s, filter .15s; }
        .submit-button:hover { transform: translateY(-1px); box-shadow: 0 18px 40px color-mix(in srgb, var(--accent) 45%, transparent); filter: brightness(1.05); }
        .submit-button:active { transform: translateY(0); }
        .divider { display: flex; align-items: center; gap: 12px; margin: 24px 0 18px; color: #69748a; font-size: 12px; }
        .divider span { height: 1px; flex: 1; background: rgba(255,255,255,.07); }
        .social-row { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
        .social-row button { height: 48px; border: 1px solid rgba(255,255,255,.08); border-radius: 10px; background: rgba(255,255,255,.025); color: #f8fafc; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; gap: 9px; font: 700 13px/1 Inter, sans-serif; transition: background .15s, border-color .15s; }
        .social-row button:hover { background: rgba(255,255,255,.05); border-color: rgba(255,255,255,.14); }
        .google-mark { color: #4285f4; font-size: 18px; font-weight: 800; }
        .github-mark { width: 22px; height: 22px; border-radius: 50%; display: grid; place-items: center; background: white; color: #111827; font-size: 8px; font-weight: 900; }
        .switch-copy { text-align: center; margin: 24px 0 0 !important; color: #9aa5b8; font-size: 13px; }
        @media (max-width: 980px) { .auth-layout { grid-template-columns: 1fr; gap: 16px; } .hero-panel { min-height: 320px; } .auth-panel { max-width: 520px; margin: 0 auto; padding: 32px; } }
        @media (max-width: 480px) { .auth-shell { padding: 12px; } .hero-panel { min-height: 320px; border-radius: 18px; } .auth-panel { border-radius: 18px; padding: 28px; } .hero-frame { inset: 14px; } .brand-logo { width: 52px; height: 52px; border-radius: 12px; } .hero-copy { left: 18px; right: 18px; bottom: 20px; } .hero-copy h1 { font-size: clamp(24px, 8vw, 34px); } .hero-copy p { font-size: 13px; } }
        @media (prefers-reduced-motion: reduce) { .hero-copy, .auth-panel { animation: none; } .submit-button, .tabs a, .role-switch button, .social-row button { transition: none; } }
      `}</style>
      <div className="auth-layout">
        <HeroPanel config={config} activeRole={activeRole} setActiveRole={setActiveRole} />
        <AuthPanel config={config} mode={mode} activeRole={activeRole} formData={formData} handleInputChange={handleInputChange} handleSubmit={handleSubmit} />
      </div>
    </main>
  );
}
