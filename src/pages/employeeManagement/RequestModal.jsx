import React, { useEffect } from 'react';
import dayjs from 'dayjs';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDriverTimeOff, approveTimeOffRequest, rejectTimeOffRequest } from '@/redux/slices/payrollSlice';

const fmtDate = (val) => (val ? dayjs(val).format('MMM DD, YYYY') : '--');
const fmtDateTime = (val) => (val ? dayjs(val).format('MMM DD, YYYY hh:mm A') : '--');
const fmtText = (val) => (val !== undefined && val !== null && val !== '' ? val : '--');
const fmtLeaveType = (val) =>
  val
    ? String(val)
        .replaceAll('_', ' ')
        .toLowerCase()
        .replace(/\b\w/g, (ch) => ch.toUpperCase())
    : '--';

export default function RequestModal({ employeeId, closeModal }) {
  const dispatch = useDispatch();
  const { driverTimeOff, loading } = useSelector((s) => s.payroll);

  useEffect(() => {
    if (!employeeId) return;
    dispatch(fetchDriverTimeOff(employeeId));
  }, [dispatch, employeeId]);

  const allRequests = [
    ...(driverTimeOff?.pending || []),
    ...(driverTimeOff?.approvalHistory || []),
  ];

  const pending = allRequests.filter((r) => (r.status || '').toLowerCase() === 'pending');
  const history = allRequests.filter((r) => (r.status || '').toLowerCase() !== 'pending');

  const refreshTimeOff = () => {
    if (!employeeId) return;
    dispatch(fetchDriverTimeOff(employeeId));
  };

  const handleApprove = async (requestId) => {
    await dispatch(approveTimeOffRequest({ requestId, note: 'Approved' }));
    refreshTimeOff();
  };

  const handleReject = async (requestId) => {
    await dispatch(rejectTimeOffRequest({ requestId, note: 'Rejected' }));
    refreshTimeOff();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[9999]">
      <div className="bg-white w-full max-w-6xl p-6 rounded-md shadow-lg relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 text-gray-700 text-2xl font-bold"
        >
          x
        </button>

        <h2 className="text-2xl font-bold mb-6">Time-Off Request</h2>

        {loading.timeOff ? (
          <div className="py-12 text-center text-gray-500">Loading...</div>
        ) : (
          <>
            <div className="overflow-x-auto mb-8">
              <h3 className="text-lg font-semibold mb-3">Pending</h3>
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="border border-gray-200 bg-gray-100 py-3 px-3 text-left">Requested On</th>
                    <th className="border border-gray-200 bg-gray-100 py-3 px-3 text-left">Leave From</th>
                    <th className="border border-gray-200 bg-gray-100 py-3 px-3 text-left">Leave To</th>
                    <th className="border border-gray-200 bg-gray-100 py-3 px-3 text-left">Total Days</th>
                    <th className="border border-gray-200 bg-gray-100 py-3 px-3 text-left">Type</th>
                    <th className="border border-gray-200 bg-gray-100 py-3 px-3 text-left">Punch In</th>
                    <th className="border border-gray-200 bg-gray-100 py-3 px-3 text-left">Punched Out</th>
                    <th className="border border-gray-200 bg-gray-100 py-3 px-3 text-left">Work Hours</th>
                    <th className="border border-gray-200 bg-gray-100 py-3 px-3 text-left">Reason</th>
                    <th className="border border-gray-200 bg-gray-100 py-3 px-3 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {pending.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="border border-gray-200 py-4 text-center text-gray-500">
                        No pending requests.
                      </td>
                    </tr>
                  ) : (
                    pending.map((r) => (
                      <tr key={r.requestId}>
                        <td className="border border-gray-200 py-3 px-3">{fmtDateTime(r.createdAt)}</td>
                        <td className="border border-gray-200 py-3 px-3">{fmtDate(r.startDate)}</td>
                        <td className="border border-gray-200 py-3 px-3">{fmtDate(r.endDate)}</td>
                        <td className="border border-gray-200 py-3 px-3">{r.totalDays ?? '--'}</td>
                        <td className="border border-gray-200 py-3 px-3">{fmtLeaveType(r.requestType)}</td>
                        <td className="border border-gray-200 py-3 px-3">{fmtText(r.punchIn)}</td>
                        <td className="border border-gray-200 py-3 px-3">{fmtText(r.punchOut)}</td>
                        <td className="border border-gray-200 py-3 px-3">
                          {r.workHours != null ? `${r.workHours}h` : '--'}
                        </td>
                        <td className="border border-gray-200 py-3 px-3">{fmtText(r.reason)}</td>
                        <td className="border border-gray-200 py-3 px-3">
                          <div className="flex gap-2">
                            <button
                              className="bg-green-500 text-white px-3 py-1 rounded text-sm"
                              onClick={() => handleApprove(r.requestId)}
                              disabled={loading.approveReject}
                            >
                              Approve
                            </button>
                            <button
                              className="bg-red-600 text-white px-3 py-1 rounded text-sm"
                              onClick={() => handleReject(r.requestId)}
                              disabled={loading.approveReject}
                            >
                              Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <h3 className="text-lg font-semibold mb-3">Approval History</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="border border-gray-200 bg-gray-100 py-3 px-3 text-left">Request ID</th>
                    <th className="border border-gray-200 bg-gray-100 py-3 px-3 text-left">Requested On</th>
                    <th className="border border-gray-200 bg-gray-100 py-3 px-3 text-left">Leave From</th>
                    <th className="border border-gray-200 bg-gray-100 py-3 px-3 text-left">Leave To</th>
                    <th className="border border-gray-200 bg-gray-100 py-3 px-3 text-left">Total Days</th>
                    <th className="border border-gray-200 bg-gray-100 py-3 px-3 text-left">Type</th>
                    <th className="border border-gray-200 bg-gray-100 py-3 px-3 text-left">Status</th>
                    <th className="border border-gray-200 bg-gray-100 py-3 px-3 text-left">Approved By</th>
                    <th className="border border-gray-200 bg-gray-100 py-3 px-3 text-left">Approved At</th>
                    <th className="border border-gray-200 bg-gray-100 py-3 px-3 text-left">Reason</th>
                  </tr>
                </thead>
                <tbody>
                  {history.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="border border-gray-200 py-4 text-center text-gray-500">
                        No history.
                      </td>
                    </tr>
                  ) : (
                    history.map((h) => (
                      <tr key={h.requestId}>
                        <td className="border border-gray-200 py-3 px-3">{h.requestId}</td>
                        <td className="border border-gray-200 py-3 px-3">{fmtDateTime(h.createdAt)}</td>
                        <td className="border border-gray-200 py-3 px-3">{fmtDate(h.startDate)}</td>
                        <td className="border border-gray-200 py-3 px-3">{fmtDate(h.endDate)}</td>
                        <td className="border border-gray-200 py-3 px-3">{h.totalDays ?? '--'}</td>
                        <td className="border border-gray-200 py-3 px-3">{fmtLeaveType(h.requestType)}</td>
                        <td className="border border-gray-200 py-3 px-3">{fmtText(h.status)}</td>
                        <td className="border border-gray-200 py-3 px-3">{fmtText(h.approvedBy)}</td>
                        <td className="border border-gray-200 py-3 px-3">{fmtDateTime(h.approvedAt)}</td>
                        <td className="border border-gray-200 py-3 px-3">{fmtText(h.reason)}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
