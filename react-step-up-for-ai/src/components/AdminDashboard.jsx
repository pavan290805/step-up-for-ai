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
