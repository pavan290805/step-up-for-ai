"use client";

import { useState } from "react";
import { Card, PageHeader } from "@/components/UI";

export default function SettingsPage() {
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [autoApproveRecruiters, setAutoApproveRecruiters] = useState(false);

  const handleUtilityAction = (actionName: string) => {
    alert(`${actionName} triggered! (Visual UI Action Only - No persistent changes made)`);
  };

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Page Header */}
      <PageHeader
        title="Settings & System Utilities"
        description="Configure dashboard system settings, notification preferences, and manage static databases."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* System Settings Card */}
        <Card title="System Settings" icon="fa-solid fa-gears">
          <div className="space-y-5">
            {/* Toggle 1 */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-white block">Maintenance Mode</span>
                <span className="text-[10px] text-text-muted">Put the platform in read-only maintenance mode.</span>
              </div>
              <button
                onClick={() => setMaintenanceMode(!maintenanceMode)}
                className={`w-10 h-5 rounded-full p-0.5 transition-all outline-none border cursor-pointer ${
                  maintenanceMode ? "bg-accent-red border-accent-red flex justify-end" : "bg-bg-input border-border-color flex justify-start"
                }`}
              >
                <span className="w-4 h-4 rounded-full bg-white shadow-sm block"></span>
              </button>
            </div>

            <div className="h-[1px] bg-border-color/60"></div>

            {/* Toggle 2 */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-white block">Email Audit Notifications</span>
                <span className="text-[10px] text-text-muted">Send automated alerts upon recruiter and investor registrations.</span>
              </div>
              <button
                onClick={() => setEmailNotifications(!emailNotifications)}
                className={`w-10 h-5 rounded-full p-0.5 transition-all outline-none border cursor-pointer ${
                  emailNotifications ? "bg-accent-red border-accent-red flex justify-end" : "bg-bg-input border-border-color flex justify-start"
                }`}
              >
                <span className="w-4 h-4 rounded-full bg-white shadow-sm block"></span>
              </button>
            </div>

            <div className="h-[1px] bg-border-color/60"></div>

            {/* Toggle 3 */}
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-white block">Auto-Approve Recruiters</span>
                <span className="text-[10px] text-text-muted">Bypass manual verification for recruiters with verified corporate domains.</span>
              </div>
              <button
                onClick={() => setAutoApproveRecruiters(!autoApproveRecruiters)}
                className={`w-10 h-5 rounded-full p-0.5 transition-all outline-none border cursor-pointer ${
                  autoApproveRecruiters ? "bg-accent-red border-accent-red flex justify-end" : "bg-bg-input border-border-color flex justify-start"
                }`}
              >
                <span className="w-4 h-4 rounded-full bg-white shadow-sm block"></span>
              </button>
            </div>
          </div>
        </Card>

        {/* Database Management Utilities Card */}
        <Card title="Database & Seeding Utilities" icon="fa-solid fa-database">
          <div className="space-y-4">
            <p className="text-xs text-text-secondary leading-relaxed">
              Reset the sandbox environment to default values or seed extra records for load testing.
              <span className="text-accent-red font-semibold block mt-1.5">Note: These operations are visual UI actions only.</span>
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={() => handleUtilityAction("Load Demo Data")}
                className="bg-accent-red hover:bg-accent-red-hover text-white text-xs font-bold rounded-xl px-4 py-2.5 transition-all cursor-pointer flex items-center gap-2"
              >
                <i className="fa-solid fa-wand-magic-sparkles"></i>
                <span>Load Demo Data</span>
              </button>

              <button
                onClick={() => handleUtilityAction("Reset Database")}
                className="bg-bg-input border border-border-color hover:border-accent-red/40 hover:text-white text-text-secondary rounded-xl px-4 py-2.5 transition-fast cursor-pointer flex items-center gap-2"
              >
                <i className="fa-solid fa-trash-can"></i>
                <span>Reset Database</span>
              </button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
