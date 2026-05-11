import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { MdAdd, MdEmail, MdWork, MdBook, MdEdit, MdDelete } from 'react-icons/md';
import Modal from '../../components/Modal';
import { api, generateId } from '../../services/api';

const DEPARTMENTS = ['Computer Science', 'Physics', 'Mechanical Eng.', 'Civil Eng.', 'Electrical Eng.', 'Mathematics', 'Chemistry', 'Electronics Eng.'];

const emptyForm = { name: '', email: '', department: '', experience: '', subjects: '', phone: '' };

const Faculty = () => {
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState('');
  const [filterDept, setFilterDept] = useState('All');

  useEffect(() => { loadFaculty(); }, []);

  const loadFaculty = async () => {
    try {
      setLoading(true);
      const data = await api.getAll('faculty');
      setFaculty(data);
    } catch {
      toast.error('Failed to load faculty. Is the JSON server running?');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (member = null) => {
    setEditing(member);
    setForm(member ? { ...member, subjects: Array.isArray(member.subjects) ? member.subjects.join(', ') : member.subjects } : { ...emptyForm });
    setModalOpen(true);
  };

  const closeModal = () => { setModalOpen(false); setEditing(null); setForm(emptyForm); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form, subjects: form.subjects.split(',').map(s => s.trim()).filter(Boolean) };
    try {
      if (editing) {
        const updated = await api.update('faculty', editing.id, payload);
        setFaculty(prev => prev.map(f => f.id === editing.id ? updated : f));
        toast.success(`${form.name} updated!`);
      } else {
        const newId = generateId('F', faculty);
        const created = await api.create('faculty', { ...payload, id: newId });
        setFaculty(prev => [...prev, created]);
        toast.success(`${form.name} added to faculty!`);
      }
      closeModal();
    } catch {
      toast.error('Failed to save faculty member.');
    }
  };

  const handleDelete = async (member) => {
    if (!window.confirm(`Remove "${member.name}" from faculty?`)) return;
    try {
      await api.remove('faculty', member.id);
      setFaculty(prev => prev.filter(f => f.id !== member.id));
      toast.success('Faculty member removed.');
    } catch {
      toast.error('Failed to delete.');
    }
  };

  const depts = ['All', ...new Set(faculty.map(f => f.department))];
  const filtered = faculty
    .filter(f => filterDept === 'All' || f.department === filterDept)
    .filter(f => f.name?.toLowerCase().includes(search.toLowerCase()) || f.department?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Faculty Management</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{faculty.length} faculty members across {new Set(faculty.map(f => f.department)).size} departments</p>
        </div>
        <button onClick={() => openModal()} className="btn-primary flex items-center gap-2 whitespace-nowrap">
          <MdAdd className="text-xl" /> Add Faculty
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text" placeholder="Search by name or department..." value={search}
          onChange={e => setSearch(e.target.value)}
          className="input-field flex-1 max-w-sm"
        />
        <select className="input-field w-full sm:w-52" value={filterDept} onChange={e => setFilterDept(e.target.value)}>
          {depts.map(d => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>

      {/* Cards Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="card p-12 text-center text-slate-400">No faculty found matching your criteria.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(member => (
            <div key={member.id} className="card p-6 group relative hover:shadow-lg transition-all duration-200">
              {/* Actions */}
              <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => openModal(member)} className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30"><MdEdit /></button>
                <button onClick={() => handleDelete(member)} className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30"><MdDelete /></button>
              </div>
              {/* Avatar */}
              <div className="flex flex-col items-center text-center mb-5">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-2xl font-bold mb-3 shadow-lg shadow-primary-500/20">
                  {member.name?.charAt(0)}
                </div>
                <h3 className="font-bold text-slate-800 dark:text-white text-lg">{member.name}</h3>
                <span className="mt-1 inline-block px-3 py-0.5 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 text-xs font-semibold rounded-full">
                  {member.department}
                </span>
              </div>
              {/* Details */}
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <MdEmail className="text-slate-400 flex-shrink-0" />
                  <span className="truncate">{member.email}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <MdWork className="text-slate-400 flex-shrink-0" />
                  <span>{member.experience} experience</span>
                </div>
                {member.subjects?.length > 0 && (
                  <div className="flex items-start gap-2 text-slate-600 dark:text-slate-400">
                    <MdBook className="text-slate-400 flex-shrink-0 mt-0.5" />
                    <span className="line-clamp-2">{Array.isArray(member.subjects) ? member.subjects.join(', ') : member.subjects}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <Modal isOpen={modalOpen} onClose={closeModal} title={editing ? 'Edit Faculty Member' : 'Add New Faculty'} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Full Name *</label>
              <input type="text" required className="input-field" placeholder="Dr. Rajesh Kumar"
                value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email *</label>
              <input type="email" required className="input-field" placeholder="faculty@college.edu"
                value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Department *</label>
              <select required className="input-field" value={form.department} onChange={e => setForm(f => ({ ...f, department: e.target.value }))}>
                <option value="">Select Department</option>
                {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Experience</label>
              <input type="text" className="input-field" placeholder="e.g. 10 Years"
                value={form.experience} onChange={e => setForm(f => ({ ...f, experience: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Phone</label>
              <input type="tel" className="input-field" placeholder="9876543210"
                value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Subjects (comma-separated)</label>
            <input type="text" className="input-field" placeholder="Algorithms, Data Structures, AI"
              value={form.subjects} onChange={e => setForm(f => ({ ...f, subjects: e.target.value }))} />
          </div>
          <div className="flex justify-end gap-3 pt-2 border-t border-slate-100 dark:border-slate-700">
            <button type="button" onClick={closeModal} className="px-5 py-2 text-sm font-medium rounded-xl border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
              Cancel
            </button>
            <button type="submit" className="btn-primary px-6 py-2">
              {editing ? 'Save Changes' : 'Add Faculty'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Faculty;
