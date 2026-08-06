import { Navigate, Route, Routes } from 'react-router-dom';
import AdminDashboard from './app/admin/AdminDashboard.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="/admin/*" element={<AdminDashboard />} />
      <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
    </Routes>
  );
}
