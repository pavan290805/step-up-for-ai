"use client";

import { Card, PageHeader } from "@/components/UI";

export default function InvestmentAnalyticsPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Investment Analytics"
        description="Monitor investor-startup engagement, contact requests sent, and scheduled meeting pipelines."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Contact Requests Sent */}
        <Card title="Contact Requests Sent" icon="fa-solid fa-paper-plane">
          <div className="h-64 w-full flex items-center justify-center">
            {/* SVG Line chart representing requests */}
            <svg className="w-full h-full" viewBox="0 0 300 150">
              <line x1="30" y1="120" x2="280" y2="120" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" />
              <path
                d="M 30,110 L 70,80 L 110,95 L 150,50 L 190,65 L 230,30 L 280,15"
                fill="none"
                stroke="var(--accent-red)"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <circle cx="30" cy="110" r="3.5" fill="var(--bg-secondary)" stroke="var(--accent-red)" strokeWidth="2" />
              <circle cx="150" cy="50" r="3.5" fill="var(--bg-secondary)" stroke="var(--accent-red)" strokeWidth="2" />
              <circle cx="280" cy="15" r="3.5" fill="var(--bg-secondary)" stroke="var(--accent-red)" strokeWidth="2" />
              <text x="30" y="135" fill="var(--text-muted)" fontSize="8" textAnchor="middle">Q1</text>
              <text x="150" y="135" fill="var(--text-muted)" fontSize="8" textAnchor="middle">Q2</text>
              <text x="280" y="135" fill="var(--text-muted)" fontSize="8" textAnchor="middle">Q3</text>
            </svg>
          </div>
        </Card>

        {/* Meetings Scheduled */}
        <Card title="Meetings Scheduled" icon="fa-solid fa-calendar-check">
          <div className="h-64 w-full flex items-center justify-center">
            {/* SVG Line chart representing meetings */}
            <svg className="w-full h-full" viewBox="0 0 300 150">
              <line x1="30" y1="120" x2="280" y2="120" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" />
              <path
                d="M 30,115 L 70,110 L 110,95 L 150,85 L 190,90 L 230,70 L 280,45"
                fill="none"
                stroke="var(--accent-green)"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <circle cx="30" cy="115" r="3.5" fill="var(--bg-secondary)" stroke="var(--accent-green)" strokeWidth="2" />
              <circle cx="150" cy="85" r="3.5" fill="var(--bg-secondary)" stroke="var(--accent-green)" strokeWidth="2" />
              <circle cx="280" cy="45" r="3.5" fill="var(--bg-secondary)" stroke="var(--accent-green)" strokeWidth="2" />
              <text x="30" y="135" fill="var(--text-muted)" fontSize="8" textAnchor="middle">Q1</text>
              <text x="150" y="135" fill="var(--text-muted)" fontSize="8" textAnchor="middle">Q2</text>
              <text x="280" y="135" fill="var(--text-muted)" fontSize="8" textAnchor="middle">Q3</text>
            </svg>
          </div>
        </Card>
      </div>
    </div>
  );
}
