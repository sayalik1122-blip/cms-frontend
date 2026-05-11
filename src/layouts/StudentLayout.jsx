import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
  MdDashboard, MdSchool, MdCheckCircle, MdAttachMoney,
  MdSchedule, MdMenu, MdClose, MdLogout, MdNotifications,
  MdDarkMode, MdLightMode, MdPerson, MdAssignment,
} from 'react-icons/md';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { toast } from 'react-toastify';

const NAV = [
  { path: '/student',            label: 'Dashboard',   icon: <MdDashboard />,  end: true },
  { path: '/student/results',    label: 'My Results',  icon: <MdSchool /> },
  { path: '/student/attendance', label: 'Attendance',  icon: <MdCheckCircle /> },
  { path: '/student/fees',       label: 'Fees',        icon: <MdAttachMoney /> },
  { path: '/student/timetable',  label: 'Timetable',   icon: <MdSchedule /> },
  { path: '/student/exams',      label: 'Exams',       icon: <MdAssignment /> },
  { path: '/student/profile',    label: 'My Profile',  icon: <MdPerson /> },
];

const StudentLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.info('Signed out successfully.');
    navigate('/');
  };

  const initials = user?.name?.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() || 'S';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── Sidebar ─────────────────────────────── */}
      <aside className={`fixed top-0 left-0 z-50 w-64 h-screen transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 flex flex-col`}>

        {/* Brand */}
        <div className="flex items-center justify-between h-16 px-5 border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <MdSchool className="text-white text-lg" />
            </div>
            <div>
              <span className="text-base font-bold text-slate-800 dark:text-white">EduAdmin</span>
              <span className="ml-1.5 text-[10px] px-1.5 py-0.5 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 rounded-full font-bold uppercase tracking-wide">Student</span>
            </div>
          </div>
          <button className="lg:hidden text-slate-400 hover:text-slate-600" onClick={() => setSidebarOpen(false)}>
            <MdClose className="text-xl" />
          </button>
        </div>

        {/* Student card */}
        <div className="px-4 py-4 border-b border-slate-100 dark:border-slate-700 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-emerald-500/30 flex-shrink-0">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-slate-800 dark:text-white truncate">{user?.name}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user?.course}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400">
                  {user?.year} Year
                </span>
                <span className="text-slate-300 dark:text-slate-600">·</span>
                <span className="text-[10px] text-slate-400 font-mono">{user?.id}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 px-3 py-2">Menu</p>
          {NAV.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              onClick={() => { if (window.innerWidth < 1024) setSidebarOpen(false); }}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-emerald-50 to-emerald-50/50 dark:from-emerald-900/40 dark:to-emerald-900/10 text-emerald-700 dark:text-emerald-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700/60 hover:text-slate-800 dark:hover:text-slate-200'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span className={`text-xl flex-shrink-0 ${isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'}`}>
                    {item.icon}
                  </span>
                  {item.label}
                  {isActive && <span className="ml-auto w-1.5 h-1.5 bg-emerald-500 rounded-full" />}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom sign out */}
        <div className="px-3 pb-5 flex-shrink-0 border-t border-slate-100 dark:border-slate-700 pt-3">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <MdLogout className="text-xl" /> Sign Out
          </button>
        </div>
      </aside>

      {/* ── Main content ─────────────────────────── */}
      <div className="lg:ml-64 flex flex-col min-h-screen">

        {/* Topbar */}
        <header className="h-16 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30 flex-shrink-0">
          {/* Left */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              <MdMenu className="text-2xl" />
            </button>
            <div className="hidden lg:block">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'},{' '}
                <span className="font-bold text-slate-800 dark:text-white">{user?.name?.split(' ')[0]}</span> 👋
              </p>
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              title="Toggle theme"
            >
              {theme === 'dark' ? <MdLightMode className="text-xl" /> : <MdDarkMode className="text-xl" />}
            </button>
            <button className="relative p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
              <MdNotifications className="text-xl" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-800 animate-pulse" />
            </button>
            <div className="w-px h-6 bg-slate-200 dark:bg-slate-700 mx-1" />
            <button
              onClick={() => navigate('/student/profile')}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white text-xs font-bold shadow-sm">
                {initials}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-xs font-bold text-slate-800 dark:text-white leading-tight">{user?.name?.split(' ')[0]}</p>
                <p className="text-[10px] text-slate-400 leading-tight">{user?.course}</p>
              </div>
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-x-hidden">
          <Outlet />
        </main>

        {/* Footer */}
        <footer className="text-center py-3 text-xs text-slate-400 border-t border-slate-200 dark:border-slate-700">
          EduAdmin Student Portal · {new Date().getFullYear()}
        </footer>
      </div>
    </div>
  );
};

export default StudentLayout;
