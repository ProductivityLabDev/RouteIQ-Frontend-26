import React from 'react';

const PayRateCard = () => {
    return (
        <div className="bg-stone-100 p-1 mt-3">
            <h2 className="text-lg font-medium text-gray-800 mb-4">Pay Rate</h2>

            <div className="bg-white rounded-lg shadow-sm">
                <div className="grid grid-cols-5 divide-x divide-gray-200">
                    {/* Employee Type */}
                    <div className="p-4">
                        <div className="text-gray-500 text-sm mb-2">Employee Type</div>
                        <div className="font-medium text-lg">W-2</div>
                    </div>

                    {/* Pay Frequency */}
                    <div className="p-4">
                        <div className="text-gray-500 text-sm mb-2">Pay Frequency</div>
                        <div className="font-medium text-lg">Bi-Weekly</div>
                    </div>

                    {/* Pay Type */}
                    <div className="p-4">
                        <div className="text-gray-500 text-sm mb-2">Pay Type</div>
                        <div className="font-medium text-lg">Hourly</div>
                    </div>

                    {/* Hourly Rate */}
                    <div className="p-4">
                        <div className="text-gray-500 text-sm mb-2">Hourly Rate</div>
                        <div className="font-medium text-lg">$120</div>
                    </div>

                    {/* DOL Status */}
                    <div className="p-4">
                        <div className="text-gray-500 text-sm mb-2">DOL Status</div>
                        <div className="font-medium text-lg">Part Time</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PayRateCard;