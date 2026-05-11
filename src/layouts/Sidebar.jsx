import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  MdDashboard, 
  MdPeople, 
  MdPerson, 
  MdBook, 
  MdSchedule, 
  MdAttachMoney, 
  MdAnalytics, 
  MdSettings,
  MdCheckCircle,
  MdAssignment,
  MdSchool
} from 'react-icons/md';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const menuItems = [
    { path: '/dashboard', name: 'Dashboard', icon: <MdDashboard />, end: true },
    { path: '/dashboard/students', name: 'Students', icon: <MdPeople /> },
    { path: '/dashboard/faculty', name: 'Faculty', icon: <MdPerson /> },
    { path: '/dashboard/subjects', name: 'Subjects', icon: <MdBook /> },
    { path: '/dashboard/attendance', name: 'Attendance', icon: <MdCheckCircle /> },
    { path: '/dashboard/timetable', name: 'Timetable', icon: <MdSchedule /> },
    { path: '/dashboard/fees', name: 'Fees', icon: <MdAttachMoney /> },
    { path: '/dashboard/exams', name: 'Exams', icon: <MdAssignment /> },
    { path: '/dashboard/results', name: 'Results', icon: <MdSchool /> },
    { path: '/dashboard/analytics', name: 'Analytics', icon: <MdAnalytics /> },
    { path: '/dashboard/settings', name: 'Settings', icon: <MdSettings /> },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 z-50 w-64 h-screen transition-transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700`}>
        <div className="flex items-center justify-center h-16 border-b border-slate-200 dark:border-slate-700">
          <h1 className="text-2xl font-bold text-primary-600 dark:text-primary-400">EduAdmin</h1>
        </div>
        
        <div className="overflow-y-auto py-4 px-3 h-[calc(100vh-4rem)]">
          <ul className="space-y-2">
            {menuItems.map((item, index) => (
              <li key={index}>
                <NavLink 
                  to={item.path}
                  end={item.end}
                  onClick={() => { if(window.innerWidth < 1024) setIsOpen(false); }}
                  className={({ isActive }) => 
                    `flex items-center p-3 text-base font-medium rounded-lg transition-colors ${
                      isActive 
                        ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/50 dark:text-primary-400' 
                        : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700'
                    }`
                  }
                >
                  <span className="text-xl mr-3">{item.icon}</span>
                  {item.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
