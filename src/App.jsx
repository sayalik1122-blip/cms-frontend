import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './context/AuthContext';
import ScrollToTop from './components/ScrollToTop';
import ProtectedRoute from './components/ProtectedRoute';
import StudentRoute from './components/StudentRoute';

// Layouts
import AdminLayout from './layouts/AdminLayout';
import StudentLayout from './layouts/StudentLayout';

// Admin pages
import Dashboard from './pages/Dashboard/Dashboard';
import Students from './pages/Students/Students';
import Faculty from './pages/Faculty/Faculty';
import Subjects from './pages/Subjects/Subjects';
import Attendance from './pages/Attendance/Attendance';
import Timetable from './pages/Timetable/Timetable';
import Fees from './pages/Fees/Fees';
import Exams from './pages/Exams/Exams';
import Results from './pages/Results/Results';
import Analytics from './pages/Analytics/Analytics';
import Settings from './pages/Settings/Settings';

// Student portal pages
import StudentDashboard from './pages/Student/StudentDashboard';
import StudentResults from './pages/Student/StudentResults';
import StudentAttendance from './pages/Student/StudentAttendance';
import StudentFees from './pages/Student/StudentFees';
import StudentTimetable from './pages/Student/StudentTimetable';
import StudentExams from './pages/Student/StudentExams';
import StudentProfile from './pages/Student/StudentProfile';
import NotFound from './pages/NotFound';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ForgotPassword from './pages/Auth/ForgotPassword';
import ResetPassword from './pages/Auth/ResetPassword';
import Landing from './pages/Landing/Landing';

// Public
import Pricing from './pages/Public/Pricing';
import Documentation from './pages/Public/Documentation';
import Blog from './pages/Public/Blog';
import PrivacyPolicy from './pages/Public/PrivacyPolicy';
import TermsOfService from './pages/Public/TermsOfService';
import HelpCenter from './pages/Public/HelpCenter';
import FAQPage from './pages/Public/FAQPage';
import ContactPage from './pages/Public/ContactPage';

const App = () => (
  <AuthProvider>
    <ScrollToTop />
    <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick pauseOnHover />
    <Routes>
      {/* Public */}
      <Route path="/" element={<Landing />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/docs" element={<Documentation />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />
      <Route path="/terms" element={<TermsOfService />} />
      <Route path="/help" element={<HelpCenter />} />
      <Route path="/faq" element={<FAQPage />} />
      <Route path="/contact" element={<ContactPage />} />

      {/* Auth */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Admin dashboard (protected — admin only) */}
      <Route path="/dashboard" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="students" element={<Students />} />
        <Route path="faculty" element={<Faculty />} />
        <Route path="subjects" element={<Subjects />} />
        <Route path="attendance" element={<Attendance />} />
        <Route path="timetable" element={<Timetable />} />
        <Route path="fees" element={<Fees />} />
        <Route path="exams" element={<Exams />} />
        <Route path="results" element={<Results />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* Student portal (protected — student only) */}
      <Route path="/student" element={<StudentRoute><StudentLayout /></StudentRoute>}>
        <Route index element={<StudentDashboard />} />
        <Route path="results" element={<StudentResults />} />
        <Route path="attendance" element={<StudentAttendance />} />
        <Route path="fees" element={<StudentFees />} />
        <Route path="timetable" element={<StudentTimetable />} />
        <Route path="exams" element={<StudentExams />} />
        <Route path="profile" element={<StudentProfile />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  </AuthProvider>
);

export default App;
