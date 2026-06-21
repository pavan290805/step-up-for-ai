"use client";

import { useState } from "react";
import { Table, Badge, PageHeader, Modal } from "@/components/UI";
import { mockStartupInterests, mockStartupApplications, StartupInterest } from "@/components/mockData";

export default function StartupInterestsPage() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [selectedInterest, setSelectedInterest] = useState<StartupInterest | null>(null);

  const handleStatusChange = (id: string, newStatus: string) => {
    alert(`Interest ${id} status updated to: ${newStatus}! (Visual UI Action Only - Not persisted)`);
    setSelectedInterest(null);
  };

  const filtered = mockStartupInterests.filter((item) => {
    const matchesSearch = item.startupName.toLowerCase().includes(search.toLowerCase()) ||
      item.investorName.toLowerCase().includes(search.toLowerCase()) ||
      item.startupIndustry.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === "All" || item.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Find founder coordinates for modal view
  const getStartupDetails = (startupId: number) => {
    return mockStartupApplications.find((app) => app.id === startupId);
  };

  const startupDetails = selectedInterest ? getStartupDetails(selectedInterest.startupId) : null;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Startup Interests"
        description="Monitor startups flagged as interesting by approved investors, and track conversation progression."
      />

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-4 bg-bg-secondary border border-border-color p-4 rounded-2xl shadow-card">
        {/* Search */}
        <div className="flex items-center gap-2.5 bg-bg-input border border-border-color px-4 py-2.5 rounded-xl w-full sm:w-80 text-text-secondary focus-within:border-accent-red/50 focus-within:text-text-primary transition-all">
          <i className="fa-solid fa-magnifying-glass text-xs"></i>
          <input
            type="text"
            className="bg-transparent border-none text-xs w-full text-white placeholder-text-muted outline-none"
            placeholder="Search startup or investor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Filter Status */}
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="bg-bg-input border border-border-color rounded-xl px-4 py-2.5 text-xs text-text-primary hover:border-accent-red/30 transition-all outline-none cursor-pointer w-full sm:w-48"
        >
          <option value="All">All Statuses</option>
          <option value="Interested">Interested</option>
          <option value="Contacted">Contacted</option>
          <option value="Meeting Scheduled">Meeting Scheduled</option>
          <option value="Declined">Declined</option>
        </select>
      </div>

      {/* Table */}
      <Table headers={["ID", "Investor Name", "Startup Name", "Industry", "Stage", "Expressed Date", "Status", "Actions"]}>
        {filtered.map((item) => (
          <tr key={item.id} className="hover:bg-bg-input/20 transition-all">
            <td className="px-5 py-4 font-bold text-text-muted">{item.id}</td>
            <td className="px-5 py-4 font-bold text-white">{item.investorName}</td>
            <td className="px-5 py-4 text-text-secondary font-bold hover:text-accent-red cursor-pointer" onClick={() => setSelectedInterest(item)}>
              {item.startupName}
            </td>
            <td className="px-5 py-4 text-text-secondary">{item.startupIndustry}</td>
            <td className="px-5 py-4 text-text-secondary">{item.startupStage}</td>
            <td className="px-5 py-4 text-text-muted">{item.interestDate}</td>
            <td className="px-5 py-4">
              <Badge status={item.status === "Meeting Scheduled" ? "info" : item.status === "Declined" ? "rejected" : item.status === "Contacted" ? "pending" : "approved"} label={item.status} />
            </td>
            <td className="px-5 py-4">
              <button
                onClick={() => setSelectedInterest(item)}
                className="bg-bg-input border border-border-color hover:border-accent-red/40 hover:text-white text-text-secondary rounded-lg px-2.5 py-1.5 transition-fast cursor-pointer"
              >
                View Startup
              </button>
            </td>
          </tr>
        ))}
      </Table>

      {filtered.length === 0 && (
        <div className="text-center py-12 border border-dashed border-border-color rounded-2xl bg-bg-secondary/20">
          <i className="fa-solid fa-heart-broken text-2xl text-text-muted mb-3"></i>
          <p className="text-sm text-text-secondary">No startup interests match your search or filters.</p>
        </div>
      )}

      {/* Startup Details Modal (Change 2: Founder Details, Funding, Pitch Deck) */}
      <Modal
        isOpen={!!selectedInterest}
        onClose={() => setSelectedInterest(null)}
        title="Startup & Founder Details"
        size="md"
        footer={
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedInterest(null)}
              className="px-4 py-2 bg-bg-input border border-border-color hover:border-accent-red/40 rounded-xl text-xs font-bold text-text-primary hover:text-white transition-fast cursor-pointer"
            >
              Close
            </button>
            {selectedInterest && (
              <select
                onChange={(e) => handleStatusChange(selectedInterest.id, e.target.value)}
                defaultValue={selectedInterest.status}
                className="bg-accent-red hover:bg-accent-red-hover text-white rounded-xl px-3 py-2 text-xs font-bold transition-all outline-none cursor-pointer"
              >
                <option value="Interested">Mark Interested</option>
                <option value="Contacted">Mark Contacted</option>
                <option value="Meeting Scheduled">Schedule Meeting</option>
                <option value="Declined">Mark Declined</option>
              </select>
            )}
          </div>
        }
      >
        {selectedInterest && (
          <div className="space-y-4 text-text-secondary">
            {/* Top row */}
            <div className="flex justify-between items-start border-b border-border-color pb-3">
              <div>
                <h2 className="text-base font-bold text-white">{selectedInterest.startupName}</h2>
                <p className="text-xs text-accent-red mt-0.5">{selectedInterest.startupIndustry} — {selectedInterest.startupStage}</p>
              </div>
              <div className="text-right">
                <span className="text-[9px] text-text-muted font-bold block">Flagged by Investor</span>
                <span className="text-xs font-bold text-white">{selectedInterest.investorName}</span>
              </div>
            </div>

            {/* Change 2: Startup Name, Founder Name, Founder Email, Founder Phone, Industry, Startup Stage, Funding Required, Pitch Deck */}
            {startupDetails ? (
              <div className="space-y-4">
                <div>
                  <h4 className="text-[10px] uppercase tracking-wider font-extrabold text-white mb-2">Founder Coordinates</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-bg-input/20 border border-border-color/60 p-3.5 rounded-xl">
                    <div>
                      <span className="text-[9px] uppercase font-bold text-text-muted">Founder Name</span>
                      <p className="text-xs text-white font-semibold mt-0.5">{startupDetails.founderName}</p>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase font-bold text-text-muted">Funding Required</span>
                      <p className="text-xs text-white font-bold mt-0.5">{startupDetails.fundingRequired}</p>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase font-bold text-text-muted">Email ID</span>
                      <p className="text-xs text-white font-semibold mt-0.5 truncate">{startupDetails.email}</p>
                    </div>
                    <div>
                      <span className="text-[9px] uppercase font-bold text-text-muted">Phone Number</span>
                      <p className="text-xs text-white font-semibold mt-0.5">{startupDetails.phone}</p>
                    </div>
                  </div>
                </div>

                <div className="border-t border-border-color/60 pt-3">
                  <span className="text-[10px] uppercase tracking-wider font-extrabold text-white">One-liner Pitch</span>
                  <p className="text-xs text-text-secondary mt-1 bg-bg-input/10 p-3 border border-border-color/40 rounded-xl font-medium italic">
                    &ldquo;{startupDetails.oneLiner}&rdquo;
                  </p>
                </div>

                <div className="border-t border-border-color pt-3 flex justify-between items-center">
                  <div>
                    <span className="text-[9px] uppercase font-bold text-text-muted">Verified Pitch Deck</span>
                    <p className="text-xs text-white font-semibold mt-0.5">visionsmart_pitch_deck.pdf</p>
                  </div>
                  <button
                    onClick={() => alert("Opening Pitch Deck (Visual Link Prototype Only)")}
                    className="bg-accent-red hover:bg-accent-red-hover text-white text-xs font-bold rounded-xl px-4 py-2 transition-all cursor-pointer flex items-center gap-1.5"
                  >
                    <i className="fa-solid fa-file-pdf"></i>
                    <span>View Pitch Deck</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-bg-input/20 border border-border-color rounded-xl text-center">
                <p className="text-xs text-text-muted">Startup coordinates not found. (Using default mock values)</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
