import React from 'react'
import { BsArrowUp, BsArrowDown } from 'react-icons/bs';
import { FiUser, FiMinus, FiPlus, FiChevronDown, FiMoreVertical } from 'react-icons/fi';
import {
    BarChart, Bar, XAxis, YAxis, ResponsiveContainer,
    AreaChart, Area, CartesianGrid, PieChart, Pie, Cell, Label
} from 'recharts';
import CustomerSatisfactionCard from './CustomerSatisfactionCard';

const KPIScreen = () => {
    const areaData = [
        { name: 'Jan', value: 2200 },
        { name: 'Feb', value: 2800 },
        { name: 'Mar', value: 3500 },
        { name: 'Apr', value: 3800 },
        { name: 'May', value: 3200 },
        { name: 'Jun', value: 2800 },
        { name: 'Jul', value: 2400 }
    ];

    // Data for the bar chart (right side)
    const barData = [
        { name: 'Jan', target: 0, actual: 0 },
        { name: 'Feb', target: 15000, actual: 18000 },
        { name: 'Mar', target: 25000, actual: 15000 },
        { name: 'Apr', target: 12000, actual: 18000 },
        { name: 'May', target: 15000, actual: 12000 },
        { name: 'Jun', target: 20000, actual: 15000 },
        { name: 'Jul', target: 25000, actual: 10000 },
    ];
    const dountChartData = [
        { name: 'Black', value: 28.9, color: '#333' },
        { name: 'Dark Red', value: 25, color: '#8B0000' },
        { name: 'Medium Red', value: 21.8, color: '#B91C1C' },
        { name: 'Light Red', value: 13.5, color: '#FFCCCB' },
        { name: 'Red', value: 10.8, color: '#DC2626' },
    ];
    const invoiceChartData = [
        { value: 80 },
        { value: 60 },
        { value: 80 },
        { value: 40 },
        { value: 0 },
        { value: 60 },
        { value: 30 },
        { value: 0 },
        { value: 40 },
        { value: 50 }
    ];
    return (
        <div>
            <div className="grid grid-cols-5 gap-4 mb-6">
                {/* Card 1 */}
                <div className="bg-white rounded-md shadow-sm p-4">
                    <div className="flex justify-between items-center">
                        <div className="text-xl font-bold">$2540.00</div>
                        <FiUser size={26} className="text-black" />
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Revenue Last Month</div>
                    <div className="mt-4 h-1 bg-[#C01824] w-full"></div>
                </div>

                {/* Card 2 */}
                <div className="bg-white rounded-md shadow-sm p-4">
                    <div className="flex justify-between items-center">
                        <div className="text-xl font-bold">$224.00</div>
                        <FiUser size={26} className="text-black" />
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Average Value</div>
                    <div className="mt-4 h-1 bg-[#C01824] w-full"></div>
                </div>

                {/* Card 3 */}
                <div className="bg-white rounded-md shadow-sm p-4">
                    <div className="flex justify-between items-center">
                        <div className="text-xl font-bold">162</div>
                        <FiUser size={26} className="text-black" />
                    </div>
                    <div className="text-xs text-gray-500 mt-1">New Activity this month</div>
                    <div className="mt-4 h-1 bg-[#C01824] w-full"></div>
                </div>

                {/* Card 4 */}
                <div className="bg-white rounded-md shadow-sm p-4">
                    <div className="flex justify-between items-center">
                        <div className="text-xl font-bold">162</div>
                        <FiUser size={26} className="text-black" />
                    </div>
                    <div className="text-xs text-gray-500 mt-1">New Activity this month</div>
                    <div className="mt-4 h-1 bg-[#C01824] w-full"></div>
                </div>

                {/* Card 5 */}
                <div className="bg-white rounded-md shadow-sm p-4">
                    <div className="flex justify-between items-center">
                        <div className="text-xl font-bold">162</div>
                        <FiUser size={26} className="text-black" />
                    </div>
                    <div className="text-xs text-gray-500 mt-1">New Activity this month</div>
                    <div className="mt-4 h-1 bg-[#C01824] w-full"></div>
                </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-6">
                    {/* On Time Performance */}
                    <div className="bg-white rounded-md shadow-sm p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="font-medium text-gray-700">On Time Performance</h2>
                            <div className="flex items-center text-sm">
                                <span className="text-gray-500 mr-1">Sort By:</span>
                                <span className="font-medium mx-1">Yearly</span>
                                <FiChevronDown className="text-gray-500" />
                                <div className="ml-4">
                                    <FiMoreVertical className="text-gray-500" />
                                </div>
                            </div>
                        </div>

                        <div className="mb-4">
                            <div className="text-sm text-gray-500">Total Revenue:</div>
                            <div className="text-3xl font-bold mb-1">$9,542.00</div>
                            <div className="text-xs text-gray-500">From Jan 20,2022 to July,2022</div>
                        </div>

                        <div className="flex">
                            {/* Left side - Area chart */}
                            <div className="w-1/2 pr-4">
                                <div className="h-40 relative">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={areaData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                                            <defs>
                                                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#4ADE80" stopOpacity={0.2} />
                                                    <stop offset="95%" stopColor="#4ADE80" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <Area
                                                type="monotone"
                                                dataKey="value"
                                                stroke="#4ADE80"
                                                fillOpacity={1}
                                                fill="url(#colorGradient)"
                                                strokeWidth={2}
                                            />
                                        </AreaChart>
                                    </ResponsiveContainer>

                                    {/* Red percentage indicator */}
                                    <div className="absolute top-0 right-0 bg-red-100 text-red-500 px-2 py-0.5 rounded text-xs font-medium flex items-center">
                                        <BsArrowDown className="mr-1" size={10} />
                                        18.3%
                                    </div>
                                </div>

                                {/* Stats */}
                                <div className="flex space-x-6 mt-4">
                                    <div className="flex items-center">
                                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                                        <span className="text-sm font-medium">3,526.56</span>
                                        <span className="text-xs text-gray-500 ml-1">Net Profit</span>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                                        <span className="text-sm font-medium">3,526.56</span>
                                        <span className="text-xs text-gray-500 ml-1">Net Revenue</span>
                                    </div>
                                </div>
                            </div>

                            {/* Right side - Bar chart */}
                            <div className="w-1/2 pl-2">
                                <div className="h-48">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={barData} barGap={5}>
                                            <YAxis
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{ fontSize: 10, fill: '#9CA3AF' }}
                                                tickFormatter={(value) => value === 0 ? '0k' : `${value / 1000}k`}
                                                tickCount={5}
                                            />
                                            <XAxis
                                                dataKey="name"
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{ fontSize: 10, fill: '#9CA3AF' }}
                                            />
                                            <Bar dataKey="target" fill="#991B1B" radius={[2, 2, 0, 0]} />
                                            <Bar dataKey="actual" fill="#FECACA" radius={[2, 2, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Invoice Overview */}
                    <div className="bg-white rounded-md shadow-sm p-4">
                        <div className="flex justify-between mb-4">
                            <h2 className="font-medium">Invoice Overview</h2>
                            <div className="flex items-center text-sm">
                                <span className="text-gray-500">Sort By:</span>
                                <span className="font-medium mx-1">Yearly</span>
                                <FiChevronDown className="text-gray-500" />
                                <FiMoreVertical className="text-gray-500 ml-2" />
                            </div>
                        </div>

                        {/* Stats Row */}
                        <div className="grid grid-cols-3 gap-4 mb-4">
                            <div>
                                <div className="flex items-center">
                                    <span className="text-xl font-bold">854</span>
                                    <div className="flex items-center text-green-500 text-xs ml-2">
                                        <BsArrowUp size={10} />
                                        <span>24%</span>
                                    </div>
                                </div>
                                <div className="text-xs text-gray-500">Avg. Session</div>
                            </div>
                            <div>
                                <div className="flex items-center">
                                    <span className="text-xl font-bold">1,278</span>
                                    <div className="flex items-center text-green-500 text-xs ml-2">
                                        <BsArrowUp size={10} />
                                        <span>60%</span>
                                    </div>
                                </div>
                                <div className="text-xs text-gray-500">Conversion Rate</div>
                            </div>
                            <div>
                                <div className="flex items-center">
                                    <span className="text-xl font-bold">3m 40sec</span>
                                    <div className="flex items-center text-green-500 text-xs ml-2">
                                        <BsArrowUp size={10} />
                                        <span>37%</span>
                                    </div>
                                </div>
                                <div className="text-xs text-gray-500">Avg. Session Duration</div>
                            </div>
                        </div>

                        {/* Revenue Section */}
                        <div className="border-t pt-4">
                            <div className="text-sm font-medium">Total Revenue:</div>
                            <div className="text-2xl font-bold mb-1">$9,542.00</div>
                            <div className="text-xs text-gray-500 mb-4">From Jan 20,2022 to July,2022</div>

                            {/* Area Chart using Recharts */}
                            <div className="h-36 relative mb-4">
                                <div className="absolute inset-0 bg-gradient-to-t from-green-100 to-green-50 rounded"></div>
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart
                                        data={invoiceChartData}
                                        margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
                                    >
                                        <defs>
                                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                                                <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <Area
                                            type="monotone"
                                            dataKey="value"
                                            stroke="#10B981"
                                            strokeWidth={2}
                                            fillOpacity={1}
                                            fill="url(#colorValue)"
                                            dot={false}
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                                {/* Dashed line overlay */}
                                <svg viewBox="0 0 400 100" className="absolute inset-0 pointer-events-none">
                                    <path
                                        d="M0,80 L400,50"
                                        fill="none"
                                        stroke="#EF4444"
                                        strokeWidth="2"
                                        strokeDasharray="5,5"
                                    />
                                </svg>
                            </div>

                            {/* Bottom Stats */}
                            <div className="flex items-center justify-between bg-gray-50 rounded-sm p-2">
                                <div className="flex items-center">
                                    <BsArrowUp className="text-green-500 mr-1" />
                                    <span className="text-sm font-semibold">3,526.56</span>
                                    <span className="text-xs text-gray-500 ml-1">Net Profit</span>
                                </div>
                                <div className="flex items-center">
                                    <BsArrowUp className="text-green-500 mr-1" />
                                    <span className="text-sm font-semibold">3,526.56</span>
                                    <span className="text-xs text-gray-500 ml-1">Net Revenue</span>
                                </div>
                                <div className="flex items-center">
                                    <BsArrowUp className="text-green-500 mr-1" />
                                    <span className="text-sm font-semibold">16.8%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                    {/* Current Statistic */}
                    <div className="bg-white rounded-md shadow-sm p-4">
                        <div className="flex justify-between mb-4">
                            <h2 className="font-medium">Current Statistic</h2>
                            <FiMoreVertical className="text-gray-500" />
                        </div>

                        {/* Donut Chart */}
                        <div className="flex justify-center py-4">
                            <PieChart width={450} height={250}>
                                <Pie
                                    data={dountChartData}
                                    dataKey="value"
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={90}
                                    startAngle={90}
                                    endAngle={-270} // clockwise
                                >
                                    {dountChartData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </div>

                        {/* Legend */}
                        <div className="space-y-1.5 mt-2">
                            <div className="flex items-center">
                                <div className="w-2 h-2 bg-red-600 rounded-full mr-2"></div>
                                <span className="text-xs">Income</span>
                                <BsArrowUp className="text-red-600 ml-1" size={10} />
                                <span className="text-xs text-red-600 ml-0.5">43.25%</span>
                                <span className="text-xs text-gray-500 ml-auto">$191,466.24</span>
                            </div>
                            <div className="flex items-center">
                                <div className="w-2 h-2 bg-red-200 rounded-full mr-2"></div>
                                <span className="text-xs">Income</span>
                                <BsArrowUp className="text-red-600 ml-1" size={10} />
                                <span className="text-xs text-red-600 ml-0.5">13.56%</span>
                                <span className="text-xs text-gray-500 ml-auto">$56,411.33</span>
                            </div>
                            <div className="flex items-center">
                                <div className="w-2 h-2 bg-red-700 rounded-full mr-2"></div>
                                <span className="text-xs">Income</span>
                                <BsArrowUp className="text-red-600 ml-1" size={10} />
                                <span className="text-xs text-red-600 ml-0.5">40.22%</span>
                                <span className="text-xs text-gray-500 ml-auto">$81,981.22</span>
                            </div>
                            <div className="flex items-center">
                                <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                                <span className="text-xs">Income</span>
                                <BsArrowUp className="text-red-600 ml-1" size={10} />
                                <span className="text-xs text-red-600 ml-0.5">25.53%</span>
                                <span className="text-xs text-gray-500 ml-auto">$12,432.51</span>
                            </div>
                            <div className="flex items-center">
                                <div className="w-2 h-2 bg-gray-800 rounded-full mr-2"></div>
                                <span className="text-xs">Income</span>
                                <BsArrowUp className="text-red-600 ml-1" size={10} />
                                <span className="text-xs text-red-600 ml-0.5">28.53%</span>
                                <span className="text-xs text-gray-500 ml-auto">$12,432.51</span>
                            </div>
                        </div>
                    </div>
                    {/* Customer Satisfaction */}
                    <CustomerSatisfactionCard />
                </div>
            </div>
        </div>
    )
}

export default KPIScreen