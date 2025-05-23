import { timeEntries } from '@/data/dummyData';
import React from 'react';

const TimeOffRequestTable = () => {

    const getStatusColor = (status) => {
        switch (status) {
            case 'Approved':
                return 'bg-[#CCFAEB] text-green-800';
            case 'Rejected':
                return 'bg-[#C3555C] text-[#fff]';
            case 'Pending':
                return 'bg-[#FFFEA6] text-[#39485B]';
            default:
                return 'bg-[#CCFAEB] text-gray-800';
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-sm font-bold text-black-800 border-r border-gray-400">
                            Date 
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-sm font-bold text-black-800 border-r border-gray-400">
                            Punch In
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-sm font-bold text-black-800 border-r border-gray-400">
                            Punched Out
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-sm font-bold text-black-800 border-r border-gray-400">
                            Work Hours
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-sm font-bold text-black-800">
                            Status
                            </th>
                        </tr>
                        </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {timeEntries.map((entry, index) => (
                            <tr key={index}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-black-700">
                                    {entry.date}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-black-700">
                                    {entry.punchIn}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-black-700">
                                    {entry.punchedOut}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-black-700">
                                    {entry.workHours}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-medium rounded-md ${getStatusColor(entry.status)}`}>
                                        {entry.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TimeOffRequestTable;