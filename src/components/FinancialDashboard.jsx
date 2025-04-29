import { CalenderTickFrame, downArrow, editicon, editIcon, JanCalenderFrame, penicon, rightUpArrow } from '@/assets';
import { useState } from 'react';
import {
    FaCaretDown,
    FaChevronDown
} from 'react-icons/fa';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Line,
    LineChart,
    ReferenceLine,
    ResponsiveContainer,
    XAxis,
    YAxis
} from 'recharts';

export default function FinancialDashboard({ selectedTab }) {
    console.log(selectedTab);
    const [year, setYear] = useState('2024');
    const [month, setMonth] = useState('August');

    // Sample data for charts
    const lineChartData = [
        { name: 'Jan', value: 20000 },
        { name: 'Feb', value: 15000 },
        { name: 'Mar', value: 30000 },
        { name: 'Apr', value: 27000 },
        { name: 'May', value: 18000 },
        { name: 'Jun', value: 23000 },
        { name: 'Jul', value: 34000 },
        { name: 'Aug', value: 41210 },
        { name: 'Sep', value: 30000 },
        { name: 'Oct', value: 25000 },
        { name: 'Nov', value: 39000 },
        { name: 'Dec', value: 24000 },
    ];

    const barChartData = [
        { month: 'JAN', revenue: 20000, expenses: 15000 },
        { month: 'FEB', revenue: 38000, expenses: 25000 },
        { month: 'MAR', revenue: 45000, expenses: 38000 },
        { month: 'APR', revenue: 40000, expenses: 30000 },
        { month: 'MAY', revenue: 18000, expenses: 12000 },
        { month: 'JUN', revenue: 42000, expenses: 30000 },
    ];

    return (
        <div className=" p-4 min-h-screen">
            {/* Top Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                {/* Year Selector */}
                <div className="bg-white p-4 rounded-lg shadow-sm flex items-center">
                    <div className="bg-[#C01824] text-white p-2 rounded mr-3">
                        <img src={JanCalenderFrame} />
                    </div>
                    <div>
                        <div className="text-xs text-gray-500">Year</div>
                        <div className="flex items-center">
                            <span className="font-medium">2024</span>
                            <FaCaretDown className="ml-1 text-gray-600" />
                        </div>
                    </div>
                </div>

                {/* Month Selector */}
                <div className="bg-white p-4 rounded-lg shadow-sm flex items-center">
                    <div className="bg-[#C01824] text-red-600 p-2 rounded mr-3">
                        <img src={CalenderTickFrame} />
                    </div>
                    <div>
                        <div className="text-xs text-gray-500">Month</div>
                        <div className="flex items-center">
                            <span className="font-medium">August</span>
                            <FaCaretDown className="ml-1 text-gray-600" />
                        </div>
                    </div>
                </div>
                {/* Gross Income */}
                <div className="bg-white p-4 rounded-lg shadow-sm flex items-center">
                    <div className="bg-[#C01824] text-green-600 p-2 rounded mr-3">
                        <img src={downArrow} />
                    </div>
                    <div>
                        <div className="flex items-center">
                            <div className="text-xs text-gray-500">Gross Income</div>
                            <span className="text-xs ml-2 px-1 bg-green-100 text-green-600 rounded">+10%</span>
                        </div>
                        <div className="font-medium">$41,210</div>
                    </div>
                </div>

                {/* Net Income */}
                <div className="bg-white p-4 rounded-lg shadow-sm flex items-center">
                    <div className="bg-[#C01824] text-red-600 p-2 rounded mr-3">
                        <img src={rightUpArrow} />
                    </div>
                    <div>
                        <div className="flex items-center">
                            <div className="text-xs text-gray-500">Net Income</div>
                            <span className="text-xs ml-2 px-1 bg-red-100 text-red-600 rounded">-2%</span>
                        </div>
                        <div className="font-medium">$41,210</div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            {selectedTab === 'Balance Sheet' ?
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-lg shadow-sm w-full mt-6 mx-auto max-h-[665px] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h1 className="text-lg font-bold text-center flex-grow">CONSOLIDATED BALANCE SHEET</h1>
                            <button className="text-red-500 text-sm flex items-center">
                                <img src={penicon} />
                                Edit
                            </button>
                        </div>

                        {/* ASSETS Section */}
                        <div className="text-center font-bold bg-white py-2 mb-2">ASSETS</div>

                        {/* Current Assets */}
                        <div className="bg-gray-200 p-2 mb-1">
                            <div className="font-semibold">Current assets</div>
                        </div>

                        {Array(6).fill(0).map((_, index) => (
                            <div key={`current-asset-${index}`} className="flex justify-between py-1 px-2 bg-gray-100">
                                <div className="text-sm">GLR-101-01. Marketable securities</div>
                                <div className="text-sm">$ 30,816</div>
                            </div>
                        ))}

                        <div className="flex justify-between py-2 px-2 font-bold text-red-600">
                            <div>Total current assets</div>
                            <div>$ 143,713</div>
                        </div>

                        {/* Non-Current Assets */}
                        <div className="bg-gray-200 p-2 mb-1">
                            <div className="font-semibold">Non-Current assets</div>
                        </div>

                        {Array(5).fill(0).map((_, index) => (
                            <div key={`non-current-asset-${index}`} className="flex justify-between py-1 px-2 bg-gray-100">
                                <div className="text-sm">GLR-101-01. Marketable securities</div>
                                <div className="text-sm">$ 30,816</div>
                            </div>
                        ))}

                        <div className="flex justify-between py-2 px-2 font-bold text-red-600">
                            <div>Total current assets</div>
                            <div>$ 143,713</div>
                        </div>

                        {/* LIABILITIES AND SHAREHOLDERS EQUITY Section */}
                        <div className="text-center font-bold bg-white py-2 mb-2 mt-4">LIABILITIES AND SHAREHOLDERS EQUITY</div>

                        {/* Current Liabilities */}
                        <div className="bg-gray-200 p-2 mb-1">
                            <div className="font-semibold">Current Liabilities</div>
                        </div>

                        {Array(5).fill(0).map((_, index) => (
                            <div key={`current-liability-${index}`} className="flex justify-between py-1 px-2 bg-gray-100">
                                <div className="text-sm">GLR-101-01. Marketable securities</div>
                                <div className="text-sm">$ 30,816</div>
                            </div>
                        ))}

                        <div className="flex justify-between py-2 px-2 font-bold text-red-600">
                            <div>Total current liability</div>
                            <div>$ 143,713</div>
                        </div>

                        {/* Non-Current Liabilities */}
                        <div className="bg-gray-200 p-2 mb-1">
                            <div className="font-semibold">Non-Current Liabilities</div>
                        </div>

                        {Array(3).fill(0).map((_, index) => (
                            <div key={`non-current-liability-${index}`} className="flex justify-between py-1 px-2 bg-gray-100">
                                <div className="text-sm">GLR-101-01. Marketable securities</div>
                                <div className="text-sm">$ 30,816</div>
                            </div>
                        ))}

                        <div className="flex justify-between py-2 px-2 font-bold text-red-600">
                            <div>Total current assets</div>
                            <div>$ 143,713</div>
                        </div>
                    </div>
                    {/* Charts Section */}
                    <div className="flex flex-col gap-4">
                        {/* Overview Line Chart */}
                        <div className="flex items-end justify-end space-x-2">
                            <button className="text-xs border border-black text-gray-600 px-3 py-1 rounded-md flex items-center">
                                Select Date: Overview <FaChevronDown className="ml-1" size={10} />
                            </button>
                            <button className="text-xs border border-black text-gray-600 px-3 py-1 rounded-md flex items-center">
                                Select: Report Type: Lines <FaChevronDown className="ml-1" size={10} />
                            </button>
                        </div>
                        <div className="bg-white rounded-lg shadow-sm p-4">
                            <div className="flex justify-between items-center mb-4">
                                <div className="font-medium text-gray-700">Overview</div>
                                <div className="flex mb-2 text-xs">
                                    <div className="flex items-center mr-4">
                                        <div className="w-2 h-2 rounded-full bg-[#C01824] mr-1"></div>
                                        <span>Income</span>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="w-2 h-2 rounded-full bg-[#EBB7BB] mr-1"></div>
                                        <span>Expenses</span>
                                    </div>
                                </div>
                            </div>


                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={lineChartData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                        <YAxis axisLine={false} tickLine={false} />
                                        <Line
                                            type="monotone"
                                            dataKey="value"
                                            stroke="#EF4444"
                                            strokeWidth={2}
                                            dot={false}
                                            activeDot={{ r: 6 }}
                                        />
                                        <ReferenceLine
                                            x="Aug"
                                            stroke="#EF4444"
                                            label={{
                                                value: "$41,210",
                                                position: "top",
                                                fill: "#EF4444",
                                                fontSize: 12,
                                                fontWeight: "bold",
                                                dy: -8
                                            }}
                                            strokeDasharray="3 3"
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Revenue Bar Chart */}
                        <div className="flex items-end justify-end space-x-2">
                            <button className="text-xs border border-black text-gray-600 px-3 py-1 rounded-md flex items-center">
                                Select Date: Overview <FaChevronDown className="ml-1" size={10} />
                            </button>
                            <button className="text-xs border border-black text-gray-600 px-3 py-1 rounded-md flex items-center">
                                Select: Report Type: Bars <FaChevronDown className="ml-1" size={10} />
                            </button>
                        </div>
                        <div className="bg-white rounded-lg shadow-sm p-4">
                            <div className="flex justify-between items-center mb-4">
                                <div className="font-medium text-gray-700">Total Revenue</div>
                            </div>

                            <div className="h-48">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={barChartData} barGap={4}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="month" axisLine={false} tickLine={false} />
                                        <YAxis axisLine={false} tickLine={false} />
                                        <Bar dataKey="revenue" fill="#EF4444" radius={[2, 2, 0, 0]} />
                                        <Bar dataKey="expenses" fill="#6B7280" radius={[2, 2, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>
                :
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Income Statement */}
                    <div className="bg-white rounded-lg shadow-sm p-4">
                        <div className="flex items-center justify-between  mb-4">
                            <p className="mb-0 text-center font-medium text-black-700">CONSOLIDATED INCOME STATEMENTS</p>
                            <p className='flex items-center text-[#C01824] font-bold'><img src={penicon} /> Edit</p>
                        </div>

                        <table className="w-full text-sm">
                            {/* Revenues Section */}
                            <thead>
                                <tr className="bg-gray-300">
                                    <th className="text-left p-2 font-medium text-red-600">Revenues</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b border-gray-200">
                                    <td className="p-2 text-gray-600">Cost of sales</td>
                                    <td className="p-2 text-right">$ 38,016</td>
                                </tr>
                                <tr className="border-b border-gray-200 bg-gray-100">
                                    <td className="p-2 text-gray-600">Fulfillment</td>
                                    <td className="p-2 text-right">$ 38,016</td>
                                </tr>
                                <tr className="border-b border-gray-200 bg-gray-300">
                                    <td className="p-2 font-medium">Total Revenues</td>
                                    <td className="p-2 text-right text-red-600 font-medium">$ 38,016</td>
                                </tr>
                            </tbody>

                            {/* Expenses Section */}
                            <thead>
                                <tr className="bg-gray-300">
                                    <th className="text-left p-2 font-medium text-red-600">Expenses</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b border-gray-200">
                                    <td className="p-2 text-gray-600">Rent expense</td>
                                    <td className="p-2 text-right">$ 38,016</td>
                                </tr>
                                <tr className="border-b border-gray-200">
                                    <td className="p-2 text-gray-600">Supplies expense</td>
                                    <td className="p-2 text-right">$ 38,016</td>
                                </tr>
                                <tr className="border-b border-gray-200 bg-gray-100">
                                    <td className="p-2 text-gray-600">Operating Income</td>
                                    <td className="p-2 text-right">$ 38,016</td>
                                </tr>
                                <tr className="border-b border-gray-200">
                                    <td className="p-2 text-gray-600">Interest income</td>
                                    <td className="p-2 text-right">$ 38,016</td>
                                </tr>
                                <tr className="border-b border-gray-200 bg-gray-100">
                                    <td className="p-2 text-gray-600">Interest expense</td>
                                    <td className="p-2 text-right">$ 38,016</td>
                                </tr>
                                <tr className="border-b border-gray-200 bg-gray-300">
                                    <td className="p-2 font-medium">Total Expense</td>
                                    <td className="p-2 text-right text-red-600 font-medium">$ 38,016</td>
                                </tr>
                                <tr className="bg-gray-300">
                                    <td className="p-2 font-medium">Net Income</td>
                                    <td className="p-2 text-right text-red-600 font-medium">$ 38,016</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Charts Section */}
                    <div className="flex flex-col gap-4">
                        {/* Overview Line Chart */}
                        <div className="flex items-end justify-end space-x-2">
                            <button className="text-xs border border-black text-gray-600 px-3 py-1 rounded-md flex items-center">
                                Select Date: Overview <FaChevronDown className="ml-1" size={10} />
                            </button>
                            <button className="text-xs border border-black text-gray-600 px-3 py-1 rounded-md flex items-center">
                                Select: Report Type: Lines <FaChevronDown className="ml-1" size={10} />
                            </button>
                        </div>
                        <div className="bg-white rounded-lg shadow-sm p-4">
                            <div className="flex justify-between items-center mb-4">
                                <div className="font-medium text-gray-700">Overview</div>
                                <div className="flex mb-2 text-xs">
                                    <div className="flex items-center mr-4">
                                        <div className="w-2 h-2 rounded-full bg-[#C01824] mr-1"></div>
                                        <span>Income</span>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="w-2 h-2 rounded-full bg-[#EBB7BB] mr-1"></div>
                                        <span>Expenses</span>
                                    </div>
                                </div>
                            </div>


                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={lineChartData}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} />
                                        <YAxis axisLine={false} tickLine={false} />
                                        <Line
                                            type="monotone"
                                            dataKey="value"
                                            stroke="#EF4444"
                                            strokeWidth={2}
                                            dot={false}
                                            activeDot={{ r: 6 }}
                                        />
                                        <ReferenceLine
                                            x="Aug"
                                            stroke="#EF4444"
                                            label={{
                                                value: "$41,210",
                                                position: "top",
                                                fill: "#EF4444",
                                                fontSize: 12,
                                                fontWeight: "bold",
                                                dy: -8
                                            }}
                                            strokeDasharray="3 3"
                                        />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Revenue Bar Chart */}
                        <div className="flex items-end justify-end space-x-2">
                            <button className="text-xs border border-black text-gray-600 px-3 py-1 rounded-md flex items-center">
                                Select Date: Overview <FaChevronDown className="ml-1" size={10} />
                            </button>
                            <button className="text-xs border border-black text-gray-600 px-3 py-1 rounded-md flex items-center">
                                Select: Report Type: Bars <FaChevronDown className="ml-1" size={10} />
                            </button>
                        </div>
                        <div className="bg-white rounded-lg shadow-sm p-4">
                            <div className="flex justify-between items-center mb-4">
                                <div className="font-medium text-gray-700">Total Revenue</div>
                            </div>

                            <div className="h-48">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={barChartData} barGap={4}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="month" axisLine={false} tickLine={false} />
                                        <YAxis axisLine={false} tickLine={false} />
                                        <Bar dataKey="revenue" fill="#EF4444" radius={[2, 2, 0, 0]} />
                                        <Bar dataKey="expenses" fill="#6B7280" radius={[2, 2, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>
            }

        </div>
    );
}