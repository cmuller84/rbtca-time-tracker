import React, { useState } from 'react';
import { Clock } from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Types                                                             */
/* ------------------------------------------------------------------ */
interface TimeEntry {
  id: number;
  startTime: string;
  endTime: string;
  duration: number;        // minutes
  category: string;
  client: string;
  description: string;
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */
const calcDuration = (start: string, end: string): number => {
  if (!start || !end) return 0;
  const s = new Date(`2000-01-01T${start}`);
  const e = new Date(`2000-01-01T${end}`);
  return (e.getTime() - s.getTime()) / 1000 / 60; // minutes
};

/* ------------------------------------------------------------------ */
/*  Mock data (replace with real)                                     */
/* ------------------------------------------------------------------ */
const RBTCA_LIST = ['Yaria', 'Louis', 'Jordan', 'Sam'];
const CATEGORIES = ['Billable – 1-1', 'Admin', 'Training', 'Meeting'];

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */
const TimeTracker: React.FC = () => {
  /* ---------- Global form ---------- */
  const [rbtca, setRbtca] = useState<string>('');
  const [date,  setDate]  = useState<string>(new Date().toISOString().slice(0, 10));

  /* ---------- Entry form ---------- */
  const [form, setForm] = useState({
    startTime: '',
    endTime: '',
    category: '',
    client: '',
    description: ''
  });

  /* ---------- Log ---------- */
  const [entries, setEntries] = useState<TimeEntry[]>([]);

  /* ---------- Handlers ---------- */
  const onChange = (field: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => setForm(prev => ({ ...prev, [field]: e.target.value }));

  const handleAdd = () => {
    const duration = calcDuration(form.startTime, form.endTime);
    const newEntry: TimeEntry = { id: Date.now(), duration, ...form };

    setEntries(prev => [...prev, newEntry]);
    setForm({ startTime: '', endTime: '', category: '', client: '', description: '' });
  };

  /* ---------- UI ---------- */
  return (
    <div className="max-w-2xl mx-auto p-4">
      {/* Outer card */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 space-y-6">
        <h1 className="flex items-center text-2xl font-semibold text-blue-800 gap-2">
          <Clock size={20} /> RBTCA Time Tracker
        </h1>

        {/* RBTCA & Date */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="label">RBTCA Name</label>
            <select
              className="input"
              value={rbtca}
              onChange={e => setRbtca(e.target.value)}
            >
              <option value="">Select RBTCA…</option>
              {RBTCA_LIST.map(n => (
                <option key={n}>{n}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Date</label>
            <input
              type="date"
              className="input"
              value={date}
              onChange={e => setDate(e.target.value)}
            />
          </div>
        </div>

        {/* Inner card */}
        <div className="bg-white border rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-semibold mb-2">Add Time Entry</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="label">Start Time</label>
              <input
                type="time"
                className="input"
                value={form.startTime}
                onChange={onChange('startTime')}
              />
            </div>

            <div>
              <label className="label">End Time</label>
              <input
                type="time"
                className="input"
                value={form.endTime}
                onChange={onChange('endTime')}
              />
            </div>

            <div className="md:col-span-2">
              <label className="label">Category</label>
              <select
                className="input"
                value={form.category}
                onChange={onChange('category')}
              >
                <option value="">Select category…</option>
                {CATEGORIES.map(c => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="label">Client Name (if applicable)</label>
              <input
                type="text"
                className="input"
                placeholder="Client name (for billable work)"
                value={form.client}
                onChange={onChange('client')}
              />
            </div>

            <div className="md:col-span-2">
              <label className="label">Description (optional)</label>
              <input
                type="text"
                className="input"
                placeholder="Brief description of activity"
                value={form.description}
                onChange={onChange('description')}
              />
            </div>
          </div>

          <button
            className="btn-primary"
            disabled={!form.startTime || !form.endTime || !form.category}
            onClick={handleAdd}
          >
            + Add Entry
          </button>
        </div>

        {/* Log table (optional) */}
        {entries.length > 0 && (
          <table className="w-full text-sm border-t pt-4">
            <thead>
              <tr className="text-left text-gray-600">
                <th className="py-2">Time</th>
                <th className="py-2">Category</th>
                <th className="py-2">Client</th>
                <th className="py-2">Duration</th>
              </tr>
            </thead>
            <tbody>
              {entries.map(e => (
                <tr key={e.id} className="border-t">
                  <td className="py-2">
                    {e.startTime} – {e.endTime}
                  </td>
                  <td className="py-2">{e.category}</td>
                  <td className="py-2">{e.client || '—'}</td>
                  <td className="py-2">{e.duration} min</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default TimeTracker;

/* ------------------------------------------------------------------ */
/*  Tiny CSS helpers (Tailwind shortcuts)                             */
/* ------------------------------------------------------------------ */
/* If you’re using Tailwind via CDN, drop these in public/index.html
   inside <style>.  If you installed Tailwind properly, add them to
   src/index.css instead so they go through the build pipeline.      */

/*
.input { @apply w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-400; }
.label { @apply text-xs font-medium text-gray-600 mb-1 block; }
.btn-primary { @apply bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50; }
*/
