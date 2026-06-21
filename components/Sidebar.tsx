"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";

interface SubmenuItem {
  label: string;
  href: string;
  tabId: string;
}

interface MenuItem {
  label: string;
  href?: string;
  icon: string;
  tabId: string;
  submenu?: SubmenuItem[];
}

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Define menus
  const menuItems: MenuItem[] = [
    {
      label: "Dashboard",
      href: "/admin/dashboard",
      icon: "fa-solid fa-chart-pie",
      tabId: "dashboard",
    },
    {
      label: "Webinars",
      href: "/admin/webinars",
      icon: "fa-solid fa-video",
      tabId: "webinars",
      submenu: [
        { label: "View Webinars", href: "/admin/webinars", tabId: "webinars-list" },
        { label: "Create Webinar", href: "/admin/webinars?create=true", tabId: "webinars-create" },
      ],
    },
    {
      label: "Hackathons",
      href: "/admin/hackathons",
      icon: "fa-solid fa-code",
      tabId: "hackathons",
      submenu: [
        { label: "View Hackathons", href: "/admin/hackathons", tabId: "hackathons-list" },
        { label: "Create Hackathon", href: "/admin/hackathons?create=true", tabId: "hackathons-create" },
      ],
    },
    {
      label: "Pitch Events",
      href: "/admin/pitch-events",
      icon: "fa-solid fa-microphone",
      tabId: "pitch-events",
      submenu: [
        { label: "View Pitch Events", href: "/admin/pitch-events", tabId: "pitch-events-list" },
        { label: "Create Pitch Event", href: "/admin/pitch-events?create=true", tabId: "pitch-events-create" },
      ],
    },
    {
      label: "Startup Applications",
      href: "/admin/startup-applications",
      icon: "fa-solid fa-rocket",
      tabId: "startup-applications",
    },
    {
      label: "Students",
      href: "/admin/students",
      icon: "fa-solid fa-graduation-cap",
      tabId: "students",
    },
    {
      label: "Recruiter Management",
      icon: "fa-solid fa-briefcase",
      tabId: "recruiter-management",
      submenu: [
        { label: "Dashboard", href: "/admin/recruiter-management", tabId: "recruiter-dashboard" },
        { label: "Internships", href: "/admin/recruiter-management/internships", tabId: "recruiter-internships" },
        { label: "Applications", href: "/admin/recruiter-management/applications", tabId: "recruiter-applications" },
        { label: "Recruiter Analytics", href: "/admin/recruiter-management/analytics", tabId: "recruiter-analytics" },
        { label: "Recruiter Profiles", href: "/admin/recruiter-management/profiles", tabId: "recruiter-profiles" },
      ],
    },
    {
      label: "Investor Management",
      icon: "fa-solid fa-hand-holding-dollar",
      tabId: "investor-management",
      submenu: [
        { label: "Dashboard", href: "/admin/investor-management", tabId: "investor-dashboard" },
        { label: "Investor Profiles", href: "/admin/investor-management/profiles", tabId: "investor-profiles" },
        { label: "Startup Interests", href: "/admin/investor-management/interests", tabId: "investor-interests" },
        { label: "Investment Analytics", href: "/admin/investor-management/analytics", tabId: "investor-analytics" },
        { label: "Contact Requests", href: "/admin/investor-management/contacts", tabId: "investor-contacts" },
      ],
    },
    {
      label: "Approval Management",
      icon: "fa-solid fa-user-check",
      tabId: "approval-management",
      submenu: [
        { label: "Dashboard", href: "/admin/approval-management", tabId: "approval-dashboard" },
        { label: "Recruiter Approvals", href: "/admin/approval-management/recruiters", tabId: "approval-recruiters" },
        { label: "Investor Approvals", href: "/admin/approval-management/investors", tabId: "approval-investors" },
        { label: "Pending Requests", href: "/admin/approval-management/pending", tabId: "approval-pending" },
        { label: "Approved Accounts", href: "/admin/approval-management/approved", tabId: "approval-approved" },
        { label: "Rejected Accounts", href: "/admin/approval-management/rejected", tabId: "approval-rejected" },
      ],
    },
    {
      label: "Settings",
      href: "/admin/settings",
      icon: "fa-solid fa-gears",
      tabId: "settings",
    },
  ];

  // Auto-expand active submenus on route change
  useEffect(() => {
    const activeMenu = menuItems.find((item) => {
      if (item.submenu) {
        return item.submenu.some(
          (sub) => pathname === sub.href || (sub.href.includes("?") && pathname === sub.href.split("?")[0])
        );
      }
      return pathname === item.href;
    });

    if (activeMenu && activeMenu.submenu) {
      setOpenMenus((prev) => ({ ...prev, [activeMenu.tabId]: true }));
    }
  }, [pathname]);

  // Click outside listener for profile dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setProfileDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleSubmenu = (tabId: string) => {
    setOpenMenus((prev) => ({ ...prev, [tabId]: !prev[tabId] }));
  };

  const handleAction = (actionName: string) => {
    alert(`${actionName} triggered! (Visual Action Only)`);
    setProfileDropdownOpen(false);
  };

  return (
    <aside className="w-[270px] bg-bg-secondary border-r border-border-color flex flex-col h-screen shrink-0 text-text-primary select-none z-30">
      {/* Brand Logo */}
      <div className="p-6 border-b border-border-color flex items-center justify-between shrink-0">
        <div className="flex flex-col">
          <span className="text-[10px] tracking-[4px] uppercase text-text-muted font-bold">step up</span>
          <span className="text-xl font-extrabold tracking-tight">
            for <span className="text-accent-red">AI;</span>
          </span>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const hasSubmenu = !!item.submenu;
            const isMenuOpen = !!openMenus[item.tabId];
            const isItemActive = item.href ? pathname === item.href : false;
            const isAnySubmenuActive = item.submenu
              ? item.submenu.some((sub) => pathname === sub.href)
              : false;

            return (
              <li key={item.tabId} className="block">
                {hasSubmenu ? (
                  <div>
                    <button
                      onClick={() => toggleSubmenu(item.tabId)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                        isAnySubmenuActive
                          ? "bg-bg-input text-accent-red font-semibold"
                          : "text-text-secondary hover:bg-bg-input/50 hover:text-text-primary"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <i className={`${item.icon} text-base w-5 text-center`}></i>
                        <span>{item.label}</span>
                      </div>
                      <i
                        className={`fa-solid fa-chevron-down text-[10px] transition-transform duration-200 ${
                          isMenuOpen ? "rotate-180" : ""
                        }`}
                      ></i>
                    </button>
                    {isMenuOpen && (
                      <ul className="mt-1 ml-4 pl-4 border-l border-border-color space-y-1">
                        {item.submenu!.map((subItem) => {
                          const isSubActive = pathname === subItem.href;
                          return (
                            <li key={subItem.tabId}>
                              <Link
                                href={subItem.href}
                                className={`block px-3 py-2 rounded-md text-xs transition-all duration-150 ${
                                  isSubActive
                                    ? "text-accent-red font-semibold bg-accent-red/10"
                                    : "text-text-secondary hover:text-text-primary hover:bg-bg-input/30"
                                }`}
                              >
                                {subItem.label}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                ) : (
                  <Link
                    href={item.href || "#"}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isItemActive
                        ? "bg-bg-input text-accent-red font-semibold border-l-2 border-accent-red rounded-l-none"
                        : "text-text-secondary hover:bg-bg-input/50 hover:text-text-primary"
                    }`}
                  >
                    <i className={`${item.icon} text-base w-5 text-center`}></i>
                    <span>{item.label}</span>
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Profile Footer */}
      <div className="p-4 border-t border-border-color shrink-0 relative" ref={dropdownRef}>
        {/* Profile Dropdown Menu */}
        {profileDropdownOpen && (
          <div className="absolute bottom-full left-4 right-4 mb-2 bg-bg-secondary border border-border-color rounded-xl shadow-card p-1.5 flex flex-col gap-1 z-50 glass-panel">
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

        <div
          onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
          className="flex items-center justify-between p-2 rounded-xl hover:bg-bg-input/50 transition-smooth cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-9 h-9 rounded-full bg-accent-red flex items-center justify-center font-bold text-sm text-white">
                A
              </div>
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-accent-green rounded-full border-2 border-bg-secondary"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-white">Admin</span>
              <span className="text-[10px] text-text-secondary">Super Admin</span>
            </div>
          </div>
          <i className="fa-solid fa-chevron-down text-xs text-text-muted"></i>
        </div>
      </div>
    </aside>
  );
}
