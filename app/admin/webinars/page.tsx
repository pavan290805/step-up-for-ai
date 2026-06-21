"use client";

import { useState } from "react";
import { Card, Badge, PageHeader, Modal } from "@/components/UI";
import { mockWebinars, Webinar } from "@/components/mockData";

export default function WebinarsPage() {
  const [search, setSearch] = useState("");
  const [filterMode, setFilterMode] = useState("All");
  const [selectedWebinar, setSelectedWebinar] = useState<Webinar | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  // Form states
  const [newWebinar, setNewWebinar] = useState({
    name: "",
    overview: "",
    description: "",
    startDate: "",
    endDate: "",
    timezone: "UTC+5:30",
    startTime: "",
    endTime: "",
    mode: "Online",
    venue: "",
    contactName: "",
    contactPhone: "",
    contactEmail: "",
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Webinar "${newWebinar.name}" successfully created! (Visual UI Action Only - Not persisted)`);
    setCreateModalOpen(false);
    setNewWebinar({
      name: "",
      overview: "",
      description: "",
      startDate: "",
      endDate: "",
      timezone: "UTC+5:30",
      startTime: "",
      endTime: "",
      mode: "Online",
      venue: "",
      contactName: "",
      contactPhone: "",
      contactEmail: "",
    });
  };

  const filtered = mockWebinars.filter((web) => {
    const matchesSearch = web.name.toLowerCase().includes(search.toLowerCase()) ||
      web.overview.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filterMode === "All" || web.mode === filterMode;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Webinars Management"
        description="Schedule, review, and detail platform masterclasses and webinars."
        actions={
          <button
            onClick={() => setCreateModalOpen(true)}
            className="bg-accent-red hover:bg-accent-red-hover text-white rounded-xl px-4 py-2 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
          >
            <i className="fa-solid fa-plus"></i>
            <span>Create Webinar</span>
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
            placeholder="Search webinars..."
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
          <option value="Hybrid">Hybrid Only</option>
        </select>
      </div>

      {/* Webinars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((web) => (
          <Card
            key={web.id}
            title={web.name}
            subtitle={`ID: WEB-${web.id}`}
            icon="fa-solid fa-video"
            onClick={() => setSelectedWebinar(web)}
            actions={<Badge status={web.mode === "Online" ? "info" : "approved"} label={web.mode} />}
          >
            <div className="space-y-3">
              <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed">
                {web.overview}
              </p>
              <div className="h-[1px] bg-border-color my-2"></div>
              <div className="flex flex-col gap-1.5 text-[11px] text-text-secondary">
                <span className="flex items-center gap-2">
                  <i className="fa-regular fa-calendar text-text-muted w-4"></i>
                  <span>{web.startDate}</span>
                </span>
                <span className="flex items-center gap-2">
                  <i className="fa-regular fa-clock text-text-muted w-4"></i>
                  <span>{web.startTime} ({web.timezone})</span>
                </span>
                <span className="flex items-center gap-2">
                  <i className="fa-solid fa-location-dot text-text-muted w-4"></i>
                  <span className="truncate">{web.venue}</span>
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 border border-dashed border-border-color rounded-2xl bg-bg-secondary/20">
          <i className="fa-solid fa-video-slash text-2xl text-text-muted mb-3"></i>
          <p className="text-sm text-text-secondary">No webinars match your search or filters.</p>
        </div>
      )}

      {/* View Webinar Detail Modal */}
      <Modal
        isOpen={!!selectedWebinar}
        onClose={() => setSelectedWebinar(null)}
        title="Webinar Details"
        size="md"
        footer={
          <button
            onClick={() => setSelectedWebinar(null)}
            className="px-4 py-2 bg-bg-input border border-border-color hover:border-accent-red/40 rounded-xl text-xs font-bold text-text-primary hover:text-white transition-fast cursor-pointer"
          >
            Close
          </button>
        }
      >
        {selectedWebinar && (
          <div className="space-y-4">
            <div>
              <span className="text-[10px] uppercase tracking-wider font-extrabold text-accent-red">Topic Name</span>
              <h2 className="text-base font-bold text-white mt-0.5">{selectedWebinar.name}</h2>
            </div>

            <div>
              <span className="text-[10px] uppercase tracking-wider font-extrabold text-accent-red">Overview</span>
              <p className="text-xs text-text-secondary mt-1 leading-relaxed">{selectedWebinar.overview}</p>
            </div>

            <div>
              <span className="text-[10px] uppercase tracking-wider font-extrabold text-accent-red">Description</span>
              <p className="text-xs text-text-secondary mt-1 leading-relaxed">{selectedWebinar.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-b border-border-color py-3">
              <div>
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-text-muted">Mode & Venue</span>
                <p className="text-xs text-white mt-1">
                  {selectedWebinar.mode} — <span className="text-text-secondary">{selectedWebinar.venue}</span>
                </p>
              </div>
              <div>
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-text-muted">Schedule</span>
                <p className="text-xs text-white mt-1">
                  {selectedWebinar.startDate} @ {selectedWebinar.startTime} ({selectedWebinar.timezone})
                </p>
              </div>
            </div>

            <div>
              <span className="text-[10px] uppercase tracking-wider font-extrabold text-accent-red">Contact Person</span>
              <div className="mt-1 flex flex-col gap-1 text-xs text-white">
                <span>{selectedWebinar.contactName}</span>
                <span className="text-text-secondary">{selectedWebinar.contactEmail} | {selectedWebinar.contactPhone}</span>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Create Webinar Modal */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        title="Create New Webinar"
        size="lg"
      >
        <form onSubmit={handleCreateSubmit} className="space-y-4 text-text-primary">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase tracking-wider font-extrabold text-text-secondary mb-1">Webinar Name</label>
              <input
                type="text"
                required
                className="w-full bg-bg-input border border-border-color rounded-xl px-3 py-2 text-xs text-white focus:border-accent-red/50 outline-none"
                placeholder="E.g. Advanced Reinforcement Learning"
                value={newWebinar.name}
                onChange={(e) => setNewWebinar({ ...newWebinar, name: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-wider font-extrabold text-text-secondary mb-1">Mode</label>
              <select
                className="w-full bg-bg-input border border-border-color rounded-xl px-3 py-2 text-xs text-white focus:border-accent-red/50 outline-none cursor-pointer"
                value={newWebinar.mode}
                onChange={(e) => setNewWebinar({ ...newWebinar, mode: e.target.value })}
              >
                <option>Online</option>
                <option>Offline</option>
                <option>Hybrid</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-wider font-extrabold text-text-secondary mb-1">One-liner Overview</label>
            <input
              type="text"
              required
              className="w-full bg-bg-input border border-border-color rounded-xl px-3 py-2 text-xs text-white focus:border-accent-red/50 outline-none"
              placeholder="Short brief of topic..."
              value={newWebinar.overview}
              onChange={(e) => setNewWebinar({ ...newWebinar, overview: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-[10px] uppercase tracking-wider font-extrabold text-text-secondary mb-1">Detailed Description</label>
            <textarea
              required
              rows={3}
              className="w-full bg-bg-input border border-border-color rounded-xl px-3 py-2 text-xs text-white focus:border-accent-red/50 outline-none resize-none"
              placeholder="Provide a comprehensive lecture syllabus..."
              value={newWebinar.description}
              onChange={(e) => setNewWebinar({ ...newWebinar, description: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] uppercase tracking-wider font-extrabold text-text-secondary mb-1">Date</label>
              <input
                type="date"
                required
                className="w-full bg-bg-input border border-border-color rounded-xl px-3 py-2 text-xs text-white focus:border-accent-red/50 outline-none"
                value={newWebinar.startDate}
                onChange={(e) => setNewWebinar({ ...newWebinar, startDate: e.target.value, endDate: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-wider font-extrabold text-text-secondary mb-1">Start Time</label>
              <input
                type="time"
                required
                className="w-full bg-bg-input border border-border-color rounded-xl px-3 py-2 text-xs text-white focus:border-accent-red/50 outline-none"
                value={newWebinar.startTime}
                onChange={(e) => setNewWebinar({ ...newWebinar, startTime: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-wider font-extrabold text-text-secondary mb-1">End Time</label>
              <input
                type="time"
                required
                className="w-full bg-bg-input border border-border-color rounded-xl px-3 py-2 text-xs text-white focus:border-accent-red/50 outline-none"
                value={newWebinar.endTime}
                onChange={(e) => setNewWebinar({ ...newWebinar, endTime: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] uppercase tracking-wider font-extrabold text-text-secondary mb-1">Venue / Link</label>
              <input
                type="text"
                required
                className="w-full bg-bg-input border border-border-color rounded-xl px-3 py-2 text-xs text-white focus:border-accent-red/50 outline-none"
                placeholder="E.g. Zoom link or Campus Room"
                value={newWebinar.venue}
                onChange={(e) => setNewWebinar({ ...newWebinar, venue: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-wider font-extrabold text-text-secondary mb-1">TimeZone</label>
              {/* Drop down selection for timezone as requested */}
              <select
                className="w-full bg-bg-input border border-border-color rounded-xl px-3 py-2 text-xs text-white focus:border-accent-red/50 outline-none cursor-pointer"
                value={newWebinar.timezone}
                onChange={(e) => setNewWebinar({ ...newWebinar, timezone: e.target.value })}
              >
                <option value="UTC+5:30">UTC+5:30 (India Standard Time)</option>
                <option value="UTC+0:00">UTC+0:00 (GMT)</option>
                <option value="UTC-5:00">UTC-5:00 (EST)</option>
                <option value="UTC-8:00">UTC-8:00 (PST)</option>
              </select>
            </div>
          </div>

          <div className="border-t border-border-color/60 pt-4">
            <h4 className="text-xs font-bold text-white mb-2.5">Speaker Contact Coordinates</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] uppercase tracking-wider font-extrabold text-text-secondary mb-1">Name</label>
                <input
                  type="text"
                  required
                  className="w-full bg-bg-input border border-border-color rounded-xl px-3 py-2 text-xs text-white focus:border-accent-red/50 outline-none"
                  placeholder="Speaker Organizer"
                  value={newWebinar.contactName}
                  onChange={(e) => setNewWebinar({ ...newWebinar, contactName: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-wider font-extrabold text-text-secondary mb-1">Email</label>
                <input
                  type="email"
                  required
                  className="w-full bg-bg-input border border-border-color rounded-xl px-3 py-2 text-xs text-white focus:border-accent-red/50 outline-none"
                  placeholder="contact@speaker.com"
                  value={newWebinar.contactEmail}
                  onChange={(e) => setNewWebinar({ ...newWebinar, contactEmail: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-wider font-extrabold text-text-secondary mb-1">Phone</label>
                <input
                  type="text"
                  required
                  className="w-full bg-bg-input border border-border-color rounded-xl px-3 py-2 text-xs text-white focus:border-accent-red/50 outline-none"
                  placeholder="987654xxxx"
                  value={newWebinar.contactPhone}
                  onChange={(e) => setNewWebinar({ ...newWebinar, contactPhone: e.target.value })}
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
              Save Webinar
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
