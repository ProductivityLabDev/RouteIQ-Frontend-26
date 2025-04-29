import { EmployeeClock, employeeTimeTracking } from '@/assets';
import { days, weekdays } from '@/data/dummyData';
import React, { useState } from 'react';
import { FaClock, FaCalendarAlt } from 'react-icons/fa';

export default function TimeTrackingCard() {
    const [currentMonth] = useState('February 2023');
    return (
        <div className="flex flex-row w-full gap-4 p-4">
            <div className="max-w-md mx-auto shadow-sm w-[400px]">
                <h1 className="text-xl font-semibold text-gray-800 mb-4">Attendance</h1>
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="text-center text-red-600 font-medium text-xl mb-4">
                        {currentMonth}
                    </div>
                    <div className="border-t border-gray-200 pt-4">
                        <div className="grid grid-cols-7 gap-4 mb-2">
                            {weekdays.map((day, index) => (
                                <div key={index} className="text-center text-sm font-medium">
                                    {day}
                                </div>
                            ))}
                        </div>
                        <div className="grid grid-cols-7 gap-4">
                            {days.map((day, index) => (
                                <div key={index} className="text-center py-1">
                                    {day.isSelected ? (
                                        <div className="bg-red-600 text-white w-8 h-8 rounded-full flex items-center justify-center mx-auto">
                                            {day.day}
                                        </div>
                                    ) : (
                                        <span className={`${!day.isCurrentMonth ? 'text-gray-300' : ''}`}>
                                            {day.day}
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-[#FFFFFF] p-6 rounded-lg shadow-sm w-100 mx-auto flex-1">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Clock Section */}
                    <div className="flex flex-col items-center justify-center">
                        <div className="relative w-100 h-[100%]">
                            <img src={EmployeeClock} />
                            <div className="mt-0 text-2xl font-medium text-center">12 : 16 PM</div>
                        </div>

                    </div>

                    {/* Middle Section */}
                    <div className="flex flex-col justify-between">
                        {/* Working Hours */}
                        <div className="border border-gray-200 rounded-lg p-4 mb-4">
                            <div className="text-[#1F4062] font-medium text-sm mb-1">Working Hours</div>
                            <div className="text-[#141516] font-bold">0 Hr 00 Mins 00 Secs</div>
                        </div>

                        {/* Break Hours */}
                        <div className="border border-gray-200 rounded-lg p-4">
                            <div className="text-[#1F4062] font-medium text-sm mb-1">Break Hours</div>
                            <div className="text-[#141516] font-bold">00 Hr 00 Mins 55 Secs</div>
                        </div>

                        {/* Buttons */}
                        <div className="mt-4 flex space-x-4">
                            <div className="flex items-center text-[#C01824]">
                                <FaCalendarAlt size={20} />
                            </div>
                            <div className="flex-1">
                                <button className="w-full bg-[#C01824] hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md">
                                    Punch In
                                </button>
                            </div>
                        </div>

                        <div className="mt-4 flex space-x-4">
                            <div className="flex items-center text-[#C01824]">
                                <FaClock size={20} />
                            </div>
                            <div className="flex-1">
                                <button className="w-full bg-[#C01824] hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md">
                                    Time Card
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Right Section */}
                    <div className="flex flex-col items-center justify-center w-100 h-60 rounded-lg bg-white"
                        style={{
                            boxShadow: '#F9E8E9',
                        }}
                    >
                        <div className="w-100 h-32 items-center justify-center">
                            <img src={employeeTimeTracking} className="w-48 h-[100%] mx-3" />
                            <p className="mt-2 text-sm text-[#C01824] text-center  italic">Punctuality is the virtue of the bored.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}