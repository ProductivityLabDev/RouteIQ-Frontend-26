import { moneyBag } from '@/assets';
import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';

const PayrollHistory = ({ onViewPayStub }) => {
    const [showAll, setShowAll] = useState(false);
    const payrollHistory = useSelector((state) => state.employeeDashboard.payrollHistory);

    const fmt = (v) => v == null ? '--' : `$${Number(v).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    const statusClass = (status) => {
        const s = String(status || '').toLowerCase();
        if (s === 'paid') return 'bg-[#CEEFDF] text-[#0AAF60]';
        if (s === 'processed') return 'bg-[#EFF6FF] text-[#3981F7]';
        if (s === 'pending') return 'bg-[#FEEDDA] text-[#FAA745]';
        return 'bg-gray-100 text-gray-600';
    };
    const records = Array.isArray(payrollHistory) ? payrollHistory : [];
    const visibleRecords = useMemo(
        () => (showAll ? records : records.slice(0, 5)),
        [records, showAll]
    );
    const canExpand = records.length > 5;
    const formatRange = (start, end) => {
        if (!start || !end) return '--';
        const startDate = dayjs(start);
        const endDate = dayjs(end);
        if (!startDate.isValid() || !endDate.isValid()) return '--';

        if (startDate.year() === endDate.year()) {
            if (startDate.month() === endDate.month()) {
                return `${startDate.format('MMM D')} - ${endDate.format('D, YYYY')}`;
            }
            return `${startDate.format('MMM D')} - ${endDate.format('MMM D, YYYY')}`;
        }

        return `${startDate.format('MMM D, YYYY')} - ${endDate.format('MMM D, YYYY')}`;
    };

    return (
        <div className="bg-white rounded-lg shadow-sm p-6 mt-5">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-[#0A112F]">Payroll History</h2>
                {canExpand ? (
                    <button
                        type="button"
                        onClick={() => setShowAll((prev) => !prev)}
                        className="text-[#1D4ED8] text-sm font-medium transition hover:text-[#C01824]"
                    >
                        {showAll ? 'Show Less' : 'See All'}
                    </button>
                ) : null}
            </div>

            <div className="overflow-hidden rounded-xl border border-[#E9E3D8]">
                <div className="grid grid-cols-4 bg-[#F8F7F4] h-full">
                    <div className="px-4 py-3 text-base font-bold text-[#202224] border-r border-[#E9E3D8] flex items-center justify-center h-full">
                        Date
                    </div>
                    <div className="px-4 py-3 text-base font-bold text-[#202224] border-r border-[#E9E3D8] flex items-center justify-center h-full">
                        Amount
                    </div>
                    <div className="px-4 py-3 text-base font-bold text-[#202224] border-r border-[#E9E3D8] flex items-center justify-center h-full">
                        Status
                    </div>
                    <div className="px-4 py-3 text-base font-bold text-[#202224] flex items-center justify-center h-full">
                        Action
                    </div>
                </div>

                {visibleRecords.length === 0 ? (
                    <div className="px-6 py-10 text-center text-sm text-gray-400">
                        No payroll history found
                    </div>
                ) : (
                    visibleRecords.map((item, index) => (
                        <div
                            key={item.payrollId}
                            className={`grid grid-cols-4 items-center px-4 py-4 transition hover:bg-[#FCFBF8] ${index !== 0 ? 'border-t border-[#F0EBE2]' : ''}`}
                        >
                            <div className="text-sm text-[#0A0A0A] font-medium text-center">
                                {formatRange(item.periodStart, item.periodEnd)}
                            </div>
                            <div className="text-sm text-[#0A0A0A] font-medium text-center">{fmt(item.netSalary)}</div>
                            <div className="flex justify-center">
                                <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${statusClass(item.status)}`}>
                                    {item.status ?? '--'}
                                </span>
                            </div>
                            <div className="flex justify-center">
                                <button
                                    type="button"
                                    onClick={() => onViewPayStub?.(item.payrollId)}
                                    className="inline-flex items-center gap-2 text-sm bg-white border border-[#E5E7EB] rounded-lg px-3 py-2 text-[#C01824] transition hover:border-[#F2C6CB] hover:bg-[#FFF7F8]"
                                >
                                    <img src={moneyBag} alt="pay stub" className="h-4 w-4 object-contain" />
                                    <span>View Pay Stub</span>
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
            {!showAll && canExpand ? (
                <div className="mt-3 text-xs font-medium text-[#6B7280]">
                    Showing {visibleRecords.length} of {records.length} payroll records
                </div>
            ) : null}
        </div>
    );
};

export default PayrollHistory;
