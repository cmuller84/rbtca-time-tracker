import React, { useState } from 'react';
import { Clock, FileDown, Info } from 'lucide-react';

/* ---------- Types ---------- */
interface TimeEntry {
  id: number;
  startTime: string;
  endTime: string;
  duration: number;          // minutes
  category: string;
  client: string;
  description: string;
}

/* ---------- Helpers ---------- */
const minsBetween = (s: string, e: string) =>
  !s || !e
    ? 0
    : (new Date(`2000-01-01T${e}`).getTime() -
        new Date(`2000-01-01T${s}`).getTime()) /
      60000;

const downloadCSV = (rows: string[][], filename: string) => {
  const blob = new Blob(
    [rows.map(r => r.map(v => `"${v}"`).join(',')).join('\n')],
    { type: 'text/csv;charset=utf-8;' }
  );
  const url = URL.createObjectURL(blob);
  const a   = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

/* ---------- Data ---------- */
const RBTCA = ['Yaria L.', 'Matt P.'];

const CATS = [
  'Billable – 1-1 (scheduled)',
  'Billable – 1-1 (coverage/last-minute)',
  'Indirect Clinical (non-billable)',
  'Ops / Admin (non-billable)',
  'Training / CEU',
  'Meetings (staff / parent / IEP)',
  'Other'
];

/* ---------- Component ---------- */
const TimeTracker: React.FC = () => {
  const [rbtca, setRbtca] = useState('');
  const [date,  setDate ] = useState(new Date().toISOString().slice(0, 10));

  const [form, setForm] = useState({
    startTime: '', endTime: '', category: '', client: '', description: ''
  });
  const [entries, setEntries] = useState<TimeEntry[]>([]);

  const update =
    (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm(p => ({ ...p, [k]: e.target.value }));

  const addEntry = () => {
    const duration = minsBetween(form.startTime, form.endTime);
    setEntries(p => [...p, { id: Date.now(), duration, ...form }]);
    setForm({ startTime: '', endTime: '', category: '', client: '', description: '' });
  };

  const exportCSV = () => {
    if (!entries.length) return;
    const rows = [
      ['RBTCA', rbtca],
      ['Date', date],
      [],
      ['Start','End','Duration (min)','Category','Client','Description'],
      ...entries.map(e => [
        e.startTime, e.endTime, e.duration.toString(), e.category, e.client, e.description
      ])
    ];
    downloadCSV(rows, `rbtca-time-tracker-${date}.csv`);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 space-y-6">
        {/* Logo */}
        <img
          src="https://advancedabatherapy.com/wp-content/uploads/2020/11/cropped-Advanced-Behavioral-Therapy-logo-01.png"
          alt="Advanced Behavioral Therapy"
          className="h-10 mb-2"
        />

        <h1 className="flex items-center text-2xl font-semibold text-blue-800 gap-2">
          <Clock size={22}/> RBTCA Time Tracker
        </h1>

        {/* RBTCA + Date */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">RBTCA Name</label>
            <select
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-400"
              value={rbtca}
              onChange={e => setRbtca(e.target.value)}
            >
              <option value="">Select RBTCA…</option>
              {RBTCA.map(n => <option key={n}>{n}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Date</label>
            <input
              type="date"
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-400"
              value={date}
              onChange={e => setDate(e.target.value)}
            />
          </div>
        </div>

        {/* Entry form */}
        <div className="bg-white border rounded-xl p-6 space-y-4">
          <h3 className="text-lg font-semibold">Add Time Entry</h3>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Start Time</label>
              <input
                type="time"
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-400"
                value={form.startTime}
                onChange={update('startTime')}
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">End Time</label>
              <input
                type="time"
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-400"
                value={form.endTime}
                onChange={update('endTime')}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">Category</label>
              <select
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-400"
                value={form.category}
                onChange={update('category')}
              >
                <option value="">Select category…</option>
                {CATS.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">Client Name (if applicable)</label>
              <input
                type="text"
                placeholder="Client name for 1-1 sessions"
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-400"
                value={form.client}
                onChange={update('client')}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">Description (optional)</label>
              <input
                type="text"
                placeholder="Short description of work"
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-400"
                value={form.description}
                onChange={update('description')}
              />
            </div>
          </div>

          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            disabled={!form.startTime || !form.endTime || !form.category}
            onClick={addEntry}
          >
            + Add Entry
          </button>
        </div>

        {/* Log & Export */}
        {entries.length > 0 && (
          <>
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
                    <td className="py-2">{e.startTime} – {e.endTime}</td>
                    <td className="py-2">{e.category}</td>
                    <td className="py-2">{e.client || '—'}</td>
                    <td className="py-2">{e.duration} min</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <button
              className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 flex items-center gap-2"
              onClick={exportCSV}
            >
              <FileDown size={18}/> Export CSV
            </button>
          </>
        )}

        {/* Instructions bottom */}
        <div className="bg-white border-l-4 border-blue-500 rounded p-4 mt-6 space-y-2">
          <h4 className="flex items-center font-semibold text-blue-700">
            <Info size={18} className="mr-1"/> Daily Process (through July 18)
          </h4>
          <ol className="list-decimal list-inside text-sm text-gray-700 space-y-1">
            <li>Log each work block <b>as you go</b> — start, end, category, client (if billable), notes.</li>
            <li>Use category definitions:<br/>
              &nbsp;&nbsp;• <i>Billable 1-1 (scheduled)</i> – planned direct sessions<br/>
              &nbsp;&nbsp;• <i>Billable 1-1 (coverage)</i> – last-minute fill-ins<br/>
              &nbsp;&nbsp;• <i>Indirect Clinical</i> – programming, visuals, notes<br/>
              &nbsp;&nbsp;• <i>Ops / Admin</i> – phone, supplies, office tasks<br/>
              &nbsp;&nbsp;• <i>Training / CEU</i> – formal coursework/in-service<br/>
              &nbsp;&nbsp;• <i>Meetings</i> – staff, parent, IEP<br/>
              &nbsp;&nbsp;• <i>Other</i> – anything that doesn’t fit above
            </li>
            <li>At day’s end, click <b>Export CSV</b> and email the file to Chris.</li>
            <li>Repeat daily; total time ≈ <i>&lt;60 seconds</i>.</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default TimeTracker;
