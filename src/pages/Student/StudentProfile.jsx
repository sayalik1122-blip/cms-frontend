import React from 'react';
import { motion } from 'framer-motion';
import { MdPerson, MdEmail, MdPhone, MdSchool, MdCalendarToday, MdBadge, MdEdit } from 'react-icons/md';
import { useAuth } from '../../context/AuthContext';

const Field = ({ icon, label, value }) => (
  <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-50 dark:bg-slate-700/40 hover:bg-slate-100 dark:hover:bg-slate-700/70 transition-colors">
    <div className="p-2 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg flex-shrink-0 text-emerald-600 dark:text-emerald-400 text-lg">
      {icon}
    </div>
    <div className="min-w-0">
      <p className="text-xs text-slate-400 dark:text-slate-500 font-medium uppercase tracking-wide mb-0.5">{label}</p>
      <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">{value || '—'}</p>
    </div>
  </div>
);

const StudentProfile = () => {
  const { user } = useAuth();
  const initials = user?.name?.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() || 'S';

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">My Profile</h2>
        <p className="text-sm text-slate-500 mt-1">Your personal & academic information</p>
      </div>

      {/* Profile header card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="card p-6">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white text-3xl font-black shadow-xl shadow-emerald-500/30">
              {initials}
            </div>
            <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-800 flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full" />
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 text-center sm:text-left">
            <h3 className="text-2xl font-extrabold text-slate-800 dark:text-white">{user?.name}</h3>
            <p className="text-slate-500 dark:text-slate-400 mt-1">{user?.email}</p>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-3">
              <span className="text-xs font-semibold px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full">
                {user?.course}
              </span>
              <span className="text-xs font-semibold px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full">
                {user?.year} Year
              </span>
              <span className="text-xs font-semibold px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-full font-mono">
                ID: {user?.id}
              </span>
              <span className="text-xs font-semibold px-3 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full">
                ● Active
              </span>
            </div>
          </div>

          {/* Edit button (visual only) */}
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 text-sm font-medium rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex-shrink-0">
            <MdEdit /> Edit
          </button>
        </div>
      </motion.div>

      {/* Details grid */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="card p-6">
        <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-4">Personal Information</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field icon={<MdPerson />}       label="Full Name"    value={user?.name} />
          <Field icon={<MdEmail />}        label="Email"        value={user?.email} />
          <Field icon={<MdPhone />}        label="Phone"        value={user?.phone} />
          <Field icon={<MdBadge />}        label="Student ID"   value={user?.id} />
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="card p-6">
        <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-4">Academic Information</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field icon={<MdSchool />}       label="Course"       value={user?.course} />
          <Field icon={<MdCalendarToday />} label="Year / Semester" value={`${user?.year} Year`} />
        </div>
      </motion.div>

      {/* Account info */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
        <p className="text-xs text-slate-400 text-center">
          To update your information, please contact the administration office.
        </p>
      </motion.div>
    </div>
  );
};

export default StudentProfile;
