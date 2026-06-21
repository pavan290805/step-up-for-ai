"use client";

import Sidebar from "@/components/Sidebar";
import { useState, useEffect, useRef } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Click outside listener for top profile dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAction = (actionName: string) => {
    alert(`${actionName} triggered! (Visual Action Only)`);
    setProfileDropdownOpen(false);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-bg-primary text-text-primary">
      {/* Sidebar Navigation */}
      <Sidebar />

      {/* Right Layout Container */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Navigation Bar */}
        <header className="h-[70px] border-b border-border-color bg-bg-secondary/40 backdrop-blur-md px-6 flex items-center justify-between shrink-0 z-20">
          {/* Search Wrapper */}
          <div className="flex items-center gap-3 bg-bg-input border border-border-color px-4 py-2 rounded-xl w-80 text-text-secondary focus-within:border-accent-red/50 focus-within:text-text-primary transition-all">
            <i className="fa-solid fa-magnifying-glass text-sm"></i>
            <input
              type="text"
              className="bg-transparent border-none text-xs w-full text-white placeholder-text-muted outline-none"
              placeholder="Search anything..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <span className="text-[10px] bg-bg-secondary border border-border-color px-1.5 py-0.5 rounded text-text-muted select-none font-semibold">
              Ctrl + K
            </span>
          </div>

          {/* Top Actions Right */}
          <div className="flex items-center gap-5">
            {/* Notification Bell */}
            <div className="relative cursor-pointer text-text-secondary hover:text-text-primary transition-colors">
              <i className="fa-regular fa-bell text-lg"></i>
              <span className="absolute -top-1.5 -right-1.5 bg-accent-red text-white text-[9px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center scale-90 border border-bg-primary">
                12
              </span>
            </div>

            {/* Profile Dropdown Brief */}
            <div className="relative" ref={dropdownRef}>
              <div
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2.5 cursor-pointer hover:opacity-90 transition-opacity"
              >
                <div className="w-8 h-8 rounded-full bg-accent-red flex items-center justify-center font-bold text-xs text-white">
                  A
                </div>
                <div className="hidden md:flex flex-col text-left leading-tight">
                  <span className="text-xs font-bold text-white">Admin</span>
                  <span className="text-[9px] text-text-secondary">Super Admin</span>
                </div>
                <i className="fa-solid fa-chevron-down text-[10px] text-text-muted"></i>
              </div>

              {/* Dropdown Menu */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2.5 w-48 bg-bg-secondary border border-border-color rounded-xl shadow-card p-1.5 flex flex-col gap-1 z-50 glass-panel">
                  <button
                    onClick={() => handleAction("Load Demo Data")}
                    className="flex items-center gap-2.5 px-3 py-2 w-full text-left text-xs font-medium text-text-primary hover:bg-bg-input rounded-lg transition-fast cursor-pointer"
                  >
                    <i className="fa-solid fa-wand-magic-sparkles text-accent-red w-4 text-center"></i>
                    <span>Load Demo Data</span>
                  </button>
                  <button
                    onClick={() => handleAction("Reset Database")}
                    className="flex items-center gap-2.5 px-3 py-2 w-full text-left text-xs font-medium text-text-primary hover:bg-bg-input rounded-lg transition-fast cursor-pointer"
                  >
                    <i className="fa-solid fa-trash-can text-accent-red w-4 text-center"></i>
                    <span>Reset Database</span>
                  </button>
                  <div className="h-[1px] bg-border-color my-1"></div>
                  <button
                    onClick={() => handleAction("Sign Out")}
                    className="flex items-center gap-2.5 px-3 py-2 w-full text-left text-xs font-medium text-text-secondary hover:bg-bg-input hover:text-text-primary rounded-lg transition-fast cursor-pointer"
                  >
                    <i className="fa-solid fa-arrow-right-from-bracket w-4 text-center"></i>
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Scrollable Content Container */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-bg-primary">
          {children}
        </main>
      </div>
    </div>
  );
}
