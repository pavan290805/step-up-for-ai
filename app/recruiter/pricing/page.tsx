'use client';

import Link from 'next/link';

const FREE_FEATURES = [
  { label: 'Company Profile', included: true },
  { label: '3 Internship Listings', included: true },
  { label: '5 Resume Downloads', included: true },
  { label: 'Basic Applicant Tracking', included: true },
  { label: 'Unlimited Listings', included: false },
  { label: 'AI Candidate Ranking', included: false },
  { label: 'AI JD Generator', included: false },
  { label: 'Smart Candidate Matching', included: false },
  { label: 'Advanced Analytics', included: false },
  { label: 'Featured Listings', included: false },
  { label: 'Automated Interview Scheduling', included: false },
  { label: 'Unlimited Resume Downloads', included: false },
];

const PREMIUM_FEATURES = [
  { label: 'Company Profile', included: true },
  { label: 'Unlimited Internship Listings', included: true },
  { label: 'Unlimited Resume Downloads', included: true },
  { label: 'Advanced Applicant Tracking', included: true },
  { label: 'AI Candidate Ranking', included: true },
  { label: 'AI JD Generator', included: true },
  { label: 'Smart Candidate Matching', included: true },
  { label: 'Advanced Analytics', included: true },
  { label: 'Featured Listings', included: true },
  { label: 'Automated Interview Scheduling', included: true },
  { label: 'Priority Support', included: true },
  { label: 'Dedicated Account Manager', included: true },
];

const FAQ = [
  { q: 'Can I switch plans anytime?', a: 'Yes, you can upgrade or downgrade at any time. Upgrades take effect immediately, and downgrades apply at the start of your next billing cycle.' },
  { q: 'Is there a free trial for Premium?', a: 'We offer a 14-day free trial of the Premium plan — no credit card required. Experience all AI-powered features before committing.' },
  { q: 'What payment methods do you accept?', a: 'We accept all major credit/debit cards, UPI, net banking, and EMI options via Razorpay.' },
  { q: 'Can I get an invoice for my business?', a: 'Absolutely. GST-compliant invoices are automatically generated and sent to your email after each payment.' },
];

