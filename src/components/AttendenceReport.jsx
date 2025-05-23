import React from 'react';
import { attendanceReportData } from '@/data/dummyData';

export default function AttendanceReport() {
    return (
        <div className=" p-4 mt-[-20px]">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-[#122539] text-lg font-medium">Attendance Report</h1>
                <button className="text-[#1F4062] text-sm">View all</button>
            </div>

            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-[#F5F5F5]">
                            <th className="px-6 py-3 text-left text-sm font-bold text-gray-800 border-r border-black-200">Date</th>
                            <th className="px-6 py-3 text-left text-sm font-bold text-gray-800 border-r border-black-200">Punch In</th>
                            <th className="px-6 py-3 text-left text-sm font-bold text-gray-800 border-r border-black-200">Punched Out</th>
                            <th className="px-6 py-3 text-left text-sm font-bold text-gray-800 border-r border-black-200">Break Hours</th>
                            <th className="px-6 py-3 text-left text-sm font-bold text-gray-800">Work Hours</th>
                        </tr>
                    </thead>
                    <tbody>
                        {attendanceReportData.map((row, index) => (
                            <tr key={index} className="border-t border-gray-200">
                                <td className="px-6 py-4 font-medium text-sm text-black-700 border-r border-gray-200">{row.date}</td>
                                <td className="px-6 py-4 font-medium text-sm text-black-700 border-r border-gray-200">{row.punchIn}</td>
                                <td className="px-6 py-4 font-medium text-sm text-black-700 border-r border-gray-200">{row.punchedOut}</td>
                                <td className="px-6 py-4 font-medium text-sm text-black-700 border-r border-gray-200">{row.breakHours}</td>
                                <td className="px-6 py-4 font-medium text-sm text-black-700">{row.workHours}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}