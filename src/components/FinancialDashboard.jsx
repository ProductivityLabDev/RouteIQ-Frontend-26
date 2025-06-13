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
                <div className="bg-white p-4 rounded-lg shadow-sm flex items-center gap-8">
                    <div className="bg-[#C01824] text-white p-2 rounded mr-3">
                         <img src={CalenderTickFrame} width="30" /> 
                    </div>
                    <div>
                        <div className="text-xs text-[#565656] text-[14px] font-bold">Year</div>
                        <div className="flex items-center">
                            <span className="font-medium text-[#141516] text-[33px]">2024</span>
                            <FaCaretDown className="ml-1 text-gray-600" />
                        </div>
                    </div>
                </div>

                {/* Month Selector */}
                <div className="bg-white p-4 rounded-lg shadow-sm flex items-center gap-8">
                    <div className="bg-[#C01824] text-red-600 p-2 rounded mr-3">
                      <img src={JanCalenderFrame} width="30"/>
                    </div>
                    <div>
                        <div className="text-[#565656] text-[14px] font-bold">Month</div>
                        <div className="flex items-center">
                            <span className="font-medium text-[#141516] text-[33px]">August</span>
                            <FaCaretDown className="ml-1 text-gray-600" />
                        </div>
                    </div>
                </div>
                {/* Gross Income */}
                <div className="bg-white p-4 rounded-lg shadow-sm flex items-center gap-8">
                    <div className="bg-[#C01824] text-green-600 p-2 rounded mr-3">
                        <img src={downArrow} width="30"/>
                    </div>
                    <div>
                        <div className="flex items-center">
                            <div className="text-[#565656] text-[14px] font-bold">Gross Income</div>
                            <span className="text-xs ml-2 px-1 bg-green-100 text-green-600 rounded">+10%</span>
                        </div>
                        <div className="font-medium text-[#141516] text-[33px]">$41,210</div>
                    </div>
                </div>

                {/* Net Income */}
                <div className="bg-white p-4 rounded-lg shadow-sm flex items-center gap-8">
                    <div className="bg-[#C01824] text-red-600 p-2 rounded mr-3">
                        <img src={rightUpArrow} width="30"/>
                    </div>
                    <div>
                        <div className="flex items-center">
                            <div className="text-[14px] text-[#565656] font-bold">Net Income</div>
                            <span className="text-xs ml-2 px-1 bg-red-100 text-red-600 rounded">-2%</span>
                        </div>
                        <div className="font-medium text-[#141516] text-[33px]">$41,210</div>
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
                        <div className="text-center font-bold bg-white py-2 mb-2 text-[#141516] text-[18px]">ASSETS</div>

                        {/* Current Assets */}
                        <div className="bg-gray-200 p-2 mb-1">
                            <div className="font-bold text-[#141516]">Current assets</div>
                        </div>

                        {Array(6).fill(0).map((_, index) => (
                            <div key={`current-asset-${index}`} className="flex justify-between py-1 px-2 bg-gray-100">
                                <div className="text-sm text-[#141516] font-semibold">GLR-101-01. Marketable securities</div>
                                <div className="text-sm text-[#141516] font-semibold">$ 30,816</div>
                            </div>
                        ))}

                        <div className="flex justify-between py-2 px-2 font-bold text-[#C01824]">
                            <div>Total current assets</div>
                            <div>$ 143,713</div>
                        </div>

                        {/* Non-Current Assets */}
                        <div className="bg-gray-200 p-2 mb-1">
                            <div className="font-bold text-[#141516]">Non-Current assets</div>
                        </div>

                        {Array(5).fill(0).map((_, index) => (
                            <div key={`non-current-asset-${index}`} className="flex justify-between py-1 px-2 bg-gray-100">
                                <div className="text-sm text-[#141516] font-semibold">GLR-101-01. Marketable securities</div>
                                <div className="text-sm text-[#141516] font-semibold">$ 30,816</div>
                            </div>
                        ))}

                        <div className="flex justify-between py-2 px-2 font-bold text-[#C01824]">
                            <div>Total current assets</div>
                            <div>$ 143,713</div>
                        </div>

                        {/* LIABILITIES AND SHAREHOLDERS EQUITY Section */}
                        <div className="text-center font-bold bg-white py-2 mb-2 mt-4">LIABILITIES AND SHAREHOLDERS EQUITY</div>

                        {/* Current Liabilities */}
                        <div className="bg-gray-200 p-2 mb-1">
                            <div className="font-bold text-[#141516]">Current Liabilities</div>
                        </div>

                        {Array(5).fill(0).map((_, index) => (
                            <div key={`current-liability-${index}`} className="flex justify-between py-1 px-2 bg-gray-100">
                                <div className="text-sm text-[#141516] font-semibold">GLR-101-01. Marketable securities</div>
                                <div className="text-sm text-[#141516] font-semibold">$ 30,816</div>
                            </div>
                        ))}

                        <div className="flex justify-between py-2 px-2 font-bold text-[#C01824]">
                            <div>Total current liability</div>
                            <div>$ 143,713</div>
                        </div>

                        {/* Non-Current Liabilities */}
                        <div className="bg-gray-200 p-2 mb-1">
                            <div className="font-semibold">Non-Current Liabilities</div>
                        </div>

                        {Array(3).fill(0).map((_, index) => (
                            <div key={`non-current-liability-${index}`} className="flex justify-between py-1 px-2 bg-gray-100">
                                <div className="text-sm text-[#141516] font-semibold">GLR-101-01. Marketable securities</div>
                                <div className="text-sm text-[#141516] font-semibold">$ 30,816</div>
                            </div>
                        ))}

                        <div className="flex justify-between py-2 px-2 font-bold text-[#C01824]">
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
                            <p className="mb-0 text-center font-bold text-[14px] text-[#141516]">CONSOLIDATED INCOME STATEMENTS</p>
                            <p className='flex items-center text-[#C01824] font-bold'><img src={penicon} /> Edit</p>
                        </div>

                        <table className="w-full text-sm">
                            {/* Revenues Section */}
                            <thead>
                                <tr className="bg-[#CCC9C9]">
                                    <th className="text-left p-2 font-bold text-[#C01824] text-[18px]">Revenues</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b border-gray-200 bg-[#EFEEEE]">
                                    <td className="p-2 text-[#141516] text-[14px] font-semibold">Cost of sales</td>
                                    <td className="p-2 text-right text-[#141516] text-[14px] font-semibold">$ 38,016</td>
                                </tr>
                                <tr className="border-b border-gray-200 bg-[#CCC9C9]">
                                    <td className="p-2  text-[#141516] text-[14px] font-semibold">Fulfillment</td>
                                    <td className="p-2 text-right text-[#141516] text-[14px] font-semibold">$ 38,016</td>
                                </tr>
                                <tr className="border-b border-gray-200 bg-[#EFEEEE]">
                                    <td className="p-2  text-[#141516] text-[14px] font-bold">Total Revenues</td>
                                    <td className="p-2 text-right text-[#C01824] font-bold text-[18px]">$ 38,016</td>
                                </tr>
                            </tbody>

                            {/* Expenses Section */}
                            <thead>
                                <tr className="bg-[#CCC9C9]">
                                    <th className="text-left p-2 font-bold text-[#C01824] text-[18px]">Expenses</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-b border-gray-200 bg-[#EFEEEE]">
                                    <td className="p-2 text-[#141516] text-[14px] font-semibold">Rent expense</td>
                                    <td className="p-2 text-right text-[#141516] text-[14px] font-semibold">$ 38,016</td>
                                </tr>
                                <tr className="border-b border-gray-200 bg-[#CCC9C9]">
                                    <td className="p-2 text-[#141516] text-[14px] font-semibold ">Supplies expense</td>
                                    <td className="p-2 text-right text-[#141516] text-[14px] font-semibold">$ 38,016</td>
                                </tr>
                                <tr className="border-b border-gray-200 bg-[#EFEEEE]">
                                    <td className="p-2 text-[#141516] text-[14px] font-semibold">Operating Income</td>
                                    <td className="p-2 text-right text-[#141516] text-[14px] font-semibold">$ 38,016</td>
                                </tr>
                                <tr className="border-b border-gray-200 bg-[#CCC9C9]">
                                    <td className="p-2  text-[#141516] text-[14px] font-semibold">Interest income</td>
                                    <td className="p-2 text-right text-[#141516] text-[14px] font-semibold">$ 38,016</td>
                                </tr>
                                <tr className="border-b border-gray-200 bg-[#EFEEEE]">
                                    <td className="p-2 text-[#141516] text-[14px] font-semibold">Interest expense</td>
                                    <td className="p-2 text-right text-[#141516] text-[14px] font-semibold">$ 38,016</td>
                                </tr>
                                <tr className="border-b border-gray-200 bg-[#CCC9C9]">
                                    <td className="p-2 font-bold text-[#141516] text-[14px]">Total Expense</td>
                                    <td className="p-2 text-right text-[#C01824] font-bold text-[18px]">$ 38,016</td>
                                </tr>
                                <tr className="bg-[#EFEEEE]">
                                    <td className="p-2 font-bold text-[#C01824] text-[18px]">Net Income</td>
                                    <td className="p-2 text-right text-[#C01824] font-bold text-[18px]">$ 38,016</td>
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
                                <div className="font-medium text-[#141516] text-[20px]">Overview</div>
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
                                <div className="font-bold text-[#000000E5] text-[14px]">Total Revenue</div>
                            </div>

                            <div className="h-48">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={barChartData} barGap={30}>
                                        <CartesianGrid strokeDasharray="1" vertical={false} />
                                        <XAxis dataKey="month" axisLine={false} tickLine={false} />
                                        <YAxis axisLine={false} tickLine={false} />
                                        <Bar dataKey="revenue" fill="#EF4444" radius={[30, 30, 30, 30]} />
                                        <Bar dataKey="expenses" fill="#6B7280" radius={[30, 30, 30, 30]} />
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