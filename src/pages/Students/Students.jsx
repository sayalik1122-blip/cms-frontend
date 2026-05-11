import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { MdAdd, MdPeople, MdPersonOff } from 'react-icons/md';
import Table from '../../components/Table';
import Modal from '../../components/Modal';
import { api, generateId } from '../../services/api';

const COURSES = ['Computer Science', 'Mechanical Eng.', 'Civil Eng.', 'Electrical Eng.', 'Information Tech.', 'Electronics Eng.'];
const YEARS = ['1st', '2nd', '3rd', '4th'];

const emptyForm = { name: '', email: '', password: '', course: '', year: '1st', phone: '', status: 'Active', address: '' };

const Students = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [filterStatus, setFilterStatus] = useState('All');

  useEffect(() => { loadStudents(); }, []);

  const loadStudents = async () => {
    try {
      setLoading(true);
      const data = await api.getAll('students');
      setStudents(data);
    } catch {
      toast.error('Failed to load students. Is the JSON server running?');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (student = null) => {
    setEditing(student);
    setForm(student ? { ...student } : { ...emptyForm });
    setModalOpen(true);
  };

  const closeModal = () => { setModalOpen(false); setEditing(null); setForm(emptyForm); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        const updated = await api.update('students', editing.id, form);
        setStudents(prev => prev.map(s => s.id === editing.id ? updated : s));
        toast.success(`${form.name} updated successfully!`);
      } else {
        const created = await api.create('students', form);
        setStudents(prev => [...prev, created]);
        toast.success(`${form.name} enrolled successfully!`);
      }
      closeModal();
    } catch {
      toast.error('Failed to save student.');
    }
  };

  const handleDelete = async (student) => {
    if (!window.confirm(`Delete student "${student.name}"? This cannot be undone.`)) return;
    try {
      await api.remove('students', student.id);
      setStudents(prev => prev.filter(s => s.id !== student.id));
      toast.success('Student removed successfully.');
    } catch {
      toast.error('Failed to delete student.');
    }
  };

  const filtered = filterStatus === 'All' ? students : students.filter(s => s.status === filterStatus);
  const activeCount = students.filter(s => s.status === 'Active').length;
  const inactiveCount = students.filter(s => s.status === 'Inactive').length;

  const columns = [
    { header: 'ID', accessor: 'displayId' },
    { header: 'Name', accessor: 'name', render: (row) => (
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 font-bold text-xs flex-shrink-0">
          {row.name?.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="font-medium text-slate-800 dark:text-white text-sm">{row.name}</p>
          <p className="text-xs text-slate-400">{row.email}</p>
        </div>
      </div>
    )},
    { header: 'Course', accessor: 'course' },
    { header: 'Year', accessor: 'year', render: (row) => <span className="text-sm">{row.year} Year</span> },
    { header: 'Phone', accessor: 'phone' },
    { header: 'Status', accessor: 'status', render: (row) => (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
        row.status === 'Active'
          ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
          : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
      }`}>
        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${row.status === 'Active' ? 'bg-green-500' : 'bg-red-500'}`}></span>
        {row.status}
      </span>
    )},
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Student Management</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage all enrolled students</p>
        </div>
        <button onClick={() => openModal()} className="btn-primary flex items-center gap-2 whitespace-nowrap">
          <MdAdd className="text-xl" /> Add Student
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Total Students', value: students.length, icon: <MdPeople />, color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' },
          { label: 'Active', value: activeCount, icon: <MdPeople />, color: 'text-green-600 bg-green-50 dark:bg-green-900/20' },
          { label: 'Inactive', value: inactiveCount, icon: <MdPersonOff />, color: 'text-red-600 bg-red-50 dark:bg-red-900/20' },
        ].map((stat, i) => (
          <div key={i} className="card p-5 flex items-center gap-4">
            <div className={`p-3 rounded-xl text-xl ${stat.color}`}>{stat.icon}</div>
            <div>
              <p className="text-2xl font-bold text-slate-800 dark:text-white">{stat.value}</p>
              <p className="text-xs text-slate-500">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="card p-4">
        <div className="flex flex-wrap gap-2 mb-5">
          {['All', 'Active', 'Inactive'].map(f => (
            <button key={f} onClick={() => setFilterStatus(f)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                filterStatus === f ? 'bg-primary-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}>
              {f}
            </button>
          ))}
        </div>
        <Table
          columns={columns}
          data={filtered}
          loading={loading}
          onEdit={openModal}
          onDelete={handleDelete}
        />
      </div>

      {/* Modal */}
      <Modal isOpen={modalOpen} onClose={closeModal} title={editing ? 'Edit Student' : 'Enroll New Student'} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Full Name *</label>
              <input type="text" required className="input-field" placeholder="e.g. Aarav Sharma"
                value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email Address *</label>
              <input type="email" required className="input-field" placeholder="student@college.edu"
                value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Phone Number</label>
              <input type="tel" className="input-field" placeholder="9876543210"
                value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Course *</label>
              <select required className="input-field" value={form.course} onChange={e => setForm(f => ({ ...f, course: e.target.value }))}>
                <option value="">Select Course</option>
                {COURSES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Year *</label>
              <select required className="input-field" value={form.year} onChange={e => setForm(f => ({ ...f, year: e.target.value }))}>
                {YEARS.map(y => <option key={y} value={y}>{y} Year</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Status</label>
              <select className="input-field" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Login Password *</label>
              <input type="text" required={!editing} className="input-field" placeholder={editing ? "Leave blank to keep same" : "e.g. student123"}
                value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Address</label>
            <textarea className="input-field resize-none" rows={2} placeholder="Residential address"
              value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} />
          </div>
          <div className="flex justify-end gap-3 pt-2 border-t border-slate-100 dark:border-slate-700">
            <button type="button" onClick={closeModal} className="px-5 py-2 text-sm font-medium rounded-xl border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
              Cancel
            </button>
            <button type="submit" className="btn-primary px-6 py-2">
              {editing ? 'Save Changes' : 'Enroll Student'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Students;
