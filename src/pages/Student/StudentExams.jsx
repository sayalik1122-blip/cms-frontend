import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MdEvent, MdAccessTime, MdLocationOn, MdAssignment, MdCheckCircle } from 'react-icons/md';
import { api } from '../../services/api';

const StudentExams = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('upcoming');

  useEffect(() => {
    api.getAll('exams').then(setExams).finally(() => setLoading(false));
  }, []);

  const now = new Date();
  const upcoming = exams.filter(e => new Date(e.date) >= now).sort((a, b) => new Date(a.date) - new Date(b.date));
  const past = exams.filter(e => new Date(e.date) < now).sort((a, b) => new Date(b.date) - new Date(a.date));
  const list = tab === 'upcoming' ? upcoming : past;

  const daysLeft = (dateStr) => {
    const d = Math.ceil((new Date(dateStr) - now) / (1000 * 60 * 60 * 24));
    if (d === 0) return 'Today';
    if (d === 1) return 'Tomorrow';
    return `${d} days left`;
  };

  if (loading) return (
    <div className="flex justify-center py-32">
      <div className="w-10 h-10 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Exam Schedule</h2>
        <p className="text-sm text-slate-500 mt-1">{upcoming.length} upcoming · {past.length} completed</p>
      </div>

      {/* Tab toggle */}
      <div className="inline-flex bg-slate-100 dark:bg-slate-800 rounded-xl p-1 gap-1">
        {[['upcoming', 'Upcoming', upcoming.length], ['past', 'Past', past.length]].map(([key, label, count]) => (
          <button key={key} onClick={() => setTab(key)}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all ${tab === key ? 'bg-white dark:bg-slate-700 text-emerald-700 dark:text-emerald-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-200'}`}>
            {label} <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${tab === key ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600' : 'bg-slate-200 dark:bg-slate-600 text-slate-500'}`}>{count}</span>
          </button>
        ))}
      </div>

      {/* Exam cards */}
      {list.length === 0 ? (
        <div className="card p-16 text-center text-slate-400">
          <MdAssignment className="text-5xl mx-auto mb-3 opacity-30" />
          <p className="text-sm">No {tab} exams found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {list.map((exam, idx) => {
            const isUpcoming = new Date(exam.date) >= now;
            const marked = exam.status === 'Marked';
            return (
              <motion.div key={exam.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.06 }}
                className={`card p-5 border-l-4 ${isUpcoming ? 'border-emerald-500' : marked ? 'border-blue-500' : 'border-slate-300 dark:border-slate-600'}`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full ${
                        isUpcoming ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                          : marked ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                          : 'bg-slate-100 text-slate-500 dark:bg-slate-700'
                      }`}>
                        {isUpcoming ? '⏳' : <MdCheckCircle />} {isUpcoming ? daysLeft(exam.date) : marked ? 'Results Out' : 'Completed'}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-white">{exam.subject}</h3>
                    <div className="flex flex-wrap gap-4 mt-3 text-sm text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1.5"><MdEvent className="text-emerald-500" />{exam.date}</span>
                      <span className="flex items-center gap-1.5"><MdAccessTime className="text-emerald-500" />{exam.time} · {exam.duration}</span>
                      <span className="flex items-center gap-1.5"><MdLocationOn className="text-emerald-500" />{exam.hall}</span>
                    </div>
                  </div>
                  <div className="flex-shrink-0 text-right sm:text-center p-4 bg-slate-50 dark:bg-slate-700/40 rounded-xl">
                    <p className="text-2xl font-black text-slate-800 dark:text-white">{exam.totalMarks}</p>
                    <p className="text-xs text-slate-400">Total Marks</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default StudentExams;
