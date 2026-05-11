import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { api } from '../../services/api';

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
const DAY_LABELS = { monday: 'Monday', tuesday: 'Tuesday', wednesday: 'Wednesday', thursday: 'Thursday', friday: 'Friday' };

const cellColor = (subject) => {
  if (!subject || subject === '—') return 'bg-slate-100 dark:bg-slate-700/50 text-slate-400 italic';
  if (subject === 'Break' || subject.includes('Self')) return 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400';
  if (subject.startsWith('Lab')) return 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400';
  const colors = ['bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300', 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300', 'bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-300', 'bg-cyan-50 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-300'];
  return colors[subject.charCodeAt(0) % colors.length];
};

const today = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();

const StudentTimetable = () => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAll('timetable')
      .then(data => setSlots(data.sort((a, b) => a.time.localeCompare(b.time))))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-24"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600" /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Weekly Timetable</h2>
        <p className="text-sm text-slate-500 mt-1">Your class schedule for the week</p>
      </div>

      {/* Today's highlight */}
      {DAYS.includes(today) && (
        <div className="card p-5">
          <h3 className="text-sm font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" /> Today — {DAY_LABELS[today]}
          </h3>
          <div className="flex flex-wrap gap-2">
            {slots.map((slot, i) => (
              slot[today] && slot[today] !== '—' && (
                <div key={i} className={`px-3 py-2 rounded-xl text-sm font-medium ${cellColor(slot[today])}`}>
                  <p className="text-xs opacity-70 mb-0.5">{slot.time}</p>
                  <p>{slot[today]}</p>
                </div>
              )
            ))}
          </div>
        </div>
      )}

      {/* Full table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="px-4 py-3.5 text-left text-xs font-bold uppercase text-slate-500">Time</th>
                {DAYS.map(day => (
                  <th key={day} className={`px-4 py-3.5 text-left text-xs font-bold uppercase ${day === today ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500'}`}>
                    {day === today ? `✦ ${DAY_LABELS[day]}` : DAY_LABELS[day]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
              {slots.map((slot, idx) => (
                <motion.tr key={slot.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: idx * 0.04 }}
                  className="bg-white dark:bg-slate-800/40 hover:bg-slate-50 dark:hover:bg-slate-700/20 transition-colors">
                  <td className="px-4 py-3.5 font-bold text-emerald-600 dark:text-emerald-400 whitespace-nowrap">{slot.time}</td>
                  {DAYS.map(day => (
                    <td key={day} className={`px-4 py-3.5 ${day === today ? 'bg-emerald-50/30 dark:bg-emerald-900/10' : ''}`}>
                      <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-medium ${cellColor(slot[day])}`}>
                        {slot[day] || '—'}
                      </span>
                    </td>
                  ))}
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default StudentTimetable;
