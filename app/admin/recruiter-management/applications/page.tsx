"use client";

import { useState } from "react";
import { Table, Badge, PageHeader, Modal } from "@/components/UI";
import { mockStudents, mockInternships } from "@/components/mockData";

// Define local list of applications linking students and internships
interface ApplicationDetails {
  id: string;
  internshipTitle: string;
  company: string;
  candidateName: string;
  candidateEmail: string;
  candidateCollege: string;
  candidateBranch: string;
  candidateSkills: string;
  candidateResume: string;
  appliedDate: string;
  status: "Pending" | "Reviewed" | "Selected" | "Rejected";
}

const mockApplications: ApplicationDetails[] = [
  {
    id: "APP001",
    internshipTitle: "Frontend Developer Intern",
    company: "TechNova Solutions",
    candidateName: "Rahul Sharma",
    candidateEmail: "rahul.sharma@stepup.ai",
    candidateCollege: "IIT Madras",
    candidateBranch: "Computer Science",
    candidateSkills: "React, Node.js, JavaScript, Python",
    candidateResume: "https://stepup.ai/portfolios/resumes/resume_student_1.pdf",
    appliedDate: "2026-06-15",
    status: "Pending",
  },
  {
    id: "APP002",
    internshipTitle: "Data Science Intern",
    company: "DataMind Analytics",
    candidateName: "Priya Verma",
    candidateEmail: "priya.verma@stepup.ai",
    candidateCollege: "BITS Pilani",
    candidateBranch: "Information Technology",
    candidateSkills: "Python, PyTorch, SQL, Machine Learning",
    candidateResume: "https://stepup.ai/portfolios/resumes/resume_student_2.pdf",
    appliedDate: "2026-06-16",
    status: "Reviewed",
  },
  {
    id: "APP003",
    internshipTitle: "Frontend Developer Intern",
    company: "TechNova Solutions",
    candidateName: "Sneha Kapoor",
    candidateEmail: "sneha.kapoor@stepup.ai",
    candidateCollege: "RV College of Eng",
    candidateBranch: "Computer Science",
    candidateSkills: "React, HTML, CSS, JavaScript",
    candidateResume: "https://stepup.ai/portfolios/resumes/resume_student_4.pdf",
    appliedDate: "2026-06-16",
    status: "Selected",
  },
  {
    id: "APP004",
    internshipTitle: "UI/UX Design Intern",
    company: "BrandWave Digital",
    candidateName: "Amit Singh",
    candidateEmail: "amit.singh@stepup.ai",
    candidateCollege: "PES University",
    candidateBranch: "Electronics & Communication",
    candidateSkills: "UI/UX Design, Figma, HTML, CSS",
    candidateResume: "https://stepup.ai/portfolios/resumes/resume_student_3.pdf",
    appliedDate: "2026-06-17",
    status: "Rejected",
  },
  {
    id: "APP005",
    internshipTitle: "Data Science Intern",
    company: "DataMind Analytics",
    candidateName: "Rohan Mehta",
    candidateEmail: "rohan.mehta@stepup.ai",
    candidateCollege: "IIT Bombay",
    candidateBranch: "Computer Science",
    candidateSkills: "Python, SQL, PyTorch, Machine Learning",
    candidateResume: "https://stepup.ai/portfolios/resumes/resume_student_5.pdf",
    appliedDate: "2026-06-18",
    status: "Pending",
  },
];

