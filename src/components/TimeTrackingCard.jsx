import React, { useEffect, useState } from 'react';
import { clock, employeeTimeTracking, punch } from '@/assets';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import dayjs from 'dayjs';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEmployeeDashboard, punchAttendance, fetchAttendanceReport } from '@/redux/slices/employeeDashboardSlice';
import AttendanceModal from './Modals/AddAttendance';
import BreakModal from './Modals/BreakModal';
import AnalogClock from './AnalogClock';

const PUNCH_LABEL = {
  NOT_PUNCHED: 'Punch In',
  PUNCHED_IN:  'Punch Out',
  PUNCHED_OUT: 'Punch In',
  ON_BREAK:    'End Break',
};

const STATUS_QUOTE = {
  NOT_PUNCHED: 'Punctuality is the virtue of the bored.',
  PUNCHED_IN:  'Great start! Keep the momentum going.',
  ON_BREAK:    'Rest well, the best work comes after a good break.',
  PUNCHED_OUT: 'Another day done. Well played!',
};

export default function TimeTrackingCard() {
  const dispatch = useDispatch();

  const employeeDashboard = useSelector((state) => state.employeeDashboard);
  const dashboardData     = employeeDashboard?.dashboardData ?? null;
  const attendanceReport  = employeeDashboard?.attendanceReport ?? null;
  const loading = employeeDashboard?.loading ?? { dashboard: false, punch: false, report: false };

  const [currentDate, setCurrentDate] = useState(dayjs());
  const [selectedDay, setSelectedDay] = useState(null);
  const [showModal, setShowModal]     = useState(false);
  const [digitalTime, setDigitalTime] = useState(dayjs().format('hh : mm A'));

  // Update digital time every second
  useEffect(() => {
    const t = setInterval(() => setDigitalTime(dayjs().format('hh : mm A')), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    dispatch(fetchEmployeeDashboard());
  }, [dispatch]);

  // Fetch attendance report when calendar month/year changes
  useEffect(() => {
    dispatch(fetchAttendanceReport({ month: currentDate.month() + 1, year: currentDate.year() }));
    setSelectedDay(null);
  }, [currentDate, dispatch]);

  // Build a map of date → record for quick lookup
  const attendedDates = {};
  (attendanceReport?.records || []).forEach((rec) => {
    if (rec.date) attendedDates[rec.date] = rec;
  });

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const startDay = currentDate.startOf('month').day();
  const daysInMonth = currentDate.daysInMonth();
  const daysArray = [];
  for (let i = 0; i < startDay; i++) daysArray.push(null);
  for (let i = 1; i <= daysInMonth; i++) daysArray.push(i);

  const punchStatus     = dashboardData?.today?.punchStatus    || 'NOT_PUNCHED';
  const workingHours    = dashboardData?.today?.workingHours   || '0 Hr 00 Mins';
  const breakHours      = dashboardData?.today?.breakHours     || '0 Hr 00 Mins';
  const breakStartTime  = dashboardData?.today?.breakStartTime || null;

  // Selected day detail
  const selectedDateStr = selectedDay
    ? currentDate.date(selectedDay).format('YYYY-MM-DD')
    : null;
  const selectedRecord = selectedDateStr ? attendedDates[selectedDateStr] : null;
  const buttonLabel     = PUNCH_LABEL[punchStatus] || 'Punch In';
  const isPunching      = loading.punch === true;
  const isOnBreak       = punchStatus === 'ON_BREAK';

  const handleAction = (action) => {
    dispatch(punchAttendance(action));
    setShowModal(false);
  };

  return (
    <>
      <h1 className="text-xl font-semibold text-gray-800 ml-5">Attendance</h1>

      <div className="flex flex-row w-full gap-4 p-4 mt-[-20px]">

        {/* ── Calendar ── */}
        <div className="bg-white rounded-xl shadow-sm p-6 w-[320px] flex-shrink-0">
          <div className="flex justify-between items-center mb-4 text-red-600 font-medium text-xl">
            <button onClick={() => setCurrentDate(d => d.subtract(1, 'month'))}>
              <FaChevronLeft />
            </button>
            {currentDate.format('MMMM YYYY')}
            <button onClick={() => setCurrentDate(d => d.add(1, 'month'))}>
              <FaChevronRight />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekdays.map(d => (
              <div key={d} className="text-center text-xs font-medium text-gray-500">{d}</div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {daysArray.map((day, i) => {
              const dateStr = day ? currentDate.date(day).format('YYYY-MM-DD') : null;
              const hasRecord = dateStr && attendedDates[dateStr];
              const isToday = dateStr === dayjs().format('YYYY-MM-DD');
              const isSelected = selectedDay === day;
              return (
                <div key={i} className="flex flex-col items-center py-1">
                  {day ? (
                    <>
                      <div
                        onClick={() => setSelectedDay(isSelected ? null : day)}
                        className={`w-8 h-8 flex items-center justify-center rounded-full cursor-pointer text-sm font-medium transition-colors ${
                          isSelected
                            ? 'bg-red-600 text-white'
                            : isToday
                            ? 'border-2 border-red-400 text-red-600'
                            : 'hover:bg-red-100 text-black'
                        }`}
                      >
                        {day}
                      </div>
                      {hasRecord && (
                        <div className={`w-1.5 h-1.5 rounded-full mt-0.5 ${isSelected ? 'bg-white' : 'bg-green-500'}`} />
                      )}
                    </>
                  ) : <span />}
                </div>
              );
            })}
          </div>

          {/* Selected day detail */}
          {selectedRecord && (
            <div className="mt-4 border border-gray-100 rounded-lg p-3 bg-gray-50 text-xs space-y-1">
              <div className="font-semibold text-gray-700 mb-1">{selectedDateStr}</div>
              <div className="flex justify-between">
                <span className="text-gray-500">Punch In</span>
                <span className="font-medium">{selectedRecord.punchIn?.slice(0,5) || '--'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Punch Out</span>
                <span className="font-medium">{selectedRecord.punchOut?.slice(0,5) || '--'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Work Hours</span>
                <span className="font-medium text-green-600">{selectedRecord.duration || '--'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Status</span>
                <span className={`font-medium ${selectedRecord.status === 'Completed' ? 'text-green-600' : 'text-yellow-600'}`}>
                  {selectedRecord.status || '--'}
                </span>
              </div>
            </div>
          )}
          {selectedDay && !selectedRecord && (
            <div className="mt-4 text-center text-xs text-gray-400 py-2">
              No attendance record for this day
            </div>
          )}
        </div>

        {/* ── Right Section ── */}
        <div className="bg-white p-6 rounded-lg shadow-sm flex-1">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* Live Analog Clock */}
            <div className="flex flex-col items-center justify-center">
              <AnalogClock size={180} />
              <div className="mt-3 text-xl font-medium text-center text-gray-700">
                {digitalTime}
              </div>
            </div>

            {/* Hours + Buttons */}
            <div className="flex flex-col gap-4">
              <div className="border border-gray-200 rounded-lg p-4 shadow-sm">
                <div className="text-[#1F4062] font-medium text-sm mb-1">Working Hours</div>
                <div className="text-[#141516] font-bold text-sm">
                  {loading.dashboard ? '...' : workingHours}
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4 shadow-sm">
                <div className="text-[#1F4062] font-medium text-sm mb-1">Break Hours</div>
                <div className="text-[#141516] font-bold text-sm">
                  {loading.dashboard ? '...' : breakHours}
                </div>
              </div>

              <div className="border rounded-md p-4 shadow-sm flex flex-col gap-3">
                {/* Punch button → opens modal */}
                <div className="flex items-center gap-3">
                  <img src={punch} className="w-5 h-5" alt="punch" />
                  <button
                    onClick={() => setShowModal(true)}
                    disabled={isPunching}
                    className="flex-1 bg-[#C01824] hover:bg-red-700 disabled:opacity-60 text-white font-medium py-2 px-4 rounded-md"
                  >
                    {isPunching ? 'Please wait...' : buttonLabel}
                  </button>
                </div>

                {/* Time Card button */}
                <div className="flex items-center gap-3">
                  <img src={clock} className="w-5 h-5" alt="clock" />
                  <button
                    onClick={() => setShowModal(true)}
                    className="flex-1 bg-[#C01824] hover:bg-red-700 text-white font-medium py-2 px-4 rounded-md"
                  >
                    Time Card
                  </button>
                </div>
              </div>
            </div>

            {/* Quote image */}
            <div className="flex flex-col items-center justify-center border border-gray-200 rounded-lg bg-white shadow-sm p-4">
              <img src={employeeTimeTracking} className="w-[160px]" alt="tracking" />
              <p className="mt-3 text-[#C01824] text-center italic text-sm">
                {STATUS_QUOTE[punchStatus] || STATUS_QUOTE.NOT_PUNCHED}
              </p>
            </div>

          </div>
        </div>
      </div>

      {/* Attendance Modal (punch in/out) */}
      <AttendanceModal
        isOpen={showModal && !isOnBreak}
        onClose={() => setShowModal(false)}
        onAction={handleAction}
        punchStatus={punchStatus}
        isPunching={isPunching}
        workingHours={workingHours}
        breakHours={breakHours}
      />

      {/* Full-screen Break Modal — ON_BREAK pe automatically */}
      <BreakModal
        isOpen={isOnBreak}
        onEndBreak={() => handleAction('break_end')}
        isPunching={isPunching}
        breakStartTime={breakStartTime}
        workingHours={workingHours}
      />
    </>
  );
}
