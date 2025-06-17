import React, { useState } from 'react';
import { X, Calendar } from 'lucide-react';

export default function AttendanceModal({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    employee: '',
    date: '',
    punchInTime: '',
    punchOutTime: '',
    reasonNote: ''
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    onClose(); // Close modal
    setTimeout(() => {
      console.log('Saving attendance data:', formData);
    }, 300);
  };

  const handleCancel = () => {
    onClose();
  };

  // Don't render if modal is closed
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">Add Attendance</h2>
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form Content */}
        <div className="p-6 space-y-4">
          {/* Employee */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Employee</label>
            <input
              type="text"
              placeholder="Placeholder"
              value={formData.employee}
              onChange={(e) => handleInputChange('employee', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 placeholder-gray-400"
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Date</label>
            <div className="relative">
              <input
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 placeholder-gray-400"
              />
              <Calendar
                size={18}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
              />
            </div>
          </div>

          {/* Times */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Punch-In Time</label>
              <input
                type="time"
                value={formData.punchInTime}
                onChange={(e) => handleInputChange('punchInTime', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 placeholder-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Punch-Out Time</label>
              <input
                type="time"
                value={formData.punchOutTime}
                onChange={(e) => handleInputChange('punchOutTime', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 placeholder-gray-400"
              />
            </div>
          </div>

          {/* Reason Note */}
          <div>
            <textarea
              placeholder="Reason note"
              value={formData.reasonNote}
              onChange={(e) => handleInputChange('reasonNote', e.target.value)}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 placeholder-gray-400 resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 p-6 border-t bg-gray-50 rounded-b-lg">
          <button
            onClick={handleSave}
            className="bg-[#C01824] text-white px-6 py-2 rounded-md hover:bg-[#C01824] transition-colors font-medium"
          >
            Save
          </button>
          <button
            onClick={handleCancel}
            className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400 transition-colors font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
