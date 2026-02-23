import { useState, useEffect } from 'react';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { Watch } from '@/assets';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSchedule } from '@/redux/slices/employeeDashboardSlice';
import dayjs from 'dayjs';
import EventModal from './EventModal';

// Get Monday of the week containing a given date
const getMondayOf = (date) => {
  const d = dayjs(date);
  const dow = d.day(); // 0=Sun
  const offset = dow === 0 ? -6 : 1 - dow;
  return d.add(offset, 'day').startOf('day');
};

const hours = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
const tabs  = ['Year', 'Week', 'Month', 'Day'];

const CalendarView = () => {
  const dispatch  = useDispatch();
  const { schedule, loading } = useSelector((s) => s.employeeDashboard);

  const [weekStart, setWeekStart] = useState(() => getMondayOf(dayjs()));
  const [activeTab, setActiveTab] = useState('Week');
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    dispatch(fetchSchedule(weekStart.format('YYYY-MM-DD')));
  }, [weekStart, dispatch]);

  const events = schedule?.events ?? [];

  // Build Mon–Sun day columns
  const days = Array.from({ length: 7 }, (_, i) => {
    const dayDate = weekStart.add(i, 'day');
    const dateStr = dayDate.format('YYYY-MM-DD');
    const dayEvents = events.filter((ev) =>
      dayjs(ev.startTime).local().format('YYYY-MM-DD') === dateStr
    );
    return { day: dayDate.format('dddd'), date: dayDate.format('D'), dateStr, events: dayEvents };
  });

  const weekLabel = `${weekStart.format('MMM D')} – ${weekStart.add(6, 'day').format('MMM D, YYYY')}`;

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div className="font-bold bg-white border shadow p-3 py-2 rounded-2xl">Today</div>

        <div className="flex items-center space-x-4">
          <button
            onClick={() => setWeekStart((w) => w.subtract(7, 'day'))}
            className="text-gray-500 bg-white border shadow p-3 py-2 rounded-2xl"
          >
            <IoIosArrowBack />
          </button>
          <span className="text-sm font-bold">{weekLabel}</span>
          <button
            onClick={() => setWeekStart((w) => w.add(7, 'day'))}
            className="text-gray-500 bg-white border shadow p-3 py-2 rounded-2xl"
          >
            <IoIosArrowForward />
          </button>
        </div>

        <div className="flex justify-center">
          <div className="bg-white rounded-full flex items-center p-1 shadow-sm border border-gray-100">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2 text-sm font-bold rounded-full transition-colors ${
                  activeTab === tab ? 'bg-white text-black shadow-sm' : 'text-gray-400 hover:text-gray-500'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Loading overlay */}
      {loading.schedule && (
        <p className="text-center text-sm text-gray-400 mb-2">Loading schedule...</p>
      )}

      {/* Calendar grid */}
      <div className="grid grid-cols-8 gap-1 border">
        {/* Time column */}
        <div className="col-span-1">
          <div className="h-16 flex items-center justify-center border-l border-t border-b">
            <img src={Watch} alt="time" />
          </div>
          {hours.map((hour) => (
            <div key={hour} className="h-16 flex font-bold items-center justify-center text-xs border-l border-t border-b">
              {hour}:00
            </div>
          ))}
        </div>

        {/* Day columns */}
        {days.map((day, index) => (
          <div key={index} className="col-span-1 border-l border-t border-b border-gray-100">
            <div className="h-16 border-b border-gray-100 flex items-center justify-center text-center">
              <div className="text-xs text-black font-bold">{day.day} {day.date}</div>
            </div>

            <div className="relative h-[768px]">
              {day.events.map((event, ei) => {
                const start    = dayjs(event.startTime).local();
                const end      = dayjs(event.endTime).local();
                const startH   = start.hour() + start.minute() / 60;
                const endH     = end.hour() + end.minute() / 60;
                const top      = Math.max((startH - 9) * 64, 0);
                const height   = Math.max((endH - startH) * 64, 32);
                const timeLabel = `${start.format('HH:mm')}-${end.format('HH:mm')}`;

                return (
                  <div
                    key={ei}
                    className="absolute w-[95%] rounded-md p-2 cursor-pointer overflow-hidden"
                    style={{
                      top:    `${top}px`,
                      height: `${height}px`,
                      backgroundColor: event.color ? `${event.color}1A` : '#F0F0F0',
                      border: `2px solid ${event.color || '#C01824'}`,
                    }}
                    onClick={() => { setSelectedEvent(event); setShowModal(true); }}
                  >
                    <div className="text-xs text-black font-medium mb-1">{timeLabel}</div>
                    <div className="text-xs text-black font-medium">{event.title}</div>
                    {event.location && (
                      <div className="text-xs text-gray-600 truncate">{event.location}</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <EventModal
          closeModal={() => { setShowModal(false); setSelectedEvent(null); }}
          event={selectedEvent}
        />
      )}
    </div>
  );
};

export default CalendarView;
