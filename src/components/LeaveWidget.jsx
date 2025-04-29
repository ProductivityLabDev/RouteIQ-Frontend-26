import React from 'react';

const LeaveWidget = () => {
    return (
        <div className="flex flex-row justify-between gap-4 w-full">
            {/* Total leave allowance */}
            <div className="flex-1 bg-white rounded-md shadow-sm p-4">
                <div className="text-gray-500 text-sm mb-2">Total leave allowance</div>
                <div className="text-2xl font-semibold mb-2">34</div>
                <div className="flex text-xs">
                    <span className="text-gray-500 mr-2">Paid: <span className="font-medium text-[#1158B7]">31</span></span>
                    <span className="text-gray-500">Unpaid: <span className="font-medium text-[#D32940]">3</span></span>
                </div>
            </div>

            {/* Total leave taken */}
            <div className="flex-1 bg-white rounded-md shadow-sm p-4">
                <div className="text-gray-500 text-sm mb-2">Total leave taken</div>
                <div className="text-2xl font-semibold mb-2">20</div>
                <div className="flex text-xs">
                    <span className="text-gray-500 mr-2">Paid: <span className="font-medium text-[#1158B7]">12</span></span>
                    <span className="text-gray-500">Unpaid: <span className="font-medium text-[#D32940]">8</span></span>
                </div>
            </div>

            {/* Total leave available */}
            <div className="flex-1 bg-white rounded-md shadow-sm p-4">
                <div className="text-gray-500 text-sm mb-2">Total leave available</div>
                <div className="text-2xl font-semibold mb-2">50</div>
                <div className="flex text-xs">
                    <span className="text-gray-500 mr-2">Paid: <span className="font-medium text-[#1158B7]">50</span></span>
                    <span className="text-gray-500">Unpaid: <span className="font-medium text-[#D32940]">0</span></span>
                </div>
            </div>

            {/* Leave request pending */}
            <div className="flex-1 bg-white rounded-md shadow-sm p-4">
                <div className="text-gray-500 text-sm mb-2">Leave request pending</div>
                <div className="text-2xl font-semibold mb-2">20</div>
                <div className="flex text-xs">
                    <span className="text-gray-500 mr-2">Paid: <span className="font-medium text-[#1158B7]">10</span></span>
                    <span className="text-gray-500">Unpaid: <span className="font-medium text-[#D32940]">10</span></span>
                </div>
            </div>
        </div>
    );
};

export default LeaveWidget;