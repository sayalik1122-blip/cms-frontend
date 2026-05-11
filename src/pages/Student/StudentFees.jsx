import React, { useState, useEffect } from 'react';
import { MdTrendingUp, MdWarning, MdDownload } from 'react-icons/md';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';

const StudentFees = () => {
  const { user } = useAuth();
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAll('fees')
      .then(data => setFees(data.filter(f => f.studentName === user?.name)))
      .finally(() => setLoading(false));
  }, [user]);

  const paid = fees.filter(f => f.status === 'Paid');
  const unpaid = fees.filter(f => f.status === 'Unpaid');
  const totalPaid = paid.reduce((s, f) => s + Number(f.amount), 0);
  const totalDue = unpaid.reduce((s, f) => s + Number(f.amount), 0);

  if (loading) return <div className="flex justify-center py-24"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600" /></div>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">My Fees</h2>
        <p className="text-sm text-slate-500 mt-1">{fees.length} fee records</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card p-5 border-l-4 border-emerald-500">
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Total Paid</p>
          <p className="text-2xl font-bold text-slate-800 dark:text-white">₹{totalPaid.toLocaleString()}</p>
          <div className="flex items-center gap-1 mt-1 text-emerald-600 text-xs"><MdTrendingUp />{paid.length} transactions</div>
        </div>
        <div className="card p-5 border-l-4 border-red-500">
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Outstanding Dues</p>
          <p className="text-2xl font-bold text-slate-800 dark:text-white">₹{totalDue.toLocaleString()}</p>
          <div className="flex items-center gap-1 mt-1 text-red-600 text-xs"><MdWarning />{unpaid.length} pending</div>
        </div>
        <div className="card p-5 border-l-4 border-blue-500">
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Total Fees</p>
          <p className="text-2xl font-bold text-slate-800 dark:text-white">₹{(totalPaid + totalDue).toLocaleString()}</p>
          <p className="text-xs text-slate-400 mt-1">{fees.length} total records</p>
        </div>
      </div>

      {totalDue > 0 && (
        <div className="flex items-start gap-3 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
          <MdWarning className="text-amber-500 text-xl flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-800 dark:text-amber-400">Payment Due</p>
            <p className="text-xs text-amber-700 dark:text-amber-500 mt-0.5">You have ₹{totalDue.toLocaleString()} in outstanding fees. Please contact the accounts office.</p>
          </div>
        </div>
      )}

      <div className="card overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
            <tr>
              {['Transaction ID', 'Fee Type', 'Amount', 'Due Date', 'Status', ''].map(h => (
                <th key={h} className="px-5 py-3.5 text-left text-xs font-bold uppercase text-slate-500">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
            {fees.length === 0 ? (
              <tr><td colSpan={6} className="px-5 py-10 text-center text-slate-400">No fee records found.</td></tr>
            ) : fees.map((f, i) => (
              <tr key={i} className="bg-white dark:bg-slate-800/40 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                <td className="px-5 py-3.5 font-mono text-xs text-slate-500">{f.transactionId}</td>
                <td className="px-5 py-3.5 text-slate-700 dark:text-slate-300">{f.feeType || 'Tuition Fee'}</td>
                <td className="px-5 py-3.5 font-bold text-slate-800 dark:text-white">₹{Number(f.amount).toLocaleString()}</td>
                <td className="px-5 py-3.5 text-slate-500">{f.dueDate}</td>
                <td className="px-5 py-3.5">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${f.status === 'Paid' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${f.status === 'Paid' ? 'bg-emerald-500' : 'bg-red-500'}`} /> {f.status}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  {f.status === 'Paid' && (
                    <button className="p-1.5 text-slate-400 hover:text-emerald-600 transition-colors" title="Download Receipt"><MdDownload /></button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StudentFees;
