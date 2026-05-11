import React, { useState, useEffect } from 'react';
import { MdCheckCircle, MdCancel } from 'react-icons/md';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

const gradeColor = (g) => ({ 'A+': 'text-emerald-600', A: 'text-green-600', B: 'text-blue-600', C: 'text-yellow-600', D: 'text-orange-600', F: 'text-red-600' }[g] || 'text-slate-500');

const StudentResults = () => {
  const { user } = useAuth();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAll('results')
      .then(data => setResults(data.filter(r => r.studentName === user?.name)))
      .finally(() => setLoading(false));
  }, [user]);

  const avg = results.length ? Math.round(results.reduce((s, r) => s + r.percentage, 0) / results.length) : 0;
  const passed = results.filter(r => r.percentage >= 50).length;

  if (loading) return <div className="flex justify-center py-24"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600" /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">My Results</h2>
        <p className="text-sm text-slate-500 mt-1">{results.length} published results</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="card p-5 text-center"><p className="text-3xl font-bold text-slate-800 dark:text-white">{results.length}</p><p className="text-xs text-slate-500 mt-1">Exams</p></div>
        <div className="card p-5 text-center"><p className="text-3xl font-bold text-emerald-600">{avg}%</p><p className="text-xs text-slate-500 mt-1">Average</p></div>
        <div className="card p-5 text-center"><p className="text-3xl font-bold text-blue-600">{passed}/{results.length}</p><p className="text-xs text-slate-500 mt-1">Passed</p></div>
      </div>

      {results.length === 0 ? (
        <div className="card p-12 text-center text-slate-400">No results published yet.</div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
              <tr>
                {['Subject', 'Marks', 'Percentage', 'Grade', 'Status'].map(h => (
                  <th key={h} className="px-5 py-3.5 text-left text-xs font-bold uppercase text-slate-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
              {results.map((r, i) => {
                const pass = r.percentage >= 50;
                return (
                  <tr key={i} className="bg-white dark:bg-slate-800/40 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                    <td className="px-5 py-3.5 font-medium text-slate-800 dark:text-white">{r.subject}</td>
                    <td className="px-5 py-3.5 text-slate-600 dark:text-slate-300">{r.marks} <span className="text-slate-400 text-xs">/ {r.totalMarks}</span></td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-slate-200 dark:bg-slate-700 rounded-full h-1.5">
                          <div className={`h-1.5 rounded-full ${pass ? 'bg-emerald-500' : 'bg-red-400'}`} style={{ width: `${r.percentage}%` }} />
                        </div>
                        <span className="text-sm">{r.percentage}%</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xl font-bold ${gradeColor(r.grade)}`}>{r.grade}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center gap-1 text-xs font-semibold ${pass ? 'text-emerald-600' : 'text-red-500'}`}>
                        {pass ? <MdCheckCircle /> : <MdCancel />} {pass ? 'Pass' : 'Fail'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StudentResults;
