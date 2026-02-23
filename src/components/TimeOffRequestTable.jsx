import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTimeOff, cancelTimeOffRequest } from '@/redux/slices/employeeDashboardSlice';
import dayjs from 'dayjs';

const STATUS_STYLE = {
  APPROVED:  'bg-[#CCFAEB] text-green-800',
  REJECTED:  'bg-[#C3555C] text-white',
  PENDING:   'bg-[#FFFEA6] text-[#39485B]',
  CANCELLED: 'bg-gray-200 text-gray-600',
};

const LEAVE_LABEL = {
  SICK:     'Sick Leave',
  CASUAL:   'Casual Leave',
  ANNUAL:   'Annual Leave',
  PERSONAL: 'Personal Leave',
};

const TimeOffRequestTable = () => {
  const dispatch = useDispatch();
  const { timeOffRequests, loading } = useSelector((s) => s.employeeDashboard);

  useEffect(() => {
    dispatch(fetchTimeOff());
  }, [dispatch]);

  const handleCancel = (id) => {
    if (window.confirm('Cancel this request?')) {
      dispatch(cancelTimeOffRequest(id));
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              {['Date Submitted', 'Leave Type', 'Dates Requested', 'Days', 'Approved By', 'Reason', 'Status', ''].map((h) => (
                <th key={h} className="px-6 py-3 text-left text-sm font-bold text-black border-r border-gray-300 last:border-r-0">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading.timeOff ? (
              <tr>
                <td colSpan={8} className="px-6 py-8 text-center text-sm text-gray-400">Loading...</td>
              </tr>
            ) : timeOffRequests.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-8 text-center text-sm text-gray-400">No time off requests found</td>
              </tr>
            ) : (
              timeOffRequests.map((entry) => (
                <tr key={entry.id}>
                  <td className="px-6 py-4 text-sm text-gray-700 border-r border-gray-200">
                    {dayjs(entry.submittedAt).format('MMM D, YYYY')}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 border-r border-gray-200">
                    {LEAVE_LABEL[entry.leaveType] || entry.leaveType}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 border-r border-gray-200">
                    {entry.startDate === entry.endDate
                      ? entry.startDate
                      : `${entry.startDate} – ${entry.endDate}`}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 border-r border-gray-200">
                    {entry.totalDays}d
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 border-r border-gray-200">
                    {entry.approvedBy || '--'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 border-r border-gray-200 max-w-[180px] truncate">
                    {entry.reason || '--'}
                  </td>
                  <td className="px-6 py-4 border-r border-gray-200">
                    <span className={`px-2 py-1 inline-flex text-xs font-medium rounded-md ${STATUS_STYLE[entry.status] || STATUS_STYLE.CANCELLED}`}>
                      {entry.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {entry.status === 'PENDING' && (
                      <button
                        onClick={() => handleCancel(entry.id)}
                        className="text-xs text-red-600 hover:text-red-800 font-medium"
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TimeOffRequestTable;
