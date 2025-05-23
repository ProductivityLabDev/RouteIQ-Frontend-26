import { Client, Client1, Client2, Client3, Client4, Watch } from '@/assets';
import { useState } from 'react';
import {
    IoIosArrowBack,
    IoIosArrowForward
} from 'react-icons/io';
import EventModal from './EventModal';

const CalendarView = () => {
    const [activeTab, setActiveTab] = useState('Week');
    const [showModal, setShowModal] = useState(false);
    const closeModal = () => setShowModal(false);

    const tabs = ['Year', 'Week', 'Month', 'Day'];
    // Days of the week with dates
    const days = [
        {
            day: 'Monday',
            date: '12',
            events: [
                {
                    time: '09:00-10:00',
                    title: 'Weekly Team',
                    color: 'bg-[#29CC390D]',
                    borderColor: '#C01824',
                    attendees: [1, 2],
                },
            ],
        },
        {
            day: 'Tuesday',
            date: '13',
            events: [
                {
                    time: '10:00-11:00',
                    title: 'The Monday Update',
                    subtitle: '',
                    color: 'bg-[#FF66330D]',
                    borderColor: '#202224',
                    attendees: [1, 3],
                },
            ],
        },
        {
            day: 'Wednesday',
            date: '14',
            events: [
                {
                    time: '12:00-13:00',
                    title: 'Checking & Quality',
                    subtitle: 'Customer led',
                    color: 'bg-[#29CC390D]',
                    borderColor: '#C01824',
                    attendees: [1, 2],
                },
            ],
        },
        {
            day: 'Thursday',
            date: '15',
            events: [
                {
                    time: '11:00-13:00',
                    title: 'Onboarding',
                    subtitle: "Executive's Meet",
                    color: 'bg-[#FF66330D]',
                    borderColor: '#202224',
                    attendees: [4, 5],
                },
                {
                    time: '17:00-18:00',
                    title: 'The Monday Update',
                    subtitle: '',
                    color: 'bg-[#E62E7B0D]',
                    borderColor: '#C01824',
                    attendees: [1, 2, 3],
                },
            ],
        },
        {
            day: 'Friday',
            date: '16',
            events: [
                {
                    time: '15:00-16:00',
                    title: 'Discussion',
                    subtitle: "Executive's Brief",
                    color: 'bg-[#2EE6CA0D]',
                    borderColor: '#202224',
                    attendees: [1, 3],
                },
            ],
        },
        {
            day: 'Saturday',
            date: '17',
            events: [],
        },
        {
            day: 'Sunday',
            date: '18',
            events: [
                {
                    time: '10:00-11:00',
                    title: 'New Release',
                    subtitle: 'Product A Shift v2',
                    color: 'bg-[#29CC390D]',
                    borderColor: '#C01824',
                    attendees: [1, 2],
                },
                {
                    time: '17:00-18:00',
                    title: 'Checking & Quality',
                    subtitle: 'Customer led',
                    color: 'bg-[#8833FF0D]',
                    borderColor: '#202224',
                    attendees: [1, 2],
                },
            ],
        },
    ];


    // Hours from 9 to 20
    const hours = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];

    // Avatar images using placeholder for demo
    const avatars = {
        1: Client,
        2: Client1,
        3: Client2,
        4: Client3,
        5: Client4
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm">
            {/* Header section */}
            <div className="flex justify-between items-center mb-4">
                <div className="font-bold bg-white border shadow p-3 py-2" style={{ borderRadius: 20 }}>
                    Today
                </div>
                <div className="flex items-center space-x-4 ml-[210px]">
                    <button className="text-gray-500 bg-white border shadow p-3 py-2" style={{ borderRadius: 20 }}>
                        <IoIosArrowBack />
                    </button>
                    <span className="text-sm font-bold">May 12 - 18, 2020</span>
                    <button className="p-1 text-gray-500 bg-white border shadow p-3 py-2" style={{ borderRadius: 20 }}>
                        <IoIosArrowForward />
                    </button>
                </div>
                <div className="flex justify-center">
                    <div className="bg-white rounded-full flex items-center p-1 shadow-sm border border-gray-100">
                        {tabs.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-6 py-2 text-sm font-bold rounded-full transition-colors ${activeTab === tab
                                    ? 'bg-white text-black shadow-sm'
                                    : 'text-gray-400 hover:text-gray-500'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-8 gap-1 border">
                {/* Time column */}
                <div className="col-span-1">
                    <div className="h-16 flex items-center justify-center border-l border-t border-b">
                        <img src={Watch} />
                    </div>
                    {hours.map(hour => (
                       <div key={hour} className="h-16 flex font-bold items-center justify-center text-xs text-black-500 border-l border-t border-b">
                        {hour <= 12 ? hour : hour}
                        </div>
                    ))}
                </div>

                {/* Days columns */}
                {days.map((day, index) => (
                    <div key={index} className="col-span-1 border-l border-t border-b border-gray-100">
                        {/* Day header */}

                        <div className="h-16 border-b border-gray-100 flex items-center justify-center text-center">
                        <div className="text-xs text-black font-bold">{day.day} {day.date}</div>
                        </div>

                        {/* Events container */}
                        <div className="relative h-[576px] border-l border-t border-b border-black-100">
                            {day.events.map((event, eventIndex) => {
                                // Calculate position based on time
                                const [startTime, endTime] = event.time.split('-');
                                const startHour = parseInt(startTime.split(':')[0]);
                                const endHour = parseInt(endTime.split(':')[0]);
                                const top = (startHour - 9) * 64;
                                const height = (endHour - startHour) * 64;

                                return (
                                    <div
                                        key={eventIndex}
                                        className={`absolute w-[95%] rounded-md p-2 ${event.color} ${event.border ? ` border-[#C01824]${event.border}` : ''} ${event.textColor || 'text-white'}`}
                                        style={{
                                            top: `${top}px`,
                                            height: `${height}px`,
                                            border: `2px solid ${event.borderColor || '#C01824'}`,
                                        }}
                                        onClick={() => setShowModal(true)}

                                    >
                                        <div className="text-xs text-black font-medium mb-1">{event.time}</div>
                                        <div className="text-xs text-black font-medium">{event.title}</div>
                                        {event.subtitle && <div className="text-xs text-black">{event.subtitle}</div>}
                                        <div className="mt-2 flex space-x-1">
                                            {event.attendees.map(id => (
                                                <div key={id} className="w-6 h-6 bg-gray-300 rounded-full overflow-hidden">
                                                    <img
                                                        src={avatars[id] || "/api/placeholder/24/24"}
                                                        alt="attendee"
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
            {showModal && (
                <EventModal closeModal={closeModal} />
            )}
        </div>
    );
};

export default CalendarView;