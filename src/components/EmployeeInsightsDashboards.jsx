import { useState } from 'react';
import { BarChart, Bar, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { MdKeyboardArrowDown } from "react-icons/md";
import { useSelector } from 'react-redux';
import dayjs from 'dayjs';

const ptoData = [
    { name: 'Jan', available: 150, used: 80 },
    { name: 'Feb', available: 180, used: 40 },
    { name: 'Mar', available: 60, used: 40 },
    { name: 'Apr', available: 60, used: 40 },
];

export default function EmployeeInsights() {
    const [year, setYear] = useState(dayjs().year().toString());
    const [month, setMonth] = useState(dayjs().format('MMMM'));

    const { dashboardData } = useSelector((state) => state.employeeDashboard);
    const monthly = dashboardData?.monthly;

    const totalHours = monthly?.totalHours ?? 0;
    const totalDays = monthly?.totalDays ?? 0;

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
                        <div className="flex items-center gap-1 border rounded px-3 py-1 bg-white">
                            <span>{year}</span>
                            <MdKeyboardArrowDown size={16} />
                        </div>
                    </div>
                    <div className="relative inline-block text-left">
                        <div className="flex items-center gap-1 border rounded px-3 py-1 bg-white">
                            <span>{month}</span>
                            <MdKeyboardArrowDown size={16} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4">
                {/* Take Home */}
                <div className="bg-white rounded-lg p-4 shadow-sm">
                    <p className="text-sm font-bold text-gray-600 mb-2">Take Home</p>
                    <div className="flex items-center justify-between">
                        <h2 className="text-3xl font-bold xl:text-[22px]">--</h2>
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
                        <h2 className="text-3xl xl:text-[22px] font-bold">{totalHours}h</h2>
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
                            <p className="text-sm mb-1">-- Hours Available</p>
                            <p className="text-sm mb-1">-- Hours Used</p>
                            <p className="text-sm">-- Total</p>
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
                            <p className="text-sm mb-1">{totalHours} Trip Hours</p>
                            <p className="text-sm mb-1">{totalDays} # of Days</p>
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
