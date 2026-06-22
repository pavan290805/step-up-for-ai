import { useEffect, useRef } from 'react';
import adminHtml from '../legacy/admin-dashboard.html?raw';
import adminCss from '../legacy/admin.css?raw';
import adminReactOverrides from '../legacy/admin-react-overrides.css?raw';
import adminJs from '../legacy/admin.js?raw';
import { useLegacyStyle } from '../hooks/useLegacyStyle.js';

const adminBody = (adminHtml.match(/<body>([\s\S]*?)<\/body>/i)?.[1] ?? '')
  .replace(/<script[\s\S]*?<\/script>/gi, '')
  .replace(
    /<div class="logo-text">[\s\S]*?<\/div>\s*<\/div>/,
    '<img class="logo-image" src="/logos/logo-admin-transparent.png" alt="StepUp for AI Logo"></div>'
  )
  .replace(
    /<div class="top-notification-bell">([\s\S]*?)<\/div>/,
    `<div class="top-notification-wrapper">
            <button class="top-notification-bell" id="top-notification-trigger" type="button" aria-label="Open notifications" aria-expanded="false">
              $1
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
          </div>`
  );

export default function AdminDashboard() {
  const containerRef = useRef(null);
  useLegacyStyle('stepup-admin-style', adminCss);
  useLegacyStyle('stepup-admin-react-overrides', adminReactOverrides);

  useEffect(() => {
    document.title = 'StepUp for AI - Admin Dashboard';
    if (!window.location.hash) {
      window.location.hash = '/admin/investor-management';
    }

    const container = containerRef.current;
    container.innerHTML = adminBody;

    try {
      const runDashboard = new Function(`${adminJs}\nwindow.dispatchEvent(new Event('load'));`);
      runDashboard();
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
