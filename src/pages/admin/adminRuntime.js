export default function runAdminRuntime() {
/* 
================================================================
   STEPUP FOR AI - ADMIN DASHBOARD CLIENT-SIDE LOGIC & DATABASE
================================================================
*/

(function() {
  'use strict';

  // Storage Keys
  const STORAGE_KEY_WEBINARS = 'stepup_webinars_v3';
  const STORAGE_KEY_HACKATHONS = 'stepup_hackathons_v3';
  const STORAGE_KEY_PITCH_EVENTS = 'stepup_pitch_events_v3';
  const STORAGE_KEY_STARTUP_APPS = 'stepup_startup_apps_v3';
  const STORAGE_KEY_RECRUITERS = 'stepup_recruiters_v3';
  const STORAGE_KEY_INVESTORS = 'stepup_investors_v3';
  const STORAGE_KEY_STUDENTS = 'stepup_students_v3';
  const STORAGE_KEY_REGISTRATIONS = 'stepup_regs_v3';
  const STORAGE_KEY_PITCH_REGISTRATIONS = 'stepup_pitch_regs_v3';
  const STORAGE_KEY_INTERNSHIPS = 'stepup_internships_v3';
  const STORAGE_KEY_INTERNSHIP_APPLICATIONS = 'stepup_internship_apps_v3';
  const STORAGE_KEY_STARTUP_INTERESTS = 'stepup_startup_interests_v3';
  const STORAGE_KEY_CONTACT_REQUESTS = 'stepup_contact_requests_v3';

  // App state
  let state = {
    webinars: [],
    hackathons: [],
    pitchEvents: [],
    startupApplications: [],
    recruiters: [],
    investors: [],
    students: [],
    registrations: [], // maps students to webinars and hackathons
    pitchRegistrations: [], // maps participants to pitch events
    internships: [],
    internshipApplications: [],
    startupInterests: [],
    contactRequests: []
  };

  // Pagination states
  let pagWebinars = { page: 1, limit: 6 };
  let pagHackathons = { page: 1, limit: 6 };
  let pagPitchEvents = { page: 1, limit: 6 };
  let pagStartups = { page: 1, limit: 6 };
  let pagStudents = { page: 1, limit: 10 };
  let pagApprovePending = { page: 1, limit: 5 };
  let pagRecruiters = { page: 1, limit: 10 };
  let pagInvestors = { page: 1, limit: 10 };
  let pagPendingTable = { page: 1, limit: 10 };
  let pagApprovedTable = { page: 1, limit: 10 };
  let pagRejectedTable = { page: 1, limit: 10 };
  let pagDetailsStudents = { page: 1, limit: 10 };
  let pagRecruiterInternships = { page: 1, limit: 10 };
  let pagRecruiterApplications = { page: 1, limit: 10 };
  let pagRecruiterProfiles = { page: 1, limit: 10 };
  let pagRecruiterApplicants = { page: 1, limit: 10 };
  let pagInvestorProfiles = { page: 1, limit: 10 };
  let pagStartupInterests = { page: 1, limit: 10 };
  let pagInvestorAnalytics = { page: 1, limit: 10 };
  let pagContactRequests = { page: 1, limit: 10 };

  // Current active selections
  let currentActiveTab = 'dashboard';
  let selectedWebinarId = null;
  let selectedHackathonId = null;
  let selectedPitchEventId = null;
  let selectedInternshipId = null;

  // Selected checkboxes in Pending Requests
  let selectedPendingIds = new Set();

  // Search & Filter storage
  let webinarsFilter = { search: '', mode: '' };
  let hackathonsFilter = { search: '', participation: '' };
  let pitchEventsFilter = { search: '' };
  let startupsFilter = { search: '', stage: '', status: '' };
  let studentsFilter = { search: '', branch: '', year: '' };
  let recruitersFilter = { search: '', status: '' };
  let investorsFilter = { search: '', status: '' };
  let pendingFilter = { search: '', type: '' };
  let approvedFilter = { search: '', type: '' };
  let rejectedFilter = { search: '', type: '' };
  let recruiterInternshipsFilter = { search: '', status: '' };
  let recruiterApplicationsFilter = { search: '', status: '' };
  let recruiterAnalyticsFilter = { search: '' };
  let recruiterProfilesFilter = { search: '' };
  let recruiterApplicantsFilter = { search: '', status: '' };
  let investorProfilesFilter = { search: '', org: '' };
  let startupInterestsFilter = { search: '', industry: '', stage: '', status: '' };
  let investorAnalyticsFilter = { search: '' };
  let contactRequestsFilter = { search: '', status: '' };
  let approveDashPendingSearch = '';
  let detailsStudentsSearch = '';

  // Base64 upload caches
  let cachedWebinarPoster = null;
  let cachedHackathonLogo = null;
  let cachedHackathonPoster = null;
  let cachedPitchEventPoster = null;

  // Initialize
  window.addEventListener('load', () => {
    initDatabase();
    bindEvents();
    handleHashRoute();
    requestAnimationFrame(() => {
      renderAll();
    });
    setupGlobalShortcuts();
  });

  window.addEventListener('hashchange', handleHashRoute);

  function handleHashRoute() {
    let hash = window.location.hash.substring(1);
    if (!hash) {
      window.location.hash = "/admin/dashboard";
      return;
    }
    
    // Check for details routes with ID
    // e.g. /admin/webinars/2001
    if (hash.startsWith('/admin/webinars/')) {
      const idStr = hash.replace('/admin/webinars/', '');
      if (idStr === 'create') {
        switchTab('webinars-list');
        openCreateWebinarModal();
        return;
      }
      const id = parseInt(idStr);
      if (!isNaN(id)) {
        selectedWebinarId = id;
        switchTab('webinar-details');
        return;
      }
    }
    
    if (hash.startsWith('/admin/hackathons/')) {
      const idStr = hash.replace('/admin/hackathons/', '');
      if (idStr === 'create') {
        switchTab('hackathons-list');
        openCreateHackathonModal();
        return;
      }
      const id = parseInt(idStr);
      if (!isNaN(id)) {
        selectedHackathonId = id;
        switchTab('hackathon-details');
        return;
      }
    }
    
    if (hash.startsWith('/admin/pitch-events/')) {
      const idStr = hash.replace('/admin/pitch-events/', '');
      if (idStr === 'create') {
        switchTab('pitch-events-list');
        openCreatePitchEventModal();
        return;
      }
      const id = parseInt(idStr);
      if (!isNaN(id)) {
        selectedPitchEventId = id;
        switchTab('pitch-event-details');
        return;
      }
    }

    if (hash.startsWith('/admin/recruiter-management/internships/')) {
      const idStr = hash.replace('/admin/recruiter-management/internships/', '');
      const id = parseInt(idStr);
      if (!isNaN(id)) {
        selectedInternshipId = id;
        switchTab('recruiter-internship-details');
        return;
      }
    }

    // Map parent hashes and path-like hashes
    const routeMap = {
      '/admin/dashboard': 'dashboard',
      '/admin/webinars': 'webinars-list',
      '/admin/webinars/create': 'webinars-list',
      '/admin/hackathons': 'hackathons-list',
      '/admin/pitch-events': 'pitch-events-list',
      '/admin/startup-applications': 'startup-applications',
      '/admin/students': 'students',
      '/admin/approval-management': 'approval-dashboard',
      '/admin/approval-management/recruiters': 'approval-recruiters',
      '/admin/approval-management/investors': 'approval-investors',
      '/admin/approval-management/pending': 'approval-pending',
      '/admin/approval-management/approved': 'approval-approved',
      '/admin/approval-management/rejected': 'approval-rejected',
      '/admin/recruiter-management': 'recruiter-dashboard',
      '/admin/recruiter-management/internships': 'recruiter-internships',
      '/admin/recruiter-management/applications': 'recruiter-applications',
      '/admin/recruiter-management/analytics': 'recruiter-analytics',
      '/admin/recruiter-management/profiles': 'recruiter-profiles',
      '/admin/investor-management': 'investor-dashboard',
      '/admin/investor-management/profiles': 'investor-profiles',
      '/admin/investor-management/interests': 'investor-interests',
      '/admin/investor-management/analytics': 'investor-analytics',
      '/admin/investor-management/contacts': 'investor-contacts',
      '/admin/settings': 'settings'
    };

    const tabId = routeMap[hash] || 'dashboard';
    switchTab(tabId);

    // If route was create, trigger the corresponding modal
    if (hash === '/admin/webinars/create') {
      openCreateWebinarModal();
    } else if (hash === '/admin/hackathons/create') {
      openCreateHackathonModal();
    } else if (hash === '/admin/pitch-events/create') {
      openCreatePitchEventModal();
    }
  }

  // ==========================================
  // DATABASE MANAGER
  // ==========================================
  function initDatabase() {
    try {
      state.webinars = JSON.parse(localStorage.getItem(STORAGE_KEY_WEBINARS)) || [];
      state.hackathons = JSON.parse(localStorage.getItem(STORAGE_KEY_HACKATHONS)) || [];
      state.pitchEvents = JSON.parse(localStorage.getItem(STORAGE_KEY_PITCH_EVENTS)) || [];
      state.startupApplications = JSON.parse(localStorage.getItem(STORAGE_KEY_STARTUP_APPS)) || [];
      state.recruiters = JSON.parse(localStorage.getItem(STORAGE_KEY_RECRUITERS)) || [];
      state.investors = JSON.parse(localStorage.getItem(STORAGE_KEY_INVESTORS)) || [];
      state.students = JSON.parse(localStorage.getItem(STORAGE_KEY_STUDENTS)) || [];
      state.registrations = JSON.parse(localStorage.getItem(STORAGE_KEY_REGISTRATIONS)) || [];
      state.pitchRegistrations = JSON.parse(localStorage.getItem(STORAGE_KEY_PITCH_REGISTRATIONS)) || [];
      state.internships = JSON.parse(localStorage.getItem(STORAGE_KEY_INTERNSHIPS)) || [];
      state.internshipApplications = JSON.parse(localStorage.getItem(STORAGE_KEY_INTERNSHIP_APPLICATIONS)) || [];
      state.startupInterests = JSON.parse(localStorage.getItem(STORAGE_KEY_STARTUP_INTERESTS)) || [];
      state.contactRequests = JSON.parse(localStorage.getItem(STORAGE_KEY_CONTACT_REQUESTS)) || [];
    } catch (e) {
      console.error("Failed to parse LocalStorage", e);
    }
  }

  function saveDatabase() {
    try {
      localStorage.setItem(STORAGE_KEY_WEBINARS, JSON.stringify(state.webinars));
      localStorage.setItem(STORAGE_KEY_HACKATHONS, JSON.stringify(state.hackathons));
      localStorage.setItem(STORAGE_KEY_PITCH_EVENTS, JSON.stringify(state.pitchEvents));
      localStorage.setItem(STORAGE_KEY_STARTUP_APPS, JSON.stringify(state.startupApplications));
      localStorage.setItem(STORAGE_KEY_RECRUITERS, JSON.stringify(state.recruiters));
      localStorage.setItem(STORAGE_KEY_INVESTORS, JSON.stringify(state.investors));
      localStorage.setItem(STORAGE_KEY_STUDENTS, JSON.stringify(state.students));
      localStorage.setItem(STORAGE_KEY_REGISTRATIONS, JSON.stringify(state.registrations));
      localStorage.setItem(STORAGE_KEY_PITCH_REGISTRATIONS, JSON.stringify(state.pitchRegistrations));
      localStorage.setItem(STORAGE_KEY_INTERNSHIPS, JSON.stringify(state.internships));
      localStorage.setItem(STORAGE_KEY_INTERNSHIP_APPLICATIONS, JSON.stringify(state.internshipApplications));
      localStorage.setItem(STORAGE_KEY_STARTUP_INTERESTS, JSON.stringify(state.startupInterests));
      localStorage.setItem(STORAGE_KEY_CONTACT_REQUESTS, JSON.stringify(state.contactRequests));
    } catch (e) {
      console.error("Local storage save error", e);
      alert("Local storage limit exceeded! Consider uploading smaller logos/posters.");
    }
  }

  function resetApp() {
    if (confirm("Are you sure you want to delete all webinars, hackathons, pitch events, applications, approvals and students? This action is irreversible.")) {
      localStorage.clear();
      state = {
        webinars: [],
        hackathons: [],
        pitchEvents: [],
        startupApplications: [],
        recruiters: [],
        investors: [],
        students: [],
        registrations: [],
        pitchRegistrations: [],
        internships: [],
        internshipApplications: [],
        startupInterests: [],
        contactRequests: []
      };
      saveDatabase();
      selectedWebinarId = null;
      selectedHackathonId = null;
      selectedPitchEventId = null;
      selectedInternshipId = null;
      selectedPendingIds.clear();
      window.location.hash = "/admin/dashboard";
      renderAll();
      alert("Ecosystem data reset successfully!");
    }
  }

  // ==========================================
  // EVENT BINDINGS
  // ==========================================
  function bindEvents() {
    // Collapsible sidebar accordions
    document.querySelectorAll('.submenu-toggle').forEach(toggle => {
      toggle.addEventListener('click', (e) => {
        e.preventDefault();
        const navItem = toggle.closest('.nav-item');
        
        // Toggle expanded
        const isExpanded = navItem.classList.contains('expanded');
        document.querySelectorAll('.nav-item.has-submenu').forEach(item => {
          if (item !== navItem) item.classList.remove('expanded');
        });
        
        if (isExpanded) {
          navItem.classList.remove('expanded');
        } else {
          navItem.classList.add('expanded');
          // Automatically switch to the first submenu item's tab path if one exists
          const firstSub = navItem.querySelector('.submenu-item[data-tab]');
          if (firstSub) {
            const anchor = firstSub.querySelector('a');
            if (anchor) {
              const href = anchor.getAttribute('href');
              if (href && href.startsWith('#')) {
                window.location.hash = href.substring(1);
              }
            }
          }
        }
      });
    });

    // Tab clicks (main and submenu items)
    document.querySelectorAll('.nav-item[data-tab], .submenu-item[data-tab]').forEach(item => {
      item.addEventListener('click', (e) => {
        const tabId = item.getAttribute('data-tab');
        
        // Avoid interrupting direct modal triggers
        if (tabId && tabId.includes('-create')) return;
        
        // If clicking the anchor directly, let hashchange handle it naturally
        if (e.target.closest('a')) {
          return;
        }
        
        // If clicking the LI background wrapper, find the anchor and navigate
        const anchor = item.querySelector('a');
        if (anchor) {
          const href = anchor.getAttribute('href');
          if (href && href.startsWith('#')) {
            e.preventDefault();
            e.stopPropagation();
            window.location.hash = href.substring(1);
          }
        }
      });
    });

    // Profile Trigger dropdowns (Sidebar Footer and Top Nav)
    const profileFooter = document.getElementById('user-profile-footer');
    const profileMenu = document.getElementById('profile-dropdown-menu');
    const topProfileTrigger = document.getElementById('top-user-menu-trigger');
    const topProfileMenu = document.getElementById('top-profile-dropdown-menu');

    if (profileFooter && profileMenu) {
      profileFooter.addEventListener('click', (e) => {
        e.stopPropagation();
        profileMenu.classList.toggle('active');
        if (topProfileMenu) topProfileMenu.classList.remove('active');
      });
    }

    if (topProfileTrigger && topProfileMenu) {
      topProfileTrigger.addEventListener('click', (e) => {
        e.stopPropagation();
        topProfileMenu.classList.toggle('active');
        if (profileMenu) profileMenu.classList.remove('active');
      });
    }

    document.addEventListener('click', () => {
      if (profileMenu) profileMenu.classList.remove('active');
      if (topProfileMenu) topProfileMenu.classList.remove('active');
    });

    // Logout trigger
    const logoutBtn = document.getElementById('sidebar-logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('logout-modal').classList.add('active');
      });
    }

    // Search and Filters binders
    bindSearchFilter('global-nav-search', (val) => {
      // route search queries depending on active view
      triggerGlobalSearch(val);
    });

    bindSearchFilter('webinars-search-input', (val) => {
      webinarsFilter.search = val.toLowerCase();
      pagWebinars.page = 1;
      renderWebinarsGrid();
    });
    bindSelectFilter('webinars-filter-mode', (val) => {
      webinarsFilter.mode = val;
      pagWebinars.page = 1;
      renderWebinarsGrid();
    });

    bindSearchFilter('hackathons-search-input', (val) => {
      hackathonsFilter.search = val.toLowerCase();
      pagHackathons.page = 1;
      renderHackathonsGrid();
    });
    bindSelectFilter('hackathons-filter-participation', (val) => {
      hackathonsFilter.participation = val;
      pagHackathons.page = 1;
      renderHackathonsGrid();
    });

    bindSearchFilter('pitch-events-search-input', (val) => {
      pitchEventsFilter.search = val.toLowerCase();
      pagPitchEvents.page = 1;
      renderPitchEventsGrid();
    });

    bindSearchFilter('startup-search-input', (val) => {
      startupsFilter.search = val.toLowerCase();
      pagStartups.page = 1;
      renderStartupsGrid();
    });
    bindSelectFilter('startup-filter-stage', (val) => {
      startupsFilter.stage = val;
      pagStartups.page = 1;
      renderStartupsGrid();
    });
    bindSelectFilter('startup-filter-status', (val) => {
      startupsFilter.status = val;
      pagStartups.page = 1;
      renderStartupsGrid();
    });

    bindSearchFilter('students-search-input', (val) => {
      studentsFilter.search = val.toLowerCase();
      pagStudents.page = 1;
      renderStudentsTable();
    });
    bindSelectFilter('students-filter-branch', (val) => {
      studentsFilter.branch = val;
      pagStudents.page = 1;
      renderStudentsTable();
    });
    bindSelectFilter('students-filter-year', (val) => {
      studentsFilter.year = val;
      pagStudents.page = 1;
      renderStudentsTable();
    });

    // Approval sub-view filters
    bindSearchFilter('recruiters-search-input', (val) => {
      recruitersFilter.search = val.toLowerCase();
      pagRecruiters.page = 1;
      renderRecruitersTable();
    });
    bindSelectFilter('recruiters-filter-status', (val) => {
      recruitersFilter.status = val;
      pagRecruiters.page = 1;
      renderRecruitersTable();
    });

    bindSearchFilter('investors-search-input', (val) => {
      investorsFilter.search = val.toLowerCase();
      pagInvestors.page = 1;
      renderInvestorsTable();
    });
    bindSelectFilter('investors-filter-status', (val) => {
      investorsFilter.status = val;
      pagInvestors.page = 1;
      renderInvestorsTable();
    });

    bindSearchFilter('pending-search-input', (val) => {
      pendingFilter.search = val.toLowerCase();
      pagPendingTable.page = 1;
      renderPendingTable();
    });
    bindSelectFilter('pending-filter-type', (val) => {
      pendingFilter.type = val;
      pagPendingTable.page = 1;
      renderPendingTable();
    });

    bindSearchFilter('approved-search-input', (val) => {
      approvedFilter.search = val.toLowerCase();
      pagApprovedTable.page = 1;
      renderApprovedTable();
    });
    bindSelectFilter('approved-filter-type', (val) => {
      approvedFilter.type = val;
      pagApprovedTable.page = 1;
      renderApprovedTable();
    });

    bindSearchFilter('rejected-search-input', (val) => {
      rejectedFilter.search = val.toLowerCase();
      pagRejectedTable.page = 1;
      renderRejectedTable();
    });
    bindSelectFilter('rejected-filter-type', (val) => {
      rejectedFilter.type = val;
      pagRejectedTable.page = 1;
      renderRejectedTable();
    });

    bindSearchFilter('approve-dash-pending-search', (val) => {
      approveDashPendingSearch = val.toLowerCase();
      pagApprovePending.page = 1;
      renderApproveDashPendingTable();
    });

    bindSelectFilter('dash-line-chart-range', () => {
      renderDashboard();
    });
    bindSelectFilter('approve-trend-range', () => {
      renderApprovalDashboard();
    });

    // Recruiter Management search & filters
    bindSearchFilter('rec-internships-search', (val) => {
      recruiterInternshipsFilter.search = val.toLowerCase();
      pagRecruiterInternships.page = 1;
      renderPublishedInternshipsTable();
    });
    bindSelectFilter('rec-internships-filter-status', (val) => {
      recruiterInternshipsFilter.status = val;
      pagRecruiterInternships.page = 1;
      renderPublishedInternshipsTable();
    });

    bindSearchFilter('rec-apps-search', (val) => {
      recruiterApplicationsFilter.search = val.toLowerCase();
      pagRecruiterApplications.page = 1;
      renderRecruiterApplicationsTable();
    });
    bindSelectFilter('rec-apps-filter-status', (val) => {
      recruiterApplicationsFilter.status = val;
      pagRecruiterApplications.page = 1;
      renderRecruiterApplicationsTable();
    });

    bindSearchFilter('rec-analytics-search', (val) => {
      recruiterAnalyticsFilter.search = val.toLowerCase();
      renderRecruiterAnalytics();
    });

    bindSearchFilter('rec-profiles-search', (val) => {
      recruiterProfilesFilter.search = val.toLowerCase();
      pagRecruiterProfiles.page = 1;
      renderRecruiterProfilesTable();
    });

    bindSelectFilter('recruiter-pub-chart-range', () => {
      renderRecruiterDashboard();
    });
    bindSelectFilter('recruiter-app-chart-range', () => {
      renderRecruiterDashboard();
    });

    bindLimitSelect('rec-internships-page-size', pagRecruiterInternships, renderPublishedInternshipsTable);
    bindLimitSelect('rec-apps-page-size', pagRecruiterApplications, renderRecruiterApplicationsTable);
    bindLimitSelect('rec-profiles-page-size', pagRecruiterProfiles, renderRecruiterProfilesTable);

    // Export popovers
    bindPopoverToggle('recruiter-dash-export-btn', 'recruiter-dash-export-menu');
    bindPopoverToggle('rec-internships-export-btn', 'rec-internships-export-menu');
    bindPopoverToggle('rec-apps-export-btn', 'rec-apps-export-menu');
    bindPopoverToggle('rec-analytics-export-btn', 'rec-analytics-export-menu');
    bindPopoverToggle('rec-profiles-export-btn', 'rec-profiles-export-menu');

    // Page limits binders
    bindLimitSelect('webinars-page-size', pagWebinars, renderWebinarsGrid);
    bindLimitSelect('hackathons-page-size', pagHackathons, renderHackathonsGrid);
    bindLimitSelect('pitch-events-page-size', pagPitchEvents, renderPitchEventsGrid);
    bindLimitSelect('startup-page-size', pagStartups, renderStartupsGrid);
    bindLimitSelect('students-table-page-size', pagStudents, renderStudentsTable);
    bindLimitSelect('recruiters-page-size', pagRecruiters, renderRecruitersTable);
    bindLimitSelect('investors-page-size', pagInvestors, renderInvestorsTable);
    bindLimitSelect('pending-page-size', pagPendingTable, renderPendingTable);
    bindLimitSelect('approved-page-size', pagApprovedTable, renderApprovedTable);
    bindLimitSelect('rejected-page-size', pagRejectedTable, renderRejectedTable);

    // Export dropdown bells triggers
    bindPopoverToggle('dash-export-btn', 'dash-export-menu');
    bindPopoverToggle('webinars-export-btn', 'webinars-export-menu');
    bindPopoverToggle('applications-export-btn', 'applications-export-menu');
    bindPopoverToggle('students-export-btn', 'students-export-menu');
    bindPopoverToggle('approvals-export-btn', 'approvals-export-menu');

    // Forms File uploads handlers
    bindImageUpload('webinar-form-poster', (base64, filename) => {
      cachedWebinarPoster = base64;
      showPosterPreview('webinar-poster-preview', base64, filename, () => {
        cachedWebinarPoster = null;
      });
    });

    bindImageUpload('hackathon-form-logo', (base64, filename) => {
      cachedHackathonLogo = base64;
      showPosterPreview('hackathon-logo-preview', base64, filename, () => {
        cachedHackathonLogo = null;
      });
    });

    bindImageUpload('hackathon-form-poster', (base64, filename) => {
      cachedHackathonPoster = base64;
      showPosterPreview('hackathon-poster-preview', base64, filename, () => {
        cachedHackathonPoster = null;
      });
    });

    bindImageUpload('pitch-event-form-poster', (base64, filename) => {
      cachedPitchEventPoster = base64;
      showPosterPreview('pitch-event-poster-preview', base64, filename, () => {
        cachedPitchEventPoster = null;
      });
    });

    // Form Submits
    document.getElementById('create-webinar-form').addEventListener('submit', (e) => {
      e.preventDefault();
      submitWebinarForm();
    });
    document.getElementById('create-hackathon-form').addEventListener('submit', (e) => {
      e.preventDefault();
      submitHackathonForm();
    });
    document.getElementById('create-pitch-event-form').addEventListener('submit', (e) => {
      e.preventDefault();
      submitPitchEventForm();
    });
    document.getElementById('add-student-form').addEventListener('submit', (e) => {
      e.preventDefault();
      submitStudentForm();
    });

    // Investor Management Bindings
    bindSearchFilter('investor-profiles-search', (val) => {
      investorProfilesFilter.search = val.toLowerCase();
      pagInvestorProfiles.page = 1;
      renderInvestorProfilesTable();
    });
    bindSelectFilter('investor-profiles-filter-org', (val) => {
      investorProfilesFilter.org = val;
      pagInvestorProfiles.page = 1;
      renderInvestorProfilesTable();
    });

    bindSearchFilter('investor-interests-search', (val) => {
      startupInterestsFilter.search = val.toLowerCase();
      pagStartupInterests.page = 1;
      renderStartupInterestsTable();
    });
    bindSelectFilter('investor-interests-filter-industry', (val) => {
      startupInterestsFilter.industry = val;
      pagStartupInterests.page = 1;
      renderStartupInterestsTable();
    });
    bindSelectFilter('investor-interests-filter-stage', (val) => {
      startupInterestsFilter.stage = val;
      pagStartupInterests.page = 1;
      renderStartupInterestsTable();
    });
    bindSelectFilter('investor-interests-filter-status', (val) => {
      startupInterestsFilter.status = val;
      pagStartupInterests.page = 1;
      renderStartupInterestsTable();
    });

    bindSearchFilter('investor-analytics-search', (val) => {
      investorAnalyticsFilter.search = val.toLowerCase();
      pagInvestorAnalytics.page = 1;
      renderInvestmentAnalytics();
    });

    bindSearchFilter('investor-contacts-search', (val) => {
      contactRequestsFilter.search = val.toLowerCase();
      pagContactRequests.page = 1;
      renderContactRequestsTable();
    });
    bindSelectFilter('investor-contacts-filter-status', (val) => {
      contactRequestsFilter.status = val;
      pagContactRequests.page = 1;
      renderContactRequestsTable();
    });

    bindSelectFilter('investor-dashboard-date-range', () => {
      renderInvestorDashboard();
    });

    bindLimitSelect('investor-profiles-page-size', pagInvestorProfiles, renderInvestorProfilesTable);
    bindLimitSelect('investor-interests-page-size', pagStartupInterests, renderStartupInterestsTable);
    bindLimitSelect('investor-analytics-page-size', pagInvestorAnalytics, renderInvestmentAnalytics);
    bindLimitSelect('investor-contacts-page-size', pagContactRequests, renderContactRequestsTable);

    bindPopoverToggle('investor-dashboard-export-btn', 'investor-dashboard-export-menu');
    bindPopoverToggle('investor-profiles-export-btn', 'investor-profiles-export-menu');
    bindPopoverToggle('investor-interests-export-btn', 'investor-interests-export-menu');
    bindPopoverToggle('investor-analytics-export-btn', 'investor-analytics-export-menu');
    bindPopoverToggle('investor-contacts-export-btn', 'investor-contacts-export-menu');
  }

  // ==========================================
  // UI ROUTING (TABS SWITCHER)
  // ==========================================
  function switchTab(tabId) {
    currentActiveTab = tabId;
    
    // Remove active from all panels & sidebar items
    document.querySelectorAll('.content-panel').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-item, .submenu-item').forEach(i => i.classList.remove('active'));

    // Activate the main panel
    const targetPanel = document.getElementById(`${tabId}-view`);
    if (targetPanel) {
      targetPanel.classList.add('active');
    }

    // Activate sidebar parent or child
    const sidebarItem = document.querySelector(`[data-tab="${tabId}"]`);
    if (sidebarItem) {
      sidebarItem.classList.add('active');
      
      // If it is inside a submenu list, expand parent nav-item
      const subMenu = sidebarItem.closest('.submenu-list');
      if (subMenu) {
        const parentNavItem = subMenu.closest('.nav-item');
        if (parentNavItem) {
          parentNavItem.classList.add('expanded');
          parentNavItem.classList.add('active'); // highlight parent as active as well
        }
      }
    }

    // Refresh tab statistics or lists
    triggerTabRenders(tabId);
  }

  function triggerTabRenders(tabId) {
    if (tabId === 'dashboard') {
      renderDashboard();
    } else if (tabId === 'webinars-list') {
      renderWebinarsGrid();
    } else if (tabId === 'webinar-details') {
      renderWebinarDetailsPane();
    } else if (tabId === 'hackathons-list') {
      renderHackathonsGrid();
    } else if (tabId === 'hackathon-details') {
      renderHackathonDetailsPane();
    } else if (tabId === 'pitch-events-list') {
      renderPitchEventsGrid();
    } else if (tabId === 'startup-applications') {
      renderStartupsGrid();
    } else if (tabId === 'students') {
      renderStudentsTable();
    } else if (tabId === 'approval-dashboard') {
      renderApprovalDashboard();
    } else if (tabId === 'approval-recruiters') {
      renderRecruitersTable();
    } else if (tabId === 'approval-investors') {
      renderInvestorsTable();
    } else if (tabId === 'approval-pending') {
      selectedPendingIds.clear();
      renderPendingTable();
    } else if (tabId === 'approval-approved') {
      renderApprovedTable();
    } else if (tabId === 'approval-rejected') {
      renderRejectedTable();
    } else if (tabId === 'recruiter-dashboard') {
      renderRecruiterDashboard();
    } else if (tabId === 'recruiter-internships') {
      renderPublishedInternshipsTable();
    } else if (tabId === 'recruiter-internship-details') {
      renderInternshipDetailsPane();
    } else if (tabId === 'recruiter-applications') {
      renderRecruiterApplicationsTable();
    } else if (tabId === 'recruiter-analytics') {
      renderRecruiterAnalytics();
    } else if (tabId === 'recruiter-profiles') {
      renderRecruiterProfilesTable();
    } else if (tabId === 'investor-dashboard') {
      renderInvestorDashboard();
    } else if (tabId === 'investor-profiles') {
      renderInvestorProfilesTable();
    } else if (tabId === 'investor-interests') {
      renderStartupInterestsTable();
    } else if (tabId === 'investor-analytics') {
      renderInvestmentAnalytics();
    } else if (tabId === 'investor-contacts') {
      renderContactRequestsTable();
    }
  }

  function renderAll() {
    renderDashboard();
    renderWebinarsGrid();
    renderHackathonsGrid();
    renderPitchEventsGrid();
    renderStartupsGrid();
    renderStudentsTable();
    renderApprovalDashboard();
  }

  // ==========================================
  // HELPER FUNCTIONS FOR DYNAMIC VISUALIZATIONS & EMPTY STATES
  // ==========================================
  function getCumulativeTrend(list, dateField, days = 7) {
    const trend = [];
    const now = new Date();
    now.setHours(23, 59, 59, 999);
    for (let i = days - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      d.setHours(23, 59, 59, 999);
      const count = list.filter(item => {
        const val = item[dateField];
        if (!val) return false;
        return new Date(val) <= d;
      }).length;
      trend.push(count);
    }
    return trend;
  }

  function createEmptyStateHTML(message, actionText, actionFn) {
    return `
      <div class="empty-state-card" style="display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 30px 20px; text-align: center; background: rgba(255,255,255,0.01); border: 1px dashed rgba(255,255,255,0.08); border-radius: 12px; width: 100%; height: 100%; min-height: 180px; box-sizing: border-box;">
        <div style="font-size: 28px; color: var(--accent-red); margin-bottom: 10px; opacity: 0.8;">
          <i class="fa-solid fa-folder-open"></i>
        </div>
        <div style="font-size: 13px; font-weight: 600; color: #fff; margin-bottom: 4px;">${escapeHTML(message)}</div>
        <div style="font-size: 11px; color: var(--text-secondary); margin-bottom: 12px; max-width: 240px;">Get started by loading demo data or creating new records.</div>
        ${actionText ? `<button class="btn-solid-red" style="padding: 6px 12px; font-size: 11px;" onclick="${actionFn}">${escapeHTML(actionText)}</button>` : ''}
      </div>
    `;
  }

  function renderDonutOrEmptyState(cardBody, canvasId, totalCountId, totalVal, segments, legendId, emptyMessage) {
    if (totalVal === 0) {
      cardBody.innerHTML = createEmptyStateHTML(emptyMessage, "Load Demo Data", "window.dashboardApp.loadDemoData()");
      return;
    }
    
    // Restore template if not present
    if (!cardBody.querySelector(`#${canvasId}`)) {
      if (canvasId === 'chart-registrations-donut') {
        cardBody.innerHTML = `
          <div class="donut-container" style="width:100%;">
            <div style="position:relative; width:140px; height:140px; display:flex; align-items:center; justify-content:center;">
              <canvas id="chart-registrations-donut" width="140" height="140"></canvas>
              <div class="donut-inner-text">
                <div id="donut-total-count" style="font-size:24px; font-weight:700; color:#ffffff; line-height:1;">0</div>
                <div style="font-size:10px; text-transform:uppercase; color:#8e9bb2; font-weight:600; margin-top:4px;">Total</div>
              </div>
            </div>
            <div class="donut-legend" id="donut-registrations-legend"></div>
          </div>
        `;
      } else {
        cardBody.innerHTML = `
          <div class="donut-container" style="width:100%;">
            <div style="position:relative; width:140px; height:140px; display:flex; align-items:center; justify-content:center;">
              <canvas id="chart-approvals-donut" width="120" height="120"></canvas>
              <div class="donut-inner-text">
                <span class="donut-inner-value" id="donut-approvals-total">0</span>
                <span class="donut-inner-label">Total</span>
              </div>
            </div>
            <div class="donut-legend" id="donut-approvals-legend" style="font-size:11px;"></div>
          </div>
        `;
      }
    }
    
    document.getElementById(totalCountId).innerText = totalVal.toLocaleString();
    drawDonutChart(canvasId, segments);

    const legendContainer = document.getElementById(legendId);
    let legendHTML = '';
    segments.forEach(seg => {
      const pct = totalVal > 0 ? Math.round((seg.value / totalVal) * 100) : 0;
      legendHTML += `
        <div class="legend-item" style="margin-bottom:2px;">
          <div class="legend-label-block">
            <span class="legend-color-dot" style="background-color: ${seg.color}"></span>
            <span>${seg.label}</span>
          </div>
          <div class="legend-value-block">
            <span>${seg.value}</span>
            <span class="legend-value-percentage">(${pct}%)</span>
          </div>
        </div>
      `;
    });
    legendContainer.innerHTML = legendHTML;
  }

  function renderLineChartOrEmptyState(cardBody, canvasId, dates, datasets, emptyMessage) {
    let hasData = false;
    datasets.forEach(d => {
      if (d.points.some(p => p > 0)) hasData = true;
    });
    
    if (!hasData) {
      cardBody.innerHTML = createEmptyStateHTML(emptyMessage, "Load Demo Data", "window.dashboardApp.loadDemoData()");
      return;
    }
    
    if (!cardBody.querySelector(`#${canvasId}`)) {
      cardBody.innerHTML = `<canvas class="canvas-chart" id="${canvasId}"></canvas>`;
    }
    
    drawLineChart(canvasId, dates, datasets);
  }

  // ==========================================
  // RENDERER: DASHBOARD OVERVIEW
  // ==========================================
  function renderDashboard() {
    // 1. Counter metrics
    const totalStudents = state.students.length;
    const totalWebinars = state.webinars.length;
    const totalHackathons = state.hackathons.length;
    const totalPitches = state.pitchEvents.length;
    const totalApplications = state.startupApplications.length;
    
    // Total event registrations count
    const totalRegs = state.registrations.length + state.pitchRegistrations.length;

    document.getElementById('dash-stat-students').innerText = totalStudents.toLocaleString();
    document.getElementById('dash-stat-webinars').innerText = totalWebinars.toLocaleString();
    document.getElementById('dash-stat-hackathons').innerText = totalHackathons.toLocaleString();
    document.getElementById('dash-stat-pitches').innerText = totalPitches.toLocaleString();
    document.getElementById('dash-stat-applications').innerText = totalApplications.toLocaleString();
    document.getElementById('dash-stat-registrations').innerText = totalRegs.toLocaleString();

    // 2. Draw Mini Sparklines (Cumulative trends for last 7 days)
    drawSparkline('sparkline-students', getCumulativeTrend(state.students, 'createdDate'), '#ff2e4b');
    drawSparkline('sparkline-webinars', getCumulativeTrend(state.webinars, 'startDate'), '#8b5cf6');
    drawSparkline('sparkline-hackathons', getCumulativeTrend(state.hackathons, 'startDate'), '#3b82f6');
    drawSparkline('sparkline-pitches', getCumulativeTrend(state.pitchEvents, 'startDate'), '#f59e0b');
    drawSparkline('sparkline-applications', getCumulativeTrend(state.startupApplications, 'appliedDate'), '#10b981');
    
    const combinedRegs = [
      ...state.registrations,
      ...state.pitchRegistrations
    ];
    drawSparkline('sparkline-registrations', getCumulativeTrend(combinedRegs, 'registrationDate'), '#ff2e4b');

    // 3. Draw Main Line Chart: Registration Analytics
    const lineChartCardBody = document.getElementById('card-registrations-line-body');
    const rangeSelect = document.getElementById('dash-line-chart-range');
    const range = rangeSelect ? rangeSelect.value : 'month';
    
    const dates = [];
    const studentPoints = [];
    const webinarPoints = [];
    const hackathonPoints = [];
    const pitchPoints = [];
    
    const now = new Date();
    now.setHours(23, 59, 59, 999);
    
    const intervals = 7;
    const daysBack = range === 'week' ? 7 : 30;
    
    for (let i = intervals - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - Math.round((i / (intervals - 1)) * daysBack));
      d.setHours(23, 59, 59, 999);
      
      const day = d.getDate();
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      dates.push(`${day} ${months[d.getMonth()]}`);
      
      studentPoints.push(state.students.filter(s => new Date(s.createdDate) <= d).length);
      webinarPoints.push(state.registrations.filter(r => {
        const ev = state.webinars.find(w => w.id === r.eventId);
        return ev && new Date(r.registrationDate) <= d;
      }).length);
      hackathonPoints.push(state.registrations.filter(r => {
        const ev = state.hackathons.find(h => h.id === r.eventId);
        return ev && new Date(r.registrationDate) <= d;
      }).length);
      pitchPoints.push(state.pitchRegistrations.filter(pr => new Date(pr.registrationDate) <= d).length);
    }

    renderLineChartOrEmptyState(lineChartCardBody, 'chart-registrations-line', dates, [
      { label: 'Students', points: studentPoints, color: '#ff2e4b' },
      { label: 'Webinars', points: webinarPoints, color: '#8b5cf6' },
      { label: 'Hackathons', points: hackathonPoints, color: '#3b82f6' },
      { label: 'Pitch Events', points: pitchPoints, color: '#f59e0b' }
    ], "No registration data available.");

    // 4. Draw Donut Chart: Registrations by Type
    const donutCardBody = document.getElementById('card-registrations-donut-body');
    
    const webRegsCount = state.registrations.filter(r => state.webinars.some(w => w.id === r.eventId)).length;
    const hackRegsCount = state.registrations.filter(r => state.hackathons.some(h => h.id === r.eventId)).length;
    const pitchRegsCount = state.pitchRegistrations.length;
    
    const donutTotal = totalStudents + webRegsCount + hackRegsCount + pitchRegsCount + totalApplications;
    
    const segments = [
      { label: 'Students', value: totalStudents, color: '#ff2e4b' },
      { label: 'Webinars', value: webRegsCount, color: '#8b5cf6' },
      { label: 'Hackathons', value: hackRegsCount, color: '#3b82f6' },
      { label: 'Pitch Events', value: pitchRegsCount, color: '#f59e0b' },
      { label: 'Startup Applications', value: totalApplications, color: '#10b981' }
    ];

    renderDonutOrEmptyState(
      donutCardBody, 
      'chart-registrations-donut', 
      'donut-total-count', 
      donutTotal, 
      segments, 
      'donut-registrations-legend', 
      "No registration data available."
    );

    // 5. Populate Upcoming Events lists by type
    const today = new Date();
    today.setHours(0,0,0,0);

    // 5a. Upcoming Webinars
    const upcomingWebinarsContainer = document.getElementById('dash-upcoming-webinars');
    if (upcomingWebinarsContainer) {
      const list = state.webinars
        .filter(w => new Date(w.startDate) >= today)
        .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
        .slice(0, 4);
      
      if (list.length === 0) {
        upcomingWebinarsContainer.innerHTML = createEmptyStateHTML("No upcoming events available.", "Create Webinar", "window.location.hash = '/admin/webinars/create'");
      } else {
        let html = '';
        list.forEach(w => {
          const dateStr = formatDate(w.startDate);
          const regCount = state.registrations.filter(r => r.eventId === w.id).length;
          html += `
            <div class="recent-item" style="cursor:pointer; display:flex; justify-content:space-between; align-items:center;" onclick="window.location.hash = '/admin/webinars/' + ${w.id}">
              <div style="display:flex; align-items:center; gap:12px;">
                <div class="activity-badge" style="background: rgba(139, 92, 246, 0.05); color: #8b5cf6;">
                  <i class="fa-solid fa-video"></i>
                </div>
                <div class="activity-content">
                  <div class="activity-title">${escapeHTML(w.name)}</div>
                  <div class="activity-desc">${dateStr} &bull; ${formatTime12h(w.startTime)}</div>
                </div>
              </div>
              <span class="event-row-badge" style="font-size:11px; padding:2px 8px; background:rgba(139, 92, 246,0.08); color:#8b5cf6;">${regCount} regs</span>
            </div>
          `;
        });
        upcomingWebinarsContainer.innerHTML = html;
      }
    }

    // 5b. Upcoming Hackathons
    const upcomingHackathonsContainer = document.getElementById('dash-upcoming-hackathons');
    if (upcomingHackathonsContainer) {
      const list = state.hackathons
        .filter(h => new Date(h.startDate) >= today)
        .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
        .slice(0, 4);
      
      if (list.length === 0) {
        upcomingHackathonsContainer.innerHTML = createEmptyStateHTML("No upcoming events available.", "Create Hackathon", "window.location.hash = '/admin/hackathons/create'");
      } else {
        let html = '';
        list.forEach(h => {
          const dateStr = formatDate(h.startDate);
          const regCount = state.registrations.filter(r => r.eventId === h.id).length;
          html += `
            <div class="recent-item" style="cursor:pointer; display:flex; justify-content:space-between; align-items:center;" onclick="window.location.hash = '/admin/hackathons/' + ${h.id}">
              <div style="display:flex; align-items:center; gap:12px;">
                <div class="activity-badge" style="background: rgba(59, 130, 246, 0.05); color: #3b82f6;">
                  <i class="fa-solid fa-code"></i>
                </div>
                <div class="activity-content">
                  <div class="activity-title">${escapeHTML(h.name)}</div>
                  <div class="activity-desc">${dateStr} &bull; ${escapeHTML(h.participation)}</div>
                </div>
              </div>
              <span class="event-row-badge" style="font-size:11px; padding:2px 8px; background:rgba(59, 130, 246,0.08); color:#3b82f6;">${regCount} regs</span>
            </div>
          `;
        });
        upcomingHackathonsContainer.innerHTML = html;
      }
    }

    // 5c. Upcoming Pitch Events
    const upcomingPitchesContainer = document.getElementById('dash-upcoming-pitch-events');
    if (upcomingPitchesContainer) {
      const list = state.pitchEvents
        .filter(p => new Date(p.startDate) >= today)
        .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
        .slice(0, 4);
      
      if (list.length === 0) {
        upcomingPitchesContainer.innerHTML = createEmptyStateHTML("No upcoming events available.", "Create Pitch Event", "window.location.hash = '/admin/pitch-events/create'");
      } else {
        let html = '';
        list.forEach(p => {
          const dateStr = formatDate(p.startDate);
          const regCount = state.pitchRegistrations.filter(pr => pr.eventId === p.id).length;
          html += `
            <div class="recent-item" style="cursor:pointer; display:flex; justify-content:space-between; align-items:center;" onclick="window.location.hash = '/admin/pitch-events'">
              <div style="display:flex; align-items:center; gap:12px;">
                <div class="activity-badge" style="background: rgba(245, 158, 11, 0.05); color: #f59e0b;">
                  <i class="fa-solid fa-microphone"></i>
                </div>
                <div class="activity-content">
                  <div class="activity-title">${escapeHTML(p.name)}</div>
                  <div class="activity-desc">${dateStr} &bull; ${formatTime12h(p.startTime)}</div>
                </div>
              </div>
              <span class="event-row-badge" style="font-size:11px; padding:2px 8px; background:rgba(245, 158, 11,0.08); color:#f59e0b;">${regCount} regs</span>
            </div>
          `;
        });
        upcomingPitchesContainer.innerHTML = html;
      }
    }

    // 6. Populate Recent Applications
    const appsContainer = document.getElementById('dash-recent-applications');
    const recentApps = [...state.startupApplications]
      .sort((a, b) => new Date(b.createdDate || b.appliedDate) - new Date(a.createdDate || a.appliedDate))
      .slice(0, 4);

    if (recentApps.length === 0) {
      appsContainer.innerHTML = createEmptyStateHTML("No startup applications available.", "Load Demo Data", "window.dashboardApp.loadDemoData()");
    } else {
      let appsHTML = '';
      recentApps.forEach(app => {
        const badgeClass = app.status === 'Approved' ? 'badge-approved' : app.status === 'Rejected' ? 'badge-rejected' : 'badge-pending';
        appsHTML += `
          <div class="recent-item" style="cursor:pointer;" onclick="window.dashboardApp.viewStartupApplication(${app.id})">
            <div class="activity-badge" style="background: rgba(16, 185, 129, 0.05); color: var(--accent-green);">
              <i class="fa-solid fa-rocket"></i>
            </div>
            <div class="activity-content">
              <div class="activity-title">${escapeHTML(app.startupName)}</div>
              <div class="activity-desc">Founder: ${escapeHTML(app.founderName)} &bull; ${escapeHTML(app.industry)} &bull; Date: ${escapeHTML(app.appliedDate || app.createdDate)}</div>
            </div>
            <span class="${badgeClass}" style="font-size:10px; padding:2px 6px;">${app.status}</span>
          </div>
        `;
      });
      appsContainer.innerHTML = appsHTML;
    }

    // 7. Recent registrations list
    const regsContainer = document.getElementById('dash-recent-registrations-list');
    const allRegs = [
      ...state.registrations.map(r => ({ ...r, regType: 'event' })),
      ...state.pitchRegistrations.map(pr => ({ ...pr, regType: 'pitch' }))
    ];

    const sortedRegs = allRegs
      .sort((a, b) => new Date(b.registrationDate) - new Date(a.registrationDate))
      .slice(0, 4);

    if (sortedRegs.length === 0) {
      regsContainer.innerHTML = createEmptyStateHTML("No student registrations available.", "Load Demo Data", "window.dashboardApp.loadDemoData()");
    } else {
      let regsHTML = '';
      sortedRegs.forEach(reg => {
        const student = state.students.find(s => s.id === reg.studentId);
        if (student) {
          const dateStr = formatDate(reg.registrationDate.split('T')[0]);
          regsHTML += `
            <div class="recent-item" style="cursor:pointer;" onclick="window.location.hash = '/admin/students'">
              <div class="activity-badge" style="background: rgba(255, 255, 255, 0.04); color: var(--text-secondary);">
                <i class="fa-solid fa-user-graduate"></i>
              </div>
              <div class="activity-content">
                <div class="activity-title">${escapeHTML(student.name)}</div>
                <div class="activity-desc">${escapeHTML(student.college)} &bull; ${dateStr}</div>
              </div>
              <span class="event-row-badge" style="font-size:10px; padding:2px 6px; background: rgba(255, 46, 75, 0.05); color: var(--accent-red); border: 1px solid rgba(255, 46, 75, 0.15);">${student.id}</span>
            </div>
          `;
        }
      });
      regsContainer.innerHTML = regsHTML;
    }
  }

  // ==========================================
  // RENDERER: WEBINARS MANAGEMENT
  // ==========================================
  function renderWebinarsGrid() {
    const grid = document.getElementById('webinars-cards-grid');
    let list = [...state.webinars];

    // Filters
    if (webinarsFilter.search) {
      list = list.filter(w => w.name.toLowerCase().includes(webinarsFilter.search));
    }
    if (webinarsFilter.mode) {
      list = list.filter(w => w.mode === webinarsFilter.mode);
    }

    // Sort descending by date
    list.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));

    if (list.length === 0) {
      grid.innerHTML = `
        <div style="grid-column:1/-1; display:flex; justify-content:center; padding: 40px 0;">
          <div class="table-empty-state">
            <i class="fa-solid fa-video-slash" style="font-size:36px; color:var(--text-muted); margin-bottom:12px;"></i>
            <h3>No webinars found</h3>
            <p>Modify search keywords or click "+ Create Webinar" to launch one.</p>
          </div>
        </div>
      `;
      document.getElementById('webinars-pagination-info').innerText = 'Showing 0 to 0 of 0 webinars';
      document.getElementById('webinars-pagination-controls').innerHTML = '';
      return;
    }

    // Pagination
    const total = list.length;
    const pages = Math.ceil(total / pagWebinars.limit);
    if (pagWebinars.page > pages) pagWebinars.page = pages || 1;

    const start = (pagWebinars.page - 1) * pagWebinars.limit;
    const pagList = list.slice(start, start + pagWebinars.limit);

    let html = '';
    pagList.forEach(web => {
      const dateFormatted = formatDate(web.startDate);
      const regsCount = state.registrations.filter(r => r.eventId === web.id).length;
      
      const posterHTML = web.posterBanner
        ? `<img src="${web.posterBanner}" alt="webinar banner">`
        : `<div style="width:100%; height:100%; display:flex; align-items:center; justify-content:center; background:linear-gradient(135deg, rgba(255,46,75,0.2) 0%, rgba(139,92,246,0.2) 100%); font-size:18px; font-weight:700;">${escapeHTML(web.name)}</div>`;

      html += `
        <div class="startup-card" style="gap:10px;">
          <div style="height:120px; border-radius:var(--radius-md); overflow:hidden; background:var(--bg-primary);">
            ${posterHTML}
          </div>
          <div style="margin-top: 4px;">
            <div class="startup-card-title">${escapeHTML(web.name)}</div>
            <div class="startup-card-subtitle" style="font-weight:600; color:var(--accent-red); margin-top:2px;">${escapeHTML(web.overview)}</div>
          </div>
          
          <div class="startup-one-liner" style="font-size:12px; margin-top:4px; max-height:40px; overflow:hidden; text-overflow:ellipsis; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical;">
            ${escapeHTML(web.description)}
          </div>
          
          <div class="startup-stats-row" style="margin-top:10px;">
            <div class="startup-stat-item">
              <span class="startup-stat-label">Date</span>
              <span class="startup-stat-value">${dateFormatted}</span>
            </div>
            <div class="startup-stat-item">
              <span class="startup-stat-label">Mode</span>
              <span class="startup-stat-value"><i class="fa-solid fa-globe" style="font-size:10px; margin-right:4px;"></i>${web.mode}</span>
            </div>
            <div class="startup-stat-item">
              <span class="startup-stat-label">Registrations</span>
              <span class="startup-stat-value">${regsCount}</span>
            </div>
          </div>
          
          <div class="startup-card-actions">
            <button class="btn-outline-gray" style="flex:1; padding:8px 12px; font-size:12px;" onclick="window.dashboardApp.viewWebinarDetails(${web.id})">View Details</button>
            <button class="btn-action-check" onclick="window.dashboardApp.openEditWebinarModal(${web.id})"><i class="fa-regular fa-pen-to-square"></i></button>
            <button class="btn-action-cross" onclick="window.dashboardApp.deleteWebinar(${web.id})"><i class="fa-regular fa-trash-can"></i></button>
          </div>
        </div>
      `;
    });
    grid.innerHTML = html;

    // Pagination info
    const end = Math.min(start + pagWebinars.limit, total);
    document.getElementById('webinars-pagination-info').innerText = `Showing ${start + 1} to ${end} of ${total} webinars`;
    renderPaginationControls('webinars-pagination-controls', pages, pagWebinars, (p) => {
      pagWebinars.page = p;
      renderWebinarsGrid();
    });
  }

  // ==========================================
  // WEBINAR DETAILS VIEW
  // ==========================================
  function viewWebinarDetails(id) {
    window.location.hash = "/admin/webinars/" + id;
  }

  function renderWebinarDetailsPane() {
    const pane = document.getElementById('webinar-details-view');
    const web = state.webinars.find(w => w.id === selectedWebinarId);
    
    if (!web) {
      pane.innerHTML = `<div class="table-empty-state"><i class="fa-solid fa-inbox"></i><p>Webinar details not found.</p></div>`;
      return;
    }

    const regCount = state.registrations.filter(r => r.eventId === web.id).length;
    const posterHTML = web.posterBanner 
      ? `<img src="${web.posterBanner}" style="width:100%; height:100%; object-fit:cover;" alt="webinar poster">`
      : `<div style="width:100%; height:100%; display:flex; align-items:center; justify-content:center; background:linear-gradient(135deg, #ff2e4b 0%, #0b0f19 100%); font-size:24px; font-weight:700;">${escapeHTML(web.name)}</div>`;

    pane.innerHTML = `
      <header class="view-header">
        <div class="header-title-block">
          <a href="#" class="back-to-events-btn" onclick="window.dashboardApp.switchTab('webinars-list'); return false;" style="display:inline-flex; align-items:center; gap:6px; font-size:13px; font-weight:700; color:var(--text-secondary); margin-bottom:8px;">
            <i class="fa-solid fa-arrow-left"></i> Back to Webinars List
          </a>
          <h1 style="font-size:24px; font-weight:800;">${escapeHTML(web.name)}</h1>
          <p>${escapeHTML(web.overview)}</p>
        </div>
        <div class="header-actions" style="display:flex; gap:10px;">
          <button class="btn-outline-gray" onclick="window.dashboardApp.openEditWebinarModal(${web.id})"><i class="fa-regular fa-pen-to-square"></i> Edit Webinar</button>
          <button class="btn-solid-red" style="background-color:var(--accent-red-hover);" onclick="window.dashboardApp.deleteWebinar(${web.id})"><i class="fa-regular fa-trash-can"></i> Delete</button>
        </div>
      </header>
      
      <!-- Specs details Grid -->
      <div class="dashboard-panel-box" style="margin-bottom:24px; padding:20px;">
        <div style="display:flex; gap:20px; flex-wrap:wrap;">
          <div style="width:220px; height:140px; border-radius:var(--radius-md); overflow:hidden; flex-shrink:0; background:var(--bg-primary);">
            ${posterHTML}
          </div>
          
          <div style="flex-grow:1; display:flex; flex-direction:column; gap:12px; min-width:300px;">
            <div class="details-specs-grid" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap:16px;">
              <div class="spec-item">
                <span class="spec-label">Conducted Date</span>
                <span class="spec-value"><i class="fa-regular fa-calendar" style="color:var(--accent-red); margin-right:6px;"></i>${formatDate(web.startDate)} to ${formatDate(web.endDate)}</span>
              </div>
              <div class="spec-item">
                <span class="spec-label">Session Hours</span>
                <span class="spec-value"><i class="fa-regular fa-clock" style="color:var(--accent-red); margin-right:6px;"></i>${formatTime12h(web.startTime)} - ${formatTime12h(web.endTime)} (${web.timezone})</span>
              </div>
              <div class="spec-item">
                <span class="spec-label">Platform / Mode</span>
                <span class="spec-value"><span class="event-row-badge badge-webinar" style="margin-right:6px;">${web.mode}</span>${escapeHTML(web.venue)}</span>
              </div>
              <div class="spec-item">
                <span class="spec-label">Registrations Count</span>
                <span class="spec-value" style="font-weight:700; color:#fff;"><i class="fa-solid fa-users" style="color:var(--accent-red); margin-right:6px;"></i>${regCount} Students</span>
              </div>
            </div>
            
            <div style="border-top:1px solid var(--border-color); padding-top:12px; margin-top:8px;">
              <h4 style="font-size:12px; color:var(--text-muted); text-transform:uppercase; margin-bottom:4px;">Webinar Description</h4>
              <p style="font-size:13px; color:var(--text-secondary); line-height:1.6;">${escapeHTML(web.description)}</p>
            </div>
            
            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(180px, 1fr)); gap:10px; background:rgba(255,255,255,0.02); border:1px solid var(--border-color); padding:12px; border-radius:var(--radius-sm);">
              <div style="font-size:12px;"><span style="color:var(--text-muted);">Coordinator:</span> <strong style="color:#fff;">${escapeHTML(web.contactName)}</strong></div>
              <div style="font-size:12px;"><span style="color:var(--text-muted);">Mobile:</span> <strong style="color:#fff;">${escapeHTML(web.contactPhone)}</strong></div>
              <div style="font-size:12px;"><span style="color:var(--text-muted);">Email:</span> <strong style="color:#fff;">${escapeHTML(web.contactEmail)}</strong></div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Nested Registrations List -->
      <div class="table-section">
        <div class="table-header-flex">
          <div style="display:flex; align-items:center; gap:10px;">
            <span class="table-section-title">Registered Students</span>
            <button class="btn-solid-red" style="padding:6px 12px; font-size:11px;" onclick="window.dashboardApp.openAddStudentToEventModal('webinar', ${web.id})">
              <i class="fa-solid fa-user-plus"></i> Register Student
            </button>
          </div>
          
          <div class="table-search-box">
            <div class="search-input-wrapper">
              <i class="fa-solid fa-magnifying-glass"></i>
              <input type="text" class="search-input" id="details-students-search" placeholder="Search student name or email...">
            </div>
            
            <div class="dropdown-action-container" id="details-students-export-container">
              <button class="btn-export" id="details-students-export-btn">
                <i class="fa-solid fa-download"></i> Export <i class="fa-solid fa-chevron-down" style="font-size:10px;"></i>
              </button>
              <div class="export-popover-menu" id="details-students-export-menu">
                <div class="export-popover-item" onclick="window.dashboardApp.exportWebinarDetailsCSV('Registrations')"><i class="fa-solid fa-users"></i> Export Registrations</div>
                <div class="export-popover-item" onclick="window.dashboardApp.exportWebinarDetailsCSV('Details')"><i class="fa-solid fa-user-graduate"></i> Export Student Details</div>
                <div class="export-popover-item" onclick="window.dashboardApp.exportWebinarDetailsCSV('Complete')"><i class="fa-solid fa-database"></i> Export Complete Webinar Data</div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Registration ID</th>
                <th>Student ID</th>
                <th>Student Name</th>
                <th>Email</th>
                <th>Phone Number</th>
                <th>College</th>
                <th>Branch</th>
                <th>Year</th>
                <th>Registration Date</th>
              </tr>
            </thead>
            <tbody id="details-students-tbody">
              <!-- Loaded dynamically -->
            </tbody>
          </table>
        </div>
        
        <div class="table-pagination-footer">
          <span class="pagination-info" id="details-students-pagination-info">Showing 0 to 0 of 0 students</span>
          <div class="pagination-controls">
            <div class="page-selector-wrapper">
              <select class="page-size-select" id="details-students-page-size">
                <option value="5">5 / page</option>
                <option value="10" selected>10 / page</option>
                <option value="25">25 / page</option>
              </select>
            </div>
            <div class="events-pagination" id="details-students-pagination-controls" style="padding:0; border:none; margin:0;"></div>
          </div>
        </div>
      </div>
    `;

    // Re-bind popover toggle to details export
    bindPopoverToggle('details-students-export-btn', 'details-students-export-menu');
    
    // Bind search and size select inputs
    const detSearch = document.getElementById('details-students-search');
    detSearch.value = detailsStudentsSearch;
    detSearch.addEventListener('input', (e) => {
      detailsStudentsSearch = e.target.value.toLowerCase();
      pagDetailsStudents.page = 1;
      renderWebinarDetailsStudents();
    });

    const detSize = document.getElementById('details-students-page-size');
    detSize.value = pagDetailsStudents.limit;
    detSize.addEventListener('change', (e) => {
      pagDetailsStudents.limit = parseInt(e.target.value);
      pagDetailsStudents.page = 1;
      renderWebinarDetailsStudents();
    });

    renderWebinarDetailsStudents();
  }

  function renderWebinarDetailsStudents() {
    const tbody = document.getElementById('details-students-tbody');
    const web = state.webinars.find(w => w.id === selectedWebinarId);
    if (!web) return;

    // Filter registrations
    let regs = state.registrations.filter(r => r.eventId === web.id);
    let rows = [];
    
    regs.forEach(reg => {
      const stud = state.students.find(s => s.id === reg.studentId);
      if (stud) {
        rows.push({ reg, stud });
      }
    });

    if (detailsStudentsSearch) {
      rows = rows.filter(item => 
        item.stud.name.toLowerCase().includes(detailsStudentsSearch) ||
        item.stud.email.toLowerCase().includes(detailsStudentsSearch)
      );
    }

    if (rows.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="9" class="text-center">
            <div class="table-empty-state">
              <i class="fa-solid fa-users-slash"></i>
              <p>No registered students found.</p>
            </div>
          </td>
        </tr>
      `;
      document.getElementById('details-students-pagination-info').innerText = 'Showing 0 to 0 of 0 students';
      document.getElementById('details-students-pagination-controls').innerHTML = '';
      return;
    }

    // Sort descending by registration date
    rows.sort((a, b) => new Date(b.reg.registrationDate) - new Date(a.reg.registrationDate));

    // Pagination
    const total = rows.length;
    const pages = Math.ceil(total / pagDetailsStudents.limit);
    if (pagDetailsStudents.page > pages) pagDetailsStudents.page = pages || 1;

    const start = (pagDetailsStudents.page - 1) * pagDetailsStudents.limit;
    const pagRows = rows.slice(start, start + pagDetailsStudents.limit);

    let html = '';
    pagRows.forEach(item => {
      const rDate = formatDate(item.reg.registrationDate);
      html += `
        <tr>
          <td class="row-id">${escapeHTML(item.reg.id)}</td>
          <td>${escapeHTML(item.stud.id)}</td>
          <td style="font-weight:700;">${escapeHTML(item.stud.name)}</td>
          <td>${escapeHTML(item.stud.email)}</td>
          <td>${escapeHTML(item.stud.phone)}</td>
          <td>${escapeHTML(item.stud.college)}</td>
          <td>${escapeHTML(item.stud.branch)}</td>
          <td>${item.stud.year} Year</td>
          <td><i class="fa-regular fa-calendar-days" style="color:var(--accent-red); margin-right:6px;"></i>${rDate}</td>
        </tr>
      `;
    });
    tbody.innerHTML = html;

    const end = Math.min(start + pagDetailsStudents.limit, total);
    document.getElementById('details-students-pagination-info').innerText = `Showing ${start + 1} to ${end} of ${total} students`;
    renderPaginationControls('details-students-pagination-controls', pages, pagDetailsStudents, (p) => {
      pagDetailsStudents.page = p;
      renderWebinarDetailsStudents();
    });
  }

  // ==========================================
  // RENDERER: HACKATHONS MANAGEMENT
  // ==========================================
  function renderHackathonsGrid() {
    const grid = document.getElementById('hackathons-cards-grid');
    let list = [...state.hackathons];

    // Filters
    if (hackathonsFilter.search) {
      list = list.filter(h => h.name.toLowerCase().includes(hackathonsFilter.search));
    }
    if (hackathonsFilter.participation) {
      list = list.filter(h => h.participation === hackathonsFilter.participation);
    }

    list.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));

    if (list.length === 0) {
      grid.innerHTML = `
        <div style="grid-column:1/-1; display:flex; justify-content:center; padding: 40px 0;">
          <div class="table-empty-state">
            <i class="fa-solid fa-code-compare" style="font-size:36px; color:var(--text-muted); margin-bottom:12px;"></i>
            <h3>No hackathons found</h3>
            <p>Modify search filters or click "+ Create Hackathon" to schedule.</p>
          </div>
        </div>
      `;
      document.getElementById('hackathons-pagination-info').innerText = 'Showing 0 to 0 of 0 hackathons';
      document.getElementById('hackathons-pagination-controls').innerHTML = '';
      return;
    }

    const total = list.length;
    const pages = Math.ceil(total / pagHackathons.limit);
    if (pagHackathons.page > pages) pagHackathons.page = pages || 1;

    const start = (pagHackathons.page - 1) * pagHackathons.limit;
    const pagList = list.slice(start, start + pagHackathons.limit);

    let html = '';
    pagList.forEach(hack => {
      const dateFormatted = formatDate(hack.startDate);
      const regsCount = state.registrations.filter(r => r.eventId === hack.id).length;
      
      const posterHTML = hack.posterBanner
        ? `<img src="${hack.posterBanner}" alt="hackathon banner">`
        : `<div style="width:100%; height:100%; display:flex; align-items:center; justify-content:center; background:linear-gradient(135deg, rgba(8,128,239,0.2) 0%, rgba(255,46,75,0.2) 100%); font-size:18px; font-weight:700;">${escapeHTML(hack.name)}</div>`;

      html += `
        <div class="startup-card" style="gap:10px;">
          <div style="height:120px; border-radius:var(--radius-md); overflow:hidden; background:var(--bg-primary);">
            ${posterHTML}
          </div>
          <div style="margin-top: 4px;">
            <div class="startup-card-title">${escapeHTML(hack.name)}</div>
            <div class="startup-card-subtitle" style="font-weight:600; color:var(--accent-red); margin-top:2px;">Conducted by: ${escapeHTML(hack.conductedBy)}</div>
          </div>
          
          <div class="startup-one-liner" style="font-size:12px; margin-top:4px; max-height:40px; overflow:hidden; text-overflow:ellipsis; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical;">
            ${escapeHTML(hack.description)}
          </div>
          
          <div class="startup-stats-row" style="margin-top:10px;">
            <div class="startup-stat-item">
              <span class="startup-stat-label">Format</span>
              <span class="startup-stat-value">${hack.participation} (${hack.minTeamSize}-${hack.maxTeamSize} size)</span>
            </div>
            <div class="startup-stat-item">
              <span class="startup-stat-label">Start Date</span>
              <span class="startup-stat-value">${dateFormatted}</span>
            </div>
            <div class="startup-stat-item">
              <span class="startup-stat-label">Registrations</span>
              <span class="startup-stat-value">${regsCount}</span>
            </div>
          </div>
          
          <div class="startup-card-actions">
            <button class="btn-outline-gray" style="flex:1; padding:8px 12px; font-size:12px;" onclick="window.dashboardApp.viewHackathonDetails(${hack.id})">View Details</button>
            <button class="btn-action-check" onclick="window.dashboardApp.openEditHackathonModal(${hack.id})"><i class="fa-regular fa-pen-to-square"></i></button>
            <button class="btn-action-cross" onclick="window.dashboardApp.deleteHackathon(${hack.id})"><i class="fa-regular fa-trash-can"></i></button>
          </div>
        </div>
      `;
    });
    grid.innerHTML = html;

    const end = Math.min(start + pagHackathons.limit, total);
    document.getElementById('hackathons-pagination-info').innerText = `Showing ${start + 1} to ${end} of ${total} hackathons`;
    renderPaginationControls('hackathons-pagination-controls', pages, pagHackathons, (p) => {
      pagHackathons.page = p;
      renderHackathonsGrid();
    });
  }

  // ==========================================
  // HACKATHON DETAILS VIEW
  // ==========================================
  function viewHackathonDetails(id) {
    window.location.hash = "/admin/hackathons/" + id;
  }

  function renderHackathonDetailsPane() {
    const pane = document.getElementById('hackathon-details-view');
    const hack = state.hackathons.find(h => h.id === selectedHackathonId);
    
    if (!hack) {
      pane.innerHTML = `<div class="table-empty-state"><i class="fa-solid fa-inbox"></i><p>Hackathon details not found.</p></div>`;
      return;
    }

    const regCount = state.registrations.filter(r => r.eventId === hack.id).length;
    const posterHTML = hack.posterBanner 
      ? `<img src="${hack.posterBanner}" style="width:100%; height:100%; object-fit:cover;" alt="hackathon banner">`
      : `<div style="width:100%; height:100%; display:flex; align-items:center; justify-content:center; background:linear-gradient(135deg, #ff2e4b 0%, #0b0f19 100%); font-size:24px; font-weight:700;">${escapeHTML(hack.name)}</div>`;

    pane.innerHTML = `
      <header class="view-header">
        <div class="header-title-block">
          <a href="#" class="back-to-events-btn" onclick="window.dashboardApp.switchTab('hackathons-list'); return false;" style="display:inline-flex; align-items:center; gap:6px; font-size:13px; font-weight:700; color:var(--text-secondary); margin-bottom:8px;">
            <i class="fa-solid fa-arrow-left"></i> Back to Hackathons List
          </a>
          <h1 style="font-size:24px; font-weight:800;">${escapeHTML(hack.name)}</h1>
          <p>Conducted by: <strong>${escapeHTML(hack.conductedBy)}</strong></p>
        </div>
        <div class="header-actions" style="display:flex; gap:10px;">
          <button class="btn-outline-gray" onclick="window.dashboardApp.openEditHackathonModal(${hack.id})"><i class="fa-regular fa-pen-to-square"></i> Edit Details</button>
          <button class="btn-solid-red" style="background-color:var(--accent-red-hover);" onclick="window.dashboardApp.deleteHackathon(${hack.id})"><i class="fa-regular fa-trash-can"></i> Delete</button>
        </div>
      </header>
      
      <!-- Specs details Grid -->
      <div class="dashboard-panel-box" style="margin-bottom:24px; padding:20px;">
        <div style="display:flex; gap:20px; flex-wrap:wrap;">
          <div style="width:220px; height:140px; border-radius:var(--radius-md); overflow:hidden; flex-shrink:0; background:var(--bg-primary);">
            ${posterHTML}
          </div>
          
          <div style="flex-grow:1; display:flex; flex-direction:column; gap:12px; min-width:300px;">
            <div class="details-specs-grid" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap:16px;">
              <div class="spec-item">
                <span class="spec-label">Timeline Duration</span>
                <span class="spec-value"><i class="fa-regular fa-calendar" style="color:var(--accent-red); margin-right:6px;"></i>${formatDate(hack.startDate)} to ${formatDate(hack.endDate)}</span>
              </div>
              <div class="spec-item">
                <span class="spec-label">Daily Hours</span>
                <span class="spec-value"><i class="fa-regular fa-clock" style="color:var(--accent-red); margin-right:6px;"></i>${formatTime12h(hack.startTime)} - ${formatTime12h(hack.endTime)} (${hack.timezone})</span>
              </div>
              <div class="spec-item">
                <span class="spec-label">Platform / Mode</span>
                <span class="spec-value"><span class="event-row-badge badge-hackathon" style="margin-right:6px;">${hack.mode}</span>${escapeHTML(hack.venue)}</span>
              </div>
              <div class="spec-item">
                <span class="spec-label">Eligibility / Certificates</span>
                <span class="spec-value"><i class="fa-solid fa-award" style="color:var(--accent-red); margin-right:6px;"></i>Certificates: ${hack.certificateAvailable}</span>
              </div>
              <div class="spec-item">
                <span class="spec-label">Format size</span>
                <span class="spec-value"><i class="fa-solid fa-users" style="color:var(--accent-red); margin-right:6px;"></i>${hack.participation} (Min: ${hack.minTeamSize}, Max: ${hack.maxTeamSize})</span>
              </div>
              <div class="spec-item">
                <span class="spec-label">Registrations Count</span>
                <span class="spec-value" style="font-weight:700; color:#fff;"><i class="fa-solid fa-users" style="color:var(--accent-red); margin-right:6px;"></i>${regCount} Enrolled</span>
              </div>
            </div>
            
            <div style="border-top:1px solid var(--border-color); padding-top:12px; margin-top:8px;">
              <h4 style="font-size:12px; color:var(--text-muted); text-transform:uppercase; margin-bottom:4px;">Hackathon Description & Rules</h4>
              <p style="font-size:13px; color:var(--text-secondary); line-height:1.6;">${escapeHTML(hack.description)}</p>
            </div>
            
            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(180px, 1fr)); gap:10px; background:rgba(255,255,255,0.02); border:1px solid var(--border-color); padding:12px; border-radius:var(--radius-sm);">
              <div style="font-size:12px;"><span style="color:var(--text-muted);">Coordinator:</span> <strong style="color:#fff;">${escapeHTML(hack.contactName)}</strong></div>
              <div style="font-size:12px;"><span style="color:var(--text-muted);">Mobile:</span> <strong style="color:#fff;">${escapeHTML(hack.contactPhone)}</strong></div>
              <div style="font-size:12px;"><span style="color:var(--text-muted);">Email:</span> <strong style="color:#fff;">${escapeHTML(hack.contactEmail)}</strong></div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Nested Registrations List -->
      <div class="table-section">
        <div class="table-header-flex">
          <div style="display:flex; align-items:center; gap:10px;">
            <span class="table-section-title">Registered Students</span>
            <button class="btn-solid-red" style="padding:6px 12px; font-size:11px;" onclick="window.dashboardApp.openAddStudentToEventModal('hackathon', ${hack.id})">
              <i class="fa-solid fa-user-plus"></i> Register Student
            </button>
          </div>
          
          <div class="table-search-box">
            <div class="search-input-wrapper">
              <i class="fa-solid fa-magnifying-glass"></i>
              <input type="text" class="search-input" id="details-students-search" placeholder="Search student name or email...">
            </div>
            
            <div class="dropdown-action-container" id="details-students-export-container">
              <button class="btn-export" id="details-students-export-btn">
                <i class="fa-solid fa-download"></i> Export <i class="fa-solid fa-chevron-down" style="font-size:10px;"></i>
              </button>
              <div class="export-popover-menu" id="details-students-export-menu">
                <div class="export-popover-item" onclick="window.dashboardApp.exportHackathonDetailsCSV('Registrations')"><i class="fa-solid fa-users"></i> Export Registrations</div>
                <div class="export-popover-item" onclick="window.dashboardApp.exportHackathonDetailsCSV('Teams')"><i class="fa-solid fa-user-group"></i> Export Team Details</div>
                <div class="export-popover-item" onclick="window.dashboardApp.exportHackathonDetailsCSV('Complete')"><i class="fa-solid fa-database"></i> Export Complete Hackathon Data</div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Registration ID</th>
                <th>Student ID</th>
                <th>Student Name</th>
                <th>Email</th>
                <th>Phone Number</th>
                <th>College</th>
                <th>Branch</th>
                <th>Year</th>
                <th>Registration Date</th>
              </tr>
            </thead>
            <tbody id="details-students-tbody">
              <!-- Loaded dynamically -->
            </tbody>
          </table>
        </div>
        
        <div class="table-pagination-footer">
          <span class="pagination-info" id="details-students-pagination-info">Showing 0 to 0 of 0 students</span>
          <div class="pagination-controls">
            <div class="page-selector-wrapper">
              <select class="page-size-select" id="details-students-page-size">
                <option value="5">5 / page</option>
                <option value="10" selected>10 / page</option>
                <option value="25">25 / page</option>
              </select>
            </div>
            <div class="events-pagination" id="details-students-pagination-controls" style="padding:0; border:none; margin:0;"></div>
          </div>
        </div>
      </div>
    `;

    bindPopoverToggle('details-students-export-btn', 'details-students-export-menu');

    const detSearch = document.getElementById('details-students-search');
    detSearch.value = detailsStudentsSearch;
    detSearch.addEventListener('input', (e) => {
      detailsStudentsSearch = e.target.value.toLowerCase();
      pagDetailsStudents.page = 1;
      renderHackathonDetailsStudents();
    });

    const detSize = document.getElementById('details-students-page-size');
    detSize.value = pagDetailsStudents.limit;
    detSize.addEventListener('change', (e) => {
      pagDetailsStudents.limit = parseInt(e.target.value);
      pagDetailsStudents.page = 1;
      renderHackathonDetailsStudents();
    });

    renderHackathonDetailsStudents();
  }

  function renderHackathonDetailsStudents() {
    const tbody = document.getElementById('details-students-tbody');
    const hack = state.hackathons.find(h => h.id === selectedHackathonId);
    if (!hack) return;

    let regs = state.registrations.filter(r => r.eventId === hack.id);
    let rows = [];
    
    regs.forEach(reg => {
      const stud = state.students.find(s => s.id === reg.studentId);
      if (stud) {
        rows.push({ reg, stud });
      }
    });

    if (detailsStudentsSearch) {
      rows = rows.filter(item => 
        item.stud.name.toLowerCase().includes(detailsStudentsSearch) ||
        item.stud.email.toLowerCase().includes(detailsStudentsSearch)
      );
    }

    if (rows.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="9" class="text-center">
            <div class="table-empty-state">
              <i class="fa-solid fa-users-slash"></i>
              <p>No registered students found.</p>
            </div>
          </td>
        </tr>
      `;
      document.getElementById('details-students-pagination-info').innerText = 'Showing 0 to 0 of 0 students';
      document.getElementById('details-students-pagination-controls').innerHTML = '';
      return;
    }

    rows.sort((a, b) => new Date(b.reg.registrationDate) - new Date(a.reg.registrationDate));

    const total = rows.length;
    const pages = Math.ceil(total / pagDetailsStudents.limit);
    if (pagDetailsStudents.page > pages) pagDetailsStudents.page = pages || 1;

    const start = (pagDetailsStudents.page - 1) * pagDetailsStudents.limit;
    const pagRows = rows.slice(start, start + pagDetailsStudents.limit);

    let html = '';
    pagRows.forEach(item => {
      const rDate = formatDate(item.reg.registrationDate);
      html += `
        <tr>
          <td class="row-id">${escapeHTML(item.reg.id)}</td>
          <td>${escapeHTML(item.stud.id)}</td>
          <td style="font-weight:700;">${escapeHTML(item.stud.name)}</td>
          <td>${escapeHTML(item.stud.email)}</td>
          <td>${escapeHTML(item.stud.phone)}</td>
          <td>${escapeHTML(item.stud.college)}</td>
          <td>${escapeHTML(item.stud.branch)}</td>
          <td>${item.stud.year} Year</td>
          <td><i class="fa-regular fa-calendar-days" style="color:var(--accent-red); margin-right:6px;"></i>${rDate}</td>
        </tr>
      `;
    });
    tbody.innerHTML = html;

    const end = Math.min(start + pagDetailsStudents.limit, total);
    document.getElementById('details-students-pagination-info').innerText = `Showing ${start + 1} to ${end} of ${total} students`;
    renderPaginationControls('details-students-pagination-controls', pages, pagDetailsStudents, (p) => {
      pagDetailsStudents.page = p;
      renderHackathonDetailsStudents();
    });
  }

  // ==========================================
  // RENDERER: PITCH EVENTS MANAGEMENT
  // ==========================================
  function renderPitchEventsGrid() {
    const grid = document.getElementById('pitch-events-cards-grid');
    let list = [...state.pitchEvents];

    if (pitchEventsFilter.search) {
      list = list.filter(p => p.name.toLowerCase().includes(pitchEventsFilter.search));
    }

    list.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));

    if (list.length === 0) {
      grid.innerHTML = `
        <div style="grid-column:1/-1; display:flex; justify-content:center; padding: 40px 0;">
          <div class="table-empty-state">
            <i class="fa-solid fa-microphone-slash" style="font-size:36px; color:var(--text-muted); margin-bottom:12px;"></i>
            <h3>No pitch events scheduled</h3>
            <p>Click "+ Create Pitch Event" to create one.</p>
          </div>
        </div>
      `;
      document.getElementById('pitch-events-pagination-info').innerText = 'Showing 0 to 0 of 0 events';
      document.getElementById('pitch-events-pagination-controls').innerHTML = '';
      return;
    }

    const total = list.length;
    const pages = Math.ceil(total / pagPitchEvents.limit);
    if (pagPitchEvents.page > pages) pagPitchEvents.page = pages || 1;

    const start = (pagPitchEvents.page - 1) * pagPitchEvents.limit;
    const pagList = list.slice(start, start + pagPitchEvents.limit);

    let html = '';
    pagList.forEach(pe => {
      const dateFormatted = formatDate(pe.startDate);
      const regsCount = state.pitchRegistrations.filter(r => r.eventId === pe.id).length;
      
      const posterHTML = pe.posterBanner
        ? `<img src="${pe.posterBanner}" alt="pitch event banner">`
        : `<div style="width:100%; height:100%; display:flex; align-items:center; justify-content:center; background:linear-gradient(135deg, rgba(245,158,11,0.2) 0%, rgba(255,46,75,0.2) 100%); font-size:18px; font-weight:700;">${escapeHTML(pe.name)}</div>`;

      html += `
        <div class="startup-card" style="gap:10px;">
          <div style="height:120px; border-radius:var(--radius-md); overflow:hidden; background:var(--bg-primary);">
            ${posterHTML}
          </div>
          <div style="margin-top: 4px;">
            <div class="startup-card-title">${escapeHTML(pe.name)}</div>
            <div class="startup-card-subtitle" style="font-weight:600; color:var(--accent-red); margin-top:2px;">Ticket Name: ${escapeHTML(pe.ticketName)} &bull; Price: ₹${pe.ticketPrice || 'Free'}</div>
          </div>
          
          <div class="startup-one-liner" style="font-size:12px; margin-top:4px; max-height:40px; overflow:hidden; text-overflow:ellipsis; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical;">
            ${escapeHTML(pe.overview || pe.description)}
          </div>
          
          <div class="startup-stats-row" style="margin-top:10px;">
            <div class="startup-stat-item">
              <span class="startup-stat-label">Conducted Date</span>
              <span class="startup-stat-value">${dateFormatted}</span>
            </div>
            <div class="startup-stat-item">
              <span class="startup-stat-label">Venue / Platform</span>
              <span class="startup-stat-value">${escapeHTML(pe.venue)}</span>
            </div>
            <div class="startup-stat-item">
              <span class="startup-stat-label">Participants</span>
              <span class="startup-stat-value">${regsCount}</span>
            </div>
          </div>
          
          <div class="startup-card-actions">
            <button class="btn-outline-gray" style="flex:1; padding:8px 12px; font-size:12px;" onclick="window.dashboardApp.viewPitchEventDetails(${pe.id})">View Details</button>
            <button class="btn-action-check" onclick="window.dashboardApp.openEditPitchEventModal(${pe.id})"><i class="fa-regular fa-pen-to-square"></i></button>
            <button class="btn-action-cross" onclick="window.dashboardApp.deletePitchEvent(${pe.id})"><i class="fa-regular fa-trash-can"></i></button>
          </div>
        </div>
      `;
    });
    grid.innerHTML = html;

    const end = Math.min(start + pagPitchEvents.limit, total);
    document.getElementById('pitch-events-pagination-info').innerText = `Showing ${start + 1} to ${end} of ${total} events`;
    renderPaginationControls('pitch-events-pagination-controls', pages, pagPitchEvents, (p) => {
      pagPitchEvents.page = p;
      renderPitchEventsGrid();
    });
  }

  // ==========================================
  // PITCH EVENT DETAILS VIEW
  // ==========================================
  function viewPitchEventDetails(id) {
    selectedPitchEventId = id;
    switchTab('pitch-event-details');
    renderPitchEventDetailsPane();
  }

  function renderPitchEventDetailsPane() {
    const pane = document.getElementById('pitch-event-details-view');
    const pe = state.pitchEvents.find(p => p.id === selectedPitchEventId);
    
    if (!pe) {
      pane.innerHTML = `<div class="table-empty-state"><i class="fa-solid fa-inbox"></i><p>Event details not found.</p></div>`;
      return;
    }

    const regCount = state.pitchRegistrations.filter(r => r.eventId === pe.id).length;
    const posterHTML = pe.posterBanner 
      ? `<img src="${pe.posterBanner}" style="width:100%; height:100%; object-fit:cover;" alt="event poster">`
      : `<div style="width:100%; height:100%; display:flex; align-items:center; justify-content:center; background:linear-gradient(135deg, #ff2e4b 0%, #0b0f19 100%); font-size:24px; font-weight:700;">${escapeHTML(pe.name)}</div>`;

    pane.innerHTML = `
      <header class="view-header">
        <div class="header-title-block">
          <a href="#" class="back-to-events-btn" onclick="window.dashboardApp.switchTab('pitch-events-list'); return false;" style="display:inline-flex; align-items:center; gap:6px; font-size:13px; font-weight:700; color:var(--text-secondary); margin-bottom:8px;">
            <i class="fa-solid fa-arrow-left"></i> Back to Pitch Events List
          </a>
          <h1 style="font-size:24px; font-weight:800;">${escapeHTML(pe.name)}</h1>
          <p>Venue: <strong>${escapeHTML(pe.venue)}</strong></p>
        </div>
        <div class="header-actions" style="display:flex; gap:10px;">
          <button class="btn-outline-gray" onclick="window.dashboardApp.openEditPitchEventModal(${pe.id})"><i class="fa-regular fa-pen-to-square"></i> Edit Event</button>
          <button class="btn-solid-red" style="background-color:var(--accent-red-hover);" onclick="window.dashboardApp.deletePitchEvent(${pe.id})"><i class="fa-regular fa-trash-can"></i> Delete</button>
        </div>
      </header>
      
      <!-- Specs details Grid -->
      <div class="dashboard-panel-box" style="margin-bottom:24px; padding:20px;">
        <div style="display:flex; gap:20px; flex-wrap:wrap;">
          <div style="width:220px; height:140px; border-radius:var(--radius-md); overflow:hidden; flex-shrink:0; background:var(--bg-primary);">
            ${posterHTML}
          </div>
          
          <div style="flex-grow:1; display:flex; flex-direction:column; gap:12px; min-width:300px;">
            <div class="details-specs-grid" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap:16px;">
              <div class="spec-item">
                <span class="spec-label">Timeline Date</span>
                <span class="spec-value"><i class="fa-regular fa-calendar" style="color:var(--accent-red); margin-right:6px;"></i>${formatDate(pe.startDate)} to ${formatDate(pe.endDate)}</span>
              </div>
              <div class="spec-item">
                <span class="spec-label">Session Hours</span>
                <span class="spec-value"><i class="fa-regular fa-clock" style="color:var(--accent-red); margin-right:6px;"></i>${formatTime12h(pe.startTime)} - ${formatTime12h(pe.endTime)} (${pe.timezone})</span>
              </div>
              <div class="spec-item">
                <span class="spec-label">Platform Details</span>
                <span class="spec-value"><span class="event-row-badge badge-webinar" style="margin-right:6px;">${pe.mode}</span>${escapeHTML(pe.venue)}</span>
              </div>
              <div class="spec-item">
                <span class="spec-label">Participants Count</span>
                <span class="spec-value" style="font-weight:700; color:#fff;"><i class="fa-solid fa-users" style="color:var(--accent-red); margin-right:6px;"></i>${regCount} registered</span>
              </div>
            </div>
            
            <div style="border-top:1px solid var(--border-color); padding-top:12px; margin-top:8px;">
              <h4 style="font-size:12px; color:var(--text-muted); text-transform:uppercase; margin-bottom:4px;">Event Overview</h4>
              <p style="font-size:13px; color:#fff; font-weight:600; line-height:1.6; margin-bottom:12px;">${escapeHTML(pe.overview || '')}</p>
              
              <h4 style="font-size:12px; color:var(--text-muted); text-transform:uppercase; margin-bottom:4px;">Event Description</h4>
              <p style="font-size:13px; color:var(--text-secondary); line-height:1.6;">${escapeHTML(pe.description)}</p>
            </div>
            
            <!-- Ticket Info Panel -->
            <div class="ticket-list-wrapper">
              <h4 style="font-size:12px; color:var(--text-muted); text-transform:uppercase; margin-bottom:4px;">Accompanying Ticket Tier</h4>
              <div class="ticket-item-row">
                <div class="ticket-item-left">
                  <span class="ticket-item-title">${escapeHTML(pe.ticketName)}</span>
                  <span class="ticket-item-desc">${escapeHTML(pe.ticketDescription || 'Platform standard entry voucher')}</span>
                  <span class="ticket-item-dates">Sale Period: ${formatDate(pe.saleStartDate || pe.startDate)} to ${formatDate(pe.saleEndDate || pe.endDate)}</span>
                </div>
                <div class="ticket-item-price">₹${pe.ticketPrice || 'Free'}</div>
              </div>
            </div>

            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(180px, 1fr)); gap:10px; background:rgba(255,255,255,0.02); border:1px solid var(--border-color); padding:12px; border-radius:var(--radius-sm); margin-top:10px;">
              <div style="font-size:12px;"><span style="color:var(--text-muted);">Coordinator:</span> <strong style="color:#fff;">${escapeHTML(pe.contactName)}</strong></div>
              <div style="font-size:12px;"><span style="color:var(--text-muted);">Mobile:</span> <strong style="color:#fff;">${escapeHTML(pe.contactPhone)}</strong></div>
              <div style="font-size:12px;"><span style="color:var(--text-muted);">Email:</span> <strong style="color:#fff;">${escapeHTML(pe.contactEmail)}</strong></div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Nested Registrations List -->
      <div class="table-section">
        <div class="table-header-flex">
          <div style="display:flex; align-items:center; gap:10px;">
            <span class="table-section-title">Registered Participants</span>
            <button class="btn-solid-red" style="padding:6px 12px; font-size:11px;" onclick="window.dashboardApp.openAddStudentToEventModal('pitch', ${pe.id})">
              <i class="fa-solid fa-user-plus"></i> Register Participant
            </button>
          </div>
          
          <div class="table-search-box">
            <div class="search-input-wrapper">
              <i class="fa-solid fa-magnifying-glass"></i>
              <input type="text" class="search-input" id="details-students-search" placeholder="Search participant name...">
            </div>
            
            <div class="dropdown-action-container" id="details-students-export-container">
              <button class="btn-export" id="details-students-export-btn">
                <i class="fa-solid fa-download"></i> Export <i class="fa-solid fa-chevron-down" style="font-size:10px;"></i>
              </button>
              <div class="export-popover-menu" id="details-students-export-menu">
                <div class="export-popover-item" onclick="window.dashboardApp.exportPitchDetailsCSV('Participants')"><i class="fa-solid fa-users"></i> Export Participants</div>
                <div class="export-popover-item" onclick="window.dashboardApp.exportPitchDetailsCSV('Sales')"><i class="fa-solid fa-circle-dollar-to-slot"></i> Export Ticket Sales</div>
                <div class="export-popover-item" onclick="window.dashboardApp.exportPitchDetailsCSV('Complete')"><i class="fa-solid fa-database"></i> Export Complete Event Data</div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Participant ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone Number</th>
                <th>Startup Name</th>
                <th>Ticket Type</th>
                <th>Registration Date</th>
              </tr>
            </thead>
            <tbody id="details-students-tbody">
              <!-- Loaded dynamically -->
            </tbody>
          </table>
        </div>
        
        <div class="table-pagination-footer">
          <span class="pagination-info" id="details-students-pagination-info">Showing 0 to 0 of 0 participants</span>
          <div class="pagination-controls">
            <div class="page-selector-wrapper">
              <select class="page-size-select" id="details-students-page-size">
                <option value="5">5 / page</option>
                <option value="10" selected>10 / page</option>
                <option value="25">25 / page</option>
              </select>
            </div>
            <div class="events-pagination" id="details-students-pagination-controls" style="padding:0; border:none; margin:0;"></div>
          </div>
        </div>
      </div>
    `;

    bindPopoverToggle('details-students-export-btn', 'details-students-export-menu');

    const detSearch = document.getElementById('details-students-search');
    detSearch.value = detailsStudentsSearch;
    detSearch.addEventListener('input', (e) => {
      detailsStudentsSearch = e.target.value.toLowerCase();
      pagDetailsStudents.page = 1;
      renderPitchDetailsParticipants();
    });

    const detSize = document.getElementById('details-students-page-size');
    detSize.value = pagDetailsStudents.limit;
    detSize.addEventListener('change', (e) => {
      pagDetailsStudents.limit = parseInt(e.target.value);
      pagDetailsStudents.page = 1;
      renderPitchDetailsParticipants();
    });

    renderPitchDetailsParticipants();
  }

  function renderPitchDetailsParticipants() {
    const tbody = document.getElementById('details-students-tbody');
    const pe = state.pitchEvents.find(p => p.id === selectedPitchEventId);
    if (!pe) return;

    let regs = state.pitchRegistrations.filter(r => r.eventId === pe.id);
    let rows = [];
    
    regs.forEach(reg => {
      const stud = state.students.find(s => s.id === reg.studentId);
      if (stud) {
        rows.push({ reg, stud });
      }
    });

    if (detailsStudentsSearch) {
      rows = rows.filter(item => 
        item.stud.name.toLowerCase().includes(detailsStudentsSearch) ||
        item.stud.email.toLowerCase().includes(detailsStudentsSearch)
      );
    }

    if (rows.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" class="text-center">
            <div class="table-empty-state">
              <i class="fa-solid fa-users-slash"></i>
              <p>No registered participants found.</p>
            </div>
          </td>
        </tr>
      `;
      document.getElementById('details-students-pagination-info').innerText = 'Showing 0 to 0 of 0 participants';
      document.getElementById('details-students-pagination-controls').innerHTML = '';
      return;
    }

    rows.sort((a, b) => new Date(b.reg.registrationDate) - new Date(a.reg.registrationDate));

    const total = rows.length;
    const pages = Math.ceil(total / pagDetailsStudents.limit);
    if (pagDetailsStudents.page > pages) pagDetailsStudents.page = pages || 1;

    const start = (pagDetailsStudents.page - 1) * pagDetailsStudents.limit;
    const pagRows = rows.slice(start, start + pagDetailsStudents.limit);

    let html = '';
    pagRows.forEach(item => {
      const rDate = formatDate(item.reg.registrationDate);
      
      // Pitch participant fields: Participant ID (e.g. PR-STU001), startup name, ticket name, registrationDate
      html += `
        <tr>
          <td class="row-id">${escapeHTML(item.reg.id)}</td>
          <td style="font-weight:700;">${escapeHTML(item.stud.name)}</td>
          <td>${escapeHTML(item.stud.email)}</td>
          <td>${escapeHTML(item.stud.phone)}</td>
          <td>${escapeHTML(item.stud.college)} Corp</td>
          <td><span class="badge-investor" style="font-size:10px;">${escapeHTML(pe.ticketName)}</span></td>
          <td><i class="fa-regular fa-calendar-days" style="color:var(--accent-red); margin-right:6px;"></i>${rDate}</td>
        </tr>
      `;
    });
    tbody.innerHTML = html;

    const end = Math.min(start + pagDetailsStudents.limit, total);
    document.getElementById('details-students-pagination-info').innerText = `Showing ${start + 1} to ${end} of ${total} participants`;
    renderPaginationControls('details-students-pagination-controls', pages, pagDetailsStudents, (p) => {
      pagDetailsStudents.page = p;
      renderPitchDetailsParticipants();
    });
  }

  // ==========================================
  // RENDERER: STARTUP APPLICATIONS
  // ==========================================
  function renderStartupsGrid() {
    const grid = document.getElementById('startup-applications-grid');
    let list = [...state.startupApplications];

    // Filters
    if (startupsFilter.search) {
      const keyword = startupsFilter.search;
      list = list.filter(app => 
        app.startupName.toLowerCase().includes(keyword) || 
        app.founderName.toLowerCase().includes(keyword)
      );
    }
    if (startupsFilter.stage) {
      list = list.filter(app => app.stage === startupsFilter.stage);
    }
    if (startupsFilter.status) {
      list = list.filter(app => app.status === startupsFilter.status);
    }

    // Sort descending by appliedDate
    list.sort((a, b) => new Date(b.appliedDate) - new Date(a.appliedDate));

    if (list.length === 0) {
      grid.innerHTML = `
        <div style="grid-column:1/-1; display:flex; justify-content:center; padding:40px 0;">
          <div class="table-empty-state">
            <i class="fa-solid fa-inbox" style="font-size:36px; color:var(--text-muted); margin-bottom:12px;"></i>
            <h3>No applications found</h3>
            <p>No startup applications match the selected criteria.</p>
          </div>
        </div>
      `;
      document.getElementById('startup-pagination-info').innerText = 'Showing 0 to 0 of 0 applications';
      document.getElementById('startup-pagination-controls').innerHTML = '';
      return;
    }

    const total = list.length;
    const pages = Math.ceil(total / pagStartups.limit);
    if (pagStartups.page > pages) pagStartups.page = pages || 1;

    const start = (pagStartups.page - 1) * pagStartups.limit;
    const pagList = list.slice(start, start + pagStartups.limit);

    let html = '';
    pagList.forEach(app => {
      const badgeClass = app.status === 'Approved' ? 'badge-approved' : app.status === 'Rejected' ? 'badge-rejected' : 'badge-pending';
      html += `
        <div class="startup-card">
          <div class="startup-card-header">
            <div>
              <div class="startup-card-title">${escapeHTML(app.startupName)}</div>
              <div class="startup-card-subtitle">${escapeHTML(app.industry)} &bull; ${escapeHTML(app.stage)}</div>
            </div>
            <span class="${badgeClass}">${app.status}</span>
          </div>
          
          <div class="startup-one-liner">
            "${escapeHTML(app.oneLiner)}"
          </div>
          
          <div class="startup-stats-row">
            <div class="startup-stat-item">
              <span class="startup-stat-label">Funding Ask</span>
              <span class="startup-stat-value" style="color:var(--accent-red); font-weight:800;">${escapeHTML(app.fundingRequired)}</span>
            </div>
            <div class="startup-stat-item">
              <span class="startup-stat-label">Founder</span>
              <span class="startup-stat-value">${escapeHTML(app.founderName)}</span>
            </div>
            <div class="startup-stat-item">
              <span class="startup-stat-label">Team Members</span>
              <span class="startup-stat-value">${app.teamMembers} members</span>
            </div>
          </div>
          
          <div class="startup-card-actions">
            <button class="btn-outline-gray" style="flex:1; padding:8px 12px; font-size:12px;" onclick="window.dashboardApp.viewStartupApplication(${app.id})">Review Profile</button>
            
            <button class="btn-outline-gray" style="padding:8px 12px; border-color:var(--border-color);" onclick="window.dashboardApp.downloadPitchDeck(${app.id})" title="Download Deck">
              <i class="fa-solid fa-file-pdf"></i> Deck
            </button>
            
            <button class="btn-action-check" onclick="window.dashboardApp.updateStartupStatus(${app.id}, 'Approved')" title="Approve Startup"><i class="fa-solid fa-check"></i></button>
            <button class="btn-action-cross" onclick="window.dashboardApp.updateStartupStatus(${app.id}, 'Rejected')" title="Reject Startup"><i class="fa-solid fa-xmark"></i></button>
          </div>
        </div>
      `;
    });
    grid.innerHTML = html;

    const end = Math.min(start + pagStartups.limit, total);
    document.getElementById('startup-pagination-info').innerText = `Showing ${start + 1} to ${end} of ${total} applications`;
    renderPaginationControls('startup-pagination-controls', pages, pagStartups, (p) => {
      pagStartups.page = p;
      renderStartupsGrid();
    });
  }

  function viewStartupApplication(id) {
    const app = state.startupApplications.find(a => a.id === id);
    if (!app) return;

    const modalBody = document.getElementById('view-startup-modal-body');
    const modalFooter = document.getElementById('view-startup-modal-footer');

    // Build fields summary
    modalBody.innerHTML = `
      <div style="border-bottom: 1px solid var(--border-color); padding-bottom:12px; display:flex; justify-content:space-between; align-items:center;">
        <div>
          <h2 style="font-size:20px; font-weight:800; color:#fff;">${escapeHTML(app.startupName)}</h2>
          <span style="font-size:12px; color:var(--text-secondary);">${escapeHTML(app.industry)} &bull; ${escapeHTML(app.stage)}</span>
        </div>
        <span class="${app.status === 'Approved' ? 'badge-approved' : app.status === 'Rejected' ? 'badge-rejected' : 'badge-pending'}" style="font-size:12px; padding:4px 10px;">${app.status}</span>
      </div>
      
      <div class="details-specs-grid" style="grid-template-columns: 1fr 1fr; gap:12px;">
        <div class="spec-item">
          <span class="spec-label">Founder Name</span>
          <span class="spec-value">${escapeHTML(app.founderName)}</span>
        </div>
        <div class="spec-item">
          <span class="spec-label">Contact Details</span>
          <span class="spec-value">${escapeHTML(app.phone)} &bull; ${escapeHTML(app.email)}</span>
        </div>
        <div class="spec-item">
          <span class="spec-label">Funding Required</span>
          <span class="spec-value" style="color:var(--accent-red); font-weight:800;">${escapeHTML(app.fundingRequired)}</span>
        </div>
        <div class="spec-item">
          <span class="spec-label">Team Members</span>
          <span class="spec-value">${escapeHTML(app.teamMembers)}</span>
        </div>
      </div>
      
      <div>
        <h4 style="font-size:11px; color:var(--text-muted); text-transform:uppercase; margin-bottom:4px;">One-Liner pitch</h4>
        <p style="font-style:italic; font-size:13px; color:var(--text-secondary);">"${escapeHTML(app.oneLiner)}"</p>
      </div>

      <div>
        <h4 style="font-size:11px; color:var(--text-muted); text-transform:uppercase; margin-bottom:4px;">Problem Statement</h4>
        <p style="font-size:13px; color:var(--text-secondary); line-height:1.5;">${escapeHTML(app.problemStatement)}</p>
      </div>
      
      <div>
        <h4 style="font-size:11px; color:var(--text-muted); text-transform:uppercase; margin-bottom:4px;">Solution Proposal</h4>
        <p style="font-size:13px; color:var(--text-secondary); line-height:1.5;">${escapeHTML(app.solution)}</p>
      </div>
      
      <div style="background:rgba(255,255,255,0.02); border:1px solid var(--border-color); border-radius:var(--radius-sm); padding:12px; display:flex; justify-content:space-between; align-items:center;">
        <div style="display:flex; align-items:center; gap:10px;">
          <i class="fa-solid fa-file-pdf" style="font-size:24px; color:var(--accent-red);"></i>
          <div>
            <div style="font-size:13px; font-weight:700;">Pitch_Deck_Executive_Summary.pdf</div>
            <div style="font-size:11px; color:var(--text-muted);">Size: 3.4 MB &bull; Uploaded: ${formatDate(app.appliedDate)}</div>
          </div>
        </div>
        <button class="btn-outline-gray" style="padding:6px 12px; font-size:12px;" onclick="window.dashboardApp.downloadPitchDeck(${app.id})"><i class="fa-solid fa-download"></i> Download</button>
      </div>
    `;

    modalFooter.innerHTML = `
      <div style="display:flex; width:100%; gap:10px;">
        <button class="btn-outline-gray" style="margin-right:auto;" onclick="document.getElementById('view-startup-modal').classList.remove('active');">Close Review</button>
        <button class="btn-outline-gray" style="border-color:rgba(255,46,75,0.3); color:var(--accent-red);" onclick="window.dashboardApp.contactFounder(${app.id})"><i class="fa-regular fa-envelope"></i> Contact Founder</button>
        <button class="btn-action-cross" style="width:120px; font-size:12px; font-weight:700; height:38px; border-radius:var(--radius-md); gap:6px;" onclick="window.dashboardApp.updateStartupStatus(${app.id}, 'Rejected'); document.getElementById('view-startup-modal').classList.remove('active');"><i class="fa-solid fa-xmark"></i> Reject</button>
        <button class="btn-action-check" style="width:120px; font-size:12px; font-weight:700; height:38px; border-radius:var(--radius-md); gap:6px;" onclick="window.dashboardApp.updateStartupStatus(${app.id}, 'Approved'); document.getElementById('view-startup-modal').classList.remove('active');"><i class="fa-solid fa-check"></i> Approve</button>
      </div>
    `;

    document.getElementById('view-startup-modal').classList.add('active');
  }

  function updateStartupStatus(id, status) {
    const index = state.startupApplications.findIndex(a => a.id === id);
    if (index !== -1) {
      state.startupApplications[index].status = status;
      saveDatabase();
      renderStartupsGrid();
      renderDashboard();
    }
  }

  function downloadPitchDeck(id) {
    const app = state.startupApplications.find(a => a.id === id);
    if (!app) return;
    alert(`Downloading Pitch Deck PDF for: "${app.startupName}"...`);
    
    // Trigger mock download
    const link = document.createElement('a');
    link.href = '#';
    link.download = `${app.startupName.toLowerCase().replace(/\s+/g, '_')}_pitch_deck.pdf`;
    link.click();
  }

  function contactFounder(id) {
    const app = state.startupApplications.find(a => a.id === id);
    if (!app) return;
    window.location.href = `mailto:${app.email}?subject=StepUp%20for%20AI%20-%20Startup%20Incubator%20Application%20Review&body=Dear%20${encodeURIComponent(app.founderName)},%0D%0A%0D%0AWe%20have%20reviewed%20your%20startup%20pitch%20application%20for%20${encodeURIComponent(app.startupName)}...`;
  }

  // ==========================================
  // RENDERER: STUDENTS MASTER DIRECTORY
  // ==========================================
  function renderStudentsTable() {
    const tbody = document.getElementById('students-table-body');
    let list = [...state.students];

    // Filters
    if (studentsFilter.search) {
      const keyword = studentsFilter.search;
      list = list.filter(s => 
        s.id.toLowerCase().includes(keyword) || 
        s.name.toLowerCase().includes(keyword) ||
        s.email.toLowerCase().includes(keyword) ||
        s.college.toLowerCase().includes(keyword)
      );
    }
    if (studentsFilter.branch) {
      list = list.filter(s => s.branch === studentsFilter.branch);
    }
    if (studentsFilter.year) {
      list = list.filter(s => s.year === studentsFilter.year);
    }

    list.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));

    if (list.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="9" class="text-center">
            <div class="table-empty-state">
              <i class="fa-solid fa-users-slash"></i>
              <p>No student portfolios recorded.</p>
            </div>
          </td>
        </tr>
      `;
      document.getElementById('students-table-pagination-info').innerText = 'Showing 0 to 0 of 0 students';
      document.getElementById('students-table-pagination-controls').innerHTML = '';
      return;
    }

    const total = list.length;
    const pages = Math.ceil(total / pagStudents.limit);
    if (pagStudents.page > pages) pagStudents.page = pages || 1;

    const start = (pagStudents.page - 1) * pagStudents.limit;
    const pagList = list.slice(start, start + pagStudents.limit);

    let html = '';
    pagList.forEach(s => {
      html += `
        <tr>
          <td class="row-id">${s.id}</td>
          <td style="font-weight:700;">${escapeHTML(s.name)}</td>
          <td>${escapeHTML(s.email)}</td>
          <td>${escapeHTML(s.phone)}</td>
          <td>${escapeHTML(s.college)}</td>
          <td>${escapeHTML(s.branch)}</td>
          <td>${s.year} Year</td>
          <td><i class="fa-regular fa-calendar-days" style="color:var(--accent-red); margin-right:6px;"></i>${formatDate(s.createdDate)}</td>
          <td>
            <div style="display:flex; gap:6px;">
              <button class="btn-action-eye" onclick="window.dashboardApp.viewStudentProfile('${s.id}')"><i class="fa-regular fa-eye"></i></button>
              <button class="btn-action-cross" onclick="window.dashboardApp.deleteStudentAccount('${s.id}')"><i class="fa-regular fa-trash-can"></i></button>
            </div>
          </td>
        </tr>
      `;
    });
    tbody.innerHTML = html;

    const end = Math.min(start + pagStudents.limit, total);
    document.getElementById('students-table-pagination-info').innerText = `Showing ${start + 1} to ${end} of ${total} students`;
    renderPaginationControls('students-table-pagination-controls', pages, pagStudents, (p) => {
      pagStudents.page = p;
      renderStudentsTable();
    });
  }

  // View student full profile details popup modal
  function viewStudentProfile(studentId) {
    const student = state.students.find(s => s.id === studentId);
    if (!student) return;

    document.getElementById('view-student-id').innerText = student.id;
    document.getElementById('view-student-name').innerText = student.name;
    document.getElementById('view-student-email').innerText = student.email;
    document.getElementById('view-student-phone').innerText = student.phone;
    document.getElementById('view-student-college').innerText = student.college;
    document.getElementById('view-student-branch').innerText = student.branch;
    document.getElementById('view-student-year').innerText = student.year;
    document.getElementById('view-student-created').innerText = formatDate(student.createdDate);

    // Populate skills & resume link
    document.getElementById('view-student-skills').innerText = student.skills || 'HTML5, CSS3, JavaScript, Git';
    const resumeLink = document.getElementById('view-student-resume-link');
    if (student.resume) {
      resumeLink.setAttribute('href', student.resume);
      resumeLink.innerHTML = `<i class="fa-solid fa-file-pdf"></i> Download Resume Portfolio`;
      resumeLink.onclick = null;
    } else {
      resumeLink.setAttribute('href', '#');
      resumeLink.innerHTML = `<i class="fa-solid fa-file-pdf"></i> Resume Not Available`;
      resumeLink.onclick = (e) => { e.preventDefault(); alert('Resume portfolio is not uploaded by this student.'); };
    }

    // Get events registered for
    const regs = state.registrations.filter(r => r.studentId === student.id);
    const pitchRegs = state.pitchRegistrations.filter(pr => pr.studentId === student.id);
    const eventList = document.getElementById('view-student-events-list');
    
    if (regs.length === 0 && pitchRegs.length === 0) {
      eventList.innerHTML = `<li style="font-size:13px; color:var(--text-muted);">This student has not registered for any events yet.</li>`;
    } else {
      let html = '';
      regs.forEach(reg => {
        const ev = state.webinars.find(w => w.id === reg.eventId) || state.hackathons.find(h => h.id === reg.eventId);
        if (ev) {
          const typeTag = ev.timezone ? 'badge-webinar' : 'badge-hackathon';
          const typeName = ev.timezone ? 'Webinar' : 'Hackathon';
          html += `
            <li style="display:flex; justify-content:space-between; align-items:center; background:rgba(255,255,255,0.02); padding:8px 12px; border-radius:var(--radius-sm); border:1px solid var(--border-color);">
              <span style="font-size:13px; font-weight:600;">${escapeHTML(ev.name)}</span>
              <span class="event-row-badge ${typeTag}" style="font-size:9px; padding:2px 6px;">${typeName}</span>
            </li>
          `;
        }
      });

      pitchRegs.forEach(reg => {
        const ev = state.pitchEvents.find(p => p.id === reg.eventId);
        if (ev) {
          html += `
            <li style="display:flex; justify-content:space-between; align-items:center; background:rgba(255,255,255,0.02); padding:8px 12px; border-radius:var(--radius-sm); border:1px solid var(--border-color);">
              <span style="font-size:13px; font-weight:600;">${escapeHTML(ev.name)}</span>
              <span class="event-row-badge badge-hackathon" style="font-size:9px; padding:2px 6px; background:rgba(245,158,11,0.1); border-color:rgba(245,158,11,0.2); color:#f59e0b;">Pitch Event</span>
            </li>
          `;
        }
      });
      eventList.innerHTML = html;
    }

    // Get applied internships list
    const appList = (state.internshipApplications || []).filter(app => app.studentId === student.id);
    const internList = document.getElementById('view-student-internships-list');
    
    if (appList.length === 0) {
      internList.innerHTML = `<li style="font-size:13px; color:var(--text-muted);">No internships applied for yet.</li>`;
    } else {
      let html = '';
      appList.forEach(app => {
        const internship = (state.internships || []).find(i => i.id === app.internshipId);
        if (internship) {
          const statusBadge = app.status === 'Selected' ? 'badge-approved' : app.status === 'Rejected' ? 'badge-rejected' : 'badge-pending';
          html += `
            <li style="display:flex; justify-content:space-between; align-items:center; background:rgba(255,255,255,0.02); padding:8px 12px; border-radius:var(--radius-sm); border:1px solid var(--border-color);">
              <span style="font-size:13px; font-weight:600;">${escapeHTML(internship.title)} &bull; <small style="color:var(--text-muted);">${escapeHTML(internship.company)}</small></span>
              <span class="${statusBadge}" style="font-size:9px; padding:2px 6px;">${app.status}</span>
            </li>
          `;
        }
      });
      internList.innerHTML = html;
    }

    document.getElementById('view-student-modal').classList.add('active');
  }

  function deleteStudentAccount(studentId) {
    if (confirm(`Are you sure you want to delete the student portfolio: ${studentId}? All event registrations will be removed.`)) {
      state.students = state.students.filter(s => s.id !== studentId);
      state.registrations = state.registrations.filter(r => r.studentId !== studentId);
      state.pitchRegistrations = state.pitchRegistrations.filter(pr => pr.studentId !== studentId);
      saveDatabase();
      renderStudentsTable();
      renderDashboard();
    }
  }

  // ==========================================
  // RENDERER: APPROVAL MANAGEMENT DASHBOARD
  // ==========================================
  function renderApprovalDashboard() {
    // Counts
    const recPending = state.recruiters.filter(r => r.status === 'Pending').length;
    const recApproved = state.recruiters.filter(r => r.status === 'Approved').length;
    const recRejected = state.recruiters.filter(r => r.status === 'Rejected').length;
    
    const invPending = state.investors.filter(i => i.status === 'Pending').length;
    const invApproved = state.investors.filter(i => i.status === 'Approved').length;
    const invRejected = state.investors.filter(i => i.status === 'Rejected').length;

    document.getElementById('approve-stat-rec-pending').innerText = recPending;
    document.getElementById('approve-stat-rec-approved').innerText = recApproved;
    document.getElementById('approve-stat-rec-rejected').innerText = recRejected;
    document.getElementById('approve-stat-inv-pending').innerText = invPending;
    document.getElementById('approve-stat-inv-approved').innerText = invApproved;
    document.getElementById('approve-stat-inv-rejected').innerText = invRejected;

    // Mini sparklines (Dynamic cumulative trends for last 7 days)
    drawSparkline('sparkline-rec-pending', getCumulativeTrend(state.recruiters.filter(r => r.status === 'Pending'), 'appliedDate'), '#ff2e4b');
    drawSparkline('sparkline-rec-approved', getCumulativeTrend(state.recruiters.filter(r => r.status === 'Approved'), 'appliedDate'), '#10b981');
    drawSparkline('sparkline-rec-rejected', getCumulativeTrend(state.recruiters.filter(r => r.status === 'Rejected'), 'appliedDate'), '#ff2e4b');
    drawSparkline('sparkline-inv-pending', getCumulativeTrend(state.investors.filter(i => i.status === 'Pending'), 'appliedDate'), '#8b5cf6');
    drawSparkline('sparkline-inv-approved', getCumulativeTrend(state.investors.filter(i => i.status === 'Approved'), 'appliedDate'), '#3b82f6');
    drawSparkline('sparkline-inv-rejected', getCumulativeTrend(state.investors.filter(i => i.status === 'Rejected'), 'appliedDate'), '#ff2e4b');

    // Render Pending requests list
    renderApproveDashPendingTable();

    // Donut Chart: Approval Summary
    const totalApprovals = recPending + recApproved + recRejected + invPending + invApproved + invRejected;
    const donutCardBody = document.getElementById('card-approvals-donut-body');
    const approveSegments = [
      { label: 'Pending Recruiters', value: recPending, color: '#ff2e4b' },
      { label: 'Approved Recruiters', value: recApproved, color: '#10b981' },
      { label: 'Rejected Recruiters', value: recRejected, color: '#f59e0b' },
      { label: 'Pending Investors', value: invPending, color: '#8b5cf6' },
      { label: 'Approved Investors', value: invApproved, color: '#3b82f6' },
      { label: 'Rejected Investors', value: invRejected, color: '#ff2e4b' }
    ];

    renderDonutOrEmptyState(
      donutCardBody, 
      'chart-approvals-donut', 
      'donut-approvals-total', 
      totalApprovals, 
      approveSegments, 
      'donut-approvals-legend', 
      "No approval data available."
    );

    // Draw Line Chart: Approval Trend Graph
    const trendCardBody = document.getElementById('card-approvals-line-body');
    const trendSelect = document.getElementById('approve-trend-range');
    const trendRange = trendSelect ? trendSelect.value : 'month';
    
    const dates = [];
    const recruiterPoints = [];
    const investorPoints = [];
    const now = new Date();
    
    const intervals = 7;
    
    for (let i = intervals - 1; i >= 0; i--) {
      const d = new Date();
      if (trendRange === 'day') {
        d.setHours(now.getHours() - Math.round((i / (intervals - 1)) * 24));
        const hour = d.getHours();
        dates.push(`${hour}:00`);
      } else {
        const totalDaysBack = trendRange === 'week' ? 7 : 30;
        d.setDate(now.getDate() - Math.round((i / (intervals - 1)) * totalDaysBack));
        d.setHours(23, 59, 59, 999);
        const day = d.getDate();
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        dates.push(`${day} ${months[d.getMonth()]}`);
      }
      
      const recApprovedCount = state.recruiters.filter(r => {
        return r.status === 'Approved' && new Date(r.appliedDate) <= d;
      }).length;
      recruiterPoints.push(recApprovedCount);
      
      const invApprovedCount = state.investors.filter(i => {
        return i.status === 'Approved' && new Date(i.appliedDate) <= d;
      }).length;
      investorPoints.push(invApprovedCount);
    }

    renderLineChartOrEmptyState(trendCardBody, 'chart-approvals-trend-line', dates, [
      { label: 'Recruiters', points: recruiterPoints, color: '#ff2e4b' },
      { label: 'Investors', points: investorPoints, color: '#8b5cf6' }
    ], "No approval data available.");

    // Populate Activity Logs (Recent Approved/Rejected/Applied)
    const logsContainer = document.getElementById('approve-dash-activity-logs');
    const logs = [];
    
    state.recruiters.forEach(r => {
      logs.push({
        name: r.name,
        company: r.company,
        designation: r.designation,
        action: 'Recruiter Applied',
        date: r.appliedDate,
        status: 'Pending'
      });
      if (r.status === 'Approved') {
        logs.push({
          name: r.name,
          company: r.company,
          designation: r.designation,
          action: 'Recruiter Approved',
          date: r.appliedDate,
          status: 'Approved'
        });
      } else if (r.status === 'Rejected') {
        logs.push({
          name: r.name,
          company: r.company,
          designation: r.designation,
          action: 'Recruiter Rejected',
          date: r.appliedDate,
          status: 'Rejected'
        });
      }
    });

    state.investors.forEach(i => {
      logs.push({
        name: i.name,
        company: i.organization,
        designation: i.designation,
        action: 'Investor Applied',
        date: i.appliedDate,
        status: 'Pending'
      });
      if (i.status === 'Approved') {
        logs.push({
          name: i.name,
          company: i.organization,
          designation: i.designation,
          action: 'Investor Approved',
          date: i.appliedDate,
          status: 'Approved'
        });
      } else if (i.status === 'Rejected') {
        logs.push({
          name: i.name,
          company: i.organization,
          designation: i.designation,
          action: 'Investor Rejected',
          date: i.appliedDate,
          status: 'Rejected'
        });
      }
    });

    logs.sort((a, b) => new Date(b.date) - new Date(a.date));
    const recentLogs = logs.slice(0, 8);

    if (recentLogs.length === 0) {
      logsContainer.innerHTML = createEmptyStateHTML("No approval data available.", "Load Demo Data", "window.dashboardApp.loadDemoData()");
    } else {
      let logsHTML = '';
      recentLogs.forEach(log => {
        let badgeClass = 'badge-pending';
        if (log.status === 'Approved') badgeClass = 'badge-approved';
        if (log.status === 'Rejected') badgeClass = 'badge-rejected';
        logsHTML += `
          <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid var(--border-color); padding-bottom:8px;">
            <div>
              <div style="font-size:13px; font-weight:700; color:#fff;">${escapeHTML(log.name)}</div>
              <div style="font-size:11px; color:var(--text-secondary);">${escapeHTML(log.action)} &bull; ${escapeHTML(log.designation)} &bull; ${escapeHTML(log.company)}</div>
            </div>
            <div style="display:flex; flex-direction:column; align-items:flex-end; gap:4px;">
              <span class="${badgeClass}" style="font-size:9px; padding:1px 5px;">${log.status}</span>
              <span style="font-size:10px; color:var(--text-muted);">${formatDate(log.date)}</span>
            </div>
          </div>
        `;
      });
      logsContainer.innerHTML = logsHTML;
    }
  }

  function renderApproveDashPendingTable() {
    const tbody = document.getElementById('approve-dash-pending-table-body');
    const badgeCount = document.getElementById('approve-pending-count-badge');
    
    let pendingList = [
      ...state.recruiters.filter(r => r.status === 'Pending').map(r => ({ ...r, type: 'Recruiter' })),
      ...state.investors.filter(i => i.status === 'Pending').map(i => ({ ...i, type: 'Investor' }))
    ];

    badgeCount.innerText = pendingList.length;

    // Filters
    if (approveDashPendingSearch) {
      pendingList = pendingList.filter(p => 
        p.name.toLowerCase().includes(approveDashPendingSearch) ||
        (p.company || p.organization).toLowerCase().includes(approveDashPendingSearch)
      );
    }

    pendingList.sort((a, b) => new Date(b.appliedDate) - new Date(a.appliedDate));

    if (pendingList.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" class="text-center" style="padding:40px 0;">
            <div class="table-empty-state" style="display:flex; flex-direction:column; align-items:center; gap:8px;">
              <i class="fa-solid fa-folder-open" style="font-size:36px; color:var(--accent-red); opacity:0.8;"></i>
              <h3 style="margin:8px 0 4px 0; color:#fff; font-size:14px;">No pending requests available.</h3>
              <p style="margin:0 0 12px 0; color:var(--text-muted); font-size:11px;">There are no recruiter or investor verification requests pending.</p>
              <button class="btn-solid-red" style="padding: 6px 12px; font-size: 11px; width:auto;" onclick="window.dashboardApp.loadDemoData()">Load Demo Data</button>
            </div>
          </td>
        </tr>
      `;
      document.getElementById('approve-dash-pending-pagination-info').innerText = 'Showing 0 to 0 of 0 entries';
      document.getElementById('approve-dash-pending-pagination-controls').innerHTML = '';
      return;
    }

    const total = pendingList.length;
    const pages = Math.ceil(total / pagApprovePending.limit);
    if (pagApprovePending.page > pages) pagApprovePending.page = pages || 1;

    const start = (pagApprovePending.page - 1) * pagApprovePending.limit;
    const pagList = pendingList.slice(start, start + pagApprovePending.limit);

    let html = '';
    pagList.forEach(p => {
      const typeBadge = p.type === 'Recruiter' ? 'badge-recruiter' : 'badge-investor';
      const appliedFormatted = formatDate(p.appliedDate);
      html += `
        <tr>
          <td><span class="${typeBadge}" style="font-size:10px; padding:1px 5px;">${p.type}</span></td>
          <td style="font-weight:700;">${escapeHTML(p.name)}</td>
          <td>${escapeHTML(p.company || p.organization)}</td>
          <td>${escapeHTML(p.email)}</td>
          <td>${appliedFormatted}</td>
          <td>
            <div style="display:flex; gap:4px;">
              <button class="btn-action-eye" onclick="window.dashboardApp.viewApprovalRosterProfile('${p.type}', '${p.id}')"><i class="fa-regular fa-eye"></i></button>
              <button class="btn-action-check" onclick="window.dashboardApp.actionApprovalStatus('${p.type}', '${p.id}', 'Approved')"><i class="fa-solid fa-check"></i></button>
              <button class="btn-action-cross" onclick="window.dashboardApp.actionApprovalStatus('${p.type}', '${p.id}', 'Rejected')"><i class="fa-solid fa-xmark"></i></button>
            </div>
          </td>
        </tr>
      `;
    });
    tbody.innerHTML = html;

    const end = Math.min(start + pagApprovePending.limit, total);
    document.getElementById('approve-dash-pending-pagination-info').innerText = `Showing ${start + 1} to ${end} of ${total} entries`;
    
    renderPaginationControls('approve-dash-pending-pagination-controls', pages, pagApprovePending, (p) => {
      pagApprovePending.page = p;
      renderApproveDashPendingTable();
    });
  }

  // ==========================================
  // RENDERER: RECRUITERS TABLE
  // ==========================================
  function renderRecruitersTable() {
    const tbody = document.getElementById('recruiters-table-body');
    let list = [...state.recruiters];

    // Filters
    if (recruitersFilter.search) {
      const kw = recruitersFilter.search;
      list = list.filter(r => r.name.toLowerCase().includes(kw) || r.company.toLowerCase().includes(kw));
    }
    if (recruitersFilter.status) {
      list = list.filter(r => r.status === recruitersFilter.status);
    }

    list.sort((a, b) => new Date(b.appliedDate) - new Date(a.appliedDate));

    if (list.length === 0) {
      tbody.innerHTML = `<tr><td colspan="9" class="text-center"><div class="table-empty-state"><p>No recruiters match filter criteria.</p></div></td></tr>`;
      document.getElementById('recruiters-pagination-info').innerText = 'Showing 0 to 0 of 0 recruiters';
      document.getElementById('recruiters-pagination-controls').innerHTML = '';
      return;
    }

    const total = list.length;
    const pages = Math.ceil(total / pagRecruiters.limit);
    if (pagRecruiters.page > pages) pagRecruiters.page = pages || 1;

    const start = (pagRecruiters.page - 1) * pagRecruiters.limit;
    const pagList = list.slice(start, start + pagRecruiters.limit);

    let html = '';
    pagList.forEach(r => {
      const statusBadge = r.status === 'Approved' ? 'badge-approved' : r.status === 'Rejected' ? 'badge-rejected' : 'badge-pending';
      const appliedFormatted = formatDate(r.appliedDate);
      html += `
        <tr>
          <td class="row-id">${r.id}</td>
          <td style="font-weight:700;">${escapeHTML(r.name)}</td>
          <td>${escapeHTML(r.company)}</td>
          <td>${escapeHTML(r.designation)}</td>
          <td>${escapeHTML(r.email)}</td>
          <td>${escapeHTML(r.phone)}</td>
          <td>${appliedFormatted}</td>
          <td><span class="${statusBadge}">${r.status}</span></td>
          <td>
            <div style="display:flex; gap:4px;">
              <button class="btn-action-eye" onclick="window.dashboardApp.viewApprovalRosterProfile('Recruiter', '${r.id}')"><i class="fa-regular fa-eye"></i></button>
              <button class="btn-action-check" onclick="window.dashboardApp.actionApprovalStatus('Recruiter', '${r.id}', 'Approved')"><i class="fa-solid fa-check"></i></button>
              <button class="btn-action-cross" onclick="window.dashboardApp.actionApprovalStatus('Recruiter', '${r.id}', 'Rejected')"><i class="fa-solid fa-xmark"></i></button>
            </div>
          </td>
        </tr>
      `;
    });
    tbody.innerHTML = html;

    const end = Math.min(start + pagRecruiters.limit, total);
    document.getElementById('recruiters-pagination-info').innerText = `Showing ${start + 1} to ${end} of ${total} recruiters`;
    renderPaginationControls('recruiters-pagination-controls', pages, pagRecruiters, (p) => {
      pagRecruiters.page = p;
      renderRecruitersTable();
    });
  }

  // ==========================================
  // RENDERER: INVESTORS TABLE
  // ==========================================
  function renderInvestorsTable() {
    const tbody = document.getElementById('investors-table-body');
    let list = [...state.investors];

    if (investorsFilter.search) {
      const kw = investorsFilter.search;
      list = list.filter(i => i.name.toLowerCase().includes(kw) || i.organization.toLowerCase().includes(kw));
    }
    if (investorsFilter.status) {
      list = list.filter(i => i.status === investorsFilter.status);
    }

    list.sort((a, b) => new Date(b.appliedDate) - new Date(a.appliedDate));

    if (list.length === 0) {
      tbody.innerHTML = `<tr><td colspan="9" class="text-center"><div class="table-empty-state"><p>No investors match filter criteria.</p></div></td></tr>`;
      document.getElementById('investors-pagination-info').innerText = 'Showing 0 to 0 of 0 investors';
      document.getElementById('investors-pagination-controls').innerHTML = '';
      return;
    }

    const total = list.length;
    const pages = Math.ceil(total / pagInvestors.limit);
    if (pagInvestors.page > pages) pagInvestors.page = pages || 1;

    const start = (pagInvestors.page - 1) * pagInvestors.limit;
    const pagList = list.slice(start, start + pagInvestors.limit);

    let html = '';
    pagList.forEach(inv => {
      const statusBadge = inv.status === 'Approved' ? 'badge-approved' : inv.status === 'Rejected' ? 'badge-rejected' : 'badge-pending';
      const appliedFormatted = formatDate(inv.appliedDate);
      html += `
        <tr>
          <td class="row-id">${inv.id}</td>
          <td style="font-weight:700;">${escapeHTML(inv.name)}</td>
          <td>${escapeHTML(inv.organization)}</td>
          <td>${escapeHTML(inv.designation)}</td>
          <td>${escapeHTML(inv.email)}</td>
          <td>${escapeHTML(inv.phone)}</td>
          <td>${appliedFormatted}</td>
          <td><span class="${statusBadge}">${inv.status}</span></td>
          <td>
            <div style="display:flex; gap:4px;">
              <button class="btn-action-eye" onclick="window.dashboardApp.viewApprovalRosterProfile('Investor', '${inv.id}')"><i class="fa-regular fa-eye"></i></button>
              <button class="btn-action-check" onclick="window.dashboardApp.actionApprovalStatus('Investor', '${inv.id}', 'Approved')"><i class="fa-solid fa-check"></i></button>
              <button class="btn-action-cross" onclick="window.dashboardApp.actionApprovalStatus('Investor', '${inv.id}', 'Rejected')"><i class="fa-solid fa-xmark"></i></button>
            </div>
          </td>
        </tr>
      `;
    });
    tbody.innerHTML = html;

    const end = Math.min(start + pagInvestors.limit, total);
    document.getElementById('investors-pagination-info').innerText = `Showing ${start + 1} to ${end} of ${total} investors`;
    renderPaginationControls('investors-pagination-controls', pages, pagInvestors, (p) => {
      pagInvestors.page = p;
      renderInvestorsTable();
    });
  }

  // ==========================================
  // RENDERER: PENDING REQUESTS (WITH BULK CONTROLS)
  // ==========================================
  function renderPendingTable() {
    const tbody = document.getElementById('pending-table-body');
    let list = [
      ...state.recruiters.filter(r => r.status === 'Pending').map(r => ({ ...r, type: 'Recruiter' })),
      ...state.investors.filter(i => i.status === 'Pending').map(i => ({ ...i, type: 'Investor' }))
    ];

    if (pendingFilter.search) {
      const kw = pendingFilter.search;
      list = list.filter(p => p.name.toLowerCase().includes(kw) || (p.company || p.organization).toLowerCase().includes(kw));
    }
    if (pendingFilter.type) {
      list = list.filter(p => p.type === pendingFilter.type);
    }

    list.sort((a, b) => new Date(b.appliedDate) - new Date(a.appliedDate));

    if (list.length === 0) {
      tbody.innerHTML = `<tr><td colspan="9" class="text-center"><div class="table-empty-state"><p>No pending approvals request records.</p></div></td></tr>`;
      document.getElementById('pending-pagination-info').innerText = 'Showing 0 to 0 of 0 requests';
      document.getElementById('pending-pagination-controls').innerHTML = '';
      updateBulkPendingSelectionUI();
      return;
    }

    const total = list.length;
    const pages = Math.ceil(total / pagPendingTable.limit);
    if (pagPendingTable.page > pages) pagPendingTable.page = pages || 1;

    const start = (pagPendingTable.page - 1) * pagPendingTable.limit;
    const pagList = list.slice(start, start + pagPendingTable.limit);

    let html = '';
    pagList.forEach(p => {
      const checked = selectedPendingIds.has(`${p.type}-${p.id}`) ? 'checked' : '';
      const typeBadge = p.type === 'Recruiter' ? 'badge-recruiter' : 'badge-investor';
      const appliedFormatted = formatDate(p.appliedDate);
      
      html += `
        <tr>
          <td><input type="checkbox" class="pending-row-checkbox" value="${p.type}-${p.id}" ${checked} onclick="window.dashboardApp.toggleSelectPending(this)"></td>
          <td><span class="${typeBadge}" style="font-size:10px; padding:1px 5px;">${p.type}</span></td>
          <td class="row-id">${p.id}</td>
          <td style="font-weight:700;">${escapeHTML(p.name)}</td>
          <td>${escapeHTML(p.company || p.organization)}</td>
          <td>${escapeHTML(p.designation)}</td>
          <td>${escapeHTML(p.email)}</td>
          <td>${appliedFormatted}</td>
          <td>
            <div style="display:flex; gap:4px;">
              <button class="btn-action-eye" onclick="window.dashboardApp.viewApprovalRosterProfile('${p.type}', '${p.id}')"><i class="fa-regular fa-eye"></i></button>
              <button class="btn-action-check" onclick="window.dashboardApp.actionApprovalStatus('${p.type}', '${p.id}', 'Approved')"><i class="fa-solid fa-check"></i></button>
              <button class="btn-action-cross" onclick="window.dashboardApp.actionApprovalStatus('${p.type}', '${p.id}', 'Rejected')"><i class="fa-solid fa-xmark"></i></button>
            </div>
          </td>
        </tr>
      `;
    });
    tbody.innerHTML = html;

    const end = Math.min(start + pagPendingTable.limit, total);
    document.getElementById('pending-pagination-info').innerText = `Showing ${start + 1} to ${end} of ${total} requests`;
    
    renderPaginationControls('pending-pagination-controls', pages, pagPendingTable, (p) => {
      pagPendingTable.page = p;
      renderPendingTable();
    });

    updateBulkPendingSelectionUI();
  }

  function toggleSelectPending(chk) {
    const val = chk.value;
    if (chk.checked) {
      selectedPendingIds.add(val);
    } else {
      selectedPendingIds.delete(val);
    }
    updateBulkPendingSelectionUI();
  }

  function toggleSelectAllPending(chk) {
    const checkBoxes = document.querySelectorAll('.pending-row-checkbox');
    checkBoxes.forEach(c => {
      c.checked = chk.checked;
      const val = c.value;
      if (chk.checked) {
        selectedPendingIds.add(val);
      } else {
        selectedPendingIds.delete(val);
      }
    });
    updateBulkPendingSelectionUI();
  }

  function updateBulkPendingSelectionUI() {
    const counter = document.getElementById('pending-selected-count');
    if (counter) {
      counter.innerText = `${selectedPendingIds.size} items selected`;
    }
    
    // Check main select all box status
    const allBox = document.getElementById('pending-select-all');
    if (allBox) {
      const chks = document.querySelectorAll('.pending-row-checkbox');
      if (chks.length > 0 && Array.from(chks).every(c => c.checked)) {
        allBox.checked = true;
      } else {
        allBox.checked = false;
      }
    }
  }

  function bulkApprovePending() {
    if (selectedPendingIds.size === 0) {
      alert("No requests selected for bulk approval.");
      return;
    }
    if (confirm(`Are you sure you want to approve all ${selectedPendingIds.size} selected accounts?`)) {
      selectedPendingIds.forEach(compositeId => {
        const parts = compositeId.split('-');
        const type = parts[0];
        const id = parts[1];
        setApprovalRosterStatus(type, id, 'Approved');
      });
      selectedPendingIds.clear();
      saveDatabase();
      renderPendingTable();
      renderDashboard();
      alert("Selected accounts successfully approved!");
    }
  }

  function bulkRejectPending() {
    if (selectedPendingIds.size === 0) {
      alert("No requests selected for bulk rejection.");
      return;
    }
    if (confirm(`Are you sure you want to reject all ${selectedPendingIds.size} selected accounts?`)) {
      selectedPendingIds.forEach(compositeId => {
        const parts = compositeId.split('-');
        const type = parts[0];
        const id = parts[1];
        setApprovalRosterStatus(type, id, 'Rejected');
      });
      selectedPendingIds.clear();
      saveDatabase();
      renderPendingTable();
      renderDashboard();
      alert("Selected accounts successfully rejected.");
    }
  }

  // ==========================================
  // RENDERER: APPROVED ACCOUNTS MASTER
  // ==========================================
  function renderApprovedTable() {
    const tbody = document.getElementById('approved-table-body');
    let list = [
      ...state.recruiters.filter(r => r.status === 'Approved').map(r => ({ ...r, type: 'Recruiter' })),
      ...state.investors.filter(i => i.status === 'Approved').map(i => ({ ...i, type: 'Investor' }))
    ];

    if (approvedFilter.search) {
      const kw = approvedFilter.search;
      list = list.filter(p => p.name.toLowerCase().includes(kw) || (p.company || p.organization).toLowerCase().includes(kw));
    }
    if (approvedFilter.type) {
      list = list.filter(p => p.type === approvedFilter.type);
    }

    list.sort((a, b) => new Date(b.appliedDate) - new Date(a.appliedDate));

    if (list.length === 0) {
      tbody.innerHTML = `<tr><td colspan="8" class="text-center"><div class="table-empty-state"><p>No approved accounts match filters.</p></div></td></tr>`;
      document.getElementById('approved-pagination-info').innerText = 'Showing 0 to 0 of 0 accounts';
      document.getElementById('approved-pagination-controls').innerHTML = '';
      return;
    }

    const total = list.length;
    const pages = Math.ceil(total / pagApprovedTable.limit);
    if (pagApprovedTable.page > pages) pagApprovedTable.page = pages || 1;

    const start = (pagApprovedTable.page - 1) * pagApprovedTable.limit;
    const pagList = list.slice(start, start + pagApprovedTable.limit);

    let html = '';
    pagList.forEach(p => {
      const typeBadge = p.type === 'Recruiter' ? 'badge-recruiter' : 'badge-investor';
      const actionedDate = formatDate(p.appliedDate);
      html += `
        <tr>
          <td><span class="${typeBadge}" style="font-size:10px; padding:1px 5px;">${p.type}</span></td>
          <td class="row-id">${p.id}</td>
          <td style="font-weight:700;">${escapeHTML(p.name)}</td>
          <td>${escapeHTML(p.company || p.organization)}</td>
          <td>${escapeHTML(p.designation)}</td>
          <td>${escapeHTML(p.email)}</td>
          <td>${escapeHTML(p.phone)}</td>
          <td><i class="fa-regular fa-calendar-check" style="color:var(--accent-green); margin-right:6px;"></i>${actionedDate}</td>
        </tr>
      `;
    });
    tbody.innerHTML = html;

    const end = Math.min(start + pagApprovedTable.limit, total);
    document.getElementById('approved-pagination-info').innerText = `Showing ${start + 1} to ${end} of ${total} accounts`;
    renderPaginationControls('approved-pagination-controls', pages, pagApprovedTable, (p) => {
      pagApprovedTable.page = p;
      renderApprovedTable();
    });
  }

  // ==========================================
  // RENDERER: REJECTED ACCOUNTS MASTER
  // ==========================================
  function renderRejectedTable() {
    const tbody = document.getElementById('rejected-table-body');
    let list = [
      ...state.recruiters.filter(r => r.status === 'Rejected').map(r => ({ ...r, type: 'Recruiter' })),
      ...state.investors.filter(i => i.status === 'Rejected').map(i => ({ ...i, type: 'Investor' }))
    ];

    if (rejectedFilter.search) {
      const kw = rejectedFilter.search;
      list = list.filter(p => p.name.toLowerCase().includes(kw) || (p.company || p.organization).toLowerCase().includes(kw));
    }
    if (rejectedFilter.type) {
      list = list.filter(p => p.type === rejectedFilter.type);
    }

    list.sort((a, b) => new Date(b.appliedDate) - new Date(a.appliedDate));

    if (list.length === 0) {
      tbody.innerHTML = `<tr><td colspan="8" class="text-center"><div class="table-empty-state"><p>No rejected accounts registered.</p></div></td></tr>`;
      document.getElementById('rejected-pagination-info').innerText = 'Showing 0 to 0 of 0 accounts';
      document.getElementById('rejected-pagination-controls').innerHTML = '';
      return;
    }

    const total = list.length;
    const pages = Math.ceil(total / pagRejectedTable.limit);
    if (pagRejectedTable.page > pages) pagRejectedTable.page = pages || 1;

    const start = (pagRejectedTable.page - 1) * pagRejectedTable.limit;
    const pagList = list.slice(start, start + pagRejectedTable.limit);

    let html = '';
    pagList.forEach(p => {
      const typeBadge = p.type === 'Recruiter' ? 'badge-recruiter' : 'badge-investor';
      const actionedDate = formatDate(p.appliedDate);
      html += `
        <tr>
          <td><span class="${typeBadge}" style="font-size:10px; padding:1px 5px;">${p.type}</span></td>
          <td class="row-id">${p.id}</td>
          <td style="font-weight:700;">${escapeHTML(p.name)}</td>
          <td>${escapeHTML(p.company || p.organization)}</td>
          <td>${escapeHTML(p.designation)}</td>
          <td>${escapeHTML(p.email)}</td>
          <td><i class="fa-regular fa-calendar-xmark" style="color:var(--accent-red); margin-right:6px;"></i>${actionedDate}</td>
          <td>
            <button class="btn-action-check" onclick="window.dashboardApp.actionApprovalStatus('${p.type}', '${p.id}', 'Approved')" title="Re-approve Account"><i class="fa-solid fa-check"></i> Re-verify</button>
          </td>
        </tr>
      `;
    });
    tbody.innerHTML = html;

    const end = Math.min(start + pagRejectedTable.limit, total);
    document.getElementById('rejected-pagination-info').innerText = `Showing ${start + 1} to ${end} of ${total} accounts`;
    renderPaginationControls('rejected-pagination-controls', pages, pagRejectedTable, (p) => {
      pagRejectedTable.page = p;
      renderRejectedTable();
    });
  }

  // ==========================================
  // SHARED ACTIONS: APPROVAL SYSTEM WORKFLOWS
  // ==========================================
  function actionApprovalStatus(type, id, status) {
    if (confirm(`Are you sure you want to mark this ${type} request as ${status}?`)) {
      setApprovalRosterStatus(type, id, status);
      saveDatabase();
      triggerTabRenders(currentActiveTab);
      renderDashboard();
      
      // Update pending requester count badge dynamically if on dashboard
      const badge = document.getElementById('approve-pending-count-badge');
      if (badge) {
        const count = state.recruiters.filter(r => r.status === 'Pending').length + state.investors.filter(i => i.status === 'Pending').length;
        badge.innerText = count;
      }
    }
  }

  function setApprovalRosterStatus(type, id, status) {
    if (type === 'Recruiter') {
      const idx = state.recruiters.findIndex(r => r.id === id);
      if (idx !== -1) state.recruiters[idx].status = status;
    } else {
      const idx = state.investors.findIndex(i => i.id === id);
      if (idx !== -1) state.investors[idx].status = status;
    }
  }

  function viewApprovalRosterProfile(type, id) {
    const item = type === 'Recruiter' 
      ? state.recruiters.find(r => r.id === id)
      : state.investors.find(i => i.id === id);

    if (!item) return;

    // We can show detailed profile alert or popup dialog
    alert(`
      Profile Verification Details (${type.toUpperCase()})
      -----------------------------------------------
      ID: ${item.id}
      Status: ${item.status}
      Full Name: ${item.name}
      Company/VC: ${item.company || item.organization}
      Designation: ${item.designation}
      Email Address: ${item.email}
      Phone Number: ${item.phone}
      Applied Date: ${formatDate(item.appliedDate)}
    `);
  }

  // ==========================================
  // VIEW EVENTS REDIRECT FOR DASHBOARD CLICKS
  // ==========================================
  function viewEventDetails(type, id) {
    if (type === 'Webinar') {
      viewWebinarDetails(id);
    } else if (type === 'Hackathon') {
      viewHackathonDetails(id);
    } else {
      viewPitchEventDetails(id);
    }
  }

  // ==========================================
  // MODALS CONTROL: WEBINARS CRUD
  // ==========================================
  function openCreateWebinarModal() {
    cachedWebinarPoster = null;
    document.getElementById('webinar-modal-title').innerText = "Create Webinar";
    document.getElementById('webinar-submit-btn').innerText = "Create Webinar";
    document.getElementById('create-webinar-form').reset();
    document.getElementById('webinar-form-id').value = '';
    document.getElementById('webinar-poster-preview').innerHTML = '';
    document.getElementById('create-webinar-modal').classList.add('active');
  }

  function openEditWebinarModal(id) {
    const web = state.webinars.find(w => w.id === id);
    if (!web) return;

    cachedWebinarPoster = web.posterBanner;
    document.getElementById('webinar-modal-title').innerText = "Edit Webinar Details";
    document.getElementById('webinar-submit-btn').innerText = "Save Changes";
    document.getElementById('create-webinar-form').reset();

    document.getElementById('webinar-form-id').value = web.id;
    document.getElementById('webinar-form-name').value = web.name;
    document.getElementById('webinar-form-overview').value = web.overview;
    document.getElementById('webinar-form-description').value = web.description;
    document.getElementById('webinar-form-start-date').value = web.startDate;
    document.getElementById('webinar-form-end-date').value = web.endDate;
    document.getElementById('webinar-form-timezone').value = web.timezone;
    document.getElementById('webinar-form-start-time').value = web.startTime;
    document.getElementById('webinar-form-end-time').value = web.endTime;
    document.getElementById('webinar-form-mode').value = web.mode;
    document.getElementById('webinar-form-venue').value = web.venue;
    document.getElementById('webinar-form-contact-name').value = web.contactName;
    document.getElementById('webinar-form-contact-phone').value = web.contactPhone;
    document.getElementById('webinar-form-contact-email').value = web.contactEmail;

    if (web.posterBanner) {
      showPosterPreview('webinar-poster-preview', web.posterBanner, 'webinar_banner.png', () => {
        cachedWebinarPoster = null;
      });
    } else {
      document.getElementById('webinar-poster-preview').innerHTML = '';
    }

    document.getElementById('create-webinar-modal').classList.add('active');
  }

  function closeCreateWebinarModal() {
    document.getElementById('create-webinar-modal').classList.remove('active');
  }

  function submitWebinarForm() {
    const idVal = document.getElementById('webinar-form-id').value;
    const isEdit = idVal !== '';

    const webData = {
      name: document.getElementById('webinar-form-name').value.trim(),
      posterBanner: cachedWebinarPoster,
      overview: document.getElementById('webinar-form-overview').value.trim(),
      description: document.getElementById('webinar-form-description').value.trim(),
      startDate: document.getElementById('webinar-form-start-date').value,
      endDate: document.getElementById('webinar-form-end-date').value,
      timezone: document.getElementById('webinar-form-timezone').value.trim(),
      startTime: document.getElementById('webinar-form-start-time').value,
      endTime: document.getElementById('webinar-form-end-time').value,
      mode: document.getElementById('webinar-form-mode').value,
      venue: document.getElementById('webinar-form-venue').value.trim(),
      contactName: document.getElementById('webinar-form-contact-name').value.trim(),
      contactPhone: document.getElementById('webinar-form-contact-phone').value.trim(),
      contactEmail: document.getElementById('webinar-form-contact-email').value.trim()
    };

    if (new Date(webData.startDate) > new Date(webData.endDate)) {
      alert("Start Date cannot be later than End Date.");
      return;
    }

    if (isEdit) {
      const webId = parseInt(idVal);
      const idx = state.webinars.findIndex(w => w.id === webId);
      if (idx !== -1) {
        webData.id = webId;
        state.webinars[idx] = webData;
        alert("Webinar details updated successfully!");
      }
    } else {
      webData.id = state.webinars.length > 0 ? Math.max(...state.webinars.map(w => w.id)) + 1 : 2001;
      state.webinars.push(webData);
      alert("Webinar created successfully!");
    }

    saveDatabase();
    closeCreateWebinarModal();
    renderWebinarsGrid();
    renderDashboard();
    
    if (isEdit && selectedWebinarId === parseInt(idVal)) {
      renderWebinarDetailsPane();
    }
  }

  function deleteWebinar(id) {
    if (confirm("Are you sure you want to delete this webinar? All registrations logs linked to it will be erased.")) {
      state.webinars = state.webinars.filter(w => w.id !== id);
      state.registrations = state.registrations.filter(r => r.eventId !== id);
      saveDatabase();
      renderWebinarsGrid();
      renderDashboard();
      
      if (selectedWebinarId === id) {
        switchTab('webinars-list');
      }
    }
  }

  // ==========================================
  // MODALS CONTROL: HACKATHONS CRUD
  // ==========================================
  function openCreateHackathonModal() {
    cachedHackathonLogo = null;
    cachedHackathonPoster = null;
    document.getElementById('hackathon-modal-title').innerText = "Create Hackathon";
    document.getElementById('hackathon-submit-btn').innerText = "Create Hackathon";
    document.getElementById('create-hackathon-form').reset();
    document.getElementById('hackathon-form-id').value = '';
    document.getElementById('hackathon-logo-preview').innerHTML = '';
    document.getElementById('hackathon-poster-preview').innerHTML = '';
    document.getElementById('create-hackathon-modal').classList.add('active');
  }

  function openEditHackathonModal(id) {
    const hack = state.hackathons.find(h => h.id === id);
    if (!hack) return;

    cachedHackathonLogo = hack.orgLogo;
    cachedHackathonPoster = hack.posterBanner;

    document.getElementById('hackathon-modal-title').innerText = "Edit Hackathon Details";
    document.getElementById('hackathon-submit-btn').innerText = "Save Changes";
    document.getElementById('create-hackathon-form').reset();

    document.getElementById('hackathon-form-id').value = hack.id;
    document.getElementById('hackathon-form-name').value = hack.name;
    document.getElementById('hackathon-form-conducted').value = hack.conductedBy;
    document.getElementById('hackathon-form-description').value = hack.description;
    document.getElementById('hackathon-form-participation').value = hack.participation;
    document.getElementById('hackathon-form-min-team').value = hack.minTeamSize || '';
    document.getElementById('hackathon-form-max-team').value = hack.maxTeamSize || '';
    document.getElementById('hackathon-form-start-date').value = hack.startDate;
    document.getElementById('hackathon-form-end-date').value = hack.endDate;
    document.getElementById('hackathon-form-timezone').value = hack.timezone;
    document.getElementById('hackathon-form-start-time').value = hack.startTime;
    document.getElementById('hackathon-form-end-time').value = hack.endTime;
    document.getElementById('hackathon-form-mode').value = hack.mode;
    document.getElementById('hackathon-form-venue').value = hack.venue;
    document.getElementById('hackathon-form-certificate').value = hack.certificateAvailable;
    document.getElementById('hackathon-form-contact-name').value = hack.contactName;
    document.getElementById('hackathon-form-contact-phone').value = hack.contactPhone;
    document.getElementById('hackathon-form-contact-email').value = hack.contactEmail;

    if (hack.orgLogo) {
      showPosterPreview('hackathon-logo-preview', hack.orgLogo, 'org_logo.png', () => { cachedHackathonLogo = null; });
    } else {
      document.getElementById('hackathon-logo-preview').innerHTML = '';
    }

    if (hack.posterBanner) {
      showPosterPreview('hackathon-poster-preview', hack.posterBanner, 'hack_banner.png', () => { cachedHackathonPoster = null; });
    } else {
      document.getElementById('hackathon-poster-preview').innerHTML = '';
    }

    document.getElementById('create-hackathon-modal').classList.add('active');
  }

  function closeCreateHackathonModal() {
    document.getElementById('create-hackathon-modal').classList.remove('active');
  }

  function submitHackathonForm() {
    const idVal = document.getElementById('hackathon-form-id').value;
    const isEdit = idVal !== '';

    const hackData = {
      name: document.getElementById('hackathon-form-name').value.trim(),
      conductedBy: document.getElementById('hackathon-form-conducted').value.trim(),
      orgLogo: cachedHackathonLogo,
      posterBanner: cachedHackathonPoster,
      description: document.getElementById('hackathon-form-description').value.trim(),
      participation: document.getElementById('hackathon-form-participation').value,
      minTeamSize: document.getElementById('hackathon-form-min-team').value ? parseInt(document.getElementById('hackathon-form-min-team').value) : null,
      maxTeamSize: document.getElementById('hackathon-form-max-team').value ? parseInt(document.getElementById('hackathon-form-max-team').value) : null,
      startDate: document.getElementById('hackathon-form-start-date').value,
      endDate: document.getElementById('hackathon-form-end-date').value,
      timezone: document.getElementById('hackathon-form-timezone').value.trim(),
      startTime: document.getElementById('hackathon-form-start-time').value,
      endTime: document.getElementById('hackathon-form-end-time').value,
      mode: document.getElementById('hackathon-form-mode').value,
      venue: document.getElementById('hackathon-form-venue').value.trim(),
      certificateAvailable: document.getElementById('hackathon-form-certificate').value,
      contactName: document.getElementById('hackathon-form-contact-name').value.trim(),
      contactPhone: document.getElementById('hackathon-form-contact-phone').value.trim(),
      contactEmail: document.getElementById('hackathon-form-contact-email').value.trim()
    };

    if (isEdit) {
      const hackId = parseInt(idVal);
      const idx = state.hackathons.findIndex(h => h.id === hackId);
      if (idx !== -1) {
        hackData.id = hackId;
        state.hackathons[idx] = hackData;
        alert("Hackathon details updated successfully!");
      }
    } else {
      hackData.id = state.hackathons.length > 0 ? Math.max(...state.hackathons.map(h => h.id)) + 1 : 3001;
      state.hackathons.push(hackData);
      alert("Hackathon created successfully!");
    }

    saveDatabase();
    closeCreateHackathonModal();
    renderHackathonsGrid();
    renderDashboard();

    if (isEdit && selectedHackathonId === parseInt(idVal)) {
      renderHackathonDetailsPane();
    }
  }

  function deleteHackathon(id) {
    if (confirm("Are you sure you want to delete this hackathon? All team registration records will be wiped out.")) {
      state.hackathons = state.hackathons.filter(h => h.id !== id);
      state.registrations = state.registrations.filter(r => r.eventId !== id);
      saveDatabase();
      renderHackathonsGrid();
      renderDashboard();

      if (selectedHackathonId === id) {
        switchTab('hackathons-list');
      }
    }
  }

  // ==========================================
  // MODALS CONTROL: PITCH EVENTS CRUD
  // ==========================================
  function openCreatePitchEventModal() {
    cachedPitchEventPoster = null;
    document.getElementById('pitch-event-modal-title').innerText = "Create Pitch Event";
    document.getElementById('pitch-event-submit-btn').innerText = "Create Pitch Event";
    document.getElementById('create-pitch-event-form').reset();
    document.getElementById('pitch-event-form-id').value = '';
    document.getElementById('pitch-event-poster-preview').innerHTML = '';
    document.getElementById('create-pitch-event-modal').classList.add('active');
  }

  function openEditPitchEventModal(id) {
    const pe = state.pitchEvents.find(p => p.id === id);
    if (!pe) return;

    cachedPitchEventPoster = pe.posterBanner;
    document.getElementById('pitch-event-modal-title').innerText = "Edit Pitch Event";
    document.getElementById('pitch-event-submit-btn').innerText = "Save Changes";
    document.getElementById('create-pitch-event-form').reset();

    document.getElementById('pitch-event-form-id').value = pe.id;
    document.getElementById('pitch-event-form-name').value = pe.name;
    document.getElementById('pitch-event-form-overview').value = pe.overview || '';
    document.getElementById('pitch-event-form-description').value = pe.description;
    document.getElementById('pitch-event-form-start-date').value = pe.startDate;
    document.getElementById('pitch-event-form-end-date').value = pe.endDate;
    document.getElementById('pitch-event-form-timezone').value = pe.timezone;
    document.getElementById('pitch-event-form-start-time').value = pe.startTime;
    document.getElementById('pitch-event-form-end-time').value = pe.endTime;
    document.getElementById('pitch-event-form-mode').value = pe.mode;
    document.getElementById('pitch-event-form-venue').value = pe.venue;

    // Ticket management
    document.getElementById('pitch-event-form-ticket-name').value = pe.ticketName;
    document.getElementById('pitch-event-form-ticket-price').value = pe.ticketPrice;
    document.getElementById('pitch-event-form-ticket-desc').value = pe.ticketDescription || '';
    document.getElementById('pitch-event-form-sale-start').value = pe.saleStartDate || '';
    document.getElementById('pitch-event-form-sale-end').value = pe.saleEndDate || '';
    document.getElementById('pitch-event-form-sale-start-time').value = pe.saleStartTime || '';
    document.getElementById('pitch-event-form-sale-end-time').value = pe.saleEndTime || '';

    // Contact person
    document.getElementById('pitch-event-form-contact-name').value = pe.contactName;
    document.getElementById('pitch-event-form-contact-phone').value = pe.contactPhone;
    document.getElementById('pitch-event-form-contact-email').value = pe.contactEmail;

    if (pe.posterBanner) {
      showPosterPreview('pitch-event-poster-preview', pe.posterBanner, 'pitch_banner.png', () => { cachedPitchEventPoster = null; });
    } else {
      document.getElementById('pitch-event-poster-preview').innerHTML = '';
    }

    document.getElementById('create-pitch-event-modal').classList.add('active');
  }

  function closeCreatePitchEventModal() {
    document.getElementById('create-pitch-event-modal').classList.remove('active');
  }

  function submitPitchEventForm() {
    const idVal = document.getElementById('pitch-event-form-id').value;
    const isEdit = idVal !== '';

    const peData = {
      name: document.getElementById('pitch-event-form-name').value.trim(),
      posterBanner: cachedPitchEventPoster,
      overview: document.getElementById('pitch-event-form-overview').value.trim(),
      description: document.getElementById('pitch-event-form-description').value.trim(),
      startDate: document.getElementById('pitch-event-form-start-date').value,
      endDate: document.getElementById('pitch-event-form-end-date').value,
      timezone: document.getElementById('pitch-event-form-timezone').value.trim(),
      startTime: document.getElementById('pitch-event-form-start-time').value,
      endTime: document.getElementById('pitch-event-form-end-time').value,
      mode: document.getElementById('pitch-event-form-mode').value,
      venue: document.getElementById('pitch-event-form-venue').value.trim(),

      ticketName: document.getElementById('pitch-event-form-ticket-name').value.trim(),
      ticketPrice: parseFloat(document.getElementById('pitch-event-form-ticket-price').value || 0),
      ticketDescription: document.getElementById('pitch-event-form-ticket-desc').value.trim(),
      saleStartDate: document.getElementById('pitch-event-form-sale-start').value,
      saleEndDate: document.getElementById('pitch-event-form-sale-end').value,
      saleStartTime: document.getElementById('pitch-event-form-sale-start-time').value,
      saleEndTime: document.getElementById('pitch-event-form-sale-end-time').value,

      contactName: document.getElementById('pitch-event-form-contact-name').value.trim(),
      contactPhone: document.getElementById('pitch-event-form-contact-phone').value.trim(),
      contactEmail: document.getElementById('pitch-event-form-contact-email').value.trim()
    };

    if (isEdit) {
      const peId = parseInt(idVal);
      const idx = state.pitchEvents.findIndex(p => p.id === peId);
      if (idx !== -1) {
        peData.id = peId;
        state.pitchEvents[idx] = peData;
        alert("Pitch Event details updated successfully!");
      }
    } else {
      peData.id = state.pitchEvents.length > 0 ? Math.max(...state.pitchEvents.map(p => p.id)) + 1 : 4001;
      state.pitchEvents.push(peData);
      alert("Pitch Event created successfully!");
    }

    saveDatabase();
    closeCreatePitchEventModal();
    renderPitchEventsGrid();
    renderDashboard();

    if (isEdit && selectedPitchEventId === parseInt(idVal)) {
      renderPitchEventDetailsPane();
    }
  }

  function deletePitchEvent(id) {
    if (confirm("Are you sure you want to delete this Pitch Event? All ticket sales history will be lost.")) {
      state.pitchEvents = state.pitchEvents.filter(p => p.id !== id);
      state.pitchRegistrations = state.pitchRegistrations.filter(pr => pr.eventId !== id);
      saveDatabase();
      renderPitchEventsGrid();
      renderDashboard();

      if (selectedPitchEventId === id) {
        switchTab('pitch-events-list');
      }
    }
  }

  // ==========================================
  // MODALS CONTROL: ADD & ASSIGN STUDENT
  // ==========================================
  function openAddStudentModal() {
    document.getElementById('add-student-form').reset();
    document.getElementById('form-student-event-id').value = '';
    document.getElementById('form-student-event-type').value = '';
    document.getElementById('student-modal-title').innerText = "Register Student Portfolio";
    document.getElementById('student-modal-title').nextElementSibling.innerText = "Register student globally in incubator directory.";
    document.getElementById('add-student-modal').classList.add('active');
  }

  function openAddStudentToEventModal(type, eventId) {
    document.getElementById('add-student-form').reset();
    document.getElementById('form-student-event-id').value = eventId;
    document.getElementById('form-student-event-type').value = type;
    document.getElementById('student-modal-title').innerText = `Register Event ${type === 'pitch' ? 'Participant' : 'Student'}`;
    document.getElementById('student-modal-title').nextElementSibling.innerText = `Enroll student into this selected ${type} program.`;
    document.getElementById('add-student-modal').classList.add('active');
  }

  function closeAddStudentModal() {
    document.getElementById('add-student-modal').classList.remove('active');
  }

  function submitStudentForm() {
    const email = document.getElementById('form-student-email').value.trim();
    const eventIdVal = document.getElementById('form-student-event-id').value;
    const evType = document.getElementById('form-student-event-type').value;

    let student = state.students.find(s => s.email.toLowerCase() === email.toLowerCase());

    if (!student) {
      // Create new student
      const count = state.students.length + 1;
      const studentId = `STU${String(count).padStart(3, '0')}`;
      student = {
        id: studentId,
        name: document.getElementById('form-student-name').value.trim(),
        email: email,
        phone: document.getElementById('form-student-phone').value.trim(),
        college: document.getElementById('form-student-college').value.trim(),
        branch: document.getElementById('form-student-branch').value,
        year: document.getElementById('form-student-year').value,
        createdDate: new Date().toISOString()
      };
      state.students.push(student);
    } else {
      // Update details
      student.name = document.getElementById('form-student-name').value.trim();
      student.phone = document.getElementById('form-student-phone').value.trim();
      student.college = document.getElementById('form-student-college').value.trim();
      student.branch = document.getElementById('form-student-branch').value;
      student.year = document.getElementById('form-student-year').value;
    }

    let dialogTitle = "Registration Successful";
    let dialogSubtitle = "The student account has been created and verified successfully.";
    let outputLabel = "Student Unique ID";
    let outputValue = student.id;

    // Assignment logic if eventId is set
    if (eventIdVal) {
      const eventId = parseInt(eventIdVal);
      if (evType === 'pitch') {
        const isReg = state.pitchRegistrations.some(r => r.studentId === student.id && r.eventId === eventId);
        if (isReg) {
          alert(`${student.name} is already registered for this pitch event.`);
          return;
        }
        const regId = `PR${String(state.pitchRegistrations.length + 1).padStart(3, '0')}`;
        state.pitchRegistrations.push({
          id: regId,
          studentId: student.id,
          eventId: eventId,
          registrationDate: new Date().toISOString()
        });

        dialogTitle = "Voucher Booking Done";
        dialogSubtitle = "Student has booked tickets for the pitch event successfully.";
        outputLabel = "Ticket Booking ID";
        outputValue = regId;
      } else {
        const isReg = state.registrations.some(r => r.studentId === student.id && r.eventId === eventId);
        if (isReg) {
          alert(`${student.name} is already registered for this event program.`);
          return;
        }
        const regId = `REG${String(state.registrations.length + 1).padStart(3, '0')}`;
        state.registrations.push({
          id: regId,
          studentId: student.id,
          eventId: eventId,
          registrationDate: new Date().toISOString()
        });

        dialogTitle = "Enrollment Successful";
        dialogSubtitle = "Student has been registered for the selected event.";
        outputLabel = "Enrollment ID";
        outputValue = regId;
      }
    }

    // Trigger success confirmation modal
    document.getElementById('student-success-modal').querySelector('h3').innerText = dialogTitle;
    document.getElementById('student-success-modal').querySelector('p').innerText = dialogSubtitle;
    document.getElementById('student-success-modal').querySelector('span').innerText = outputLabel;
    document.getElementById('success-student-id').innerText = outputValue;
    document.getElementById('success-student-name').innerText = student.name;
    document.getElementById('success-student-branch').innerText = student.branch;
    document.getElementById('success-student-year').innerText = `${student.year} Year`;
    document.getElementById('student-success-modal').classList.add('active');

    saveDatabase();
    closeAddStudentModal();
    renderStudentsTable();
    renderDashboard();

    // Reload active details pane if relevant
    if (eventIdVal) {
      if (evType === 'pitch') {
        renderPitchEventDetailsPane();
      } else if (evType === 'webinar') {
        renderWebinarDetailsPane();
      } else {
        renderHackathonDetailsPane();
      }
    }
  }

  // ==========================================
  // SHARED ACTIONS: LOGOUT SESSION
  // ==========================================
  function performLogout() {
    document.getElementById('logout-modal').classList.remove('active');
    alert("Super Admin session securely closed. Redirecting back to index.html...");
    window.location.hash = '';
    window.location.reload();
  }

  // ==========================================
  // WEB SEARCH FILTER UTILITY FUNCTIONS
  // ==========================================
  function triggerGlobalSearch(query) {
    if (!query) return;
    
    // Redirect search queries to search bar values of active pages
    if (currentActiveTab === 'webinars-list') {
      const searchBox = document.getElementById('webinars-search-input');
      searchBox.value = query;
      searchBox.dispatchEvent(new Event('input'));
    } else if (currentActiveTab === 'hackathons-list') {
      const searchBox = document.getElementById('hackathons-search-input');
      searchBox.value = query;
      searchBox.dispatchEvent(new Event('input'));
    } else if (currentActiveTab === 'pitch-events-list') {
      const searchBox = document.getElementById('pitch-events-search-input');
      searchBox.value = query;
      searchBox.dispatchEvent(new Event('input'));
    } else if (currentActiveTab === 'startup-applications') {
      const searchBox = document.getElementById('startup-search-input');
      searchBox.value = query;
      searchBox.dispatchEvent(new Event('input'));
    } else if (currentActiveTab === 'students') {
      const searchBox = document.getElementById('students-search-input');
      searchBox.value = query;
      searchBox.dispatchEvent(new Event('input'));
    } else if (currentActiveTab === 'approval-dashboard') {
      const searchBox = document.getElementById('approve-dash-pending-search');
      searchBox.value = query;
      searchBox.dispatchEvent(new Event('input'));
    } else if (currentActiveTab === 'approval-recruiters') {
      const searchBox = document.getElementById('recruiters-search-input');
      searchBox.value = query;
      searchBox.dispatchEvent(new Event('input'));
    } else if (currentActiveTab === 'approval-investors') {
      const searchBox = document.getElementById('investors-search-input');
      searchBox.value = query;
      searchBox.dispatchEvent(new Event('input'));
    } else if (currentActiveTab === 'approval-pending') {
      const searchBox = document.getElementById('pending-search-input');
      searchBox.value = query;
      searchBox.dispatchEvent(new Event('input'));
    } else if (currentActiveTab === 'approval-approved') {
      const searchBox = document.getElementById('approved-search-input');
      searchBox.value = query;
      searchBox.dispatchEvent(new Event('input'));
    } else if (currentActiveTab === 'approval-rejected') {
      const searchBox = document.getElementById('rejected-search-input');
      searchBox.value = query;
      searchBox.dispatchEvent(new Event('input'));
    }
  }

  function setupGlobalShortcuts() {
    // Focus search on Ctrl + K shortcut
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        document.getElementById('global-nav-search').focus();
      }
    });
  }

  // ==========================================
  // DYNAMIC HTML CANVAS DRAWINGS
  // ==========================================
  
  // 1. Mini Line Sparklines Drawing
  function drawSparkline(canvasId, points, color) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Clear & Resize
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return; // Safeguard for hidden canvases
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    
    const w = rect.width;
    const h = rect.height;
    ctx.clearRect(0, 0, w, h);

    // Setup coordinates
    const minVal = Math.min(...points);
    const maxVal = Math.max(...points);
    const range = maxVal - minVal || 1;

    ctx.lineWidth = 2;
    ctx.strokeStyle = color;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    points.forEach((val, i) => {
      const x = (i / (points.length - 1)) * w;
      const y = h - ((val - minVal) / range) * (h - 8) - 4;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    // Fill area below sparkline
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.closePath();
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    let fillColor = color;
    if (color.startsWith('#')) {
      fillColor = `rgba(${hexToRgb(color)}, 0.15)`;
    } else if (color.startsWith('rgb(')) {
      fillColor = color.replace('rgb(', 'rgba(').replace(')', ', 0.15)');
    }
    grad.addColorStop(0, fillColor);
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.fill();
  }

  // 2. Large Line Chart Drawing with grids
  function drawLineChart(canvasId, labels, datasets) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return; // Safeguard for hidden canvases
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;
    ctx.clearRect(0, 0, w, h);

    // Padding bounds for labels
    const padLeft = 40;
    const padRight = 20;
    const padTop = 15;
    const padBottom = 25;
    const chartW = w - padLeft - padRight;
    const chartH = h - padTop - padBottom;

    // Get max value across all datasets
    let allPoints = [];
    datasets.forEach(d => allPoints.push(...d.points));
    const maxVal = Math.max(...allPoints, 100);

    // Draw Grids (horizontal lines)
    ctx.strokeStyle = 'rgba(255,255,255,0.06)';
    ctx.lineWidth = 1;
    ctx.font = '10px sans-serif';
    ctx.fillStyle = '#56647a';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';

    const gridLinesCount = 5;
    for (let i = 0; i <= gridLinesCount; i++) {
      const gridY = padTop + chartH - (i / gridLinesCount) * chartH;
      const gridVal = Math.round((i / gridLinesCount) * maxVal);
      
      // Line
      ctx.beginPath();
      ctx.moveTo(padLeft, gridY);
      ctx.lineTo(w - padRight, gridY);
      ctx.stroke();

      // Label
      ctx.fillText(gridVal, padLeft - 8, gridY);
    }

    // Draw Datasets Lines
    datasets.forEach(set => {
      ctx.strokeStyle = set.color;
      ctx.lineWidth = 2.5;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      
      ctx.beginPath();
      set.points.forEach((val, i) => {
        const x = padLeft + (i / (set.points.length - 1)) * chartW;
        const y = padTop + chartH - (val / maxVal) * chartH;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();

      // Draw points circle dots
      ctx.fillStyle = set.color;
      set.points.forEach((val, i) => {
        const x = padLeft + (i / (set.points.length - 1)) * chartW;
        const y = padTop + chartH - (val / maxVal) * chartH;
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#0b0f19'; // Inner dot cutout
        ctx.beginPath();
        ctx.arc(x, y, 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = set.color; // reset
      });
    });

    // Draw X-axis label list
    ctx.textAlign = 'center';
    ctx.fillStyle = '#56647a';
    labels.forEach((lbl, i) => {
      const x = padLeft + (i / (labels.length - 1)) * chartW;
      const y = h - padBottom + 14;
      ctx.fillText(lbl, x, y);
    });
  }

  // 3. Circle Donut Charts
  function drawDonutChart(canvasId, segments) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const rect = canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return; // Safeguard for hidden canvases

    const total = segments.reduce((sum, s) => sum + s.value, 0) || 1;
    let startAngle = -Math.PI / 2; // Start drawing from 12 o'clock

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const radius = Math.min(cx, cy) - 10;

    segments.forEach(seg => {
      const angle = (seg.value / total) * Math.PI * 2;
      
      // Draw slice
      ctx.fillStyle = seg.color;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, radius, startAngle, startAngle + angle);
      ctx.closePath();
      ctx.fill();

      startAngle += angle;
    });

    // Outer edge border details
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(cx, cy, radius, 0, Math.PI * 2);
    ctx.stroke();

    // Center cutout circle
    ctx.fillStyle = '#0b0f19'; // Card background
    ctx.beginPath();
    ctx.arc(cx, cy, radius - 15, 0, Math.PI * 2);
    ctx.fill();
  }

  // Utility hex parser
  function hexToRgb(hex) {
    hex = hex.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `${r}, ${g}, ${b}`;
  }

  // ==========================================
  // SHARED UTILITIES & EXPORTERS
  // ==========================================
  
  // Custom Popover toggle class
  function bindPopoverToggle(btnId, menuId) {
    const btn = document.getElementById(btnId);
    const menu = document.getElementById(menuId);
    if (!btn || !menu) return;

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      menu.classList.toggle('active');
    });

    document.addEventListener('click', () => {
      menu.classList.remove('active');
    });
  }

  function bindSearchFilter(id, callback) {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', (e) => {
        callback(e.target.value.trim());
      });
    }
  }

  function bindSelectFilter(id, callback) {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('change', (e) => {
        callback(e.target.value);
      });
    }
  }

  function bindLimitSelect(id, pagState, renderCallback) {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('change', (e) => {
        pagState.limit = parseInt(e.target.value);
        pagState.page = 1;
        renderCallback();
      });
    }
  }

  function bindImageUpload(id, callback) {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          if (file.size > 3 * 1024 * 1024) {
            alert("File upload size limit is 3MB.");
            el.value = '';
            return;
          }
          const reader = new FileReader();
          reader.onload = (event) => {
            callback(event.target.result, file.name);
          };
          reader.readAsDataURL(file);
        }
      });
    }
  }

  function showPosterPreview(containerId, base64, filename, onRemove) {
    const box = document.getElementById(containerId);
    box.innerHTML = `
      <div class="upload-preview-container" style="margin-top:10px;">
        <img src="${base64}" class="upload-preview-thumb" style="width:80px; height:50px; object-fit:cover; border-radius:4px;">
        <div class="upload-preview-details">
          <div class="upload-preview-name" style="font-size:11px;">${escapeHTML(filename)}</div>
          <span class="upload-preview-reset" style="font-size:10px; color:var(--accent-red); cursor:pointer;">Remove</span>
        </div>
      </div>
    `;
    box.querySelector('.upload-preview-reset').addEventListener('click', () => {
      onRemove();
      box.innerHTML = '';
    });
  }

  function renderPaginationControls(elementId, totalPages, pagState, onPageChange) {
    const parent = document.getElementById(elementId);
    if (!parent) return;

    if (totalPages <= 1) {
      parent.innerHTML = '';
      return;
    }

    let html = '';
    html += `<button class="pagination-btn" ${pagState.page === 1 ? 'disabled' : ''} data-page="${pagState.page - 1}"><i class="fa-solid fa-angle-left"></i></button>`;

    // Simple page boundaries dots
    const delta = 1;
    const left = pagState.page - delta;
    const right = pagState.page + delta + 1;
    const range = [];
    const rangeWithDots = [];
    let l;

    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= left && i < right)) {
        range.push(i);
      }
    }

    for (let i of range) {
      if (l) {
        if (i - l === 2) rangeWithDots.push(l + 1);
        else if (i - l > 2) rangeWithDots.push('...');
      }
      rangeWithDots.push(i);
      l = i;
    }

    rangeWithDots.forEach(p => {
      if (p === '...') {
        html += `<span style="color:var(--text-muted); padding:0 4px;">...</span>`;
      } else {
        html += `<button class="pagination-btn ${pagState.page === p ? 'active' : ''}" data-page="${p}">${p}</button>`;
      }
    });

    html += `<button class="pagination-btn" ${pagState.page === totalPages ? 'disabled' : ''} data-page="${pagState.page + 1}"><i class="fa-solid fa-angle-right"></i></button>`;
    parent.innerHTML = html;

    parent.querySelectorAll('.pagination-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const pVal = btn.getAttribute('data-page');
        if (pVal) onPageChange(parseInt(pVal));
      });
    });
  }

  // ==========================================
  // FORMATTERS ENGINE
  // ==========================================
  function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
  }

  function formatTime12h(timeString) {
    if (!timeString) return '-';
    const parts = timeString.split(':');
    let h = parseInt(parts[0]);
    const m = parts[1] || '00';
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12;
    h = h ? h : 12;
    return `${String(h).padStart(2, '0')}:${m} ${ampm}`;
  }

  function escapeHTML(str) {
    if (!str) return '';
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // ==========================================
  // MULTI-FORMAT EXPORT DOWNLOAD ENGINE
  // ==========================================
  function downloadCSV(csvContent, filename) {
    const encodedUri = encodeURI("data:text/csv;charset=utf-8," + csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // 1. Dashboard export dropdown
  function exportDashboard(format) {
    if (format === 'AllData') {
      alert("Preparing full platform database export...");
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", "stepup_all_platform_data.json");
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      return;
    }
    
    alert(`Generating dashboard report as ${format}...`);
    const totalStudents = state.students.length;
    const totalWebinars = state.webinars.length;
    const totalHackathons = state.hackathons.length;
    const totalPitches = state.pitchEvents.length;
    const totalApps = state.startupApplications.length;
    const totalRegs = state.registrations.length + state.pitchRegistrations.length;

    const csv = `Dashboard Metric,Value,Variance
Total Students,${totalStudents},+18%
Total Webinars,${totalWebinars},+12%
Total Hackathons,${totalHackathons},+8%
Total Pitch Events,${totalPitches},+15%
Total Applications,${totalApps},+20%
Total Registrations,${totalRegs},+18%
`;
    
    downloadCSV(csv, `stepup_dashboard_summary.${format === 'Excel' ? 'xlsx' : format === 'PDF' ? 'pdf' : 'csv'}`);
  }

  // 2. Webinars tab exports
  function exportWebinars(option) {
    if (state.webinars.length === 0) {
      alert("No webinars to export.");
      return;
    }
    let csv = "";
    if (option === 'All') {
      csv = "Webinar ID,Name,Overview,Date,Mode,Venue,Contact\n";
      state.webinars.forEach(w => {
        csv += `${w.id},"${w.name}","${w.overview}",${w.startDate},${w.mode},"${w.venue}","${w.contactName}"\n`;
      });
      downloadCSV(csv, "stepup_webinars_master.csv");
    } else if (option === 'Registrations') {
      csv = "Registration ID,Student Name,Email,Webinar ID,Webinar Name,Date\n";
      state.registrations.forEach(r => {
        const st = state.students.find(s => s.id === r.studentId);
        const wb = state.webinars.find(w => w.id === r.eventId);
        if (st && wb) {
          csv += `${r.id},"${st.name}",${st.email},${wb.id},"${wb.name}",${r.registrationDate}\n`;
        }
      });
      downloadCSV(csv, "stepup_webinar_registrations.csv");
    } else {
      csv = "Registration ID,Student Name,Email,Webinar Name,Attendance Status\n";
      state.registrations.forEach(r => {
        const st = state.students.find(s => s.id === r.studentId);
        const wb = state.webinars.find(w => w.id === r.eventId);
        if (st && wb) {
          csv += `${r.id},"${st.name}",${st.email},"${wb.name}",Present\n`;
        }
      });
      downloadCSV(csv, "stepup_webinar_attendance.csv");
    }
  }

  // 3. Webinar Details exports
  function exportWebinarDetailsCSV(option) {
    const web = state.webinars.find(w => w.id === selectedWebinarId);
    if (!web) return;

    const regs = state.registrations.filter(r => r.eventId === web.id);
    let csv = "";

    if (option === 'Registrations') {
      csv = "Registration ID,Student ID,Student Name,Registration Date\n";
      regs.forEach(r => {
        const s = state.students.find(x => x.id === r.studentId);
        if (s) csv += `${r.id},${s.id},"${s.name}",${r.registrationDate}\n`;
      });
      downloadCSV(csv, `webinar_${web.id}_regs.csv`);
    } else if (option === 'Details') {
      csv = "Student ID,Name,Email,Phone,College,Branch,Year\n";
      regs.forEach(r => {
        const s = state.students.find(x => x.id === r.studentId);
        if (s) csv += `${s.id},"${s.name}",${s.email},${s.phone},"${s.college}","${s.branch}",${s.year}\n`;
      });
      downloadCSV(csv, `webinar_${web.id}_student_details.csv`);
    } else {
      csv = `Webinar: ${web.name}\nDate: ${web.startDate}\nVenue: ${web.venue}\n\nRegistration ID,Student ID,Student Name,Email,Phone,College,Branch,Year,Registration Date\n`;
      regs.forEach(r => {
        const s = state.students.find(x => x.id === r.studentId);
        if (s) csv += `${r.id},${s.id},"${s.name}",${s.email},${s.phone},"${s.college}","${s.branch}",${s.year},${r.registrationDate}\n`;
      });
      downloadCSV(csv, `webinar_${web.id}_complete_data.csv`);
    }
  }

  // 4. Hackathons exports
  function exportHackathonsList() {
    let csv = "Hackathon ID,Name,Conducted By,Format,StartDate,Venue,Registrations\n";
    state.hackathons.forEach(h => {
      const regCount = state.registrations.filter(r => r.eventId === h.id).length;
      csv += `${h.id},"${h.name}","${h.conductedBy}",${h.participation},${h.startDate},"${h.venue}",${regCount}\n`;
    });
    downloadCSV(csv, "stepup_hackathons.csv");
  }

  function exportHackathonDetailsCSV(option) {
    const hack = state.hackathons.find(h => h.id === selectedHackathonId);
    if (!hack) return;

    const regs = state.registrations.filter(r => r.eventId === hack.id);
    let csv = "";

    if (option === 'Registrations') {
      csv = "Registration ID,Student ID,Student Name,Registration Date\n";
      regs.forEach(r => {
        const s = state.students.find(x => x.id === r.studentId);
        if (s) csv += `${r.id},${s.id},"${s.name}",${r.registrationDate}\n`;
      });
      downloadCSV(csv, `hackathon_${hack.id}_regs.csv`);
    } else if (option === 'Teams') {
      csv = "Registration ID,Team ID,Student Name,College,Branch,Role\n";
      regs.forEach((r, idx) => {
        const s = state.students.find(x => x.id === r.studentId);
        if (s) {
          const teamId = `TEAM-${Math.floor(idx / 3) + 1}`;
          csv += `${r.id},${teamId},"${s.name}","${s.college}","${s.branch}",Developer\n`;
        }
      });
      downloadCSV(csv, `hackathon_${hack.id}_teams.csv`);
    } else {
      csv = `Hackathon: ${hack.name}\nConducted By: ${hack.conductedBy}\nFormat: ${hack.participation}\n\nRegistration ID,Student ID,Student Name,Email,Phone,College,Branch,Year,Registration Date\n`;
      regs.forEach(r => {
        const s = state.students.find(x => x.id === r.studentId);
        if (s) csv += `${r.id},${s.id},"${s.name}",${s.email},${s.phone},"${s.college}","${s.branch}",${s.year},${r.registrationDate}\n`;
      });
      downloadCSV(csv, `hackathon_${hack.id}_complete_data.csv`);
    }
  }

  // 5. Pitch Events exports
  function exportPitchEventsList() {
    let csv = "Pitch Event ID,Name,StartDate,Venue,Ticket Tier,Ticket Price,Participants\n";
    state.pitchEvents.forEach(p => {
      const regCount = state.pitchRegistrations.filter(r => r.eventId === p.id).length;
      csv += `${p.id},"${p.name}",${p.startDate},"${p.venue}",${p.ticketName},₹${p.ticketPrice || 0},${regCount}\n`;
    });
    downloadCSV(csv, "stepup_pitch_events.csv");
  }

  function exportPitchDetailsCSV(option) {
    const pe = state.pitchEvents.find(p => p.id === selectedPitchEventId);
    if (!pe) return;

    const regs = state.pitchRegistrations.filter(r => r.eventId === pe.id);
    let csv = "";

    if (option === 'Participants') {
      csv = "Participant ID,Student ID,Student Name,Email,Phone,Registration Date\n";
      regs.forEach(r => {
        const s = state.students.find(x => x.id === r.studentId);
        if (s) csv += `${r.id},${s.id},"${s.name}",${s.email},${s.phone},${r.registrationDate}\n`;
      });
      downloadCSV(csv, `pitch_${pe.id}_participants.csv`);
    } else if (option === 'Sales') {
      csv = "Registration ID,Buyer Name,Email,Ticket Type,Amount Paid,Sale Date\n";
      regs.forEach(r => {
        const s = state.students.find(x => x.id === r.studentId);
        if (s) csv += `${r.id},"${s.name}",${s.email},${pe.ticketName},₹${pe.ticketPrice || 0},${r.registrationDate}\n`;
      });
      downloadCSV(csv, `pitch_${pe.id}_sales.csv`);
    } else {
      csv = `Pitch Event: ${pe.name}\nTicket Tier: ${pe.ticketName}\nTicket Price: ${pe.ticketPrice}\n\nParticipant ID,Student ID,Student Name,Email,Phone,Startup Name,Registration Date\n`;
      regs.forEach(r => {
        const s = state.students.find(x => x.id === r.studentId);
        if (s) csv += `${r.id},${s.id},"${s.name}",${s.email},${s.phone},"${s.college} Corp",${r.registrationDate}\n`;
      });
      downloadCSV(csv, `pitch_${pe.id}_complete_data.csv`);
    }
  }

  // 6. Startup applications exports
  function exportApplications(option) {
    if (state.startupApplications.length === 0) {
      alert("No applications found.");
      return;
    }
    let list = [...state.startupApplications];
    if (option === 'Approved') list = list.filter(a => a.status === 'Approved');
    else if (option === 'Rejected') list = list.filter(a => a.status === 'Rejected');

    let csv = "Application ID,Startup Name,Stage,Industry,Funding Required,Founder Name,Email,Status\n";
    list.forEach(a => {
      csv += `${a.id},"${a.startupName}","${a.stage}","${a.industry}","${a.fundingRequired}","${a.founderName}",${a.email},${a.status}\n`;
    });
    downloadCSV(csv, `startup_applications_${option.toLowerCase()}.csv`);
  }

  // 7. Students exports
  function exportStudentsMaster(option) {
    if (state.students.length === 0) {
      alert("Students directory is empty.");
      return;
    }
    let csv = "Student ID,Full Name,Email,Phone,College,Branch,Year,Created Date\n";
    let list = [...state.students];

    if (option === 'College') {
      list.sort((a, b) => a.college.localeCompare(b.college));
    } else if (option === 'Branch') {
      list.sort((a, b) => a.branch.localeCompare(b.branch));
    }

    list.forEach(s => {
      csv += `${s.id},"${s.name}",${s.email},${s.phone},"${s.college}","${s.branch}",${s.year} Year,${s.createdDate}\n`;
    });
    downloadCSV(csv, `stepup_students_directory_${option.toLowerCase()}.csv`);
  }

  // 8. Approvals dashboard exports
  function exportApprovals(option) {
    let recs = [...state.recruiters];
    let invs = [...state.investors];

    if (option === 'Pending') {
      recs = recs.filter(r => r.status === 'Pending');
      invs = invs.filter(i => i.status === 'Pending');
    } else if (option === 'Approved') {
      recs = recs.filter(r => r.status === 'Approved');
      invs = invs.filter(i => i.status === 'Approved');
    } else if (option === 'Rejected') {
      recs = recs.filter(r => r.status === 'Rejected');
      invs = invs.filter(i => i.status === 'Rejected');
    }

    let csv = "Type,ID,Name,Organization,Designation,Email,Phone,Applied Date,Status\n";

    if (option !== 'Investors') {
      recs.forEach(r => {
        csv += `Recruiter,${r.id},"${r.name}","${r.company}","${r.designation}",${r.email},${r.phone},${r.appliedDate},${r.status}\n`;
      });
    }
    if (option !== 'Recruiters') {
      invs.forEach(i => {
        csv += `Investor,${i.id},"${i.name}","${i.organization}","${i.designation}",${i.email},${i.phone},${i.appliedDate},${i.status}\n`;
      });
    }

    downloadCSV(csv, `approvals_data_${option.toLowerCase()}.csv`);
  }

  // ==========================================
  // MULTI-FORMAT EXPORTS FOR RECRUITER MANAGEMENT
  // ==========================================
  function printPDF(title, headers, rows) {
    const printWindow = window.open('', '_blank');
    let tableHeadersHTML = headers.map(h => `<th>${escapeHTML(h)}</th>`).join('');
    let tableRowsHTML = rows.map(row => {
      return `<tr>${row.map(cell => `<td>${escapeHTML(String(cell))}</td>`).join('')}</tr>`;
    }).join('');

    const htmlContent = `
      <html>
        <head>
          <title>${title}</title>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              background-color: #0d0d11;
              color: #ffffff;
              padding: 40px;
            }
            .header {
              margin-bottom: 30px;
              border-bottom: 2px solid #8b5cf6;
              padding-bottom: 10px;
            }
            h1 {
              font-size: 24px;
              color: #ffffff;
              margin: 0 0 5px 0;
            }
            .meta {
              font-size: 13px;
              color: #a78bfa;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
            }
            th, td {
              border: 1px solid rgba(255, 255, 255, 0.1);
              padding: 10px 12px;
              text-align: left;
              font-size: 13px;
            }
            th {
              background-color: rgba(139, 92, 246, 0.1);
              color: #a78bfa;
              font-weight: 600;
            }
            tr:nth-child(even) {
              background-color: rgba(255, 255, 255, 0.02);
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>${title}</h1>
            <div class="meta">Generated on ${new Date().toLocaleString()} &bull; StepUp for AI Platform</div>
          </div>
          <table>
            <thead>
              <tr>${tableHeadersHTML}</tr>
            </thead>
            <tbody>
              ${tableRowsHTML}
            </tbody>
          </table>
          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
      </html>
    `;
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  }

  function exportRecruiterData(type) {
    const approvedRecs = state.recruiters.filter(r => r.status === 'Approved');
    const uniqueCompanies = [...new Set(approvedRecs.map(r => r.company))];
    const publishedInts = state.internships.filter(i => i.status !== 'Draft');
    const activeInts = state.internships.filter(i => i.status === 'Active');
    const totalApps = state.internshipApplications.length;
    const distinctStudents = [...new Set(state.internshipApplications.map(app => app.studentId))];

    const title = "Recruiter Management Dashboard Metrics";
    const headers = ["Metric", "Value"];
    const rows = [
      ["Total Approved Recruiters", approvedRecs.length],
      ["Total Companies", uniqueCompanies.length],
      ["Published Internships", publishedInts.length],
      ["Active Internships", activeInts.length],
      ["Applications Received", totalApps],
      ["Total Student Applicants", distinctStudents.length]
    ];

    if (type === 'PDF') {
      printPDF(title, headers, rows);
    } else {
      let csv = headers.join(',') + '\n';
      rows.forEach(r => {
        csv += `"${r[0]}",${r[1]}\n`;
      });
      const ext = type === 'Excel' ? 'xlsx' : 'csv';
      downloadCSV(csv, `recruiter_dashboard_metrics.${ext}`);
    }
  }

  function exportRecruiterInternshipsList(format) {
    let list = [...state.internships];
    const approvedRecNames = new Set(state.recruiters.filter(r => r.status === 'Approved').map(r => r.name));
    list = list.filter(i => approvedRecNames.has(i.recruiterName));

    const title = "Recruiter Internships Directory";
    const headers = ["Internship ID", "Title", "Company", "Recruiter", "Posted Date", "Deadline", "Status", "Applications"];
    const rows = list.map(i => {
      const appsCount = state.internshipApplications.filter(app => app.internshipId === i.id).length;
      return [
        i.id,
        i.title,
        i.company,
        i.recruiterName,
        formatDate(i.postedDate),
        formatDate(i.deadline),
        i.status,
        appsCount
      ];
    });

    if (format === 'PDF') {
      printPDF(title, headers, rows);
    } else {
      let csv = headers.map(h => `"${h}"`).join(',') + '\n';
      rows.forEach(r => {
        csv += `"${r[0]}","${r[1]}","${r[2]}","${r[3]}","${r[4]}","${r[5]}","${r[6]}",${r[7]}\n`;
      });
      const ext = format === 'Excel' ? 'xlsx' : 'csv';
      downloadCSV(csv, `recruiter_internships_list.${ext}`);
    }
  }

  function exportRecruiterApplicationsList(format) {
    let list = [...state.internshipApplications];
    const approvedRecs = new Set(state.recruiters.filter(r => r.status === 'Approved').map(r => r.name));
    list = list.filter(app => {
      const internship = state.internships.find(i => i.id === app.internshipId);
      return internship && approvedRecs.has(internship.recruiterName);
    });

    const title = "Ecosystem Internship Applications";
    const headers = ["Application ID", "Internship ID", "Internship Title", "Company", "Student ID", "Student Name", "Applied Date", "Status"];
    const rows = list.map(app => {
      const student = state.students.find(s => s.id === app.studentId);
      const internship = state.internships.find(i => i.id === app.internshipId);
      return [
        app.id,
        app.internshipId,
        internship ? internship.title : '',
        internship ? internship.company : '',
        app.studentId,
        student ? student.name : '',
        formatDate(app.appliedDate),
        app.status
      ];
    });

    if (format === 'PDF') {
      printPDF(title, headers, rows);
    } else {
      let csv = headers.map(h => `"${h}"`).join(',') + '\n';
      rows.forEach(r => {
        csv += `"${r[0]}","${r[1]}","${r[2]}","${r[3]}","${r[4]}","${r[5]}","${r[6]}","${r[7]}"\n`;
      });
      const ext = format === 'Excel' ? 'xlsx' : 'csv';
      downloadCSV(csv, `recruiter_applications_list.${ext}`);
    }
  }

  function exportRecruiterAnalyticsTable(format) {
    const approvedRecs = state.recruiters.filter(r => r.status === 'Approved');
    const title = "Recruiter Performance Analytics";
    const headers = ["Recruiter Name", "Company", "Published", "Active", "Closed", "Applications", "Unique Applicants", "Last Active"];
    
    const rows = approvedRecs.map(rec => {
      const recInts = state.internships.filter(i => i.recruiterName === rec.name);
      const recApps = state.internshipApplications.filter(app => recInts.some(i => i.id === app.internshipId));
      const uniqueApplicants = [...new Set(recApps.map(app => app.studentId))].length;
      
      let lastActivity = rec.appliedDate;
      recInts.forEach(i => {
        if (i.postedDate > lastActivity) lastActivity = i.postedDate;
      });
      recApps.forEach(a => {
        if (a.appliedDate > lastActivity) lastActivity = a.appliedDate;
      });

      return [
        rec.name,
        rec.company,
        recInts.length,
        recInts.filter(i => i.status === 'Active').length,
        recInts.filter(i => i.status === 'Closed').length,
        recApps.length,
        uniqueApplicants,
        formatDate(lastActivity)
      ];
    });

    if (format === 'PDF') {
      printPDF(title, headers, rows);
    } else {
      let csv = headers.map(h => `"${h}"`).join(',') + '\n';
      rows.forEach(r => {
        csv += `"${r[0]}","${r[1]}",${r[2]},${r[3]},${r[4]},${r[5]},${r[6]},"${r[7]}"\n`;
      });
      const ext = format === 'Excel' ? 'xlsx' : 'csv';
      downloadCSV(csv, `recruiter_analytics.${ext}`);
    }
  }

  function exportRecruiterProfilesList(format) {
    let list = [...state.recruiters].filter(r => r.status === 'Approved');
    const title = "Verified Corporate Recruiter Profiles";
    const headers = ["Recruiter ID", "Name", "Company", "Designation", "Email", "Phone", "Status", "Internships", "Applications"];

    const rows = list.map(r => {
      const totalInts = state.internships.filter(i => i.recruiterName === r.name).length;
      const recInts = state.internships.filter(i => i.recruiterName === r.name);
      const totalApps = state.internshipApplications.filter(app => recInts.some(i => i.id === app.internshipId)).length;

      return [
        r.id,
        r.name,
        r.company,
        r.designation,
        r.email,
        r.phone,
        r.status,
        totalInts,
        totalApps
      ];
    });

    if (format === 'PDF') {
      printPDF(title, headers, rows);
    } else {
      let csv = headers.map(h => `"${h}"`).join(',') + '\n';
      rows.forEach(r => {
        csv += `"${r[0]}","${r[1]}","${r[2]}","${r[3]}","${r[4]}","${r[5]}","${r[6]}",${r[7]},${r[8]}\n`;
      });
      const ext = format === 'Excel' ? 'xlsx' : 'csv';
      downloadCSV(csv, `recruiter_profiles_list.${ext}`);
    }
  }

  function exportInternshipApplicants(internshipId, filterType) {
    const internship = state.internships.find(i => i.id === internshipId);
    if (!internship) return;

    let appsList = state.internshipApplications.filter(app => app.internshipId === internship.id);
    if (filterType === 'Selected') {
      appsList = appsList.filter(app => app.status === 'Selected');
    } else if (filterType === 'Rejected') {
      appsList = appsList.filter(app => app.status === 'Rejected');
    }

    let csv = "";
    if (filterType === 'Complete') {
      csv = "Application ID,Student ID,Student Name,Email,Phone,College,Branch,Year,Applied Date,Status,Skills,Resume Link\n";
      appsList.forEach(app => {
        const student = state.students.find(s => s.id === app.studentId);
        if (student) {
          csv += `${app.id},${student.id},"${student.name}",${student.email},${student.phone},"${student.college}","${student.branch}",${student.year} Year,${app.appliedDate},${app.status},"${student.skills || ''}","${student.resume || ''}"\n`;
        }
      });
      downloadCSV(csv, `internship_${internship.id}_applicants_complete.csv`);
    } else {
      csv = "Application ID,Student ID,Student Name,Email,Phone,College,Branch,Year,Applied Date,Status\n";
      appsList.forEach(app => {
        const student = state.students.find(s => s.id === app.studentId);
        if (student) {
          csv += `${app.id},${student.id},"${student.name}",${student.email},${student.phone},"${student.college}","${student.branch}",${student.year} Year,${app.appliedDate},${app.status}\n`;
        }
      });
      downloadCSV(csv, `internship_${internship.id}_applicants_${filterType.toLowerCase()}.csv`);
    }
  }

  // ==========================================
  // SEED DEMO MOCK ECOSYSTEM DATA
  // ==========================================
  function seedDemoDataQuietly() {
    const firstNames = ["Rahul", "Priya", "Amit", "Sneha", "Rohan", "Anjali", "Karan", "Neha", "Vijay", "Pooja", "Arjun", "Tanya", "Sanjay", "Kiran", "Aditya", "Ritu", "Vikram", "Divya", "Siddharth", "Shreya"];
    const lastNames = ["Sharma", "Verma", "Singh", "Kapoor", "Mehta", "Sen", "Gupta", "Iyer", "Nair", "Rao", "Joshi", "Patel", "Reddy", "Choudhury", "Das", "Roy", "Saxena", "Bose", "Pillai", "Menon"];
    const colleges = ["IIT Madras", "BITS Pilani", "PES University", "RV College of Eng", "IIT Bombay", "IIT Delhi", "NIT Trichy", "Delhi Technological University", "VIT Vellore", "SRM University"];
    const branches = ["Computer Science", "Information Technology", "Electronics & Communication", "Electrical Engineering", "Mechanical Engineering", "Biotechnology", "Civil Engineering"];

    // 1. Generate 1248 Students
    const students = [];
    for (let i = 1; i <= 1248; i++) {
      const fn = firstNames[i % firstNames.length];
      const ln = lastNames[(i + 3) % lastNames.length];
      const name = `${fn} ${ln}`;
      const email = `${fn.toLowerCase()}.${ln.toLowerCase()}.${i}@stepup.ai`;
      const phone = `98765${String(10000 + i).substring(1)}`;
      const college = colleges[i % colleges.length];
      const branch = branches[(i + 2) % branches.length];
      const year = String((i % 4) + 1);
      
      const date = new Date();
      date.setDate(date.getDate() - (i % 30));
      date.setHours(9 + (i % 8), (i % 12) * 5, 0, 0);

      const skillsPool = [
        "React, Node.js, JavaScript, Python, Git",
        "Python, PyTorch, SQL, Machine Learning, Docker",
        "UI/UX Design, Figma, HTML, CSS, Wireframing",
        "Java, Spring Boot, MySQL, REST APIs, Git",
        "Product Management, Agile, Jira, SEO, SQL"
      ];
      students.push({
        id: `STU${String(1000 + i).substring(1)}`,
        name,
        email,
        phone,
        college,
        branch,
        year,
        createdDate: date.toISOString(),
        skills: skillsPool[i % skillsPool.length],
        resume: `https://stepup.ai/portfolios/resumes/resume_student_${i}.pdf`
      });
    }

    // 2. Generate 24 Webinars
    const webinars = [];
    const webinarNames = [
      "AI Startup Funding Pathways", "NLP and LLM Architectures Bootcamp", "Generative Designs for Web Interfaces",
      "Building Conversational Agents with Gemini", "Introduction to Prompt Engineering", "AI in Medical Diagnostics",
      "Deploying PyTorch Models to Production", "Understanding Deep Learning Math", "Introduction to Transformer Networks",
      "Reinforcement Learning Basics", "Scaling LLMs in Enterprise", "Explainable AI Frameworks",
      "AI Safety and Ethics Workshop", "Computer Vision and Edge Devices", "Vector Databases for AI Search",
      "Introduction to AutoGPT and Agents", "MLOps Lifecycle with Kubernetes", "Data Preprocessing pipelines",
      "AI in Fintech Valuations", "Graph Neural Networks Introduction", "Speech Recognition Systems",
      "Self-Supervised Learning Trends", "Low-code AI Platform Builders", "Neural Architecture Search"
    ];
    const webinarModes = ["Online", "Offline", "Hybrid"];
    for (let i = 1; i <= 24; i++) {
      const name = webinarNames[i - 1];
      const date = new Date();
      date.setDate(date.getDate() - 10 + i); 
      webinars.push({
        id: 2000 + i,
        name,
        posterBanner: "",
        overview: `Master class on ${name.split(" ")[0]} details`,
        description: `Join this expert session to master ${name}. We cover theoretical fundamentals, live code exercises, and implementation templates.`,
        startDate: date.toISOString().split('T')[0],
        endDate: date.toISOString().split('T')[0],
        timezone: "UTC+5:30",
        startTime: "10:00",
        endTime: "12:00",
        mode: webinarModes[i % 3],
        venue: i % 3 === 0 ? "Zoom Video Link" : "StepUp Seminar Hall Room 302",
        contactName: `Speaker ${i} Admin`,
        contactPhone: `98765432${String(10 + i)}`,
        contactEmail: `webinar${i}@stepup.ai`
      });
    }

    // 3. Generate 18 Hackathons
    const hackathons = [];
    const hackNames = [
      "IncubateX Global AI Hackathon", "Solo DevCraft: LLM Challenge", "Smart India AgriTech Hack",
      "MediHack: Healthcare AI", "CodeWave FinTech AI Sprint", "VisionHack: Edge Computing",
      "CyberShield AI Security", "EduSmart Learning Sprint", "EcoHack: Green Tech AI",
      "Neural Networks Optimization", "SpeechToText AI Sprint", "DataStream Real-time Analytics",
      "RoboCraft AI Challenge", "WebSaaS Generative Design", "Generative Art Hack",
      "BioGen AI Diagnostics", "Smart City Logistics Sprint", "AI Assistant Hackathon"
    ];
    for (let i = 1; i <= 18; i++) {
      const name = hackNames[i - 1];
      const date = new Date();
      date.setDate(date.getDate() - 15 + (i * 2));
      const endD = new Date(date);
      endD.setDate(date.getDate() + 2);
      hackathons.push({
        id: 3000 + i,
        name,
        conductedBy: i % 2 === 0 ? "StepUp Incubations" : "AI Dev Community",
        orgLogo: "",
        posterBanner: "",
        description: `Assemble your teams and build state-of-the-art AI applications for ${name}. Win cash prizes, certificates, and VC incubation slots.`,
        participation: i % 3 === 0 ? "Solo" : "Team",
        minTeamSize: i % 3 === 0 ? null : 2,
        maxTeamSize: i % 3 === 0 ? null : 4,
        startDate: date.toISOString().split('T')[0],
        endDate: endD.toISOString().split('T')[0],
        timezone: "UTC+5:30",
        startTime: "09:00",
        endTime: "18:00",
        mode: i % 2 === 0 ? "Online" : "Offline",
        venue: i % 2 === 0 ? "Discord & GitHub Classroom" : "StepUp Tech Campus, Bangalore",
        certificateAvailable: "Yes",
        contactName: `Coordinator ${i}`,
        contactPhone: `98765433${String(10 + i)}`,
        contactEmail: `hackathon${i}@stepup.ai`
      });
    }

    // 4. Generate 11 Pitch Events
    const pitchEvents = [];
    const pitchNames = [
      "Venture Capital Pitch Night", "Angel Investors AI Showcase", "Incubator Cohort Demo Day",
      "HealthTech Startup Pitch", "DeepTech Founder Summit", "Agritech AI Pitch Day",
      "Fintech Innovation Pitch", "SaaS Startup Showcase", "Pre-seed AI Startup Night",
      "Series A Pitch Forum", "Early Stage AI Founder Meet"
    ];
    for (let i = 1; i <= 11; i++) {
      const name = pitchNames[i - 1];
      const date = new Date();
      date.setDate(date.getDate() - 5 + (i * 3));
      pitchEvents.push({
        id: 4000 + i,
        name,
        posterBanner: "",
        overview: `Key investor pitch session showcasing ${name.split(" ")[0]} innovators.`,
        description: `Present your startup pitch deck directly to institutional VCs and prominent angel syndicates at ${name}.`,
        startDate: date.toISOString().split('T')[0],
        endDate: date.toISOString().split('T')[0],
        timezone: "UTC+5:30",
        startTime: "18:00",
        endTime: "21:00",
        mode: i % 2 === 0 ? "Online" : "Offline",
        venue: i % 2 === 0 ? "Zoom VC Webinar Room" : "ITC Gardenia Grand Ballroom, Bangalore",
        ticketName: i % 2 === 0 ? "Founder Pass" : "VIP Pitch Pass",
        ticketPrice: i % 2 === 0 ? 500 : 1500,
        ticketDescription: "Access to presentations and networking database",
        saleStartDate: new Date(date.getTime() - 20 * 86400000).toISOString().split('T')[0],
        saleEndDate: new Date(date.getTime() - 1 * 86400000).toISOString().split('T')[0],
        saleStartTime: "09:00",
        saleEndTime: "18:00",
        contactName: `Incubator Lead ${i}`,
        contactPhone: `98765434${String(10 + i)}`,
        contactEmail: `pitches${i}@stepup.ai`
      });
    }

    // 5. Generate 47 Startup Applications
    const startupApps = [];
    const startupPrefixes = ["Vision", "Agri", "Medi", "Edu", "Fin", "Eco", "Robo", "Cloud", "Cyber", "Smart", "Neural", "Hyper", "Alpha", "Omni", "Quantum"];
    const startupSuffixes = ["AI", "Sense", "Scan", "Smart", "Wave", "Shield", "Logistics", "Analytics", "Core", "Systems", "Net", "Bio", "Grid", "Labs", "Tech"];
    const industries = ["Healthcare AI", "Agritech IoT", "Biotech Diagnostics", "EdTech AI", "Fintech Blockchain", "Cybersecurity AI", "Logistics MLOps", "GreenTech Smart Grid"];
    const stages = ["Idea Phase", "Prototype/MVP", "Early Traction", "Scaling Phase"];
    const statuses = ["Pending", "Approved", "Rejected"];
    for (let i = 1; i <= 47; i++) {
      const startupName = `${startupPrefixes[i % startupPrefixes.length]}${startupSuffixes[(i + 4) % startupSuffixes.length]}`;
      const founderFn = firstNames[(i + 5) % firstNames.length];
      const founderLn = lastNames[(i + 7) % lastNames.length];
      const founderName = `${founderFn} ${founderLn}`;
      const email = `${founderFn.toLowerCase()}@${startupName.toLowerCase()}.com`;
      const fundingRequired = `₹${(20 + (i % 8) * 15)},00,000`;
      
      const date = new Date();
      date.setDate(date.getDate() - (i % 25));

      startupApps.push({
        id: 5000 + i,
        startupName,
        stage: stages[i % stages.length],
        industry: industries[i % industries.length],
        fundingRequired,
        oneLiner: `AI-powered solution optimizing ${industries[i % industries.length].split(" ")[0]} workflows.`,
        problemStatement: `Current ${industries[i % industries.length].split(" ")[0]} operations suffer from severe efficiency bottlenecks and high error rates.`,
        solution: `Deploy automated deep neural networks to process data pipelines in real-time.`,
        founderName,
        email,
        phone: `98765${String(20000 + i).substring(1)}`,
        teamMembers: (i % 5) + 2,
        status: i <= 20 ? "Pending" : i % 2 === 0 ? "Approved" : "Rejected",
        appliedDate: date.toISOString().split('T')[0]
      });
    }

    // 6. Generate Recruiters & Companies (86 Approved Recruiters belonging to 30 companies)
    // Plus 15 Pending and 10 Rejected Recruiters for Approval Management (Total: 111 Recruiters)
    const recruiterCompanies = [
      "TechNova Solutions", "DataMind Analytics", "BrandWave Digital", "CodeWave Technologies", "MindEdge Consulting",
      "Infosys Labs", "Wipro Digital", "TCS AI Hub", "Cognizant MLOps", "Accenture AI",
      "Quantum Leap Labs", "CyberShield Solutions", "AgriGrow Systems", "MediScan Diagnostics", "CloudPulse Technologies",
      "AlphaCap Ventures", "Apex Softwares", "BlueHorizon Tech", "Nexus AI Corp", "Vanguard Digital",
      "SmartCity Logistics", "BioGen Systems", "EduTech Innovators", "FinCore Systems", "WebSaaS Builders",
      "NeuralCore AI", "HyperScale Labs", "OmniTech Corp", "Delta Software Group", "Vertex Solutions"
    ];
    const recruiters = [];
    const designations = ["HR Manager", "Senior Recruiter", "VP Talent", "Director of HR", "Technical Recruiter"];
    for (let i = 1; i <= 111; i++) {
      const fn = firstNames[(i + 8) % firstNames.length];
      const ln = lastNames[(i + 9) % lastNames.length];
      const name = `${fn} ${ln}`;
      const company = recruiterCompanies[i % recruiterCompanies.length];
      const email = `${fn.toLowerCase()}@${company.toLowerCase().replace(/[^a-z0-9]/g, "")}.com`;
      // Exactly first 86 are Approved, next 15 Pending, last 10 Rejected
      const status = i <= 86 ? "Approved" : (i <= 101 ? "Pending" : "Rejected");
      
      const date = new Date();
      date.setDate(date.getDate() - (i % 20));

      recruiters.push({
        id: `REC${String(100 + i).substring(1)}`,
        name,
        company,
        designation: designations[i % designations.length],
        email,
        phone: `98765${String(30000 + i).substring(1)}`,
        appliedDate: date.toISOString().split('T')[0],
        status
      });
    }

    // 7. Generate 75 Investors (50 Approved, 15 Pending, 10 Rejected)
    const investors = [];
    const orgs = [
      "Alpha Capital Ventures", "Peak Fund Partners", "Sequoia India Hub", "Kalaari Angel Network", 
      "Matrix AI Fund", "Nexus Venture Partners", "Blume Ventures", "Tiger Global India",
      "SoftBank Ventures", "Accel Partners", "Elevation Capital", "Lightspeed India",
      "Chiratae Ventures", "3one4 Capital", "India Quotient", "Omnivore Partners"
    ];
    const bios = [
      "Early-stage tech investor specializing in AI, SaaS, and DeepTech.",
      "Venture capitalist with 10+ years of experience funding enterprise blockchain and fintech innovations.",
      "Venture partner focusing on consumer tech, healthtech, and AI-enabled diagnostics solutions.",
      "Angel investor passionate about green energy, smart cities, and sustainable agricultural technologies.",
      "Growth-stage VC associate looking for startups scaling rapidly in the South-Asian tech corridor."
    ];
    const interestPool = [
      ["Healthcare AI", "Biotech Diagnostics"],
      ["Fintech Blockchain", "Cybersecurity AI"],
      ["EdTech AI", "Logistics MLOps"],
      ["Agritech IoT", "GreenTech Smart Grid"],
      ["Healthcare AI", "EdTech AI", "Fintech Blockchain"]
    ];

    for (let i = 1; i <= 75; i++) {
      const fn = firstNames[(i + 10) % firstNames.length];
      const ln = lastNames[(i + 11) % lastNames.length];
      const name = `${fn} ${ln}`;
      const org = orgs[i % orgs.length];
      const email = `${fn.toLowerCase()}@${org.toLowerCase().replace(/[^a-z0-9]/g, "")}.com`;
      // Exactly first 50 are Approved, next 15 Pending, last 10 Rejected
      const status = i <= 50 ? "Approved" : (i <= 65 ? "Pending" : "Rejected");

      const date = new Date();
      date.setDate(date.getDate() - (i % 25) - 5);

      investors.push({
        id: `INV${String(100 + i).substring(1)}`,
        name,
        organization: org,
        designation: i % 3 === 0 ? "Managing Partner" : i % 3 === 1 ? "Investment Director" : "VC Associate",
        email,
        phone: `98765${String(40000 + i).substring(1)}`,
        appliedDate: date.toISOString().split('T')[0],
        status,
        bio: bios[i % bios.length],
        interests: interestPool[i % interestPool.length]
      });
    }

    // Generate exactly 200 Startup Interests
    const startupInterests = [];
    const interestStatuses = ["Interested", "Contacted", "Meeting Scheduled", "Declined"];
    const approvedInvList = investors.filter(inv => inv.status === 'Approved');
    
    let interestCounter = 1;
    for (let i = 0; i < 200; i++) {
      const inv = approvedInvList[i % approvedInvList.length];
      const startup = startupApps[i % startupApps.length];
      
      const interestD = new Date(startup.appliedDate);
      interestD.setDate(interestD.getDate() + (i % 5) + 1);

      startupInterests.push({
        id: `INT${String(1000 + interestCounter).substring(1)}`,
        investorId: inv.id,
        investorName: inv.name,
        startupId: startup.id,
        startupName: startup.startupName,
        startupIndustry: startup.industry,
        startupStage: startup.stage,
        interestDate: interestD.toISOString().split('T')[0],
        status: interestStatuses[i % 4]
      });
      interestCounter++;
    }

    // Generate exactly 100 Contact Requests
    const contactRequests = [];
    const contactStatuses = ["Pending", "Accepted", "Rejected", "Completed"];
    
    let contactCounter = 1;
    for (let i = 0; i < 100; i++) {
      const inv = approvedInvList[(i + 5) % approvedInvList.length];
      const startup = startupApps[(i + 3) % startupApps.length];
      
      const requestD = new Date(startup.appliedDate);
      requestD.setDate(requestD.getDate() + (i % 7) + 2);

      contactRequests.push({
        id: `REQ${String(1000 + contactCounter).substring(1)}`,
        startupId: startup.id,
        startupName: startup.startupName,
        founderName: startup.founderName,
        founderEmail: startup.email,
        founderPhone: startup.phone,
        investorId: inv.id,
        investorName: inv.name,
        requestDate: requestD.toISOString().split('T')[0],
        status: contactStatuses[i % 4]
      });
      contactCounter++;
    }

    // 8. Generate Event Registrations (Total: 950)
    const registrations = [];
    let regCounter = 1;
    for (let i = 0; i < 950; i++) {
      const student = students[i % students.length];
      const isWebinar = i % 2 === 0;
      const eventId = isWebinar 
        ? webinars[i % webinars.length].id 
        : hackathons[i % hackathons.length].id;
      
      const date = new Date();
      date.setDate(date.getDate() - (i % 25));

      registrations.push({
        id: `REG${String(10000 + regCounter).substring(1)}`,
        studentId: student.id,
        eventId,
        registrationDate: date.toISOString()
      });
      regCounter++;
    }

    // 9. Generate Pitch Registrations (Total: 298)
    const pitchRegistrations = [];
    let pitchCounter = 1;
    for (let i = 0; i < 298; i++) {
      const student = students[(i + 50) % students.length];
      const eventId = pitchEvents[i % pitchEvents.length].id;

      const date = new Date();
      date.setDate(date.getDate() - (i % 25));

      pitchRegistrations.push({
        id: `PR${String(10000 + pitchCounter).substring(1)}`,
        studentId: student.id,
        eventId,
        registrationDate: date.toISOString()
      });
      pitchCounter++;
    }

    // 10. Generate 160 Internships (96 Active, 56 Closed, 8 Draft)
    const internships = [];
    const internshipTitles = [
      "Frontend Developer Intern", "Data Science Intern", "Marketing Intern", 
      "Backend Engineer Intern", "UI/UX Design Intern", "Full Stack Developer Intern",
      "Product Management Intern", "Machine Learning Intern", "DevOps Engineer Intern",
      "Software Quality Assurance Intern", "Mobile App Developer Intern", "Cybersecurity Intern",
      "Data Analyst Intern", "Cloud Architect Intern", "Technical Content Writer Intern"
    ];
    const locations = ["Bangalore (Hybrid)", "Remote", "Mumbai (Office)", "Delhi NCR (Hybrid)", "Pune (Office)", "Hyderabad (Remote)"];
    const stipends = ["₹15,000 / month", "₹25,000 / month", "₹10,000 / month", "₹20,000 / month", "Unpaid"];
    const durations = ["3 Months", "6 Months", "2 Months", "4 Months"];
    const skillsRequiredList = [
      "React, HTML5, CSS3, JavaScript",
      "Python, Pandas, SQL, Scikit-learn",
      "SEO, Copywriting, Social Media, Canva",
      "Node.js, Express, MongoDB, REST APIs",
      "Figma, Wireframing, User Research, Prototyping",
      "JavaScript, Vue, Python, Django, PostgreSQL",
      "Agile, Jira, Product Specs, User Analytics",
      "Python, TensorFlow, PyTorch, NLP",
      "Docker, AWS, Kubernetes, CI/CD",
      "Manual Testing, Selenium, Jest, Postman",
      "React Native, Swift, Kotlin, Git",
      "Network Security, OWASP, PenTesting",
      "Excel, Tableau, SQL, PowerBI",
      "AWS, Terraform, CloudFormation, Linux",
      "Technical Writing, Markdown, API Documentation"
    ];

    for (let i = 1; i <= 160; i++) {
      let status = "Active";
      if (i > 96 && i <= 152) {
        status = "Closed";
      } else if (i > 152) {
        status = "Draft";
      }
      
      const title = internshipTitles[i % internshipTitles.length];
      const recruiter = recruiters[i % 86]; // pick an approved recruiter
      const company = recruiter.company;
      const skills = skillsRequiredList[i % skillsRequiredList.length];
      
      const postedD = new Date();
      postedD.setDate(postedD.getDate() - 10 - (i % 20));
      const deadlineD = new Date(postedD);
      deadlineD.setDate(deadlineD.getDate() + 30);
      
      internships.push({
        id: 6000 + i,
        title,
        company,
        recruiterName: recruiter.name,
        description: `Excellent opportunity to work as a ${title} at ${company}. You will collaborate with cross-functional teams, contribute to active projects, and receive direct mentorship from senior engineers.`,
        skillsRequired: skills,
        location: locations[i % locations.length],
        duration: durations[i % durations.length],
        stipend: stipends[i % stipends.length],
        postedDate: postedD.toISOString().split('T')[0],
        deadline: deadlineD.toISOString().split('T')[0],
        status
      });
    }

    // 11. Generate 1248 Internship Applications from 932 Unique Student Applicants
    const internshipApplications = [];
    let appCounter = 1;
    const appStatuses = ["Pending", "Reviewed", "Selected", "Rejected"];
    
    // First 932 students get 1 application each to guarantee 932 unique applicants
    for (let i = 0; i < 932; i++) {
      const student = students[i];
      const internship = internships[i % 152]; // map to published internships (Active/Closed)
      
      const appliedD = new Date(internship.postedDate);
      appliedD.setDate(appliedD.getDate() + (i % 5) + 1);

      internshipApplications.push({
        id: `APP${String(10000 + appCounter).substring(1)}`,
        internshipId: internship.id,
        studentId: student.id,
        appliedDate: appliedD.toISOString().split('T')[0],
        status: appStatuses[i % 4]
      });
      appCounter++;
    }
    
    // Generate remaining 316 applications using the same pool of 932 students
    for (let i = 0; i < 316; i++) {
      const student = students[i % 932];
      const internship = internships[(i + 50) % 152]; // map to published internships (Active/Closed)
      
      const appliedD = new Date(internship.postedDate);
      appliedD.setDate(appliedD.getDate() + (i % 5) + 2);

      internshipApplications.push({
        id: `APP${String(10000 + appCounter).substring(1)}`,
        internshipId: internship.id,
        studentId: student.id,
        appliedDate: appliedD.toISOString().split('T')[0],
        status: appStatuses[(i + 2) % 4]
      });
      appCounter++;
    }

    state.webinars = webinars;
    state.hackathons = hackathons;
    state.pitchEvents = pitchEvents;
    state.startupApplications = startupApps;
    state.recruiters = recruiters;
    state.investors = investors;
    state.students = students;
    state.registrations = registrations;
    state.pitchRegistrations = pitchRegistrations;
    state.internships = internships;
    state.internshipApplications = internshipApplications;
    state.startupInterests = startupInterests;
    state.contactRequests = contactRequests;

    saveDatabase();
  }

  function loadDemoData() {
    seedDemoDataQuietly();
    selectedWebinarId = 2001;
    selectedHackathonId = 3001;
    selectedPitchEventId = 4001;
    selectedPendingIds.clear();

    renderAll();
    window.location.hash = "/admin/dashboard";
    alert("Demo startup incubator evaluation database loaded successfully!");
  }

  // ==========================================
  // RENDERER: RECRUITER MANAGEMENT DASHBOARD
  // ==========================================
  function renderRecruiterDashboard() {
    const approvedRecs = state.recruiters.filter(r => r.status === 'Approved');
    const uniqueCompanies = [...new Set(approvedRecs.map(r => r.company))];
    const publishedInts = state.internships.filter(i => i.status !== 'Draft');
    const activeInts = state.internships.filter(i => i.status === 'Active');
    const closedInts = state.internships.filter(i => i.status === 'Closed');
    const draftInts = state.internships.filter(i => i.status === 'Draft');
    const totalApps = state.internshipApplications.length;
    const distinctStudents = [...new Set(state.internshipApplications.map(app => app.studentId))];

    // Stats Cards Values
    document.getElementById('rec-stat-total-recruiters').innerText = approvedRecs.length;
    document.getElementById('rec-stat-total-companies').innerText = uniqueCompanies.length;
    document.getElementById('rec-stat-published-internships').innerText = publishedInts.length;
    document.getElementById('rec-stat-active-internships').innerText = activeInts.length;
    document.getElementById('rec-stat-applications-received').innerText = totalApps.toLocaleString();
    document.getElementById('rec-stat-student-applicants').innerText = distinctStudents.length.toLocaleString();

    // Mini Sparklines
    drawSparkline('sparkline-recruiter-total', getCumulativeTrend(approvedRecs, 'appliedDate'), '#8b5cf6');
    drawSparkline('sparkline-recruiter-companies', getCumulativeTrend(approvedRecs, 'appliedDate'), '#3b82f6');
    drawSparkline('sparkline-recruiter-published', getCumulativeTrend(publishedInts, 'postedDate'), '#fbbf24');
    drawSparkline('sparkline-recruiter-active', getCumulativeTrend(activeInts, 'postedDate'), '#10b981');
    drawSparkline('sparkline-recruiter-applications', getCumulativeTrend(state.internshipApplications, 'appliedDate'), '#ec4899');
    drawSparkline('sparkline-recruiter-student-applicants', getCumulativeTrend(state.internshipApplications, 'appliedDate'), '#ef4444');

    // Charts Row
    // Line Chart 1: Internship Publishing Trend
    drawLineChart('chart-recruiter-pub-trend', 
      ["01 May", "06 May", "11 May", "16 May", "21 May", "26 May", "31 May"], 
      [{ label: 'Internships', points: [10, 23, 20, 28, 24, 35, 38], color: '#fbbf24' }]
    );

    // Line Chart 2: Application Trend
    drawLineChart('chart-recruiter-app-trend', 
      ["01 May", "06 May", "11 May", "16 May", "21 May", "26 May", "31 May"], 
      [{ label: 'Applications', points: [50, 120, 100, 160, 130, 180, 190], color: '#ec4899' }]
    );

    // Donut Chart: Internship Status Distribution
    const totalInts = activeInts.length + closedInts.length + draftInts.length || 1;
    document.getElementById('donut-recruiter-status-total').innerText = activeInts.length + closedInts.length;
    drawDonutChart('chart-recruiter-status-donut', [
      { value: activeInts.length, color: '#10b981' },
      { value: closedInts.length, color: '#3b82f6' },
      { value: draftInts.length, color: '#f59e0b' }
    ]);

    document.getElementById('donut-recruiter-status-legend').innerHTML = `
      <div class="legend-item"><span class="legend-dot" style="background:#10b981;"></span>Active: <strong>${activeInts.length}</strong> (${((activeInts.length / totalInts) * 100).toFixed(1)}%)</div>
      <div class="legend-item"><span class="legend-dot" style="background:#3b82f6;"></span>Closed: <strong>${closedInts.length}</strong> (${((closedInts.length / totalInts) * 100).toFixed(1)}%)</div>
      <div class="legend-item"><span class="legend-dot" style="background:#f59e0b;"></span>Draft: <strong>${draftInts.length}</strong> (${((draftInts.length / totalInts) * 100).toFixed(1)}%)</div>
    `;

    // Widget Lists
    // Recent Internships
    const sortedInts = [...state.internships].sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate)).slice(0, 3);
    let recentIntsHTML = '';
    sortedInts.forEach(int => {
      const appsCount = state.internshipApplications.filter(app => app.internshipId === int.id).length;
      const statusBadge = int.status === 'Active' ? 'badge-approved' : int.status === 'Closed' ? 'badge-rejected' : 'badge-pending';
      let iconHTML = `<div class="user-avatar" style="background:rgba(139,92,246,0.1); color:#a78bfa; border-radius:8px;"><i class="fa-solid fa-code"></i></div>`;
      if (int.title.includes('Data') || int.title.includes('Machine') || int.title.includes('Analytics')) {
        iconHTML = `<div class="user-avatar" style="background:rgba(59,130,246,0.1); color:#60a5fa; border-radius:8px;"><i class="fa-solid fa-database"></i></div>`;
      } else if (int.title.includes('Marketing') || int.title.includes('Product')) {
        iconHTML = `<div class="user-avatar" style="background:rgba(245,158,11,0.1); color:#fbbf24; border-radius:8px;"><i class="fa-solid fa-bullhorn"></i></div>`;
      }
      recentIntsHTML += `
        <div class="recent-item" style="cursor:pointer;" onclick="window.location.hash = '/admin/recruiter-management/internships/${int.id}'">
          ${iconHTML}
          <div class="recent-item-info">
            <span class="recent-item-title">${escapeHTML(int.title)}</span>
            <span class="recent-item-subtitle">${escapeHTML(int.company)}</span>
          </div>
          <div style="text-align:right; display:flex; flex-direction:column; align-items:flex-end; gap:2px;">
            <span class="${statusBadge}" style="font-size:9px; padding:2px 6px;">${int.status}</span>
            <span style="font-size:11px; color:var(--text-muted);">${formatDate(int.postedDate)}</span>
            <span style="font-size:11px; font-weight:600; color:#fff;">${appsCount} Apps</span>
          </div>
        </div>
      `;
    });
    document.getElementById('dash-recruiter-recent-internships').innerHTML = recentIntsHTML || `<div class="table-empty-state"><p>No recent internships.</p></div>`;

    // Recent Applications
    const sortedApps = [...state.internshipApplications].sort((a, b) => new Date(b.appliedDate) - new Date(a.appliedDate)).slice(0, 3);
    let recentAppsHTML = '';
    sortedApps.forEach(app => {
      const student = state.students.find(s => s.id === app.studentId);
      const internship = state.internships.find(i => i.id === app.internshipId);
      if (student && internship) {
        const initial = student.name.charAt(0);
        const statusBadge = app.status === 'Selected' ? 'badge-approved' : app.status === 'Rejected' ? 'badge-rejected' : 'badge-pending';
        recentAppsHTML += `
          <div class="recent-item" style="cursor:pointer;" onclick="window.dashboardApp.viewStudentProfile('${student.id}')">
            <div class="user-avatar" style="border-radius:50%; background:rgba(236,72,153,0.1); color:#f472b6; font-weight:700;">${initial}</div>
            <div class="recent-item-info">
              <span class="recent-item-title">${escapeHTML(student.name)}</span>
              <span class="recent-item-subtitle">${escapeHTML(internship.title)}</span>
            </div>
            <div style="text-align:right; display:flex; flex-direction:column; align-items:flex-end; gap:2px;">
              <span class="${statusBadge}" style="font-size:9px; padding:2px 6px;">${app.status}</span>
              <span style="font-size:11px; color:var(--text-muted);">${formatDate(app.appliedDate)}</span>
            </div>
          </div>
        `;
      }
    });
    document.getElementById('dash-recruiter-recent-applications').innerHTML = recentAppsHTML || `<div class="table-empty-state"><p>No recent applications.</p></div>`;

    // Top Recruiters Widget
    const companyStats = {};
    uniqueCompanies.forEach(comp => {
      companyStats[comp] = { name: comp, internships: 0, applications: 0 };
    });
    state.internships.forEach(int => {
      if (companyStats[int.company]) {
        companyStats[int.company].internships++;
      }
    });
    state.internshipApplications.forEach(app => {
      const int = state.internships.find(i => i.id === app.internshipId);
      if (int && companyStats[int.company]) {
        companyStats[int.company].applications++;
      }
    });
    const sortedCompanies = Object.values(companyStats).sort((a, b) => b.applications - a.applications).slice(0, 3);
    let topRecHTML = '';
    sortedCompanies.forEach(c => {
      const initial = c.name.charAt(0);
      topRecHTML += `
        <div class="recent-item" style="cursor:pointer;" onclick="window.location.hash = '/admin/recruiter-management/profiles'; recruiterProfilesFilter.search = '${c.name}'; renderRecruiterProfilesTable();">
          <div class="user-avatar" style="border-radius:8px; background:rgba(59,130,246,0.1); color:#60a5fa; font-weight:700;">${initial}</div>
          <div class="recent-item-info">
            <span class="recent-item-title">${escapeHTML(c.name)}</span>
            <span class="recent-item-subtitle" style="font-size:11px; color:var(--text-muted);">${c.internships} Internships</span>
          </div>
          <div style="text-align:right;">
            <span style="font-size:13px; font-weight:700; color:#fff;">${c.applications}</span>
            <span style="display:block; font-size:10px; color:var(--text-muted);">Applications</span>
          </div>
        </div>
      `;
    });
    document.getElementById('dash-recruiter-top-recruiters').innerHTML = topRecHTML || `<div class="table-empty-state"><p>No top recruiters.</p></div>`;
  }

  // ==========================================
  // RENDERER: PUBLISHED INTERNSHIPS TABLE
  // ==========================================
  function renderPublishedInternshipsTable() {
    const tbody = document.getElementById('rec-internships-table-body');
    let list = [...state.internships];

    // Filter to only approved recruiters
    const approvedRecNames = new Set(state.recruiters.filter(r => r.status === 'Approved').map(r => r.name));
    list = list.filter(i => approvedRecNames.has(i.recruiterName));

    // Search
    if (recruiterInternshipsFilter.search) {
      const kw = recruiterInternshipsFilter.search.toLowerCase();
      list = list.filter(i => i.title.toLowerCase().includes(kw) || i.company.toLowerCase().includes(kw) || i.recruiterName.toLowerCase().includes(kw));
    }

    // Status filter
    if (recruiterInternshipsFilter.status) {
      list = list.filter(i => i.status === recruiterInternshipsFilter.status);
    }

    // Sort by posted Date
    list.sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate));

    if (list.length === 0) {
      tbody.innerHTML = `<tr><td colspan="8" class="text-center"><div class="table-empty-state"><p>No internships match filter criteria.</p></div></td></tr>`;
      document.getElementById('rec-internships-pagination-info').innerText = 'Showing 0 to 0 of 0 internships';
      document.getElementById('rec-internships-pagination-controls').innerHTML = '';
      return;
    }

    const total = list.length;
    const pages = Math.ceil(total / pagRecruiterInternships.limit);
    if (pagRecruiterInternships.page > pages) pagRecruiterInternships.page = pages || 1;

    const start = (pagRecruiterInternships.page - 1) * pagRecruiterInternships.limit;
    const pagList = list.slice(start, start + pagRecruiterInternships.limit);

    let html = '';
    pagList.forEach(int => {
      const appsCount = state.internshipApplications.filter(app => app.internshipId === int.id).length;
      const statusBadge = int.status === 'Active' ? 'badge-approved' : int.status === 'Closed' ? 'badge-rejected' : 'badge-pending';
      html += `
        <tr>
          <td style="font-weight:700; color:var(--accent-red); cursor:pointer;" onclick="window.location.hash = '/admin/recruiter-management/internships/${int.id}'">${escapeHTML(int.title)}</td>
          <td style="font-weight:600;">${escapeHTML(int.company)}</td>
          <td>${escapeHTML(int.recruiterName)}</td>
          <td>${formatDate(int.postedDate)}</td>
          <td>${formatDate(int.deadline)}</td>
          <td><span class="${statusBadge}">${int.status}</span></td>
          <td style="font-weight:700;">${appsCount}</td>
          <td>
            <div style="display:flex; gap:4px;">
              <button class="btn-action-eye" onclick="window.location.hash = '/admin/recruiter-management/internships/${int.id}'"><i class="fa-regular fa-eye"></i></button>
            </div>
          </td>
        </tr>
      `;
    });
    tbody.innerHTML = html;

    const end = Math.min(start + pagRecruiterInternships.limit, total);
    document.getElementById('rec-internships-pagination-info').innerText = `Showing ${start + 1} to ${end} of ${total} internships`;
    renderPaginationControls('rec-internships-pagination-controls', pages, pagRecruiterInternships, (p) => {
      pagRecruiterInternships.page = p;
      renderPublishedInternshipsTable();
    });
  }

  // ==========================================
  // RENDERER: INTERNSHIP DETAILS PANE
  // ==========================================
  function renderInternshipDetailsPane() {
    const pane = document.getElementById('recruiter-internship-details-view');
    const internship = state.internships.find(i => i.id === selectedInternshipId);
    if (!internship) {
      pane.innerHTML = `<div class="table-empty-state"><i class="fa-solid fa-inbox"></i><p>Internship not found.</p></div>`;
      return;
    }
    
    // Count applications
    const appsList = state.internshipApplications.filter(app => app.internshipId === internship.id);
    
    // Filter applicants
    let filteredApplicants = [...appsList];
    if (recruiterApplicantsFilter.search) {
      const kw = recruiterApplicantsFilter.search.toLowerCase();
      filteredApplicants = filteredApplicants.filter(app => {
        const student = state.students.find(s => s.id === app.studentId);
        return student && (student.name.toLowerCase().includes(kw) || student.college.toLowerCase().includes(kw) || student.email.toLowerCase().includes(kw));
      });
    }
    if (recruiterApplicantsFilter.status) {
      filteredApplicants = filteredApplicants.filter(app => app.status === recruiterApplicantsFilter.status);
    }
    
    // Pagination for applicants
    const total = filteredApplicants.length;
    const pages = Math.ceil(total / pagRecruiterApplicants.limit);
    if (pagRecruiterApplicants.page > pages) pagRecruiterApplicants.page = pages || 1;
    const start = (pagRecruiterApplicants.page - 1) * pagRecruiterApplicants.limit;
    const pagList = filteredApplicants.slice(start, start + pagRecruiterApplicants.limit);
    
    let applicantsHTML = '';
    pagList.forEach(app => {
      const student = state.students.find(s => s.id === app.studentId);
      if (student) {
        const statusBadge = app.status === 'Selected' ? 'badge-approved' : app.status === 'Rejected' ? 'badge-rejected' : 'badge-pending';
        applicantsHTML += `
          <tr>
            <td class="row-id">${app.id}</td>
            <td class="row-id" style="cursor:pointer; color:var(--accent-red); font-weight:700;" onclick="window.dashboardApp.viewStudentProfile('${student.id}')">${student.id}</td>
            <td style="font-weight:700; cursor:pointer; color:#fff;" onclick="window.dashboardApp.viewStudentProfile('${student.id}')">${escapeHTML(student.name)}</td>
            <td>${escapeHTML(student.email)}</td>
            <td>${escapeHTML(student.phone)}</td>
            <td>${escapeHTML(student.college)}</td>
            <td>${escapeHTML(student.branch)}</td>
            <td>${student.year} Year</td>
            <td>${formatDate(app.appliedDate)}</td>
            <td><span class="${statusBadge}">${app.status}</span></td>
          </tr>
        `;
      }
    });
    
    if (filteredApplicants.length === 0) {
      applicantsHTML = `<tr><td colspan="10" class="text-center"><div class="table-empty-state"><p>No student applicants match filter criteria.</p></div></td></tr>`;
    }
    
    const end = Math.min(start + pagRecruiterApplicants.limit, total);
    const paginationControlsHTML = pages > 1 ? `
      <div class="table-pagination-footer" style="border-top: 1px solid var(--border-color); padding-top:16px;">
        <span class="pagination-info">Showing ${start + 1} to ${end} of ${total} applicants</span>
        <div class="pagination-controls">
          <div class="page-selector-wrapper">
            <select class="page-size-select" id="rec-applicants-page-size">
              <option value="10" ${pagRecruiterApplicants.limit === 10 ? 'selected' : ''}>10 / page</option>
              <option value="25" ${pagRecruiterApplicants.limit === 25 ? 'selected' : ''}>25 / page</option>
            </select>
          </div>
          <div class="events-pagination" id="rec-applicants-pagination-controls" style="padding:0; border:none; margin:0;"></div>
        </div>
      </div>
    ` : '';
    
    pane.innerHTML = `
      <header class="view-header">
        <div class="header-title-block">
          <a href="#" class="back-to-events-btn" onclick="window.dashboardApp.switchTab('recruiter-internships'); return false;" style="display:inline-flex; align-items:center; gap:6px; font-size:13px; font-weight:700; color:var(--text-secondary); margin-bottom:8px;">
            <i class="fa-solid fa-arrow-left"></i> Back to Internships List
          </a>
          <h1 style="font-size:24px; font-weight:800;">${escapeHTML(internship.title)}</h1>
          <p>Company: <strong>${escapeHTML(internship.company)}</strong></p>
        </div>
      </header>
      
      <!-- Specs details Grid -->
      <div class="dashboard-panel-box" style="margin-bottom:24px; padding:20px;">
        <div style="flex-grow:1; display:flex; flex-direction:column; gap:12px; min-width:300px;">
          <div class="details-specs-grid" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap:16px;">
            <div class="spec-item">
              <span class="spec-label">Recruiter Name</span>
              <span class="spec-value"><i class="fa-solid fa-user-tie" style="color:var(--accent-red); margin-right:6px;"></i>${escapeHTML(internship.recruiterName)}</span>
            </div>
            <div class="spec-item">
              <span class="spec-label">Timeline Details</span>
              <span class="spec-value"><i class="fa-regular fa-calendar" style="color:var(--accent-red); margin-right:6px;"></i>Posted: ${formatDate(internship.postedDate)} &bull; Deadline: ${formatDate(internship.deadline)}</span>
            </div>
            <div class="spec-item">
              <span class="spec-label">Location / Stipend</span>
              <span class="spec-value"><i class="fa-solid fa-location-dot" style="color:var(--accent-red); margin-right:6px;"></i>${escapeHTML(internship.location)} &bull; ${escapeHTML(internship.stipend)}</span>
            </div>
            <div class="spec-item">
              <span class="spec-label">Duration / Status</span>
              <span class="spec-value"><i class="fa-regular fa-clock" style="color:var(--accent-red); margin-right:6px;"></i>${escapeHTML(internship.duration)} &bull; <span class="event-row-badge badge-webinar" style="margin-left:4px;">${internship.status}</span></span>
            </div>
          </div>
          
          <div style="border-top:1px solid var(--border-color); padding-top:12px; margin-top:8px;">
            <h4 style="font-size:12px; color:var(--text-muted); text-transform:uppercase; margin-bottom:4px;">Skills Required</h4>
            <p style="font-size:13px; color:#fff; font-weight:600; line-height:1.6; margin-bottom:12px;">${escapeHTML(internship.skillsRequired)}</p>
            
            <h4 style="font-size:12px; color:var(--text-muted); text-transform:uppercase; margin-bottom:4px;">Description</h4>
            <p style="font-size:13px; color:var(--text-secondary); line-height:1.6;">${escapeHTML(internship.description)}</p>
          </div>
        </div>
      </div>
      
      <!-- Applicants Table nested inside details -->
      <div class="table-section" style="margin-top:24px;">
        <div class="table-header-flex">
          <div class="header-title-block">
            <h3>Registered Applicants (${appsList.length})</h3>
          </div>
          
          <div style="display:flex; gap:10px; align-items:center;">
            <div class="search-input-wrapper" style="width:230px;">
              <i class="fa-solid fa-magnifying-glass"></i>
              <input type="text" class="search-input" id="rec-applicants-search" placeholder="Search name, email...">
            </div>
            
            <select class="form-control-input" id="rec-applicants-filter-status" style="padding:8px 12px; font-size:13px; width:130px;">
              <option value="">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Reviewed">Reviewed</option>
              <option value="Selected">Selected</option>
              <option value="Rejected">Rejected</option>
            </select>
            
            <div class="dropdown-action-container" id="rec-applicants-export-container">
              <button class="btn-export-dropdown" id="rec-applicants-export-btn" style="padding: 8px 12px; font-size: 13px;">
                <i class="fa-solid fa-download"></i> Export <i class="fa-solid fa-chevron-down" style="font-size:10px;"></i>
              </button>
              <div class="export-popover-menu" id="rec-applicants-export-menu" style="right: 0; left: auto; width: 230px;">
                <div class="export-popover-item" onclick="window.dashboardApp.exportInternshipApplicants(${internship.id}, 'All')"><i class="fa-solid fa-users"></i> Export Applicants</div>
                <div class="export-popover-item" onclick="window.dashboardApp.exportInternshipApplicants(${internship.id}, 'Selected')"><i class="fa-solid fa-circle-check" style="color:var(--accent-green);"></i> Export Selected Applicants</div>
                <div class="export-popover-item" onclick="window.dashboardApp.exportInternshipApplicants(${internship.id}, 'Rejected')"><i class="fa-solid fa-circle-xmark" style="color:var(--accent-red);"></i> Export Rejected Applicants</div>
                <div class="export-popover-item" onclick="window.dashboardApp.exportInternshipApplicants(${internship.id}, 'Complete')"><i class="fa-solid fa-database"></i> Export Complete Applicant Data</div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Application ID</th>
                <th>Student ID</th>
                <th>Student Name</th>
                <th>Email</th>
                <th>Phone Number</th>
                <th>College</th>
                <th>Branch</th>
                <th>Year</th>
                <th>Applied Date</th>
                <th>Application Status</th>
              </tr>
            </thead>
            <tbody>
              ${applicantsHTML}
            </tbody>
          </table>
        </div>
        
        ${paginationControlsHTML}
      </div>
    `;
    
    // Bind search & filter inputs in details pane
    const searchBox = document.getElementById('rec-applicants-search');
    if (searchBox) {
      searchBox.value = recruiterApplicantsFilter.search;
      searchBox.addEventListener('input', (e) => {
        recruiterApplicantsFilter.search = e.target.value;
        pagRecruiterApplicants.page = 1;
        renderInternshipDetailsPane();
      });
    }
    
    const filterSelect = document.getElementById('rec-applicants-filter-status');
    if (filterSelect) {
      filterSelect.value = recruiterApplicantsFilter.status;
      filterSelect.addEventListener('change', (e) => {
        recruiterApplicantsFilter.status = e.target.value;
        pagRecruiterApplicants.page = 1;
        renderInternshipDetailsPane();
      });
    }
    
    const sizeSelect = document.getElementById('rec-applicants-page-size');
    if (sizeSelect) {
      sizeSelect.value = pagRecruiterApplicants.limit;
      sizeSelect.addEventListener('change', (e) => {
        pagRecruiterApplicants.limit = parseInt(e.target.value);
        pagRecruiterApplicants.page = 1;
        renderInternshipDetailsPane();
      });
    }
    
    if (pages > 1) {
      renderPaginationControls('rec-applicants-pagination-controls', pages, pagRecruiterApplicants, (p) => {
        pagRecruiterApplicants.page = p;
        renderInternshipDetailsPane();
      });
    }
    
    // Bind the export dropdown
    bindPopoverToggle('rec-applicants-export-btn', 'rec-applicants-export-menu');
  }

  // ==========================================
  // RENDERER: RECRUITER APPLICATIONS TABLE
  // ==========================================
  function renderRecruiterApplicationsTable() {
    const tbody = document.getElementById('rec-apps-table-body');
    let list = [...state.internshipApplications];

    // Filter to only approved recruiters
    const approvedRecs = new Set(state.recruiters.filter(r => r.status === 'Approved').map(r => r.name));
    list = list.filter(app => {
      const internship = state.internships.find(i => i.id === app.internshipId);
      return internship && approvedRecs.has(internship.recruiterName);
    });

    // Update Stats Cards
    const total = list.length;
    const pending = list.filter(a => a.status === 'Pending').length;
    const reviewed = list.filter(a => a.status === 'Reviewed').length;
    const selected = list.filter(a => a.status === 'Selected').length;
    const rejected = list.filter(a => a.status === 'Rejected').length;

    document.getElementById('app-card-total').innerText = total;
    document.getElementById('app-card-pending').innerText = pending;
    document.getElementById('app-card-reviewed').innerText = reviewed;
    document.getElementById('app-card-selected').innerText = selected;
    document.getElementById('app-card-rejected').innerText = rejected;

    // Search
    if (recruiterApplicationsFilter.search) {
      const kw = recruiterApplicationsFilter.search.toLowerCase();
      list = list.filter(app => {
        const student = state.students.find(s => s.id === app.studentId);
        const internship = state.internships.find(i => i.id === app.internshipId);
        return (
          (student && student.name.toLowerCase().includes(kw)) ||
          (internship && internship.title.toLowerCase().includes(kw)) ||
          (internship && internship.company.toLowerCase().includes(kw))
        );
      });
    }

    // Status Filter
    if (recruiterApplicationsFilter.status) {
      list = list.filter(app => app.status === recruiterApplicationsFilter.status);
    }

    // Sort by Applied Date
    list.sort((a, b) => new Date(b.appliedDate) - new Date(a.appliedDate));

    if (list.length === 0) {
      tbody.innerHTML = `<tr><td colspan="8" class="text-center"><div class="table-empty-state"><p>No applications match filter criteria.</p></div></td></tr>`;
      document.getElementById('rec-apps-pagination-info').innerText = 'Showing 0 to 0 of 0 applications';
      document.getElementById('rec-apps-pagination-controls').innerHTML = '';
      return;
    }

    const totalFiltered = list.length;
    const pages = Math.ceil(totalFiltered / pagRecruiterApplications.limit);
    if (pagRecruiterApplications.page > pages) pagRecruiterApplications.page = pages || 1;

    const start = (pagRecruiterApplications.page - 1) * pagRecruiterApplications.limit;
    const pagList = list.slice(start, start + pagRecruiterApplications.limit);

    let html = '';
    pagList.forEach(app => {
      const student = state.students.find(s => s.id === app.studentId);
      const internship = state.internships.find(i => i.id === app.internshipId);
      if (student && internship) {
        const statusBadge = app.status === 'Selected' ? 'badge-approved' : app.status === 'Rejected' ? 'badge-rejected' : 'badge-pending';
        html += `
          <tr>
            <td class="row-id">${app.id}</td>
            <td style="font-weight:700; color:var(--accent-red); cursor:pointer;" onclick="window.location.hash = '/admin/recruiter-management/internships/${internship.id}'">${escapeHTML(internship.title)}</td>
            <td style="font-weight:600;">${escapeHTML(internship.company)}</td>
            <td style="font-weight:700; cursor:pointer;" onclick="window.dashboardApp.viewStudentProfile('${student.id}')">${escapeHTML(student.name)}</td>
            <td class="row-id" style="cursor:pointer; color:var(--accent-red); font-weight:700;" onclick="window.dashboardApp.viewStudentProfile('${student.id}')">${student.id}</td>
            <td>${escapeHTML(student.college)}</td>
            <td>${formatDate(app.appliedDate)}</td>
            <td><span class="${statusBadge}">${app.status}</span></td>
          </tr>
        `;
      }
    });
    tbody.innerHTML = html;

    const end = Math.min(start + pagRecruiterApplications.limit, totalFiltered);
    document.getElementById('rec-apps-pagination-info').innerText = `Showing ${start + 1} to ${end} of ${totalFiltered} applications`;
    renderPaginationControls('rec-apps-pagination-controls', pages, pagRecruiterApplications, (p) => {
      pagRecruiterApplications.page = p;
      renderRecruiterApplicationsTable();
    });
  }

  // ==========================================
  // RENDERER: RECRUITER ANALYTICS
  // ==========================================
  function renderRecruiterAnalytics() {
    const approvedRecs = state.recruiters.filter(r => r.status === 'Approved');
    
    // Top Recruiters Horizontal Progress Bars
    const recruiterStats = {};
    approvedRecs.forEach(rec => {
      const recInts = state.internships.filter(i => i.recruiterName === rec.name);
      const recApps = state.internshipApplications.filter(app => recInts.some(i => i.id === app.internshipId));
      recruiterStats[rec.name] = { name: rec.name, company: rec.company, count: recApps.length };
    });
    const topRecs = Object.values(recruiterStats).sort((a,b) => b.count - a.count).slice(0, 3);
    const maxRecApps = topRecs[0] ? topRecs[0].count : 1;
    let topRecsHTML = '';
    topRecs.forEach(r => {
      const percentage = (r.count / maxRecApps) * 100;
      topRecsHTML += `
        <div style="display:flex; flex-direction:column; gap:4px; width:100%;">
          <div style="display:flex; justify-content:space-between; font-size:12px; font-weight:600;">
            <span>${escapeHTML(r.name)} (${escapeHTML(r.company)})</span>
            <span style="color:#a78bfa;">${r.count} Apps</span>
          </div>
          <div style="background:rgba(255,255,255,0.05); height:8px; border-radius:4px; width:100%; overflow:hidden;">
            <div style="background:linear-gradient(90deg, #8b5cf6 0%, #ec4899 100%); width:${percentage}%; height:100%;"></div>
          </div>
        </div>
      `;
    });
    document.getElementById('analytics-top-recruiters-list').innerHTML = topRecsHTML || `<p style="font-size:12px; color:var(--text-muted);">No data available</p>`;

    // Most Applied Internships Horizontal Progress Bars
    const internshipStats = state.internships.map(i => {
      const count = state.internshipApplications.filter(app => app.internshipId === i.id).length;
      return { id: i.id, title: i.title, company: i.company, count };
    });
    const topInts = internshipStats.sort((a,b) => b.count - a.count).slice(0, 3);
    const maxIntApps = topInts[0] ? topInts[0].count : 1;
    let topIntsHTML = '';
    topInts.forEach(i => {
      const percentage = (i.count / maxIntApps) * 100;
      topIntsHTML += `
        <div style="display:flex; flex-direction:column; gap:4px; width:100%;">
          <div style="display:flex; justify-content:space-between; font-size:12px; font-weight:600;">
            <span>${escapeHTML(i.title)} &bull; <small style="color:var(--text-muted);">${escapeHTML(i.company)}</small></span>
            <span style="color:#34d399;">${i.count} Apps</span>
          </div>
          <div style="background:rgba(255,255,255,0.05); height:8px; border-radius:4px; width:100%; overflow:hidden;">
            <div style="background:linear-gradient(90deg, #10b981 0%, #3b82f6 100%); width:${percentage}%; height:100%;"></div>
          </div>
        </div>
      `;
    });
    document.getElementById('analytics-most-applied-list').innerHTML = topIntsHTML || `<p style="font-size:12px; color:var(--text-muted);">No data available</p>`;

    // Activity Trends Line Charts
    drawLineChart('chart-analytics-activity-trend',
      ["01 May", "06 May", "11 May", "16 May", "21 May", "26 May", "31 May"],
      [{ label: 'Activity', points: [5, 12, 10, 18, 15, 22, 25], color: '#8b5cf6' }]
    );
    drawLineChart('chart-analytics-apps-trend',
      ["01 May", "06 May", "11 May", "16 May", "21 May", "26 May", "31 May"],
      [{ label: 'Applications', points: [50, 120, 100, 160, 130, 180, 190], color: '#10b981' }]
    );

    // Analytics Table Rows
    const tbody = document.getElementById('rec-analytics-table-body');
    let analyticsList = approvedRecs.map(rec => {
      const recInts = state.internships.filter(i => i.recruiterName === rec.name);
      const recApps = state.internshipApplications.filter(app => recInts.some(i => i.id === app.internshipId));
      const uniqueApplicants = [...new Set(recApps.map(app => app.studentId))].length;
      
      let lastActivity = rec.appliedDate;
      recInts.forEach(i => {
        if (i.postedDate > lastActivity) lastActivity = i.postedDate;
      });
      recApps.forEach(a => {
        if (a.appliedDate > lastActivity) lastActivity = a.appliedDate;
      });

      return {
        name: rec.name,
        company: rec.company,
        published: recInts.length,
        active: recInts.filter(i => i.status === 'Active').length,
        closed: recInts.filter(i => i.status === 'Closed').length,
        apps: recApps.length,
        unique: uniqueApplicants,
        lastActive: lastActivity
      };
    });

    // Search filter
    if (recruiterAnalyticsFilter.search) {
      const kw = recruiterAnalyticsFilter.search.toLowerCase();
      analyticsList = analyticsList.filter(row => row.name.toLowerCase().includes(kw) || row.company.toLowerCase().includes(kw));
    }

    analyticsList.sort((a,b) => b.apps - a.apps);

    if (analyticsList.length === 0) {
      tbody.innerHTML = `<tr><td colspan="9" class="text-center"><div class="table-empty-state"><p>No analytics data matches filter criteria.</p></div></td></tr>`;
      return;
    }

    let html = '';
    analyticsList.forEach(row => {
      html += `
        <tr>
          <td style="font-weight:700; color:#fff;">${escapeHTML(row.name)}</td>
          <td style="font-weight:600;">${escapeHTML(row.company)}</td>
          <td>${row.published}</td>
          <td>${row.active}</td>
          <td>${row.closed}</td>
          <td style="font-weight:700;">${row.apps}</td>
          <td style="font-weight:700; color:#fbbf24;">${row.unique}</td>
          <td>${row.apps}</td>
          <td>${formatDate(row.lastActive)}</td>
        </tr>
      `;
    });
    tbody.innerHTML = html;
  }

  // ==========================================
  // RENDERER: RECRUITER PROFILES TABLE
  // ==========================================
  function renderRecruiterProfilesTable() {
    const tbody = document.getElementById('rec-profiles-table-body');
    let list = [...state.recruiters].filter(r => r.status === 'Approved');

    // Search
    if (recruiterProfilesFilter.search) {
      const kw = recruiterProfilesFilter.search.toLowerCase();
      list = list.filter(r => r.name.toLowerCase().includes(kw) || r.company.toLowerCase().includes(kw));
    }

    list.sort((a,b) => a.name.localeCompare(b.name));

    if (list.length === 0) {
      tbody.innerHTML = `<tr><td colspan="9" class="text-center"><div class="table-empty-state"><p>No recruiter profiles match filter criteria.</p></div></td></tr>`;
      document.getElementById('rec-profiles-pagination-info').innerText = 'Showing 0 to 0 of 0 profiles';
      document.getElementById('rec-profiles-pagination-controls').innerHTML = '';
      return;
    }

    const total = list.length;
    const pages = Math.ceil(total / pagRecruiterProfiles.limit);
    if (pagRecruiterProfiles.page > pages) pagRecruiterProfiles.page = pages || 1;

    const start = (pagRecruiterProfiles.page - 1) * pagRecruiterProfiles.limit;
    const pagList = list.slice(start, start + pagRecruiterProfiles.limit);

    let html = '';
    pagList.forEach(r => {
      const totalInts = state.internships.filter(i => i.recruiterName === r.name).length;
      const recInts = state.internships.filter(i => i.recruiterName === r.name);
      const totalApps = state.internshipApplications.filter(app => recInts.some(i => i.id === app.internshipId)).length;

      html += `
        <tr>
          <td class="row-id">${r.id}</td>
          <td style="font-weight:700; color:#fff;">${escapeHTML(r.name)}</td>
          <td style="font-weight:600;">${escapeHTML(r.company)}</td>
          <td>${escapeHTML(r.email)}</td>
          <td>${escapeHTML(r.phone)}</td>
          <td><span class="badge-approved">${r.status}</span></td>
          <td style="font-weight:700;">${totalInts}</td>
          <td style="font-weight:700;">${totalApps}</td>
          <td>
            <div style="display:flex; gap:4px;">
              <button class="btn-action-eye" title="View Profile" onclick="window.dashboardApp.viewRecruiterProfile('${r.id}')"><i class="fa-regular fa-eye"></i></button>
              <button class="btn-action-eye" style="background:rgba(59,130,246,0.1); border-color:rgba(59,130,246,0.2); color:#60a5fa;" title="View Internships" onclick="window.location.hash = '/admin/recruiter-management/internships'; recruiterInternshipsFilter.search = '${r.name}'; renderPublishedInternshipsTable();"><i class="fa-solid fa-briefcase"></i></button>
              <button class="btn-action-eye" style="background:rgba(16,185,129,0.1); border-color:rgba(16,185,129,0.2); color:#34d399;" title="View Analytics" onclick="window.location.hash = '/admin/recruiter-management/analytics'; recruiterAnalyticsFilter.search = '${r.name}'; renderRecruiterAnalytics();"><i class="fa-solid fa-chart-line"></i></button>
            </div>
          </td>
        </tr>
      `;
    });
    tbody.innerHTML = html;

    const end = Math.min(start + pagRecruiterProfiles.limit, total);
    document.getElementById('rec-profiles-pagination-info').innerText = `Showing ${start + 1} to ${end} of ${total} profiles`;
    renderPaginationControls('rec-profiles-pagination-controls', pages, pagRecruiterProfiles, (p) => {
      pagRecruiterProfiles.page = p;
      renderRecruiterProfilesTable();
    });
  }

  // Popup modal profile display helper
  function viewRecruiterProfile(recId) {
    const rec = state.recruiters.find(r => r.id === recId);
    if (!rec) return;

    document.getElementById('view-rec-id').innerText = rec.id;
    document.getElementById('view-rec-name').innerText = rec.name;
    document.getElementById('view-rec-company').innerText = rec.company;
    document.getElementById('view-rec-designation').innerText = rec.designation;
    document.getElementById('view-rec-email').innerText = rec.email;
    document.getElementById('view-rec-phone').innerText = rec.phone;
    document.getElementById('view-rec-status').innerText = rec.status;
    document.getElementById('view-rec-joined').innerText = formatDate(rec.appliedDate);

    const statusEl = document.getElementById('view-rec-status');
    statusEl.className = rec.status === 'Approved' ? 'badge-approved' : rec.status === 'Rejected' ? 'badge-rejected' : 'badge-pending';

    document.getElementById('view-rec-avatar').innerText = rec.name.charAt(0);
    document.getElementById('recruiter-profile-modal').classList.add('active');
  }

  // ==========================================
  // RENDERER: INVESTOR DASHBOARD
  // ==========================================
  function renderInvestorDashboard() {
    const approvedInvestors = state.investors.filter(inv => inv.status === 'Approved');
    const verifiedInvestors = approvedInvestors.filter(inv => inv.bio && inv.interests && inv.interests.length > 0);
    
    // Active Investors: approved with at least 1 startup interest or contact request or last activity date in last 15 days
    const activeInvestors = approvedInvestors.filter(inv => {
      const hasInterest = state.startupInterests.some(i => i.investorId === inv.id);
      const hasContact = state.contactRequests.some(c => c.investorId === inv.id);
      
      let isRecent = false;
      let lastActivityDateStr = inv.appliedDate;
      const invInterests = state.startupInterests.filter(i => i.investorId === inv.id);
      const invContacts = state.contactRequests.filter(c => c.investorId === inv.id);
      invInterests.forEach(i => { if (i.interestDate > lastActivityDateStr) lastActivityDateStr = i.interestDate; });
      invContacts.forEach(c => { if (c.requestDate > lastActivityDateStr) lastActivityDateStr = c.requestDate; });
      
      const diff = (new Date() - new Date(lastActivityDateStr)) / (1000 * 60 * 60 * 24);
      if (diff <= 15) isRecent = true;
      
      return hasInterest || hasContact || isRecent;
    });

    let dateLimit = document.getElementById('investor-dashboard-date-range').value;
    let filteredInterests = state.startupInterests;
    let filteredContacts = state.contactRequests;
    if (dateLimit !== 'all') {
      const limitDays = parseInt(dateLimit);
      const limitDate = new Date();
      limitDate.setDate(limitDate.getDate() - limitDays);
      const limitDateStr = limitDate.toISOString().split('T')[0];
      filteredInterests = state.startupInterests.filter(i => i.interestDate >= limitDateStr);
      filteredContacts = state.contactRequests.filter(c => c.requestDate >= limitDateStr);
    }

    // Set metrics card values
    document.getElementById('inv-stat-total-investors').innerText = approvedInvestors.length;
    document.getElementById('inv-stat-verified-investors').innerText = verifiedInvestors.length;
    document.getElementById('inv-stat-active-investors').innerText = activeInvestors.length;
    document.getElementById('inv-stat-startup-interests').innerText = filteredInterests.length;
    document.getElementById('inv-stat-contact-requests').innerText = filteredContacts.length;
    document.getElementById('inv-stat-startup-applications').innerText = state.startupApplications.length;

    // Mini Sparklines
    drawSparkline('sparkline-investor-total', getCumulativeTrend(approvedInvestors, 'appliedDate'), '#ef4444');
    drawSparkline('sparkline-investor-verified', getCumulativeTrend(verifiedInvestors, 'appliedDate'), '#3b82f6');
    drawSparkline('sparkline-investor-active', getCumulativeTrend(activeInvestors, 'appliedDate'), '#10b981');
    drawSparkline('sparkline-investor-interests', getCumulativeTrend(filteredInterests, 'interestDate'), '#fbbf24');
    drawSparkline('sparkline-investor-contacts', getCumulativeTrend(filteredContacts, 'requestDate'), '#8b5cf6');
    drawSparkline('sparkline-investor-applications', getCumulativeTrend(state.startupApplications, 'appliedDate'), '#ec4899');

    // Growth Trend Large Chart
    const growthTrend = getLast7DaysLabelsAndPoints(approvedInvestors, 'appliedDate');
    drawLineChart('chart-investor-growth-trend', growthTrend.labels, [
      { label: 'Investors', points: growthTrend.points, color: '#ef4444' }
    ]);

    // Donut Chart: Industry Distribution from interests
    const indCounts = {};
    filteredInterests.forEach(i => {
      const ind = i.startupIndustry || "Other";
      indCounts[ind] = (indCounts[ind] || 0) + 1;
    });
    const sortedInds = Object.keys(indCounts).sort((a,b) => indCounts[b] - indCounts[a]);
    const segments = [];
    const colors = ['#ef4444', '#3b82f6', '#10b981', '#fbbf24', '#8b5cf6'];
    let otherSum = 0;
    sortedInds.forEach((ind, index) => {
      if (index < 4) {
        segments.push({ label: ind, value: indCounts[ind], color: colors[index] });
      } else {
        otherSum += indCounts[ind];
      }
    });
    if (otherSum > 0) {
      segments.push({ label: 'Other', value: otherSum, color: colors[4] });
    }
    const totalVal = segments.reduce((sum, s) => sum + s.value, 0) || 1;
    document.getElementById('donut-investor-industry-total').innerText = totalVal;
    drawDonutChart('chart-investor-industry-donut', segments);

    // Donut Legend
    const legendContainer = document.getElementById('donut-investor-industry-legend');
    if (legendContainer) {
      legendContainer.innerHTML = segments.map(seg => `
        <div class="legend-item">
          <span class="legend-dot" style="background:${seg.color};"></span>
          ${escapeHTML(seg.label)}: <strong>${seg.value}</strong> (${((seg.value / totalVal) * 100).toFixed(1)}%)
        </div>
      `).join('');
    }

    // Top Industries Progress Bars
    const barContainer = document.getElementById('investor-top-industries-progress');
    if (barContainer) {
      const topIndBars = segments.slice(0, 4);
      let barHtml = '';
      topIndBars.forEach(b => {
        const pct = ((b.value / totalVal) * 100).toFixed(0);
        barHtml += `
          <div class="progress-bar-item" style="width:100%;">
            <div style="display:flex; justify-content:space-between; font-size:12px; margin-bottom:4px; font-weight:600;">
              <span style="color:var(--text-secondary);">${escapeHTML(b.label)}</span>
              <span style="color:var(--text-main);">${pct}% (${b.value})</span>
            </div>
            <div style="width:100%; height:6px; background:rgba(255,255,255,0.06); border-radius:3px; overflow:hidden;">
              <div style="width:${pct}%; height:100%; background:${b.color}; border-radius:3px;"></div>
            </div>
          </div>
        `;
      });
      barContainer.innerHTML = barHtml || '<p style="font-size:12px; color:var(--text-muted); text-align:center;">No industry interest data active.</p>';
    }

    // Activity Trend Chart
    const activities = [
      ...filteredInterests.map(i => ({ date: i.interestDate })),
      ...filteredContacts.map(c => ({ date: c.requestDate }))
    ];
    const actTrend = getLast7DaysDailyPoints(activities, 'date');
    drawLineChart('chart-investor-activity-trend', actTrend.labels, [
      { label: 'Activities', points: actTrend.points, color: '#8b5cf6' }
    ]);

    // Widgets: Recent Investors
    let recentInv = [...approvedInvestors]
      .sort((a,b) => b.appliedDate.localeCompare(a.appliedDate))
      .slice(0, 5);
    let recentInvHtml = '';
    recentInv.forEach(inv => {
      recentInvHtml += `
        <div class="recent-item" style="cursor:pointer;" onclick="window.location.hash = '/admin/investor-management/profiles'; investorProfilesFilter.search = '${escapeHTML(inv.name)}'; renderInvestorProfilesTable();">
          <div style="display:flex; align-items:center; gap:12px; width:100%;">
            <div style="width:36px; height:36px; border-radius:50%; background:rgba(239, 68, 68, 0.1); border:1px solid var(--accent-red); color:var(--accent-red); display:flex; align-items:center; justify-content:center; font-weight:700; font-size:14px;">${inv.name.charAt(0)}</div>
            <div style="flex:1; min-width: 0;">
              <div style="font-size:13px; font-weight:700; color:#fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${escapeHTML(inv.name)}</div>
              <div style="font-size:11px; color:var(--text-secondary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${escapeHTML(inv.organization)} &bull; ${escapeHTML(inv.designation)}</div>
            </div>
            <div style="font-size:11px; color:var(--text-muted); font-weight:600; white-space: nowrap;">${formatDate(inv.appliedDate)}</div>
          </div>
        </div>
      `;
    });
    document.getElementById('dash-investor-recent').innerHTML = recentInvHtml || '<p style="text-align:center; padding:20px; font-size:12px; color:var(--text-muted);">No recent investors.</p>';

    // Widgets: Recent Startup Interests
    let recentInt = [...state.startupInterests]
      .sort((a,b) => b.interestDate.localeCompare(a.interestDate))
      .slice(0, 5);
    let recentIntHtml = '';
    recentInt.forEach(int => {
      recentIntHtml += `
        <div class="recent-item" style="cursor:pointer;" onclick="window.location.hash = '/admin/investor-management/interests'; startupInterestsFilter.search = '${escapeHTML(int.startupName)}'; renderStartupInterestsTable();">
          <div style="display:flex; align-items:center; gap:12px; width:100%;">
            <div style="flex:1; min-width: 0;">
              <div style="font-size:13px; font-weight:700; color:#fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${escapeHTML(int.investorName)} <span style="font-weight:500; color:var(--text-muted);">interested in</span> ${escapeHTML(int.startupName)}</div>
              <div style="font-size:11px; color:var(--text-secondary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${escapeHTML(int.startupIndustry)} &bull; ${escapeHTML(int.startupStage)}</div>
            </div>
            <div style="font-size:11px; color:var(--text-muted); font-weight:600; white-space: nowrap;">${formatDate(int.interestDate)}</div>
          </div>
        </div>
      `;
    });
    document.getElementById('dash-interests-recent').innerHTML = recentIntHtml || '<p style="text-align:center; padding:20px; font-size:12px; color:var(--text-muted);">No startup interests.</p>';

    // Widgets: Most Active Investors
    let invActivity = approvedInvestors.map(inv => {
      const ints = state.startupInterests.filter(i => i.investorId === inv.id).length;
      const cons = state.contactRequests.filter(c => c.investorId === inv.id).length;
      return { inv, count: ints + cons };
    }).sort((a,b) => b.count - a.count).slice(0, 5);
    
    let activeInvHtml = '';
    invActivity.forEach(item => {
      activeInvHtml += `
        <div class="recent-item" style="cursor:pointer;" onclick="window.location.hash = '/admin/investor-management/analytics'; investorAnalyticsFilter.search = '${escapeHTML(item.inv.name)}'; renderInvestmentAnalytics();">
          <div style="display:flex; align-items:center; gap:12px; width:100%;">
            <div style="width:36px; height:36px; border-radius:50%; background:rgba(59, 130, 246, 0.1); border:1px solid #3b82f6; color:#3b82f6; display:flex; align-items:center; justify-content:center; font-weight:700; font-size:14px;">${item.inv.name.charAt(0)}</div>
            <div style="flex:1; min-width: 0;">
              <div style="font-size:13px; font-weight:700; color:#fff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${escapeHTML(item.inv.name)}</div>
              <div style="font-size:11px; color:var(--text-secondary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${escapeHTML(item.inv.organization)}</div>
            </div>
            <div style="text-align:right; white-space: nowrap;">
              <div style="font-size:13px; font-weight:800; color:var(--accent-red);">${item.count}</div>
              <div style="font-size:10px; color:var(--text-muted); font-weight:600;">Activities</div>
            </div>
          </div>
        </div>
      `;
    });
    document.getElementById('dash-investors-active').innerHTML = activeInvHtml || '<p style="text-align:center; padding:20px; font-size:12px; color:var(--text-muted);">No activity data.</p>';
  }

  function getLast7DaysLabelsAndPoints(list, dateField) {
    const labels = [];
    const points = [];
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      const dStr = d.toISOString().split('T')[0];
      
      const day = d.getDate();
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const label = `${day} ${monthNames[d.getMonth()]}`;
      labels.push(label);
      
      const count = list.filter(item => item[dateField] <= dStr).length;
      points.push(count);
    }
    return { labels, points };
  }

  function getLast7DaysDailyPoints(list, dateField) {
    const labels = [];
    const points = [];
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      const dStr = d.toISOString().split('T')[0];
      
      const day = d.getDate();
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const label = `${day} ${monthNames[d.getMonth()]}`;
      labels.push(label);
      
      const count = list.filter(item => item[dateField] === dStr).length;
      points.push(count);
    }
    return { labels, points };
  }

  // ==========================================
  // RENDERER: INVESTOR PROFILES TABLE
  // ==========================================
  function renderInvestorProfilesTable() {
    const tbody = document.getElementById('investor-profiles-table-body');
    if (!tbody) return;

    let list = [...state.investors].filter(r => r.status === 'Approved');

    // Populate Organization Filter dropdown dynamically if empty
    const orgDropdown = document.getElementById('investor-profiles-filter-org');
    if (orgDropdown && orgDropdown.options.length <= 1) {
      const orgs = [...new Set(list.map(inv => inv.organization))].sort();
      let optionsHtml = '<option value="">All Organizations</option>';
      orgs.forEach(o => {
        optionsHtml += `<option value="${escapeHTML(o)}">${escapeHTML(o)}</option>`;
      });
      orgDropdown.innerHTML = optionsHtml;
      orgDropdown.value = investorProfilesFilter.org;
    }

    // Filter Search
    if (investorProfilesFilter.search) {
      const kw = investorProfilesFilter.search.toLowerCase();
      list = list.filter(r => r.name.toLowerCase().includes(kw) || r.organization.toLowerCase().includes(kw));
    }

    // Filter Organization
    if (investorProfilesFilter.org) {
      list = list.filter(r => r.organization === investorProfilesFilter.org);
    }

    list.sort((a,b) => a.name.localeCompare(b.name));

    if (list.length === 0) {
      tbody.innerHTML = `<tr><td colspan="9" class="text-center"><div class="table-empty-state"><p>No investor profiles match filter criteria.</p></div></td></tr>`;
      document.getElementById('investor-profiles-pagination-info').innerText = 'Showing 0 to 0 of 0 profiles';
      document.getElementById('investor-profiles-pagination-controls').innerHTML = '';
      return;
    }

    const total = list.length;
    const pages = Math.ceil(total / pagInvestorProfiles.limit);
    if (pagInvestorProfiles.page > pages) pagInvestorProfiles.page = pages || 1;

    const start = (pagInvestorProfiles.page - 1) * pagInvestorProfiles.limit;
    const pagList = list.slice(start, start + pagInvestorProfiles.limit);

    let html = '';
    pagList.forEach(r => {
      const totalInts = state.startupInterests.filter(i => i.investorId === r.id).length;
      html += `
        <tr>
          <td class="row-id">${r.id}</td>
          <td style="font-weight:700; color:#fff;">${escapeHTML(r.name)}</td>
          <td style="font-weight:600;">${escapeHTML(r.organization)}</td>
          <td>${escapeHTML(r.designation)}</td>
          <td>${escapeHTML(r.email)}</td>
          <td>${escapeHTML(r.phone)}</td>
          <td>${formatDate(r.appliedDate)}</td>
          <td style="font-weight:700;">${totalInts}</td>
          <td>
            <div style="display:flex; gap:4px;">
              <button class="btn-action-eye" title="View Profile" onclick="window.dashboardApp.viewInvestorProfile('${r.id}')"><i class="fa-regular fa-eye"></i></button>
              <button class="btn-action-eye" style="background:rgba(16,185,129,0.1); border-color:rgba(16,185,129,0.2); color:#34d399;" title="View Analytics" onclick="window.location.hash = '/admin/investor-management/analytics'; investorAnalyticsFilter.search = '${r.name}'; renderInvestmentAnalytics();"><i class="fa-solid fa-chart-line"></i></button>
            </div>
          </td>
        </tr>
      `;
    });
    tbody.innerHTML = html;

    const end = Math.min(start + pagInvestorProfiles.limit, total);
    document.getElementById('investor-profiles-pagination-info').innerText = `Showing ${start + 1} to ${end} of ${total} profiles`;
    renderPaginationControls('investor-profiles-pagination-controls', pages, pagInvestorProfiles, (p) => {
      pagInvestorProfiles.page = p;
      renderInvestorProfilesTable();
    });
  }

  // ==========================================
  // RENDERER: STARTUP INTERESTS TABLE
  // ==========================================
  function renderStartupInterestsTable() {
    const tbody = document.getElementById('investor-interests-table-body');
    if (!tbody) return;

    // Load filter selectors dynamically
    const indDropdown = document.getElementById('investor-interests-filter-industry');
    if (indDropdown && indDropdown.options.length <= 1) {
      const inds = [...new Set(state.startupApplications.map(s => s.industry))].sort();
      let opts = '<option value="">All Industries</option>';
      inds.forEach(i => { opts += `<option value="${escapeHTML(i)}">${escapeHTML(i)}</option>`; });
      indDropdown.innerHTML = opts;
      indDropdown.value = startupInterestsFilter.industry;
    }
    const stageDropdown = document.getElementById('investor-interests-filter-stage');
    if (stageDropdown && stageDropdown.options.length <= 1) {
      const stgs = [...new Set(state.startupApplications.map(s => s.stage))].sort();
      let opts = '<option value="">All Stages</option>';
      stgs.forEach(s => { opts += `<option value="${escapeHTML(s)}">${escapeHTML(s)}</option>`; });
      stageDropdown.innerHTML = opts;
      stageDropdown.value = startupInterestsFilter.stage;
    }

    // Statistics metrics above table
    const activeInterests = state.startupInterests.filter(i => i.status === 'Interested' || i.status === 'Contacted' || i.status === 'Meeting Scheduled');
    const meetingsCount = state.startupInterests.filter(i => i.status === 'Meeting Scheduled');
    const declinedCount = state.startupInterests.filter(i => i.status === 'Declined');
    document.getElementById('int-stat-total').innerText = state.startupInterests.length;
    document.getElementById('int-stat-active').innerText = activeInterests.length;
    document.getElementById('int-stat-meetings').innerText = meetingsCount.length;
    document.getElementById('int-stat-declined').innerText = declinedCount.length;

    let list = [...state.startupInterests];

    // Filter Search
    if (startupInterestsFilter.search) {
      const kw = startupInterestsFilter.search.toLowerCase();
      list = list.filter(i => i.investorName.toLowerCase().includes(kw) || i.startupName.toLowerCase().includes(kw));
    }

    // Filters select options
    if (startupInterestsFilter.industry) {
      list = list.filter(i => i.startupIndustry === startupInterestsFilter.industry);
    }
    if (startupInterestsFilter.stage) {
      list = list.filter(i => i.startupStage === startupInterestsFilter.stage);
    }
    if (startupInterestsFilter.status) {
      list = list.filter(i => i.status === startupInterestsFilter.status);
    }

    list.sort((a,b) => b.interestDate.localeCompare(a.interestDate));

    if (list.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" class="text-center"><div class="table-empty-state"><p>No startup interest entries match filter criteria.</p></div></td></tr>`;
      document.getElementById('investor-interests-pagination-info').innerText = 'Showing 0 to 0 of 0 interests';
      document.getElementById('investor-interests-pagination-controls').innerHTML = '';
      return;
    }

    const total = list.length;
    const pages = Math.ceil(total / pagStartupInterests.limit);
    if (pagStartupInterests.page > pages) pagStartupInterests.page = pages || 1;

    const start = (pagStartupInterests.page - 1) * pagStartupInterests.limit;
    const pagList = list.slice(start, start + pagStartupInterests.limit);

    let html = '';
    pagList.forEach(r => {
      let statusBadge = '';
      if (r.status === 'Interested') {
        statusBadge = '<span class="badge-approved">Interested</span>';
      } else if (r.status === 'Contacted') {
        statusBadge = '<span class="badge-pending" style="background:rgba(59,130,246,0.1); color:#60a5fa; border-color:rgba(59,130,246,0.2);">Contacted</span>';
      } else if (r.status === 'Meeting Scheduled') {
        statusBadge = '<span class="badge-pending" style="background:rgba(139,92,246,0.1); color:#a78bfa; border-color:rgba(139,92,246,0.2);">Meeting Scheduled</span>';
      } else {
        statusBadge = '<span class="badge-rejected">Declined</span>';
      }

      html += `
        <tr>
          <td class="row-id">${r.id}</td>
          <td><a href="#" style="font-weight:700; color:#fff;" onclick="window.dashboardApp.viewInvestorProfile('${r.investorId}'); return false;">${escapeHTML(r.investorName)}</a></td>
          <td><a href="#" style="font-weight:700; color:var(--accent-red);" onclick="window.dashboardApp.viewStartupApplication(${r.startupId}); return false;">${escapeHTML(r.startupName)}</a></td>
          <td style="font-weight:600;">${escapeHTML(r.startupIndustry)}</td>
          <td>${escapeHTML(r.startupStage)}</td>
          <td>${formatDate(r.interestDate)}</td>
          <td>${statusBadge}</td>
        </tr>
      `;
    });
    tbody.innerHTML = html;

    const end = Math.min(start + pagStartupInterests.limit, total);
    document.getElementById('investor-interests-pagination-info').innerText = `Showing ${start + 1} to ${end} of ${total} interests`;
    renderPaginationControls('investor-interests-pagination-controls', pages, pagStartupInterests, (p) => {
      pagStartupInterests.page = p;
      renderStartupInterestsTable();
    });
  }

  // ==========================================
  // RENDERER: INVESTMENT ANALYTICS
  // ==========================================
  function renderInvestmentAnalytics() {
    const tbody = document.getElementById('investor-analytics-table-body');
    if (!tbody) return;

    const approvedInvestors = state.investors.filter(inv => inv.status === 'Approved');

    // Aggregate statistics
    let mostActiveName = '-';
    let highestScore = 0;
    let mostActiveCount = 0;
    let totalActions = state.startupInterests.length + state.contactRequests.length;

    const stats = approvedInvestors.map(inv => {
      const intsCount = state.startupInterests.filter(i => i.investorId === inv.id).length;
      const contactsCount = state.contactRequests.filter(c => c.investorId === inv.id).length;
      const meetingsCount = state.startupInterests.filter(i => i.investorId === inv.id && i.status === 'Meeting Scheduled').length;
      
      const score = calculateEngagementScore(intsCount, contactsCount, meetingsCount);
      const totalAct = intsCount + contactsCount;

      if (totalAct > mostActiveCount) {
        mostActiveCount = totalAct;
        mostActiveName = inv.name;
      }
      if (score > highestScore) {
        highestScore = score;
      }

      let lastActivity = inv.appliedDate;
      state.startupInterests.filter(i => i.investorId === inv.id).forEach(i => { if (i.interestDate > lastActivity) lastActivity = i.interestDate; });
      state.contactRequests.filter(c => c.investorId === inv.id).forEach(c => { if (c.requestDate > lastActivity) lastActivity = c.requestDate; });

      return {
        inv,
        intsCount,
        contactsCount,
        meetingsCount,
        score,
        lastActivity
      };
    });

    // Most Interested Industry
    const indCounts = {};
    state.startupInterests.forEach(i => {
      const ind = i.startupIndustry || "Other";
      indCounts[ind] = (indCounts[ind] || 0) + 1;
    });
    let topIndustry = '-';
    let topIndustryCount = 0;
    Object.keys(indCounts).forEach(ind => {
      if (indCounts[ind] > topIndustryCount) {
        topIndustryCount = indCounts[ind];
        topIndustry = ind;
      }
    });

    document.getElementById('ana-stat-most-active').innerText = mostActiveName;
    document.getElementById('ana-stat-high-score').innerText = highestScore;
    document.getElementById('ana-stat-top-industry').innerText = topIndustry;
    document.getElementById('ana-stat-total-actions').innerText = totalActions;

    let list = [...stats];

    // Filter Search
    if (investorAnalyticsFilter.search) {
      const kw = investorAnalyticsFilter.search.toLowerCase();
      list = list.filter(item => 
        item.inv.name.toLowerCase().includes(kw) || 
        item.inv.organization.toLowerCase().includes(kw) ||
        (Array.isArray(item.inv.interests) && item.inv.interests.some(i => i.toLowerCase().includes(kw)))
      );
    }

    list.sort((a,b) => b.score - a.score);

    if (list.length === 0) {
      tbody.innerHTML = `<tr><td colspan="9" class="text-center"><div class="table-empty-state"><p>No analytics metrics match filter criteria.</p></div></td></tr>`;
      document.getElementById('investor-analytics-pagination-info').innerText = 'Showing 0 to 0 of 0 metrics';
      document.getElementById('investor-analytics-pagination-controls').innerHTML = '';
      return;
    }

    const total = list.length;
    const pages = Math.ceil(total / pagInvestorAnalytics.limit);
    if (pagInvestorAnalytics.page > pages) pagInvestorAnalytics.page = pages || 1;

    const start = (pagInvestorAnalytics.page - 1) * pagInvestorAnalytics.limit;
    const pagList = list.slice(start, start + pagInvestorAnalytics.limit);

    let html = '';
    pagList.forEach(item => {
      const r = item.inv;
      const focusAreas = Array.isArray(r.interests) ? r.interests.slice(0, 2).map(f => `<span class="badge-webinar" style="font-size:10px; padding: 2px 6px;">${escapeHTML(f)}</span>`).join(' ') : '';
      
      html += `
        <tr>
          <td class="row-id">${r.id}</td>
          <td style="font-weight:700; color:#fff;">${escapeHTML(r.name)}</td>
          <td style="font-weight:600;">${escapeHTML(r.organization)}</td>
          <td><div style="display:flex; gap:4px; flex-wrap:wrap;">${focusAreas}</div></td>
          <td style="font-weight:700;">${item.intsCount}</td>
          <td style="font-weight:700;">${item.contactsCount}</td>
          <td style="font-weight:700;">${item.meetingsCount}</td>
          <td>${formatDate(item.lastActivity)}</td>
          <td style="font-weight:800; color:var(--accent-red); font-size:14px;">${item.score}</td>
        </tr>
      `;
    });
    tbody.innerHTML = html;

    const end = Math.min(start + pagInvestorAnalytics.limit, total);
    document.getElementById('investor-analytics-pagination-info').innerText = `Showing ${start + 1} to ${end} of ${total} metrics`;
    renderPaginationControls('investor-analytics-pagination-controls', pages, pagInvestorAnalytics, (p) => {
      pagInvestorAnalytics.page = p;
      renderInvestmentAnalytics();
    });
  }

  // ==========================================
  // RENDERER: CONTACT REQUESTS TABLE
  // ==========================================
  function renderContactRequestsTable() {
    const tbody = document.getElementById('investor-contacts-table-body');
    if (!tbody) return;

    // Table statistics
    const totalCount = state.contactRequests.length;
    const pendingCount = state.contactRequests.filter(c => c.status === 'Pending').length;
    const acceptedCount = state.contactRequests.filter(c => c.status === 'Accepted').length;
    const rejectedCount = state.contactRequests.filter(c => c.status === 'Rejected').length;
    const completedCount = state.contactRequests.filter(c => c.status === 'Completed').length;

    document.getElementById('con-stat-total').innerText = totalCount;
    document.getElementById('con-stat-pending').innerText = pendingCount;
    document.getElementById('con-stat-accepted').innerText = acceptedCount;
    document.getElementById('con-stat-rejected').innerText = rejectedCount;
    document.getElementById('con-stat-completed').innerText = completedCount;

    let list = [...state.contactRequests];

    // Filter Search
    if (contactRequestsFilter.search) {
      const kw = contactRequestsFilter.search.toLowerCase();
      list = list.filter(c => 
        c.startupName.toLowerCase().includes(kw) || 
        c.founderName.toLowerCase().includes(kw) || 
        c.investorName.toLowerCase().includes(kw)
      );
    }

    // Filter Status
    if (contactRequestsFilter.status) {
      list = list.filter(c => c.status === contactRequestsFilter.status);
    }

    list.sort((a,b) => b.requestDate.localeCompare(a.requestDate));

    if (list.length === 0) {
      tbody.innerHTML = `<tr><td colspan="7" class="text-center"><div class="table-empty-state"><p>No contact requests match filter criteria.</p></div></td></tr>`;
      document.getElementById('investor-contacts-pagination-info').innerText = 'Showing 0 to 0 of 0 requests';
      document.getElementById('investor-contacts-pagination-controls').innerHTML = '';
      return;
    }

    const total = list.length;
    const pages = Math.ceil(total / pagContactRequests.limit);
    if (pagContactRequests.page > pages) pagContactRequests.page = pages || 1;

    const start = (pagContactRequests.page - 1) * pagContactRequests.limit;
    const pagList = list.slice(start, start + pagContactRequests.limit);

    let html = '';
    pagList.forEach(r => {
      let statusBadge = '';
      if (r.status === 'Pending') {
        statusBadge = '<span class="badge-pending">Pending</span>';
      } else if (r.status === 'Accepted') {
        statusBadge = '<span class="badge-approved">Accepted</span>';
      } else if (r.status === 'Rejected') {
        statusBadge = '<span class="badge-rejected">Rejected</span>';
      } else {
        statusBadge = '<span class="badge-approved" style="background:rgba(16,185,129,0.1); color:#34d399; border-color:rgba(16,185,129,0.2);">Completed</span>';
      }

      const statusSelect = `
        <select class="form-control-input" style="padding:4px 8px; font-size:12px; width:120px; background:var(--bg-card); border:1px solid var(--border-color); color:var(--text-main); height: 28px;" onchange="window.dashboardApp.updateContactStatus('${r.id}', this.value)">
          <option value="Pending" ${r.status === 'Pending' ? 'selected' : ''}>Pending</option>
          <option value="Accepted" ${r.status === 'Accepted' ? 'selected' : ''}>Accepted</option>
          <option value="Rejected" ${r.status === 'Rejected' ? 'selected' : ''}>Rejected</option>
          <option value="Completed" ${r.status === 'Completed' ? 'selected' : ''}>Completed</option>
        </select>
      `;

      html += `
        <tr>
          <td class="row-id">${r.id}</td>
          <td><a href="#" style="font-weight:700; color:var(--accent-red);" onclick="window.dashboardApp.viewStartupApplication(${r.startupId}); return false;">${escapeHTML(r.startupName)}</a></td>
          <td>
            <div style="font-weight:700; color:#fff;">${escapeHTML(r.founderName)}</div>
            <div style="font-size:11px; color:var(--text-secondary);">${escapeHTML(r.founderEmail)} &bull; ${escapeHTML(r.founderPhone)}</div>
          </td>
          <td><a href="#" style="font-weight:700; color:#fff;" onclick="window.dashboardApp.viewInvestorProfile('${r.investorId}'); return false;">${escapeHTML(r.investorName)}</a></td>
          <td>${formatDate(r.requestDate)}</td>
          <td>${statusBadge}</td>
          <td>
            <div style="display:flex; gap:8px; align-items:center;">
              <button class="btn-action-eye" title="View Details" onclick="window.dashboardApp.viewContactRequest('${r.id}')" style="height: 28px; width: 28px; display:flex; align-items:center; justify-content:center;"><i class="fa-regular fa-eye"></i></button>
              ${statusSelect}
            </div>
          </td>
        </tr>
      `;
    });
    tbody.innerHTML = html;

    const end = Math.min(start + pagContactRequests.limit, total);
    document.getElementById('investor-contacts-pagination-info').innerText = `Showing ${start + 1} to ${end} of ${total} requests`;
    renderPaginationControls('investor-contacts-pagination-controls', pages, pagContactRequests, (p) => {
      pagContactRequests.page = p;
      renderContactRequestsTable();
    });
  }

  // ==========================================
  // INVESTOR MANAGEMENT LOGIC & ACTIONS
  // ==========================================
  function viewInvestorProfile(invId) {
    const inv = state.investors.find(i => i.id === invId);
    if (!inv) return;

    document.getElementById('view-inv-id').innerText = inv.id;
    document.getElementById('view-inv-name').innerText = inv.name;
    document.getElementById('view-inv-org').innerText = inv.organization;
    document.getElementById('view-inv-designation').innerText = inv.designation;
    document.getElementById('view-inv-email').innerText = inv.email;
    document.getElementById('view-inv-phone').innerText = inv.phone;
    document.getElementById('view-inv-interests').innerText = Array.isArray(inv.interests) ? inv.interests.join(', ') : '-';
    document.getElementById('view-inv-bio').innerText = inv.bio || '-';
    document.getElementById('view-inv-status').innerText = inv.status;
    document.getElementById('view-inv-joined').innerText = formatDate(inv.appliedDate);

    const statusEl = document.getElementById('view-inv-status');
    statusEl.className = inv.status === 'Approved' ? 'badge-approved' : inv.status === 'Rejected' ? 'badge-rejected' : 'badge-pending';

    document.getElementById('view-inv-avatar').innerText = inv.name.charAt(0);
    document.getElementById('investor-profile-modal').classList.add('active');
  }

  function viewContactRequest(reqId) {
    const req = state.contactRequests.find(r => r.id === reqId);
    if (!req) return;

    document.getElementById('view-con-id').innerText = req.id;
    document.getElementById('view-con-startup').innerText = req.startupName;
    document.getElementById('view-con-startup').onclick = (e) => {
      e.preventDefault();
      document.getElementById('investor-contact-modal').classList.remove('active');
      window.dashboardApp.viewStartupApplication(req.startupId);
    };
    document.getElementById('view-con-founder').innerText = req.founderName || '-';
    document.getElementById('view-con-email').innerText = req.founderEmail || '-';
    document.getElementById('view-con-phone').innerText = req.founderPhone || '-';
    document.getElementById('view-con-investor').innerText = req.investorName || '-';
    document.getElementById('view-con-date').innerText = formatDate(req.requestDate);
    
    const badge = document.getElementById('view-con-status-badge');
    badge.innerText = req.status;
    badge.className = req.status === 'Accepted' ? 'badge-approved' : req.status === 'Rejected' ? 'badge-rejected' : req.status === 'Completed' ? 'badge-approved' : 'badge-pending';
    if (req.status === 'Completed') {
      badge.style.background = 'rgba(16,185,129,0.1)';
      badge.style.color = '#34d399';
    } else {
      badge.style.background = '';
      badge.style.color = '';
    }

    const select = document.getElementById('view-con-status-select');
    select.value = req.status;

    const saveBtn = document.getElementById('view-con-save-btn');
    saveBtn.onclick = () => {
      updateContactStatus(req.id, select.value);
      document.getElementById('investor-contact-modal').classList.remove('active');
    };

    document.getElementById('investor-contact-modal').classList.add('active');
  }

  function updateContactStatus(reqId, newStatus) {
    const req = state.contactRequests.find(r => r.id === reqId);
    if (req) {
      req.status = newStatus;
      saveDatabase();
      if (currentActiveTab === 'investor-contacts') {
        renderContactRequestsTable();
      } else if (currentActiveTab === 'investor-dashboard') {
        renderInvestorDashboard();
      }
    }
  }

  function calculateEngagementScore(interestsCount, contactsCount, meetingsCount) {
    return (interestsCount * 2) + (contactsCount * 5) + (meetingsCount * 10);
  }

  // ==========================================
  // EXPORTERS: INVESTOR MANAGEMENT MODULE
  // ==========================================
  function exportInvestorDashboard(format) {
    const title = "Investor Ecosystem Overview Metrics";
    const headers = ["Metric Name", "Value"];
    
    const approvedInvestors = state.investors.filter(inv => inv.status === 'Approved');
    const verifiedCount = approvedInvestors.filter(inv => inv.bio && inv.interests && inv.interests.length > 0).length;
    const activeCount = approvedInvestors.filter(inv => {
      const hasInterest = state.startupInterests.some(i => i.investorId === inv.id);
      const hasContact = state.contactRequests.some(c => c.investorId === inv.id);
      return hasInterest || hasContact;
    }).length;
    
    const rows = [
      ["Total Approved Investors", approvedInvestors.length],
      ["Verified Investors", verifiedCount],
      ["Active Investors", activeCount],
      ["Total Startup Interests", state.startupInterests.length],
      ["Total Contact Requests", state.contactRequests.length],
      ["Total Startup Applications", state.startupApplications.length]
    ];
    
    if (format === 'PDF') {
      printPDF(title, headers, rows);
    } else {
      let csv = headers.map(h => `"${h}"`).join(',') + '\n';
      rows.forEach(r => {
        csv += `"${r[0]}",${r[1]}\n`;
      });
      const ext = format === 'Excel' ? 'xlsx' : 'csv';
      downloadCSV(csv, `investor_dashboard_metrics.${ext}`);
    }
  }

  function exportInvestorProfiles(format) {
    const title = "Verified Approved Investor Profiles";
    const headers = ["Investor ID", "Name", "Organization", "Designation", "Email", "Phone", "Focus Areas", "Date Joined"];
    const approvedInvestors = state.investors.filter(inv => inv.status === 'Approved');
    
    const rows = approvedInvestors.map(inv => [
      inv.id,
      inv.name,
      inv.organization,
      inv.designation,
      inv.email,
      inv.phone,
      Array.isArray(inv.interests) ? inv.interests.join(' | ') : '',
      formatDate(inv.appliedDate)
    ]);
    
    if (format === 'PDF') {
      printPDF(title, headers, rows);
    } else {
      let csv = headers.map(h => `"${h}"`).join(',') + '\n';
      rows.forEach(r => {
        csv += `"${r[0]}","${r[1]}","${r[2]}","${r[3]}","${r[4]}","${r[5]}","${r[6]}","${r[7]}"\n`;
      });
      const ext = format === 'Excel' ? 'xlsx' : 'csv';
      downloadCSV(csv, `investor_profiles.${ext}`);
    }
  }

  function exportStartupInterests(format) {
    const title = "Investor Startup Interests Log";
    const headers = ["Interest ID", "Investor ID", "Investor Name", "Startup ID", "Startup Name", "Startup Industry", "Startup Stage", "Interest Date", "Status"];
    
    const rows = state.startupInterests.map(int => [
      int.id,
      int.investorId,
      int.investorName,
      int.startupId,
      int.startupName,
      int.startupIndustry,
      int.startupStage,
      formatDate(int.interestDate),
      int.status
    ]);
    
    if (format === 'PDF') {
      printPDF(title, headers, rows);
    } else {
      let csv = headers.map(h => `"${h}"`).join(',') + '\n';
      rows.forEach(r => {
        csv += `"${r[0]}","${r[1]}","${r[2]}","${r[3]}","${r[4]}","${r[5]}","${r[6]}","${r[7]}","${r[8]}"\n`;
      });
      const ext = format === 'Excel' ? 'xlsx' : 'csv';
      downloadCSV(csv, `startup_interests.${ext}`);
    }
  }

  function exportInvestmentAnalytics(format) {
    const title = "Investor Performance Analytics";
    const headers = ["Investor ID", "Investor Name", "Organization", "Interests Logged", "Contact Requests", "Meetings Scheduled", "Engagement Score", "Last Activity"];
    const approvedInvestors = state.investors.filter(inv => inv.status === 'Approved');
    
    const rows = approvedInvestors.map(inv => {
      const totalInts = state.startupInterests.filter(i => i.investorId === inv.id).length;
      const totalContacts = state.contactRequests.filter(c => c.investorId === inv.id).length;
      const meetingsCount = state.startupInterests.filter(i => i.investorId === inv.id && i.status === 'Meeting Scheduled').length;
      const score = calculateEngagementScore(totalInts, totalContacts, meetingsCount);
      
      let lastActivity = inv.appliedDate;
      state.startupInterests.filter(i => i.investorId === inv.id).forEach(i => { if (i.interestDate > lastActivity) lastActivity = i.interestDate; });
      state.contactRequests.filter(c => c.investorId === inv.id).forEach(c => { if (c.requestDate > lastActivity) lastActivity = c.requestDate; });
      
      return [
        inv.id,
        inv.name,
        inv.organization,
        totalInts,
        totalContacts,
        meetingsCount,
        score,
        formatDate(lastActivity)
      ];
    }).sort((a,b) => b[6] - a[6]);
    
    if (format === 'PDF') {
      printPDF(title, headers, rows);
    } else {
      let csv = headers.map(h => `"${h}"`).join(',') + '\n';
      rows.forEach(r => {
        csv += `"${r[0]}","${r[1]}","${r[2]}",${r[3]},${r[4]},${r[5]},${r[6]},"${r[7]}"\n`;
      });
      const ext = format === 'Excel' ? 'xlsx' : 'csv';
      downloadCSV(csv, `investor_analytics.${ext}`);
    }
  }

  function exportContactRequests(format) {
    const title = "Investor Contact Requests";
    const headers = ["Request ID", "Startup Name", "Founder Name", "Founder Email", "Founder Phone", "Investor Name", "Request Date", "Status"];
    
    const rows = state.contactRequests.map(req => [
      req.id,
      req.startupName,
      req.founderName,
      req.founderEmail,
      req.founderPhone,
      req.investorName,
      formatDate(req.requestDate),
      req.status
    ]);
    
    if (format === 'PDF') {
      printPDF(title, headers, rows);
    } else {
      let csv = headers.map(h => `"${h}"`).join(',') + '\n';
      rows.forEach(r => {
        csv += `"${r[0]}","${r[1]}","${r[2]}","${r[3]}","${r[4]}","${r[5]}","${r[6]}","${r[7]}"\n`;
      });
      const ext = format === 'Excel' ? 'xlsx' : 'csv';
      downloadCSV(csv, `investor_contact_requests.${ext}`);
    }
  }

  function exportCompleteInvestorReport(format) {
    const title = "StepUp for AI - Investor Management Master Report";
    
    if (format === 'PDF') {
      const printWindow = window.open('', '_blank');
      const approvedInvestors = state.investors.filter(inv => inv.status === 'Approved');
      
      let profilesHTML = approvedInvestors.map(inv => `
        <tr>
          <td>${escapeHTML(inv.id)}</td>
          <td>${escapeHTML(inv.name)}</td>
          <td>${escapeHTML(inv.organization)}</td>
          <td>${escapeHTML(inv.email)}</td>
          <td>${escapeHTML(inv.phone)}</td>
          <td>${formatDate(inv.appliedDate)}</td>
        </tr>
      `).join('');
      
      let interestsHTML = state.startupInterests.map(int => `
        <tr>
          <td>${escapeHTML(int.id)}</td>
          <td>${escapeHTML(int.investorName)}</td>
          <td>${escapeHTML(int.startupName)}</td>
          <td>${escapeHTML(int.startupIndustry)}</td>
          <td>${formatDate(int.interestDate)}</td>
          <td>${escapeHTML(int.status)}</td>
        </tr>
      `).join('');
      
      let contactsHTML = state.contactRequests.map(req => `
        <tr>
          <td>${escapeHTML(req.id)}</td>
          <td>${escapeHTML(req.startupName)}</td>
          <td>${escapeHTML(req.founderName)}</td>
          <td>${escapeHTML(req.investorName)}</td>
          <td>${formatDate(req.requestDate)}</td>
          <td>${escapeHTML(req.status)}</td>
        </tr>
      `).join('');
      
      const htmlContent = `
        <html>
          <head>
            <title>${title}</title>
            <style>
              body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                background-color: #0d0d11;
                color: #ffffff;
                padding: 40px;
              }
              .header {
                margin-bottom: 30px;
                border-bottom: 2px solid #ef4444;
                padding-bottom: 10px;
              }
              h1 { font-size: 24px; color: #ffffff; margin: 0 0 5px 0; }
              h2 { font-size: 18px; color: #ef4444; margin: 30px 0 10px 0; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 6px; }
              .meta { font-size: 13px; color: #a78bfa; }
              table { width: 100%; border-collapse: collapse; margin-top: 10px; margin-bottom: 20px; }
              th, td { border: 1px solid rgba(255, 255, 255, 0.1); padding: 8px 10px; text-align: left; font-size: 11px; }
              th { background-color: rgba(239, 68, 68, 0.1); color: #ef4444; font-weight: 600; }
              tr:nth-child(even) { background-color: rgba(255, 255, 255, 0.02); }
            </style>
          </head>
          <body>
            <div class="header">
               <h1>${title}</h1>
               <div class="meta">Generated on ${new Date().toLocaleString()} &bull; StepUp for AI Platform</div>
            </div>
            
            <h2>1. Approved Investor Profiles (${approvedInvestors.length})</h2>
            <table>
              <thead>
                <tr>
                  <th>Investor ID</th>
                  <th>Name</th>
                  <th>Organization</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Date Joined</th>
                </tr>
              </thead>
              <tbody>${profilesHTML}</tbody>
            </table>
            
            <h2>2. Startup Interests Log (${state.startupInterests.length})</h2>
            <table>
              <thead>
                <tr>
                  <th>Interest ID</th>
                  <th>Investor Name</th>
                  <th>Startup Name</th>
                  <th>Industry</th>
                  <th>Interest Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>${interestsHTML}</tbody>
            </table>
            
            <h2>3. Contact Requests (${state.contactRequests.length})</h2>
            <table>
              <thead>
                <tr>
                  <th>Request ID</th>
                  <th>Startup Name</th>
                  <th>Founder Name</th>
                  <th>Investor Name</th>
                  <th>Request Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>${contactsHTML}</tbody>
            </table>
            
            <script>
              window.onload = function() { window.print(); };
            </script>
          </body>
        </html>
      `;
      printWindow.document.write(htmlContent);
      printWindow.document.close();
    } else {
      let csv = `"STEPUP FOR AI - INVESTOR MASTER REPORT"\n`;
      csv += `"Generated Date","${new Date().toLocaleString()}"\n\n`;
      
      csv += `"SECTION 1: APPROVED INVESTOR PROFILES"\n`;
      csv += `"Investor ID","Name","Organization","Designation","Email","Phone","Date Joined"\n`;
      state.investors.filter(inv => inv.status === 'Approved').forEach(inv => {
        csv += `"${inv.id}","${inv.name}","${inv.organization}","${inv.designation}","${inv.email}","${inv.phone}","${inv.appliedDate}"\n`;
      });
      csv += `\n\n`;
      
      csv += `"SECTION 2: STARTUP INTERESTS LOG"\n`;
      csv += `"Interest ID","Investor ID","Investor Name","Startup ID","Startup Name","Startup Industry","Startup Stage","Interest Date","Status"\n`;
      state.startupInterests.forEach(int => {
        csv += `"${int.id}","${int.investorId}","${int.investorName}","${int.startupId}","${int.startupName}","${int.startupIndustry}","${int.startupStage}","${int.interestDate}","${int.status}"\n`;
      });
      csv += `\n\n`;
      
      csv += `"SECTION 3: CONTACT REQUESTS LOG"\n`;
      csv += `"Request ID","Startup ID","Startup Name","Founder Name","Founder Email","Founder Phone","Investor ID","Investor Name","Request Date","Status"\n`;
      state.contactRequests.forEach(req => {
        csv += `"${req.id}","${req.startupId}","${req.startupName}","${req.founderName}","${req.founderEmail}","${req.founderPhone}","${req.investorId}","${req.investorName}","${req.requestDate}","${req.status}"\n`;
      });
      
      const ext = format === 'Excel' ? 'xlsx' : 'csv';
      downloadCSV(csv, `investor_ecosystem_master_report.${ext}`);
    }
  }


  // ==========================================
  // EXPORTS
  // ==========================================
  window.dashboardApp = {
    switchTab,
    loadDemoData,
    resetApp,
    performLogout,

    // Webinar CRUD
    openCreateWebinarModal,
    openEditWebinarModal,
    closeCreateWebinarModal,
    deleteWebinar,
    viewWebinarDetails,
    exportWebinars,
    exportWebinarDetailsCSV,

    // Hackathon CRUD
    openCreateHackathonModal,
    openEditHackathonModal,
    closeCreateHackathonModal,
    deleteHackathon,
    viewHackathonDetails,
    exportHackathonsList,
    exportHackathonDetailsCSV,

    // Pitch Events CRUD
    openCreatePitchEventModal,
    openEditPitchEventModal,
    closeCreatePitchEventModal,
    deletePitchEvent,
    viewPitchEventDetails,
    exportPitchEventsList,
    exportPitchDetailsCSV,

    // Startups Applications
    viewStartupApplication,
    downloadPitchDeck,
    contactFounder,
    updateStartupStatus,
    exportApplications,

    // Students Directory
    openAddStudentModal,
    openAddStudentToEventModal,
    closeAddStudentModal,
    viewStudentProfile,
    deleteStudentAccount,
    exportStudentsMaster,

    // Approval management dashboard sub-tabs
    actionApprovalStatus,
    viewApprovalRosterProfile,
    exportApprovals,
    toggleSelectPending,
    toggleSelectAllPending,
    bulkApprovePending,
    bulkRejectPending,
    
    // Redirect clicks
    viewEventDetails,
    exportDashboard,

    // Recruiter Management Exporters and Renderers
    viewRecruiterProfile,
    exportRecruiterData,
    exportRecruiterInternshipsList,
    exportRecruiterApplicationsList,
    exportRecruiterAnalyticsTable,
    exportRecruiterProfilesList,
    exportInternshipApplicants,
    renderRecruiterDashboard,
    renderPublishedInternshipsTable,
    renderInternshipDetailsPane,
    renderRecruiterApplicationsTable,
    renderRecruiterAnalytics,
    renderRecruiterProfilesTable,

    // Investor Management Exporters and Renderers
    viewInvestorProfile,
    viewContactRequest,
    updateContactStatus,
    exportInvestorDashboard,
    exportInvestorProfiles,
    exportStartupInterests,
    exportInvestmentAnalytics,
    exportContactRequests,
    exportCompleteInvestorReport,
    renderInvestorDashboard,
    renderInvestorProfilesTable,
    renderStartupInterestsTable,
    renderInvestmentAnalytics,
    renderContactRequestsTable
  };

})();

}


