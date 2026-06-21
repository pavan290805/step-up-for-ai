"use client";

import { useState } from "react";
import { Card, Badge, PageHeader } from "@/components/UI";
import {
  mockStudents,
  mockWebinars,
  mockHackathons,
  mockPitchEvents,
  mockStartupApplications,
  mockRecentActivities,
} from "@/components/mockData";

export default function DashboardPage() {
  const [dateRange, setDateRange] = useState("Last 30 Days");
  const [exportOpen, setExportOpen] = useState(false);

  // Sparkline data coordinates for cards
  const sparklinePaths = {
    students: "M 0,25 Q 15,10 30,28 T 60,15 T 90,8 T 120,20",
    webinars: "M 0,28 Q 15,32 30,15 T 60,20 T 90,28 T 120,10",
    hackathons: "M 0,20 Q 15,15 30,22 T 60,30 T 90,12 T 120,5",
    pitches: "M 0,32 Q 15,22 30,25 T 60,10 T 90,18 T 120,24",
    apps: "M 0,15 Q 15,28 30,12 T 60,8 T 90,22 T 120,18",
    regs: "M 0,30 Q 15,20 30,25 T 60,15 T 90,5 T 120,12",
  };

  const handleExport = (type: string) => {
    alert(`${type} Export initiated! (Visual UI Action Only)`);
    setExportOpen(false);
  };

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Top Page Header */}
      <PageHeader
        title="Dashboard Overview"
        description="Comprehensive overview of student talent, startups, and upcoming platform events."
        actions={
          <div className="flex items-center gap-3">
            {/* Date Range Selector */}
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="bg-bg-secondary border border-border-color rounded-xl px-4 py-2 text-xs font-bold text-text-primary hover:border-accent-red/30 transition-all outline-none cursor-pointer"
            >
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>Last 3 Months</option>
              <option>This Year</option>
            </select>

            {/* Export Dropdown */}
            <div className="relative">
              <button
                onClick={() => setExportOpen(!exportOpen)}
                className="bg-accent-red hover:bg-accent-red-hover text-white rounded-xl px-4 py-2 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-glow-shadow/10"
              >
                <i className="fa-solid fa-download"></i>
                <span>Export</span>
                <i className="fa-solid fa-chevron-down text-[10px]"></i>
              </button>

              {exportOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-bg-secondary border border-border-color rounded-xl shadow-card p-1 z-40 glass-panel">
                  <button
                    onClick={() => handleExport("Excel")}
                    className="flex items-center gap-2.5 px-3 py-2 w-full text-left text-xs font-medium text-text-primary hover:bg-bg-input rounded-lg transition-fast cursor-pointer"
                  >
                    <i className="fa-regular fa-file-excel text-green-500 w-4 text-center"></i>
                    <span>Export to Excel</span>
                  </button>
                  <button
                    onClick={() => handleExport("CSV")}
                    className="flex items-center gap-2.5 px-3 py-2 w-full text-left text-xs font-medium text-text-primary hover:bg-bg-input rounded-lg transition-fast cursor-pointer"
                  >
                    <i className="fa-solid fa-file-csv text-blue-500 w-4 text-center"></i>
                    <span>Export to CSV</span>
                  </button>
                  <button
                    onClick={() => handleExport("PDF")}
                    className="flex items-center gap-2.5 px-3 py-2 w-full text-left text-xs font-medium text-text-primary hover:bg-bg-input rounded-lg transition-fast cursor-pointer"
                  >
                    <i className="fa-regular fa-file-pdf text-accent-red w-4 text-center"></i>
                    <span>Export to PDF</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        }
      />

      {/* 6 Grid Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Metric 1 */}
        <Card className="flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Students</span>
            <div className="w-6 h-6 rounded bg-accent-red/10 border border-accent-red/20 flex items-center justify-center text-accent-red text-xs">
              <i className="fa-solid fa-graduation-cap"></i>
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">1,248</span>
            <span className="text-[10px] text-accent-green font-bold flex items-center gap-0.5">
              <i className="fa-solid fa-arrow-up"></i> +12%
            </span>
          </div>
          <div className="h-8 mt-2.5">
            <svg viewBox="0 0 120 40" className="w-full h-full stroke-accent-red fill-none" strokeWidth="2">
              <path d={sparklinePaths.students} />
            </svg>
          </div>
        </Card>

        {/* Metric 2 */}
        <Card className="flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Webinars</span>
            <div className="w-6 h-6 rounded bg-accent-red/10 border border-accent-red/20 flex items-center justify-center text-accent-red text-xs">
              <i className="fa-solid fa-video"></i>
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">24</span>
            <span className="text-[10px] text-accent-green font-bold flex items-center gap-0.5">
              <i className="fa-solid fa-arrow-up"></i> +8%
            </span>
          </div>
          <div className="h-8 mt-2.5">
            <svg viewBox="0 0 120 40" className="w-full h-full stroke-accent-red fill-none" strokeWidth="2">
              <path d={sparklinePaths.webinars} />
            </svg>
          </div>
        </Card>

        {/* Metric 3 */}
        <Card className="flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Hackathons</span>
            <div className="w-6 h-6 rounded bg-accent-red/10 border border-accent-red/20 flex items-center justify-center text-accent-red text-xs">
              <i className="fa-solid fa-code"></i>
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">18</span>
            <span className="text-[10px] text-text-muted font-bold">Stable</span>
          </div>
          <div className="h-8 mt-2.5">
            <svg viewBox="0 0 120 40" className="w-full h-full stroke-accent-red fill-none" strokeWidth="2">
              <path d={sparklinePaths.hackathons} />
            </svg>
          </div>
        </Card>

        {/* Metric 4 */}
        <Card className="flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Pitches</span>
            <div className="w-6 h-6 rounded bg-accent-red/10 border border-accent-red/20 flex items-center justify-center text-accent-red text-xs">
              <i className="fa-solid fa-microphone"></i>
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">11</span>
            <span className="text-[10px] text-accent-green font-bold flex items-center gap-0.5">
              <i className="fa-solid fa-arrow-up"></i> +15%
            </span>
          </div>
          <div className="h-8 mt-2.5">
            <svg viewBox="0 0 120 40" className="w-full h-full stroke-accent-red fill-none" strokeWidth="2">
              <path d={sparklinePaths.pitches} />
            </svg>
          </div>
        </Card>

        {/* Metric 5 */}
        <Card className="flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Startups</span>
            <div className="w-6 h-6 rounded bg-accent-red/10 border border-accent-red/20 flex items-center justify-center text-accent-red text-xs">
              <i className="fa-solid fa-rocket"></i>
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">47</span>
            <span className="text-[10px] text-accent-green font-bold flex items-center gap-0.5">
              <i className="fa-solid fa-arrow-up"></i> +22%
            </span>
          </div>
          <div className="h-8 mt-2.5">
            <svg viewBox="0 0 120 40" className="w-full h-full stroke-accent-red fill-none" strokeWidth="2">
              <path d={sparklinePaths.apps} />
            </svg>
          </div>
        </Card>

        {/* Metric 6 */}
        <Card className="flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Registrations</span>
            <div className="w-6 h-6 rounded bg-accent-red/10 border border-accent-red/20 flex items-center justify-center text-accent-red text-xs">
              <i className="fa-solid fa-clipboard-user"></i>
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-black text-white">1,406</span>
            <span className="text-[10px] text-accent-green font-bold flex items-center gap-0.5">
              <i className="fa-solid fa-arrow-up"></i> +14%
            </span>
          </div>
          <div className="h-8 mt-2.5">
            <svg viewBox="0 0 120 40" className="w-full h-full stroke-accent-red fill-none" strokeWidth="2">
              <path d={sparklinePaths.regs} />
            </svg>
          </div>
        </Card>
      </div>

      {/* Visual Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Line Chart */}
        <Card title="Registrations Trend" className="lg:col-span-2" icon="fa-solid fa-chart-line">
          <div className="h-64 w-full flex items-center justify-center relative">
            <svg className="w-full h-full" viewBox="0 0 500 200">
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--accent-red)" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="var(--accent-red)" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="40" y1="20" x2="480" y2="20" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
              <line x1="40" y1="60" x2="480" y2="60" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
              <line x1="40" y1="100" x2="480" y2="100" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
              <line x1="40" y1="140" x2="480" y2="140" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
              <line x1="40" y1="170" x2="480" y2="170" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />

              {/* Data Path Fill */}
              <path
                d="M 40,150 L 100,120 L 160,135 L 220,90 L 280,110 L 340,60 L 400,45 L 480,30 L 480,170 L 40,170 Z"
                fill="url(#chartGradient)"
              />

              {/* Data Path Line */}
              <path
                d="M 40,150 L 100,120 L 160,135 L 220,90 L 280,110 L 340,60 L 400,45 L 480,30"
                fill="none"
                stroke="var(--accent-red)"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Data Nodes */}
              <circle cx="40" cy="150" r="4.5" fill="var(--bg-secondary)" stroke="var(--accent-red)" strokeWidth="2.5" />
              <circle cx="100" cy="120" r="4.5" fill="var(--bg-secondary)" stroke="var(--accent-red)" strokeWidth="2.5" />
              <circle cx="160" cy="135" r="4.5" fill="var(--bg-secondary)" stroke="var(--accent-red)" strokeWidth="2.5" />
              <circle cx="220" cy="90" r="4.5" fill="var(--bg-secondary)" stroke="var(--accent-red)" strokeWidth="2.5" />
              <circle cx="280" cy="110" r="4.5" fill="var(--bg-secondary)" stroke="var(--accent-red)" strokeWidth="2.5" />
              <circle cx="340" cy="60" r="4.5" fill="var(--bg-secondary)" stroke="var(--accent-red)" strokeWidth="2.5" />
              <circle cx="400" cy="45" r="4.5" fill="var(--bg-secondary)" stroke="var(--accent-red)" strokeWidth="2.5" />
              <circle cx="480" cy="30" r="4.5" fill="var(--bg-secondary)" stroke="var(--accent-red)" strokeWidth="2.5" />

              {/* X Labels */}
              <text x="40" y="190" fill="var(--text-muted)" fontSize="9" fontWeight="bold" textAnchor="middle">
                Jan
              </text>
              <text x="100" y="190" fill="var(--text-muted)" fontSize="9" fontWeight="bold" textAnchor="middle">
                Feb
              </text>
              <text x="160" y="190" fill="var(--text-muted)" fontSize="9" fontWeight="bold" textAnchor="middle">
                Mar
              </text>
              <text x="220" y="190" fill="var(--text-muted)" fontSize="9" fontWeight="bold" textAnchor="middle">
                Apr
              </text>
              <text x="280" y="190" fill="var(--text-muted)" fontSize="9" fontWeight="bold" textAnchor="middle">
                May
              </text>
              <text x="340" y="190" fill="var(--text-muted)" fontSize="9" fontWeight="bold" textAnchor="middle">
                Jun
              </text>
              <text x="400" y="190" fill="var(--text-muted)" fontSize="9" fontWeight="bold" textAnchor="middle">
                Jul
              </text>
              <text x="480" y="190" fill="var(--text-muted)" fontSize="9" fontWeight="bold" textAnchor="middle">
                Aug
              </text>

              {/* Y Labels */}
              <text x="30" y="24" fill="var(--text-muted)" fontSize="9" fontWeight="bold" textAnchor="end">
                300
              </text>
              <text x="30" y="64" fill="var(--text-muted)" fontSize="9" fontWeight="bold" textAnchor="end">
                200
              </text>
              <text x="30" y="104" fill="var(--text-muted)" fontSize="9" fontWeight="bold" textAnchor="end">
                100
              </text>
              <text x="30" y="144" fill="var(--text-muted)" fontSize="9" fontWeight="bold" textAnchor="end">
                50
              </text>
              <text x="30" y="174" fill="var(--text-muted)" fontSize="9" fontWeight="bold" textAnchor="end">
                0
              </text>
            </svg>
          </div>
        </Card>

        {/* Donut Chart */}
        <Card title="Registration Mix" icon="fa-solid fa-chart-pie">
          <div className="h-64 w-full flex flex-col items-center justify-center">
            <div className="relative w-36 h-36 flex items-center justify-center">
              {/* SVG Circle segments */}
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.915" fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="3" />

                {/* Segment 1: Students - 70% (cyan/red accent) */}
                <circle
                  cx="18"
                  cy="18"
                  r="15.915"
                  fill="none"
                  stroke="var(--accent-red)"
                  strokeWidth="3.2"
                  strokeDasharray="70 30"
                  strokeDashoffset="0"
                  strokeLinecap="round"
                />

                {/* Segment 2: Recruiters - 20% (green) */}
                <circle
                  cx="18"
                  cy="18"
                  r="15.915"
                  fill="none"
                  stroke="var(--accent-green)"
                  strokeWidth="3.2"
                  strokeDasharray="20 80"
                  strokeDashoffset="-70"
                  strokeLinecap="round"
                />

                {/* Segment 3: Investors - 10% (blue) */}
                <circle
                  cx="18"
                  cy="18"
                  r="15.915"
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="3.2"
                  strokeDasharray="10 90"
                  strokeDashoffset="-90"
                  strokeLinecap="round"
                />
              </svg>
              {/* Inner Circle content */}
              <div className="absolute flex flex-col items-center leading-none">
                <span className="text-2xl font-black text-white">1,406</span>
                <span className="text-[9px] uppercase tracking-wider text-text-muted mt-1 font-bold">Total Mix</span>
              </div>
            </div>

            {/* Legends */}
            <div className="w-full grid grid-cols-3 gap-2 mt-6">
              <div className="flex flex-col items-center border-r border-border-color/60">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-accent-red shrink-0"></span>
                  <span className="text-[10px] text-text-secondary font-bold">Students</span>
                </div>
                <span className="text-xs font-black text-white mt-1">984 (70%)</span>
              </div>

              <div className="flex flex-col items-center border-r border-border-color/60">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-accent-green shrink-0"></span>
                  <span className="text-[10px] text-text-secondary font-bold">Recruiters</span>
                </div>
                <span className="text-xs font-black text-white mt-1">281 (20%)</span>
              </div>

              <div className="flex flex-col items-center">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shrink-0"></span>
                  <span className="text-[10px] text-text-secondary font-bold">Investors</span>
                </div>
                <span className="text-xs font-black text-white mt-1">141 (10%)</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Upcoming & Recent items Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column: Recent Activities list */}
        <Card title="Recent Activities" icon="fa-solid fa-list-check" className="xl:col-span-2">
          <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
            {mockRecentActivities.map((act) => (
              <div key={act.id} className="flex gap-4 p-3 bg-bg-input/20 border border-border-color/60 rounded-xl hover:border-accent-red/20 transition-all">
                <div className="w-8 h-8 rounded-lg bg-bg-input flex items-center justify-center shrink-0 border border-border-color/80">
                  {act.type === "registration" && <i className="fa-solid fa-user-plus text-xs text-blue-400"></i>}
                  {act.type === "application" && <i className="fa-solid fa-rocket text-xs text-accent-red"></i>}
                  {act.type === "interest" && <i className="fa-solid fa-hand-holding-dollar text-xs text-green-400"></i>}
                  {act.type === "recruiter" && <i className="fa-solid fa-briefcase text-xs text-amber-400"></i>}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-white truncate">{act.name}</span>
                    <span className="text-[10px] text-text-muted shrink-0 font-medium">{act.date}</span>
                  </div>
                  <p className="text-[11px] text-text-secondary mt-1">{act.description}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Right Column: Upcoming Events list */}
        <Card title="Upcoming Events" icon="fa-regular fa-calendar-days">
          <div className="space-y-4 max-h-[350px] overflow-y-auto pr-1">
            {/* Webinar */}
            {mockWebinars.slice(0, 1).map((web) => (
              <div key={`web-${web.id}`} className="p-3 bg-bg-input/20 border border-border-color/60 rounded-xl">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[9px] uppercase tracking-wider font-bold bg-accent-red/10 text-accent-red border border-accent-red/20 px-1.5 py-0.5 rounded">
                    Webinar
                  </span>
                  <span className="text-[10px] text-text-muted font-bold">{web.startDate}</span>
                </div>
                <h4 className="text-xs font-bold text-white mb-1.5">{web.name}</h4>
                <div className="flex flex-col gap-1 text-[10px] text-text-secondary">
                  <span>
                    <i className="fa-regular fa-clock w-4 text-center text-text-muted"></i>
                    {web.startTime} (Timezone: {web.timezone})
                  </span>
                  <span>
                    <i className="fa-solid fa-location-dot w-4 text-center text-text-muted"></i>
                    {web.venue}
                  </span>
                </div>
              </div>
            ))}

            {/* Hackathon */}
            {mockHackathons.slice(0, 1).map((hack) => (
              <div key={`hack-${hack.id}`} className="p-3 bg-bg-input/20 border border-border-color/60 rounded-xl">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[9px] uppercase tracking-wider font-bold bg-green-500/10 text-green-500 border border-green-500/20 px-1.5 py-0.5 rounded">
                    Hackathon
                  </span>
                  <span className="text-[10px] text-text-muted font-bold">{hack.startDate}</span>
                </div>
                <h4 className="text-xs font-bold text-white mb-1.5">{hack.name}</h4>
                <div className="flex flex-col gap-1 text-[10px] text-text-secondary">
                  <span>
                    <i className="fa-regular fa-clock w-4 text-center text-text-muted"></i>
                    Conducted by: {hack.conductedBy}
                  </span>
                  <span>
                    <i className="fa-solid fa-location-dot w-4 text-center text-text-muted"></i>
                    {hack.venue}
                  </span>
                </div>
              </div>
            ))}

            {/* Pitch Event */}
            {mockPitchEvents.slice(0, 1).map((pe) => (
              <div key={`pe-${pe.id}`} className="p-3 bg-bg-input/20 border border-border-color/60 rounded-xl">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[9px] uppercase tracking-wider font-bold bg-blue-500/10 text-blue-500 border border-blue-500/20 px-1.5 py-0.5 rounded">
                    Pitch Event
                  </span>
                  <span className="text-[10px] text-text-muted font-bold">{pe.startDate}</span>
                </div>
                <h4 className="text-xs font-bold text-white mb-1.5">{pe.name}</h4>
                <div className="flex flex-col gap-1 text-[10px] text-text-secondary">
                  <span>
                    <i className="fa-regular fa-clock w-4 text-center text-text-muted"></i>
                    Ticket: {pe.ticketName} (₹{pe.ticketPrice})
                  </span>
                  <span>
                    <i className="fa-solid fa-location-dot w-4 text-center text-text-muted"></i>
                    {pe.venue}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
