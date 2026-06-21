"use client";

import { useState } from "react";
import { Table, Badge, PageHeader, Modal } from "@/components/UI";
import { mockInternships, Internship } from "@/components/mockData";

export default function RecruiterInternshipsPage() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [selectedInternship, setSelectedInternship] = useState<Internship | null>(null);

  const filtered = mockInternships.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(search.toLowerCase()) ||
      item.company.toLowerCase().includes(search.toLowerCase()) ||
      item.skillsRequired.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === "All" || item.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Internship Postings"
        description="Monitor, update status, and audit active/closed internship postings submitted by approved recruiters."
      />

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-4 bg-bg-secondary border border-border-color p-4 rounded-2xl shadow-card">
        {/* Search */}
        <div className="flex items-center gap-2.5 bg-bg-input border border-border-color px-4 py-2.5 rounded-xl w-full sm:w-80 text-text-secondary focus-within:border-accent-red/50 focus-within:text-text-primary transition-all">
          <i className="fa-solid fa-magnifying-glass text-xs"></i>
          <input
            type="text"
            className="bg-transparent border-none text-xs w-full text-white placeholder-text-muted outline-none"
            placeholder="Search internships, skills, company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Filter Status */}
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="bg-bg-input border border-border-color rounded-xl px-4 py-2.5 text-xs text-text-primary hover:border-accent-red/30 transition-all outline-none cursor-pointer w-full sm:w-40"
        >
          <option value="All">All Statuses</option>
          <option value="Active">Active Only</option>
          <option value="Closed">Closed Only</option>
          <option value="Draft">Draft Only</option>
        </select>
      </div>

      {/* Table */}
      <Table headers={["ID", "Internship Title", "Company", "Recruiter", "Location", "Stipend", "Status", "Actions"]}>
        {filtered.map((item) => (
          <tr key={item.id} className="hover:bg-bg-input/20 transition-all">
            <td className="px-5 py-4 font-bold text-text-muted">INT-{item.id}</td>
            <td className="px-5 py-4 font-bold text-white">{item.title}</td>
            <td className="px-5 py-4 text-text-secondary">{item.company}</td>
            <td className="px-5 py-4 text-text-secondary">{item.recruiterName}</td>
            <td className="px-5 py-4 text-text-secondary">{item.location}</td>
            <td className="px-5 py-4 text-white font-semibold">{item.stipend}</td>
            <td className="px-5 py-4">
              <Badge status={item.status === "Active" ? "active" : item.status === "Closed" ? "rejected" : "pending"} label={item.status} />
            </td>
            <td className="px-5 py-4">
              <button
                onClick={() => setSelectedInternship(item)}
                className="bg-bg-input border border-border-color hover:border-accent-red/40 hover:text-white text-text-secondary rounded-lg px-2.5 py-1.5 transition-fast cursor-pointer"
              >
                View details
              </button>
            </td>
          </tr>
        ))}
      </Table>

      {filtered.length === 0 && (
        <div className="text-center py-12 border border-dashed border-border-color rounded-2xl bg-bg-secondary/20">
          <i className="fa-solid fa-file-invoice text-2xl text-text-muted mb-3"></i>
          <p className="text-sm text-text-secondary">No internships match your search or filters.</p>
        </div>
      )}

      {/* Internship Details Modal */}
      <Modal
        isOpen={!!selectedInternship}
        onClose={() => setSelectedInternship(null)}
        title="Internship Posting Details"
        size="md"
        footer={
          <button
            onClick={() => setSelectedInternship(null)}
            className="px-4 py-2 bg-bg-input border border-border-color hover:border-accent-red/40 rounded-xl text-xs font-bold text-text-primary hover:text-white transition-fast cursor-pointer"
          >
            Close
          </button>
        }
      >
        {selectedInternship && (
          <div className="space-y-4 text-text-secondary">
            <div>
              <span className="text-[10px] uppercase tracking-wider font-extrabold text-accent-red">Job Title</span>
              <h2 className="text-base font-bold text-white mt-0.5">{selectedInternship.title}</h2>
              <p className="text-xs text-text-muted mt-0.5">{selectedInternship.company} — Posted by {selectedInternship.recruiterName}</p>
            </div>

            <div>
              <span className="text-[10px] uppercase tracking-wider font-extrabold text-accent-red">Description</span>
              <p className="text-xs text-text-secondary mt-1 leading-relaxed">{selectedInternship.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-b border-border-color py-3">
              <div>
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-text-muted">Location & Duration</span>
                <p className="text-xs text-white mt-1">
                  {selectedInternship.location} — <span className="text-text-secondary">{selectedInternship.duration}</span>
                </p>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-text-muted">Compensation (Stipend)</span>
                <p className="text-xs text-white font-semibold mt-1">
                  {selectedInternship.stipend}
                </p>
              </div>
            </div>

            <div>
              <span className="text-[10px] uppercase tracking-wider font-extrabold text-white">Skills Required</span>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {selectedInternship.skillsRequired.split(", ").map((skill, idx) => (
                  <span key={idx} className="bg-bg-input border border-border-color text-text-secondary text-[10px] font-semibold px-2.5 py-1 rounded-lg">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-border-color/60 pt-3">
              <div>
                <span className="text-[9px] uppercase font-bold text-text-muted">Posted Date</span>
                <p className="text-xs text-white mt-0.5">{selectedInternship.postedDate}</p>
              </div>
              <div>
                <span className="text-[9px] uppercase font-bold text-text-muted">Application Deadline</span>
                <p className="text-xs text-white mt-0.5">{selectedInternship.deadline}</p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
