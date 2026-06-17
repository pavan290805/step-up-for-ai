/* 
================================================================
   STEPUP FOR AI - ADMIN DASHBOARD CLIENT-SIDE LOGIC & DATABASE
================================================================
*/

(function() {
  'use strict';

  // Constants
  const STORAGE_KEY_EVENTS = 'stepup_events';
  const STORAGE_KEY_STUDENTS = 'stepup_students';
  const STORAGE_KEY_REGISTRATIONS = 'stepup_registrations';

  // App State Database
  let state = {
    events: [],
    students: [],
    registrations: []
  };

  // Pagination states
  let eventsPagination = { page: 1, limit: 5 };
  let eventStudentsPagination = { page: 1, limit: 10 };
  let globalStudentsPagination = { page: 1, limit: 10 };

  // Currently active filter values
  let currentEventFilter = 'all'; 
  let selectedEventId = null;
  let globalStudentsFilter = { search: '', branch: '', year: '' };
  let eventStudentsSearch = '';

  // Company logo and Banner image Base64 cache during form editing
  let formLogoBase64 = null;
  let formBannerBase64 = null;

  // Initialize Application
  window.addEventListener('DOMContentLoaded', () => {
    initDatabase();
    bindEvents();
    renderAll();
    
    // Check hash route for direct tabs
    handleHashRoute();
  });

  // Handle direct tab deep links via URL hash
  window.addEventListener('hashchange', handleHashRoute);

  function handleHashRoute() {
    const hash = window.location.hash.substring(1);
    const validTabs = ['dashboard', 'events', 'students', 'settings'];
    if (validTabs.includes(hash)) {
      switchTab(hash);
    }
  }

  // ==========================================
  // DATABASE / LOCAL STORAGE MANAGER
  // ==========================================
  function initDatabase() {
    try {
      const storedEvents = localStorage.getItem(STORAGE_KEY_EVENTS);
      const storedStudents = localStorage.getItem(STORAGE_KEY_STUDENTS);
      const storedRegs = localStorage.getItem(STORAGE_KEY_REGISTRATIONS);

      state.events = storedEvents ? JSON.parse(storedEvents) : [];
      state.students = storedStudents ? JSON.parse(storedStudents) : [];
      state.registrations = storedRegs ? JSON.parse(storedRegs) : [];
    } catch (e) {
      console.error("Failed to load local storage state", e);
      state.events = [];
      state.students = [];
      state.registrations = [];
    }
  }

  function saveDatabase() {
    try {
      localStorage.setItem(STORAGE_KEY_EVENTS, JSON.stringify(state.events));
      localStorage.setItem(STORAGE_KEY_STUDENTS, JSON.stringify(state.students));
      localStorage.setItem(STORAGE_KEY_REGISTRATIONS, JSON.stringify(state.registrations));
    } catch (e) {
      console.error("Failed to save state to local storage", e);
      alert("Local storage limit exceeded! Banners/Logos might be too large. Try uploading smaller images.");
    }
  }

  // Reset all application data
  function resetApp() {
    if (confirm("Are you sure you want to delete all events, registered students, and settings? This action is irreversible.")) {
      localStorage.removeItem(STORAGE_KEY_EVENTS);
      localStorage.removeItem(STORAGE_KEY_STUDENTS);
      localStorage.removeItem(STORAGE_KEY_REGISTRATIONS);
      state.events = [];
      state.students = [];
      state.registrations = [];
      selectedEventId = null;
      eventsPagination.page = 1;
      globalStudentsPagination.page = 1;
      saveDatabase();
      renderAll();
      switchTab('dashboard');
      alert("Application storage successfully reset!");
    }
  }

  // ==========================================
  // BIND DOM EVENT LISTENERS
  // ==========================================
  function bindEvents() {
    // Sidebar Tabs Navigation
    document.querySelectorAll('.nav-item[data-tab]').forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const tab = item.getAttribute('data-tab');
        switchTab(tab);
        window.location.hash = tab;
      });
    });

    // Logout button click trigger
    const logoutBtn = document.getElementById('sidebar-logout-btn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('logout-modal').classList.add('active');
      });
    }

    // Event filter tabs click trigger
    document.querySelectorAll('.filter-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        currentEventFilter = tab.getAttribute('data-filter');
        eventsPagination.page = 1;
        renderEventsList();
      });
    });

    // Handle Company Logo File Upload
    const logoInput = document.getElementById('form-company-logo');
    if (logoInput) {
      logoInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          if (file.size > 2 * 1024 * 1024) {
            alert("Company logo size cannot exceed 2MB.");
            logoInput.value = '';
            return;
          }
          const reader = new FileReader();
          reader.onload = (event) => {
            formLogoBase64 = event.target.result;
            showLogoPreview(file.name);
          };
          reader.readAsDataURL(file);
        }
      });
    }

    // Handle Banner File Upload
    const bannerInput = document.getElementById('form-banner-image');
    if (bannerInput) {
      bannerInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
          if (file.size > 5 * 1024 * 1024) {
            alert("Banner image size cannot exceed 5MB.");
            bannerInput.value = '';
            return;
          }
          const reader = new FileReader();
          reader.onload = (event) => {
            formBannerBase64 = event.target.result;
            showBannerPreview(file.name);
          };
          reader.readAsDataURL(file);
        }
      });
    }

    // Event creation/edit form submit handler
    const eventForm = document.getElementById('create-event-form');
    if (eventForm) {
      eventForm.addEventListener('submit', (e) => {
        e.preventDefault();
        saveEventForm();
      });
    }

    // Student global filters
    const filterTrigger = document.getElementById('global-students-filter-trigger');
    const filterPopover = document.getElementById('global-students-filter-popover');
    if (filterTrigger && filterPopover) {
      filterTrigger.addEventListener('click', (e) => {
        e.stopPropagation();
        filterPopover.classList.toggle('active');
      });
      // Close popover when clicking elsewhere
      document.addEventListener('click', (e) => {
        if (!filterPopover.contains(e.target) && e.target !== filterTrigger) {
          filterPopover.classList.remove('active');
        }
      });
    }

    // Apply global student filters
    const applyFilterBtn = document.getElementById('filter-apply-btn');
    if (applyFilterBtn) {
      applyFilterBtn.addEventListener('click', () => {
        globalStudentsFilter.branch = document.getElementById('filter-branch').value;
        globalStudentsFilter.year = document.getElementById('filter-year').value;
        globalStudentsPagination.page = 1;
        renderGlobalStudents();
        filterPopover.classList.remove('active');
      });
    }

    // Reset global student filters
    const resetFilterBtn = document.getElementById('filter-reset-btn');
    if (resetFilterBtn) {
      resetFilterBtn.addEventListener('click', () => {
        document.getElementById('filter-branch').value = '';
        document.getElementById('filter-year').value = '';
        globalStudentsFilter.branch = '';
        globalStudentsFilter.year = '';
        globalStudentsPagination.page = 1;
        renderGlobalStudents();
        filterPopover.classList.remove('active');
      });
    }

    // Global students search
    const globalSearchInput = document.getElementById('global-students-search');
    if (globalSearchInput) {
      globalSearchInput.addEventListener('input', (e) => {
        globalStudentsFilter.search = e.target.value.trim().toLowerCase();
        globalStudentsPagination.page = 1;
        renderGlobalStudents();
      });
    }

    // Event students search
    const eventStudentsSearchInput = document.getElementById('event-students-search');
    if (eventStudentsSearchInput) {
      eventStudentsSearchInput.addEventListener('input', (e) => {
        eventStudentsSearch = e.target.value.trim().toLowerCase();
        eventStudentsPagination.page = 1;
        renderEventStudents();
      });
    }

    // Event students pagination page size select
    const eventPageSize = document.getElementById('event-students-page-size');
    if (eventPageSize) {
      eventPageSize.addEventListener('change', (e) => {
        eventStudentsPagination.limit = parseInt(e.target.value);
        eventStudentsPagination.page = 1;
        renderEventStudents();
      });
    }

    // Global students pagination page size select
    const globalPageSize = document.getElementById('global-students-page-size');
    if (globalPageSize) {
      globalPageSize.addEventListener('change', (e) => {
        globalStudentsPagination.limit = parseInt(e.target.value);
        globalStudentsPagination.page = 1;
        renderGlobalStudents();
      });
    }

    // Add Student form submit
    const studentForm = document.getElementById('add-student-form');
    if (studentForm) {
      studentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        saveStudentForm();
      });
    }

    // Event Details action buttons
    const editBtn = document.getElementById('details-edit-btn');
    if (editBtn) {
      editBtn.addEventListener('click', () => {
        openEditEventModal(selectedEventId);
      });
    }

    const deleteBtn = document.getElementById('details-delete-btn');
    if (deleteBtn) {
      deleteBtn.addEventListener('click', () => {
        deleteEvent(selectedEventId);
      });
    }

    // Add student specifically to event
    const regToEventBtn = document.getElementById('register-student-to-event-btn');
    if (regToEventBtn) {
      regToEventBtn.addEventListener('click', () => {
        openAddStudentModal(selectedEventId);
      });
    }

    // Export Buttons
    const eventStudentsExport = document.getElementById('event-students-export-btn');
    if (eventStudentsExport) {
      eventStudentsExport.addEventListener('click', () => {
        exportEventRegistrationsCSV(selectedEventId);
      });
    }

    const globalStudentsExport = document.getElementById('global-students-export-btn');
    if (globalStudentsExport) {
      globalStudentsExport.addEventListener('click', () => {
        exportGlobalStudentsCSV();
      });
    }
    
    const masterExport = document.getElementById('global-students-export-btn');
    if (masterExport) {
      masterExport.addEventListener('click', () => {
        exportGlobalStudentsCSV();
      });
    }
  }

  // ==========================================
  // VIEW SWITCHING (TAB ROUTER)
  // ==========================================
  function switchTab(tabId) {
    // Hide all panels, deactivate nav items
    document.querySelectorAll('.content-panel').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(i => i.classList.remove('active'));

    const targetPanel = document.getElementById(`${tabId}-view`);
    const targetItem = document.querySelector(`.nav-item[data-tab="${tabId}"]`);

    if (targetPanel && targetItem) {
      targetPanel.classList.add('active');
      targetItem.classList.add('active');
    }

    // Render components related to that tab
    if (tabId === 'dashboard') {
      renderDashboard();
    } else if (tabId === 'events') {
      renderEventsList();
      renderEventDetails();
    } else if (tabId === 'students') {
      renderGlobalStudents();
    }
  }

  // ==========================================
  // RENDERING FUNCTIONS
  // ==========================================
  function renderAll() {
    renderDashboard();
    renderEventsList();
    renderEventDetails();
    renderGlobalStudents();
  }

  // 1. Dashboard Renderer
  function renderDashboard() {
    const totalEvents = state.events.length;
    const totalStudents = state.students.length;
    
    const totalWebinars = state.events.filter(e => e.type === 'webinar').length;
    const totalHackathons = state.events.filter(e => e.type === 'hackathon').length;

    // Set UI indicators
    document.getElementById('dash-total-events').innerText = totalEvents;
    document.getElementById('dash-total-students').innerText = totalStudents;
    document.getElementById('dash-total-webinars').innerText = totalWebinars;
    document.getElementById('dash-total-hackathons').innerText = totalHackathons;

    // Render Recent registrations list
    const recentListContainer = document.getElementById('dash-recent-registrations');
    
    // Sort registrations by date descending, take top 5
    const recentRegs = [...state.registrations]
      .sort((a, b) => new Date(b.registrationDate) - new Date(a.registrationDate))
      .slice(0, 5);

    if (recentRegs.length === 0) {
      recentListContainer.innerHTML = `
        <div class="table-empty-state">
          <i class="fa-solid fa-inbox"></i>
          <p>No student registrations recorded yet</p>
        </div>
      `;
      return;
    }

    let html = '';
    recentRegs.forEach(reg => {
      const student = state.students.find(s => s.id === reg.studentId);
      const event = state.events.find(e => e.id === reg.eventId);

      if (student && event) {
        const typeClass = event.type === 'webinar' ? 'event-type' : 'student-type';
        const typeIcon = event.type === 'webinar' ? 'fa-solid fa-video' : 'fa-solid fa-code';
        const regDateFormatted = formatDate(reg.registrationDate);

        html += `
          <div class="recent-item">
            <div class="activity-badge ${typeClass}">
              <i class="${typeIcon}"></i>
            </div>
            <div class="activity-content">
              <div class="activity-title">${escapeHTML(student.name)}</div>
              <div class="activity-desc">Registered for <strong style="color: var(--accent-red);">${escapeHTML(event.name)}</strong></div>
            </div>
            <div class="activity-time">${regDateFormatted}</div>
          </div>
        `;
      }
    });

    recentListContainer.innerHTML = html;
  }

  // 2. Events List Renderer (Left panel)
  function renderEventsList() {
    const container = document.getElementById('events-cards-list');
    
    // Filter events
    let filteredEvents = [...state.events];
    const today = new Date();

    if (currentEventFilter === 'webinar') {
      filteredEvents = filteredEvents.filter(e => e.type === 'webinar');
    } else if (currentEventFilter === 'hackathon') {
      filteredEvents = filteredEvents.filter(e => e.type === 'hackathon');
    } else if (currentEventFilter === 'upcoming') {
      filteredEvents = filteredEvents.filter(e => new Date(e.date) >= today);
    } else if (currentEventFilter === 'completed') {
      filteredEvents = filteredEvents.filter(e => new Date(e.date) < today);
    }

    // Sort by date descending
    filteredEvents.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Handle empty state
    if (filteredEvents.length === 0) {
      container.innerHTML = `
        <div class="details-empty-state">
          <i class="fa-solid fa-calendar-xmark"></i>
          <h3>No matching events</h3>
          <p>No events match the selected category filter.</p>
        </div>
      `;
      document.getElementById('events-list-pagination').innerHTML = '';
      return;
    }

    // Pagination
    const totalEvents = filteredEvents.length;
    const totalPages = Math.ceil(totalEvents / eventsPagination.limit);
    if (eventsPagination.page > totalPages) eventsPagination.page = totalPages || 1;

    const startIdx = (eventsPagination.page - 1) * eventsPagination.limit;
    const paginatedEvents = filteredEvents.slice(startIdx, startIdx + eventsPagination.limit);

    let html = '';
    paginatedEvents.forEach(event => {
      const activeClass = selectedEventId === event.id ? 'active' : '';
      const dateFormatted = formatDate(event.date);
      const isWebinar = event.type === 'webinar';
      const badgeText = isWebinar ? 'Webinar' : 'Hackathon';
      const badgeClass = isWebinar ? 'badge-webinar' : 'badge-hackathon';
      
      // Conducted logo image fallback
      const conductLogoHTML = event.companyLogo 
        ? `<img src="${event.companyLogo}" alt="${escapeHTML(event.conductedBy)} logo">`
        : `<div style="width:14px; height:14px; border-radius:50%; background:var(--accent-red); display:flex; align-items:center; justify-content:center; font-size:8px; font-weight:700; color:#fff;">${event.conductedBy.charAt(0).toUpperCase()}</div>`;

      // Event Banner fallback
      let bannerHTML = '';
      if (event.bannerImage) {
        bannerHTML = `<img src="${event.bannerImage}" alt="${escapeHTML(event.name)} banner">`;
      } else {
        const gradColor = isWebinar ? 'linear-gradient(135deg, #ff2e4b 0%, #05070c 100%)' : 'linear-gradient(135deg, #e0243d 0%, #131824 100%)';
        bannerHTML = `
          <div class="event-row-banner" style="background: ${gradColor}">
            <div class="event-row-banner-text">${escapeHTML(event.name)}</div>
          </div>
        `;
      }

      html += `
        <div class="event-row-card ${activeClass}" data-id="${event.id}">
          <div class="event-row-banner">
            ${bannerHTML}
          </div>
          <div class="event-row-info">
            <div class="event-row-title">${escapeHTML(event.name)}</div>
            <div class="event-row-conducted">
              ${conductLogoHTML}
              <span>${escapeHTML(event.conductedBy)}</span>
            </div>
            <div class="event-row-meta">
              <span><i class="fa-regular fa-calendar"></i> ${dateFormatted}</span>
              <span><i class="fa-regular fa-clock"></i> ${formatTime12h(event.startTime)}</span>
            </div>
            <span class="event-row-badge ${badgeClass}">${badgeText}</span>
          </div>
          <div class="event-row-caret">
            <i class="fa-solid fa-chevron-right"></i>
          </div>
        </div>
      `;
    });

    container.innerHTML = html;

    // Bind click handlers to cards
    container.querySelectorAll('.event-row-card').forEach(card => {
      card.addEventListener('click', () => {
        selectedEventId = parseInt(card.getAttribute('data-id'));
        
        // Mobile layout: slide-in active panel
        document.getElementById('event-details-pane').classList.add('active-mobile');
        
        renderEventsList();
        renderEventDetails();
      });
    });

    // Render list pagination controls
    renderPaginationControls('events-list-pagination', totalPages, eventsPagination, (newPage) => {
      eventsPagination.page = newPage;
      renderEventsList();
    });
  }

  // 3. Event Details Renderer (Right panel)
  function renderEventDetails() {
    const emptyView = document.getElementById('details-empty-view');
    const contentView = document.getElementById('details-content-view');

    if (!selectedEventId) {
      emptyView.style.display = 'flex';
      contentView.style.display = 'none';
      return;
    }

    const event = state.events.find(e => e.id === selectedEventId);
    if (!event) {
      selectedEventId = null;
      emptyView.style.display = 'flex';
      contentView.style.display = 'none';
      return;
    }

    emptyView.style.display = 'none';
    contentView.style.display = 'block';

    // Populate metadata fields
    document.getElementById('details-name').innerText = event.name;
    
    // Event type badge tag
    const typeBadge = document.getElementById('details-type-tag');
    if (event.type === 'webinar') {
      typeBadge.innerHTML = `<span class="event-row-badge badge-webinar">Webinar</span>`;
    } else {
      typeBadge.innerHTML = `<span class="event-row-badge badge-hackathon">Hackathon</span>`;
    }

    // Conducted by with Logo
    const conductedBlock = document.getElementById('details-conducted');
    if (event.companyLogo) {
      conductedBlock.innerHTML = `<img src="${event.companyLogo}" class="company-logo-spec" alt="Company Logo"> ${escapeHTML(event.conductedBy)}`;
    } else {
      conductedBlock.innerText = event.conductedBy;
    }

    document.getElementById('details-date').innerText = formatDate(event.date);
    document.getElementById('details-time').innerText = `${formatTime12h(event.startTime)} - ${formatTime12h(event.endTime)}`;
    document.getElementById('details-mode').innerText = `${event.mode} (${event.venue})`;
    document.getElementById('details-eligibility').innerText = `${event.eligibleYears} (Branches: ${event.branchesAllowed}${event.minCgpa ? `, CGPA ≥ ${event.minCgpa}` : ''})`;
    
    // Team mode details
    let teamText = event.participation;
    if (event.participation === 'Team' && event.minTeamSize && event.maxTeamSize) {
      teamText += ` (Size: ${event.minTeamSize}-${event.maxTeamSize} students)`;
    }
    document.getElementById('details-participation').innerText = teamText;
    document.getElementById('details-reg-start').innerText = formatDate(event.regStartDate);
    document.getElementById('details-reg-end').innerText = formatDate(event.regEndDate);
    document.getElementById('details-venue').innerText = event.venue;
    document.getElementById('details-description').innerText = event.description;

    // Load Banner image
    const bannerBox = document.getElementById('details-banner');
    if (event.bannerImage) {
      bannerBox.innerHTML = `<img src="${event.bannerImage}" alt="Event Banner">`;
    } else {
      const gradColor = event.type === 'webinar' ? 'linear-gradient(135deg, #ff2e4b 0%, #05070c 100%)' : 'linear-gradient(135deg, #e0243d 0%, #131824 100%)';
      bannerBox.style.background = gradColor;
      bannerBox.innerHTML = `<div class="details-banner-text">${escapeHTML(event.name)}</div>`;
    }

    // Calculate details metric counters
    const regStudents = getRegisteredStudentsForEvent(event.id);
    document.getElementById('event-stat-registrations').innerText = regStudents.length;

    // Registered yesterday
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const registeredYesterday = regStudents.filter(s => {
      const regObj = state.registrations.find(r => r.studentId === s.id && r.eventId === event.id);
      if (regObj) {
        const regDate = new Date(regObj.registrationDate);
        return regDate.toDateString() === yesterday.toDateString();
      }
      return false;
    }).length;
    document.getElementById('event-stat-yesterday').innerText = registeredYesterday;

    // Time left countdown
    const regEnd = new Date(event.regEndDate);
    const currentDate = new Date();
    const msDiff = regEnd - currentDate;
    const daysLeft = Math.ceil(msDiff / (1000 * 60 * 60 * 24));
    
    const closedBox = document.getElementById('event-stat-countdown');
    if (daysLeft < 0) {
      closedBox.innerText = '- (Closed)';
      closedBox.style.color = 'var(--text-muted)';
    } else if (daysLeft === 0) {
      closedBox.innerText = 'Today';
      closedBox.style.color = 'var(--accent-red)';
    } else {
      closedBox.innerText = `${daysLeft} Day${daysLeft > 1 ? 's' : ''}`;
      closedBox.style.color = 'var(--text-primary)';
    }

    // Event status (Upcoming, Ongoing, Completed)
    const eventStatusVal = document.getElementById('event-stat-status');
    const eventStatusIcon = document.getElementById('event-stat-status-icon');
    const eventDate = new Date(event.date);

    // Remove classes
    eventStatusVal.style.color = '';
    eventStatusIcon.className = 'detail-metric-icon';

    if (currentDate.toDateString() === eventDate.toDateString()) {
      eventStatusVal.innerText = 'Ongoing';
      eventStatusVal.style.color = 'var(--accent-blue)';
      eventStatusIcon.classList.add('blue');
      eventStatusIcon.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i>`;
    } else if (currentDate > eventDate) {
      eventStatusVal.innerText = 'Completed';
      eventStatusVal.style.color = 'var(--text-muted)';
      eventStatusIcon.classList.add('green');
      eventStatusIcon.innerHTML = `<i class="fa-regular fa-circle-check"></i>`;
    } else {
      eventStatusVal.innerText = 'Upcoming';
      eventStatusVal.style.color = 'var(--accent-green)';
      eventStatusIcon.classList.add('green');
      eventStatusIcon.innerHTML = `<i class="fa-regular fa-calendar-check"></i>`;
    }

    // Render Registered Students list for this event
    renderEventStudents();
  }

  // Registered students table list rendering (nested inside Event Details)
  function renderEventStudents() {
    const tbody = document.getElementById('event-students-tbody');
    let regStudents = getRegisteredStudentsForEvent(selectedEventId);

    // Apply search filter
    if (eventStudentsSearch) {
      regStudents = regStudents.filter(s => 
        s.name.toLowerCase().includes(eventStudentsSearch) || 
        s.email.toLowerCase().includes(eventStudentsSearch)
      );
    }

    if (regStudents.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" class="text-center">
            <div class="table-empty-state">
              <i class="fa-solid fa-users-slash"></i>
              <p>No registered students match criteria</p>
            </div>
          </td>
        </tr>
      `;
      document.getElementById('event-students-pagination-info').innerText = 'Showing 0 to 0 of 0 students';
      document.getElementById('event-students-pagination-controls').innerHTML = '';
      return;
    }

    // Sort registrations by registration date descending
    regStudents.sort((a, b) => {
      const regA = state.registrations.find(r => r.studentId === a.id && r.eventId === selectedEventId);
      const regB = state.registrations.find(r => r.studentId === b.id && r.eventId === selectedEventId);
      return new Date(regB.registrationDate) - new Date(regA.registrationDate);
    });

    // Pagination
    const totalStudents = regStudents.length;
    const totalPages = Math.ceil(totalStudents / eventStudentsPagination.limit);
    if (eventStudentsPagination.page > totalPages) eventStudentsPagination.page = totalPages || 1;

    const startIdx = (eventStudentsPagination.page - 1) * eventStudentsPagination.limit;
    const paginatedStudents = regStudents.slice(startIdx, startIdx + eventStudentsPagination.limit);

    let html = '';
    paginatedStudents.forEach((student, index) => {
      const regObj = state.registrations.find(r => r.studentId === student.id && r.eventId === selectedEventId);
      const regId = regObj ? regObj.id : `REG-${student.id}`;
      const regDate = regObj ? formatDate(regObj.registrationDate) : '-';

      html += `
        <tr>
          <td class="row-id">${regId}</td>
          <td style="font-weight:700;">${escapeHTML(student.name)}</td>
          <td>${escapeHTML(student.email)}</td>
          <td>${escapeHTML(student.college)}</td>
          <td>${escapeHTML(student.phone)}</td>
          <td><i class="fa-regular fa-calendar-days" style="color:var(--accent-red); margin-right:6px;"></i> ${regDate}</td>
        </tr>
      `;
    });

    tbody.innerHTML = html;

    // Update pagination stats
    const endIdx = Math.min(startIdx + eventStudentsPagination.limit, totalStudents);
    document.getElementById('event-students-pagination-info').innerText = `Showing ${startIdx + 1} to ${endIdx} of ${totalStudents} students`;

    // Render pagination controls
    renderPaginationControls('event-students-pagination-controls', totalPages, eventStudentsPagination, (newPage) => {
      eventStudentsPagination.page = newPage;
      renderEventStudents();
    });
  }

  // Helper: Get registered student accounts for a specific event
  function getRegisteredStudentsForEvent(eventId) {
    const studentIds = state.registrations
      .filter(r => r.eventId === eventId)
      .map(r => r.studentId);
    
    return state.students.filter(s => studentIds.includes(s.id));
  }

  // 4. Students View Renderer (Global Student Sign-up Data)
  function renderGlobalStudents() {
    const tbody = document.getElementById('global-students-tbody');
    let list = [...state.students];

    // Apply branch and year filters
    if (globalStudentsFilter.branch) {
      list = list.filter(s => s.branch === globalStudentsFilter.branch);
    }
    if (globalStudentsFilter.year) {
      list = list.filter(s => s.year === globalStudentsFilter.year);
    }

    // Apply search keyword filter
    if (globalStudentsFilter.search) {
      const keyword = globalStudentsFilter.search;
      list = list.filter(s => 
        s.id.toLowerCase().includes(keyword) || 
        s.name.toLowerCase().includes(keyword) || 
        s.email.toLowerCase().includes(keyword) ||
        s.college.toLowerCase().includes(keyword)
      );
    }

    // Calculate & render global students page metrics
    const totalStudents = state.students.length;
    document.getElementById('stud-total-students').innerText = totalStudents;

    // Month registered
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth();
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    document.getElementById('stud-month-label').innerText = `${monthNames[currentMonth]} ${currentYear}`;
    
    const registeredThisMonth = state.students.filter(s => {
      const createdDate = new Date(s.createdDate);
      return createdDate.getMonth() === currentMonth && createdDate.getFullYear() === currentYear;
    }).length;
    document.getElementById('stud-month-students').innerText = registeredThisMonth;

    // Week registered (7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const registeredThisWeek = state.students.filter(s => new Date(s.createdDate) >= sevenDaysAgo).length;
    document.getElementById('stud-week-students').innerText = registeredThisWeek;

    // Today registered
    const today = new Date();
    document.getElementById('stud-today-label').innerText = formatDate(today.toISOString());
    const registeredToday = state.students.filter(s => new Date(s.createdDate).toDateString() === today.toDateString()).length;
    document.getElementById('stud-today-students').innerText = registeredToday;

    // Check empty state
    if (list.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="9" class="text-center">
            <div class="table-empty-state">
              <i class="fa-solid fa-users-slash"></i>
              <p>No student accounts match the search or filter criteria</p>
            </div>
          </td>
        </tr>
      `;
      document.getElementById('global-students-pagination-info').innerText = 'Showing 0 to 0 of 0 students';
      document.getElementById('global-students-pagination-controls').innerHTML = '';
      return;
    }

    // Sort by account created date descending
    list.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));

    // Pagination
    const filteredCount = list.length;
    const totalPages = Math.ceil(filteredCount / globalStudentsPagination.limit);
    if (globalStudentsPagination.page > totalPages) globalStudentsPagination.page = totalPages || 1;

    const startIdx = (globalStudentsPagination.page - 1) * globalStudentsPagination.limit;
    const paginatedList = list.slice(startIdx, startIdx + globalStudentsPagination.limit);

    let html = '';
    paginatedList.forEach(student => {
      html += `
        <tr>
          <td class="row-id">${student.id}</td>
          <td style="font-weight:700;">${escapeHTML(student.name)}</td>
          <td>${escapeHTML(student.email)}</td>
          <td>${escapeHTML(student.phone)}</td>
          <td>${escapeHTML(student.college)}</td>
          <td>${escapeHTML(student.branch)}</td>
          <td>${student.year} Year</td>
          <td><i class="fa-regular fa-calendar-days" style="color:var(--accent-red); margin-right:6px;"></i> ${formatDate(student.createdDate)}</td>
          <td>
            <button class="row-action-btn view" onclick="window.dashboardApp.viewStudentProfile('${student.id}')" title="View Profile">
              <i class="fa-regular fa-eye"></i>
            </button>
            <button class="row-action-btn delete" onclick="window.dashboardApp.deleteStudentAccount('${student.id}')" title="Delete Student">
              <i class="fa-regular fa-trash-can"></i>
            </button>
          </td>
        </tr>
      `;
    });

    tbody.innerHTML = html;

    // Update pagination footer text
    const endIdx = Math.min(startIdx + globalStudentsPagination.limit, filteredCount);
    document.getElementById('global-students-pagination-info').innerText = `Showing ${startIdx + 1} to ${endIdx} of ${filteredCount} students`;

    // Render pagination controls
    renderPaginationControls('global-students-pagination-controls', totalPages, globalStudentsPagination, (newPage) => {
      globalStudentsPagination.page = newPage;
      renderGlobalStudents();
    });
  }

  // 5. Shared Pagination Controller Builder
  function renderPaginationControls(elementId, totalPages, pagState, onPageChange) {
    const parent = document.getElementById(elementId);
    if (!parent) return;

    if (totalPages <= 1) {
      parent.innerHTML = '';
      return;
    }

    let html = '';
    // Previous Button
    html += `<button class="pagination-btn" ${pagState.page === 1 ? 'disabled' : ''} data-page="${pagState.page - 1}"><i class="fa-solid fa-angle-left"></i></button>`;

    // Page Numbers
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
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l > 2) {
          rangeWithDots.push('...');
        }
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

    // Next Button
    html += `<button class="pagination-btn" ${pagState.page === totalPages ? 'disabled' : ''} data-page="${pagState.page + 1}"><i class="fa-solid fa-angle-right"></i></button>`;

    parent.innerHTML = html;

    // Attach click listeners to pagination buttons
    parent.querySelectorAll('.pagination-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const pageNum = btn.getAttribute('data-page');
        if (pageNum) {
          onPageChange(parseInt(pageNum));
        }
      });
    });
  }

  // ==========================================
  // MODALS OPEN/CLOSE CONTROL
  // ==========================================
  function openCreateEventModal() {
    formLogoBase64 = null;
    formBannerBase64 = null;
    document.getElementById('event-modal-title').innerText = "Create New Event";
    document.getElementById('event-form-submit-btn').innerText = "Create Event";
    document.getElementById('create-event-form').reset();
    document.getElementById('form-event-id').value = '';
    
    // Clear preview boxes
    document.getElementById('company-logo-preview-box').innerHTML = '';
    document.getElementById('banner-preview-box').innerHTML = '';

    document.getElementById('create-event-modal').classList.add('active');
  }

  function closeCreateEventModal() {
    document.getElementById('create-event-modal').classList.remove('active');
  }

  function openEditEventModal(eventId) {
    const event = state.events.find(e => e.id === eventId);
    if (!event) return;

    formLogoBase64 = event.companyLogo;
    formBannerBase64 = event.bannerImage;

    document.getElementById('event-modal-title').innerText = "Edit Event Details";
    document.getElementById('event-form-submit-btn').innerText = "Save Changes";
    
    // Populate form fields
    document.getElementById('form-event-id').value = event.id;
    document.getElementById('form-event-type').value = event.type;
    document.getElementById('form-event-name').value = event.name;
    document.getElementById('form-conducted-by').value = event.conductedBy;
    document.getElementById('form-description').value = event.description;
    document.getElementById('form-event-date').value = event.date;
    document.getElementById('form-start-time').value = event.startTime;
    document.getElementById('form-end-time').value = event.endTime;
    document.getElementById('form-reg-start').value = event.regStartDate;
    document.getElementById('form-reg-end').value = event.regEndDate;
    document.getElementById('form-eligible-years').value = event.eligibleYears;
    document.getElementById('form-branches').value = event.branchesAllowed;
    document.getElementById('form-min-cgpa').value = event.minCgpa || '';
    document.getElementById('form-participation').value = event.participation;
    document.getElementById('form-min-team').value = event.minTeamSize || '';
    document.getElementById('form-max-team').value = event.maxTeamSize || '';
    document.getElementById('form-mode').value = event.mode;
    document.getElementById('form-venue').value = event.venue;
    document.getElementById('form-prize').value = event.prizeDetails || '';
    document.getElementById('form-certificate').value = event.certificateAvailable;
    document.getElementById('form-contact-name').value = event.contactPerson;
    document.getElementById('form-contact-email').value = event.contactEmail;
    document.getElementById('form-contact-phone').value = event.contactPhone;

    // Setup file previews if existing
    if (event.companyLogo) showLogoPreview("company_logo.png");
    if (event.bannerImage) showBannerPreview("banner_image.png");

    document.getElementById('create-event-modal').classList.add('active');
  }

  function openAddStudentModal(forEventId = null) {
    document.getElementById('add-student-form').reset();
    document.getElementById('form-student-event-id').value = forEventId || '';
    
    const subtitleText = forEventId 
      ? `Register a student directly for this specific event.`
      : `Register a student globally in the platform directory.`;
    
    document.getElementById('student-modal-title').innerText = forEventId ? "Register Event Student" : "Add Student Account";
    document.getElementById('student-modal-title').nextElementSibling.innerText = subtitleText;

    document.getElementById('add-student-modal').classList.add('active');
  }

  function closeAddStudentModal() {
    document.getElementById('add-student-modal').classList.remove('active');
  }

  // File Upload Previews helpers
  function showLogoPreview(filename) {
    const box = document.getElementById('company-logo-preview-box');
    box.innerHTML = `
      <div class="upload-preview-container">
        <img src="${formLogoBase64}" class="upload-preview-thumb" alt="Logo preview">
        <div class="upload-preview-details">
          <div class="upload-preview-name">${escapeHTML(filename)}</div>
          <span class="upload-preview-reset" id="reset-logo-upload-btn">Remove logo</span>
        </div>
      </div>
    `;
    document.getElementById('reset-logo-upload-btn').addEventListener('click', () => {
      formLogoBase64 = null;
      document.getElementById('form-company-logo').value = '';
      box.innerHTML = '';
    });
  }

  function showBannerPreview(filename) {
    const box = document.getElementById('banner-preview-box');
    box.innerHTML = `
      <div class="upload-preview-container">
        <img src="${formBannerBase64}" class="upload-preview-thumb" alt="Banner preview">
        <div class="upload-preview-details">
          <div class="upload-preview-name">${escapeHTML(filename)}</div>
          <span class="upload-preview-reset" id="reset-banner-upload-btn">Remove banner</span>
        </div>
      </div>
    `;
    document.getElementById('reset-banner-upload-btn').addEventListener('click', () => {
      formBannerBase64 = null;
      document.getElementById('form-banner-image').value = '';
      box.innerHTML = '';
    });
  }

  // ==========================================
  // DATA OPERATIONS (CREATE, UPDATE, DELETE)
  // ==========================================
  
  // Submit Event creation/update
  function saveEventForm() {
    const idFieldVal = document.getElementById('form-event-id').value;
    const isEdit = idFieldVal !== '';
    
    const eventData = {
      type: document.getElementById('form-event-type').value,
      name: document.getElementById('form-event-name').value,
      conductedBy: document.getElementById('form-conducted-by').value,
      companyLogo: formLogoBase64,
      bannerImage: formBannerBase64,
      description: document.getElementById('form-description').value,
      date: document.getElementById('form-event-date').value,
      startTime: document.getElementById('form-start-time').value,
      endTime: document.getElementById('form-end-time').value,
      regStartDate: document.getElementById('form-reg-start').value,
      regEndDate: document.getElementById('form-reg-end').value,
      eligibleYears: document.getElementById('form-eligible-years').value,
      branchesAllowed: document.getElementById('form-branches').value,
      minCgpa: document.getElementById('form-min-cgpa').value ? parseFloat(document.getElementById('form-min-cgpa').value) : null,
      participation: document.getElementById('form-participation').value,
      minTeamSize: document.getElementById('form-min-team').value ? parseInt(document.getElementById('form-min-team').value) : null,
      maxTeamSize: document.getElementById('form-max-team').value ? parseInt(document.getElementById('form-max-team').value) : null,
      mode: document.getElementById('form-mode').value,
      venue: document.getElementById('form-venue').value,
      prizeDetails: document.getElementById('form-prize').value || null,
      certificateAvailable: document.getElementById('form-certificate').value,
      contactPerson: document.getElementById('form-contact-name').value,
      contactEmail: document.getElementById('form-contact-email').value,
      contactPhone: document.getElementById('form-contact-phone').value,
    };

    // Date range sanity checks
    if (new Date(eventData.regStartDate) > new Date(eventData.regEndDate)) {
      alert("Registration start date cannot be later than registration end date.");
      return;
    }
    if (new Date(eventData.regEndDate) > new Date(eventData.date)) {
      alert("Registration end date cannot be later than the event date.");
      return;
    }
    if (eventData.startTime >= eventData.endTime) {
      alert("Start time must be earlier than the end time.");
      return;
    }

    if (isEdit) {
      const eventId = parseInt(idFieldVal);
      const index = state.events.findIndex(e => e.id === eventId);
      if (index !== -1) {
        eventData.id = eventId;
        state.events[index] = eventData;
        alert("Event updated successfully!");
      }
    } else {
      // Auto-generate numeric ID
      eventData.id = state.events.length > 0 ? Math.max(...state.events.map(e => e.id)) + 1 : 1001;
      state.events.push(eventData);
      selectedEventId = eventData.id; // Automatically select the newly created event
      alert("Event created successfully!");
    }

    saveDatabase();
    closeCreateEventModal();
    renderAll();
    switchTab('events');
  }

  // Delete event
  function deleteEvent(eventId) {
    const event = state.events.find(e => e.id === eventId);
    if (!event) return;

    if (confirm(`Are you sure you want to delete the event: "${event.name}"? This will also remove all registrations associated with this event.`)) {
      // Delete registrations
      state.registrations = state.registrations.filter(r => r.eventId !== eventId);
      // Delete event
      state.events = state.events.filter(e => e.id !== eventId);
      
      selectedEventId = state.events.length > 0 ? state.events[0].id : null;
      
      saveDatabase();
      renderAll();
    }
  }

  // Submit Student registration
  function saveStudentForm() {
    const email = document.getElementById('form-student-email').value.trim();
    const eventIdVal = document.getElementById('form-student-event-id').value;
    const targetEventId = eventIdVal !== '' ? parseInt(eventIdVal) : null;

    // Check if student exists globally by email
    let student = state.students.find(s => s.email.toLowerCase() === email.toLowerCase());

    if (!student) {
      // Create new student profile
      student = {
        id: generateStudentID(),
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
      // Update details of existing student
      student.name = document.getElementById('form-student-name').value.trim();
      student.phone = document.getElementById('form-student-phone').value.trim();
      student.college = document.getElementById('form-student-college').value.trim();
      student.branch = document.getElementById('form-student-branch').value;
      student.year = document.getElementById('form-student-year').value;
    }

    // Handle event specific registration
    let successTitle = "Registration Successful";
    let successSubtitle = "The student account has been created and verified successfully.";
    let displayCodeLabel = "Student Unique ID";
    let displayCodeValue = student.id;

    if (targetEventId) {
      // Check duplicate registration
      const isRegistered = state.registrations.some(r => r.studentId === student.id && r.eventId === targetEventId);
      if (isRegistered) {
        alert(`${student.name} is already registered for this event.`);
        return;
      } else {
        const registrationId = `REG${String(state.registrations.length + 1).padStart(3, '0')}`;
        state.registrations.push({
          id: registrationId,
          studentId: student.id,
          eventId: targetEventId,
          registrationDate: new Date().toISOString()
        });
        
        successTitle = "Enrollment Successful";
        successSubtitle = "The student has been enrolled in the event successfully.";
        displayCodeLabel = "Event Registration ID";
        displayCodeValue = registrationId;
      }
    }

    // Populate and open success modal
    document.getElementById('student-success-modal').querySelector('h3').innerText = successTitle;
    document.getElementById('student-success-modal').querySelector('p').innerText = successSubtitle;
    document.getElementById('student-success-modal').querySelector('span').innerText = displayCodeLabel;
    document.getElementById('success-student-id').innerText = displayCodeValue;
    document.getElementById('success-student-name').innerText = student.name;
    document.getElementById('success-student-branch').innerText = student.branch;
    document.getElementById('success-student-year').innerText = `${student.year} Year`;
    document.getElementById('student-success-modal').classList.add('active');

    saveDatabase();
    closeAddStudentModal();
    renderAll();
  }

  // Auto generate Student unique ID
  function generateStudentID() {
    const num = state.students.length + 1;
    return `STU${String(num).padStart(3, '0')}`;
  }

  // View Student details popup modal
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

    // Get events registered for
    const regs = state.registrations.filter(r => r.studentId === student.id);
    const eventList = document.getElementById('view-student-events-list');
    
    if (regs.length === 0) {
      eventList.innerHTML = `<li style="font-size:13px; color:var(--text-muted);">This student has not registered for any events yet.</li>`;
    } else {
      let html = '';
      regs.forEach(reg => {
        const ev = state.events.find(e => e.id === reg.eventId);
        if (ev) {
          const typeTag = ev.type === 'webinar' ? 'badge-webinar' : 'badge-hackathon';
          html += `
            <li style="display:flex; justify-content:space-between; align-items:center; background:rgba(255,255,255,0.02); padding:8px 12px; border-radius:var(--radius-sm); border:1px solid var(--border-color);">
              <span style="font-size:13px; font-weight:600;">${escapeHTML(ev.name)}</span>
              <span class="event-row-badge ${typeTag}" style="font-size:9px; padding:2px 6px;">${ev.type}</span>
            </li>
          `;
        }
      });
      eventList.innerHTML = html;
    }

    document.getElementById('view-student-modal').classList.add('active');
  }

  // Delete student account completely
  function deleteStudentAccount(studentId) {
    const student = state.students.find(s => s.id === studentId);
    if (!student) return;

    if (confirm(`Are you sure you want to delete the account for student: "${student.name}" (${student.id})? This will delete their profile and remove all event registration logs.`)) {
      // Remove registration logs
      state.registrations = state.registrations.filter(r => r.studentId !== studentId);
      // Remove student profile
      state.students = state.students.filter(s => s.id !== studentId);
      
      saveDatabase();
      renderAll();
    }
  }

  // Session Logout Handler
  function performLogout() {
    document.getElementById('logout-modal').classList.remove('active');
    alert("Administrative session closed. Redirecting to home portal...");
    window.location.href = 'home.html';
  }

  // ==========================================
  // CSV EXPORTER ENGINE
  // ==========================================
  
  // Export event registered students list
  function exportEventRegistrationsCSV(eventId) {
    const event = state.events.find(e => e.id === eventId);
    if (!event) return;

    const list = getRegisteredStudentsForEvent(eventId);
    if (list.length === 0) {
      alert("No students registered for this event yet.");
      return;
    }

    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Registration ID,Student Name,Email,Phone,College,Branch,Year,Registered Date\n";

    list.forEach(student => {
      const reg = state.registrations.find(r => r.studentId === student.id && r.eventId === eventId);
      const regId = reg ? reg.id : '';
      const regDate = reg ? new Date(reg.registrationDate).toLocaleDateString() : '';
      
      const row = [
        regId,
        `"${student.name.replace(/"/g, '""')}"`,
        student.email,
        student.phone,
        `"${student.college.replace(/"/g, '""')}"`,
        `"${student.branch}"`,
        `${student.year} Year`,
        regDate
      ].join(",");
      csvContent += row + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `registered_students_${event.name.toLowerCase().replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Export global master students database
  function exportGlobalStudentsCSV() {
    if (state.students.length === 0) {
      alert("The master student database is empty.");
      return;
    }

    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Student ID,Full Name,Email,Phone Number,College Name,Branch,Year,Account Created Date\n";

    state.students.forEach(student => {
      const row = [
        student.id,
        `"${student.name.replace(/"/g, '""')}"`,
        student.email,
        student.phone,
        `"${student.college.replace(/"/g, '""')}"`,
        `"${student.branch}"`,
        `${student.year} Year`,
        new Date(student.createdDate).toLocaleDateString()
      ].join(",");
      csvContent += row + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "stepup_students_master_db.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // ==========================================
  // PREMIUM DEMO SEED DATA GENERATOR
  // ==========================================
  function loadDemoData() {
    // Premium events demo
    const demoEvents = [
      {
        id: 1001,
        type: "webinar",
        name: "AI Startup Funding Webinar",
        conductedBy: "Microsoft",
        companyLogo: "",
        bannerImage: "",
        description: "Learn how startups can secure funding, pitch to venture capitalists, and scale their AI ideas globally. Featuring expert panel discussions and interactive Q&A.",
        date: "2025-05-25",
        startTime: "10:00",
        endTime: "12:00",
        regStartDate: "2025-05-10",
        regEndDate: "2025-05-24",
        eligibleYears: "2nd Year and Above",
        branchesAllowed: "All Branches",
        minCgpa: 7.0,
        participation: "Solo",
        minTeamSize: null,
        maxTeamSize: null,
        mode: "Online",
        venue: "Zoom Meeting",
        prizeDetails: "Free Azure Credits worth $5,000",
        certificateAvailable: "Yes",
        contactPerson: "John Doe",
        contactEmail: "john.doe@microsoft.com",
        contactPhone: "9876543201"
      },
      {
        id: 1002,
        type: "hackathon",
        name: "Build with AI Hackathon 2025",
        conductedBy: "Google",
        companyLogo: "",
        bannerImage: "",
        description: "An intensive 36-hour hackathon where students build innovative prototypes leveraging Google Gemini API and Firebase models. Exciting prizes and mentorship opportunities.",
        date: "2025-05-30",
        startTime: "09:00",
        endTime: "20:00",
        regStartDate: "2025-05-15",
        regEndDate: "2025-05-28",
        eligibleYears: "3rd Year and Above",
        branchesAllowed: "CSE, IT, ECE",
        minCgpa: 7.5,
        participation: "Team",
        minTeamSize: 2,
        maxTeamSize: 4,
        mode: "Offline",
        venue: "Google Bangalore Campus, Hall C",
        prizeDetails: "Cash Prizes worth ₹1,50,000 + Internship Interview passes",
        certificateAvailable: "Yes",
        contactPerson: "Alice Smith",
        contactEmail: "alice.smith@google.com",
        contactPhone: "9876543202"
      },
      {
        id: 1003,
        type: "webinar",
        name: "Investor Pitching Strategies",
        conductedBy: "TCS",
        companyLogo: "",
        bannerImage: "",
        description: "Master the art of creating pitch decks that capture institutional attention. Explore structural modeling, valuations, and validation frameworks.",
        date: "2025-06-10",
        startTime: "11:00",
        endTime: "13:00",
        regStartDate: "2025-05-20",
        regEndDate: "2025-06-08",
        eligibleYears: "All Years",
        branchesAllowed: "All Branches",
        minCgpa: null,
        participation: "Solo",
        minTeamSize: null,
        maxTeamSize: null,
        mode: "Online",
        venue: "Microsoft Teams",
        prizeDetails: "TCS Innovation Hub Goodies Pack",
        certificateAvailable: "Yes",
        contactPerson: "Rohan Das",
        contactEmail: "rohan.das@tcs.com",
        contactPhone: "9876543203"
      },
      {
        id: 1004,
        type: "webinar",
        name: "Web Development Workshop",
        conductedBy: "StepUp AI",
        companyLogo: "",
        bannerImage: "",
        description: "A comprehensive developer boot camp on modern JavaScript architectures, UI state synchronization, and deploying premium responsive admin designs.",
        date: "2025-06-15",
        startTime: "14:00",
        endTime: "17:00",
        regStartDate: "2025-05-25",
        regEndDate: "2025-06-14",
        eligibleYears: "All Years",
        branchesAllowed: "CSE, IT, ECE, EEE",
        minCgpa: null,
        participation: "Solo",
        minTeamSize: null,
        maxTeamSize: null,
        mode: "Online",
        venue: "Zoom Video Webinar",
        prizeDetails: "Free StepUp Premium subscription for 6 months",
        certificateAvailable: "Yes",
        contactPerson: "Admin Coordinator",
        contactEmail: "admin@stepupforai.com",
        contactPhone: "9876543204"
      },
      {
        id: 1005,
        type: "webinar",
        name: "Cybersecurity Awareness Webinar",
        conductedBy: "CyberSafe",
        companyLogo: "",
        bannerImage: "",
        description: "Introduction to ethical hacking, threat landscapes, penetration testing methodology, and career paths in cybersecurity systems.",
        date: "2025-06-20",
        startTime: "16:00",
        endTime: "17:30",
        regStartDate: "2025-06-01",
        regEndDate: "2025-06-19",
        eligibleYears: "All Years",
        branchesAllowed: "All Branches",
        minCgpa: null,
        participation: "Solo",
        minTeamSize: null,
        maxTeamSize: null,
        mode: "Online",
        venue: "Zoom Webinar Link",
        prizeDetails: "Cybersecurity course vouchers worth $200",
        certificateAvailable: "Yes",
        contactPerson: "Sarah Connor",
        contactEmail: "sconnor@cybersafe.org",
        contactPhone: "9876543205"
      }
    ];

    // Premium students demo
    const demoStudents = [
      { id: "STU001", name: "Rahul Sharma", email: "rahul@gmail.com", phone: "9876543210", college: "ABC College", branch: "Computer Science", year: "3", createdDate: "2025-05-12T10:00:00Z" },
      { id: "STU002", name: "Priya Patel", email: "priya123@gmail.com", phone: "9876543211", college: "XYZ College", branch: "Information Technology", year: "2", createdDate: "2025-05-13T11:30:00Z" },
      { id: "STU003", name: "Arjun Mehta", email: "arjunmehta@gmail.com", phone: "9876543212", college: "PQR College", branch: "Computer Science", year: "4", createdDate: "2025-05-14T09:15:00Z" },
      { id: "STU004", name: "Sneha Reddy", email: "sneha.reddy@gmail.com", phone: "9876543213", college: "LMN College", branch: "Electronics & Communication", year: "3", createdDate: "2025-05-15T14:40:00Z" },
      { id: "STU005", name: "Vikas Kumar", email: "vikas.kumar@gmail.com", phone: "9876543214", college: "ABC College", branch: "Mechanical Engineering", year: "4", createdDate: "2025-05-16T16:20:00Z" },
      { id: "STU006", name: "Ananya Gupta", email: "ananya.gupta@gmail.com", phone: "9876543215", college: "XYZ College", branch: "Computer Science", year: "2", createdDate: "2025-05-17T10:05:00Z" },
      { id: "STU007", name: "Manish Verma", email: "manish.verma@gmail.com", phone: "9876543216", college: "PQR College", branch: "Information Technology", year: "3", createdDate: "2025-05-18T13:50:00Z" },
      { id: "STU008", name: "Neha Singh", email: "neha.singh@gmail.com", phone: "9876543217", college: "LMN College", branch: "Computer Science", year: "1", createdDate: "2025-05-19T11:10:00Z" }
    ];

    // Premium registration log links
    const demoRegs = [
      // All 8 registered for Microsoft Webinar
      { id: "REG001", studentId: "STU001", eventId: 1001, registrationDate: "2025-05-12T12:00:00Z" },
      { id: "REG002", studentId: "STU002", eventId: 1001, registrationDate: "2025-05-13T13:40:00Z" },
      { id: "REG003", studentId: "STU003", eventId: 1001, registrationDate: "2025-05-14T14:00:00Z" },
      { id: "REG004", studentId: "STU004", eventId: 1001, registrationDate: "2025-05-15T15:30:00Z" },
      { id: "REG005", studentId: "STU005", eventId: 1001, registrationDate: "2025-05-16T16:45:00Z" },
      { id: "REG006", studentId: "STU006", eventId: 1001, registrationDate: "2025-05-17T17:15:00Z" },
      { id: "REG007", studentId: "STU007", eventId: 1001, registrationDate: "2025-05-18T18:00:00Z" },
      { id: "REG008", studentId: "STU008", eventId: 1001, registrationDate: "2025-05-19T19:00:00Z" },

      // Some registered for Google Hackathon
      { id: "REG009", studentId: "STU001", eventId: 1002, registrationDate: "2025-05-16T10:00:00Z" },
      { id: "REG010", studentId: "STU003", eventId: 1002, registrationDate: "2025-05-17T11:00:00Z" },
      { id: "REG011", studentId: "STU004", eventId: 1002, registrationDate: "2025-05-18T12:00:00Z" },
      { id: "REG012", studentId: "STU006", eventId: 1002, registrationDate: "2025-05-19T13:00:00Z" },

      // Some registered for TCS Webinar
      { id: "REG013", studentId: "STU002", eventId: 1003, registrationDate: "2025-05-21T10:00:00Z" },
      { id: "REG014", studentId: "STU007", eventId: 1003, registrationDate: "2025-05-22T11:00:00Z" },

      // Some registered for StepUp WebDev Workshop
      { id: "REG015", studentId: "STU004", eventId: 1004, registrationDate: "2025-05-26T10:00:00Z" },
      { id: "REG016", studentId: "STU008", eventId: 1004, registrationDate: "2025-05-26T11:00:00Z" }
    ];

    state.events = demoEvents;
    state.students = demoStudents;
    state.registrations = demoRegs;

    selectedEventId = 1001; // Default select first event

    saveDatabase();
    renderAll();
    switchTab('events');
    alert("Premium evaluation demo data loaded successfully!");
  }

  // ==========================================
  // CORE UTILITY FORMATTERS
  // ==========================================
  function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  }

  function formatTime12h(timeString) {
    if (!timeString) return '';
    const parts = timeString.split(':');
    let hours = parseInt(parts[0]);
    const minutes = parts[1] || '00';
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    return `${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;
  }

  function escapeHTML(str) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // Global namespace exports for interactive HTML tags
  window.dashboardApp = {
    openCreateEventModal,
    closeCreateEventModal,
    openAddStudentModal,
    closeAddStudentModal,
    viewStudentProfile,
    deleteStudentAccount,
    switchTab,
    loadDemoData,
    resetApp,
    performLogout
  };

})();
