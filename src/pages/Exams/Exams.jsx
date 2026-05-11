import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { MdAdd, MdEvent, MdAccessTime, MdLocationOn, MdEdit, MdDelete, MdGrade, MdCheckCircle } from 'react-icons/md';
import Modal from '../../components/Modal';
import { api } from '../../services/api';

const emptyForm = { subject: '', date: '', time: '', hall: '', duration: '3 hours', totalMarks: '100', status: 'Scheduled' };

const gradeFor = (marks, total) => {
  const p = (marks / total) * 100;
  if (p >= 90) return { grade: 'A+', color: 'text-emerald-600' };
  if (p >= 80) return { grade: 'A', color: 'text-green-600' };
  if (p >= 70) return { grade: 'B', color: 'text-blue-600' };
  if (p >= 60) return { grade: 'C', color: 'text-yellow-600' };
  if (p >= 50) return { grade: 'D', color: 'text-orange-600' };
  return { grade: 'F', color: 'text-red-600' };
};

const Exams = () => {
  const [exams, setExams] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Schedule modal
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);

  // Marking modal
  const [markingOpen, setMarkingOpen] = useState(false);
  const [markingExam, setMarkingExam] = useState(null);
  const [markSheet, setMarkSheet] = useState({}); // { studentId: marks }
  const [savingMarks, setSavingMarks] = useState(false);

  useEffect(() => { loadAll(); }, []);

  const loadAll = async () => {
    try {
      setLoading(true);
      const [examData, subData, stuData] = await Promise.all([
        api.getAll('exams'),
        api.getAll('subjects'),
        api.getAll('students'),
      ]);
      setExams(examData);
      setSubjects(subData);
      setStudents(stuData.filter(s => s.status === 'Active'));
    } catch {
      toast.error('Failed to load data. Is the JSON server running?');
    } finally { setLoading(false); }
  };

  // ─── Schedule CRUD ───────────────────────────────────────────
  const openSchedule = (exam = null) => {
    setEditing(exam);
    setForm(exam ? { ...exam } : { ...emptyForm });
    setScheduleOpen(true);
  };

  const handleScheduleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        const updated = await api.update('exams', editing.id, form);
        setExams(prev => prev.map(ex => ex.id === editing.id ? updated : ex));
        toast.success('Exam updated!');
      } else {
        const created = await api.create('exams', { ...form, status: 'Scheduled' });
        setExams(prev => [...prev, created]);
        toast.success('Exam scheduled!');
      }
      setScheduleOpen(false);
    } catch { toast.error('Failed to save exam.'); }
  };

  const handleDelete = async (exam) => {
    if (!window.confirm(`Cancel "${exam.subject}" exam?`)) return;
    try {
      await api.remove('exams', exam.id);
      setExams(prev => prev.filter(ex => ex.id !== exam.id));
      toast.success('Exam cancelled.');
    } catch { toast.error('Failed.'); }
  };

  // ─── Marking ─────────────────────────────────────────────────
  const openMarking = async (exam) => {
    setMarkingExam(exam);
    // Pre-fill existing results for this exam
    try {
      const existingResults = await api.getAll('results');
      const examResults = existingResults.filter(r => r.examId === exam.id);
      const sheet = {};
      examResults.forEach(r => { sheet[r.studentId] = r.marks; });
      setMarkSheet(sheet);
    } catch {
      setMarkSheet({});
    }
    setMarkingOpen(true);
  };

  const handleMarkChange = (studentId, value) => {
    const max = Number(markingExam?.totalMarks || 100);
    const v = Math.min(max, Math.max(0, Number(value)));
    setMarkSheet(prev => ({ ...prev, [studentId]: value === '' ? '' : v }));
  };

  const handleSaveMarks = async () => {
    setSavingMarks(true);
    try {
      const total = Number(markingExam.totalMarks || 100);
      const existingResults = await api.getAll('results');

      const saves = students.map(async (student) => {
        const marks = markSheet[student.id];
        if (marks === '' || marks === undefined) return; // skip blank
        const { grade } = gradeFor(Number(marks), total);
        const payload = {
          examId: markingExam.id,
          studentId: student.id,
          studentName: student.name,
          subject: markingExam.subject,
          marks: Number(marks),
          totalMarks: total,
          grade,
          percentage: Math.round((Number(marks) / total) * 100),
          markedAt: new Date().toISOString(),
        };
        // Update if exists, else create
        const existing = existingResults.find(r => r.examId === markingExam.id && r.studentId === student.id);
        if (existing) {
          return api.update('results', existing.id, payload);
        } else {
          return api.create('results', payload);
        }
      });

      await Promise.all(saves);

      // Mark exam as "Marked"
      const updated = await api.patch('exams', markingExam.id, { status: 'Marked' });
      setExams(prev => prev.map(ex => ex.id === markingExam.id ? { ...ex, status: 'Marked' } : ex));

      toast.success('Marks saved and results published!');
      setMarkingOpen(false);
    } catch { toast.error('Failed to save marks.'); }
    finally { setSavingMarks(false); }
  };

  // ─── UI helpers ──────────────────────────────────────────────
  const statusBadge = (exam) => {
    const isUpcoming = new Date(exam.date) > new Date();
    if (exam.status === 'Marked') return { label: 'Marked', cls: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' };
    if (isUpcoming) return { label: 'Scheduled', cls: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' };
    return { label: 'Pending Marks', cls: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' };
  };

  const upcoming = exams.filter(e => new Date(e.date) >= new Date());
  const past = exams.filter(e => new Date(e.date) < new Date());

  const ExamCard = ({ exam }) => {
    const badge = statusBadge(exam);
    const isPast = new Date(exam.date) < new Date();
    return (
      <div className="card p-5 relative group hover:shadow-lg transition-all">
        {/* Status badge */}
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold mb-3 ${badge.cls}`}>
          {badge.label}
        </span>

        {/* Action buttons */}
        <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => openSchedule(exam)} className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30" title="Edit"><MdEdit /></button>
          <button onClick={() => handleDelete(exam)} className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30" title="Cancel"><MdDelete /></button>
        </div>

        <h3 className="font-bold text-slate-800 dark:text-white text-base mb-3 pr-14">{exam.subject}</h3>

        <div className="space-y-1.5 text-sm text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-2"><MdEvent className="text-primary-500 flex-shrink-0" /><span>{exam.date}</span></div>
          <div className="flex items-center gap-2"><MdAccessTime className="text-primary-500 flex-shrink-0" /><span>{exam.time} · {exam.duration}</span></div>
          <div className="flex items-center gap-2"><MdLocationOn className="text-primary-500 flex-shrink-0" /><span>{exam.hall}</span></div>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
          <span className="text-xs text-slate-400">Total Marks: <strong>{exam.totalMarks}</strong></span>
          {isPast && exam.status !== 'Marked' && (
            <button onClick={() => openMarking(exam)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-primary-600 hover:bg-primary-700 text-white text-xs font-semibold rounded-lg transition-colors">
              <MdGrade className="text-sm" /> Enter Marks
            </button>
          )}
          {exam.status === 'Marked' && (
            <span className="flex items-center gap-1 text-xs font-semibold text-green-600">
              <MdCheckCircle /> Results Published
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Examination Management</h2>
          <p className="text-sm text-slate-500 mt-1">{upcoming.length} upcoming · {past.length} completed</p>
        </div>
        <button onClick={() => openSchedule()} className="btn-primary flex items-center gap-2 whitespace-nowrap">
          <MdAdd className="text-xl" /> Schedule Exam
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600" /></div>
      ) : (
        <>
          {upcoming.length > 0 && (
            <section>
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Upcoming Exams</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {upcoming.map(ex => <ExamCard key={ex.id} exam={ex} />)}
              </div>
            </section>
          )}
          {past.length > 0 && (
            <section>
              <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">Past Exams</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {past.map(ex => <ExamCard key={ex.id} exam={ex} />)}
              </div>
            </section>
          )}
          {exams.length === 0 && (
            <div className="card p-12 text-center text-slate-400">No exams scheduled yet. Click "Schedule Exam" to get started.</div>
          )}
        </>
      )}

      {/* ── Schedule Modal ── */}
      <Modal isOpen={scheduleOpen} onClose={() => setScheduleOpen(false)} title={editing ? 'Edit Exam' : 'Schedule New Exam'} size="md">
        <form onSubmit={handleScheduleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Subject *</label>
            <select required className="input-field" value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}>
              <option value="">Select Subject</option>
              {subjects.map(s => <option key={s.id} value={s.name}>{s.name} ({s.code})</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Date *</label>
              <input type="date" required className="input-field" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Time *</label>
              <input type="time" required className="input-field" value={form.time} onChange={e => setForm(f => ({ ...f, time: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Hall / Room *</label>
              <input type="text" required className="input-field" placeholder="Block A - 101" value={form.hall} onChange={e => setForm(f => ({ ...f, hall: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Duration</label>
              <select className="input-field" value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))}>
                <option>1 hour</option><option>2 hours</option><option>3 hours</option><option>4 hours</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Total Marks</label>
              <input type="number" className="input-field" min="10" max="500" value={form.totalMarks} onChange={e => setForm(f => ({ ...f, totalMarks: e.target.value }))} />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2 border-t border-slate-100 dark:border-slate-700">
            <button type="button" onClick={() => setScheduleOpen(false)} className="px-5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700">Cancel</button>
            <button type="submit" className="btn-primary px-6 py-2">{editing ? 'Update' : 'Schedule'}</button>
          </div>
        </form>
      </Modal>

      {/* ── Marking Sheet Modal ── */}
      <Modal isOpen={markingOpen} onClose={() => setMarkingOpen(false)} title={`Mark Students — ${markingExam?.subject}`} size="xl">
        {markingExam && (
          <div className="space-y-4">
            {/* Exam summary */}
            <div className="flex flex-wrap gap-4 p-3 bg-slate-50 dark:bg-slate-900/50 rounded-xl text-sm text-slate-500">
              <span><strong>Date:</strong> {markingExam.date}</span>
              <span><strong>Hall:</strong> {markingExam.hall}</span>
              <span><strong>Total Marks:</strong> {markingExam.totalMarks}</span>
              <span><strong>Students:</strong> {students.length}</span>
            </div>

            {/* Mark sheet table */}
            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-bold uppercase text-slate-500">#</th>
                    <th className="px-4 py-3 text-left text-xs font-bold uppercase text-slate-500">Student</th>
                    <th className="px-4 py-3 text-left text-xs font-bold uppercase text-slate-500">Course</th>
                    <th className="px-4 py-3 text-left text-xs font-bold uppercase text-slate-500 w-32">
                      Marks <span className="text-slate-400 font-normal normal-case">/ {markingExam.totalMarks}</span>
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-bold uppercase text-slate-500">Grade</th>
                    <th className="px-4 py-3 text-left text-xs font-bold uppercase text-slate-500">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                  {students.map((student, idx) => {
                    const marks = markSheet[student.id];
                    const hasMarks = marks !== '' && marks !== undefined;
                    const total = Number(markingExam.totalMarks);
                    const { grade, color } = hasMarks ? gradeFor(Number(marks), total) : { grade: '—', color: 'text-slate-400' };
                    const passed = hasMarks && (Number(marks) / total) >= 0.5;
                    return (
                      <tr key={student.id} className="bg-white dark:bg-slate-800/40 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                        <td className="px-4 py-3 text-slate-400 text-xs">{idx + 1}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-primary-100 dark:bg-primary-900/30 text-primary-600 font-bold text-xs flex items-center justify-center flex-shrink-0">
                              {student.name.charAt(0)}
                            </div>
                            <span className="font-medium text-slate-800 dark:text-white">{student.name}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-slate-500 text-xs">{student.course}</td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            min="0"
                            max={markingExam.totalMarks}
                            placeholder="—"
                            value={marks ?? ''}
                            onChange={e => handleMarkChange(student.id, e.target.value)}
                            className="w-24 px-3 py-1.5 text-sm rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-400 focus:border-primary-400 transition-colors"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <span className={`font-bold text-base ${color}`}>{grade}</span>
                        </td>
                        <td className="px-4 py-3">
                          {!hasMarks ? (
                            <span className="text-xs text-slate-400">Not entered</span>
                          ) : passed ? (
                            <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-600">
                              <MdCheckCircle /> Pass
                            </span>
                          ) : (
                            <span className="text-xs font-semibold text-red-500">Fail</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Summary bar */}
            <div className="flex flex-wrap gap-4 p-3 bg-primary-50 dark:bg-primary-900/20 rounded-xl text-sm">
              <span className="text-slate-600 dark:text-slate-400">
                Entered: <strong className="text-slate-800 dark:text-white">{Object.values(markSheet).filter(v => v !== '' && v !== undefined).length}</strong> / {students.length}
              </span>
              <span className="text-slate-600 dark:text-slate-400">
                Pass: <strong className="text-green-600">{students.filter(s => markSheet[s.id] !== '' && markSheet[s.id] !== undefined && (Number(markSheet[s.id]) / Number(markingExam.totalMarks)) >= 0.5).length}</strong>
              </span>
              <span className="text-slate-600 dark:text-slate-400">
                Fail: <strong className="text-red-500">{students.filter(s => markSheet[s.id] !== '' && markSheet[s.id] !== undefined && (Number(markSheet[s.id]) / Number(markingExam.totalMarks)) < 0.5).length}</strong>
              </span>
            </div>

            <div className="flex justify-end gap-3 pt-2 border-t border-slate-100 dark:border-slate-700">
              <button onClick={() => setMarkingOpen(false)} className="px-5 py-2 text-sm rounded-xl border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700">Cancel</button>
              <button onClick={handleSaveMarks} disabled={savingMarks}
                className="btn-primary px-6 py-2 flex items-center gap-2 disabled:opacity-60">
                {savingMarks ? <><div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Saving…</> : 'Save & Publish Results'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Exams;
