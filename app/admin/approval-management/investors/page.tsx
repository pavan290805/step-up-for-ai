"use client";

import { useState } from "react";
import { Table, Badge, PageHeader } from "@/components/UI";
import { mockInvestors } from "@/components/mockData";

export default function InvestorApprovalsPage() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const handleAction = (id: string, action: string) => {
    alert(`Investor account ${id} has been ${action}ed! (Visual UI Action Only - Not persisted)`);
  };

  const filtered = mockInvestors.filter((inv) => {
    const matchesSearch = inv.name.toLowerCase().includes(search.toLowerCase()) ||
      inv.organization.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === "All" || inv.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Investor Approvals"
        description="Audit and authorize registered VC and Angel investor profiles."
      />

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row items-center gap-4 bg-bg-secondary border border-border-color p-4 rounded-2xl shadow-card">
        <div className="flex items-center gap-2.5 bg-bg-input border border-border-color px-4 py-2.5 rounded-xl w-full sm:w-80 text-text-secondary focus-within:border-accent-red/50 focus-within:text-text-primary transition-all">
          <i className="fa-solid fa-magnifying-glass text-xs"></i>
          <input
            type="text"
            className="bg-transparent border-none text-xs w-full text-white placeholder-text-muted outline-none"
            placeholder="Search investors, organizations..."
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
      <Table headers={["ID", "Name", "Organization", "Designation", "Email", "Applied Date", "Status", "Actions"]}>
        {filtered.map((inv) => (
          <tr key={inv.id} className="hover:bg-bg-input/20 transition-all">
            <td className="px-5 py-4 font-bold text-text-muted">{inv.id}</td>
            <td className="px-5 py-4 font-bold text-white">{inv.name}</td>
            <td className="px-5 py-4 text-text-secondary">{inv.organization}</td>
            <td className="px-5 py-4 text-text-secondary">{inv.designation}</td>
            <td className="px-5 py-4 text-text-secondary font-mono">{inv.email}</td>
            <td className="px-5 py-4 text-text-muted">{inv.appliedDate}</td>
            <td className="px-5 py-4">
              <Badge status={inv.status} />
            </td>
            <td className="px-5 py-4 flex gap-2">
              {inv.status === "Pending" && (
                <>
                  <button
                    onClick={() => handleAction(inv.id, "Reject")}
                    className="bg-bg-input border border-accent-red/40 hover:bg-accent-red/10 text-accent-red text-xs font-bold rounded-lg px-2.5 py-1.5 transition-fast cursor-pointer"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => handleAction(inv.id, "Approve")}
                    className="bg-accent-red hover:bg-accent-red-hover text-white text-xs font-bold rounded-lg px-2.5 py-1.5 transition-all cursor-pointer"
                  >
                    Approve
                  </button>
                </>
              )}
              {inv.status !== "Pending" && <span className="text-[10px] text-text-muted italic">Audited</span>}
            </td>
          </tr>
        ))}
      </Table>
    </div>
  );
}
