import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { MdAdd } from 'react-icons/md';
import Table from '../../components/Table';
import Modal from '../../components/Modal';
import { api } from '../../services/api';

const SEMESTERS = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th'];
const emptyForm = { code: '', name: '', faculty: '', semester: '1st', credits: '3', department: '' };

const Subjects = () => {
  const [subjects, setSubjects] = useState([]);
  const [facultyList, setFacultyList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => { loadAll(); }, []);

  const loadAll = async () => {
    try {
      setLoading(true);
      const [subData, facData] = await Promise.all([api.getAll('subjects'), api.getAll('faculty')]);
      setSubjects(subData);
      setFacultyList(facData);
    } catch {
      toast.error('Failed to load subjects.');
    } finally { setLoading(false); }
  };

  const openModal = (subject = null) => {
    setEditing(subject);
    setForm(subject ? { ...subject } : { ...emptyForm });
    setModalOpen(true);
  };

  const closeModal = () => { setModalOpen(false); setEditing(null); setForm(emptyForm); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        const updated = await api.update('subjects', editing.id, form);
        setSubjects(prev => prev.map(s => s.id === editing.id ? updated : s));
        toast.success('Subject updated!');
      } else {
        const newId = `SUB${String(subjects.length + 1).padStart(3, '0')}`;
        const created = await api.create('subjects', { ...form, id: newId });
        setSubjects(prev => [...prev, created]);
        toast.success('Subject added!');
      }
      closeModal();
    } catch { toast.error('Failed to save subject.'); }
  };

  const handleDelete = async (subject) => {
    if (!window.confirm(`Delete subject "${subject.name}"?`)) return;
    try {
      await api.remove('subjects', subject.id);
      setSubjects(prev => prev.filter(s => s.id !== subject.id));
      toast.success('Subject deleted.');
    } catch { toast.error('Failed to delete.'); }
  };

  const columns = [
    { header: 'Code', accessor: 'code', render: (row) => <span className="font-mono font-bold text-primary-600 dark:text-primary-400">{row.code}</span> },
    { header: 'Subject Name', accessor: 'name' },
    { header: 'Faculty', accessor: 'faculty' },
    { header: 'Semester', accessor: 'semester', render: (row) => <span className="text-sm">{row.semester} Sem</span> },
    { header: 'Credits', accessor: 'credits', render: (row) => (
      <span className="inline-block px-2.5 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold rounded-full">{row.credits} Cr</span>
    )},
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Subjects Management</h2>
          <p className="text-sm text-slate-500 mt-1">{subjects.length} subjects in curriculum</p>
        </div>
        <button onClick={() => openModal()} className="btn-primary flex items-center gap-2 whitespace-nowrap">
          <MdAdd className="text-xl" /> Add Subject
        </button>
      </div>

      <div className="card p-4">
        <Table columns={columns} data={subjects} loading={loading} onEdit={openModal} onDelete={handleDelete} />
      </div>

      <Modal isOpen={modalOpen} onClose={closeModal} title={editing ? 'Edit Subject' : 'Add Subject'} size="md">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Subject Code *</label>
              <input type="text" required className="input-field font-mono" placeholder="CS201"
                value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Credits *</label>
              <input type="number" required min="1" max="6" className="input-field"
                value={form.credits} onChange={e => setForm(f => ({ ...f, credits: e.target.value }))} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Subject Name *</label>
            <input type="text" required className="input-field" placeholder="Data Structures & Algorithms"
              value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Assigned Faculty *</label>
            <select required className="input-field" value={form.faculty} onChange={e => setForm(f => ({ ...f, faculty: e.target.value }))}>
              <option value="">Select Faculty</option>
              {facultyList.map(fac => <option key={fac.id} value={fac.name}>{fac.name} — {fac.department}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Semester *</label>
            <select required className="input-field" value={form.semester} onChange={e => setForm(f => ({ ...f, semester: e.target.value }))}>
              {SEMESTERS.map(s => <option key={s} value={s}>{s} Semester</option>)}
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-2 border-t border-slate-100 dark:border-slate-700">
            <button type="button" onClick={closeModal} className="px-5 py-2 text-sm font-medium rounded-xl border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700">Cancel</button>
            <button type="submit" className="btn-primary px-6 py-2">{editing ? 'Save' : 'Add Subject'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Subjects;
