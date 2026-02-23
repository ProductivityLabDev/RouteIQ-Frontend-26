import React, { useState } from 'react';
import { X } from 'lucide-react';

// Actions per status — API returns these exact punchStatus values
const STATUS_ACTIONS = {
  NOT_PUNCHED: [
    { action: 'punch_in',    label: 'Punch In',    color: 'bg-green-600 hover:bg-green-700' },
  ],
  PUNCHED_IN: [
    { action: 'break_start', label: 'Start Break', color: 'bg-yellow-500 hover:bg-yellow-600' },
    { action: 'punch_out',   label: 'Punch Out',   color: 'bg-[#C01824] hover:bg-red-700' },
  ],
  ON_BREAK: [
    { action: 'break_end',   label: 'End Break',   color: 'bg-yellow-500 hover:bg-yellow-600' },
  ],
  PUNCHED_OUT: [
    { action: 'punch_in',    label: 'Punch In',    color: 'bg-green-600 hover:bg-green-700' },
  ],
};

const STATUS_LABEL = {
  NOT_PUNCHED: 'Not Punched',
  PUNCHED_IN:  'Punched In',
  PUNCHED_OUT: 'Punched Out',
  ON_BREAK:    'On Break',
};

const STATUS_COLOR = {
  NOT_PUNCHED: 'text-gray-500',
  PUNCHED_IN:  'text-green-600',
  PUNCHED_OUT: 'text-red-600',
  ON_BREAK:    'text-yellow-600',
};

export default function AttendanceModal({
  isOpen,
  onClose,
  onAction,
  punchStatus = 'NOT_PUNCHED',
  isPunching  = false,
  workingHours = '0 Hr 00 Mins',
  breakHours   = '0 Hr 00 Mins',
}) {
  const [note, setNote] = useState('');

  if (!isOpen) return null;

  const actions     = STATUS_ACTIONS[punchStatus] || STATUS_ACTIONS['NOT_PUNCHED'];
  const statusLabel = STATUS_LABEL[punchStatus]   || 'Not Punched';
  const statusColor = STATUS_COLOR[punchStatus]   || 'text-gray-500';

  const handleAction = (action) => {
    onAction(action, note);
    setNote('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Mark Attendance</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={22} />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">

          {/* Current Status */}
          <div className="text-center py-2">
            <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Current Status</p>
            <span className={`text-xl font-bold ${statusColor}`}>{statusLabel}</span>
          </div>

          {/* Hours summary */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-lg p-3 text-center border border-gray-100">
              <p className="text-xs text-gray-400 mb-1">Working Hours</p>
              <p className="text-sm font-bold text-[#1F4062]">{workingHours}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 text-center border border-gray-100">
              <p className="text-xs text-gray-400 mb-1">Break Hours</p>
              <p className="text-sm font-bold text-[#1F4062]">{breakHours}</p>
            </div>
          </div>

          {/* Note / Reason field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Note / Reason <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add a note or reason..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-400 resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-2 pt-1">
            {actions.map(({ action, label, color }) => (
              <button
                key={action}
                onClick={() => handleAction(action)}
                disabled={isPunching}
                className={`w-full ${color} disabled:opacity-60 text-white font-semibold py-3 rounded-lg transition-colors`}
              >
                {isPunching ? 'Please wait...' : label}
              </button>
            ))}

            <button
              onClick={onClose}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-600 font-medium py-2.5 rounded-lg transition-colors text-sm"
            >
              Cancel
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
