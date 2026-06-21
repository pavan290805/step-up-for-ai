"use client";

import { useState } from "react";
import { Table, Badge, PageHeader } from "@/components/UI";
import { mockRecruiters } from "@/components/mockData";

export default function RecruiterApprovalsPage() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const handleAction = (id: string, action: string) => {
    alert(`Recruiter account ${id} has been ${action}ed! (Visual UI Action Only - Not persisted)`);
  };

  const filtered = mockRecruiters.filter((rec) => {
    const matchesSearch = rec.name.toLowerCase().includes(search.toLowerCase()) ||
      rec.company.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === "All" || rec.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Recruiter Approvals"
        description="Audit and manage access levels for recruiter registrants."
      />

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row items-center gap-4 bg-bg-secondary border border-border-color p-4 rounded-2xl shadow-card">
        <div className="flex items-center gap-2.5 bg-bg-input border border-border-color px-4 py-2.5 rounded-xl w-full sm:w-80 text-text-secondary focus-within:border-accent-red/50 focus-within:text-text-primary transition-all">
          <i className="fa-solid fa-magnifying-glass text-xs"></i>
          <input
            type="text"
            className="bg-transparent border-none text-xs w-full text-white placeholder-text-muted outline-none"
            placeholder="Search recruiters, companies..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="bg-bg-input border border-border-color rounded-xl px-4 py-2.5 text-xs text-text-primary hover:border-accent-red/30 transition-all outline-none cursor-pointer w-full sm:w-40"
        >
          <option value="All">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      {/* Table */}
      <Table headers={["ID", "Name", "Company", "Designation", "Email", "Applied Date", "Status", "Actions"]}>
        {filtered.map((rec) => (
          <tr key={rec.id} className="hover:bg-bg-input/20 transition-all">
            <td className="px-5 py-4 font-bold text-text-muted">{rec.id}</td>
            <td className="px-5 py-4 font-bold text-white">{rec.name}</td>
            <td className="px-5 py-4 text-text-secondary">{rec.company}</td>
            <td className="px-5 py-4 text-text-secondary">{rec.designation}</td>
            <td className="px-5 py-4 text-text-secondary font-mono">{rec.email}</td>
            <td className="px-5 py-4 text-text-muted">{rec.appliedDate}</td>
            <td className="px-5 py-4">
              <Badge status={rec.status} />
            </td>
            <td className="px-5 py-4 flex gap-2">
              {rec.status === "Pending" && (
                <>
                  <button
                    onClick={() => handleAction(rec.id, "Reject")}
                    className="bg-bg-input border border-accent-red/40 hover:bg-accent-red/10 text-accent-red text-xs font-bold rounded-lg px-2.5 py-1.5 transition-fast cursor-pointer"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleAction(rec.id, "Approve")}
                    className="bg-accent-red hover:bg-accent-red-hover text-white text-xs font-bold rounded-lg px-2.5 py-1.5 transition-all cursor-pointer"
                  >
                    Approve
                  </button>
                </>
              )}
              {rec.status !== "Pending" && <span className="text-[10px] text-text-muted italic">Audited</span>}
            </td>
          </tr>
        ))}
      </Table>
    </div>
  );
}
