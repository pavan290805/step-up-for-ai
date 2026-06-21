"use client";

import { useState } from "react";
import { Table, Badge, PageHeader } from "@/components/UI";
import { mockRecruiters, mockInvestors } from "@/components/mockData";

export default function PendingRequestsPage() {
  const [search, setSearch] = useState("");

  const pendingRecs = mockRecruiters.filter((r) => r.status === "Pending").map((r) => ({ ...r, type: "Recruiter" }));
  const pendingInvs = mockInvestors.filter((i) => i.status === "Pending").map((i) => ({ ...i, type: "Investor", company: i.organization }));
  
  const allPending = [...pendingRecs, ...pendingInvs];

  const handleAction = (id: string, action: string) => {
    alert(`Account ${id} has been ${action}ed! (Visual UI Action Only - Not persisted)`);
  };

  const filtered = allPending.filter((item) => {
    return item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.company.toLowerCase().includes(search.toLowerCase()) ||
      item.type.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Pending Approval Requests"
        description="Review all recruiter and investor profiles currently awaiting platform authorization."
      />

      {/* Search */}
      <div className="flex items-center gap-2.5 bg-bg-input border border-border-color px-4 py-2.5 rounded-xl w-full sm:w-80 text-text-secondary focus-within:border-accent-red/50 focus-within:text-text-primary transition-all">
        <i className="fa-solid fa-magnifying-glass text-xs"></i>
        <input
          type="text"
          className="bg-transparent border-none text-xs w-full text-white placeholder-text-muted outline-none"
          placeholder="Search by name, organization, role..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <Table headers={["ID", "Name", "Role / Type", "Organization / Company", "Designation", "Email", "Applied Date", "Actions"]}>
        {filtered.map((item) => (
          <tr key={item.id} className="hover:bg-bg-input/20 transition-all">
            <td className="px-5 py-4 font-bold text-text-muted">{item.id}</td>
            <td className="px-5 py-4 font-bold text-white">{item.name}</td>
            <td className="px-5 py-4">
              <Badge status={item.type === "Recruiter" ? "info" : "approved"} label={item.type} />
            </td>
            <td className="px-5 py-4 text-text-secondary">{item.company}</td>
            <td className="px-5 py-4 text-text-secondary">{item.designation}</td>
            <td className="px-5 py-4 text-text-secondary font-mono">{item.email}</td>
            <td className="px-5 py-4 text-text-muted">{item.appliedDate}</td>
            <td className="px-5 py-4 flex gap-2">
              <button
                onClick={() => handleAction(item.id, "Reject")}
                className="bg-bg-input border border-accent-red/40 hover:bg-accent-red/10 text-accent-red text-xs font-bold rounded-lg px-2.5 py-1.5 transition-fast cursor-pointer"
              >
                Reject
              </button>
              <button
                onClick={() => handleAction(item.id, "Approve")}
                className="bg-accent-red hover:bg-accent-red-hover text-white text-xs font-bold rounded-lg px-2.5 py-1.5 transition-all cursor-pointer"
              >
                Approve
              </button>
            </td>
          </tr>
        ))}
      </Table>

      {filtered.length === 0 && (
        <div className="text-center py-12 border border-dashed border-border-color rounded-2xl bg-bg-secondary/20">
          <i className="fa-solid fa-clock-rotate-left text-2xl text-text-muted mb-3"></i>
          <p className="text-sm text-text-secondary">No pending requests found.</p>
        </div>
      )}
    </div>
  );
}
