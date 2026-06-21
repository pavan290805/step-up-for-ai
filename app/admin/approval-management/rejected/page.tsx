"use client";

import { useState } from "react";
import { Table, Badge, PageHeader } from "@/components/UI";
import { mockRecruiters, mockInvestors } from "@/components/mockData";

export default function RejectedAccountsPage() {
  const [search, setSearch] = useState("");

  const rejectedRecs = mockRecruiters.filter((r) => r.status === "Rejected").map((r) => ({ ...r, type: "Recruiter" }));
  const rejectedInvs = mockInvestors.filter((i) => i.status === "Rejected").map((i) => ({ ...i, type: "Investor", company: i.organization }));
  
  const allRejected = [...rejectedRecs, ...rejectedInvs];

  const filtered = allRejected.filter((item) => {
    return item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.company.toLowerCase().includes(search.toLowerCase()) ||
      item.type.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Rejected Accounts"
        description="Verify and browse the directory of all platform-rejected recruiter and investor profiles."
      />

      {/* Search */}
      <div className="flex items-center gap-2.5 bg-bg-input border border-border-color px-4 py-2.5 rounded-xl w-full sm:w-80 text-text-secondary focus-within:border-accent-red/50 focus-within:text-text-primary transition-all">
        <i className="fa-solid fa-magnifying-glass text-xs"></i>
        <input
          type="text"
          className="bg-transparent border-none text-xs w-full text-white placeholder-text-muted outline-none"
          placeholder="Search by name, organization..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <Table headers={["ID", "Name", "Role / Type", "Organization / Company", "Designation", "Email", "Applied Date", "Status"]}>
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
            <td className="px-5 py-4">
              <Badge status="rejected" />
            </td>
          </tr>
        ))}
      </Table>
    </div>
  );
}
