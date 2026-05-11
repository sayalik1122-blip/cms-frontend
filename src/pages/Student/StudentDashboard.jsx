import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MdSchool, MdCheckCircle, MdAttachMoney, MdAssignment,
  MdTrendingUp, MdWarning, MdArrowForward, MdCalendarToday,
} from 'react-icons/md';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

const card = (i) => ({ initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { delay: i * 0.07 } });

const StudentDashboard = () => {
  const { user } = useAuth();
  const [myResults, setMyResults]       = useState([]);
  const [myAttendance, setMyAttendance] = useState([]);
  const [myFees, setMyFees]             = useState([]);
  const [exams, setExams]               = useState([]);
  const [loading, setLoading]           = useState(true);

  useEffect(() => {
    Promise.all([
      api.getAll('results'),
      api.getAll('attendance'),
      api.getAll('fees'),
      api.getAll('exams'),
    ]).then(([results, attendance, fees, examData]) => {
      setMyResults(results.filter(r => r.studentName === user?.name));
      setMyAttendance(attendance.filter(a => a.studentName === user?.name));
      setMyFees(fees.filter(f => f.studentName === user?.name));
      setExams(examData.filter(e => new Date(e.date) >= new Date()).slice(0, 3));
    }).finally(() => setLoading(false));
  }, [user]);

  const attendancePct = myAttendance.length
    ? Math.round((myAttendance.filter(a => a.status === 'Present').length / myAttendance.length) * 100) : 0;
  const avgScore = myResults.length
    ? Math.round(myResults.reduce((s, r) => s + r.percentage, 0) / myResults.length) : 0;
  const pendingFees = myFees.filter(f => f.status === 'Unpaid').reduce((s, f) => s + Number(f.amount), 0);
  const passed = myResults.filter(r => r.percentage >= 50).length;

  if (loading) return (
    <div className="flex items-center justify-center py-32">
      <div className="space-y-3 text-center">
        <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto" />
        <p className="text-sm text-slate-400">Loading your portal…</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 max-w-6xl mx-auto">

      {/* ── Welcome banner ─────────────────────── */}
      <motion.div {...card(0)}
        className="relative bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 rounded-2xl p-6 text-white overflow-hidden shadow-xl shadow-emerald-500/20"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/4 pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-emerald-100 text-sm mb-1">Welcome back 👋</p>
            <h2 className="text-2xl lg:text-3xl font-extrabold">{user?.name}</h2>
            <div className="flex flex-wrap items-center gap-3 mt-2">
              <span className="text-xs bg-white/20 px-3 py-1 rounded-full font-medium">{user?.course}</span>
              <span className="text-xs bg-white/20 px-3 py-1 rounded-full font-medium">{user?.year} Year</span>
              <span className="text-xs bg-white/20 px-3 py-1 rounded-full font-mono">{user?.id}</span>
            </div>
          </div>
          <div className="flex items-center gap-4 sm:text-right flex-shrink-0">
            <div className="text-center">
              <p className="text-3xl font-black">{attendancePct}%</p>
              <p className="text-xs text-emerald-100">Attendance</p>
            </div>
            <div className="w-px h-12 bg-white/20" />
            <div className="text-center">
              <p className="text-3xl font-black">{avgScore}%</p>
              <p className="text-xs text-emerald-100">Avg Score</p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Stat cards ─────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Academic Score',  value: `${avgScore}%`,          icon: <MdTrendingUp />,  color: 'bg-blue-500',    bg: 'bg-blue-50 dark:bg-blue-900/20',   link: '/student/results' },
          { label: 'Attendance',      value: `${attendancePct}%`,     icon: <MdCheckCircle />, color: attendancePct >= 75 ? 'bg-emerald-500' : 'bg-red-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20', link: '/student/attendance' },
          { label: 'Exams Cleared',   value: `${passed}/${myResults.length}`, icon: <MdSchool />, color: 'bg-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/20', link: '/student/results' },
          { label: 'Pending Fees',    value: `₹${pendingFees.toLocaleString()}`, icon: <MdAttachMoney />, color: pendingFees > 0 ? 'bg-red-500' : 'bg-green-500', bg: pendingFees > 0 ? 'bg-red-50 dark:bg-red-900/20' : 'bg-green-50 dark:bg-green-900/20', link: '/student/fees' },
        ].map((s, i) => (
          <motion.div key={i} {...card(i + 1)}>
            <Link to={s.link} className="card p-5 flex items-start gap-4 hover:shadow-md transition-all group cursor-pointer">
              <div className={`p-2.5 rounded-xl ${s.bg} flex-shrink-0 group-hover:scale-110 transition-transform`}>
                <span className={`text-xl ${s.color.replace('bg-', 'text-')}`}>{s.icon}</span>
              </div>
              <div className="min-w-0">
                <p className="text-xl font-black text-slate-800 dark:text-white truncate">{s.value}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{s.label}</p>
              </div>
              <MdArrowForward className="ml-auto text-slate-300 group-hover:text-emerald-500 group-hover:translate-x-1 transition-all flex-shrink-0 mt-1" />
            </Link>
          </motion.div>
        ))}
      </div>

      {/* ── Alerts ─────────────────────────────── */}
      <div className="space-y-2">
        {attendancePct < 75 && (
          <motion.div {...card(5)} className="flex items-center gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl">
            <MdWarning className="text-amber-500 text-xl flex-shrink-0" />
            <p className="text-sm text-amber-800 dark:text-amber-300">
              <strong>Low Attendance:</strong> Your attendance ({attendancePct}%) is below the required 75%. Please attend classes regularly.
            </p>
          </motion.div>
        )}
        {pendingFees > 0 && (
          <motion.div {...card(6)} className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl">
            <MdAttachMoney className="text-red-500 text-xl flex-shrink-0" />
            <p className="text-sm text-red-800 dark:text-red-300">
              <strong>Payment Due:</strong> You have ₹{pendingFees.toLocaleString()} in outstanding fees. <Link to="/student/fees" className="underline font-semibold">View details</Link>
            </p>
          </motion.div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Results */}
        <motion.div {...card(7)} className="lg:col-span-2 card p-5">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2"><MdSchool className="text-emerald-500" /> Recent Results</h3>
            <Link to="/student/results" className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline font-semibold">View all</Link>
          </div>
          {myResults.length === 0 ? (
            <div className="text-center py-10 text-slate-400">
              <MdSchool className="text-4xl mx-auto mb-2 opacity-30" />
              <p className="text-sm">No results published yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {myResults.slice(-5).reverse().map((r, i) => {
                const pass = r.percentage >= 50;
                const gradeColors = { 'A+': 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30', A: 'text-green-600 bg-green-50 dark:bg-green-900/30', B: 'text-blue-600 bg-blue-50 dark:bg-blue-900/30', C: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/30', D: 'text-orange-600 bg-orange-50 dark:bg-orange-900/30', F: 'text-red-600 bg-red-50 dark:bg-red-900/30' };
                return (
                  <div key={i} className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm flex-shrink-0 ${gradeColors[r.grade] || 'text-slate-500 bg-slate-100'}`}>{r.grade}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 dark:text-white truncate">{r.subject}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 max-w-[120px]">
                          <div className={`h-1.5 rounded-full ${pass ? 'bg-emerald-500' : 'bg-red-400'}`} style={{ width: `${r.percentage}%` }} />
                        </div>
                        <span className="text-xs text-slate-400">{r.marks}/{r.totalMarks}</span>
                      </div>
                    </div>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0 ${pass ? 'text-emerald-700 bg-emerald-100 dark:bg-emerald-900/30' : 'text-red-700 bg-red-100 dark:bg-red-900/30'}`}>
                      {pass ? 'Pass' : 'Fail'}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* Upcoming Exams */}
        <motion.div {...card(8)} className="card p-5">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-bold text-slate-800 dark:text-white flex items-center gap-2"><MdCalendarToday className="text-emerald-500" /> Upcoming Exams</h3>
            <Link to="/student/exams" className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline font-semibold">View all</Link>
          </div>
          {exams.length === 0 ? (
            <div className="text-center py-10 text-slate-400">
              <MdCalendarToday className="text-4xl mx-auto mb-2 opacity-30" />
              <p className="text-sm">No upcoming exams</p>
            </div>
          ) : (
            <div className="space-y-3">
              {exams.map((ex, i) => (
                <div key={i} className="p-3 rounded-xl border border-slate-100 dark:border-slate-700 hover:border-emerald-200 dark:hover:border-emerald-800 transition-colors">
                  <p className="text-sm font-bold text-slate-800 dark:text-white">{ex.subject}</p>
                  <p className="text-xs text-slate-500 mt-1 flex items-center gap-1"><MdCalendarToday className="text-emerald-500" />{ex.date} · {ex.time}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-slate-400">{ex.hall} · {ex.duration}</span>
                    <span className="text-xs font-semibold text-emerald-600">{ex.totalMarks} marks</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Attendance Ring */}
      <motion.div {...card(9)} className="card p-5">
        <h3 className="font-bold text-slate-800 dark:text-white mb-5 flex items-center gap-2"><MdCheckCircle className="text-emerald-500" /> Attendance Breakdown</h3>
        <div className="flex flex-col sm:flex-row items-center gap-8">
          {/* Ring */}
          <div className="relative w-36 h-36 flex-shrink-0">
            <svg className="w-36 h-36 -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="15.5" fill="none" stroke="currentColor" className="text-slate-200 dark:text-slate-700" strokeWidth="3" />
              <circle cx="18" cy="18" r="15.5" fill="none" stroke="currentColor"
                className={attendancePct >= 75 ? 'text-emerald-500' : 'text-red-400'}
                strokeWidth="3" strokeDasharray={`${attendancePct} 100`} strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-2xl font-black ${attendancePct >= 75 ? 'text-emerald-600' : 'text-red-500'}`}>{attendancePct}%</span>
              <span className="text-xs text-slate-400">Attendance</span>
            </div>
          </div>
          {/* Breakdown */}
          <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[
              { label: 'Total Classes', value: myAttendance.length, color: 'text-slate-800 dark:text-white' },
              { label: 'Present', value: myAttendance.filter(a => a.status === 'Present').length, color: 'text-emerald-600' },
              { label: 'Absent', value: myAttendance.filter(a => a.status === 'Absent').length, color: 'text-red-500' },
            ].map((item, i) => (
              <div key={i} className="text-center p-4 rounded-xl bg-slate-50 dark:bg-slate-700/40">
                <p className={`text-2xl font-black ${item.color}`}>{item.value}</p>
                <p className="text-xs text-slate-500 mt-1">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default StudentDashboard;
