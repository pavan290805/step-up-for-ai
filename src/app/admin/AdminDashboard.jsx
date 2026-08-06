import { useEffect, useRef } from 'react';
import { adminMarkup } from './adminMarkup.js';
import '../../styles/admin.css';
import '../../styles/admin-react-overrides.css';
import adminRuntime from './adminRuntime.js';

const notificationMenu = `
  <div class="top-notification-wrapper">
    <button class="top-notification-bell" id="top-notification-trigger" type="button" aria-label="Open notifications" aria-expanded="false">
      <i class="fa-regular fa-bell"></i>
      <span class="top-notification-badge">12</span>
    </button>
    <div class="top-notification-menu" id="top-notification-menu" aria-label="Notifications">
      <div class="notification-menu-header">
        <span>Notifications</span>
        <strong>12</strong>
      </div>
      <button class="notification-item" type="button">
        <i class="fa-solid fa-user-check"></i>
        <span>New investor approvals are waiting.</span>
      </button>
      <button class="notification-item" type="button">
        <i class="fa-solid fa-hand-holding-dollar"></i>
        <span>Startup interest activity updated.</span>
      </button>
      <button class="notification-item" type="button">
        <i class="fa-solid fa-envelope"></i>
        <span>Contact request summary is ready.</span>
      </button>
    </div>
  </div>
`;

const adminBody = adminMarkup
  .replace(/<div class="logo-text">[\s\S]*?<\/div>\s*<\/div>/, '<img class="logo-image" src="/logos/logo-admin-transparent.png" alt="StepUp for AI Logo"></div>')
  .replace(/<div class="top-notification-bell">[\s\S]*?<\/div>/, notificationMenu);

export default function AdminDashboard() {
  const containerRef = useRef(null);

  useEffect(() => {
    document.title = 'StepUp for AI - Admin Dashboard';
    if (!window.location.hash) {
      window.location.hash = '/admin/investor-management';
    }

    const container = containerRef.current;
    container.innerHTML = adminBody;

    try {
      adminRuntime();
      window.dispatchEvent(new Event('load'));
      bindNotificationMenu();
    } catch (error) {
      console.error('Dashboard failed to initialize:', error);
    }

    return () => {
      container.innerHTML = '';
      delete window.dashboardApp;
    };
  }, []);

  return <div className="react-admin-shell" ref={containerRef} />;
}

function bindNotificationMenu() {
  const trigger = document.getElementById('top-notification-trigger');
  const menu = document.getElementById('top-notification-menu');
  if (!trigger || !menu) return;

  trigger.addEventListener('click', (event) => {
    event.stopPropagation();
    const isOpen = menu.classList.toggle('active');
    trigger.setAttribute('aria-expanded', String(isOpen));
    document.getElementById('top-profile-dropdown-menu')?.classList.remove('active');
  });

  menu.addEventListener('click', (event) => event.stopPropagation());

  document.addEventListener('click', () => {
    menu.classList.remove('active');
    trigger.setAttribute('aria-expanded', 'false');
  });
}