export default function RecruiterApplicationsPage() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [selectedApp, setSelectedApp] = useState<ApplicationDetails | null>(null);

  const handleStatusUpdate = (id: string, newStatus: string) => {
    alert(`Application ${id} status updated to: ${newStatus}! (Visual UI Action Only - Not persisted)`);
    setSelectedApp(null);
  };

  const filtered = mockApplications.filter((app) => {
    const matchesSearch = app.candidateName.toLowerCase().includes(search.toLowerCase()) ||
      app.internshipTitle.toLowerCase().includes(search.toLowerCase()) ||
      app.company.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === "All" || app.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Student Applications"
        description="Review student registrations and applications for active internship opportunities."
      />

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-4 bg-bg-secondary border border-border-color p-4 rounded-2xl shadow-card">
        {/* Search */}
        <div className="flex items-center gap-2.5 bg-bg-input border border-border-color px-4 py-2.5 rounded-xl w-full sm:w-80 text-text-secondary focus-within:border-accent-red/50 focus-within:text-text-primary transition-all">
          <i className="fa-solid fa-magnifying-glass text-xs"></i>
          <input
            type="text"
            className="bg-transparent border-none text-xs w-full text-white placeholder-text-muted outline-none"
            placeholder="Search candidate, internship..."
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
          <option value="Pending">Pending</option>
          <option value="Reviewed">Reviewed</option>
          <option value="Selected">Selected</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      {/* Table */}
      <Table headers={["ID", "Internship", "Company", "Candidate", "Applied Date", "Status", "Actions"]}>
        {filtered.map((app) => (
          <tr key={app.id} className="hover:bg-bg-input/20 transition-all">
            <td className="px-5 py-4 font-bold text-text-muted">{app.id}</td>
            <td className="px-5 py-4 font-bold text-white">{app.internshipTitle}</td>
            <td className="px-5 py-4 text-text-secondary">{app.company}</td>
            <td className="px-5 py-4 text-text-secondary">{app.candidateName}</td>
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
          <i className="fa-solid fa-users-slash text-2xl text-text-muted mb-3"></i>
          <p className="text-sm text-text-secondary">No student applications match your search or filters.</p>
        </div>
      )}

      {/* Candidate Profile / Application Details Modal */}
      <Modal
        isOpen={!!selectedApp}
        onClose={() => setSelectedApp(null)}
        title="Application Details & Candidate Profile"
        size="md"
        footer={
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSelectedApp(null)}
              className="px-4 py-2 bg-bg-input border border-border-color hover:border-accent-red/40 rounded-xl text-xs font-bold text-text-secondary hover:text-white transition-fast cursor-pointer"
            >
              Close
            </button>
            {selectedApp?.status === "Pending" && (
              <>
                <button
                  onClick={() => handleStatusUpdate(selectedApp.id, "Rejected")}
                  className="px-4 py-2 bg-bg-input border border-accent-red/40 hover:bg-accent-red/10 text-accent-red rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Reject Candidate
                </button>
                <button
                  onClick={() => handleStatusUpdate(selectedApp.id, "Selected")}
                  className="px-4 py-2 bg-accent-red hover:bg-accent-red-hover text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                >
                  Select Candidate
                </button>
              </>
            )}
          </div>
        }
      >
        {selectedApp && (
          <div className="space-y-4 text-text-secondary">
            {/* Header info */}
            <div className="flex justify-between items-start border-b border-border-color pb-3">
              <div>
                <h2 className="text-base font-bold text-white">{selectedApp.candidateName}</h2>
                <p className="text-xs text-text-muted mt-0.5">{selectedApp.candidateCollege} — {selectedApp.candidateBranch}</p>
              </div>
              <Badge status={selectedApp.status} />
            </div>

            {/* Job applying to */}
            <div className="bg-bg-input/25 border border-border-color p-3.5 rounded-xl">
              <span className="text-[10px] uppercase tracking-wider font-extrabold text-accent-red">Applying For</span>
              <p className="text-xs text-white font-bold mt-1">{selectedApp.internshipTitle}</p>
              <p className="text-[10px] text-text-secondary mt-0.5">{selectedApp.company}</p>
              <p className="text-[9px] text-text-muted mt-1.5">Submitted on: {selectedApp.appliedDate}</p>
            </div>

            {/* Candidate skills */}
            <div>
              <span className="text-[10px] uppercase tracking-wider font-extrabold text-white">Candidate Skills</span>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {selectedApp.candidateSkills.split(", ").map((skill, idx) => (
                  <span key={idx} className="bg-bg-input border border-border-color text-text-secondary text-[10px] font-semibold px-2.5 py-1 rounded-lg">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Resume coordinates */}
            <div className="border-t border-border-color pt-3 flex justify-between items-center">
              <div>
                <span className="text-[9px] uppercase font-bold text-text-muted">Verified Portfolio PDF</span>
                <p className="text-xs text-white font-semibold mt-0.5">resume_{selectedApp.candidateName.toLowerCase().replace(" ", "_")}.pdf</p>
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
