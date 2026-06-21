"use client";

import { useState } from "react";
import { Table, PageHeader } from "@/components/UI";
import { mockRecruiters } from "@/components/mockData";

export default function RecruiterProfilesPage() {
  const [search, setSearch] = useState("");
  const [filterCompany, setFilterCompany] = useState("All");

  const approvedRecs = mockRecruiters.filter((r) => r.status === "Approved");

  // Extract unique companies
  const companies = ["All", ...Array.from(new Set(approvedRecs.map((r) => r.company)))];

  const filtered = approvedRecs.filter((r) => {
    const matchesSearch = r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.designation.toLowerCase().includes(search.toLowerCase()) ||
      r.email.toLowerCase().includes(search.toLowerCase());
    const matchesCompany = filterCompany === "All" || r.company === filterCompany;
    return matchesSearch && matchesCompany;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Recruiter Profiles"
        description="Verify and browse the directory of approved recruiters and their corporate affiliations."
      />

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-4 bg-bg-secondary border border-border-color p-4 rounded-2xl shadow-card">
        {/* Search */}
        <div className="flex items-center gap-2.5 bg-bg-input border border-border-color px-4 py-2.5 rounded-xl w-full sm:w-80 text-text-secondary focus-within:border-accent-red/50 focus-within:text-text-primary transition-all">
          <i className="fa-solid fa-magnifying-glass text-xs"></i>
          <input
            type="text"
            className="bg-transparent border-none text-xs w-full text-white placeholder-text-muted outline-none"
            placeholder="Search recruiter name, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Filter Company */}
        <select
          value={filterCompany}
          onChange={(e) => setFilterCompany(e.target.value)}
          className="bg-bg-input border border-border-color rounded-xl px-4 py-2.5 text-xs text-text-primary hover:border-accent-red/30 transition-all outline-none cursor-pointer w-full sm:w-48"
        >
          <option value="All">All Companies</option>
          {companies.filter(c => c !== "All").map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <Table headers={["ID", "Name", "Company", "Designation", "Email", "Phone", "Approval Date"]}>
        {filtered.map((r) => (
          <tr key={r.id} className="hover:bg-bg-input/20 transition-all">
            <td className="px-5 py-4 font-bold text-text-muted">{r.id}</td>
            <td className="px-5 py-4 font-bold text-white">{r.name}</td>
            <td className="px-5 py-4 text-text-secondary">{r.company}</td>
            <td className="px-5 py-4 text-text-secondary">{r.designation}</td>
            <td className="px-5 py-4 text-text-secondary font-mono">{r.email}</td>
            <td className="px-5 py-4 text-text-secondary">{r.phone}</td>
            <td className="px-5 py-4 text-text-muted">{r.appliedDate}</td>
          </tr>
        ))}
      </Table>

      {filtered.length === 0 && (
        <div className="text-center py-12 border border-dashed border-border-color rounded-2xl bg-bg-secondary/20">
          <i className="fa-solid fa-user-slash text-2xl text-text-muted mb-3"></i>
          <p className="text-sm text-text-secondary">No recruiter profiles match your search or filters.</p>
        </div>
      )}
    </div>
  );
}
