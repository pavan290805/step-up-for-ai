"use client";

import { Card, PageHeader, Badge } from "@/components/UI";
import { mockRecruiters, mockInternships } from "@/components/mockData";

export default function RecruiterDashboardPage() {
  const totalRecruiters = mockRecruiters.length;
  const approvedRecruiters = mockRecruiters.filter((r) => r.status === "Approved").length;
  const activeInternships = mockInternships.filter((i) => i.status === "Active").length;
  
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Recruiter Management Dashboard"
        description="Monitor recruiter registrations, active internship postings, and student employment pipelines."
      />

      {/* Overview Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Total Recruiters</span>
            <div className="w-6 h-6 rounded bg-accent-red/10 border border-accent-red/20 flex items-center justify-center text-accent-red text-xs">
              <i className="fa-solid fa-briefcase"></i>
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">{totalRecruiters}</span>
            <span className="text-[10px] text-text-muted">Registered</span>
          </div>
        </Card>

        <Card className="flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Approved Recruiters</span>
            <div className="w-6 h-6 rounded bg-accent-red/10 border border-accent-red/20 flex items-center justify-center text-accent-red text-xs">
              <i className="fa-solid fa-user-check"></i>
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">{approvedRecruiters}</span>
            <span className="text-[10px] text-accent-green font-bold">
              {Math.round((approvedRecruiters / totalRecruiters) * 100)}% Active
            </span>
          </div>
        </Card>

        <Card className="flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Active Internships</span>
            <div className="w-6 h-6 rounded bg-accent-red/10 border border-accent-red/20 flex items-center justify-center text-accent-red text-xs">
              <i className="fa-solid fa-file-invoice"></i>
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">{activeInternships}</span>
            <span className="text-[10px] text-text-secondary">Open positions</span>
          </div>
        </Card>

        <Card className="flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Internship Apps</span>
            <div className="w-6 h-6 rounded bg-accent-red/10 border border-accent-red/20 flex items-center justify-center text-accent-red text-xs">
              <i className="fa-solid fa-users"></i>
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">1,248</span>
            <span className="text-[10px] text-accent-green font-bold">+16% this week</span>
          </div>
        </Card>
      </div>

      {/* Trend & Recent List Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title="Applications Trend" className="lg:col-span-2" icon="fa-solid fa-chart-line">
          <div className="h-60 w-full flex items-center justify-center">
            {/* Simple visual SVG graph */}
            <svg className="w-full h-full" viewBox="0 0 400 150">
              <line x1="30" y1="120" x2="380" y2="120" stroke="rgba(255,255,255,0.06)" strokeWidth="1.5" />
              <path
                d="M 30,110 L 80,95 L 130,105 L 180,60 L 230,85 L 280,40 L 330,30 L 380,15"
                fill="none"
                stroke="var(--accent-red)"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <circle cx="30" cy="110" r="3" fill="var(--bg-secondary)" stroke="var(--accent-red)" strokeWidth="1.5" />
              <circle cx="180" cy="60" r="3" fill="var(--bg-secondary)" stroke="var(--accent-red)" strokeWidth="1.5" />
              <circle cx="380" cy="15" r="3" fill="var(--bg-secondary)" stroke="var(--accent-red)" strokeWidth="1.5" />
              <text x="30" y="135" fill="var(--text-muted)" fontSize="8" textAnchor="middle">Week 1</text>
              <text x="180" y="135" fill="var(--text-muted)" fontSize="8" textAnchor="middle">Week 3</text>
              <text x="380" y="135" fill="var(--text-muted)" fontSize="8" textAnchor="middle">Week 5</text>
            </svg>
          </div>
        </Card>

        <Card title="New Recruiter Requests" icon="fa-solid fa-user-plus">
          <div className="space-y-4 max-h-[250px] overflow-y-auto pr-1">
            {mockRecruiters.filter((r) => r.status === "Pending").map((rec) => (
              <div key={rec.id} className="p-3 bg-bg-input/20 border border-border-color/60 rounded-xl">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-xs font-bold text-white">{rec.name}</span>
                  <Badge status="pending" />
                </div>
                <div className="flex flex-col text-[10px] text-text-secondary leading-tight">
                  <span>{rec.designation} @ {rec.company}</span>
                  <span className="text-text-muted mt-1">{rec.appliedDate}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
