import React from 'react';
import { useSelector } from 'react-redux';

const PayRateCard = () => {
    const payroll  = useSelector((state) => state.employeeDashboard.payroll);
    const insights = useSelector((state) => state.employeeDashboard.insights);

    const payCycle   = payroll?.employee?.payCycle   ?? '--';
    const payType    = payroll?.employee?.payType    ?? '--';
    const position   = payroll?.employee?.position   ?? '--';
    const hourlyRate = insights?.payRate?.hourlyRate != null
        ? `$${Number(insights.payRate.hourlyRate).toLocaleString('en-US')}`
        : '--';

    return (
        <div className="bg-stone-100 p-1 mt-3">
            <h2 className="text-lg font-semibold text-[#0A112F] mb-4">Pay Rate</h2>

            <div className="bg-white rounded-lg shadow-sm">
                <div className="grid grid-cols-5 divide-x divide-gray-200">
                    {/* Employee Type */}
                    <div className="p-4">
                        <div className="text-[#666666] text-md font-mediummb-2">Employee Type</div>
                        <div className="font-medium text-lg">W-2</div>
                    </div>

                    {/* Pay Frequency */}
                    <div className="p-4">
                        <div className="text-[#666666] text-md font-medium mb-2">Pay Frequency</div>
                        <div className="font-medium text-lg">{payCycle}</div>
                    </div>

                    {/* Pay Type */}
                    <div className="p-4">
                        <div className="text-[#666666] text-md font-medium mb-2">Pay Type</div>
                        <div className="font-medium text-lg">{payType}</div>
                    </div>

                    {/* Hourly Rate */}
                    <div className="p-4">
                        <div className="text-[#666666] text-md font-medium mb-2">Hourly Rate</div>
                        <div className="font-medium text-lg">{hourlyRate}</div>
                    </div>

                    {/* DOL Status */}
                    <div className="p-4">
                        <div className="text-[#666666] text-md font-medium mb-2">DOL Status</div>
                        <div className="font-medium text-lg">{position}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PayRateCard;