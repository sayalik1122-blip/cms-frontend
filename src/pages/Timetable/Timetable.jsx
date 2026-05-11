import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { MdAdd, MdEdit, MdDelete } from 'react-icons/md';
import { motion } from 'framer-motion';
import Modal from '../../components/Modal';
import { api } from '../../services/api';

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
const DAY_LABELS = { monday: 'Mon', tuesday: 'Tue', wednesday: 'Wed', thursday: 'Thu', friday: 'Fri' };

const emptyForm = { time: '', monday: '', tuesday: '', wednesday: '', thursday: '', friday: '' };

const Timetable = () => {
  const [slots, setSlots] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => { loadAll(); }, []);

  const loadAll = async () => {
    try {
      setLoading(true);
      const [ttData, subData] = await Promise.all([api.getAll('timetable'), api.getAll('subjects')]);
      setSlots(ttData.sort((a, b) => a.time.localeCompare(b.time)));
      setSubjects(subData);
    } catch {
      toast.error('Failed to load timetable.');
    } finally { setLoading(false); }
  };

  const openModal = (slot = null) => {
    setEditing(slot);
    setForm(slot ? { ...slot } : { ...emptyForm });
    setModalOpen(true);
  };

  const closeModal = () => { setModalOpen(false); setEditing(null); setForm(emptyForm); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        const updated = await api.update('timetable', editing.id, form);
        setSlots(prev => prev.map(s => s.id === editing.id ? updated : s).sort((a, b) => a.time.localeCompare(b.time)));
        toast.success('Slot updated!');
      } else {
        const created = await api.create('timetable', form);
        setSlots(prev => [...prev, created].sort((a, b) => a.time.localeCompare(b.time)));
        toast.success('Slot added!');
      }
      closeModal();
    } catch { toast.error('Failed to save.'); }
  };

  const handleDelete = async (slot) => {
    if (!window.confirm('Remove this time slot?')) return;
    try {
      await api.remove('timetable', slot.id);
      setSlots(prev => prev.filter(s => s.id !== slot.id));
      toast.success('Slot removed.');
    } catch { toast.error('Failed to delete.'); }
  };

  const cellColor = (subject) => {
    if (!subject || subject === 'Break' || subject === '-') return 'bg-slate-100 dark:bg-slate-700/50 text-slate-400 italic';
    const colors = ['bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300', 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300', 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300', 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300', 'bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-300', 'bg-cyan-50 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-300'];
    const hash = subject.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Weekly Timetable</h2>
          <p className="text-sm text-slate-500 mt-1">{slots.length} time slots configured</p>
        </div>
        <button onClick={() => openModal()} className="btn-primary flex items-center gap-2 whitespace-nowrap">
          <MdAdd className="text-xl" /> Add Time Slot
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600"></div></div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700">
                  <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">Time</th>
                  {DAYS.map(day => (
                    <th key={day} className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">{DAY_LABELS[day]}</th>
                  ))}
                  <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                {slots.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-12 text-center text-slate-400">No time slots added yet.</td>
                  </tr>
                ) : (
                  slots.map((slot, idx) => (
                    <motion.tr key={slot.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: idx * 0.04 }}
                      className="bg-white dark:bg-slate-800/40 hover:bg-slate-50/80 dark:hover:bg-slate-700/30 group transition-colors">
                      <td className="px-5 py-3.5 font-bold text-primary-600 dark:text-primary-400 whitespace-nowrap">{slot.time}</td>
                      {DAYS.map(day => (
                        <td key={day} className="px-5 py-3.5">
                          <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-medium ${cellColor(slot[day])}`}>
                            {slot[day] || '—'}
                          </span>
                        </td>
                      ))}
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={() => openModal(slot)} className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30"><MdEdit /></button>
                          <button onClick={() => handleDelete(slot)} className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30"><MdDelete /></button>
                        </div>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={closeModal} title={editing ? 'Edit Time Slot' : 'Add Time Slot'} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Time *</label>
            <input type="text" required className="input-field" placeholder="e.g. 09:00 AM - 10:00 AM"
              value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {DAYS.map(day => (
              <div key={day}>
                <label className="block text-sm font-medium mb-1.5 capitalize">{day}</label>
                <select className="input-field" value={form[day]} onChange={e => setForm(f => ({ ...f, [day]: e.target.value }))}>
                  <option value="">— Free Period —</option>
                  <option value="Break">☕ Break</option>
                  <option value="Self Study">📖 Self Study</option>
                  {subjects.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                </select>
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-3 pt-2 border-t border-slate-100 dark:border-slate-700">
            <button type="button" onClick={closeModal} className="px-5 py-2 text-sm font-medium rounded-xl border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700">Cancel</button>
            <button type="submit" className="btn-primary px-6 py-2">{editing ? 'Update' : 'Add Slot'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Timetable;
