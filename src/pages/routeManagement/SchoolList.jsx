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
        route1: false,
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

                        <button className="text-gray-600 hover:text-gray-800 ml-3" onClick={() => setIsOpen(!isOpen)}>
                             <svg width="20" height="24" viewBox="0 0 20 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3.27702 20.6328C3.01105 20.6328 2.78653 20.5278 2.60348 20.318C2.42056 20.1079 2.3291 19.8503 2.3291 19.5451V17.1006C2.3291 16.8114 2.3766 16.535 2.4716 16.2714C2.56646 16.0079 2.70195 15.7753 2.87806 15.5733L13.3191 3.61121C13.4924 3.42443 13.6848 3.28132 13.8962 3.18188C14.1074 3.08244 14.3292 3.03271 14.5614 3.03271C14.7903 3.03271 15.0139 3.08244 15.2322 3.18188C15.4504 3.28132 15.6426 3.43049 15.8087 3.62938L17.1687 5.19657C17.342 5.38334 17.4694 5.60295 17.5508 5.85538C17.6322 6.10765 17.6729 6.36096 17.6729 6.61531C17.6729 6.88177 17.6322 7.13715 17.5508 7.38145C17.4694 7.62592 17.342 7.8476 17.1687 8.04648L6.74848 20.0029C6.5725 20.205 6.36966 20.3604 6.13994 20.4693C5.91035 20.5783 5.66952 20.6328 5.41744 20.6328H3.27702ZM14.5556 7.94823L15.7222 6.61531L14.5506 5.26517L13.3789 6.60384L14.5556 7.94823Z" fill="#1C1B1F"/>
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

                        <button onClick={() => setIsOpen(!isOpen)}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-200 `}>
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
                                    <button className="text-gray-600 hover:text-gray-800 ml-3" onClick={() => toggleRoute('route1')}>
                                         <svg width="20" height="24" viewBox="0 0 20 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                           <path d="M3.27702 20.6328C3.01105 20.6328 2.78653 20.5278 2.60348 20.318C2.42056 20.1079 2.3291 19.8503 2.3291 19.5451V17.1006C2.3291 16.8114 2.3766 16.535 2.4716 16.2714C2.56646 16.0079 2.70195 15.7753 2.87806 15.5733L13.3191 3.61121C13.4924 3.42443 13.6848 3.28132 13.8962 3.18188C14.1074 3.08244 14.3292 3.03271 14.5614 3.03271C14.7903 3.03271 15.0139 3.08244 15.2322 3.18188C15.4504 3.28132 15.6426 3.43049 15.8087 3.62938L17.1687 5.19657C17.342 5.38334 17.4694 5.60295 17.5508 5.85538C17.6322 6.10765 17.6729 6.36096 17.6729 6.61531C17.6729 6.88177 17.6322 7.13715 17.5508 7.38145C17.4694 7.62592 17.342 7.8476 17.1687 8.04648L6.74848 20.0029C6.5725 20.205 6.36966 20.3604 6.13994 20.4693C5.91035 20.5783 5.66952 20.6328 5.41744 20.6328H3.27702ZM14.5556 7.94823L15.7222 6.61531L14.5506 5.26517L13.3789 6.60384L14.5556 7.94823Z" fill="#1C1B1F"/>
                                           </svg>
                                    </button>
                                </div>
                                <div className='flex items-center gap-5'>
                                        {/* <div className="md:w-[250px]">
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

                                        </div> */}
                                    {/* <ButtonGroup className="border-2 border-[#DDDDE1]/50 rounded-[10px] outline-none p-0" variant="text" size='sm'>
                                        {['AM', 'PM'].map(tab => (
                                            <Button
                                                key={tab}
                                                className={selectedTabTime === tab ? 'bg-[#C01824] hover:bg-[#C01824]/80 text-white px-6 py-2 lg:text-[10px] capitalize font-bold' : 'bg-white px-6 py-2 capitalize font-bold'}
                                                onClick={() => setSelectedTabTime(tab)}
                                            >
                                                {tab}
                                            </Button>
                                        ))}
                                    </ButtonGroup> */}
                                    <button onClick={() => toggleRoute('route1')}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-200 ${expandedRoutes.route1 ? 'rotate-180' : ''}`}>
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
                                                   <span className="font-bold text-[20px] text-[#141516]">SDD 104</span> 
                                                   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                                   <span className="text-[20px] text-[#141516] font-bold">#15248 🦁</span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <span className="font-semibold text-[#141516] text-[14px]">8:30 AM</span> <span className="font-semibold text-[#141516] text-[14px]">28/MAR/24</span>
                                            </div>
                                        </div>
                                        <div className='flex items-center justify-between'>

                                            <div className="mt-4">
                                                <div className="mb-2">
                                                    <span className="font-bold text-black text-[20px]">School start time 08:30 AM</span> 
                                                </div>
                                                <div>
                                                    <span className="font-bold text-black text-[20px]">School dismissal time 02:55 PM</span> 
                                                </div>
                                            </div>

                                            <div className="mb-8 mr-10">
                                            <div className="flex items-center p-4 h-[120px] w-[250px] rounded-lg shadow-md">
                                                <img src={driver} alt="Driver" className="rounded-full w-14 h-14 object-cover mr-4" />
                                                <div className="text-left">
                                                <p className="text-[18px] font-bold text-[#141516]">Mark Tommay</p>
                                                <p className="text-[13px] text-[#7C7D7D] font-semibold">Driver</p>
                                                </div>
                                            </div>
                                            </div>
                                            <div className="flex flex-col items-center gap-2">
                                                <button className="bg-[#C01824] text-white px-6 py-1 rounded flex items-center" onClick={handleMapScreenClick}>
                                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M9.53532 17.7481C8.13745 17.7481 6.99673 17.5272 6.11317 17.0854C5.22961 16.6436 4.78783 16.0733 4.78783 15.3743C4.78783 15.1238 4.84388 14.893 4.95597 14.682C5.06806 14.471 5.2362 14.2732 5.46039 14.0885C5.64502 13.9567 5.84613 13.9039 6.06372 13.9303C6.28131 13.9567 6.45605 14.0622 6.58792 14.2468C6.7198 14.4314 6.76925 14.6325 6.73628 14.8501C6.70331 15.0677 6.59451 15.2424 6.40989 15.3743C6.58133 15.5853 6.97695 15.7699 7.59676 15.9282C8.21657 16.0864 8.86276 16.1656 9.53532 16.1656C10.2079 16.1656 10.8541 16.0864 11.4739 15.9282C12.0937 15.7699 12.4893 15.5853 12.6608 15.3743C12.4761 15.2424 12.3673 15.0677 12.3344 14.8501C12.3014 14.6325 12.3508 14.4314 12.4827 14.2468C12.6146 14.0622 12.7893 13.9567 13.0069 13.9303C13.2245 13.9039 13.4256 13.9567 13.6103 14.0885C13.8344 14.2732 14.0026 14.471 14.1147 14.682C14.2268 14.893 14.2828 15.1238 14.2828 15.3743C14.2828 16.0733 13.841 16.6436 12.9575 17.0854C12.0739 17.5272 10.9332 17.7481 9.53532 17.7481ZM9.53532 14.9985C9.37707 14.9985 9.21882 14.9721 9.06057 14.9194C8.90232 14.8666 8.75726 14.7875 8.62539 14.682C7.06926 13.4424 5.90877 12.2324 5.14389 11.0521C4.37902 9.87185 3.99658 8.71465 3.99658 7.58052C3.99658 6.64421 4.16472 5.82329 4.501 5.11776C4.83728 4.41223 5.26917 3.82209 5.79667 3.34734C6.32417 2.87259 6.91761 2.51653 7.57698 2.27916C8.23636 2.04178 8.88914 1.9231 9.53532 1.9231C10.1815 1.9231 10.8343 2.04178 11.4937 2.27916C12.153 2.51653 12.7465 2.87259 13.274 3.34734C13.8015 3.82209 14.2334 4.41223 14.5696 5.11776C14.9059 5.82329 15.0741 6.64421 15.0741 7.58052C15.0741 8.71465 14.6916 9.87185 13.9268 11.0521C13.1619 12.2324 12.0014 13.4424 10.4453 14.682C10.3134 14.7875 10.1683 14.8666 10.0101 14.9194C9.85182 14.9721 9.69357 14.9985 9.53532 14.9985ZM9.53532 9.04433C9.97051 9.04433 10.3431 8.88938 10.653 8.57947C10.9629 8.26957 11.1178 7.89702 11.1178 7.46184C11.1178 7.02665 10.9629 6.6541 10.653 6.3442C10.3431 6.03429 9.97051 5.87934 9.53532 5.87934C9.10014 5.87934 8.72759 6.03429 8.41768 6.3442C8.10778 6.6541 7.95283 7.02665 7.95283 7.46184C7.95283 7.89702 8.10778 8.26957 8.41768 8.57947C8.72759 8.88938 9.10014 9.04433 9.53532 9.04433Z" fill="white"/>
                                                    </svg>

                                                    Map
                                                </button>
                                                
                                                <button className="border border-gray-300 px-6 py-1 rounded flex items-center" onClick={handleEditRoute}>
                                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M3.20531 16.7498C2.98112 16.7498 2.7932 16.674 2.64155 16.5223C2.48989 16.3707 2.41406 16.1827 2.41406 15.9586V14.0398C2.41406 13.8288 2.45362 13.6277 2.53275 13.4364C2.61187 13.2452 2.72397 13.0771 2.86903 12.932L12.8585 2.96229C13.0168 2.81723 13.1915 2.70514 13.3827 2.62601C13.574 2.54689 13.7751 2.50732 13.9861 2.50732C14.1971 2.50732 14.4015 2.54689 14.5993 2.62601C14.7971 2.70514 14.9685 2.82382 15.1136 2.98207L16.2016 4.08982C16.3598 4.23488 16.4752 4.40632 16.5477 4.60413C16.6203 4.80195 16.6565 4.99976 16.6565 5.19757C16.6565 5.40857 16.6203 5.60968 16.5477 5.8009C16.4752 5.99212 16.3598 6.16685 16.2016 6.3251L6.23184 16.2948C6.08678 16.4399 5.91863 16.552 5.72742 16.6311C5.5362 16.7102 5.33509 16.7498 5.12409 16.7498H3.20531ZM13.9663 6.30532L15.074 5.19757L13.9663 4.08982L12.8585 5.19757L13.9663 6.30532Z" fill="#C01824"/>
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
                                    <div className="overflow-x-auto border border-gray-200 rounded-md">
                                        <table className="w-full border-collapse">
                                            <thead>
                                                <tr className="bg-gray-100">
                                                    <th className="p-3 text-left font-bold text-[#141516] text-[14]">Route ID</th>
                                                    <th className="p-3 text-left font-bold text-[#141516] text-[14]">Route Animal Icon</th>
                                                    <th className="p-3 text-left font-bold text-[#141516] text-[14]">Student Name(AM)</th>
                                                    <th className="p-3 text-left font-bold text-[#141516] text-[14]">Time</th>
                                                    <th className="p-3 text-left font-bold text-[#141516] text-[14]">Pick-up Address(AM)</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {studentsData.map((student, index) => (
                                                    <tr key={index} className="border-t border-gray-200">
                                                        <td className="p-3 font-semibold text-[#141516] text-[14]">{student.id}</td>
                                                        <td className="p-3 text-xl">{student.icon}</td>
                                                        <td className="p-3 font-semibold text-[#141516] text-[14]">{student.name}</td>
                                                        <td className="p-3 font-semibold text-[#141516] text-[14]">{student.time}</td>
                                                        <td className="p-3 whitespace-pre-line font-semibold text-[#141516] text-[14]">{student.address}</td>
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
                                         <svg width="20" height="24" viewBox="0 0 20 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                           <path d="M3.27702 20.6328C3.01105 20.6328 2.78653 20.5278 2.60348 20.318C2.42056 20.1079 2.3291 19.8503 2.3291 19.5451V17.1006C2.3291 16.8114 2.3766 16.535 2.4716 16.2714C2.56646 16.0079 2.70195 15.7753 2.87806 15.5733L13.3191 3.61121C13.4924 3.42443 13.6848 3.28132 13.8962 3.18188C14.1074 3.08244 14.3292 3.03271 14.5614 3.03271C14.7903 3.03271 15.0139 3.08244 15.2322 3.18188C15.4504 3.28132 15.6426 3.43049 15.8087 3.62938L17.1687 5.19657C17.342 5.38334 17.4694 5.60295 17.5508 5.85538C17.6322 6.10765 17.6729 6.36096 17.6729 6.61531C17.6729 6.88177 17.6322 7.13715 17.5508 7.38145C17.4694 7.62592 17.342 7.8476 17.1687 8.04648L6.74848 20.0029C6.5725 20.205 6.36966 20.3604 6.13994 20.4693C5.91035 20.5783 5.66952 20.6328 5.41744 20.6328H3.27702ZM14.5556 7.94823L15.7222 6.61531L14.5506 5.26517L13.3789 6.60384L14.5556 7.94823Z" fill="#1C1B1F"/>
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
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                            <line x1="3" y1="12" x2="21" y2="12"></line>
                                            <line x1="3" y1="6" x2="21" y2="6"></line>
                                            <line x1="3" y1="18" x2="21" y2="18"></line>
                                        </svg>
                                    </button>
                                    <div className="font-bold">Route 3</div>
                                    <button className="text-gray-600 hover:text-gray-800 ml-3">
                                        <svg width="20" height="24" viewBox="0 0 20 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                           <path d="M3.27702 20.6328C3.01105 20.6328 2.78653 20.5278 2.60348 20.318C2.42056 20.1079 2.3291 19.8503 2.3291 19.5451V17.1006C2.3291 16.8114 2.3766 16.535 2.4716 16.2714C2.56646 16.0079 2.70195 15.7753 2.87806 15.5733L13.3191 3.61121C13.4924 3.42443 13.6848 3.28132 13.8962 3.18188C14.1074 3.08244 14.3292 3.03271 14.5614 3.03271C14.7903 3.03271 15.0139 3.08244 15.2322 3.18188C15.4504 3.28132 15.6426 3.43049 15.8087 3.62938L17.1687 5.19657C17.342 5.38334 17.4694 5.60295 17.5508 5.85538C17.6322 6.10765 17.6729 6.36096 17.6729 6.61531C17.6729 6.88177 17.6322 7.13715 17.5508 7.38145C17.4694 7.62592 17.342 7.8476 17.1687 8.04648L6.74848 20.0029C6.5725 20.205 6.36966 20.3604 6.13994 20.4693C5.91035 20.5783 5.66952 20.6328 5.41744 20.6328H3.27702ZM14.5556 7.94823L15.7222 6.61531L14.5506 5.26517L13.3789 6.60384L14.5556 7.94823Z" fill="#1C1B1F"/>
                                           </svg>
                                    </button>
                                </div>

                                <button onClick={() => toggleRoute('route3')}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-200 ${expandedRoutes.route3 ? 'rotate-180' : ''}`}>
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
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                            <line x1="3" y1="12" x2="21" y2="12"></line>
                                            <line x1="3" y1="6" x2="21" y2="6"></line>
                                            <line x1="3" y1="18" x2="21" y2="18"></line>
                                        </svg>
                                    </button>
                                    <div className="font-bold">route 4</div>
                                    <button className="text-gray-600 hover:text-gray-800 ml-3">
                                        <svg width="20" height="24" viewBox="0 0 20 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                           <path d="M3.27702 20.6328C3.01105 20.6328 2.78653 20.5278 2.60348 20.318C2.42056 20.1079 2.3291 19.8503 2.3291 19.5451V17.1006C2.3291 16.8114 2.3766 16.535 2.4716 16.2714C2.56646 16.0079 2.70195 15.7753 2.87806 15.5733L13.3191 3.61121C13.4924 3.42443 13.6848 3.28132 13.8962 3.18188C14.1074 3.08244 14.3292 3.03271 14.5614 3.03271C14.7903 3.03271 15.0139 3.08244 15.2322 3.18188C15.4504 3.28132 15.6426 3.43049 15.8087 3.62938L17.1687 5.19657C17.342 5.38334 17.4694 5.60295 17.5508 5.85538C17.6322 6.10765 17.6729 6.36096 17.6729 6.61531C17.6729 6.88177 17.6322 7.13715 17.5508 7.38145C17.4694 7.62592 17.342 7.8476 17.1687 8.04648L6.74848 20.0029C6.5725 20.205 6.36966 20.3604 6.13994 20.4693C5.91035 20.5783 5.66952 20.6328 5.41744 20.6328H3.27702ZM14.5556 7.94823L15.7222 6.61531L14.5506 5.26517L13.3789 6.60384L14.5556 7.94823Z" fill="#1C1B1F"/>
                                           </svg>
                                    </button>
                                </div>

                                <button onClick={() => toggleRoute('route4')}>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-200 ${expandedRoutes.route4 ? 'rotate-180' : ''}`}>
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
                         <svg width="20" height="24" viewBox="0 0 20 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M3.27702 20.6328C3.01105 20.6328 2.78653 20.5278 2.60348 20.318C2.42056 20.1079 2.3291 19.8503 2.3291 19.5451V17.1006C2.3291 16.8114 2.3766 16.535 2.4716 16.2714C2.56646 16.0079 2.70195 15.7753 2.87806 15.5733L13.3191 3.61121C13.4924 3.42443 13.6848 3.28132 13.8962 3.18188C14.1074 3.08244 14.3292 3.03271 14.5614 3.03271C14.7903 3.03271 15.0139 3.08244 15.2322 3.18188C15.4504 3.28132 15.6426 3.43049 15.8087 3.62938L17.1687 5.19657C17.342 5.38334 17.4694 5.60295 17.5508 5.85538C17.6322 6.10765 17.6729 6.36096 17.6729 6.61531C17.6729 6.88177 17.6322 7.13715 17.5508 7.38145C17.4694 7.62592 17.342 7.8476 17.1687 8.04648L6.74848 20.0029C6.5725 20.205 6.36966 20.3604 6.13994 20.4693C5.91035 20.5783 5.66952 20.6328 5.41744 20.6328H3.27702ZM14.5556 7.94823L15.7222 6.61531L14.5506 5.26517L13.3789 6.60384L14.5556 7.94823Z" fill="#1C1B1F"/>
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
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} onClick={() => setIsOpen(!isOpen)}>
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
                         <svg width="20" height="24" viewBox="0 0 20 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M3.27702 20.6328C3.01105 20.6328 2.78653 20.5278 2.60348 20.318C2.42056 20.1079 2.3291 19.8503 2.3291 19.5451V17.1006C2.3291 16.8114 2.3766 16.535 2.4716 16.2714C2.56646 16.0079 2.70195 15.7753 2.87806 15.5733L13.3191 3.61121C13.4924 3.42443 13.6848 3.28132 13.8962 3.18188C14.1074 3.08244 14.3292 3.03271 14.5614 3.03271C14.7903 3.03271 15.0139 3.08244 15.2322 3.18188C15.4504 3.28132 15.6426 3.43049 15.8087 3.62938L17.1687 5.19657C17.342 5.38334 17.4694 5.60295 17.5508 5.85538C17.6322 6.10765 17.6729 6.36096 17.6729 6.61531C17.6729 6.88177 17.6322 7.13715 17.5508 7.38145C17.4694 7.62592 17.342 7.8476 17.1687 8.04648L6.74848 20.0029C6.5725 20.205 6.36966 20.3604 6.13994 20.4693C5.91035 20.5783 5.66952 20.6328 5.41744 20.6328H3.27702ZM14.5556 7.94823L15.7222 6.61531L14.5506 5.26517L13.3789 6.60384L14.5556 7.94823Z" fill="#1C1B1F"/>
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
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
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
                       <svg width="20" height="24" viewBox="0 0 20 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3.27702 20.6328C3.01105 20.6328 2.78653 20.5278 2.60348 20.318C2.42056 20.1079 2.3291 19.8503 2.3291 19.5451V17.1006C2.3291 16.8114 2.3766 16.535 2.4716 16.2714C2.56646 16.0079 2.70195 15.7753 2.87806 15.5733L13.3191 3.61121C13.4924 3.42443 13.6848 3.28132 13.8962 3.18188C14.1074 3.08244 14.3292 3.03271 14.5614 3.03271C14.7903 3.03271 15.0139 3.08244 15.2322 3.18188C15.4504 3.28132 15.6426 3.43049 15.8087 3.62938L17.1687 5.19657C17.342 5.38334 17.4694 5.60295 17.5508 5.85538C17.6322 6.10765 17.6729 6.36096 17.6729 6.61531C17.6729 6.88177 17.6322 7.13715 17.5508 7.38145C17.4694 7.62592 17.342 7.8476 17.1687 8.04648L6.74848 20.0029C6.5725 20.205 6.36966 20.3604 6.13994 20.4693C5.91035 20.5783 5.66952 20.6328 5.41744 20.6328H3.27702ZM14.5556 7.94823L15.7222 6.61531L14.5506 5.26517L13.3789 6.60384L14.5556 7.94823Z" fill="#1C1B1F"/>
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
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}