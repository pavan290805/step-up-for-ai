"use client";

import { useState } from "react";
import { Card, Badge, PageHeader, Modal } from "@/components/UI";
import { mockHackathons, Hackathon } from "@/components/mockData";

export default function HackathonsPage() {
  const [search, setSearch] = useState("");
  const [filterMode, setFilterMode] = useState("All");
  const [selectedHackathon, setSelectedHackathon] = useState<Hackathon | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // Form states
  const [newHack, setNewHack] = useState({
    name: "",
    conductedBy: "",
    description: "",
    participation: "Team",
    minTeamSize: "2",
    maxTeamSize: "4",
    startDate: "",
    endDate: "",
    timezone: "UTC+5:30",
    startTime: "09:00",
    endTime: "18:00",
    mode: "Online",
    venue: "",
    contactName: "",
    contactPhone: "",
    contactEmail: "",
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Hackathon "${newHack.name}" successfully created! (Visual UI Action Only - Not persisted)`);
    setCreateModalOpen(false);
    setNewHack({
      name: "",
      conductedBy: "",
      description: "",
      participation: "Team",
      minTeamSize: "2",
      maxTeamSize: "4",
      startDate: "",
      endDate: "",
      timezone: "UTC+5:30",
      startTime: "09:00",
      endTime: "18:00",
      mode: "Online",
      venue: "",
      contactName: "",
      contactPhone: "",
      contactEmail: "",
    });
  };

  const filtered = mockHackathons.filter((hack) => {
    const matchesSearch = hack.name.toLowerCase().includes(search.toLowerCase()) ||
      hack.conductedBy.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filterMode === "All" || hack.mode === filterMode;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Hackathons Management"
        description="Schedule, configure, and review student hackathons and team code challenges."
        actions={
          <button
            onClick={() => setCreateModalOpen(true)}
            className="bg-accent-red hover:bg-accent-red-hover text-white rounded-xl px-4 py-2 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
          >
            <i className="fa-solid fa-plus"></i>
            <span>Create Hackathon</span>
          </button>
        }
      />

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center gap-4 bg-bg-secondary border border-border-color p-4 rounded-2xl shadow-card">
        {/* Search */}
        <div className="flex items-center gap-2.5 bg-bg-input border border-border-color px-4 py-2.5 rounded-xl w-full sm:w-80 text-text-secondary focus-within:border-accent-red/50 focus-within:text-text-primary transition-all">
          <i className="fa-solid fa-magnifying-glass text-xs"></i>
          <input
            type="text"
            className="bg-transparent border-none text-xs w-full text-white placeholder-text-muted outline-none"
            placeholder="Search hackathons..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Filter Mode */}
        <select
          value={filterMode}
          onChange={(e) => setFilterMode(e.target.value)}
          className="bg-bg-input border border-border-color rounded-xl px-4 py-2.5 text-xs text-text-primary hover:border-accent-red/30 transition-all outline-none cursor-pointer w-full sm:w-40"
        >
          <option value="All">All Modes</option>
          <option value="Online">Online Only</option>
          <option value="Offline">Offline Only</option>
        </select>
      </div>

      {/* Hackathons Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((hack) => (
          <Card
            key={hack.id}
            title={hack.name}
            subtitle={`Conducted by: ${hack.conductedBy}`}
            icon="fa-solid fa-code"
            onClick={() => setSelectedHackathon(hack)}
            actions={<Badge status={hack.mode === "Online" ? "info" : "approved"} label={hack.mode} />}
          >
            <div className="space-y-3">
              <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed">
                {hack.description}
              </p>
              <div className="h-[1px] bg-border-color my-2"></div>
              <div className="flex flex-col gap-1.5 text-[11px] text-text-secondary">
                <span className="flex items-center gap-2">
                  <i className="fa-regular fa-calendar text-text-muted w-4"></i>
                  <span>{hack.startDate} to {hack.endDate}</span>
                </span>
                <span className="flex items-center gap-2">
                  <i className="fa-solid fa-users text-text-muted w-4"></i>
                  <span>Format: {hack.participation} {hack.maxTeamSize ? `(Max ${hack.maxTeamSize} members)` : ""}</span>
                </span>
                <span className="flex items-center gap-2">
                  <i className="fa-solid fa-location-dot text-text-muted w-4"></i>
                  <span className="truncate">{hack.venue}</span>
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 border border-dashed border-border-color rounded-2xl bg-bg-secondary/20">
          <i className="fa-solid fa-code-compare text-2xl text-text-muted mb-3"></i>
          <p className="text-sm text-text-secondary">No hackathons match your search or filters.</p>
        </div>
      )}

      {/* View Hackathon Detail Modal */}
      <Modal
        isOpen={!!selectedHackathon}
        onClose={() => setSelectedHackathon(null)}
        title="Hackathon Details"
        size="md"
        footer={
          <button
            onClick={() => setSelectedHackathon(null)}
            className="px-4 py-2 bg-bg-input border border-border-color hover:border-accent-red/40 rounded-xl text-xs font-bold text-text-primary hover:text-white transition-fast cursor-pointer"
          >
            Close
          </button>
        }
      >
        {selectedHackathon && (
          <div className="space-y-4">
            <div>
              <span className="text-[10px] uppercase tracking-wider font-extrabold text-accent-red">Challenge Name</span>
              <h2 className="text-base font-bold text-white mt-0.5">{selectedHackathon.name}</h2>
            </div>

            <div>
              <span className="text-[10px] uppercase tracking-wider font-extrabold text-accent-red">Description</span>
              <p className="text-xs text-text-secondary mt-1 leading-relaxed">{selectedHackathon.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-b border-border-color py-3">
              <div>
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-text-muted">Conducted By</span>
                <p className="text-xs text-white mt-1">{selectedHackathon.conductedBy}</p>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-text-muted">Mode & Location</span>
                <p className="text-xs text-white mt-1">
                  {selectedHackathon.mode} — <span className="text-text-secondary">{selectedHackathon.venue}</span>
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 border-b border-border-color pb-3">
              <div>
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-text-muted">Dates</span>
                <p className="text-xs text-white mt-1">
                  {selectedHackathon.startDate} to {selectedHackathon.endDate}
                </p>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-text-muted">Participation</span>
                <p className="text-xs text-white mt-1">
                  {selectedHackathon.participation}
                  {selectedHackathon.minTeamSize ? ` (Min ${selectedHackathon.minTeamSize} - Max ${selectedHackathon.maxTeamSize} students)` : ""}
                </p>
              </div>
            </div>

            <div>
              <span className="text-[10px] uppercase tracking-wider font-extrabold text-accent-red">Coordinator Details</span>
              <div className="mt-1 flex flex-col gap-1 text-xs text-white">
                <span>{selectedHackathon.contactName}</span>
                <span className="text-text-secondary">{selectedHackathon.contactEmail} | {selectedHackathon.contactPhone}</span>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Create Hackathon Modal */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Create New Hackathon"
        size="lg"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4 text-text-primary">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase tracking-wider font-extrabold text-text-secondary mb-1">Hackathon Title</label>
              <input
                type="text"
                required
                className="w-full bg-bg-input border border-border-color rounded-xl px-3 py-2 text-xs text-white focus:border-accent-red/50 outline-none"
                placeholder="E.g. AgriTech Innovators Sprint"
                value={newHack.name}
                onChange={(e) => setNewHack({ ...newHack, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-wider font-extrabold text-text-secondary mb-1">Organized By</label>
              <input
                type="text"
                required
                className="w-full bg-bg-input border border-border-color rounded-xl px-3 py-2 text-xs text-white focus:border-accent-red/50 outline-none"
                placeholder="E.g. StepUp Incubations"
                value={newHack.conductedBy}
                onChange={(e) => setNewHack({ ...newHack, conductedBy: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-wider font-extrabold text-text-secondary mb-1">Brief Description</label>
            <textarea
              required
              rows={3}
              className="w-full bg-bg-input border border-border-color rounded-xl px-3 py-2 text-xs text-white focus:border-accent-red/50 outline-none resize-none"
              placeholder="State the objective, prize money pool, guidelines..."
              value={newHack.description}
              onChange={(e) => setNewHack({ ...newHack, description: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-[10px] uppercase tracking-wider font-extrabold text-text-secondary mb-1">Format</label>
              <select
                className="w-full bg-bg-input border border-border-color rounded-xl px-3 py-2 text-xs text-white focus:border-accent-red/50 outline-none cursor-pointer"
                value={newHack.participation}
                onChange={(e) => setNewHack({ ...newHack, participation: e.target.value })}
              >
                <option>Team</option>
                <option>Solo</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-wider font-extrabold text-text-secondary mb-1">Min Team Size</label>
              <input
                type="number"
                disabled={newHack.participation === "Solo"}
                className="w-full bg-bg-input border border-border-color rounded-xl px-3 py-2 text-xs text-white focus:border-accent-red/50 outline-none disabled:opacity-30"
                value={newHack.participation === "Solo" ? "" : newHack.minTeamSize}
                onChange={(e) => setNewHack({ ...newHack, minTeamSize: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-wider font-extrabold text-text-secondary mb-1">Max Team Size</label>
              <input
                type="number"
                disabled={newHack.participation === "Solo"}
                className="w-full bg-bg-input border border-border-color rounded-xl px-3 py-2 text-xs text-white focus:border-accent-red/50 outline-none disabled:opacity-30"
                value={newHack.participation === "Solo" ? "" : newHack.maxTeamSize}
                onChange={(e) => setNewHack({ ...newHack, maxTeamSize: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-wider font-extrabold text-text-secondary mb-1">Mode</label>
              <select
                className="w-full bg-bg-input border border-border-color rounded-xl px-3 py-2 text-xs text-white focus:border-accent-red/50 outline-none cursor-pointer"
                value={newHack.mode}
                onChange={(e) => setNewHack({ ...newHack, mode: e.target.value })}
              >
                <option>Online</option>
                <option>Offline</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase tracking-wider font-extrabold text-text-secondary mb-1">Start Date</label>
              <input
                type="date"
                required
                className="w-full bg-bg-input border border-border-color rounded-xl px-3 py-2 text-xs text-white focus:border-accent-red/50 outline-none"
                value={newHack.startDate}
                onChange={(e) => setNewHack({ ...newHack, startDate: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-wider font-extrabold text-text-secondary mb-1">End Date</label>
              <input
                type="date"
                required
                className="w-full bg-bg-input border border-border-color rounded-xl px-3 py-2 text-xs text-white focus:border-accent-red/50 outline-none"
                value={newHack.endDate}
                onChange={(e) => setNewHack({ ...newHack, endDate: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase tracking-wider font-extrabold text-text-secondary mb-1">Location / Classroom Link</label>
              <input
                type="text"
                required
                className="w-full bg-bg-input border border-border-color rounded-xl px-3 py-2 text-xs text-white focus:border-accent-red/50 outline-none"
                placeholder="E.g. StepUp Bangalore Campus, Discord & Github"
                value={newHack.venue}
                onChange={(e) => setNewHack({ ...newHack, venue: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-wider font-extrabold text-text-secondary mb-1">Timezone</label>
              <select
                className="w-full bg-bg-input border border-border-color rounded-xl px-3 py-2 text-xs text-white focus:border-accent-red/50 outline-none cursor-pointer"
                value={newHack.timezone}
                onChange={(e) => setNewHack({ ...newHack, timezone: e.target.value })}
              >
                <option value="UTC+5:30">UTC+5:30 (India Standard Time)</option>
                <option value="UTC+0:00">UTC+0:00 (GMT)</option>
                <option value="UTC-5:00">UTC-5:00 (EST)</option>
              </select>
            </div>
          </div>

          <div className="border-t border-border-color/60 pt-4">
            <h4 className="text-xs font-bold text-white mb-2.5">Coordinator Contacts</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] uppercase tracking-wider font-extrabold text-text-secondary mb-1">Name</label>
                <input
                  type="text"
                  required
                  className="w-full bg-bg-input border border-border-color rounded-xl px-3 py-2 text-xs text-white focus:border-accent-red/50 outline-none"
                  placeholder="Coordinator Lead"
                  value={newHack.contactName}
                  onChange={(e) => setNewHack({ ...newHack, contactName: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-wider font-extrabold text-text-secondary mb-1">Email</label>
                <input
                  type="email"
                  required
                  className="w-full bg-bg-input border border-border-color rounded-xl px-3 py-2 text-xs text-white focus:border-accent-red/50 outline-none"
                  placeholder="hack@stepup.ai"
                  value={newHack.contactEmail}
                  onChange={(e) => setNewHack({ ...newHack, contactEmail: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-wider font-extrabold text-text-secondary mb-1">Phone</label>
                <input
                  type="text"
                  required
                  className="w-full bg-bg-input border border-border-color rounded-xl px-3 py-2 text-xs text-white focus:border-accent-red/50 outline-none"
                  placeholder="987654xxxx"
                  value={newHack.contactPhone}
                  onChange={(e) => setNewHack({ ...newHack, contactPhone: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-border-color/60 pt-4">
            <button
              type="button"
              onClick={() => setCreateModalOpen(false)}
              className="px-4 py-2 bg-bg-input border border-border-color hover:border-accent-red/40 rounded-xl text-xs font-bold text-text-secondary hover:text-white transition-fast cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-accent-red hover:bg-accent-red-hover text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              Save Hackathon
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
