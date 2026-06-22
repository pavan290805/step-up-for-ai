import { Navigate, Route, Routes } from 'react-router-dom';
import AdminDashboard from './components/AdminDashboard.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/admin#/admin/investor-management" replace />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="*" element={<Navigate to="/admin#/admin/investor-management" replace />} />
    </Routes>
  );
}
