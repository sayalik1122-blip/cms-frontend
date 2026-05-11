import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { MdAdd, MdCheckCircle, MdCancel, MdCalendarToday } from 'react-icons/md';
import Table from '../../components/Table';
import Modal from '../../components/Modal';
import { api } from '../../services/api';

const emptyForm = { studentName: '', subject: '', date: new Date().toISOString().split('T')[0], status: 'Present' };

const Attendance = () => {
  const [records, setRecords] = useState([]);
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [filterDate, setFilterDate] = useState('');
  const [filterSubject, setFilterSubject] = useState('All');

  useEffect(() => { loadAll(); }, []);

  const loadAll = async () => {
    try {
      setLoading(true);
      const [attData, stuData, subData] = await Promise.all([
        api.getAll('attendance'),
        api.getAll('students'),
        api.getAll('subjects'),
      ]);
      setRecords(attData);
      setStudents(stuData);
      setSubjects(subData);
    } catch {
      toast.error('Failed to load attendance data.');
    } finally { setLoading(false); }
  };

  const toggleStatus = async (record) => {
    const newStatus = record.status === 'Present' ? 'Absent' : 'Present';
    try {
      const updated = await api.patch('attendance', record.id, { status: newStatus });
      setRecords(prev => prev.map(r => r.id === record.id ? { ...r, status: updated.status } : r));
      toast.info(`${record.studentName} marked as ${newStatus}`);
    } catch { toast.error('Failed to update attendance.'); }
  };

  const openModal = (record = null) => {
    setEditing(record);
    setForm(record ? { ...record } : { ...emptyForm });
    setModalOpen(true);
  };

  const closeModal = () => { setModalOpen(false); setEditing(null); setForm(emptyForm); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        const updated = await api.update('attendance', editing.id, form);
        setRecords(prev => prev.map(r => r.id === editing.id ? updated : r));
        toast.success('Attendance record updated.');
      } else {
        const created = await api.create('attendance', { ...form, id: Date.now() });
        setRecords(prev => [...prev, created]);
        toast.success('Attendance marked.');
      }
      closeModal();
    } catch { toast.error('Failed to save attendance.'); }
  };

  const handleDelete = async (record) => {
    if (!window.confirm('Delete this attendance record?')) return;
    try {
      await api.remove('attendance', record.id);
      setRecords(prev => prev.filter(r => r.id !== record.id));
      toast.success('Record deleted.');
    } catch { toast.error('Failed to delete.'); }
  };

  const allSubjects = ['All', ...new Set(records.map(r => r.subject))];
  const filtered = records
    .filter(r => filterSubject === 'All' || r.subject === filterSubject)
    .filter(r => !filterDate || r.date === filterDate);

  const presentCount = filtered.filter(r => r.status === 'Present').length;
  const absentCount = filtered.filter(r => r.status === 'Absent').length;
  const pct = filtered.length > 0 ? Math.round((presentCount / filtered.length) * 100) : 0;

  const columns = [
    { header: 'Student', accessor: 'studentName' },
    { header: 'Subject', accessor: 'subject' },
    { header: 'Date', accessor: 'date' },
    { header: 'Status', accessor: 'status', render: (row) => (
      <button onClick={() => toggleStatus(row)}
        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all hover:scale-105 cursor-pointer ${
          row.status === 'Present'
            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-200'
            : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 hover:bg-red-200'
        }`}>
        {row.status === 'Present' ? <MdCheckCircle /> : <MdCancel />}
        {row.status}
      </button>
    )},
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Attendance Management</h2>
          <p className="text-sm text-slate-500 mt-1">Click status badge to toggle Present/Absent</p>
        </div>
        <button onClick={() => openModal()} className="btn-primary flex items-center gap-2 whitespace-nowrap">
          <MdAdd className="text-xl" /> Mark Attendance
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card p-5 text-center">
          <p className="text-3xl font-bold text-slate-800 dark:text-white">{filtered.length}</p>
          <p className="text-xs text-slate-500 mt-1">Total Records</p>
        </div>
        <div className="card p-5 text-center">
          <p className="text-3xl font-bold text-green-600">{presentCount}</p>
          <p className="text-xs text-slate-500 mt-1">Present</p>
        </div>
        <div className="card p-5 flex flex-col items-center justify-center">
          <div className="relative w-16 h-16">
            <svg className="w-16 h-16 -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="15.5" fill="none" stroke="#e2e8f0" strokeWidth="3" />
              <circle cx="18" cy="18" r="15.5" fill="none" stroke="#f97316" strokeWidth="3"
                strokeDasharray={`${pct} 100`} strokeLinecap="round" />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-slate-700 dark:text-white">{pct}%</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">Attendance Rate</p>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-4 space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex items-center gap-2">
            <MdCalendarToday className="text-slate-400" />
            <input type="date" className="input-field" value={filterDate} onChange={e => setFilterDate(e.target.value)} />
            {filterDate && <button onClick={() => setFilterDate('')} className="text-xs text-slate-400 hover:text-slate-600">Clear</button>}
          </div>
          <select className="input-field" value={filterSubject} onChange={e => setFilterSubject(e.target.value)}>
            {allSubjects.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <Table columns={columns} data={filtered} loading={loading} onEdit={openModal} onDelete={handleDelete} />
      </div>

      <Modal isOpen={modalOpen} onClose={closeModal} title={editing ? 'Edit Attendance' : 'Mark Attendance'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Student *</label>
            <select required className="input-field" value={form.studentName} onChange={e => setForm(f => ({ ...f, studentName: e.target.value }))}>
              <option value="">Select Student</option>
              {students.map(s => <option key={s.id} value={s.name}>{s.name} ({s.course})</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Subject *</label>
            <select required className="input-field" value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}>
              <option value="">Select Subject</option>
              {subjects.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Date *</label>
              <input type="date" required className="input-field" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Status</label>
              <select className="input-field" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2 border-t border-slate-100 dark:border-slate-700">
            <button type="button" onClick={closeModal} className="px-5 py-2 text-sm font-medium rounded-xl border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700">Cancel</button>
            <button type="submit" className="btn-primary px-6 py-2">{editing ? 'Update' : 'Save'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Attendance;
