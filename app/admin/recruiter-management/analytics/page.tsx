"use client";

import { Card, PageHeader } from "@/components/UI";

export default function RecruiterAnalyticsPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Recruitment Analytics"
        description="Visual analytics on job postings, stipend distributions, and recruiter engagement."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Chart 1: Top Postings by Company */}
        <Card title="Top Posting Companies" icon="fa-solid fa-chart-simple">
          <div className="h-64 w-full flex items-center justify-center">
            {/* SVG Vertical Bar Chart */}
            <svg className="w-full h-full" viewBox="0 0 300 180">
              {/* Bars */}
              {/* TechNova - 12 postings */}
              <rect x="30" y="40" width="25" height="100" fill="var(--accent-red)" rx="2" />
              <text x="42.5" y="32" fill="white" fontSize="8" fontWeight="bold" textAnchor="middle">12</text>
              <text x="42.5" y="152" fill="var(--text-secondary)" fontSize="7" fontWeight="bold" textAnchor="middle">TechNova</text>

              {/* DataMind - 10 postings */}
              <rect x="85" y="56" width="25" height="84" fill="var(--accent-red)" opacity="0.9" rx="2" />
              <text x="97.5" y="48" fill="white" fontSize="8" fontWeight="bold" textAnchor="middle">10</text>
              <text x="97.5" y="152" fill="var(--text-secondary)" fontSize="7" fontWeight="bold" textAnchor="middle">DataMind</text>

              {/* BrandWave - 8 postings */}
              <rect x="140" y="73" width="25" height="67" fill="var(--accent-red)" opacity="0.8" rx="2" />
              <text x="152.5" y="65" fill="white" fontSize="8" fontWeight="bold" textAnchor="middle">8</text>
              <text x="152.5" y="152" fill="var(--text-secondary)" fontSize="7" fontWeight="bold" textAnchor="middle">BrandWave</text>

              {/* CodeWave - 7 postings */}
              <rect x="195" y="81" width="25" height="59" fill="var(--accent-red)" opacity="0.7" rx="2" />
              <text x="207.5" y="73" fill="white" fontSize="8" fontWeight="bold" textAnchor="middle">7</text>
              <text x="207.5" y="152" fill="var(--text-secondary)" fontSize="7" fontWeight="bold" textAnchor="middle">CodeWave</text>

              {/* Infosys - 5 postings */}
              <rect x="250" y="98" width="25" height="42" fill="var(--accent-red)" opacity="0.5" rx="2" />
              <text x="262.5" y="90" fill="white" fontSize="8" fontWeight="bold" textAnchor="middle">5</text>
              <text x="262.5" y="152" fill="var(--text-secondary)" fontSize="7" fontWeight="bold" textAnchor="middle">Infosys</text>

              {/* Baseline */}
              <line x1="15" y1="140" x2="285" y2="140" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
            </svg>
          </div>
        </Card>

        {/* Chart 2: Top Demanded Skills */}
        <Card title="Top Demanded Skills" icon="fa-solid fa-tags">
          <div className="h-64 w-full flex items-center justify-center">
            {/* SVG Horizontal Bar Chart */}
            <svg className="w-full h-full" viewBox="0 0 300 180">
              {/* Row 1: Python - 84% */}
              <text x="15" y="32" fill="var(--text-secondary)" fontSize="8" fontWeight="bold">Python</text>
              <rect x="65" y="24" width="180" height="10" fill="rgba(255,255,255,0.03)" rx="2" />
              <rect x="65" y="24" width="151.2" height="10" fill="var(--accent-red)" rx="2" />
              <text x="255" y="32" fill="white" fontSize="8" fontWeight="bold">84%</text>

              {/* Row 2: React - 72% */}
              <text x="15" y="62" fill="var(--text-secondary)" fontSize="8" fontWeight="bold">React</text>
              <rect x="65" y="54" width="180" height="10" fill="rgba(255,255,255,0.03)" rx="2" />
              <rect x="65" y="54" width="129.6" height="10" fill="var(--accent-red)" opacity="0.9" rx="2" />
              <text x="255" y="62" fill="white" fontSize="8" fontWeight="bold">72%</text>

              {/* Row 3: SQL - 60% */}
              <text x="15" y="92" fill="var(--text-secondary)" fontSize="8" fontWeight="bold">SQL</text>
              <rect x="65" y="84" width="180" height="10" fill="rgba(255,255,255,0.03)" rx="2" />
              <rect x="65" y="84" width="108" height="10" fill="var(--accent-red)" opacity="0.8" rx="2" />
              <text x="255" y="92" fill="white" fontSize="8" fontWeight="bold">60%</text>

              {/* Row 4: Machine Learning - 48% */}
              <text x="15" y="122" fill="var(--text-secondary)" fontSize="8" fontWeight="bold">ML</text>
              <rect x="65" y="114" width="180" height="10" fill="rgba(255,255,255,0.03)" rx="2" />
              <rect x="65" y="114" width="86.4" height="10" fill="var(--accent-red)" opacity="0.6" rx="2" />
              <text x="255" y="122" fill="white" fontSize="8" fontWeight="bold">48%</text>

              {/* Row 5: NodeJS - 35% */}
              <text x="15" y="152" fill="var(--text-secondary)" fontSize="8" fontWeight="bold">NodeJS</text>
              <rect x="65" y="144" width="180" height="10" fill="rgba(255,255,255,0.03)" rx="2" />
              <rect x="65" y="144" width="63" height="10" fill="var(--accent-red)" opacity="0.4" rx="2" />
              <text x="255" y="152" fill="white" fontSize="8" fontWeight="bold">35%</text>
            </svg>
          </div>
        </Card>
      </div>
    </div>
  );
}
