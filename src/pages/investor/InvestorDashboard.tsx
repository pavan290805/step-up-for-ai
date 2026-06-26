import { useState, useEffect, useRef } from "react";
import "../../styles/investor-dashboard.css";

interface Startup {
  id: string;
  name: string;
  logoText: string;
  logoBg: string;
  tagline: string;
  description: string;
  sector: string;
  sectorLabel: string;
  stage: string;
  ask: number;
  founder: string;
  email: string;
  linkedin: string;
  submittedDate: string;
  status: string;
}

interface ProfileData {
  name: string;
  org: string;
  bio: string;
  phone: string;
  email: string;
  linkedin: string;
  twitter: string;
  website: string;
  focusSectors: string[];
}

const STARTUP_DATA: Startup[] = [
  {
    id: "apex-ai",
    name: "Apex AI",
    logoText: "AA",
    logoBg: "linear-gradient(135deg, #10b981, #059669)",
    tagline: "Autonomous multi-agent workflows for enterprise operations.",
    description: "Apex AI orchestrates autonomous software agents that integrate with existing company tools, automating complex tasks like data retrieval, analysis, and report generation with minimal human oversight.",
    sector: "ai-ml",
    sectorLabel: "AI / ML",
    stage: "Seed",
    ask: 1500000,
    founder: "Sarah Jenkins",
    email: "sarah@apexai.io",
    linkedin: "https://www.linkedin.com/in/sarah-jenkins-apex",
    submittedDate: "2026-06-16",
    status: "New"
  },
  {
    id: "wealthstream",
    name: "WealthStream",
    logoText: "WS",
    logoBg: "linear-gradient(135deg, #3b82f6, #2563eb)",
    tagline: "Micro-investing and financial wellness for gig-economy workers.",
    description: "WealthStream integrates directly with gig-platforms to automatically round up earnings into diversified portfolios, offering tailored retirement and insurance options for contract workers.",
    sector: "fintech",
    sectorLabel: "Fintech",
    stage: "Pre-seed",
    ask: 500000,
    founder: "David Chen",
    email: "d.chen@wealthstream.com",
    linkedin: "https://www.linkedin.com/in/david-chen-wealthstream",
    submittedDate: "2026-06-14",
    status: "Under Review"
  },
  {
    id: "bioscribe",
    name: "BioScribe",
    logoText: "BS",
    logoBg: "linear-gradient(135deg, #8b5cf6, #7c3aed)",
    tagline: "AI medical scribe translating patient-doctor dialogue into notes.",
    description: "BioScribe uses clinical-grade voice recognition to transcribe patient consultations, auto-generate EHR-compliant reports, and reduce doctor administrative workloads by 70%.",
    sector: "healthtech",
    sectorLabel: "Healthtech",
    stage: "Series A",
    ask: 4000000,
    founder: "Dr. Amanda Ross",
    email: "amanda@bioscribe.health",
    linkedin: "https://www.linkedin.com/in/amanda-ross-bioscribe",
    submittedDate: "2026-06-10",
    status: "Shortlisted"
  },
  {
    id: "solarloop",
    name: "SolarLoop",
    logoText: "SL",
    logoBg: "linear-gradient(135deg, #f59e0b, #d97706)",
    tagline: "Decentralized community solar grid optimization software.",
    description: "SolarLoop enables peer-to-peer clean energy sharing by automating micro-transactions between local solar producers and energy consumers using smart grid algorithms.",
    sector: "climate",
    sectorLabel: "Climate Tech",
    stage: "Series B+",
    ask: 12000000,
    founder: "Marcus Vance",
    email: "marcus@solarloop.net",
    linkedin: "https://www.linkedin.com/in/marcus-vance-solarloop",
    submittedDate: "2026-06-17",
    status: "New"
  },
  {
    id: "learnsphere",
    name: "LearnSphere",
    logoText: "LS",
    logoBg: "linear-gradient(135deg, #ec4899, #db2777)",
    tagline: "Adaptive gamified math curriculums for primary schools.",
    description: "LearnSphere's diagnostic engine customizes educational pathways in real time, leveraging gaming dynamics to double student math comprehension and retention rates.",
    sector: "edtech",
    sectorLabel: "Edtech",
    stage: "Seed",
    ask: 800000,
    founder: "Elena Rostova",
    email: "elena@learnsphere.org",
    linkedin: "https://www.linkedin.com/in/elena-rostova-learnsphere",
    submittedDate: "2026-06-08",
    status: "Under Review"
  },
  {
    id: "neurocare",
    name: "NeuroCare",
    logoText: "NC",
    logoBg: "linear-gradient(135deg, #14b8a6, #0d9488)",
    tagline: "Non-invasive neuro-stimulation headband for sleep optimization.",
    description: "NeuroCare combines sleep-tracking sensors with low-frequency neural pulses to increase deep sleep duration, helping busy professionals recover faster with fewer hours of sleep.",
    sector: "healthtech",
    sectorLabel: "Healthtech",
    stage: "Seed",
    ask: 1250000,
    founder: "Kenji Takahashi",
    email: "kenji@neurocare.io",
    linkedin: "https://www.linkedin.com/in/kenji-takahashi-neurocare",
    submittedDate: "2026-06-15",
    status: "New"
  },
  {
    id: "paychain",
    name: "PayChain",
    logoText: "PC",
    logoBg: "linear-gradient(135deg, #06b6d4, #0891b2)",
    tagline: "Instant global settlement API for cross-border e-commerce.",
    description: "PayChain aggregates local payment methods and blockchain settlements to offer instant, friction-free transactions for international merchants at 90% lower fees.",
    sector: "fintech",
    sectorLabel: "Fintech",
    stage: "Series A",
    ask: 3500000,
    founder: "Sofia Moreno",
    email: "s.moreno@paychain.dev",
    linkedin: "https://www.linkedin.com/in/sofia-moreno-paychain",
    submittedDate: "2026-06-01",
    status: "Under Review"
  },
  {
    id: "ecopack",
    name: "EcoPack Labs",
    logoText: "EP",
    logoBg: "linear-gradient(135deg, #84cc16, #65a30d)",
    tagline: "Water-soluble seaweed packaging replacing single-use plastics.",
    description: "EcoPack Labs manufactures zero-waste, marine-safe packaging materials for food and cosmetics brands that dissolve naturally in water within minutes.",
    sector: "climate",
    sectorLabel: "Climate Tech",
    stage: "Pre-seed",
    ask: 450000,
    founder: "Liam O'Connor",
    email: "liam@ecopacklabs.co",
    linkedin: "https://www.linkedin.com/in/liam-oconnor-ecopack",
    submittedDate: "2026-06-12",
    status: "Shortlisted"
  },
  {
    id: "promptcraft",
    name: "PromptCraft",
    logoText: "PC",
    logoBg: "linear-gradient(135deg, #6366f1, #4f46e5)",
    tagline: "Enterprise prompt engineering registry and testing suite.",
    description: "PromptCraft helps development teams version control, benchmark, and secure prompts for LLM applications, reducing API costs and model output regressions.",
    sector: "ai-ml",
    sectorLabel: "AI / ML",
    stage: "Seed",
    ask: 750000,
    founder: "Michael Chang",
    email: "michael@promptcraft.ai",
    linkedin: "https://www.linkedin.com/in/michael-chang-promptcraft",
    submittedDate: "2026-06-18",
    status: "New"
  },
  {
    id: "saasify",
    name: "SaaSify",
    logoText: "SF",
    logoBg: "linear-gradient(135deg, #f43f5e, #e11d48)",
    tagline: "No-code customer portal creator for legacy enterprise software.",
    description: "SaaSify hooks into old databases and mainframe APIs to output sleek, customer-facing web and mobile applications in a drag-and-drop builder.",
    sector: "saas",
    sectorLabel: "SaaS",
    stage: "Series A",
    ask: 2800000,
    founder: "Emma Watson",
    email: "emma@saasify.io",
    linkedin: "https://www.linkedin.com/in/emma-watson-saasify",
    submittedDate: "2026-05-28",
    status: "Under Review"
  }
];

