import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { MdAdd, MdCheckCircle, MdCancel } from 'react-icons/md';
import Table from '../../components/Table';
import Modal from '../../components/Modal';
import { api } from '../../services/api';

const emptyForm = { studentName: '', subject: '', marks: '', totalMarks: '100' };

const gradeInfo = (marks, total = 100) => {
  const pct = (marks / total) * 100;
  if (pct >= 90) return { grade: 'A+', color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20' };
  if (pct >= 80) return { grade: 'A', color: 'text-green-600 bg-green-50 dark:bg-green-900/20' };
  if (pct >= 70) return { grade: 'B', color: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20' };
  if (pct >= 60) return { grade: 'C', color: 'text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20' };
  if (pct >= 50) return { grade: 'D', color: 'text-orange-600 bg-orange-50 dark:bg-orange-900/20' };
  return { grade: 'F', color: 'text-red-600 bg-red-50 dark:bg-red-900/20' };
};

const Results = () => {
  const [results, setResults] = useState([]);
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => { loadAll(); }, []);

  const loadAll = async () => {
    try {
      setLoading(true);
      const [resData, stuData, subData] = await Promise.all([
        api.getAll('results'), api.getAll('students'), api.getAll('subjects')
      ]);
      setResults(resData);
      setStudents(stuData);
      setSubjects(subData);
    } catch {
      toast.error('Failed to load results.');
    } finally { setLoading(false); }
  };

  const openModal = (result = null) => {
    setEditing(result);
    setForm(result ? { ...result } : { ...emptyForm });
    setModalOpen(true);
  };

  const closeModal = () => { setModalOpen(false); setEditing(null); setForm(emptyForm); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { grade } = gradeInfo(Number(form.marks), Number(form.totalMarks || 100));
    const payload = { ...form, grade, percentage: Math.round((form.marks / (form.totalMarks || 100)) * 100) };
    try {
      if (editing) {
        const updated = await api.update('results', editing.id, payload);
        setResults(prev => prev.map(r => r.id === editing.id ? updated : r));
        toast.success('Result updated!');
      } else {
        const created = await api.create('results', { ...payload, id: Date.now() });
        setResults(prev => [...prev, created]);
        toast.success('Result published!');
      }
      closeModal();
    } catch { toast.error('Failed to publish result.'); }
  };

  const handleDelete = async (result) => {
    if (!window.confirm(`Delete result for "${result.studentName}"?`)) return;
    try {
      await api.remove('results', result.id);
      setResults(prev => prev.filter(r => r.id !== result.id));
      toast.success('Result deleted.');
    } catch { toast.error('Failed to delete.'); }
  };

  const passCount = results.filter(r => Number(r.marks) / Number(r.totalMarks || 100) >= 0.5).length;
  const avgPct = results.length > 0 ? Math.round(results.reduce((s, r) => s + (Number(r.marks) / Number(r.totalMarks || 100)) * 100, 0) / results.length) : 0;

  const columns = [
    { header: 'Student', accessor: 'studentName' },
    { header: 'Subject', accessor: 'subject' },
    { header: 'Marks', accessor: 'marks', render: (row) => (
      <span className="font-bold">{row.marks} <span className="text-slate-400 font-normal text-xs">/ {row.totalMarks || 100}</span></span>
    )},
    { header: 'Percentage', accessor: 'percentage', render: (row) => {
      const pct = row.percentage || Math.round((row.marks / (row.totalMarks || 100)) * 100);
      return (
        <div className="flex items-center gap-2">
          <div className="w-16 bg-slate-200 dark:bg-slate-700 rounded-full h-1.5">
            <div className="bg-primary-500 h-1.5 rounded-full" style={{ width: `${pct}%` }}></div>
          </div>
          <span className="text-sm">{pct}%</span>
        </div>
      );
    }},
    { header: 'Grade', accessor: 'grade', render: (row) => {
      const { grade, color } = gradeInfo(row.marks, row.totalMarks || 100);
      return <span className={`inline-flex items-center justify-center w-9 h-9 rounded-xl text-sm font-bold ${color}`}>{grade}</span>;
    }},
    { header: 'Status', accessor: '_status', render: (row) => {
      const passed = (row.marks / (row.totalMarks || 100)) >= 0.5;
      return (
        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold ${passed ? 'text-green-600' : 'text-red-600'}`}>
          {passed ? <MdCheckCircle /> : <MdCancel />}
          {passed ? 'Passed' : 'Failed'}
        </span>
      );
    }},
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Academic Results</h2>
          <p className="text-sm text-slate-500 mt-1">{results.length} results published</p>
        </div>
        <button onClick={() => openModal()} className="btn-primary flex items-center gap-2 whitespace-nowrap">
          <MdAdd className="text-xl" /> Publish Result
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card p-5 text-center">
          <p className="text-3xl font-bold text-slate-800 dark:text-white">{results.length}</p>
          <p className="text-xs text-slate-500 mt-1">Total Results</p>
        </div>
        <div className="card p-5 text-center">
          <p className="text-3xl font-bold text-green-600">{passCount}</p>
          <p className="text-xs text-slate-500 mt-1">Passed</p>
        </div>
        <div className="card p-5 text-center">
          <p className="text-3xl font-bold text-primary-600">{avgPct}%</p>
          <p className="text-xs text-slate-500 mt-1">Avg Score</p>
        </div>
      </div>

      <div className="card p-4">
        <Table columns={columns} data={results} loading={loading} onEdit={openModal} onDelete={handleDelete} />
      </div>

      <Modal isOpen={modalOpen} onClose={closeModal} title={editing ? 'Edit Result' : 'Publish Result'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Student *</label>
            <select required className="input-field" value={form.studentName} onChange={e => setForm(f => ({ ...f, studentName: e.target.value }))}>
              <option value="">Select Student</option>
              {students.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
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
              <label className="block text-sm font-medium mb-1.5">Marks Obtained *</label>
              <input type="number" required min="0" className="input-field"
                value={form.marks} onChange={e => setForm(f => ({ ...f, marks: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Total Marks</label>
              <input type="number" className="input-field"
                value={form.totalMarks} onChange={e => setForm(f => ({ ...f, totalMarks: e.target.value }))} />
            </div>
          </div>
          {form.marks !== '' && (
            <div className="p-3 bg-slate-50 dark:bg-slate-900/30 rounded-xl text-sm">
              Grade preview: <strong>{gradeInfo(Number(form.marks), Number(form.totalMarks || 100)).grade}</strong> · {Math.round((form.marks / (form.totalMarks || 100)) * 100)}%
            </div>
          )}
          <div className="flex justify-end gap-3 pt-2 border-t border-slate-100 dark:border-slate-700">
            <button type="button" onClick={closeModal} className="px-5 py-2 text-sm font-medium rounded-xl border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700">Cancel</button>
            <button type="submit" className="btn-primary px-6 py-2">{editing ? 'Update' : 'Publish'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Results;
