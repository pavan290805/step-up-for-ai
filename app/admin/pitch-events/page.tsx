"use client";

import { useState } from "react";
import { Card, Badge, PageHeader, Modal } from "@/components/UI";
import { mockPitchEvents, PitchEvent } from "@/components/mockData";

export default function PitchEventsPage() {
  const [search, setSearch] = useState("");
  const [filterMode, setFilterMode] = useState("All");
  const [selectedPitchEvent, setSelectedPitchEvent] = useState<PitchEvent | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // Form states
  const [newPitch, setNewPitch] = useState({
    name: "",
    overview: "",
    description: "",
    startDate: "",
    endDate: "",
    timezone: "UTC+5:30",
    startTime: "18:00",
    endTime: "21:00",
    mode: "Online",
    venue: "",
    ticketName: "Founder Pass",
    ticketPrice: 500,
    ticketDescription: "Access to presentations and networking database",
    saleStartDate: "",
    saleEndDate: "",
    saleStartTime: "09:00",
    saleEndTime: "18:00",
    contactName: "",
    contactPhone: "",
    contactEmail: "",
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Pitch Event "${newPitch.name}" successfully created! (Visual UI Action Only - Not persisted)`);
    setCreateModalOpen(false);
    setNewPitch({
      name: "",
      overview: "",
      description: "",
      startDate: "",
      endDate: "",
      timezone: "UTC+5:30",
      startTime: "18:00",
      endTime: "21:00",
      mode: "Online",
      venue: "",
      ticketName: "Founder Pass",
      ticketPrice: 500,
      ticketDescription: "Access to presentations and networking database",
      saleStartDate: "",
      saleEndDate: "",
      saleStartTime: "09:00",
      saleEndTime: "18:00",
      contactName: "",
      contactPhone: "",
      contactEmail: "",
    });
  };

  const filtered = mockPitchEvents.filter((pe) => {
    const matchesSearch = pe.name.toLowerCase().includes(search.toLowerCase()) ||
      pe.overview.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filterMode === "All" || pe.mode === filterMode;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Pitch Events Management"
        description="Schedule, details, and tickets configuration for early-stage startup investor showcase events."
        actions={
          <button
            onClick={() => setCreateModalOpen(true)}
            className="bg-accent-red hover:bg-accent-red-hover text-white rounded-xl px-4 py-2 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
          >
            <i className="fa-solid fa-plus"></i>
            <span>Create Pitch Event</span>
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
            placeholder="Search pitch events..."
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

      {/* Pitch Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((pe) => (
          <Card
            key={pe.id}
            title={pe.name}
            subtitle={`ID: PIT-${pe.id}`}
            icon="fa-solid fa-microphone"
            onClick={() => setSelectedPitchEvent(pe)}
            actions={<Badge status={pe.mode === "Online" ? "info" : "approved"} label={pe.mode} />}
          >
            <div className="space-y-3">
              <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed">
                {pe.overview}
              </p>
              <div className="h-[1px] bg-border-color my-2"></div>
              <div className="flex flex-col gap-1.5 text-[11px] text-text-secondary">
                <span className="flex items-center gap-2">
                  <i className="fa-regular fa-calendar text-text-muted w-4"></i>
                  <span>{pe.startDate}</span>
                </span>
                <span className="flex items-center gap-2">
                  <i className="fa-solid fa-ticket text-text-muted w-4"></i>
                  <span>{pe.ticketName} (₹{pe.ticketPrice})</span>
                </span>
                <span className="flex items-center gap-2">
                  <i className="fa-solid fa-location-dot text-text-muted w-4"></i>
                  <span className="truncate">{pe.venue}</span>
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 border border-dashed border-border-color rounded-2xl bg-bg-secondary/20">
          <i className="fa-solid fa-volume-xmark text-2xl text-text-muted mb-3"></i>
          <p className="text-sm text-text-secondary">No pitch events match your search or filters.</p>
        </div>
      )}

      {/* View Pitch Event Detail Modal */}
      <Modal
        isOpen={!!selectedPitchEvent}
        onClose={() => setSelectedPitchEvent(null)}
        title="Pitch Event Details"
        size="md"
        footer={
          <button
            onClick={() => setSelectedPitchEvent(null)}
            className="px-4 py-2 bg-bg-input border border-border-color hover:border-accent-red/40 rounded-xl text-xs font-bold text-text-primary hover:text-white transition-fast cursor-pointer"
          >
            Close
          </button>
        }
      >
        {selectedPitchEvent && (
          <div className="space-y-4">
            <div>
              <span className="text-[10px] uppercase tracking-wider font-extrabold text-accent-red">Event Name</span>
              <h2 className="text-base font-bold text-white mt-0.5">{selectedPitchEvent.name}</h2>
            </div>

            <div>
              <span className="text-[10px] uppercase tracking-wider font-extrabold text-accent-red">Overview</span>
              <p className="text-xs text-text-secondary mt-1 leading-relaxed">{selectedPitchEvent.overview}</p>
            </div>

            <div>
              <span className="text-[10px] uppercase tracking-wider font-extrabold text-accent-red">Description</span>
              <p className="text-xs text-text-secondary mt-1 leading-relaxed">{selectedPitchEvent.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-b border-border-color py-3">
              <div>
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-text-muted">Mode & Location</span>
                <p className="text-xs text-white mt-1">
                  {selectedPitchEvent.mode} — <span className="text-text-secondary">{selectedPitchEvent.venue}</span>
                </p>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-text-muted">Schedule</span>
                <p className="text-xs text-white mt-1">
                  {selectedPitchEvent.startDate} @ {selectedPitchEvent.startTime} ({selectedPitchEvent.timezone})
                </p>
              </div>
            </div>

            <div className="p-3 bg-bg-input/35 border border-border-color rounded-xl">
              <span className="text-[10px] uppercase tracking-wider font-extrabold text-accent-red">Ticket Configuration</span>
              <div className="mt-1.5 flex justify-between items-baseline gap-2">
                <span className="text-xs font-bold text-white">{selectedPitchEvent.ticketName}</span>
                <span className="text-xs font-black text-accent-red">₹{selectedPitchEvent.ticketPrice}</span>
              </div>
              <p className="text-[10px] text-text-secondary mt-1">{selectedPitchEvent.ticketDescription}</p>
              <div className="h-[1px] bg-border-color my-2"></div>
              <span className="text-[9px] text-text-muted uppercase font-bold">
                Ticket Sales: {selectedPitchEvent.saleStartDate} to {selectedPitchEvent.saleEndDate}
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase tracking-wider font-extrabold text-text-muted">Organizer Contact</span>
              <div className="mt-1 flex flex-col gap-1 text-xs text-white">
                <span>{selectedPitchEvent.contactName}</span>
                <span className="text-text-secondary">{selectedPitchEvent.contactEmail} | {selectedPitchEvent.contactPhone}</span>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Create Pitch Event Modal */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Create New Pitch Event"
        size="lg"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4 text-text-primary">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase tracking-wider font-extrabold text-text-secondary mb-1">Event Name</label>
              <input
                type="text"
                required
                className="w-full bg-bg-input border border-border-color rounded-xl px-3 py-2 text-xs text-white focus:border-accent-red/50 outline-none"
                placeholder="E.g. Pre-seed AI Startup Night"
                value={newPitch.name}
                onChange={(e) => setNewPitch({ ...newPitch, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-wider font-extrabold text-text-secondary mb-1">Mode</label>
              <select
                className="w-full bg-bg-input border border-border-color rounded-xl px-3 py-2 text-xs text-white focus:border-accent-red/50 outline-none cursor-pointer"
                value={newPitch.mode}
                onChange={(e) => setNewPitch({ ...newPitch, mode: e.target.value })}
              >
                <option>Online</option>
                <option>Offline</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-wider font-extrabold text-text-secondary mb-1">Short Overview</label>
            <input
              type="text"
              required
              className="w-full bg-bg-input border border-border-color rounded-xl px-3 py-2 text-xs text-white focus:border-accent-red/50 outline-none"
              placeholder="Short one-line brief..."
              value={newPitch.overview}
              onChange={(e) => setNewPitch({ ...newPitch, overview: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-wider font-extrabold text-text-secondary mb-1">Description</label>
            <textarea
              required
              rows={2}
              className="w-full bg-bg-input border border-border-color rounded-xl px-3 py-2 text-xs text-white focus:border-accent-red/50 outline-none resize-none"
              placeholder="Provide event schedule, pitching criteria..."
              value={newPitch.description}
              onChange={(e) => setNewPitch({ ...newPitch, description: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] uppercase tracking-wider font-extrabold text-text-secondary mb-1">Date</label>
              <input
                type="date"
                required
                className="w-full bg-bg-input border border-border-color rounded-xl px-3 py-2 text-xs text-white focus:border-accent-red/50 outline-none"
                value={newPitch.startDate}
                onChange={(e) => setNewPitch({ ...newPitch, startDate: e.target.value, endDate: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-wider font-extrabold text-text-secondary mb-1">Start Time</label>
              <input
                type="time"
                required
                className="w-full bg-bg-input border border-border-color rounded-xl px-3 py-2 text-xs text-white focus:border-accent-red/50 outline-none"
                value={newPitch.startTime}
                onChange={(e) => setNewPitch({ ...newPitch, startTime: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-wider font-extrabold text-text-secondary mb-1">End Time</label>
              <input
                type="time"
                required
                className="w-full bg-bg-input border border-border-color rounded-xl px-3 py-2 text-xs text-white focus:border-accent-red/50 outline-none"
                value={newPitch.endTime}
                onChange={(e) => setNewPitch({ ...newPitch, endTime: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase tracking-wider font-extrabold text-text-secondary mb-1">Venue / Zoom link</label>
              <input
                type="text"
                required
                className="w-full bg-bg-input border border-border-color rounded-xl px-3 py-2 text-xs text-white focus:border-accent-red/50 outline-none"
                placeholder="ITC Grand Ballroom or Zoom Meeting"
                value={newPitch.venue}
                onChange={(e) => setNewPitch({ ...newPitch, venue: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-wider font-extrabold text-text-secondary mb-1">Timezone</label>
              <select
                className="w-full bg-bg-input border border-border-color rounded-xl px-3 py-2 text-xs text-white focus:border-accent-red/50 outline-none cursor-pointer"
                value={newPitch.timezone}
                onChange={(e) => setNewPitch({ ...newPitch, timezone: e.target.value })}
              >
                <option value="UTC+5:30">UTC+5:30 (India Standard Time)</option>
                <option value="UTC+0:00">UTC+0:00 (GMT)</option>
              </select>
            </div>
          </div>

          {/* Ticket Information */}
          <div className="border-t border-border-color/60 pt-4">
            <h4 className="text-xs font-bold text-white mb-2.5">Ticket & Sales Setup</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] uppercase tracking-wider font-extrabold text-text-secondary mb-1">Ticket Name</label>
                <input
                  type="text"
                  required
                  className="w-full bg-bg-input border border-border-color rounded-xl px-3 py-2 text-xs text-white focus:border-accent-red/50 outline-none"
                  value={newPitch.ticketName}
                  onChange={(e) => setNewPitch({ ...newPitch, ticketName: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-wider font-extrabold text-text-secondary mb-1">Price (INR)</label>
                <input
                  type="number"
                  required
                  className="w-full bg-bg-input border border-border-color rounded-xl px-3 py-2 text-xs text-white focus:border-accent-red/50 outline-none"
                  value={newPitch.ticketPrice}
                  onChange={(e) => setNewPitch({ ...newPitch, ticketPrice: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-wider font-extrabold text-text-secondary mb-1">Ticket Sales Deadline</label>
                <input
                  type="date"
                  required
                  className="w-full bg-bg-input border border-border-color rounded-xl px-3 py-2 text-xs text-white focus:border-accent-red/50 outline-none"
                  value={newPitch.saleEndDate}
                  onChange={(e) => setNewPitch({ ...newPitch, saleEndDate: e.target.value })}
                />
              </div>
            </div>
          </div>

          <div className="border-t border-border-color/60 pt-4">
            <h4 className="text-xs font-bold text-white mb-2.5">Organizer Contacts</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] uppercase tracking-wider font-extrabold text-text-secondary mb-1">Name</label>
                <input
                  type="text"
                  required
                  className="w-full bg-bg-input border border-border-color rounded-xl px-3 py-2 text-xs text-white focus:border-accent-red/50 outline-none"
                  placeholder="Incubator Associate"
                  value={newPitch.contactName}
                  onChange={(e) => setNewPitch({ ...newPitch, contactName: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-wider font-extrabold text-text-secondary mb-1">Email</label>
                <input
                  type="email"
                  required
                  className="w-full bg-bg-input border border-border-color rounded-xl px-3 py-2 text-xs text-white focus:border-accent-red/50 outline-none"
                  placeholder="pitch@stepup.ai"
                  value={newPitch.contactEmail}
                  onChange={(e) => setNewPitch({ ...newPitch, contactEmail: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-wider font-extrabold text-text-secondary mb-1">Phone</label>
                <input
                  type="text"
                  required
                  className="w-full bg-bg-input border border-border-color rounded-xl px-3 py-2 text-xs text-white focus:border-accent-red/50 outline-none"
                  placeholder="987654xxxx"
                  value={newPitch.contactPhone}
                  onChange={(e) => setNewPitch({ ...newPitch, contactPhone: e.target.value })}
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
              Save Event
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
