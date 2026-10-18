"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAuth } from "../_context/AuthContext";

interface NavItem {
  label: string;
  href: string;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const discoveryLinks: NavItem[] = [
  { label: "Opportunities", href: "/students/internships" },
  { label: "Community", href: "/community/posts" },
  { label: "Events", href: "/events" },
];

const roleGroups: Record<string, NavGroup[]> = {
  student: [
    {
      label: "My career",
      items: [
        { label: "Dashboard", href: "/students/dashboard" },
        { label: "Applications", href: "/students/applications" },
        { label: "Saved opportunities", href: "/students/saved-internships" },
      ],
    },
    {
      label: "My profile",
      items: [
        { label: "Profile", href: "/students/profile" },
        { label: "Resume library", href: "/students/resume" },
        { label: "AI resume review", href: "/students/ai/resume-analyzer" },
        { label: "Career analytics", href: "/students/analytics" },
      ],
    },
  ],
  recruiter: [
    {
      label: "Hiring",
      items: [
        { label: "Dashboard", href: "/recruiters/dashboard" },
        { label: "My roles", href: "/recruiters/internships" },
        { label: "Post a role", href: "/recruiters/internships/new" },
        { label: "Applicants", href: "/recruiters/applicants" },
        { label: "Interviews", href: "/recruiters/interviews" },
      ],
    },
    {
      label: "Organization",
      items: [
        { label: "Company profile", href: "/recruiters/company" },
        { label: "Hiring analytics", href: "/recruiters/analytics" },
        { label: "AI job description", href: "/recruiters/ai/jd-generator" },
      ],
    },
  ],
  mentor: [
    {
      label: "Mentorship",
      items: [
        { label: "Dashboard", href: "/mentors/dashboard" },
        { label: "Sessions", href: "/mentors/sessions" },
        { label: "Session history", href: "/mentors/sessions/history" },
        { label: "Points", href: "/mentors/points" },
        { label: "Profile", href: "/mentors/profile" },
      ],
    },
  ],
  investor: [
    {
      label: "Investing",
      items: [
        { label: "Dashboard", href: "/investors/dashboard" },
        { label: "Explore startups", href: "/investors/startups" },
        { label: "Saved startups", href: "/investors/saved-startups" },
        { label: "Deal pipeline", href: "/investors/deal-pipeline" },
        { label: "Messages", href: "/investors/messages" },
        { label: "Analytics", href: "/investors/analytics" },
        { label: "Profile", href: "/investors/profile" },
      ],
    },
  ],
  admin: [
    {
      label: "Operations",
      items: [
        { label: "Admin dashboard", href: "/admin/dashboard" },
        { label: "Users", href: "/admin/users" },
      ],
    },
    {
      label: "Reports & settings",
      items: [
        { label: "Analytics", href: "/admin/analytics" },
        { label: "Reports", href: "/admin/reports" },
        { label: "Payments", href: "/admin/payments" },
        { label: "Subscriptions", href: "/admin/subscriptions" },
        { label: "Audit logs", href: "/admin/audit-logs" },
        { label: "Export users", href: "/admin/export/users" },
      ],
    },
  ],
  super_admin: [
    {
      label: "Operations",
      items: [
        { label: "Admin dashboard", href: "/admin/dashboard" },
        { label: "Users", href: "/admin/users" },
      ],
    },
    {
      label: "Reports & settings",
      items: [
        { label: "Analytics", href: "/admin/analytics" },
        { label: "Reports", href: "/admin/reports" },
        { label: "Payments", href: "/admin/payments" },
        { label: "Subscriptions", href: "/admin/subscriptions" },
        { label: "Audit logs", href: "/admin/audit-logs" },
        { label: "Export users", href: "/admin/export/users" },
      ],
    },
  ],
};

function isActiveLink(pathname: string, href: string): boolean {
  if (pathname === href || pathname.startsWith(`${href}/`)) return true;
  return href === "/admin/users" && pathname.startsWith("/admin/users/");
}

export function PortalShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, loading, logout } = useAuth();
  const [logoutError, setLogoutError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const groups = roleGroups[user?.role ?? ""] ?? [];
  const firstName = user?.email.split("@")[0] ?? "";

  const signOut = async () => {
    setLogoutError("");
    try {
      await logout();
    } catch (error) {
      setLogoutError(error instanceof Error ? error.message : "Unable to sign out.");
    }
  };

  const searchOpportunities = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const query = searchTerm.trim();
    window.location.assign(query ? `/students/internships?q=${encodeURIComponent(query)}` : "/students/internships");
    setMobileNavOpen(false);
  };

  const renderLink = (item: NavItem) => {
    const active = isActiveLink(pathname, item.href);
    return (
      <Link
        aria-current={active ? "page" : undefined}
        className={`portal-nav-link${active ? " portal-nav-link-active" : ""}`}
        href={item.href}
        key={item.href}
        onClick={() => setMobileNavOpen(false)}
      >
        <span aria-hidden="true" className="portal-nav-indicator" />
        {item.label}
      </Link>
    );
  };

  return (
    <>
      <header className="site-header">
        <div className="header-inner portal-header-inner">
          <button
            aria-expanded={mobileNavOpen}
            aria-label={mobileNavOpen ? "Close navigation" : "Open navigation"}
            className="portal-mobile-toggle"
            onClick={() => setMobileNavOpen((open) => !open)}
            type="button"
          >
            <span aria-hidden="true">{mobileNavOpen ? "×" : "☰"}</span>
          </button>
          <Link href="/" className="brand" aria-label="Step-up for AI home">
            <span className="brand-mark">S</span>
            <span>Step-up for AI</span>
          </Link>
          <form className="portal-search" onSubmit={searchOpportunities} role="search">
            <label className="visually-hidden" htmlFor="portal-opportunity-search">Search roles and skills</label>
            <span aria-hidden="true" className="portal-search-icon">⌕</span>
            <input
              autoComplete="off"
              id="portal-opportunity-search"
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search roles, skills, opportunities"
              value={searchTerm}
            />
            <button type="submit">Search</button>
          </form>
          <div className="header-actions portal-header-actions">
            {loading ? (
              <span className="muted" aria-live="polite">Loading account…</span>
            ) : user ? (
              <>
                <Link className="portal-account" href={roleGroups[user.role]?.[0]?.items[0]?.href ?? "/"}>
                  <span aria-hidden="true" className="portal-avatar">{firstName.slice(0, 1).toUpperCase()}</span>
                  <span className="portal-account-name">{firstName}</span>
                </Link>
                <button className="button button-secondary" onClick={() => void signOut()} type="button">
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
      <div className={`portal-layout${mobileNavOpen ? " portal-layout-menu-open" : ""}`}>
        {mobileNavOpen && (
          <button
            aria-label="Close navigation menu"
            className="portal-mobile-backdrop"
            onClick={() => setMobileNavOpen(false)}
            type="button"
          />
        )}
        <aside
          aria-label="Workspace navigation"
          className="portal-sidebar"
          style={mobileNavOpen ? { transform: "translateX(0)", visibility: "visible" } : undefined}
        >
          <div className="portal-sidebar-top">
            <span className="portal-sidebar-eyebrow">{user ? `${user.role.replace("_", " ")} workspace` : "Explore Step-up"}</span>
            {user ? (
              <Link className="portal-quick-action" href={user.role === "recruiter" ? "/recruiters/internships/new" : "/students/internships"}>
                <span aria-hidden="true">＋</span>
                {user.role === "recruiter" ? "Post a role" : "Find opportunities"}
              </Link>
            ) : (
              <Link className="portal-quick-action" href="/auth/register">
                <span aria-hidden="true">＋</span>
                Create your account
              </Link>
            )}
          </div>
          <nav aria-label="Workspace pages" className="portal-sidebar-nav">
            {groups.map((group) => (
              <section className="portal-nav-group" key={group.label}>
                <h2 className="portal-nav-group-title">{group.label}</h2>
                {group.items.map(renderLink)}
              </section>
            ))}
            <section className="portal-nav-group">
              <h2 className="portal-nav-group-title">Discover</h2>
              {discoveryLinks.map(renderLink)}
            </section>
          </nav>
          <div className="portal-sidebar-footer">
            <span>Step-up for AI</span>
            <span>Build what&apos;s next.</span>
          </div>
        </aside>
        <div className="portal-content">
          <main className="app-main">{children}</main>
        </div>
      </div>
    </>
  );
}
