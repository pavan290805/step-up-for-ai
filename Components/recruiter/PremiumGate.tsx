'use client';

import Link from 'next/link';

interface PremiumGateProps {
  feature: string;
  description?: string;
}

export default function PremiumGate({ feature, description }: PremiumGateProps) {
  return (
    <div style={{
      position: 'relative',
      minHeight: '60vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <style>{`
        .pg-card {
          background: linear-gradient(145deg, rgba(4,18,8,.95), rgba(2,12,5,.98));
          border: 1px solid rgba(47,191,100,.35);
          border-radius: 28px;
          padding: 56px 48px;
          text-align: center;
          max-width: 480px;
          width: 100%;
          position: relative;
          overflow: hidden;
          box-shadow: 0 30px 80px rgba(47,191,100,.12), 0 0 0 1px rgba(47,191,100,.1);
          animation: pgIn .5s cubic-bezier(.16,1,.3,1);
        }
        @keyframes pgIn { from { opacity:0; transform:translateY(20px) scale(.97); } to { opacity:1; transform:translateY(0) scale(1); } }
        .pg-glow {
          position: absolute;
          top: -60px; left: 50%;
          transform: translateX(-50%);
          width: 220px; height: 220px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(47,191,100,.25) 0%, transparent 70%);
          pointer-events: none;
        }
        .pg-icon {
          width: 72px; height: 72px;
          border-radius: 20px;
          background: linear-gradient(135deg, rgba(47,191,100,.25), rgba(26,158,74,.25));
          border: 1px solid rgba(47,191,100,.4);
          display: grid;
          place-items: center;
          margin: 0 auto 24px;
          font-size: 32px;
        }
        .pg-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 5px 12px;
          border-radius: 99px;
          background: rgba(47,191,100,.15);
          border: 1px solid rgba(47,191,100,.3);
          color: #6ee09c;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: .06em;
          margin-bottom: 16px;
        }
        .pg-title {
          font-size: 26px;
          font-weight: 800;
          color: #e8faf0;
          margin-bottom: 12px;
          letter-spacing: -.01em;
        }
        .pg-desc {
          color: #5cb87a;
          font-size: 14.5px;
          line-height: 1.7;
          margin-bottom: 32px;
        }
        .pg-perks {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 32px;
          text-align: left;
        }
        .pg-perk {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 13.5px;
          color: #c4b5e4;
        }
        .pg-perk-dot {
          width: 20px; height: 20px;
          border-radius: 50%;
          background: rgba(47,191,100,.2);
          border: 1px solid rgba(47,191,100,.4);
          display: grid;
          place-items: center;
          flex-shrink: 0;
          color: #2fbf64;
          font-size: 11px;
          font-weight: 700;
        }
        .pg-cta {
          display: block;
          width: 100%;
          padding: 14px;
          border-radius: 12px;
          background: linear-gradient(135deg, #2fbf64, #1a9e4a);
          color: #fff;
          font: 700 15px Inter;
          text-decoration: none;
          text-align: center;
          transition: all .2s;
          box-shadow: 0 12px 30px rgba(47,191,100,.35);
        }
        .pg-cta:hover {
          transform: translateY(-2px);
          box-shadow: 0 16px 40px rgba(47,191,100,.45);
          filter: brightness(1.08);
        }
      `}</style>
      <div className="pg-card">
        <div className="pg-glow" />
        <div className="pg-icon">⚡</div>
        <div className="pg-badge">PREMIUM FEATURE</div>
        <h2 className="pg-title">{feature}</h2>
        <p className="pg-desc">
          {description ?? `Unlock ${feature} and more powerful hiring tools with our Premium plan.`}
        </p>
        <div className="pg-perks">
          {[
            'Unlimited Internship Listings',
            'AI Candidate Ranking & Matching',
            'Advanced Analytics Dashboard',
            'Automated Interview Scheduling',
            'Featured Listing Placement',
          ].map((perk) => (
            <div className="pg-perk" key={perk}>
              <span className="pg-perk-dot">✓</span>
              {perk}
            </div>
          ))}
        </div>
        <Link href="/recruiter/pricing" className="pg-cta">
          ⚡ Upgrade to Premium
        </Link>
      </div>
    </div>
  );
}
