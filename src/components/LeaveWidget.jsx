import React from 'react';
import { useSelector } from 'react-redux';

const LeaveWidget = () => {
    const pto = useSelector((state) => state.employeeDashboard.insights?.pto);

    const allowance = pto?.allowanceDays ?? '--';
    const used      = pto?.usedDays      ?? '--';
    const available = pto?.availableDays ?? '--';
    const pending   = pto?.pendingCount  ?? '--';

    return (
        <div className="flex flex-row justify-between gap-4 w-full">
            {/* Total leave allowance */}
            <div className="flex-1 bg-white rounded-md shadow-sm p-4">
                <div className="text-[#666666] text-md mb-2 font-medium">Total leave allowance</div>
                <div className="text-2xl font-semibold mb-2">{allowance}</div>
                <div className="flex text-xs">
                    <span className="text-gray-500 mr-2">Paid: <span className="font-medium text-[#1158B7]">{allowance}</span></span>
                    <span className="text-gray-500">Unpaid: <span className="font-medium text-[#D32940]">0</span></span>
                </div>
            </div>

            {/* Total leave taken */}
            <div className="flex-1 bg-white rounded-md shadow-sm p-4">
                <div className="text-[#666666] text-md font-medium mb-2">Total leave taken</div>
                <div className="text-2xl font-semibold mb-2">{used}</div>
                <div className="flex text-xs">
                    <span className="text-gray-500 mr-2">Paid: <span className="font-medium text-[#1158B7]">{used}</span></span>
                    <span className="text-gray-500">Unpaid: <span className="font-medium text-[#D32940]">0</span></span>
                </div>
            </div>

            {/* Total leave available */}
            <div className="flex-1 bg-white rounded-md shadow-sm p-4">
                <div className="text-[#666666] text-md font-medium mb-2">Total leave available</div>
                <div className="text-2xl font-semibold mb-2">{available}</div>
                <div className="flex text-xs">
                    <span className="text-gray-500 mr-2">Paid: <span className="font-medium text-[#1158B7]">{available}</span></span>
                    <span className="text-gray-500">Unpaid: <span className="font-medium text-[#D32940]">0</span></span>
                </div>
            </div>

            {/* Leave request pending */}
            <div className="flex-1 bg-white rounded-md shadow-sm p-4">
                <div className="text-[#666666] text-md font-medium mb-2">Leave request pending</div>
                <div className="text-2xl font-semibold mb-2">{pending}</div>
                <div className="flex text-xs">
                    <span className="text-gray-500 mr-2">Paid: <span className="font-medium text-[#1158B7]">{pending}</span></span>
                    <span className="text-gray-500">Unpaid: <span className="font-medium text-[#D32940]">0</span></span>
                </div>
            </div>
        </div>
    );
};

export default LeaveWidget;