import React from 'react';
import { PieChart, Pie, Cell } from 'recharts';
import { IoEyeSharp } from 'react-icons/io5';
import { BiSolidReport } from 'react-icons/bi';
import { HiCalendar } from 'react-icons/hi';
import { IoMdArrowDropdown } from 'react-icons/io';
import { PayRollChartdata } from '@/data/dummyData';

const PayrollSummary = () => {

    return (
        <div className="flex flex-col w-[100%] mt-4">
            <div className="flex justify-between items-center mb-3">
                <h2 className="text-xl font-medium text-gray-800">
                    Payroll Summary <span className="text-gray-500 font-normal">(From 1-31 March, 2022)</span>
                </h2>
                <div className="flex items-center bg-white border border-gray-200 rounded-md px-3 py-1">
                    <span className="text-sm text-gray-700">Last 30 days</span>
                    <IoMdArrowDropdown className="ml-1 text-gray-600" />
                </div>
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex flex-wrap">
                    {/* Left side - Pie Chart */}
                    <div className="w-full md:w-1/3 relative">
                        <div className="flex justify-center">
                            <div className="relative">
                                <PieChart width={230} height={230}>
                                    <Pie
                                        data={PayRollChartdata}
                                        cx={115}
                                        cy={115}
                                        innerRadius={70}
                                        outerRadius={100}
                                        paddingAngle={0}
                                        dataKey="value"
                                    >
                                        {PayRollChartdata.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                </PieChart>
                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                                    <button className="mt-2 flex items-center border border-gray-300 rounded-md px-4 text-sm text-gray-700">
                                        <IoEyeSharp className="mr-2" /> View Pay Stub
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right side - Pay details */}
                    <div className="w-full md:w-2/3 md:pl-6">
                        {/* Top row */}
                        <div className="grid grid-cols-2 gap-6 mb-6">
                            {/* Total Pay */}
                            <div className="flex items-center">
                                <div className="w-1 h-10 bg-green-600 mr-3 rounded-sm"></div>
                                <div>
                                    <div className="text-gray-600 text-sm mb-1">Total Pay</div>
                                    <div className="text-2xl font-bold">
                                        $234<span className="text-gray-400 font-normal text-xl">.20</span>
                                    </div>
                                </div>
                            </div>

                            {/* Deduction */}
                            <div className="flex items-center">
                                <div className="w-1 h-10 bg-red-200 mr-3 rounded-sm"></div>
                                <div>
                                    <div className="text-gray-600 text-sm mb-1">Deduction</div>
                                    <div className="text-2xl font-bold">
                                        $95<span className="text-gray-400 font-normal text-xl">.86</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Bottom row */}
                        <div className="grid grid-cols-2 gap-6 mb-6">
                            {/* Taxes */}
                            <div className="flex items-center">
                                <div className="w-1 h-10 bg-red-600 mr-3 rounded-sm"></div>
                                <div>
                                    <div className="text-gray-600 text-sm mb-1">Taxes</div>
                                    <div className="text-2xl font-bold">
                                        $181<span className="text-gray-400 font-normal text-xl">.34</span>
                                    </div>
                                </div>
                            </div>

                            {/* Benefits */}
                            <div className="flex items-center">
                                <div className="w-1 h-10 bg-gray-800 mr-3 rounded-sm"></div>
                                <div>
                                    <div className="text-gray-600 text-sm mb-1">Benefits</div>
                                    <div className="text-2xl font-bold">
                                        $37<span className="text-gray-400 font-normal text-xl">.13</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Previous Payroll */}
                        <div className="border border-gray-200 rounded-lg p-4 mb-4">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center">
                                    <div className="text-blue-500 mr-2">
                                        <BiSolidReport size={20} />
                                    </div>
                                    <span className="text-gray-700">Previous Payroll</span>
                                </div>
                                <span className="text-gray-500 text-sm">March 1, 2022</span>
                            </div>
                            <div className="flex justify-between items-center mt-2">
                                <div className="text-xl font-bold">
                                    $58,764<span className="text-gray-400 font-normal">.25</span>
                                </div>
                                <div className="bg-[#CEEFDF] text-green-600 px-3 py-1 rounded-full text-xs font-bold">
                                    • PAID
                                </div>
                            </div>
                        </div>

                        {/* Upcoming Payroll */}
                        <div className="border border-gray-200 rounded-lg p-4">
                            <div className="flex justify-between items-center">
                                <div className="flex items-center">
                                    <div className="text-blue-500 mr-2">
                                        <HiCalendar size={20} />
                                    </div>
                                    <span className="text-gray-700">Upcoming Payroll</span>
                                </div>
                                <span className="text-[#3981F7] text-sm">April 1, 2022</span>
                            </div>
                            <div className="flex justify-between items-center mt-2">
                                <div className="text-xl font-bold">
                                    $2,670<span className="text-gray-400 font-normal">.50</span>
                                </div>
                                <div className="bg-[#FEEDDA] text-[#FAA745] px-3 py-1 rounded-full text-xs font-bold">
                                    • PENDING
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PayrollSummary;