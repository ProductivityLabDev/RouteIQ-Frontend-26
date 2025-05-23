import { useState } from 'react';
import { BarChart, Bar, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { MdKeyboardArrowDown } from "react-icons/md";

// Sample data for charts
const ptoData = [
    { name: 'Jan', available: 150, used: 80 },
    { name: 'Feb', available: 180, used: 40 },
    { name: 'Mar', available: 60, used: 40 },
    { name: 'Apr', available: 60, used: 40 },
    // { name: 'May', available: 45, used: 20 },
];

const tripsData = [
    { name: 'Jan', trips: 30 },
    { name: 'Feb', trips: 38 },
    { name: 'Mar', trips: 25 },
    { name: 'Apr', trips: 30 },
    { name: 'May', trips: 42 },
];


export default function EmployeeInsights() {
    const [year, setYear] = useState('2024');
    const [month, setMonth] = useState('February');
    const data = [
        { name: 'Used', value: 50 },
        { name: 'Remaining', value: 50 },
    ];

    const COLORS = ['#DC2626', '#000000'];
    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Take Home Card */}
                <div className="bg-white rounded-lg p-4 shadow-sm">
                    <p className="text-sm font-bold text-black-600 mb-2">Take Home</p>
                    <div className="flex items-center justify-between">
                        <h2 className="text-3xl font-bold">$363.44</h2>
                        <div className="w-15 h-30">
                            <div className="w-full h-full relative">
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
                                            paddingAngle={0}
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
                    </div>
                </div>

                {/* YTD Card */}
                <div className="bg-white rounded-lg p-4 shadow-sm">
                    <p className="text-sm font-bold text-black-600 mb-2">YTD</p>
                    <div className="flex items-center justify-between">
                        <h2 className="text-3xl font-bold">$363.44</h2>
                        <div className="w-15 h-30">
                            <div className="w-full h-full relative">
                                <PieChart width={96} height={96}>
                                    <Pie
                                        data={data}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={30}
                                        outerRadius={48}
                                        startAngle={90}
                                        endAngle={-270}
                                        paddingAngle={0}
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
                </div>

                {/* Total PTO Card */}
                <div className="bg-white rounded-lg p-4 shadow-sm">
                    <p className="text-sm font-bold text-black-600 mb-2">Total PTO</p>
                    <div className="flex flex-row items-center justify-between gap-4">
                        <div className="flex flex-col justify-center">
                            <p className="text-sm mb-1">00 Hours Available</p>
                            <p className="text-sm mb-1">00 Hours Used</p>
                            <p className="text-sm">00 Total</p>
                        </div>

                        <div className="w-40 h-[100px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={ptoData} barGap={2}>
                                    <Bar dataKey="available" fill="#000000" />
                                    <Bar dataKey="used" fill="#E53E3E" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                </div>

                {/* YTD # of Trips Card */}
                <div className="bg-white rounded-lg p-4 shadow-sm">
                    <p className="text-sm font-bold text-black-600 mb-2">YTD # of Trips</p>
                    <div className="flex flex-row items-center justify-between gap-4">
                        <div className="flex flex-col justify-center">
                            <p className="text-sm mb-1">00 Trip Hours</p>
                            <p className="text-sm mb-1">40 # of Trips</p>
                        </div>

                        <div className="w-40 h-[100px]">
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