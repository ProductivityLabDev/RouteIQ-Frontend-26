import React, { useState } from 'react';
import { IoMdClose } from 'react-icons/io';
import { AiOutlinePaperClip } from 'react-icons/ai';
import { useDispatch, useSelector } from 'react-redux';
import { submitTimeOff } from '@/redux/slices/employeeDashboardSlice';

const LEAVE_TYPES = [
  { value: 'SICK',     label: 'Sick Leave' },
  { value: 'CASUAL',   label: 'Casual Leave' },
  { value: 'ANNUAL',   label: 'Annual Leave' },
  { value: 'PERSONAL', label: 'Personal Leave' },
];

const TimeOffRequestModal = ({ closeModal }) => {
  const dispatch = useDispatch();
  const submitting = useSelector((s) => s.employeeDashboard.loading.submitting);

  const [form, setForm] = useState({
    leaveType: '',
    startDate: '',
    endDate:   '',
    reason:    '',
  });
  const [file, setFile] = useState(null);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    if (!form.leaveType || !form.startDate || !form.endDate) {
      return;
    }

    let payload;
    if (file) {
      payload = new FormData();
      payload.append('file', file);
      payload.append('leaveType', form.leaveType);
      payload.append('startDate', form.startDate);
      payload.append('endDate', form.endDate);
      if (form.reason) payload.append('reason', form.reason);
    } else {
      payload = {
        leaveType: form.leaveType,
        startDate: form.startDate,
        endDate:   form.endDate,
        reason:    form.reason || undefined,
      };
    }

    const result = await dispatch(submitTimeOff(payload));
    if (!result.error) closeModal();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-75 z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-medium">New Time-Off Request</h2>
            <button onClick={closeModal} className="text-black hover:text-gray-600">
              <IoMdClose className="text-xl" />
            </button>
          </div>

          {/* Leave Type */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-black mb-1">
              Leave Type <span className="text-red-500">*</span>
            </label>
            <select
              name="leaveType"
              value={form.leaveType}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-red-400"
            >
              <option value="">Choose leave type</option>
              {LEAVE_TYPES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                Start Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="startDate"
                value={form.startDate}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-red-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-1">
                End Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="endDate"
                value={form.endDate}
                min={form.startDate}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm focus:outline-none focus:ring-1 focus:ring-red-400"
              />
            </div>
          </div>

          {/* Attachment */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-black mb-1">Attachment (optional)</label>
            <label className="flex items-center justify-between border border-gray-300 rounded-md py-2 px-3 cursor-pointer text-sm text-gray-500 hover:bg-gray-50">
              {file ? file.name : 'Upload attachment'}
              <AiOutlinePaperClip className="text-black text-lg" />
              <input type="file" className="hidden" onChange={(e) => setFile(e.target.files[0] || null)} />
            </label>
          </div>

          {/* Reason */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-black mb-1">Reason (optional)</label>
            <textarea
              name="reason"
              value={form.reason}
              onChange={handleChange}
              placeholder="Add a reason..."
              rows={4}
              className="w-full border border-gray-300 rounded-md py-2 px-3 text-sm text-gray-600 focus:outline-none focus:ring-1 focus:ring-red-400 resize-none"
            />
          </div>

          {/* Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={handleSubmit}
              disabled={submitting || !form.leaveType || !form.startDate || !form.endDate}
              className="bg-[#C01824] disabled:opacity-60 text-white px-6 py-2 rounded-md text-sm font-medium"
            >
              {submitting ? 'Submitting...' : 'Submit Request'}
            </button>
            <button
              onClick={closeModal}
              className="bg-[#D3D3D9] text-black px-6 py-2 rounded-md text-sm font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TimeOffRequestModal;
