import React, { useState } from 'react';
import {
  clock,
  employeeTimeTracking,
  homeclock,
  punch,
} from '@/assets';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import dayjs from 'dayjs';
import AddAttendance from '../components/Modals/AddAttendance';
import AttendanceModal from '../components/Modals/AddAttendance';

export default function TimeTrackingCard() {
  const [currentDate, setCurrentDate] = useState(dayjs());
  const [selectedDay, setSelectedDay] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const startOfMonth = currentDate.startOf('month');
  const startDay = startOfMonth.day();
  const daysInMonth = currentDate.daysInMonth();

  const daysArray = [];
  for (let i = 0; i < startDay; i++) {
    daysArray.push({ day: null, isCurrentMonth: false });
  }
  for (let i = 1; i <= daysInMonth; i++) {
    daysArray.push({ day: i, isCurrentMonth: true });
  }

  const handlePrevMonth = () => {
    setCurrentDate(prev => prev.subtract(1, 'month'));
    setSelectedDay(null);
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => prev.add(1, 'month'));
    setSelectedDay(null);
  };

  const handleDayClick = (day) => {
    if (day !== null) {
      setSelectedDay(day);
    }
  };

  const handlePunchInClick = () => {
    setShowModal(true);
  };

  return (
    <>
      <h1 className="text-xl font-semibold text-gray-800 ml-5">Attendance</h1>
      <div className="flex flex-row w-full gap-4 p-4 mt-[-20px]">
        {/* Calendar */}
        <div className="max-w-md shadow-sm ">
          <div className="bg-white rounded-xl shadow-sm p-6 h-[450px]">
            <div className="flex justify-between items-center mb-4 text-red-600 font-medium text-xl">
              <button onClick={handlePrevMonth}><FaChevronLeft /></button>
              {currentDate.format('MMMM YYYY')}
              <button onClick={handleNextMonth}><FaChevronRight /></button>
            </div>

            <div className="grid grid-cols-7 gap-4 mb-2">
              {weekdays.map((day, index) => (
                <div key={index} className="text-center text-sm font-medium">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-4">
              {daysArray.map((item, index) => (
                <div key={index} className="text-center py-1">
                  {item.day ? (
                    <div
                      onClick={() => handleDayClick(item.day)}
                      className={`w-8 h-8 flex items-center justify-center mx-auto rounded-full cursor-pointer ${
                        selectedDay === item.day
                          ? 'bg-red-600 text-white'
                          : 'hover:bg-red-100 text-black'
                      }`}
                    >
                      {item.day}
                    </div>
                  ) : (
                    <span className="text-gray-300">-</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="bg-[#FFFFFF] p-6 rounded-lg shadow-sm w-full flex-1">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Clock */}
            <div className="flex flex-col items-center justify-center">
              <img src={homeclock} />
              <div className="mt-5 text-2xl font-medium text-center">12 : 16 PM</div>
            </div>

            {/* Middle Info */}
            <div className="flex flex-col justify-between">
              <div className="border border-gray-200 rounded-lg p-4 mb-4 shadow-md">
                <div className="text-[#1F4062] font-medium text-sm mb-1">Working Hours</div>
                <div className="text-[#141516] font-bold xl:text-[14px]">0 Hr 00 Mins 00 Secs</div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4 shadow-md">
                <div className="text-[#1F4062] font-medium text-sm mb-1">Break Hours</div>
                <div className="text-[#141516] font-bold xl:text-[14px]">00 Hr 00 Mins 55 Secs</div>
              </div>

            <div className="mt-[60px] border rounded-md p-4 shadow-md w-[400px] xl:w-[300px]">
            {/* Punch In */}
            <div className="mt-2 flex items-center gap-3">
              <img src={punch} className="w-5 h-5" />
              <button
                onClick={handlePunchInClick}
                className="flex-1 bg-[#C01824] hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md"
              >
                Punch In
              </button>
            </div>

            {/* Time Card */}
            <div className="mt-4 flex items-center gap-3">
              <img src={clock} className="w-5 h-5" />
              <button
                className="flex-1 bg-[#C01824] hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md"
              >
                Time Card
              </button>
            </div>
          </div>
              </div>

            {/* Image Box */}
            <div className="flex flex-col items-center justify-center w-100 h-[220px] border border-gray-200 rounded-lg bg-white shadow-md">
              <img src={employeeTimeTracking} className="w-[180px] mx-3" />
              <p className="mt-2 text-[#C01824] text-center italic lg:text-[14px] lg:mb-5">
                Punctuality is the virtue of the bored.
              </p>
            </div>
          </div>
        </div>
      </div>

        <AttendanceModal isOpen={showModal} onClose={() => setShowModal(false)} />

    </>
  );
}
