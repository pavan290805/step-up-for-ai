"use client";

import { useState } from "react";
import { Table, Badge, PageHeader, Modal } from "@/components/UI";
import { mockStartupApplications, StartupApplication } from "@/components/mockData";

export default function StartupApplicationsPage() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterStage, setFilterStage] = useState("All");
  const [selectedApp, setSelectedApp] = useState<StartupApplication | null>(null);

  const handleAction = (id: number, actionName: string) => {
    alert(`Startup application #${id} has been ${actionName}! (Visual UI Action Only - Not persisted)`);
    setSelectedApp(null);
  };

  const filtered = mockStartupApplications.filter((app) => {
    const matchesSearch = app.startupName.toLowerCase().includes(search.toLowerCase()) ||
      app.founderName.toLowerCase().includes(search.toLowerCase()) ||
      app.industry.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === "All" || app.status === filterStatus;
    const matchesStage = filterStage === "All" || app.stage === filterStage;
    return matchesSearch && matchesStatus && matchesStage;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Startup Applications"
        description="Review and process pitch event and incubator applications from AI startup founders."
      />

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row items-center gap-4 bg-bg-secondary border border-border-color p-4 rounded-2xl shadow-card">
        {/* Search */}
        <div className="flex items-center gap-2.5 bg-bg-input border border-border-color px-4 py-2.5 rounded-xl w-full md:w-80 text-text-secondary focus-within:border-accent-red/50 focus-within:text-text-primary transition-all">
          <i className="fa-solid fa-magnifying-glass text-xs"></i>
          <input
            type="text"
            className="bg-transparent border-none text-xs w-full text-white placeholder-text-muted outline-none"
            placeholder="Search startups, founders, industry..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Filter Status */}
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="bg-bg-input border border-border-color rounded-xl px-4 py-2.5 text-xs text-text-primary hover:border-accent-red/30 transition-all outline-none cursor-pointer w-full md:w-40"
        >
          <option value="All">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
          <option value="Rejected">Rejected</option>
        </select>

        {/* Filter Stage */}
        <select
          value={filterStage}
          onChange={(e) => setFilterStage(e.target.value)}
          className="bg-bg-input border border-border-color rounded-xl px-4 py-2.5 text-xs text-text-primary hover:border-accent-red/30 transition-all outline-none cursor-pointer w-full md:w-40"
        >
          <option value="All">All Stages</option>
          <option value="Idea Phase">Idea Phase</option>
          <option value="Prototype/MVP">Prototype/MVP</option>
          <option value="Early Traction">Early Traction</option>
          <option value="Scaling Phase">Scaling Phase</option>
        </select>
      </div>

      {/* Table List */}
      <Table headers={["ID", "Startup", "Industry", "Stage", "Funding Required", "Applied Date", "Status", "Actions"]}>
        {filtered.map((app) => (
          <tr key={app.id} className="hover:bg-bg-input/20 transition-all">
            <td className="px-5 py-4 font-bold text-text-muted">STP-{app.id}</td>
            <td className="px-5 py-4 font-bold text-white">{app.startupName}</td>
            <td className="px-5 py-4 text-text-secondary">{app.industry}</td>
            <td className="px-5 py-4 text-text-secondary">{app.stage}</td>
            <td className="px-5 py-4 text-white font-semibold">{app.fundingRequired}</td>
            <td className="px-5 py-4 text-text-muted">{app.appliedDate}</td>
            <td className="px-5 py-4">
              <Badge status={app.status} />
            </td>
            <td className="px-5 py-4">
              <button
                onClick={() => setSelectedApp(app)}
                className="bg-bg-input border border-border-color hover:border-accent-red/40 hover:text-white text-text-secondary rounded-lg px-2.5 py-1.5 transition-fast cursor-pointer"
              >
                View App
              </button>
            </td>
          </tr>
        ))}
      </Table>

      {filtered.length === 0 && (
        <div className="text-center py-12 border border-dashed border-border-color rounded-2xl bg-bg-secondary/20">
          <i className="fa-solid fa-folder-open text-2xl text-text-muted mb-3"></i>
          <p className="text-sm text-text-secondary">No startup applications match your search or filters.</p>
        </div>
      )}

      {/* Startup Details Modal */}
      <Modal
        isOpen={!!selectedApp}
        onClose={() => setSelectedApp(null)}
        title="Startup Application Details"
        size="lg"
        footer={
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSelectedApp(null)}
              className="px-4 py-2 bg-bg-input border border-border-color hover:border-accent-red/40 rounded-xl text-xs font-bold text-text-secondary hover:text-white transition-fast cursor-pointer"
            >
              Cancel
            </button>
            {selectedApp?.status === "Pending" && (
              <>
                <button
                  onClick={() => handleAction(selectedApp.id, "Rejected")}
                  className="px-4 py-2 bg-bg-input border border-accent-red/40 hover:bg-accent-red/10 text-accent-red rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Reject
                </button>
                <button
                  onClick={() => handleAction(selectedApp.id, "Approved")}
                  className="px-4 py-2 bg-accent-red hover:bg-accent-red-hover text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Approve
                </button>
              </>
            )}
          </div>
        }
      >
        {selectedApp && (
          <div className="space-y-5 text-text-secondary">
            {/* Top row */}
            <div className="flex justify-between items-start border-b border-border-color pb-3">
              <div>
                <h2 className="text-lg font-bold text-white">{selectedApp.startupName}</h2>
                <p className="text-xs text-accent-red mt-0.5">{selectedApp.industry} — {selectedApp.stage}</p>
              </div>
              <Badge status={selectedApp.status} />
            </div>

            {/* Founder details */}
            <div>
              <h4 className="text-[10px] uppercase tracking-wider font-extrabold text-white mb-2">Founder Coordinates</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-bg-input/20 border border-border-color/60 p-3 rounded-xl">
                <div>
                  <span className="text-[9px] uppercase font-bold text-text-muted">Founder Name</span>
                  <p className="text-xs text-white font-semibold mt-0.5">{selectedApp.founderName}</p>
                </div>
                <div>
                  <span className="text-[9px] uppercase font-bold text-text-muted">Email</span>
                  <p className="text-xs text-white font-semibold mt-0.5 truncate">{selectedApp.email}</p>
                </div>
                <div>
                  <span className="text-[9px] uppercase font-bold text-text-muted">Phone</span>
                  <p className="text-xs text-white font-semibold mt-0.5">{selectedApp.phone}</p>
                </div>
              </div>
            </div>

            {/* Financial row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-b border-border-color pb-4">
              <div>
                <span className="text-[9px] uppercase font-bold text-text-muted">Funding Required</span>
                <p className="text-xs text-white font-bold mt-0.5">{selectedApp.fundingRequired}</p>
              </div>
              <div>
                <span className="text-[9px] uppercase font-bold text-text-muted">Team Members</span>
                <p className="text-xs text-white font-semibold mt-0.5">{selectedApp.teamMembers} Core members</p>
              </div>
              <div>
                <span className="text-[9px] uppercase font-bold text-text-muted">Pitch Deck</span>
                <p className="text-xs text-accent-red font-bold mt-0.5 hover:underline">
                  <a href={selectedApp.pitchDeck || "#"} target="_blank" rel="noopener noreferrer" onClick={(e) => { e.preventDefault(); alert("Opening pitch deck (Visual Link Prototype Only)"); }}>
                    <i className="fa-solid fa-file-pdf mr-1.5"></i>
                    View Pitch Deck
                  </a>
                </p>
              </div>
            </div>

            {/* Pitch texts */}
            <div className="space-y-4">
              <div>
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-white">One-liner Pitch</span>
                <p className="text-xs text-text-secondary mt-1 leading-relaxed bg-bg-input/10 p-3 border border-border-color/40 rounded-xl font-medium italic">
                  &ldquo;{selectedApp.oneLiner}&rdquo;
                </p>
              </div>

              <div>
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-white">Problem Statement</span>
                <p className="text-xs text-text-secondary mt-1 leading-relaxed bg-bg-input/10 p-3 border border-border-color/40 rounded-xl">
                  {selectedApp.problemStatement}
                </p>
              </div>

              <div>
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-white">Proposed AI Solution</span>
                <p className="text-xs text-text-secondary mt-1 leading-relaxed bg-bg-input/10 p-3 border border-border-color/40 rounded-xl">
                  {selectedApp.solution}
                </p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
