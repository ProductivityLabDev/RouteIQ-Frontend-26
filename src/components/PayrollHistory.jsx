import { moneyBag } from '@/assets';
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';

const PayrollHistory = ({ onViewPayStub }) => {
    const payrollHistory = useSelector((state) => state.employeeDashboard.payrollHistory);

    const fmt = (v) => v == null ? '--' : `$${Number(v).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    const statusClass = (status) => {
        const s = String(status || '').toLowerCase();
        if (s === 'paid') return 'bg-[#CEEFDF] text-[#0AAF60]';
        if (s === 'processed') return 'bg-[#EFF6FF] text-[#3981F7]';
        if (s === 'pending') return 'bg-[#FEEDDA] text-[#FAA745]';
        return 'bg-gray-100 text-gray-600';
    };

    return (
        <div className="bg-white rounded-lg shadow-sm p-6 mt-5">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium text-[#0A112F]">Payroll History</h2>
                <a href="#" className="text-blue-500 text-sm font-medium">See All</a>
            </div>

            <div className="rounded-md">
                <div className="grid grid-cols-4 bg-[#F5F5F5] border border-gray-300 h-full">
                    <div className="text-lg font-bold text-[#202224] border-r border-gray-300 flex items-center justify-center h-full">
                        Date
                    </div>
                    <div className="text-lg font-bold text-[#202224] border-r border-gray-300 flex items-center justify-center h-full">
                        Amount
                    </div>
                    <div className="text-lg font-bold text-[#202224] border-r border-gray-300 flex items-center justify-center h-full">
                        Status
                    </div>
                    <div className="text-lg font-bold text-[#202224] flex items-center justify-center h-full">
                        Action
                    </div>
                </div>

                {payrollHistory.map((item) => (
                    <div key={item.payrollId} className="grid grid-cols-4 py-3 px-4 items-center">
                        <div className="text-sm text-[#0A0A0A] font-normal">
                            {dayjs(item.periodStart).format('MMM D')} - {dayjs(item.periodEnd).format('MMM D, YYYY')}
                        </div>
                        <div className="text-sm text-[#0A0A0A] font-normal">{fmt(item.netSalary)}</div>
                        <div>
                            <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${statusClass(item.status)}`}>
                                {item.status ?? '--'}
                            </span>
                        </div>
                        <div>
                            <button
                                onClick={() => onViewPayStub?.(item.payrollId)}
                                className="flex items-center text-sm bg-white border border-gray-200 rounded-md px-3 py-1 text-[#C01824]"
                            >
                                <img src={moneyBag} />
                                <span>View Pay Stub</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PayrollHistory;