export default function PricingPage() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
        .pr-page { font-family: Inter, sans-serif; max-width: 960px; margin: 0 auto; }
        .pr-header { text-align: center; margin-bottom: 48px; }
        .pr-badge { display: inline-flex; align-items: center; gap: 7px; padding: 6px 16px; border-radius: 99px; background: rgba(47,191,100,.15); border: 1px solid rgba(47,191,100,.3); color: #6ee09c; font: 700 12px Inter; margin-bottom: 18px; }
        .pr-title { font-size: 42px; font-weight: 800; color: #e8faf0; letter-spacing: -.03em; line-height: 1.1; margin-bottom: 14px; }
        .pr-title span { color: #2fbf64; }
        .pr-sub { font-size: 16px; color: #4a8a5e; line-height: 1.7; max-width: 500px; margin: 0 auto; }
        .pr-cards { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 60px; }
        .pr-card { border-radius: 28px; padding: 36px; position: relative; overflow: hidden; transition: all .2s; }
        .pr-card.free { background: linear-gradient(145deg,rgba(4,18,8,.9),rgba(2,12,5,.9)); border: 1px solid rgba(47,191,100,.15); }
        .pr-card.free:hover { border-color: rgba(47,191,100,.3); }
        .pr-card.premium { background: linear-gradient(145deg, rgba(5,30,15,.95), rgba(3,18,9,.98)); border: 2px solid rgba(47,191,100,.5); box-shadow: 0 0 0 1px rgba(47,191,100,.15), 0 40px 80px rgba(47,191,100,.15); }
        .pr-card.premium:hover { box-shadow: 0 0 0 1px rgba(47,191,100,.25), 0 50px 100px rgba(47,191,100,.2); transform: translateY(-4px); }
        .pr-popular { position: absolute; top: 20px; right: 20px; padding: 5px 14px; border-radius: 99px; background: linear-gradient(135deg,#2fbf64,#1a9e4a); color:#fff; font: 700 11px Inter; letter-spacing: .04em; }
        .pr-glow { position: absolute; top: -80px; right: -80px; width: 250px; height: 250px; border-radius: 50%; background: radial-gradient(circle, rgba(47,191,100,.2) 0%, transparent 70%); pointer-events: none; }
        .pr-plan-badge { display: inline-flex; align-items: center; gap: 6px; padding: 5px 12px; border-radius: 8px; font: 700 12px Inter; margin-bottom: 12px; }
        .pr-plan-badge.free { background: rgba(255,255,255,.06); color: #9ca3af; }
        .pr-plan-badge.premium { background: rgba(47,191,100,.18); color: #6ee09c; border: 1px solid rgba(47,191,100,.3); }
        .pr-price { display: flex; align-items: flex-end; gap: 4px; margin: 12px 0 6px; }
        .pr-currency { font-size: 22px; font-weight: 700; color: #e8faf0; padding-bottom: 6px; }
        .pr-amount { font-size: 60px; font-weight: 800; color: #e8faf0; letter-spacing: -.03em; line-height: 1; }
        .pr-period { font-size: 14px; color: #4a8a5e; padding-bottom: 6px; }
        .pr-save { font-size: 12px; color: #86efac; font-weight: 600; margin-bottom: 20px; }
        .pr-desc { font-size: 14px; color: #4a8a5e; line-height: 1.6; margin-bottom: 28px; }
        .pr-cta { display: block; width: 100%; padding: 15px; border-radius: 14px; text-align: center; text-decoration: none; font: 700 15px Inter; transition: all .2s; margin-bottom: 28px; }
        .pr-cta.free-btn { border: 1px solid rgba(47,191,100,.3); background: rgba(47,191,100,.08); color: #6ee09c; }
        .pr-cta.free-btn:hover { background: rgba(47,191,100,.15); }
        .pr-cta.premium-btn { background: linear-gradient(135deg,#2fbf64,#1a9e4a); color: #fff; box-shadow: 0 12px 30px rgba(47,191,100,.4); }
        .pr-cta.premium-btn:hover { transform: translateY(-2px); box-shadow: 0 16px 40px rgba(47,191,100,.55); }
        .pr-divider { height: 1px; background: rgba(47,191,100,.1); margin: 0 0 24px; }
        .pr-feat-list { display: flex; flex-direction: column; gap: 12px; }
        .pr-feat { display: flex; align-items: center; gap: 12px; font-size: 14px; }
        .pr-feat.included { color: #d4f5e2; }
        .pr-feat.excluded { color: #2e5040; }
        .pr-feat-icon { width: 22px; height: 22px; border-radius: 50%; display: grid; place-items: center; font-size: 11px; font-weight: 700; flex-shrink: 0; }
        .pr-feat-icon.check { background: rgba(47,191,100,.2); color: #2fbf64; }
        .pr-feat-icon.cross { background: rgba(107,114,128,.1); color: #4b5563; }
        .pr-comparison { margin-bottom: 60px; }
        .pr-comp-title { text-align: center; font-size: 28px; font-weight: 800; color: #e8faf0; letter-spacing: -.02em; margin-bottom: 28px; }
        .pr-table { width: 100%; border-collapse: collapse; }
        .pr-table th { padding: 14px 18px; font-size: 13px; font-weight: 700; text-align: center; border-bottom: 1px solid rgba(47,191,100,.12); }
        .pr-table th:first-child { text-align: left; }
        .pr-table th.pr-th-free { color: #9ca3af; }
        .pr-table th.pr-th-premium { color: #6ee09c; }
        .pr-table td { padding: 14px 18px; font-size: 13.5px; color: #c4b5e4; border-bottom: 1px solid rgba(47,191,100,.06); text-align: center; }
        .pr-table td:first-child { text-align: left; color: #5cb87a; }
        .pr-table tr:hover td { background: rgba(47,191,100,.04); }
        .pr-check { color: #2fbf64; font-size: 16px; font-weight: 700; }
        .pr-cross { color: #374151; font-size: 16px; }
        .pr-faq { margin-bottom: 48px; }
        .pr-faq-title { text-align: center; font-size: 26px; font-weight: 800; color: #e8faf0; margin-bottom: 24px; letter-spacing: -.02em; }
        .pr-faq-item { background: linear-gradient(145deg,rgba(4,18,8,.9),rgba(2,12,5,.9)); border: 1px solid rgba(47,191,100,.12); border-radius: 16px; padding: 20px 22px; margin-bottom: 12px; }
        .pr-faq-q { font-size: 14px; font-weight: 700; color: #d4f5e2; margin-bottom: 8px; }
        .pr-faq-a { font-size: 13.5px; color: #4a8a5e; line-height: 1.7; }
        .pr-bottom-cta { background: linear-gradient(135deg,rgba(47,191,100,.18),rgba(26,158,74,.12)); border: 1px solid rgba(47,191,100,.35); border-radius: 24px; padding: 48px; text-align: center; }
        .pr-bottom-cta h2 { font-size: 30px; font-weight: 800; color: #e8faf0; margin-bottom: 12px; letter-spacing: -.02em; }
        .pr-bottom-cta p { font-size: 15px; color: #4a8a5e; margin-bottom: 28px; }
        .pr-bottom-btn { display: inline-flex; padding: 15px 40px; border-radius: 14px; background: linear-gradient(135deg,#2fbf64,#1a9e4a); color:#fff; font: 700 15px Inter; text-decoration: none; transition: all .2s; box-shadow: 0 12px 30px rgba(47,191,100,.4); }
        .pr-bottom-btn:hover { transform: translateY(-2px); box-shadow: 0 16px 40px rgba(47,191,100,.55); }
        @media (max-width: 700px) { .pr-cards { grid-template-columns: 1fr; } .pr-title { font-size: 30px; } }
      `}</style>
      <div className="pr-page">
        {/* Header */}
        <div className="pr-header">
          <div className="pr-badge">⚡ Simple, Transparent Pricing</div>
          <h1 className="pr-title">Find the right plan for<br /><span>your hiring needs</span></h1>
          <p className="pr-sub">Start free, upgrade when you need more power. No hidden fees, no contracts.</p>
        </div>

        {/* Plan cards */}
        <div className="pr-cards">
          {/* Free */}
          <div className="pr-card free">
            <div className="pr-plan-badge free">🆓 Free Plan</div>
            <div className="pr-price">
              <span className="pr-currency">₹</span>
              <span className="pr-amount">0</span>
              <span className="pr-period">/month</span>
            </div>
            <p className="pr-desc">Perfect for small teams just getting started with hiring interns.</p>
            <Link href="/recruiter" className="pr-cta free-btn">Get Started Free</Link>
            <div className="pr-divider" />
            <div className="pr-feat-list">
              {FREE_FEATURES.map(f => (
                <div key={f.label} className={`pr-feat ${f.included ? 'included' : 'excluded'}`}>
                  <span className={`pr-feat-icon ${f.included ? 'check' : 'cross'}`}>
                    {f.included ? '✓' : '×'}
                  </span>
                  {f.label}
                </div>
              ))}
            </div>
          </div>

          {/* Premium */}
          <div className="pr-card premium">
            <div className="pr-glow" />
            <div className="pr-popular">Most Popular</div>
            <div className="pr-plan-badge premium">⚡ Premium Plan</div>
            <div className="pr-price">
              <span className="pr-currency">₹</span>
              <span className="pr-amount" style={{ color: '#6ee09c' }}>999</span>
              <span className="pr-period">/month</span>
            </div>
            <div className="pr-save">💚 Save 30% with annual billing — ₹8,390/year</div>
            <p className="pr-desc">Unlock the full power of AI-driven hiring for serious recruiters.</p>
            <Link href="#" className="pr-cta premium-btn">⚡ Upgrade to Premium</Link>
            <div className="pr-divider" />
            <div className="pr-feat-list">
              {PREMIUM_FEATURES.map(f => (
                <div key={f.label} className={`pr-feat ${f.included ? 'included' : 'excluded'}`}>
                  <span className={`pr-feat-icon ${f.included ? 'check' : 'cross'}`}>
                    {f.included ? '✓' : '×'}
                  </span>
                  {f.label}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Comparison table */}
        <div className="pr-comparison">
          <h2 className="pr-comp-title">Feature Comparison</h2>
          <table className="pr-table">
            <thead>
              <tr>
                <th>Feature</th>
                <th className="pr-th-free">Free</th>
                <th className="pr-th-premium">Premium</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Company Profile', true, true],
                ['Internship Listings', '3 max', 'Unlimited'],
                ['Resume Downloads', '5 max', 'Unlimited'],
                ['Applicant Tracking', 'Basic', 'Advanced'],
                ['Featured Listings', false, true],
                ['AI Candidate Ranking', false, true],
                ['AI JD Generator', false, true],
                ['Smart Candidate Matching', false, true],
                ['Advanced Analytics', false, true],
                ['Automated Interview Scheduling', false, true],
                ['Priority Support', false, true],
                ['Dedicated Account Manager', false, true],
              ].map(([feat, free, prem]) => (
                <tr key={String(feat)}>
                  <td>{feat}</td>
                  <td>{free === true ? <span className="pr-check">✓</span> : free === false ? <span className="pr-cross">—</span> : <span style={{ color: '#5cb87a' }}>{free}</span>}</td>
                  <td>{prem === true ? <span className="pr-check">✓</span> : <span style={{ color: '#6ee09c', fontWeight: 700 }}>{prem}</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* FAQ */}
        <div className="pr-faq">
          <h2 className="pr-faq-title">Frequently Asked Questions</h2>
          {FAQ.map(f => (
            <div className="pr-faq-item" key={f.q}>
              <div className="pr-faq-q">❓ {f.q}</div>
              <div className="pr-faq-a">{f.a}</div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="pr-bottom-cta">
          <h2>Ready to hire smarter?</h2>
          <p>Join 500+ companies already using StepUp Recruiter to find top intern talent faster.</p>
          <Link href="#" className="pr-bottom-btn">⚡ Start Your 14-Day Free Trial</Link>
        </div>
      </div>
    </>
  );
}
