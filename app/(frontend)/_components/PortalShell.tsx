"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAuth } from "../_context/AuthContext";

interface NavItem {
  label: string;
  href: string;
}

const commonLinks: NavItem[] = [
  { label: "Internships", href: "/students/internships" },
  { label: "Community", href: "/community/posts" },
  { label: "Events", href: "/events" },
];

const roleLinks: Record<string, NavItem[]> = {
  student: [
    { label: "Dashboard", href: "/students/dashboard" },
    { label: "Applications", href: "/students/applications" },
    { label: "Saved jobs", href: "/students/saved-internships" },
    { label: "My profile", href: "/students/profile" },
    { label: "Resume", href: "/students/resume" },
    { label: "AI resume review", href: "/students/ai/resume-analyzer" },
  ],
  recruiter: [
    { label: "Dashboard", href: "/recruiters/dashboard" },
    { label: "My jobs", href: "/recruiters/internships" },
    { label: "Post a job", href: "/recruiters/internships/new" },
    { label: "Applicants", href: "/recruiters/applicants" },
    { label: "Interviews", href: "/recruiters/interviews" },
    { label: "Company", href: "/recruiters/company" },
  ],
  mentor: [
    { label: "Dashboard", href: "/mentors/dashboard" },
    { label: "Sessions", href: "/mentors/sessions" },
    { label: "Points", href: "/mentors/points" },
    { label: "Profile", href: "/mentors/profile" },
  ],
  investor: [
    { label: "Dashboard", href: "/investors/dashboard" },
    { label: "Startups", href: "/investors/startups" },
    { label: "Deal pipeline", href: "/investors/deal-pipeline" },
    { label: "Messages", href: "/investors/messages" },
    { label: "Profile", href: "/investors/profile" },
  ],
  admin: [
    { label: "Admin dashboard", href: "/admin/dashboard" },
    { label: "Users", href: "/admin/users" },
    { label: "Analytics", href: "/admin/analytics" },
    { label: "Reports", href: "/admin/reports" },
    { label: "Audit logs", href: "/admin/audit-logs" },
  ],
};

export function PortalShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, loading, logout } = useAuth();
  const [logoutError, setLogoutError] = useState("");
  const links = user ? [...(roleLinks[user.role] ?? []), ...commonLinks] : commonLinks;
  const signOut = async () => {
    setLogoutError("");
    try {
      await logout();
    } catch (error) {
      setLogoutError(error instanceof Error ? error.message : "Unable to sign out.");
    }
  };

  return (
    <>
      <header className="site-header">
        <div className="header-inner">
          <Link href="/" className="brand" aria-label="Step-up for AI home">
            <span className="brand-mark">S</span>
            <span>Step-up for AI</span>
          </Link>
          <nav className="header-nav" aria-label="Main navigation">
            {links.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  className={`nav-link${active ? " nav-link-active" : ""}`}
                  href={item.href}
                  key={item.href}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
          <div className="header-actions">
            {loading ? (
              <span className="muted" aria-live="polite">Loading account…</span>
            ) : user ? (
              <>
                <span className="muted" title={user.email}>
                  {user.email.split("@")[0]}
                </span>
                <button className="button button-secondary" onClick={() => void signOut()}>
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Link className="button button-secondary" href="/auth/login">Sign in</Link>
                <Link className="button" href="/auth/register">Create account</Link>
              </>
            )}
          </div>
        </div>
      </header>
      {logoutError && <div className="content-wrap" style={{ paddingBottom: 0 }}><div className="alert alert-error" role="alert">{logoutError}</div></div>}
      <main className="app-main">{children}</main>
    </>
  );
}
