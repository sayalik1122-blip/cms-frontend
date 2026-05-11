import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { MdAdd, MdDownload, MdTrendingUp, MdWarning } from 'react-icons/md';
import Table from '../../components/Table';
import Modal from '../../components/Modal';
import { api } from '../../services/api';

const emptyForm = { studentName: '', amount: '', dueDate: '', status: 'Unpaid', transactionId: '-', feeType: 'Tuition Fee' };
const FEE_TYPES = ['Tuition Fee', 'Hostel Fee', 'Lab Fee', 'Library Fee', 'Exam Fee', 'Sports Fee'];

const Fees = () => {
  const [fees, setFees] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [filterStatus, setFilterStatus] = useState('All');

  useEffect(() => { loadAll(); }, []);

  const loadAll = async () => {
    try {
      setLoading(true);
      const [feeData, stuData] = await Promise.all([api.getAll('fees'), api.getAll('students')]);
      setFees(feeData);
      setStudents(stuData);
    } catch {
      toast.error('Failed to load fee records.');
    } finally { setLoading(false); }
  };

  const openModal = (fee = null) => {
    setEditing(fee);
    setForm(fee ? { ...fee } : { ...emptyForm });
    setModalOpen(true);
  };

  const closeModal = () => { setModalOpen(false); setEditing(null); setForm(emptyForm); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        const updated = await api.update('fees', editing.id, form);
        setFees(prev => prev.map(f => f.id === editing.id ? updated : f));
        toast.success('Fee record updated!');
      } else {
        const created = await api.create('fees', form);
        setFees(prev => [...prev, created]);
        toast.success('Fee record created!');
      }
      closeModal();
    } catch { toast.error('Failed to save fee record.'); }
  };

  const handleDelete = async (fee) => {
    if (!window.confirm(`Delete fee record for "${fee.studentName}"?`)) return;
    try {
      await api.remove('fees', fee.id);
      setFees(prev => prev.filter(f => f.id !== fee.id));
      toast.success('Record deleted.');
    } catch { toast.error('Failed to delete.'); }
  };

  const markAsPaid = async (fee) => {
    try {
      const txnId = `TRX${Date.now()}`;
      const updated = await api.patch('fees', fee.id, { status: 'Paid', transactionId: txnId });
      setFees(prev => prev.map(f => f.id === fee.id ? { ...f, ...updated } : f));
      toast.success(`Payment received — ${txnId}`);
    } catch { toast.error('Failed to update payment.'); }
  };

  const totalCollected = fees.filter(f => f.status === 'Paid').reduce((s, f) => s + Number(f.amount), 0);
  const totalPending = fees.filter(f => f.status === 'Unpaid').reduce((s, f) => s + Number(f.amount), 0);
  const collectionRate = fees.length > 0 ? Math.round((fees.filter(f => f.status === 'Paid').length / fees.length) * 100) : 0;

  const filtered = filterStatus === 'All' ? fees : fees.filter(f => f.status === filterStatus);

  const columns = [
    { header: 'Transaction ID', accessor: 'transactionId', render: (row) => <span className="font-mono text-xs text-slate-500">{row.transactionId}</span> },
    { header: 'Student', accessor: 'studentName' },
    { header: 'Type', accessor: 'feeType' },
    { header: 'Amount', accessor: 'amount', render: (row) => <span className="font-bold text-slate-800 dark:text-white">₹{Number(row.amount).toLocaleString()}</span> },
    { header: 'Due Date', accessor: 'dueDate' },
    { header: 'Status', accessor: 'status', render: (row) => (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
        row.status === 'Paid' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
      }`}>
        <span className={`w-1.5 h-1.5 rounded-full ${row.status === 'Paid' ? 'bg-green-500' : 'bg-red-500'}`}></span>
        {row.status}
      </span>
    )},
    { header: '', accessor: '_action', render: (row) => (
      <div className="flex gap-1">
        {row.status === 'Unpaid' && (
          <button onClick={() => markAsPaid(row)} className="px-2.5 py-1 text-xs font-medium bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
            Mark Paid
          </button>
        )}
        <button disabled={row.status === 'Unpaid'} className="p-1.5 text-slate-400 hover:text-primary-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors" title="Download Invoice">
          <MdDownload className="text-base" />
        </button>
      </div>
    )},
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Fee Management</h2>
          <p className="text-sm text-slate-500 mt-1">{fees.length} transactions · {collectionRate}% collection rate</p>
        </div>
        <button onClick={() => openModal()} className="btn-primary flex items-center gap-2 whitespace-nowrap">
          <MdAdd className="text-xl" /> Add Record
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card p-5 border-l-4 border-green-500">
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Total Collected</p>
          <p className="text-2xl font-bold text-slate-800 dark:text-white">₹{totalCollected.toLocaleString()}</p>
          <div className="flex items-center gap-1 mt-1 text-green-600 text-xs"><MdTrendingUp /><span>{fees.filter(f => f.status === 'Paid').length} paid records</span></div>
        </div>
        <div className="card p-5 border-l-4 border-red-500">
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Pending Dues</p>
          <p className="text-2xl font-bold text-slate-800 dark:text-white">₹{totalPending.toLocaleString()}</p>
          <div className="flex items-center gap-1 mt-1 text-red-600 text-xs"><MdWarning /><span>{fees.filter(f => f.status === 'Unpaid').length} unpaid records</span></div>
        </div>
        <div className="card p-5 border-l-4 border-primary-500">
          <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Collection Rate</p>
          <p className="text-2xl font-bold text-slate-800 dark:text-white">{collectionRate}%</p>
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-1.5 mt-2">
            <div className="bg-primary-500 h-1.5 rounded-full transition-all" style={{ width: `${collectionRate}%` }}></div>
          </div>
        </div>
      </div>

      {/* Filter */}
      <div className="card p-4 space-y-4">
        <div className="flex flex-wrap gap-2">
          {['All', 'Paid', 'Unpaid'].map(f => (
            <button key={f} onClick={() => setFilterStatus(f)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${filterStatus === f ? 'bg-primary-600 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200'}`}>
              {f}
            </button>
          ))}
        </div>
        <Table columns={columns} data={filtered} loading={loading} onEdit={openModal} onDelete={handleDelete} />
      </div>

      <Modal isOpen={modalOpen} onClose={closeModal} title={editing ? 'Edit Fee Record' : 'New Fee Record'} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Student *</label>
            <select required className="input-field" value={form.studentName} onChange={e => setForm(f => ({ ...f, studentName: e.target.value }))}>
              <option value="">Select Student</option>
              {students.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Fee Type *</label>
              <select required className="input-field" value={form.feeType} onChange={e => setForm(f => ({ ...f, feeType: e.target.value }))}>
                {FEE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Amount (₹) *</label>
              <input type="number" required min="1" className="input-field" placeholder="15000"
                value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Due Date *</label>
              <input type="date" required className="input-field" value={form.dueDate} onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Status</label>
              <select className="input-field" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                <option value="Unpaid">Unpaid</option>
                <option value="Paid">Paid</option>
              </select>
            </div>
          </div>
          {form.status === 'Paid' && (
            <div>
              <label className="block text-sm font-medium mb-1.5">Transaction ID</label>
              <input type="text" className="input-field font-mono" placeholder="TRX123456"
                value={form.transactionId} onChange={e => setForm(f => ({ ...f, transactionId: e.target.value }))} />
            </div>
          )}
          <div className="flex justify-end gap-3 pt-2 border-t border-slate-100 dark:border-slate-700">
            <button type="button" onClick={closeModal} className="px-5 py-2 text-sm font-medium rounded-xl border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700">Cancel</button>
            <button type="submit" className="btn-primary px-6 py-2">{editing ? 'Save Changes' : 'Create Record'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Fees;
