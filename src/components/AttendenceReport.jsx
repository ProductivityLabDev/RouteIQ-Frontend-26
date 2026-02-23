import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAttendanceReport } from '@/redux/slices/employeeDashboardSlice';
import dayjs from 'dayjs';

export default function AttendanceReport() {
    const dispatch = useDispatch();
    const employeeDashboard = useSelector((state) => state.employeeDashboard);
    const attendanceReport = employeeDashboard?.attendanceReport ?? null;
    const loading = employeeDashboard?.loading ?? { dashboard: false, punch: false, report: false };

    useEffect(() => {
        dispatch(fetchAttendanceReport({}));
    }, [dispatch]);

    const records = attendanceReport?.records || [];

    // Handles both "HH:mm:ss" time-only strings and full ISO datetimes
    const formatTime = (val) => {
        if (!val) return '--';
        if (/^\d{2}:\d{2}/.test(val)) return val.slice(0, 5);  // "11:38:29" → "11:38"
        const d = dayjs(val);
        return d.isValid() ? d.format('HH:mm') : '--';
    };

    // Convert "HH:mm:ss" to total minutes
    const toMins = (timeStr) => {
        if (!timeStr) return 0;
        const parts = timeStr.split(':').map(Number);
        return parts[0] * 60 + (parts[1] || 0);
    };

    return (
        <div className="p-4 mt-[-20px]">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-[#122539] text-lg font-medium">Attendance Report</h1>
                <button className="text-[#1F4062] text-sm">View all</button>
            </div>

            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-[#F5F5F5]">
                            <th className="px-6 py-3 text-left text-sm font-bold text-gray-800 border-r border-gray-200">Date</th>
                            <th className="px-6 py-3 text-left text-sm font-bold text-gray-800 border-r border-gray-200">Punch In</th>
                            <th className="px-6 py-3 text-left text-sm font-bold text-gray-800 border-r border-gray-200">Punched Out</th>
                            <th className="px-6 py-3 text-left text-sm font-bold text-gray-800 border-r border-gray-200">Break Hours</th>
                            <th className="px-6 py-3 text-left text-sm font-bold text-gray-800">Work Hours</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading.report ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-sm text-gray-400">
                                    Loading...
                                </td>
                            </tr>
                        ) : records.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-sm text-gray-400">
                                    No attendance records found
                                </td>
                            </tr>
                        ) : (
                            records.map((row, index) => {
                                const breakMins = row.breakStart && row.breakEnd
                                    ? toMins(row.breakEnd) - toMins(row.breakStart)
                                    : null;
                                const breakDuration = breakMins !== null && breakMins >= 0
                                    ? `${breakMins}m`
                                    : '--';

                                return (
                                    <tr key={row.shiftId ?? index} className="border-t border-gray-200">
                                        <td className="px-6 py-4 font-medium text-sm text-gray-700 border-r border-gray-200">
                                            {row.date}
                                        </td>
                                        <td className="px-6 py-4 font-medium text-sm text-gray-700 border-r border-gray-200">
                                            {formatTime(row.punchIn)}
                                        </td>
                                        <td className="px-6 py-4 font-medium text-sm text-gray-700 border-r border-gray-200">
                                            {formatTime(row.punchOut)}
                                        </td>
                                        <td className="px-6 py-4 font-medium text-sm text-gray-700 border-r border-gray-200">
                                            {breakDuration}
                                        </td>
                                        <td className="px-6 py-4 font-medium text-sm text-gray-700">
                                            {row.duration || '--'}
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
