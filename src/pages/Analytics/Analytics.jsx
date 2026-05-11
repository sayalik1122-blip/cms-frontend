import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import { api } from '../../services/api';

const COLORS = ['#f97316', '#3b82f6', '#10b981', '#8b5cf6', '#f59e0b', '#ec4899'];

const Analytics = () => {
  const [students, setStudents] = useState([]);
  const [fees, setFees] = useState([]);
  const [results, setResults] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadAll(); }, []);

  const loadAll = async () => {
    try {
      setLoading(true);
      const [stuData, feeData, resData, attData, chartD] = await Promise.all([
        api.getAll('students'),
        api.getAll('fees'),
        api.getAll('results'),
        api.getAll('attendance'),
        api.getAll('chartData'),
      ]);
      setStudents(stuData);
      setFees(feeData);
      setResults(resData);
      setAttendance(attData);
      setChartData(chartD);
    } catch {
      toast.error('Failed to load analytics data.');
    } finally { setLoading(false); }
  };

  // Computed stats
  const totalRevenue = fees.filter(f => f.status === 'Paid').reduce((s, f) => s + Number(f.amount), 0);
  const pendingRevenue = fees.filter(f => f.status === 'Unpaid').reduce((s, f) => s + Number(f.amount), 0);
  const passRate = results.length > 0 ? Math.round((results.filter(r => Number(r.marks) / Number(r.totalMarks || 100) >= 0.5).length / results.length) * 100) : 0;
  const avgAttendance = attendance.length > 0 ? Math.round((attendance.filter(a => a.status === 'Present').length / attendance.length) * 100) : 0;

  // Course distribution
  const courseDistribution = Object.entries(
    students.reduce((acc, s) => { acc[s.course] = (acc[s.course] || 0) + 1; return acc; }, {})
  ).map(([name, value]) => ({ name, value }));

  // Performance by grade
  const gradeDistrib = results.reduce((acc, r) => { acc[r.grade] = (acc[r.grade] || 0) + 1; return acc; }, {});
  const gradeData = Object.entries(gradeDistrib).map(([grade, count]) => ({ grade, count }));

  const tooltipStyle = { borderRadius: '10px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontSize: '12px' };

  if (loading) {
    return <div className="flex justify-center items-center py-24"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div></div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Analytics & Reports</h2>
        <p className="text-sm text-slate-500 mt-1">Live insights from your institution data</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Students', value: students.length, sub: `${students.filter(s => s.status === 'Active').length} active`, color: 'from-blue-500 to-blue-600' },
          { label: 'Revenue Collected', value: `₹${(totalRevenue / 1000).toFixed(0)}K`, sub: `₹${(pendingRevenue / 1000).toFixed(0)}K pending`, color: 'from-green-500 to-green-600' },
          { label: 'Pass Rate', value: `${passRate}%`, sub: `${results.length} results`, color: 'from-primary-500 to-primary-600' },
          { label: 'Avg Attendance', value: `${avgAttendance}%`, sub: `${attendance.length} records`, color: 'from-purple-500 to-purple-600' },
        ].map((kpi, i) => (
          <div key={i} className={`rounded-2xl p-5 bg-gradient-to-br ${kpi.color} text-white shadow-lg`}>
            <p className="text-sm opacity-80 mb-1">{kpi.label}</p>
            <p className="text-3xl font-bold">{kpi.value}</p>
            <p className="text-xs opacity-70 mt-1">{kpi.sub}</p>
          </div>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-base font-bold text-slate-800 dark:text-white mb-5">Student Enrollment Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData?.studentGrowth || []}>
                <defs>
                  <linearGradient id="colorStu" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip contentStyle={tooltipStyle} />
                <Area type="monotone" dataKey="students" stroke="#f97316" strokeWidth={2.5} fill="url(#colorStu)" dot={{ r: 4, fill: '#f97316' }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-base font-bold text-slate-800 dark:text-white mb-5">Department Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={courseDistribution.length > 0 ? courseDistribution : (chartData?.departmentDistribution || [])} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={3} dataKey="value">
                  {(courseDistribution.length > 0 ? courseDistribution : (chartData?.departmentDistribution || [])).map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
                <Legend iconType="circle" iconSize={8} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-base font-bold text-slate-800 dark:text-white mb-5">Grade Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={gradeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="grade" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip contentStyle={tooltipStyle} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {gradeData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-base font-bold text-slate-800 dark:text-white mb-5">Fee Collection Overview</h3>
          <div className="h-64 flex flex-col justify-center gap-4 px-4">
            <div>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-slate-600 dark:text-slate-400">Collected</span>
                <span className="font-bold text-green-600">₹{totalRevenue.toLocaleString()}</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3">
                <div className="bg-green-500 h-3 rounded-full transition-all" style={{ width: `${totalRevenue / (totalRevenue + pendingRevenue) * 100 || 0}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-slate-600 dark:text-slate-400">Pending</span>
                <span className="font-bold text-red-500">₹{pendingRevenue.toLocaleString()}</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3">
                <div className="bg-red-400 h-3 rounded-full transition-all" style={{ width: `${pendingRevenue / (totalRevenue + pendingRevenue) * 100 || 0}%` }}></div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-xl">
                <p className="text-xl font-bold text-green-600">{fees.filter(f => f.status === 'Paid').length}</p>
                <p className="text-xs text-slate-500 mt-0.5">Paid Invoices</p>
              </div>
              <div className="text-center p-4 bg-red-50 dark:bg-red-900/20 rounded-xl">
                <p className="text-xl font-bold text-red-600">{fees.filter(f => f.status === 'Unpaid').length}</p>
                <p className="text-xs text-slate-500 mt-0.5">Pending Invoices</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
