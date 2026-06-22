import { Navigate, Route, Routes } from 'react-router-dom';
import HomePage from './components/HomePage.jsx';
import AuthPage from './components/AuthPage.jsx';
import AdminDashboard from './components/AdminDashboard.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
