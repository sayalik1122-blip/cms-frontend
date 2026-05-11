import React, { useState, useEffect } from 'react';
import { MdPeople, MdPerson, MdBook, MdAttachMoney } from 'react-icons/md';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { api } from '../../services/api';

const Dashboard = () => {
  const [data, setData] = useState({
    totalStudents: 0,
    totalFaculty: 0,
    totalSubjects: 0,
    totalRevenue: 0,
    recentActivities: [],
    chartData: {
      studentGrowth: [],
      departmentDistribution: []
    }
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [students, faculty, subjects, fees] = await Promise.all([
        api.getAll('students'),
        api.getAll('faculty'),
        api.getAll('subjects'),
        api.getAll('fees').catch(() => []) // Handle potential 404/empty
      ]);

      // Temporary mock for activities and charts until implemented in Spring Boot
      const recentActivities = [
        { id: 1, action: "System initialized", time: "Just now" }
      ];
      const chartData = {
        studentGrowth: [
          { name: 'Jan', students: 10 },
          { name: 'Feb', students: 20 },
          { name: 'Mar', students: 45 }
        ],
        departmentDistribution: [
          { name: 'CS', value: 400 },
          { name: 'Mechanical', value: 300 }
        ]
      };

      const totalRevenue = fees
        .filter(f => f.status === 'Paid')
        .reduce((acc, curr) => acc + Number(curr.amount), 0);

      setData({
        totalStudents: students.length,
        totalFaculty: faculty.length,
        totalSubjects: subjects.length,
        totalRevenue: totalRevenue,
        recentActivities,
        chartData
      });
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  const { totalStudents, totalFaculty, totalSubjects, totalRevenue, recentActivities, chartData } = data;

  const cards = [
    { title: "Total Students", value: totalStudents, icon: <MdPeople className="text-blue-500" />, bg: "bg-blue-100 dark:bg-blue-900/30" },
    { title: "Total Faculty", value: totalFaculty, icon: <MdPerson className="text-green-500" />, bg: "bg-green-100 dark:bg-green-900/30" },
    { title: "Total Subjects", value: totalSubjects, icon: <MdBook className="text-purple-500" />, bg: "bg-purple-100 dark:bg-purple-900/30" },
    { title: "Total Revenue", value: `₹${totalRevenue.toLocaleString()}`, icon: <MdAttachMoney className="text-amber-500" />, bg: "bg-amber-100 dark:bg-amber-900/30" }
  ];

  const COLORS = ['#3b82f6', '#10b981', '#8b5cf6', '#f59e0b'];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Dashboard Overview</h2>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <div key={index} className="card p-6 flex items-center space-x-4 hover:shadow-md transition-shadow">
            <div className={`p-4 rounded-full text-2xl ${card.bg}`}>
              {card.icon}
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{card.title}</p>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-white">{card.value}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Student Enrollment Growth</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData?.studentGrowth || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Line type="monotone" dataKey="students" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Department Distribution</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData?.departmentDistribution || []}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {(chartData?.departmentDistribution || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-2 flex-wrap">
              {(chartData?.departmentDistribution || []).map((entry, index) => (
                <div key={index} className="flex items-center text-sm text-slate-600 dark:text-slate-300">
                  <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                  {entry.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Recent Activities</h3>
        <div className="space-y-4">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-4 last:border-0 last:pb-0">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 rounded-full bg-primary-500"></div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">{activity.action}</p>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
