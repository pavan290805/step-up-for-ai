"use client";

import { useState } from "react";
import { Table, PageHeader, Modal } from "@/components/UI";
import { approvedInvestors, Investor } from "@/components/mockData";

export default function InvestorProfilesPage() {
  const [search, setSearch] = useState("");
  const [filterInterest, setFilterInterest] = useState("All");
  const [selectedInvestor, setSelectedInvestor] = useState<Investor | null>(null);

  // Collect all unique interest tags
  const interestsList = [
    "All",
    ...Array.from(new Set(approvedInvestors.flatMap((inv) => inv.interests))),
  ];

  const filtered = approvedInvestors.filter((inv) => {
    const matchesSearch = inv.name.toLowerCase().includes(search.toLowerCase()) ||
      inv.organization.toLowerCase().includes(search.toLowerCase()) ||
      inv.email.toLowerCase().includes(search.toLowerCase());
    const matchesInterest = filterInterest === "All" || inv.interests.includes(filterInterest);
    return matchesSearch && matchesInterest;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Investor Profiles"
        description="Verify and browse the directory of institutional venture capitalists and angel network representatives."
      />

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-4 bg-bg-secondary border border-border-color p-4 rounded-2xl shadow-card">
        {/* Search */}
        <div className="flex items-center gap-2.5 bg-bg-input border border-border-color px-4 py-2.5 rounded-xl w-full sm:w-80 text-text-secondary focus-within:border-accent-red/50 focus-within:text-text-primary transition-all">
          <i className="fa-solid fa-magnifying-glass text-xs"></i>
          <input
            type="text"
            className="bg-transparent border-none text-xs w-full text-white placeholder-text-muted outline-none"
            placeholder="Search investor, organization, email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Filter Interests */}
        <select
          value={filterInterest}
          onChange={(e) => setFilterInterest(e.target.value)}
          className="bg-bg-input border border-border-color rounded-xl px-4 py-2.5 text-xs text-text-primary hover:border-accent-red/30 transition-all outline-none cursor-pointer w-full sm:w-48"
        >
          <option value="All">All Interests</option>
          {interestsList.filter(i => i !== "All").map((interest) => (
            <option key={interest} value={interest}>{interest}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <Table headers={["ID", "Name", "Organization", "Designation", "Email", "Phone", "Actions"]}>
        {filtered.map((inv) => (
          <tr key={inv.id} className="hover:bg-bg-input/20 transition-all">
            <td className="px-5 py-4 font-bold text-text-muted">{inv.id}</td>
            <td className="px-5 py-4 font-bold text-white">{inv.name}</td>
            <td className="px-5 py-4 text-text-secondary">{inv.organization}</td>
            <td className="px-5 py-4 text-text-secondary">{inv.designation}</td>
            <td className="px-5 py-4 text-text-secondary font-mono">{inv.email}</td>
            <td className="px-5 py-4 text-text-secondary">{inv.phone}</td>
            <td className="px-5 py-4">
              <button
                onClick={() => setSelectedInvestor(inv)}
                className="bg-bg-input border border-border-color hover:border-accent-red/40 hover:text-white text-text-secondary rounded-lg px-2.5 py-1.5 transition-fast cursor-pointer"
              >
                View Profile
              </button>
            </td>
          </tr>
        ))}
      </Table>

      {filtered.length === 0 && (
        <div className="text-center py-12 border border-dashed border-border-color rounded-2xl bg-bg-secondary/20">
          <i className="fa-solid fa-user-slash text-2xl text-text-muted mb-3"></i>
          <p className="text-sm text-text-secondary">No approved investor profiles match your search or filters.</p>
        </div>
      )}

      {/* Investor Profile Modal */}
      <Modal
        isOpen={!!selectedInvestor}
        onClose={() => setSelectedInvestor(null)}
        title="Investor Profile Details"
        size="md"
        footer={
          <button
            onClick={() => setSelectedInvestor(null)}
            className="px-4 py-2 bg-bg-input border border-border-color hover:border-accent-red/40 rounded-xl text-xs font-bold text-text-primary hover:text-white transition-fast cursor-pointer"
          >
            Close
          </button>
        }
      >
        {selectedInvestor && (
          <div className="space-y-5 text-text-secondary">
            {/* Top row */}
            <div className="flex items-center gap-4 border-b border-border-color pb-4">
              <div className="w-14 h-14 rounded-full bg-accent-red text-white flex items-center justify-center font-black text-lg">
                {selectedInvestor.name.split(" ").map(w => w[0]).join("")}
              </div>
              <div>
                <h2 className="text-base font-bold text-white">{selectedInvestor.name}</h2>
                <p className="text-xs text-text-muted mt-0.5">{selectedInvestor.id} — Approved Investor</p>
              </div>
            </div>

            {/* Coordinates */}
            <div>
              <h4 className="text-[10px] uppercase tracking-wider font-extrabold text-white mb-2">Corporate coordinates</h4>
              <div className="grid grid-cols-2 gap-4 bg-bg-input/20 border border-border-color/60 p-4 rounded-xl">
                <div>
                  <span className="text-[9px] uppercase font-bold text-text-muted">Organization</span>
                  <p className="text-xs text-white font-semibold mt-0.5">{selectedInvestor.organization}</p>
                </div>
                <div>
                  <span className="text-[9px] uppercase font-bold text-text-muted">Designation</span>
                  <p className="text-xs text-white font-semibold mt-0.5">{selectedInvestor.designation}</p>
                </div>
                <div>
                  <span className="text-[9px] uppercase font-bold text-text-muted">Email ID</span>
                  <p className="text-xs text-white font-semibold mt-0.5 truncate">{selectedInvestor.email}</p>
                </div>
                <div>
                  <span className="text-[9px] uppercase font-bold text-text-muted">Phone Number</span>
                  <p className="text-xs text-white font-semibold mt-0.5">{selectedInvestor.phone}</p>
                </div>
              </div>
            </div>

            {/* Bio info */}
            <div>
              <span className="text-[10px] uppercase tracking-wider font-extrabold text-white">Investment Focus & Bio</span>
              <p className="text-xs text-text-secondary mt-1 bg-bg-input/10 p-3.5 border border-border-color/40 rounded-xl leading-relaxed italic">
                &ldquo;{selectedInvestor.bio}&rdquo;
              </p>
            </div>

            {/* Interests */}
            <div>
              <span className="text-[10px] uppercase tracking-wider font-extrabold text-white">Areas of Interest</span>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {selectedInvestor.interests.map((interest, idx) => (
                  <span key={idx} className="bg-bg-input border border-border-color text-text-secondary text-[10px] font-semibold px-2.5 py-1 rounded-lg">
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