const SECTORS = [
  { value: "fintech", label: "Fintech" },
  { value: "healthtech", label: "Healthtech" },
  { value: "climate", label: "Climate Tech" },
  { value: "edtech", label: "Edtech" },
  { value: "ai-ml", label: "AI / ML" },
  { value: "saas", label: "SaaS" }
];

interface Toast {
  id: number;
  message: string;
  type: "success" | "info" | "error";
}

export default function InvestorDashboard() {
  const [isMounted, setIsMounted] = useState(false);
  const [allPitches, setAllPitches] = useState<Startup[]>(STARTUP_DATA);
  const [shortlistedIds, setShortlistedIds] = useState<string[]>([]);
  const [activePanel, setActivePanel] = useState<string>("pitch-decks");

  // Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [sectorFilter, setSectorFilter] = useState("all");
  const [stageFilter, setStageFilter] = useState("all");
  const [shortlistFilter, setShortlistFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");

  // Profile State
  const [profileData, setProfileData] = useState<ProfileData>({
    name: "Thanvik Reddy",
    org: "Thanvik Ventures",
    bio: "Focused on early-stage investments in artificial intelligence, climate technology, and SaaS solutions. Supporting visionary founders from Seed to Series A.",
    phone: "+91 83410 11206",
    email: "thanvikreddy2@gmail.com",
    linkedin: "https://linkedin.com/in/thanvik-reddy",
    twitter: "https://x.com/thanvik_reddy",
    website: "https://thanvikventures.com",
    focusSectors: ["ai-ml", "climate", "saas"]
  });
  const [profilePicData, setProfilePicData] = useState<string | null>(null);
  const [isProfileEditing, setIsProfileEditing] = useState(false);

  // Form states
  const [tempProfileName, setTempProfileName] = useState("");
  const [tempProfileOrg, setTempProfileOrg] = useState("");
  const [tempProfileBio, setTempProfileBio] = useState("");
  const [tempProfilePhone, setTempProfilePhone] = useState("");
  const [tempProfileLinkedin, setTempProfileLinkedin] = useState("");
  const [tempProfileTwitter, setTempProfileTwitter] = useState("");
  const [tempProfileWebsite, setTempProfileWebsite] = useState("");
  const [tempFocusSectors, setTempFocusSectors] = useState<string[]>([]);

  // Password setting state
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Support message state
  const [supportSubject, setSupportSubject] = useState("");
  const [supportMessage, setSupportMessage] = useState("");

  // Modal State
  const [selectedStartup, setSelectedStartup] = useState<Startup | null>(null);
  const [modalMode, setModalMode] = useState<"pitch" | "contact">("pitch");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Toasts State
  const [toasts, setToasts] = useState<Toast[]>([]);
  const nextToastId = useRef(0);

  // Sidebar Mobile State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    setIsMounted(true);

    const savedShortlist = localStorage.getItem("stepup_shortlist");
    if (savedShortlist) {
      setShortlistedIds(JSON.parse(savedShortlist));
    } else {
      const defaultShortlist = STARTUP_DATA.filter(s => s.status === "Shortlisted").map(s => s.id);
      setShortlistedIds(defaultShortlist);
      localStorage.setItem("stepup_shortlist", JSON.stringify(defaultShortlist));
    }

    const savedProfile = localStorage.getItem("stepup_profile_data");
    if (savedProfile) {
      setProfileData(JSON.parse(savedProfile));
    }

    const savedPic = localStorage.getItem("stepup_profile_pic");
    if (savedPic) {
      setProfilePicData(savedPic);
    }

    const studentPitches = localStorage.getItem("stepup_student_pitches");
    if (studentPitches) {
      setAllPitches([...JSON.parse(studentPitches), ...STARTUP_DATA]);
    }
  }, []);

  // Form submission handler helpers
  const showToast = (message: string, type: "success" | "info" | "error" = "success") => {
    const id = nextToastId.current++;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const toggleShortlist = (id: string) => {
    const newShortlist = shortlistedIds.includes(id)
      ? shortlistedIds.filter(item => item !== id)
      : [...shortlistedIds, id];

    setShortlistedIds(newShortlist);
    localStorage.setItem("stepup_shortlist", JSON.stringify(newShortlist));
    showToast(shortlistedIds.includes(id) ? "Removed from Shortlist." : "Added to Shortlist!", shortlistedIds.includes(id) ? "info" : "success");
  };

  // Profile Edit Toggle
  const startEditingProfile = () => {
    setTempProfileName(profileData.name);
    setTempProfileOrg(profileData.org);
    setTempProfileBio(profileData.bio);
    setTempProfilePhone(profileData.phone);
    setTempProfileLinkedin(profileData.linkedin);
    setTempProfileTwitter(profileData.twitter);
    setTempProfileWebsite(profileData.website);
    setTempFocusSectors([...profileData.focusSectors]);
    setIsProfileEditing(true);
  };

  const cancelEditingProfile = () => {
    setIsProfileEditing(false);
  };

  const saveProfileData = () => {
    const updatedProfile: ProfileData = {
      name: tempProfileName.trim() || profileData.name,
      org: tempProfileOrg.trim() || profileData.org,
      bio: tempProfileBio.trim(),
      phone: tempProfilePhone.trim(),
      email: profileData.email,
      linkedin: tempProfileLinkedin.trim(),
      twitter: tempProfileTwitter.trim(),
      website: tempProfileWebsite.trim(),
      focusSectors: tempFocusSectors
    };
    setProfileData(updatedProfile);
    localStorage.setItem("stepup_profile_data", JSON.stringify(updatedProfile));
    setIsProfileEditing(false);
    showToast("Profile updated successfully!");
  };

  const toggleTempFocusSector = (sector: string) => {
    if (tempFocusSectors.includes(sector)) {
      setTempFocusSectors(tempFocusSectors.filter(s => s !== sector));
    } else {
      setTempFocusSectors([...tempFocusSectors, sector]);
    }
  };

  const handleProfilePicUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        setProfilePicData(dataUrl);
        localStorage.setItem("stepup_profile_pic", dataUrl);
        showToast("Profile picture uploaded successfully!");
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showToast("Passwords do not match!", "error");
      return;
    }
    showToast("Password updated successfully!");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleSupportMessageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = `Hello StepUp Team,\n\nName: ${profileData.name}\nSubject: ${supportSubject}\nMessage: ${supportMessage}`;
    const whatsappUrl = `https://api.whatsapp.com/send?phone=918341011206&text=${encodeURIComponent(text)}`;
    showToast("Opening WhatsApp...");
    window.open(whatsappUrl, "_blank");
    setSupportSubject("");
    setSupportMessage("");
  };

  // Pitch filtration and rendering calculation
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(word => word[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const isNewThisWeek = (dateString: string) => {
    const submitted = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - submitted.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7;
  };

  const formatAskAmount = (amount: number) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(1).replace(/\.0$/, "")} Cr`;
    }
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1).replace(/\.0$/, "")} L`;
    }
    return `₹${amount.toLocaleString("en-IN")}`;
  };

  // Filtered dataset
  const getFilteredPitches = () => {
    let result = [...allPitches];

    // Search query filter
    if (searchQuery.trim() !== "") {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        s =>
          s.name.toLowerCase().includes(query) ||
          s.tagline.toLowerCase().includes(query) ||
          s.founder.toLowerCase().includes(query) ||
          s.description.toLowerCase().includes(query)
      );
    }

    // Sector filter
    if (sectorFilter !== "all") {
      result = result.filter(s => s.sector === sectorFilter);
    }

    // Stage filter
    if (stageFilter !== "all") {
      result = result.filter(s => s.stage === stageFilter);
    }

    // Shortlisted filter
    if (shortlistFilter === "shortlisted") {
      result = result.filter(s => shortlistedIds.includes(s.id));
    }

    // Sorting
    result.sort((a, b) => {
      if (sortOrder === "newest") {
        return new Date(b.submittedDate).getTime() - new Date(a.submittedDate).getTime();
      } else if (sortOrder === "oldest") {
        return new Date(a.submittedDate).getTime() - new Date(b.submittedDate).getTime();
      } else if (sortOrder === "highest-ask") {
        return b.ask - a.ask;
      } else if (sortOrder === "lowest-ask") {
        return a.ask - b.ask;
      }
      return 0;
    });

    return result;
  };

  const clearAllFilters = () => {
    setSearchQuery("");
    setSectorFilter("all");
    setStageFilter("all");
    setShortlistFilter("all");
    setSortOrder("newest");
  };

  const filteredPitches = getFilteredPitches();

  // Modal controllers
  const openPitchModal = (startup: Startup, mode: "pitch" | "contact") => {
    setSelectedStartup(startup);
    setModalMode(mode);
    setIsModalOpen(true);
  };

  const closePitchModal = () => {
    setIsModalOpen(false);
    setSelectedStartup(null);
  };

  if (!isMounted) {
    return (
      <div className="loading-screen" style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", background: "#030712", color: "#2fbf64" }}>
        <h3>Loading StepUp Dashboard...</h3>
      </div>
    );
  }

  // Calculate dynamic stats
  const totalPitchesCount = allPitches.length;
  const newPitchesCount = allPitches.filter(s => isNewThisWeek(s.submittedDate)).length;
  const shortlistedPitchesCount = shortlistedIds.length;

  return (
    <div className="app-container">
      {/* Mobile Sidebar Backdrop Overlay */}
      <div className={`sidebar-overlay ${isSidebarOpen ? "open" : ""}`} onClick={() => setIsSidebarOpen(false)}></div>

      {/* SIDEBAR */}
      <aside className={`sidebar ${isSidebarOpen ? "open" : ""}`} id="sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <i className="fa-solid fa-chart-line logo-icon"></i>
            <span className="logo-text">StepUp <span className="logo-accent">for AI</span></span>
          </div>
          <button className="btn-close-sidebar" onClick={() => setIsSidebarOpen(false)} aria-label="Close Sidebar">
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        <nav className="sidebar-nav">
          <ul>
            <li>
              <button className={`nav-item ${activePanel === "pitch-decks" ? "active" : ""}`} onClick={() => { setActivePanel("pitch-decks"); setIsSidebarOpen(false); }}>
                <i className="fa-solid fa-briefcase"></i>
                <span>Pitch Decks</span>
              </button>
            </li>
            <li>
              <button className={`nav-item ${activePanel === "profile" ? "active" : ""}`} onClick={() => { setActivePanel("profile"); setIsSidebarOpen(false); }}>
                <i className="fa-solid fa-user-tie"></i>
                <span>Investor Profile</span>
              </button>
            </li>

          </ul>
        </nav>

        <div className="sidebar-footer">
          <div className="user-profile-sm">
            <div className="avatar-sm" style={profilePicData ? { backgroundImage: `url(${profilePicData})` } : undefined}>
              {!profilePicData && getInitials(profileData.name)}
            </div>
            <div className="user-info-sm">
              <h4 className="user-name">{profileData.name}</h4>
              <span className="user-role">Vetted Investor</span>
            </div>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="main-content">
        {/* TOPBAR */}
        <header className="topbar">
          <div className="topbar-left">
            <button className="btn-hamburger" onClick={() => setIsSidebarOpen(true)} aria-label="Open Sidebar">
              <i className="fa-solid fa-bars"></i>
            </button>
            <h1 className="panel-title" id="panelTitle">
              {activePanel === "pitch-decks" && "Pitch Decks"}
              {activePanel === "profile" && "Investor Profile"}
            </h1>
          </div>

          <div className="topbar-right">
            <div className="investor-badge">
              <i className="fa-solid fa-circle-check"></i>
              <span>Verified Investor</span>
            </div>
            <button
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }}
              className="btn-logout"
              style={{ background: "transparent", cursor: "pointer", fontFamily: "inherit" }}
              aria-label="Logout"
            >
              <i className="fa-solid fa-right-from-bracket"></i>
              <span>Logout</span>
            </button>
          </div>
        </header>

        {/* PANELS CONTAINER */}
        <main className="panels-container">
          {/* PANEL 1: PITCH DECKS */}
          {activePanel === "pitch-decks" && (
            <section id="panel-pitch-decks" className="dashboard-panel active">
              {/* Summary Strip */}
              <div className="summary-strip">
                <div className="stat-card glass-card">
                  <div className="stat-icon-wrapper text-green">
                    <i className="fa-solid fa-folder-open"></i>
                  </div>
                  <div className="stat-info">
                     <h3 id="stat-total-pitches">{totalPitchesCount}</h3>
                    <p>Total Pitches</p>
                  </div>
                </div>
                <div className="stat-card glass-card">
                  <div className="stat-icon-wrapper text-gold">
                    <i className="fa-solid fa-fire-flame-curved"></i>
                  </div>
                  <div className="stat-info">
                    <h3 id="stat-new-pitches">{newPitchesCount}</h3>
                    <p>New This Week</p>
                  </div>
                </div>
                <div className="stat-card glass-card">
                  <div className="stat-icon-wrapper text-blue">
                    <i className="fa-solid fa-bookmark"></i>
                  </div>
                  <div className="stat-info">
                    <h3 id="stat-shortlisted-pitches">{shortlistedPitchesCount}</h3>
                    <p>Your Shortlist</p>
                  </div>
                </div>
              </div>

              {/* Filter Bar */}
              <div className="filter-bar glass-card">
                <div className="filter-input-group search-group">
                  <i className="fa-solid fa-magnifying-glass search-icon"></i>
                  <input type="text" id="searchBar" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search startups..." aria-label="Search startups" />
                </div>
                
                <div className="filter-input-group">
                  <select id="sectorFilter" value={sectorFilter} onChange={(e) => setSectorFilter(e.target.value)} aria-label="Filter by Sector">
                    <option value="all">All Sectors</option>
                    <option value="fintech">Fintech</option>
                    <option value="healthtech">Healthtech</option>
                    <option value="climate">Climate Tech</option>
                    <option value="edtech">Edtech</option>
                    <option value="ai-ml">AI / ML</option>
                    <option value="saas">SaaS</option>
                  </select>
                </div>
                
                <div className="filter-input-group">
                  <select id="stageFilter" value={stageFilter} onChange={(e) => setStageFilter(e.target.value)} aria-label="Filter by Funding Stage">
                    <option value="all">All Stages</option>
                    <option value="Pre-seed">Pre-seed</option>
                    <option value="Seed">Seed</option>
                    <option value="Series A">Series A</option>
                    <option value="Series B+">Series B+</option>
                  </select>
                </div>
                
                <div className="filter-input-group">
                  <select id="shortlistFilter" value={shortlistFilter} onChange={(e) => setShortlistFilter(e.target.value)} aria-label="Filter by Shortlist">
                    <option value="all">All Pitches</option>
                    <option value="shortlisted">Shortlisted Only</option>
                  </select>
                </div>
                
                <div className="filter-input-group">
                  <select id="sortOrder" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} aria-label="Sort Pitches">
                    <option value="newest">Newest Submitted</option>
                    <option value="oldest">Oldest Submitted</option>
                    <option value="highest-ask">Highest Ask</option>
                    <option value="lowest-ask">Lowest Ask</option>
                  </select>
                </div>

                <div className="filter-actions">
                  <span className="results-count" id="resultsCount">{filteredPitches.length} Results</span>
                  <button className="btn-clear-filters" onClick={clearAllFilters} id="btnClearFilters">Clear All</button>
                </div>
              </div>

              {/* Pitch Card Grid */}
              <div className="pitch-grid" id="pitchGrid">
                {filteredPitches.map(startup => {
                  const isShortlisted = shortlistedIds.includes(startup.id);

                  let displayStatus = startup.status;
                  if (isShortlisted) {
                    displayStatus = "Shortlisted";
                  } else if (startup.status === "Shortlisted") {
                    displayStatus = "Under Review";
                  }

                  let badgeClass = "new";
                  if (displayStatus === "Under Review") badgeClass = "review";
                  if (displayStatus === "Shortlisted") badgeClass = "shortlisted";

                  return (
                    <article className="pitch-card glass-card" key={startup.id} tabIndex={0} aria-label={`${startup.name} startup card. Sector: ${startup.sectorLabel}. Stage: ${startup.stage}. Funding Ask: ${formatAskAmount(startup.ask)}`}>
                      <div className="card-main-info">
                        <div className="card-title-row">
                          <h3>{startup.name}</h3>
                          <span className={`status-badge ${badgeClass}`}>{displayStatus}</span>
                        </div>
                        <p className="card-tagline">{startup.tagline}</p>
                        <div className="card-tags">
                          <span className="tag">{startup.sectorLabel}</span>
                          <span className="tag">{startup.stage}</span>
                        </div>
                      </div>

                      <div className="card-metrics-col">
                        <div className="metric-label">Funding Ask</div>
                        <div className="metric-value">{formatAskAmount(startup.ask)}</div>
                        <span className="submission-date">Submitted: {startup.submittedDate}</span>
                      </div>

                      <div className="card-actions-col">
                        <div className="card-checkboxes">
                          <label className="custom-checkbox">
                            <input type="checkbox" className="cb-view-pitch" checked={selectedStartup?.id === startup.id && modalMode === "pitch" && isModalOpen} onChange={(e) => { if (e.target.checked) openPitchModal(startup, "pitch"); else closePitchModal(); }} aria-label="Check to view full pitch details" />
                            <span className="checkbox-box"><i className="fa-solid fa-check"></i></span>
                            <span className="checkbox-label">View Pitch</span>
                          </label>
                          <label className="custom-checkbox">
                            <input type="checkbox" className="cb-view-contact" checked={selectedStartup?.id === startup.id && modalMode === "contact" && isModalOpen} onChange={(e) => { if (e.target.checked) openPitchModal(startup, "contact"); else closePitchModal(); }} aria-label="Check to view owner contact details" />
                            <span className="checkbox-box"><i className="fa-solid fa-check"></i></span>
                            <span className="checkbox-label">Contact Details</span>
                          </label>
                        </div>
                        
                        <div className="card-footer-actions">
                          <button className={`bookmark-btn ${isShortlisted ? "active" : ""}`} onClick={() => toggleShortlist(startup.id)} aria-label={isShortlisted ? "Remove from shortlist" : "Add to shortlist"} title={isShortlisted ? "Remove from Shortlist" : "Add to Shortlist"}>
                            <i className={`fa-${isShortlisted ? "solid" : "regular"} fa-bookmark`}></i>
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>

              {/* Empty State */}
              {filteredPitches.length === 0 && (
                <div className="empty-state" id="emptyState">
                  <i className="fa-solid fa-folder-open empty-icon"></i>
                  <h3>No startups match your search</h3>
                  <p>Try clearing some filters or searching for something else.</p>
                  <button className="btn btn-secondary" onClick={clearAllFilters} id="emptyStateReset">Clear Filters</button>
                </div>
              )}
            </section>
          )}

          {/* PANEL 2: INVESTOR PROFILE */}
          {activePanel === "profile" && (
            <section id="panel-profile" className="dashboard-panel active">
              <div className="profile-layout">
                {/* Left Column: Profile Card & Bio */}
                <div className="profile-main-col">
                  {/* Profile Header Card */}
                  <div className={`profile-card glass-card ${isProfileEditing ? "edit-mode" : ""}`}>
                    <div className="profile-card-header">
                      <div className="profile-avatar-container">
                        <div className="profile-avatar-lg" id="profileAvatar" style={profilePicData ? { backgroundImage: `url(${profilePicData})` } : undefined}>
                          {!profilePicData && getInitials(profileData.name)}
                        </div>
                        <label htmlFor="profilePicUpload" className="avatar-upload-overlay" id="avatarUploadOverlay" title="Upload profile picture">
                          <i className="fa-solid fa-camera"></i>
                          <input type="file" id="profilePicUpload" onChange={handleProfilePicUpload} accept="image/*" style={{ display: "none" }} />
                        </label>
                      </div>
                      <div className="profile-headline">
                        <div className="profile-name-row">
                          {isProfileEditing ? (
                            <input type="text" id="profileNameInput" value={tempProfileName} onChange={(e) => setTempProfileName(e.target.value)} className="inline-input-header profile-name-input" />
                          ) : (
                            <input type="text" id="profileNameInput" value={profileData.name} readOnly className="inline-input-header profile-name-input" />
                          )}
                          <span className="investor-badge">
                            <i className="fa-solid fa-circle-check"></i> Verified
                          </span>
                        </div>
                        {isProfileEditing ? (
                          <input type="text" id="profileOrgInput" value={tempProfileOrg} onChange={(e) => setTempProfileOrg(e.target.value)} className="inline-input-header profile-org-input" />
                        ) : (
                          <input type="text" id="profileOrgInput" value={profileData.org} readOnly className="inline-input-header profile-org-input" />
                        )}
                        <p className="profile-role">Managing Partner</p>
                      </div>
                      <div className="profile-header-actions" style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                        {isProfileEditing && (
                          <button className="btn btn-primary" id="btnSaveProfileHeader" onClick={saveProfileData} aria-label="Save Changes">
                            <i className="fa-solid fa-check"></i>
                            <span>Save</span>
                          </button>
                        )}
                        <button className="btn btn-secondary btn-edit-profile" id="btnEditProfile" onClick={isProfileEditing ? cancelEditingProfile : startEditingProfile} aria-label={isProfileEditing ? "Cancel" : "Edit Profile"}>
                          <i className={`fa-solid ${isProfileEditing ? "fa-xmark" : "fa-pen-to-square"}`}></i>
                          <span>{isProfileEditing ? "Cancel" : "Edit Profile"}</span>
                        </button>
                      </div>
                    </div>
                    
                    <div className="profile-card-body">
                      <div className="form-group">
                        <label htmlFor="profileBioInput">Professional Bio</label>
                        {isProfileEditing ? (
                          <textarea id="profileBioInput" value={tempProfileBio} onChange={(e) => setTempProfileBio(e.target.value)} rows={4}></textarea>
                        ) : (
                          <textarea id="profileBioInput" value={profileData.bio} readOnly rows={4}></textarea>
                        )}
                      </div>

                      <div className="form-group">
                        <label>Investment Focus</label>
                        {!isProfileEditing ? (
                          <div className="focus-chips" id="focusChipsContainer">
                            {profileData.focusSectors.map(sec => {
                              const sObj = SECTORS.find(s => s.value === sec);
                              return (
                                <span className="chip" key={sec}>{sObj ? sObj.label : sec}</span>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="chip-edit-wrapper" id="chipEditWrapper">
                            <p className="field-help">Click to toggle investment sectors:</p>
                            <div className="focus-chips-selector" id="focusChipsSelector">
                              {SECTORS.map(sec => {
                                const isActive = tempFocusSectors.includes(sec.value);
                                return (
                                  <span className={`selectable-chip ${isActive ? "active" : ""}`} key={sec.value} onClick={() => toggleTempFocusSector(sec.value)}>
                                    {sec.label}
                                  </span>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Security Settings */}
                  <div className="security-card glass-card">
                    <h3>Security Settings</h3>
                    <p className="card-subtitle">Manage your credentials</p>
                    <form id="changePasswordForm" onSubmit={handlePasswordSubmit} className="password-form">
                      <div className="form-grid">
                        <div className="form-group">
                          <label htmlFor="currentPassword">Current Password</label>
                          <input type="password" id="currentPassword" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} required placeholder="••••••••" />
                        </div>
                        <div className="form-group">
                          <label htmlFor="newPassword">New Password</label>
                          <input type="password" id="newPassword" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required placeholder="••••••••" />
                        </div>
                        <div className="form-group">
                          <label htmlFor="confirmPassword">Confirm New Password</label>
                          <input type="password" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required placeholder="••••••••" />
                        </div>
                      </div>
                      <div className="form-actions-row">
                        <button type="submit" className="btn btn-primary btn-save-password">
                          <i className="fa-solid fa-key"></i>
                          Update Password
                        </button>
                      </div>
                    </form>
                  </div>
                </div>

                {/* Right Column: Stats & Contact Info */}
                <div className="profile-sidebar-col">
                  {/* Stats */}
                  <div className="profile-stats-card glass-card">
                    <h3>Vetted Activity</h3>
                    <div className="profile-stats-grid">
                      <div className="profile-stat-box">
                        <span className="stat-number" id="profile-stat-vetted">{totalPitchesCount}</span>
                        <span className="stat-label">Total Vetted</span>
                      </div>
                      <div className="profile-stat-box">
                        <span className="stat-number" id="profile-stat-shortlist">{shortlistedPitchesCount}</span>
                        <span className="stat-label">Shortlisted</span>
                      </div>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className={`profile-contact-card glass-card ${isProfileEditing ? "edit-mode" : ""}`}>
                    <h3>Contact Information</h3>
                    <div className="contact-details-list">
                      <div className="contact-detail-item">
                        <div className="detail-icon"><i className="fa-solid fa-envelope"></i></div>
                        <div className="detail-info">
                          <span className="detail-label">Email (Issued by Admin)</span>
                          <span className="detail-val" id="profileEmail">{profileData.email}</span>
                        </div>
                      </div>
                      <div className="contact-detail-item">
                        <div className="detail-icon"><i className="fa-solid fa-phone"></i></div>
                        <div className="detail-info">
                          <span className="detail-label">Phone Number</span>
                          {isProfileEditing ? (
                            <input type="tel" id="profilePhoneInput" value={tempProfilePhone} onChange={(e) => setTempProfilePhone(e.target.value)} className="inline-input" />
                          ) : (
                            <input type="tel" id="profilePhoneInput" value={profileData.phone} readOnly className="inline-input" />
                          )}
                        </div>
                      </div>
                      <div className="contact-detail-item">
                        <div className="detail-icon"><i className="fa-brands fa-linkedin"></i></div>
                        <div className="detail-info">
                          <span className="detail-label">LinkedIn Link</span>
                          {isProfileEditing ? (
                            <input type="url" id="profileLinkedinInput" value={tempProfileLinkedin} onChange={(e) => setTempProfileLinkedin(e.target.value)} className="inline-input" />
                          ) : (
                            <input type="url" id="profileLinkedinInput" value={profileData.linkedin} readOnly className="inline-input" />
                          )}
                        </div>
                      </div>
                      <div className="contact-detail-item">
                        <div className="detail-icon"><i className="fa-brands fa-x-twitter"></i></div>
                        <div className="detail-info">
                          <span className="detail-label">Twitter / X Link</span>
                          {isProfileEditing ? (
                            <input type="url" id="profileTwitterInput" value={tempProfileTwitter} onChange={(e) => setTempProfileTwitter(e.target.value)} className="inline-input" />
                          ) : (
                            <input type="url" id="profileTwitterInput" value={profileData.twitter} readOnly className="inline-input" />
                          )}
                        </div>
                      </div>
                      <div className="contact-detail-item">
                        <div className="detail-icon"><i className="fa-solid fa-globe"></i></div>
                        <div className="detail-info">
                          <span className="detail-label">Website / Fund Link</span>
                          {isProfileEditing ? (
                            <input type="url" id="profileWebsiteInput" value={tempProfileWebsite} onChange={(e) => setTempProfileWebsite(e.target.value)} className="inline-input" />
                          ) : (
                            <input type="url" id="profileWebsiteInput" value={profileData.website} readOnly className="inline-input" />
                          )}
                        </div>
                      </div>
                    </div>
                    {isProfileEditing && (
                      <div className="profile-save-row" id="profileSaveRow">
                        <button className="btn btn-primary" id="btnSaveProfile" onClick={saveProfileData}>
                          <i className="fa-solid fa-check"></i> Save Changes
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>
          )}


        </main>
      </div>

      {/* Pitch Detail Modal */}
      <div className={`modal-backdrop ${isModalOpen ? "open" : ""}`} role="dialog" aria-modal="true" aria-hidden={!isModalOpen} onClick={closePitchModal}>
        {selectedStartup && (
          <div className="modal glass-card" onClick={(e) => e.stopPropagation()}>
            <button className="btn-close-modal" onClick={closePitchModal} aria-label="Close Modal">
              <i className="fa-solid fa-xmark"></i>
            </button>
            <div className="modal-content">
              {modalMode === "pitch" ? (
                <>
                  <div className="modal-header-section">
                    <div className="modal-brand">
                      <div className="modal-title">
                        <h2>{selectedStartup.name}</h2>
                        <div className="modal-meta-tags">
                          <span className="tag">{selectedStartup.sectorLabel}</span>
                          <span className="tag">{selectedStartup.stage}</span>
                          <span className={`status-badge ${
                            shortlistedIds.includes(selectedStartup.id)
                              ? "shortlisted"
                              : selectedStartup.status === "Shortlisted"
                              ? "review"
                              : selectedStartup.status === "Under Review"
                              ? "review"
                              : "new"
                          }`}>
                            {shortlistedIds.includes(selectedStartup.id)
                              ? "Shortlisted"
                              : selectedStartup.status === "Shortlisted"
                              ? "Under Review"
                              : selectedStartup.status}
                          </span>
                        </div>
                        <p className="modal-tagline">{selectedStartup.tagline}</p>
                      </div>
                    </div>
                  </div>

                  <div className="modal-body-section">
                    <h3 className="modal-section-title">Startup Pitch</h3>
                    <p className="modal-description">{selectedStartup.description}</p>
                  </div>

                  <div className="modal-metrics-section">
                    <div className="modal-metric-card">
                      <h4>Funding Ask</h4>
                      <p className="accent-val">{formatAskAmount(selectedStartup.ask)}</p>
                    </div>
                    <div className="modal-metric-card">
                      <h4>Submitted Date</h4>
                      <p>{selectedStartup.submittedDate}</p>
                    </div>
                  </div>

                  <div className="modal-founder-section">
                    <h3 className="modal-section-title">Founder Contact Summary</h3>
                    <div className="founder-profile">
                      <div className="founder-info">
                        <h4>{selectedStartup.founder}</h4>
                        <p>Founder & CEO, {selectedStartup.name}</p>
                      </div>
                      <div className="founder-contact-links">
                        <a href={`mailto:${selectedStartup.email}`} className="founder-btn" title="Email founder">
                          <i className="fa-solid fa-envelope"></i>
                          <span>Email</span>
                        </a>
                        <a href={selectedStartup.linkedin} target="_blank" rel="noopener noreferrer" className="founder-btn linkedin-btn" title="Founder LinkedIn">
                          <i className="fa-brands fa-linkedin"></i>
                          <span>LinkedIn</span>
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="modal-footer-section">
                    <button className="btn btn-secondary modal-bookmark-btn" onClick={() => toggleShortlist(selectedStartup.id)}>
                      <i className={`fa-${shortlistedIds.includes(selectedStartup.id) ? "solid" : "regular"} fa-bookmark`}></i>
                      <span>{shortlistedIds.includes(selectedStartup.id) ? "Shortlisted" : "Shortlist Pitch"}</span>
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="modal-header-section">
                    <div className="modal-brand">
                      <div className="modal-title">
                        <h2>{selectedStartup.name} Contact Details</h2>
                        <div className="modal-meta-tags">
                          <span className="tag">{selectedStartup.sectorLabel}</span>
                          <span className="tag">{selectedStartup.stage}</span>
                        </div>
                        <p className="modal-tagline">Connect directly with the pitch owner</p>
                      </div>
                    </div>
                  </div>

                  <div className="modal-founder-section" style={{ background: "rgba(47, 191, 100, 0.05)", borderColor: "rgba(47, 191, 100, 0.17)", marginTop: "10px" }}>
                    <h3 className="modal-section-title">Pitch Owner / Founder</h3>
                    <div className="founder-profile" style={{ flexDirection: "column", alignItems: "flex-start", gap: "16px" }}>
                      <div className="founder-info">
                        <h4>{selectedStartup.founder}</h4>
                        <p>Founder & CEO, {selectedStartup.name}</p>
                      </div>
                      
                      <div className="contact-details-list" style={{ width: "100%", marginTop: "10px", display: "flex", flexDirection: "column", gap: "12px" }}>
                        <div className="contact-detail-item" style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                          <div className="detail-icon" style={{ width: "38px", height: "38px", borderRadius: "50%", backgroundColor: "rgba(255, 255, 255, 0.03)", border: "1px solid var(--border-color)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.95rem", color: "var(--accent)" }}><i className="fa-solid fa-envelope"></i></div>
                          <div className="detail-info" style={{ display: "flex", flexDirection: "column", flex: 1 }}>
                            <span className="detail-label" style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: 500 }}>Direct Email Address</span>
                            <span className="detail-val" style={{ fontSize: "0.95rem", color: "var(--text-primary)", fontWeight: 600 }}><a href={`mailto:${selectedStartup.email}`} style={{ color: "var(--accent)", textDecoration: "underline" }}>{selectedStartup.email}</a></span>
                          </div>
                        </div>
                        <div className="contact-detail-item" style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                          <div className="detail-icon" style={{ width: "38px", height: "38px", borderRadius: "50%", backgroundColor: "rgba(255, 255, 255, 0.03)", border: "1px solid var(--border-color)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.95rem", color: "var(--accent)" }}><i className="fa-solid fa-phone"></i></div>
                          <div className="detail-info" style={{ display: "flex", flexDirection: "column", flex: 1 }}>
                            <span className="detail-label" style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: 500 }}>Phone Number</span>
                            <span className="detail-val" style={{ fontSize: "0.95rem", color: "var(--text-primary)", fontWeight: 600 }}>+91 98765 43210</span>
                          </div>
                        </div>
                        <div className="contact-detail-item" style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                          <div className="detail-icon" style={{ width: "38px", height: "38px", borderRadius: "50%", backgroundColor: "rgba(255, 255, 255, 0.03)", border: "1px solid var(--border-color)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.95rem", color: "var(--accent)" }}><i className="fa-brands fa-linkedin"></i></div>
                          <div className="detail-info" style={{ display: "flex", flexDirection: "column", flex: 1 }}>
                            <span className="detail-label" style={{ fontSize: "0.75rem", color: "var(--text-secondary)", fontWeight: 500 }}>LinkedIn Profile Link</span>
                            <span className="detail-val" style={{ fontSize: "0.95rem", color: "var(--text-primary)", fontWeight: 600 }}><a href={selectedStartup.linkedin} target="_blank" rel="noopener noreferrer" style={{ color: "#3b82f6", textDecoration: "underline" }}>{selectedStartup.linkedin}</a></span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="modal-footer-section">
                    <button className="btn btn-secondary" onClick={closePitchModal} style={{ padding: "10px 20px", fontWeight: 600, fontSize: "0.9rem" }}>Close Details</button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Toast Notification Container */}
      <div className="toast-container" id="toastContainer" aria-live="polite">
        {toasts.map(t => (
          <div className={`toast ${t.type}`} key={t.id}>
            <div className="toast-content-wrapper">
              <div className="toast-icon">
                {t.type === "success" && <i className="fa-solid fa-circle-check"></i>}
                {t.type === "info" && <i className="fa-solid fa-circle-info"></i>}
                {t.type === "error" && <i className="fa-solid fa-circle-exclamation"></i>}
              </div>
              <div className="toast-message">{t.message}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

