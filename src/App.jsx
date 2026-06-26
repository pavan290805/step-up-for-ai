import { Navigate, Route, Routes } from 'react-router-dom';
import Login from './pages/auth/Login.jsx';
import Signup from './pages/auth/Signup.jsx';
import InvestorDashboard from './pages/investor/InvestorDashboard.tsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import StudentDashboard from './pages/student/StudentDashboard.jsx';
import RecruiterDashboard from './pages/recruiter/RecruiterDashboard.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/student/*" element={<StudentDashboard />} />
      <Route path="/recruiter/*" element={<RecruiterDashboard />} />
      <Route path="/investor/*" element={<InvestorDashboard />} />
      <Route path="/admin/*" element={<AdminDashboard />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
