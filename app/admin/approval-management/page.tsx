"use client";

import { Card, PageHeader } from "@/components/UI";
import { mockRecruiters, mockInvestors } from "@/components/mockData";

export default function ApprovalDashboardPage() {
  const pendingRecs = mockRecruiters.filter((r) => r.status === "Pending").length;
  const approvedRecs = mockRecruiters.filter((r) => r.status === "Approved").length;
  const rejectedRecs = mockRecruiters.filter((r) => r.status === "Rejected").length;

  const pendingInvs = mockInvestors.filter((i) => i.status === "Pending").length;
  const approvedInvs = mockInvestors.filter((i) => i.status === "Approved").length;
  const rejectedInvs = mockInvestors.filter((i) => i.status === "Rejected").length;

  const totalPending = pendingRecs + pendingInvs;
  const totalApproved = approvedRecs + approvedInvs;
  const totalRejected = rejectedRecs + rejectedInvs;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Approval Management Dashboard"
        description="Verify and authorize registered recruiters and institutional investors."
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Pending Requests</span>
            <div className="w-6 h-6 rounded bg-accent-red/10 border border-accent-red/20 flex items-center justify-center text-accent-red text-xs">
              <i className="fa-solid fa-clock"></i>
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">{totalPending}</span>
            <span className="text-[10px] text-text-muted">Awaiting review</span>
          </div>
        </Card>

        <Card className="flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Approved Accounts</span>
            <div className="w-6 h-6 rounded bg-accent-red/10 border border-accent-red/20 flex items-center justify-center text-accent-red text-xs">
              <i className="fa-solid fa-circle-check"></i>
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">{totalApproved}</span>
            <span className="text-[10px] text-accent-green font-bold">Authorized</span>
          </div>
        </Card>

        <Card className="flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Rejected Accounts</span>
            <div className="w-6 h-6 rounded bg-accent-red/10 border border-accent-red/20 flex items-center justify-center text-accent-red text-xs">
              <i className="fa-solid fa-circle-xmark"></i>
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">{totalRejected}</span>
            <span className="text-[10px] text-text-muted">Denied access</span>
          </div>
        </Card>

        <Card className="flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Total Registrants</span>
            <div className="w-6 h-6 rounded bg-accent-red/10 border border-accent-red/20 flex items-center justify-center text-accent-red text-xs">
              <i className="fa-solid fa-users"></i>
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">{totalPending + totalApproved + totalRejected}</span>
            <span className="text-[10px] text-text-secondary">Profiles audited</span>
          </div>
        </Card>
      </div>

      {/* Grid comparing recruiters and investors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card title="Recruiters Approval Status" icon="fa-solid fa-briefcase">
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-text-secondary">
              <span>Pending Recruiters</span>
              <span className="font-bold text-white">{pendingRecs}</span>
            </div>
            <div className="h-2 w-full bg-bg-input rounded-full overflow-hidden">
              <div className="h-full bg-accent-red" style={{ width: `${(pendingRecs / (pendingRecs + approvedRecs + rejectedRecs)) * 100}%` }}></div>
            </div>

            <div className="flex items-center justify-between text-xs text-text-secondary">
              <span>Approved Recruiters</span>
              <span className="font-bold text-white">{approvedRecs}</span>
            </div>
            <div className="h-2 w-full bg-bg-input rounded-full overflow-hidden">
              <div className="h-full bg-accent-green" style={{ width: `${(approvedRecs / (pendingRecs + approvedRecs + rejectedRecs)) * 100}%` }}></div>
            </div>

            <div className="flex items-center justify-between text-xs text-text-secondary">
              <span>Rejected Recruiters</span>
              <span className="font-bold text-white">{rejectedRecs}</span>
            </div>
            <div className="h-2 w-full bg-bg-input rounded-full overflow-hidden">
              <div className="h-full bg-text-muted" style={{ width: `${(rejectedRecs / (pendingRecs + approvedRecs + rejectedRecs)) * 100}%` }}></div>
            </div>
          </div>
        </Card>

        <Card title="Investors Approval Status" icon="fa-solid fa-hand-holding-dollar">
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-text-secondary">
              <span>Pending Investors</span>
              <span className="font-bold text-white">{pendingInvs}</span>
            </div>
            <div className="h-2 w-full bg-bg-input rounded-full overflow-hidden">
              <div className="h-full bg-accent-red" style={{ width: `${(pendingInvs / (pendingInvs + approvedInvs + rejectedInvs)) * 100}%` }}></div>
            </div>

            <div className="flex items-center justify-between text-xs text-text-secondary">
              <span>Approved Investors</span>
              <span className="font-bold text-white">{approvedInvs}</span>
            </div>
            <div className="h-2 w-full bg-bg-input rounded-full overflow-hidden">
              <div className="h-full bg-accent-green" style={{ width: `${(approvedInvs / (pendingInvs + approvedInvs + rejectedInvs)) * 100}%` }}></div>
            </div>

            <div className="flex items-center justify-between text-xs text-text-secondary">
              <span>Rejected Investors</span>
              <span className="font-bold text-white">{rejectedInvs}</span>
            </div>
            <div className="h-2 w-full bg-bg-input rounded-full overflow-hidden">
              <div className="h-full bg-text-muted" style={{ width: `${(rejectedInvs / (pendingInvs + approvedInvs + rejectedInvs)) * 100}%` }}></div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
