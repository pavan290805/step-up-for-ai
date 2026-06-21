"use client";

import { useState } from "react";
import { Table, PageHeader, Modal } from "@/components/UI";
import { mockStudents, Student } from "@/components/mockData";

export default function StudentsPage() {
  const [search, setSearch] = useState("");
  const [filterYear, setFilterYear] = useState("All");
  const [filterCollege, setFilterCollege] = useState("All");
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // Extract unique colleges for filtering
  const colleges = ["All", ...Array.from(new Set(mockStudents.map((s) => s.college)))];

  const filtered = mockStudents.filter((s) => {
    const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      s.branch.toLowerCase().includes(search.toLowerCase());
    const matchesYear = filterYear === "All" || s.year === filterYear;
    const matchesCollege = filterCollege === "All" || s.college === filterCollege;
    return matchesSearch && matchesYear && matchesCollege;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Students Directory"
        description="Browse, verify, and view profiles of students registered on the platform."
      />

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row items-center gap-4 bg-bg-secondary border border-border-color p-4 rounded-2xl shadow-card">
        {/* Search */}
        <div className="flex items-center gap-2.5 bg-bg-input border border-border-color px-4 py-2.5 rounded-xl w-full md:w-80 text-text-secondary focus-within:border-accent-red/50 focus-within:text-text-primary transition-all">
          <i className="fa-solid fa-magnifying-glass text-xs"></i>
          <input
            type="text"
            className="bg-transparent border-none text-xs w-full text-white placeholder-text-muted outline-none"
            placeholder="Search students, branch..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Filter College */}
        <select
          value={filterCollege}
          onChange={(e) => setFilterCollege(e.target.value)}
          className="bg-bg-input border border-border-color rounded-xl px-4 py-2.5 text-xs text-text-primary hover:border-accent-red/30 transition-all outline-none cursor-pointer w-full md:w-48"
        >
          <option value="All">All Colleges</option>
          {colleges.filter(c => c !== "All").map((college) => (
            <option key={college} value={college}>{college}</option>
          ))}
        </select>

        {/* Filter Year */}
        <select
          value={filterYear}
          onChange={(e) => setFilterYear(e.target.value)}
          className="bg-bg-input border border-border-color rounded-xl px-4 py-2.5 text-xs text-text-primary hover:border-accent-red/30 transition-all outline-none cursor-pointer w-full md:w-32"
        >
          <option value="All">All Years</option>
          <option value="1">1st Year</option>
          <option value="2">2nd Year</option>
          <option value="3">3rd Year</option>
          <option value="4">4th Year</option>
        </select>
      </div>

      {/* Table List */}
      <Table headers={["Student ID", "Name", "College", "Branch", "Year", "Startup Applications", "Actions"]}>
        {filtered.map((s) => (
          <tr key={s.id} className="hover:bg-bg-input/20 transition-all">
            <td className="px-5 py-4 font-bold text-text-muted">{s.id}</td>
            <td className="px-5 py-4 font-bold text-white">{s.name}</td>
            <td className="px-5 py-4 text-text-secondary">{s.college}</td>
            <td className="px-5 py-4 text-text-secondary">{s.branch}</td>
            <td className="px-5 py-4 text-white text-center font-medium">Year {s.year}</td>
            <td className="px-5 py-4 text-center">
              <span className="bg-bg-input border border-border-color text-white font-bold text-xs px-2 py-0.5 rounded-lg">
                {s.appliedCount || 0}
              </span>
            </td>
            <td className="px-5 py-4">
              <button
                onClick={() => setSelectedStudent(s)}
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
          <p className="text-sm text-text-secondary">No students match your search or filters.</p>
        </div>
      )}

      {/* Student Profile Modal */}
      <Modal
        isOpen={!!selectedStudent}
        onClose={() => setSelectedStudent(null)}
        title="Student Profile"
        size="md"
        footer={
          <button
            onClick={() => setSelectedStudent(null)}
            className="px-4 py-2 bg-bg-input border border-border-color hover:border-accent-red/40 rounded-xl text-xs font-bold text-text-primary hover:text-white transition-fast cursor-pointer"
          >
            Close
          </button>
        }
      >
        {selectedStudent && (
          <div className="space-y-5 text-text-secondary">
            {/* Top row */}
            <div className="flex items-center gap-4 border-b border-border-color pb-4">
              <div className="w-14 h-14 rounded-full bg-accent-red text-white flex items-center justify-center font-black text-lg">
                {selectedStudent.name.split(" ").map(w => w[0]).join("")}
              </div>
              <div>
                <h2 className="text-base font-bold text-white">{selectedStudent.name}</h2>
                <p className="text-xs text-text-muted mt-0.5">{selectedStudent.id} — Student Registrant</p>
              </div>
            </div>

            {/* Coordinates */}
            <div>
              <h4 className="text-[10px] uppercase tracking-wider font-extrabold text-white mb-2">Academic & Contact Info</h4>
              <div className="grid grid-cols-2 gap-4 bg-bg-input/20 border border-border-color/60 p-4 rounded-xl">
                <div>
                  <span className="text-[9px] uppercase font-bold text-text-muted">College</span>
                  <p className="text-xs text-white font-semibold mt-0.5">{selectedStudent.college}</p>
                </div>
                <div>
                  <span className="text-[9px] uppercase font-bold text-text-muted">Year / Batch</span>
                  <p className="text-xs text-white font-semibold mt-0.5">Year {selectedStudent.year} (Undergrad)</p>
                </div>
                <div>
                  <span className="text-[9px] uppercase font-bold text-text-muted">Branch / Major</span>
                  <p className="text-xs text-white font-semibold mt-0.5">{selectedStudent.branch}</p>
                </div>
                <div>
                  <span className="text-[9px] uppercase font-bold text-text-muted">Startup Applications</span>
                  <p className="text-xs text-accent-red font-extrabold mt-0.5">{selectedStudent.appliedCount || 0} Submitted</p>
                </div>
                <div className="col-span-2 h-[1px] bg-border-color/60 my-1"></div>
                <div>
                  <span className="text-[9px] uppercase font-bold text-text-muted">Email ID</span>
                  <p className="text-xs text-white font-semibold mt-0.5 truncate">{selectedStudent.email}</p>
                </div>
                <div>
                  <span className="text-[9px] uppercase font-bold text-text-muted">Phone Number</span>
                  <p className="text-xs text-white font-semibold mt-0.5">{selectedStudent.phone}</p>
                </div>
              </div>
            </div>

            {/* Skills Pool */}
            <div>
              <span className="text-[10px] uppercase tracking-wider font-extrabold text-white">Skills Portfolio</span>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {selectedStudent.skills.split(", ").map((skill, index) => (
                  <span key={index} className="bg-bg-input border border-border-color text-text-secondary text-[10px] font-semibold px-2.5 py-1 rounded-lg">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Resume Link */}
            <div className="border-t border-border-color/60 pt-4 flex justify-between items-center">
              <div>
                <span className="text-[9px] uppercase font-bold text-text-muted">Verified Portfolio Resume</span>
                <p className="text-xs text-white font-semibold mt-0.5">resume_student_{selectedStudent.id.substring(3)}.pdf</p>
              </div>
              <button
                onClick={() => alert("Opening Student Resume (Visual Link Prototype Only)")}
                className="bg-accent-red hover:bg-accent-red-hover text-white text-xs font-bold rounded-xl px-4 py-2 transition-all cursor-pointer flex items-center gap-1.5"
              >
                <i className="fa-solid fa-file-pdf"></i>
                <span>Open Resume</span>
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
