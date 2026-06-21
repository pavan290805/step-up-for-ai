"use client";

import { Card, PageHeader } from "@/components/UI";
import { approvedInvestors, mockStartupInterests, mockContactRequests } from "@/components/mockData";

export default function InvestorDashboardPage() {
  const totalApprovedInvestors = approvedInvestors.length;
  const totalInterests = mockStartupInterests.length;
  const contactRequestsSent = mockContactRequests.length;
  const meetingsScheduled = mockStartupInterests.filter(i => i.status === "Meeting Scheduled").length + 
    mockContactRequests.filter(c => c.status === "Accepted" || c.status === "Completed").length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Investor Management Dashboard"
        description="Monitor investor engagement, startup interests, and contact request pipelines."
      />

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Approved Investors</span>
            <div className="w-6 h-6 rounded bg-accent-red/10 border border-accent-red/20 flex items-center justify-center text-accent-red text-xs">
              <i className="fa-solid fa-hand-holding-dollar"></i>
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">{totalApprovedInvestors}</span>
            <span className="text-[10px] text-text-muted">Active Profiles</span>
          </div>
        </Card>

        <Card className="flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Startup Interests</span>
            <div className="w-6 h-6 rounded bg-accent-red/10 border border-accent-red/20 flex items-center justify-center text-accent-red text-xs">
              <i className="fa-solid fa-heart"></i>
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">{totalInterests}</span>
            <span className="text-[10px] text-text-secondary">Expressed interests</span>
          </div>
        </Card>

        <Card className="flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Contact Requests Sent</span>
            <div className="w-6 h-6 rounded bg-accent-red/10 border border-accent-red/20 flex items-center justify-center text-accent-red text-xs">
              <i className="fa-solid fa-paper-plane"></i>
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">{contactRequestsSent}</span>
            <span className="text-[10px] text-text-secondary">Requests sent</span>
          </div>
        </Card>

        <Card className="flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Meetings Scheduled</span>
            <div className="w-6 h-6 rounded bg-accent-red/10 border border-accent-red/20 flex items-center justify-center text-accent-red text-xs">
              <i className="fa-solid fa-calendar-check"></i>
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">{meetingsScheduled}</span>
            <span className="text-[10px] text-accent-green font-bold">In progress</span>
          </div>
        </Card>
      </div>

      {/* Visual Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title="Activity Breakdown" className="lg:col-span-2" icon="fa-solid fa-chart-line">
          <div className="h-60 w-full flex items-center justify-center">
            {/* Simple visual SVG graph */}
            <svg className="w-full h-full" viewBox="0 0 400 150">
              <line x1="30" y1="120" x2="380" y2="120" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" />
              {/* Contact requests path (red) */}
              <path
                d="M 30,100 L 80,75 L 130,85 L 180,45 L 230,65 L 280,30 L 330,25 L 380,10"
                fill="none"
                stroke="var(--accent-red)"
                strokeWidth="2"
                strokeLinecap="round"
              />
              {/* Meetings path (green) */}
              <path
                d="M 30,115 L 80,110 L 130,95 L 180,85 L 230,90 L 280,70 L 330,60 L 380,45"
                fill="none"
                stroke="var(--accent-green)"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <text x="30" y="135" fill="var(--text-muted)" fontSize="8" textAnchor="middle">Jan</text>
              <text x="180" y="135" fill="var(--text-muted)" fontSize="8" textAnchor="middle">Apr</text>
              <text x="380" y="135" fill="var(--text-muted)" fontSize="8" textAnchor="middle">Aug</text>
            </svg>
          </div>
        </Card>

        <Card title="Investor Areas of Interest" icon="fa-solid fa-tags">
          <div className="space-y-3.5 mt-2">
            <div>
              <div className="flex justify-between text-[11px] font-bold text-text-secondary mb-1">
                <span>Healthcare AI</span>
                <span>45%</span>
              </div>
              <div className="h-1.5 w-full bg-bg-input rounded-full overflow-hidden">
                <div className="h-full bg-accent-red rounded-full" style={{ width: "45%" }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[11px] font-bold text-text-secondary mb-1">
                <span>Fintech Blockchain</span>
                <span>28%</span>
              </div>
              <div className="h-1.5 w-full bg-bg-input rounded-full overflow-hidden">
                <div className="h-full bg-accent-red rounded-full" style={{ width: "28%" }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[11px] font-bold text-text-secondary mb-1">
                <span>Agritech IoT</span>
                <span>15%</span>
              </div>
              <div className="h-1.5 w-full bg-bg-input rounded-full overflow-hidden">
                <div className="h-full bg-accent-red rounded-full" style={{ width: "15%" }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-[11px] font-bold text-text-secondary mb-1">
                <span>Cybersecurity AI</span>
                <span>12%</span>
              </div>
              <div className="h-1.5 w-full bg-bg-input rounded-full overflow-hidden">
                <div className="h-full bg-accent-red rounded-full" style={{ width: "12%" }}></div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
