import React, { useState, useEffect } from 'react';
import { MdCheckCircle, MdCancel } from 'react-icons/md';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

const StudentAttendance = () => {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterSubject, setFilterSubject] = useState('All');

  useEffect(() => {
    api.getAll('attendance')
      .then(data => setRecords(data.filter(r => r.studentName === user?.name)))
      .finally(() => setLoading(false));
  }, [user]);

  const subjects = ['All', ...new Set(records.map(r => r.subject))];
  const filtered = filterSubject === 'All' ? records : records.filter(r => r.subject === filterSubject);
  const presentCount = filtered.filter(r => r.status === 'Present').length;
  const pct = filtered.length ? Math.round((presentCount / filtered.length) * 100) : 0;

  if (loading) return <div className="flex justify-center py-24"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600" /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">My Attendance</h2>
        <p className="text-sm text-slate-500 mt-1">{records.length} total records</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card p-5 text-center">
          <p className="text-3xl font-bold text-slate-800 dark:text-white">{filtered.length}</p>
          <p className="text-xs text-slate-500 mt-1">Total Classes</p>
        </div>
        <div className="card p-5 text-center">
          <p className="text-3xl font-bold text-emerald-600">{presentCount}</p>
          <p className="text-xs text-slate-500 mt-1">Present</p>
        </div>
        <div className="card p-5 text-center">
          <p className={`text-3xl font-bold ${pct < 75 ? 'text-red-500' : 'text-emerald-600'}`}>{pct}%</p>
          <p className="text-xs text-slate-500 mt-1">Percentage</p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex flex-wrap gap-2">
        {subjects.map(s => (
          <button key={s} onClick={() => setFilterSubject(s)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${filterSubject === s ? 'bg-emerald-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'}`}>
            {s}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
            <tr>
              {['Date', 'Subject', 'Status'].map(h => (
                <th key={h} className="px-5 py-3.5 text-left text-xs font-bold uppercase text-slate-500">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
            {filtered.length === 0 ? (
              <tr><td colSpan={3} className="px-5 py-10 text-center text-slate-400">No records found.</td></tr>
            ) : filtered.map((r, i) => (
              <tr key={i} className="bg-white dark:bg-slate-800/40 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                <td className="px-5 py-3.5 text-slate-600 dark:text-slate-300">{r.date}</td>
                <td className="px-5 py-3.5 font-medium text-slate-800 dark:text-white">{r.subject}</td>
                <td className="px-5 py-3.5">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${r.status === 'Present' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                    {r.status === 'Present' ? <MdCheckCircle /> : <MdCancel />} {r.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentAttendance;
