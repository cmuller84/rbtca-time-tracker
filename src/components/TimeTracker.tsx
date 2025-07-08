import React, { useState } from 'react';
import { Clock, Plus, Download, Trash2, Mail } from 'lucide-react';

const TimeTracker = () => {
  const [entries, setEntries] = useState([]);
  const [currentEntry, setCurrentEntry] = useState({
    startTime: '',
    endTime: '',
    category: '',
    description: '',
    clientName: ''
  });
  const [employeeName, setEmployeeName] = useState('');
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);

  const categories = [
    { value: 'billable', label: 'Direct Billable Client Work', color: 'bg-green-100 text-green-800' },
    { value: 'clinical_support', label: 'Clinical Floor Support (Coaching/Mentoring)', color: 'bg-blue-100 text-blue-800' },
    { value: 'administrative', label: 'Administrative Tasks', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'downtime', label: 'Downtime/Waiting', color: 'bg-gray-100 text-gray-800' }
  ];

  const calculateDuration = (start, end) => {
    if (!start || !end) return 0;
    const startTime = new Date(`2000-01-01T${start}`);
    const endTime = new Date(`2000-01-01T${end}`);
    const diff = (endTime - startTime) / (1000 * 60); // minutes
    return Math.max(0, diff);
  };

  const addEntry = () => {
    if (!currentEntry.startTime || !currentEntry.endTime || !currentEntry.category) {
      alert('Please fill in start time, end time, and category');
      return;
    }

    const duration = calculateDuration(currentEntry.startTime, currentEntry.endTime);
    if (duration <= 0) {
      alert('End time must be after start time');
      return;
    }

    const newEntry = {
      ...currentEntry,
      duration,
      id: Date.now()
    };

    setEntries([...entries, newEntry]);
    setCurrentEntry({
      startTime: '',
      endTime: '',
      category: '',
      description: '',
      clientName: ''
    });
  };

  const removeEntry = (id) => {
    setEntries(entries.filter(entry => entry.id !== id));
  };

  const getTotalsByCategory = () => {
    const totals = {};
    categories.forEach(cat => {
      totals[cat.value] = entries
        .filter(entry => entry.category === cat.value)
        .reduce((sum, entry) => sum + entry.duration, 0);
    });
    return totals;
  };

  const formatMinutes = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const exportData = () => {
    const totals = getTotalsByCategory();
    const totalMinutes = Object.values(totals).reduce((sum, mins) => sum + mins, 0);
    
    const exportString = `RBTCA Time Tracking Report
Employee: ${employeeName}
Date: ${currentDate}
Total Time Logged: ${formatMinutes(totalMinutes)}

SUMMARY:
${categories.map(cat => `${cat.label}: ${formatMinutes(totals[cat.value])}`).join('\n')}

DETAILED ENTRIES:
${entries.map(entry => {
      const cat = categories.find(c => c.value === entry.category);
      return `${entry.startTime} - ${entry.endTime} (${formatMinutes(entry.duration)}) | ${cat.label}${entry.clientName ? ` | Client: ${entry.clientName}` : ''}${entry.description ? ` | ${entry.description}` : ''}`;
    }).join('\n')}`;

    const blob = new Blob([exportString], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${employeeName}_TimeLog_${currentDate}.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const copyToClipboard = async () => {
    if (!employeeName) {
      alert('Please select your name first');
      return;
    }

    const totals = getTotalsByCategory();
    const totalMinutes = Object.values(totals).reduce((sum, mins) => sum + mins, 0);
    
    const reportText = `Hi Chris,

Here's my time tracking report for ${currentDate}:

RBTCA: ${employeeName}
Total Time Logged: ${formatMinutes(totalMinutes)}

SUMMARY:
${categories.map(cat => `• ${cat.label}: ${formatMinutes(totals[cat.value])}`).join('\n')}

DETAILED ENTRIES:
${entries.map(entry => {
      const cat = categories.find(c => c.value === entry.category);
      return `${entry.startTime} - ${entry.endTime} (${formatMinutes(entry.duration)}) | ${cat.label}${entry.clientName ? ` | Client: ${entry.clientName}` : ''}${entry.description ? ` | ${entry.description}` : ''}`;
    }).join('\n')}

Thanks,
${employeeName}`;

    try {
      await navigator.clipboard.writeText(reportText);
      alert('Report copied to clipboard! You can now paste it into an email to Chris.');
    } catch (err) {
      alert('Could not copy to clipboard. Please use the download button instead.');
    }
  };

  const totals = getTotalsByCategory();
  const totalMinutes = Object.values(totals).reduce((sum, mins) => sum + mins, 0);

  return (
    <div className="max-w-4xl mx-auto p-4 bg-white">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="text-blue-600" size={24} />
          <h1 className="text-2xl font-bold text-blue-900">RBTCA Time Tracker</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">RBTCA Name</label>
            <select
              value={employeeName}
              onChange={(e) => setEmployeeName(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select RBTCA...</option>
              <option value="Matt">Matt</option>
              <option value="Yaria">Yaria</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              value={currentDate}
              onChange={(e) => setCurrentDate(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Add Time Entry</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
            <input
              type="time"
              value={currentEntry.startTime}
              onChange={(e) => setCurrentEntry({...currentEntry, startTime: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
            <input
              type="time"
              value={currentEntry.endTime}
              onChange={(e) => setCurrentEntry({...currentEntry, endTime: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={currentEntry.category}
              onChange={(e) => setCurrentEntry({...currentEntry, category: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select category...</option>
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Client Name (if applicable)</label>
            <input
              type="text"
              value={currentEntry.clientName}
              onChange={(e) => setCurrentEntry({...currentEntry, clientName: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Client name (for billable work)"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description (optional)</label>
            <input
              type="text"
              value={currentEntry.description}
              onChange={(e) => setCurrentEntry({...currentEntry, description: e.target.value})}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Brief description of activity"
            />
          </div>
        </div>

        <button
          onClick={addEntry}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          <Plus size={16} />
          Add Entry
        </button>
      </div>

      {entries.length > 0 && (
        <>
          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Time Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              {categories.map(cat => (
                <div key={cat.value} className={`p-3 rounded-lg ${cat.color}`}>
                  <div className="text-sm font-medium">{cat.label}</div>
                  <div className="text-lg font-bold">{formatMinutes(totals[cat.value])}</div>
                </div>
              ))}
            </div>
            <div className="text-center p-3 bg-gray-100 rounded-lg">
              <div className="text-sm text-gray-600">Total Time Logged</div>
              <div className="text-xl font-bold text-gray-900">{formatMinutes(totalMinutes)}</div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Time Entries</h2>
              <div className="flex gap-2">
                <button
                  onClick={copyToClipboard}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                >
                  <Mail size={16} />
                  Copy for Email
                </button>
                <button
                  onClick={exportData}
                  className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
                >
                  <Download size={16} />
                  Download Report
                </button>
              </div>
            </div>
            
            <div className="space-y-2">
              {entries.map(entry => {
                const cat = categories.find(c => c.value === entry.category);
                return (
                  <div key={entry.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{entry.startTime} - {entry.endTime}</span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${cat.color}`}>
                          {cat.label}
                        </span>
                        <span className="text-sm text-gray-600">({formatMinutes(entry.duration)})</span>
                      </div>
                      {entry.clientName && (
                        <div className="text-sm text-gray-600">Client: {entry.clientName}</div>
                      )}
                      {entry.description && (
                        <div className="text-sm text-gray-600">{entry.description}</div>
                      )}
                    </div>
                    <button
                      onClick={() => removeEntry(entry.id)}
                      className="text-red-600 hover:text-red-800 p-1"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TimeTracker;