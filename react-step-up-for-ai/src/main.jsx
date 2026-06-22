import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route path="/*" element={<App />} />
      <Route path="/home.html" element={<Navigate to="/" replace />} />
      <Route path="/app/page.html" element={<Navigate to="/auth" replace />} />
      <Route path="/Admin-Dashboard/index.html" element={<Navigate to="/admin" replace />} />
    </Routes>
  </BrowserRouter>
);
