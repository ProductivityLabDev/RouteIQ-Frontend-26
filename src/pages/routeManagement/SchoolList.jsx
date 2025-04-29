import React, { useState } from 'react';
import { format } from "date-fns";
import { DayPicker } from "react-day-picker";
import { LakeviewSchoolLogo, RosewoodSchoolLogo, SkylineSchoolLogo, SpringdaleSchoolLogo, calendar, driver, leftArrow, redbusicon, rightArrow } from '@/assets';
import { ButtonGroup, Button, Input, Popover, PopoverContent, PopoverHandler, } from '@material-tailwind/react';
import { ChevronRightIcon, ChevronLeftIcon } from "@heroicons/react/24/outline";
import { studentsData } from '@/data/dummyData';
export default function SchoolList({ handleMapScreenClick, handleEditRoute }) {
    const [isOpen, setIsOpen] = useState(false);
    const [expandedRoutes, setExpandedRoutes] = useState({
        route1: true,
        route2: false,
        route3: false,
        route4: false
    });
    const [selectedTabTime, setSelectedTabTime] = useState('AM');
    const [date, setDate] = useState();
    const [currentPage, setCurrentPage] = useState(1);
    const toggleRoute = (routeId) => {
        setExpandedRoutes(prev => ({
            ...prev,
            [routeId]: !prev[routeId]
        }));
    };
    return (
        <div className="w-full p-4">
            {/* Skyline High School */}

            <div className="border border-gray-200 rounded-lg shadow-sm">
                {/* School Header */}
                <div className="p-4 flex items-center justify-between border-b border-gray-200">
                    <div className="flex items-center">
                        <button className="mr-3">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="3" y1="12" x2="21" y2="12"></line>
                                <line x1="3" y1="6" x2="21" y2="6"></line>
                                <line x1="3" y1="18" x2="21" y2="18"></line>
                            </svg>
                        </button>

                        <div className="w-12 h-12  flex items-center justify-center text-white  mr-3">
                            <img src={SkylineSchoolLogo} />
                        </div>

                        <div className="font-bold text-lg">Skyline High School</div>

                        <button className="text-gray-600 hover:text-gray-800 ml-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                            </svg>
                        </button>
                    </div>

                    <div className="flex items-center">
                        <div className="mr-4">
                            <span className="font-bold">Total Students:</span> 459
                        </div>

                        <div className="mr-4">
                            <span className="font-bold">Total Buses:</span> 10
                        </div>

                        <button className="bg-[#C01824] text-white px-3 py-1 rounded mr-3 flex items-center" onClick={handleMapScreenClick}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1" >
                                <polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
                            </svg>
                            Map
                        </button>

                        <button>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} onClick={() => setIsOpen(!isOpen)}>
                                <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                        </button>
                    </div>
                </div>
                {isOpen && (
                    <div className="p-4">
                        {/* Route 1 */}
                        <div className="mb-4">
                            <div className="border border-gray-200 rounded-md p-4 flex items-center justify-between">
                                <div className="flex items-center">
                                    <button className="mr-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <line x1="3" y1="12" x2="21" y2="12"></line>
                                            <line x1="3" y1="6" x2="21" y2="6"></line>
                                            <line x1="3" y1="18" x2="21" y2="18"></line>
                                        </svg>
                                    </button>
                                    <div className="font-bold">Route 1</div>
                                    <button className="text-gray-600 hover:text-gray-800 ml-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                        </svg>
                                    </button>
                                </div>
                                <div className='flex items-center gap-5'>
                                    <div className="md:w-[250px]">
                                        <Popover placement="bottom">
                                            <PopoverHandler>
                                                <div className="relative">
                                                    <Input
                                                        label="Select a Date"
                                                        onChange={() => null}
                                                        value={date ? format(date, "PPP") : ""}
                                                    />
                                                    <img src={calendar} alt='' className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
                                                </div>
                                            </PopoverHandler>
                                            <PopoverContent>
                                                <DayPicker
                                                    mode="single"
                                                    selected={date}
                                                    onSelect={setDate}
                                                    showOutsideDays
                                                    className="border-0"
                                                    classNames={{
                                                        caption: "flex justify-center py-1 relative items-center",
                                                        caption_label: "text-sm font-medium text-gray-900",
                                                        nav: "flex items-center",
                                                        nav_button: "h-6 w-6 bg-transparent hover:bg-blue-gray-50 p-1 rounded-md transition-colors duration-300",
                                                        nav_button_previous: "absolute left-1.5",
                                                        nav_button_next: "absolute right-1.5",
                                                        table: "w-full border-collapse",
                                                        head_row: "flex font-medium text-gray-900",
                                                        head_cell: "m-0.5 w-9 font-normal text-sm",
                                                        row: "flex w-full mt-2",
                                                        cell: "text-gray-600 rounded-md h-9 w-9 text-center text-sm p-0 m-0.5 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-gray-900/20 [&:has([aria-selected].day-outside)]:text-white [&:has([aria-selected])]:bg-gray-900/50 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                                                        day: "h-9 w-9 p-0 font-normal",
                                                        day_range_end: "day-range-end",
                                                        day_selected: "rounded-md bg-[#C01824] text-white hover:bg-[#C01824]/90 hover:text-white focus:bg-[#C01824] focus:text-white",
                                                        day_today: "rounded-md bg-gray-200 text-gray-900",
                                                        day_outside: "day-outside text-gray-500 opacity-50 aria-selected:bg-gray-500 aria-selected:text-gray-900 aria-selected:bg-opacity-10",
                                                        day_disabled: "text-gray-500 opacity-50",
                                                        day_hidden: "invisible",
                                                    }}
                                                    components={{
                                                        IconLeft: ({ ...props }) => (
                                                            <ChevronLeftIcon {...props} className="h-4 w-4 stroke-2" />
                                                        ),
                                                        IconRight: ({ ...props }) => (
                                                            <ChevronRightIcon {...props} className="h-4 w-4 stroke-2" />
                                                        ),
                                                    }}
                                                />
                                            </PopoverContent>
                                        </Popover>

                                    </div>
                                    <ButtonGroup className="border-2 border-[#DDDDE1]/50 rounded-[10px] outline-none p-0" variant="text" size='sm'>
                                        {['AM', 'PM'].map(tab => (
                                            <Button
                                                key={tab}
                                                className={selectedTabTime === tab ? 'bg-[#C01824] hover:bg-[#C01824]/80 text-white px-6 py-2 lg:text-[10px] capitalize font-bold' : 'bg-white px-6 py-2 capitalize font-bold'}
                                                onClick={() => setSelectedTabTime(tab)}
                                            >
                                                {tab}
                                            </Button>
                                        ))}
                                    </ButtonGroup>
                                    <button onClick={() => toggleRoute('route1')}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-200 ${expandedRoutes.route1 ? 'rotate-180' : ''}`}>
                                            <polyline points="6 9 12 15 18 9"></polyline>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            {expandedRoutes.route1 && (
                                <div className="p-4">
                                    {/* Bus Info Card */}
                                    <div className="border-4 border-[#28A745] rounded-lg p-4 mb-6">
                                        <div className="flex justify-between">
                                            <div className="flex items-center">
                                                <div className=" p-2 rounded mr-2">
                                                    <img src={redbusicon} />
                                                </div>
                                                <div>
                                                    <span className="font-bold">SDD 104</span> <span className="text-gray-600">#15248 🦁</span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <span className="font-bold">8:30 AM</span> <span className="text-gray-600">28/MAR/24</span>
                                            </div>
                                        </div>
                                        <div className='flex items-center justify-between'>

                                            <div className="mt-4">
                                                <div className="mb-2">
                                                    <span className="font-bold">School start time</span> 08:30 AM
                                                </div>
                                                <div>
                                                    <span className="font-bold">School dismissal time</span> 02:55 PM
                                                </div>
                                            </div>

                                            <div className="flex justify-between mt-6">
                                                <div className='bg-[#fff] flex flex-col justify-end items-center p-1.5 h-[75px] w-[120px] rounded-md text-center shadow-xl text-white'>
                                                    <img src={driver} className='rounded-full w-14 h-14 object-cover -top-8 left-0' />
                                                    <p className='text-[11px] text-black font-normal'>Driver</p>
                                                    <p className='text-[12.5px] text-black font-semibold'>{'Mark Tommay'}</p>
                                                </div>

                                            </div>
                                            <div className="flex flex-col items-center gap-2">
                                                <button className="bg-[#C01824] text-white px-3 py-1 rounded mr-3 flex items-center" onClick={handleMapScreenClick}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1" >
                                                        <polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
                                                    </svg>
                                                    Map
                                                </button>
                                                <button className="border border-gray-300 px-4 py-2 rounded flex items-center" onClick={handleEditRoute}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                                                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                                                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                                                    </svg>
                                                    Edit
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Search Bar */}
                                    <div className="mb-4 relative">
                                        <svg className="absolute left-3 top-3 text-gray-400" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <circle cx="11" cy="11" r="8"></circle>
                                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                                        </svg>
                                        <input
                                            type="text"
                                            placeholder="Search Student"
                                            className="w-full border border-gray-300 rounded-md py-2 pl-10 pr-4 outline-none "
                                        />
                                    </div>

                                    {/* Table */}
                                    <div className="overflow-x-auto">
                                        <table className="w-full border-collapse">
                                            <thead>
                                                <tr className="bg-gray-100">
                                                    <th className="p-3 text-left font-semibold">Route ID</th>
                                                    <th className="p-3 text-left font-semibold">Route Animal Icon</th>
                                                    <th className="p-3 text-left font-semibold">Student Name(AM)</th>
                                                    <th className="p-3 text-left font-semibold">Time</th>
                                                    <th className="p-3 text-left font-semibold">Pick-up Address(AM)</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {studentsData.map((student, index) => (
                                                    <tr key={index} className="border-t border-gray-200">
                                                        <td className="p-3">{student.id}</td>
                                                        <td className="p-3 text-xl">{student.icon}</td>
                                                        <td className="p-3">{student.name}</td>
                                                        <td className="p-3">{student.time}</td>
                                                        <td className="p-3 whitespace-pre-line">{student.address}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Pagination */}
                                    <div className="flex justify-center mt-6">
                                        <button className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-md bg-[#919EAB]">
                                            <img src={leftArrow} />
                                        </button>

                                        <button className={`w-10 h-10 flex items-center justify-center border border-[#C01824] mx-1 ${currentPage === 1 ? 'text-[#C01824]' : ''}`}>
                                            1
                                        </button>

                                        <button className={`w-10 h-10 flex items-center justify-center border border-gray-300 mx-1 ${currentPage === 2 ? 'bg-red-600 text-white' : ''}`}>
                                            2
                                        </button>

                                        <button className={`w-10 h-10 flex items-center justify-center border border-gray-300 mx-1 ${currentPage === 3 ? 'bg-red-600 text-white' : ''}`}>
                                            3
                                        </button>

                                        <button className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-md bg-[#919EAB]">
                                            <img src={rightArrow} />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Route 2 */}
                        <div className="mb-4">
                            <div className="border border-gray-200 rounded-md p-4 flex items-center justify-between">
                                <div className="flex items-center">
                                    <button className="mr-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <line x1="3" y1="12" x2="21" y2="12"></line>
                                            <line x1="3" y1="6" x2="21" y2="6"></line>
                                            <line x1="3" y1="18" x2="21" y2="18"></line>
                                        </svg>
                                    </button>
                                    <div className="font-bold">Route 2</div>
                                    <button className="text-gray-600 hover:text-gray-800 ml-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                        </svg>
                                    </button>
                                </div>

                                <button onClick={() => toggleRoute('route2')}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-200 ${expandedRoutes.route2 ? 'rotate-180' : ''}`}>
                                        <polyline points="6 9 12 15 18 9"></polyline>
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Route 3 */}
                        <div className="mb-4">
                            <div className="border border-gray-200 rounded-md p-4 flex items-center justify-between">
                                <div className="flex items-center">
                                    <button className="mr-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <line x1="3" y1="12" x2="21" y2="12"></line>
                                            <line x1="3" y1="6" x2="21" y2="6"></line>
                                            <line x1="3" y1="18" x2="21" y2="18"></line>
                                        </svg>
                                    </button>
                                    <div className="font-bold">Route 3</div>
                                    <button className="text-gray-600 hover:text-gray-800 ml-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                        </svg>
                                    </button>
                                </div>

                                <button onClick={() => toggleRoute('route3')}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-200 ${expandedRoutes.route3 ? 'rotate-180' : ''}`}>
                                        <polyline points="6 9 12 15 18 9"></polyline>
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Route 4 */}
                        <div className="mb-4">
                            <div className="border border-gray-200 rounded-md p-4 flex items-center justify-between">
                                <div className="flex items-center">
                                    <button className="mr-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <line x1="3" y1="12" x2="21" y2="12"></line>
                                            <line x1="3" y1="6" x2="21" y2="6"></line>
                                            <line x1="3" y1="18" x2="21" y2="18"></line>
                                        </svg>
                                    </button>
                                    <div className="font-bold">route 4</div>
                                    <button className="text-gray-600 hover:text-gray-800 ml-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                        </svg>
                                    </button>
                                </div>

                                <button onClick={() => toggleRoute('route4')}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-200 ${expandedRoutes.route4 ? 'rotate-180' : ''}`}>
                                        <polyline points="6 9 12 15 18 9"></polyline>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>

                )}
            </div>
            {/* Lakeview High School */}
            <div className="border border-gray-200 rounded-md mb-2 p-4 flex items-center justify-between">
                <div className="flex items-center">
                    <button className="mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="3" y1="12" x2="21" y2="12"></line>
                            <line x1="3" y1="6" x2="21" y2="6"></line>
                            <line x1="3" y1="18" x2="21" y2="18"></line>
                        </svg>
                    </button>

                    <div className="w-12 h-12  flex items-center justify-center text-white  mr-3">
                        <img src={LakeviewSchoolLogo} />
                    </div>

                    <div className="font-bold text-lg">Lakeview High School</div>
                    <button className="text-gray-600 hover:text-gray-800 ml-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                    </button>
                </div>

                <div className="flex items-center">
                    <div className="mr-8">
                        <span className="font-bold">Total Students:</span> 459
                    </div>

                    <div className="mr-4">
                        <span className="font-bold">Total Buses:</span> 10
                    </div>

                    <button className="bg-[#C01824] text-white px-3 py-1 rounded mr-3 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                            <polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
                        </svg>
                        Map
                    </button>

                    <button>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} onClick={() => setIsOpen(!isOpen)}>
                            <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                    </button>
                </div>
            </div>

            {/* Springdale Elementary School */}
            <div className="border border-gray-200 rounded-md mb-2 p-4 flex items-center justify-between">
                <div className="flex items-center">
                    <button className="mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="3" y1="12" x2="21" y2="12"></line>
                            <line x1="3" y1="6" x2="21" y2="6"></line>
                            <line x1="3" y1="18" x2="21" y2="18"></line>
                        </svg>
                    </button>

                    <div className="w-12 h-12  flex items-center justify-center text-white  mr-3">
                        <img src={SpringdaleSchoolLogo} />
                    </div>

                    <div className="font-bold text-lg">Springdale Elementary School</div>
                    <button className="text-gray-600 hover:text-gray-800 ml-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                    </button>
                </div>

                <div className="flex items-center">
                    <div className="mr-8">
                        <span className="font-bold">Total Students:</span> 459
                    </div>

                    <div className="mr-4">
                        <span className="font-bold">Total Buses:</span> 10
                    </div>

                    <button className="bg-[#C01824] text-white px-3 py-1 rounded mr-3 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                            <polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
                        </svg>
                        Map
                    </button>

                    <button>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                    </button>
                </div>
            </div>

            {/* Rosewood Elementary School */}
            <div className="border border-gray-200 rounded-md mb-2 p-4 flex items-center justify-between">
                <div className="flex items-center">
                    <button className="mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="3" y1="12" x2="21" y2="12"></line>
                            <line x1="3" y1="6" x2="21" y2="6"></line>
                            <line x1="3" y1="18" x2="21" y2="18"></line>
                        </svg>
                    </button>

                    <div className="w-12 h-12  flex items-center justify-center text-white  mr-3">
                        <img src={RosewoodSchoolLogo} />
                    </div>

                    <div className="font-bold text-lg">Rosewood Elementary School</div>

                    <button className="text-gray-600 hover:text-gray-800 ml-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                    </button>
                </div>

                <div className="flex items-center">
                    <div className="mr-8">
                        <span className="font-bold">Total Students:</span> 459
                    </div>

                    <div className="mr-4">
                        <span className="font-bold">Total Buses:</span> 10
                    </div>

                    <button className="bg-[#C01824] text-white px-3 py-1 rounded mr-3 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                            <polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
                        </svg>
                        Map
                    </button>

                    <button>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}