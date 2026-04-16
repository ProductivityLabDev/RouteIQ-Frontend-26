import { useEffect, useMemo, useState } from 'react';
import { BarChart, Bar, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { MdKeyboardArrowDown } from "react-icons/md";
import { useDispatch, useSelector } from 'react-redux';
import dayjs from 'dayjs';
import { fetchInsights } from '@/redux/slices/employeeDashboardSlice';

const MONTH_OPTIONS = [
    { label: 'January', value: 1 },
    { label: 'February', value: 2 },
    { label: 'March', value: 3 },
    { label: 'April', value: 4 },
    { label: 'May', value: 5 },
    { label: 'June', value: 6 },
    { label: 'July', value: 7 },
    { label: 'August', value: 8 },
    { label: 'September', value: 9 },
    { label: 'October', value: 10 },
    { label: 'November', value: 11 },
    { label: 'December', value: 12 },
];

const ptoData = [
    { name: 'Jan', available: 150, used: 80 },
    { name: 'Feb', available: 180, used: 40 },
    { name: 'Mar', available: 60, used: 40 },
    { name: 'Apr', available: 60, used: 40 },
];

export default function EmployeeInsights() {
    const dispatch = useDispatch();
    const [year, setYear] = useState(dayjs().year());
    const [month, setMonth] = useState(dayjs().month() + 1);

    const { dashboardData, insights, loading } = useSelector((state) => state.employeeDashboard);
    const monthly = dashboardData?.monthly;
    const monthOptions = useMemo(() => MONTH_OPTIONS, []);
    const yearOptions = useMemo(() => {
        const currentYear = dayjs().year();
        return Array.from({ length: 5 }, (_, index) => currentYear - 2 + index);
    }, []);

    useEffect(() => {
        dispatch(fetchInsights({ month, year }));
    }, [dispatch, month, year]);

    const totalHours = monthly?.totalHours ?? 0;

    const takeHome   = insights?.takeHome  ?? null;
    const ytd        = insights?.ytd       ?? null;
    const pto        = insights?.pto       ?? null;
    const ytdTrips   = insights?.ytdTrips  ?? null;

    const fmt = (v) => v == null ? '--' : `$${Number(v).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    // Donut chart: filled vs empty based on hours worked this month (max ~160h)
    const hoursUsed = Math.min(totalHours, 160);
    const data = [
        { name: 'Used', value: hoursUsed || 50 },
        { name: 'Remaining', value: Math.max(160 - hoursUsed, 0) || 50 },
    ];

    const COLORS = ['#DC2626', '#000000'];

    return (
        <div className="w-full max-w-screen-xl mx-auto px-4 py-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-2">
                <h1 className="text-xl font-medium text-black">Insights</h1>
                <div className="flex gap-2">
                    <div className="relative inline-block text-left">
                        <select
                            value={year}
                            onChange={(e) => setYear(Number(e.target.value))}
                            className="appearance-none border rounded px-3 py-1.5 bg-white pr-8 text-sm text-[#141516] outline-none"
                        >
                            {yearOptions.map((optionYear) => (
                                <option key={optionYear} value={optionYear}>
                                    {optionYear}
                                </option>
                            ))}
                        </select>
                        <MdKeyboardArrowDown size={16} className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-500" />
                    </div>
                    <div className="relative inline-block text-left">
                        <select
                            value={month}
                            onChange={(e) => setMonth(Number(e.target.value))}
                            className="appearance-none border rounded px-3 py-1.5 bg-white pr-8 text-sm text-[#141516] outline-none"
                        >
                            {monthOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <MdKeyboardArrowDown size={16} className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-500" />
                    </div>
                </div>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4">
                {/* Take Home */}
                <div className="bg-white rounded-lg p-4 shadow-sm">
                    <p className="text-sm font-bold text-gray-600 mb-2">Take Home</p>
                    <div className="flex items-center justify-between">
                        <h2 className="text-3xl font-bold xl:text-[22px]">{loading?.insights ? '...' : fmt(takeHome)}</h2>
                        <div className="w-24 h-24">
                            <PieChart width={96} height={96}>
                                <Pie
                                    data={data}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={30}
                                    outerRadius={48}
                                    startAngle={90}
                                    endAngle={-270}
                                    dataKey="value"
                                >
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index]} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </div>
                    </div>
                </div>

                {/* YTD */}
                <div className="bg-white rounded-lg p-4 shadow-sm">
                    <p className="text-sm font-bold text-gray-600 mb-2">YTD</p>
                    <div className="flex items-center justify-between">
                        <h2 className="text-3xl xl:text-[22px] font-bold">{loading?.insights ? '...' : fmt(ytd)}</h2>
                        <div className="w-24 h-24">
                            <PieChart width={96} height={96}>
                                <Pie
                                    data={data}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={30}
                                    outerRadius={48}
                                    startAngle={90}
                                    endAngle={-270}
                                    dataKey="value"
                                >
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index]} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </div>
                    </div>
                </div>

                {/* PTO */}
                <div className="bg-white rounded-lg p-4 shadow-sm">
                    <p className="text-sm font-bold text-gray-600 mb-2">Total PTO</p>
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                        <div>
                            <p className="text-sm mb-1">{pto?.availableDays ?? '--'} Days Available</p>
                            <p className="text-sm mb-1">{pto?.usedDays ?? '--'} Days Used</p>
                            <p className="text-sm">{pto?.allowanceDays ?? '--'} Total</p>
                        </div>
                        <div className="w-full lg:w-40 h-[100px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={ptoData} barGap={2}>
                                    <Bar dataKey="available" fill="#000000" />
                                    <Bar dataKey="used" fill="#E53E3E" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Trips */}
                <div className="bg-white rounded-lg p-4 shadow-sm">
                    <p className="text-sm font-bold text-gray-600 mb-2">YTD # of Trips</p>
                    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                        <div>
                            <p className="text-sm mb-1">{ytdTrips?.hours ?? '--'} Trip Hours</p>
                            <p className="text-sm mb-1">{ytdTrips?.days ?? '--'} # of Days</p>
                        </div>
                        <div className="w-full lg:w-40 h-[100px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={ptoData} barGap={2}>
                                    <Bar dataKey="used" fill="#E53E3E" />
                                    <Bar dataKey="available" fill="#000000" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
