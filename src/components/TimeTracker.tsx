import React, { useState } from 'react';

/* ------------------------------------------------------------------ */
/*  Types                                                             */
/* ------------------------------------------------------------------ */
interface TimeEntry {
  id: number;
  startTime: string;
  endTime: string;
  duration: number;        // minutes
  category: string;
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
/*  Component                                                         */
/* ------------------------------------------------------------------ */
const TimeTracker: React.FC = () => {
  // all entries logged so far
  const [entries, setEntries] = useState<TimeEntry[]>([]);

  // form state (same shape minus id & duration)
  const [form, setForm] = useState<Omit<TimeEntry, 'id' | 'duration'>>({
    startTime: '',
    endTime: '',
    category: '',
    description: ''
  });

  /* --------------------------- Handlers --------------------------- */
  const handleChange = (field: keyof typeof form) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
  };

  const handleAdd = () => {
    const duration = calcDuration(form.startTime, form.endTime);
    const newEntry: TimeEntry = { id: Date.now(), duration, ...form };

    // ✅ entries is explicitly TimeEntry[], so no TS2322
    setEntries(prev => [...prev, newEntry]);

    // reset the form
    setForm({ startTime: '', endTime: '', category: '', description: '' });
  };

  /* ----------------------------- JSX ----------------------------- */
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">RBTCA Time Tracker</h1>

      {/* Form */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <input
          type="time"
          value={form.startTime}
          onChange={handleChange('startTime')}
          className="border p-1"
        />
        <input
          type="time"
          value={form.endTime}
          onChange={handleChange('endTime')}
          className="border p-1"
        />
        <input
          type="text"
          placeholder="Category"
          value={form.category}
          onChange={handleChange('category')}
          className="border p-1 col-span-2"
        />
        <input
          type="text"
          placeholder="Description"
          value={form.description}
          onChange={handleChange('description')}
          className="border p-1 col-span-2"
        />
      </div>

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
        disabled={!form.startTime || !form.endTime}
        onClick={handleAdd}
      >
        Add Entry
      </button>

      {/* Log */}
      <ul className="mt-6 space-y-2">
        {entries.map(e => (
          <li key={e.id} className="border p-2 rounded">
            <div className="font-semibold">{e.category || 'No Category'}</div>
            <div className="text-sm text-gray-700">{e.description}</div>
            <div className="text-xs text-gray-500">
              {e.startTime} – {e.endTime} • {e.duration} min
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TimeTracker;
