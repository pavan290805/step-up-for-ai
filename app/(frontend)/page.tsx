import Link from "next/link";

const spaces = [
  {
    title: "Student",
    detail: "Find roles, keep applications on track, and strengthen your resume.",
    href: "/auth/register?role=student",
    action: "Explore your career tools",
    mark: "01",
  },
  {
    title: "Recruiter",
    detail: "Post opportunities, review candidates, and coordinate interviews.",
    href: "/auth/register?role=recruiter",
    action: "Open hiring workspace",
    mark: "02",
  },
  {
    title: "Mentor",
    detail: "Meet emerging talent and manage mentoring sessions in one place.",
    href: "/auth/register?role=mentor",
    action: "Support growing talent",
    mark: "03",
  },
  {
    title: "Investor",
    detail: "Discover early-stage companies and organize your deal pipeline.",
    href: "/auth/register?role=investor",
    action: "Explore startup discovery",
    mark: "04",
  },
];

const discoveryLinks = [
  { title: "Internships & jobs", detail: "Search roles by skill, location, and work type.", href: "/students/internships" },
  { title: "Events", detail: "Find workshops, webinars, and career events.", href: "/events" },
  { title: "Community", detail: "Share ideas and learn alongside other members.", href: "/community/posts" },
];

export default function HomePage() {
  return (
    <>
      <section className="home-hero">
        <div className="home-hero-inner">
          <div className="home-hero-copy">
            <p className="eyebrow">Step-up for AI · Careers, community, opportunity</p>
            <h1 className="hero-title">Find your next step. Make it count.</h1>
            <p className="hero-copy">
              A practical place for emerging talent, hiring teams, mentors, and investors to move good work forward.
            </p>
            <div className="home-actions">
              <Link className="button" href="/students/internships">Explore opportunities <span aria-hidden="true">→</span></Link>
              <Link className="button button-secondary" href="/auth/register">Create your account</Link>
            </div>
            <div className="home-proof">
              <span className="home-proof-mark" aria-hidden="true">✓</span>
              One workspace for every step, from discovery to decision
            </div>
          </div>
          <form action="/students/internships" className="home-search-card" role="search">
            <span className="eyebrow">Start your search</span>
            <h2>What opportunity are you looking for?</h2>
            <label className="field">
              <span className="field-label">Role, skill, or keyword</span>
              <input className="field-input" name="q" placeholder="e.g. Product design, Python, marketing" />
            </label>
            <button className="button home-search-submit" type="submit">Search opportunities <span aria-hidden="true">→</span></button>
            <p className="help-text">Search curated roles or explore what is happening in the community.</p>
          </form>
        </div>
        <div aria-hidden="true" className="home-hero-orbit home-hero-orbit-one" />
        <div aria-hidden="true" className="home-hero-orbit home-hero-orbit-two" />
      </section>

      <section className="content-wrap home-section">
        <div className="home-section-heading">
          <div>
            <p className="eyebrow">Built for your role</p>
            <h2 className="section-heading">One platform. The right tools for each journey.</h2>
          </div>
          <p className="home-section-intro">Choose a workspace to get started. Your dashboard brings the next steps into focus.</p>
        </div>
        <div className="home-role-grid">
          {spaces.map((space) => (
            <article className="home-role-card" key={space.title}>
              <span aria-hidden="true" className="home-role-mark">{space.mark}</span>
              <h3>{space.title}</h3>
              <p>{space.detail}</p>
              <Link className="text-link" href={space.href}>{space.action} <span aria-hidden="true">→</span></Link>
            </article>
          ))}
        </div>
      </section>

      <section className="home-discovery-section">
        <div className="content-wrap home-section">
          <div className="home-section-heading">
            <div>
              <p className="eyebrow">Explore Step-up</p>
              <h2 className="section-heading">Find more ways to move forward.</h2>
            </div>
          </div>
          <div className="home-discovery-grid">
            {discoveryLinks.map((item) => (
              <Link className="home-discovery-card" href={item.href} key={item.title}>
                <span aria-hidden="true" className="home-discovery-arrow">↗</span>
                <h3>{item.title}</h3>
                <p>{item.detail}</p>
                <span className="text-link">Explore <span aria-hidden="true">→</span></span>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <footer className="content-wrap home-footer">
        <span className="brand"><span className="brand-mark">S</span><span>Step-up for AI</span></span>
        <p className="muted">A professional platform for growing careers and teams.</p>
      </footer>
    </>
  );
}
