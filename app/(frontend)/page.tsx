
import Link from "next/link";

const roles = [
  {
    title: "For students",
    description: "Find internships that fit your skills, keep your applications organized, and get practical AI-powered resume feedback...",
    href: "/students/internships",
    action: "Explore internships",
  },
  {
    title: "For recruiters",
    description: "Publish opportunities, review candidates in one place, and move promising applicants through your hiring pipeline.",
    href: "/recruiters/dashboard",
    action: "Manage hiring",
  },
  {
    title: "For mentors and investors",
    description: "Support the next generation of talent and founders with dedicated mentoring and startup discovery tools.",
    href: "/auth/register",
    action: "Join the community",
  },
];

export default function HomePage() {
  return (
    <>
      <section className="hero">
        <div className="content-wrap hero-inner">
          <div>
            <p className="eyebrow">A clearer path from talent to opportunity</p>
            <h1 className="hero-title">Make your next career move count.</h1>
            <p className="hero-copy">
              Step-up for AI brings early-career talent and thoughtful hiring teams together.
              Discover opportunities, build confidence, and keep every step of the process moving.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              <Link className="button" href="/students/internships">Find an opportunity</Link>
              <Link className="button button-secondary" href="/auth/register">Create your account</Link>
            </div>
          </div>
          <aside className="hero-panel" aria-label="How Step-up for AI works">
            <h2>Designed for the whole journey</h2>
            <div className="hero-step">
              <span className="hero-step-number">1</span>
              <div><strong>Find the right fit</strong><span>Search practical roles by skill, location, and work style.</span></div>
            </div>
            <div className="hero-step">
              <span className="hero-step-number">2</span>
              <div><strong>Show your strengths</strong><span>Keep your profile, resume, and applications together.</span></div>
            </div>
            <div className="hero-step">
              <span className="hero-step-number">3</span>
              <div><strong>Move forward with confidence</strong><span>Track progress and connect with the people behind each opportunity.</span></div>
            </div>
          </aside>
        </div>
      </section>
      <section className="content-wrap section">
        <p className="eyebrow">One platform, different goals</p>
        <h2 className="section-heading">Tools built around your next step</h2>
        <div className="feature-grid">
          {roles.map((role) => (
            <article className="feature-card" key={role.title}>
              <h3>{role.title}</h3>
              <p>{role.description}</p>
              <p style={{ marginTop: 17 }}><Link className="text-link" href={role.href}>{role.action} →</Link></p>
            </article>
          ))}
        </div>
      </section>
      <footer className="content-wrap" style={{ paddingTop: 20, paddingBottom: 30 }}>
        <hr className="divider" />
        <p className="muted" style={{ fontSize: 13 }}>Step-up for AI · A professional platform for growing careers and teams.</p>
      </footer>
    </>
  );
}
