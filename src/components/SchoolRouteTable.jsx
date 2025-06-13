import React, { useState } from 'react';
import { format } from "date-fns";
import { DayPicker } from "react-day-picker";
import { AnimalIcon, LakeviewSchoolLogo, RosewoodSchoolLogo, SkylineSchoolLogo, SpringdaleSchoolLogo, ViewMap, calendar, driver, leftArrow, redbusicon, rightArrow } from '@/assets';
import { ButtonGroup, Button, Input, Popover, PopoverContent, PopoverHandler, } from '@material-tailwind/react';
import { ChevronRightIcon, ChevronLeftIcon } from "@heroicons/react/24/outline";
import { studentsData } from '@/data/dummyData';
import { ChevronLeft, ChevronRight } from "lucide-react";
import { HiOutlineDotsVertical } from "react-icons/hi";
import EditModal from './EditModal';



export default function SchoolList({ handleMapScreenClick, handleEditRoute }) {

      const [active, setActive] = useState("All");
     
      const [openMenuIndex, setOpenMenuIndex] = useState(null);
      const [isEditOpen, setIsEditOpen] = useState(false);


      const handleModal = () =>{
        setIsEditOpen(false)
        setOpenMenuIndex(false)
      }

const handleMenuToggle = (index) => {
  setOpenMenuIndex(openMenuIndex === index ? null : index);
};

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

     const getButtonClass = (label) =>
    active === label
      ? "bg-[#C01824] text-white px-4 py-2 rounded"
      : "bg-gray-200 hover:bg-gray-300 text-black px-4 py-2 rounded";

     const data = [
  {
    date: "8/2/19",
    pickupTime: "8:44",
    studentName: "Kathryn Murphy",
    driverName: "Kathryn Murphy",
    pickup: "Hoover Elementary School\n950 Hunt Ave Neenah, WI 54956",
    dropoff: "WI State Capital\n2E. Main St Madison, WI 53703",
  },
  {
    date: "8/2/19",
    pickupTime: "8:44",
    studentName: "Kathryn Murphy",
    driverName: "Kathryn Murphy",
    pickup: "Hoover Elementary School\n950 Hunt Ave Neenah, WI 54956",
    dropoff: "WI State Capital\n2E. Main St Madison, WI 53703",
  },
  {
    date: "8/2/19",
    pickupTime: "8:44",
    studentName: "Kathryn Murphy",
    driverName: "Kathryn Murphy",
    pickup: "Hoover Elementary School\n950 Hunt Ave Neenah, WI 54956",
    dropoff: "WI State Capital\n2E. Main St Madison, WI 53703",
  },
  {
    date: "8/2/19",
    pickupTime: "8:44",
    studentName: "Kathryn Murphy",
    driverName: "Kathryn Murphy",
    pickup: "Hoover Elementary School\n950 Hunt Ave Neenah, WI 54956",
    dropoff: "WI State Capital\n2E. Main St Madison, WI 53703",
  },
  {
    date: "8/2/19",
    pickupTime: "8:44",
    studentName: "Kathryn Murphy",
    driverName: "Kathryn Murphy",
    pickup: "Hoover Elementary School\n950 Hunt Ave Neenah, WI 54956",
    dropoff: "WI State Capital\n2E. Main St Madison, WI 53703",
  },
  {
    date: "8/2/19",
    pickupTime: "8:44",
    studentName: "Kathryn Murphy",
    driverName: "Kathryn Murphy",
    pickup: "Hoover Elementary School\n950 Hunt Ave Neenah, WI 54956",
    dropoff: "WI State Capital\n2E. Main St Madison, WI 53703",
  },
  {
    date: "8/2/19",
    pickupTime: "8:44",
    studentName: "Kathryn Murphy",
    driverName: "Kathryn Murphy",
    pickup: "Hoover Elementary School\n950 Hunt Ave Neenah, WI 54956",
    dropoff: "WI State Capital\n2E. Main St Madison, WI 53703",
  },
  {
    date: "8/2/19",
    pickupTime: "8:44",
    studentName: "Kathryn Murphy",
    driverName: "Kathryn Murphy",
    pickup: "Hoover Elementary School\n950 Hunt Ave Neenah, WI 54956",
    dropoff: "WI State Capital\n2E. Main St Madison, WI 53703",
  },
  {
    date: "8/2/19",
    pickupTime: "8:44",
    studentName: "Kathryn Murphy",
    driverName: "Kathryn Murphy",
    pickup: "Hoover Elementary School\n950 Hunt Ave Neenah, WI 54956",
    dropoff: "WI State Capital\n2E. Main St Madison, WI 53703",
  },
  
]; 


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
                                   
                                    <div className="flex flex-wrap gap-2 items-center">
                                        <button className="text-[#C01824] px-4 py-2 border border-[#C01824] rounded">School start time: 08:00AM</button>
                                        <button className="text-[#C01824] px-4 py-2 border border-[#C01824] rounded">School dismissal time: 12:00PM</button>
                                       
                                       <button className="text-black text-[14px] font-bold  py-2 flex items-center gap-2">
                                        Route Animal Icon
                                        <img src={AnimalIcon} alt="Animal Icon" className="w-6 h-6" />
                                        </button>
                                        <div className="ml-auto flex gap-4 items-center text-[13px] font-bold text-black">
                                        <span>Route ID: 25065</span>
                                        <span>Bus no: SSD107</span>
                                        </div>
                                    </div>
                                    
                                    <button onClick={() => toggleRoute('route1')}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={`transition-transform duration-200 ${expandedRoutes.route1 ? 'rotate-180' : ''}`}>
                                            <polyline points="6 9 12 15 18 9"></polyline>
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            {expandedRoutes.route1 && (
                                <div className="p-4">
                                        <div className="p-4 space-y-4">
                                         <div className="flex justify-end items-center gap-2">
                                        <input
                                            type="text"
                                            placeholder="Search"
                                            className="border px-3 py-2 rounded w-full max-w-xs"
                                        />
                                        <button onClick={() => setActive("All")} className={getButtonClass("All")}>
                                            All
                                        </button>
                                        <button onClick={() => setActive("AM")} className={getButtonClass("AM")}>
                                            AM
                                        </button>
                                        <button onClick={() => setActive("PM")} className={getButtonClass("PM")}>
                                            PM
                                        </button>
                                        </div>

                                {/* Table */}
                                <div className="overflow-x-auto">
                                    <table className="w-full border border-[#EEEEEE] rounded text-center">
                                   <thead className="bg-[#EEEEEE]">
                                    <tr>
                                        {[
                                        "Date",
                                        "Pick-up Time",
                                        "Student Name",
                                        "Drivers Name",
                                        "Pickup",
                                        "Dropoff",
                                        "View Map",
                                        "Action",
                                        ].map((header) => (
                                        <th
                                            key={header}
                                            className="px-6 py-4 text-[14px] font-bold text-[#141516] border-b border-[#D9D9D9] whitespace-nowrap"
                                        >
                                            {header}
                                        </th>
                                        ))}
                                    </tr>
                                    </thead>
                                  <tbody>
                                    {data.map((row, index) => (
                                        <tr key={index} className="border-b border-[#D9D9D9]">
                                        <td className="px-4 py-2 text-sm text-left align-middle whitespace-nowrap">{row.date}</td>
                                        <td className="px-4 py-2 text-sm text-left align-middle whitespace-nowrap">{row.pickupTime}</td>
                                        <td className="px-4 py-2 text-sm text-left align-middle whitespace-nowrap">{row.studentName}</td>
                                        <td className="px-4 py-2 text-sm text-left align-middle whitespace-nowrap">{row.driverName}</td>
                                        <td className="px-4 py-2 text-sm text-left align-middle whitespace-nowrap">{row.pickup}</td>
                                        <td className="px-4 py-2 text-sm text-left align-middle whitespace-nowrap">{row.dropoff}</td>

                                        <td className="px-4 py-2 text-center align-middle whitespace-nowrap">
                                            <div className="flex justify-center items-center" >
                                            <img src={ViewMap} alt="View Map" className="w-6 h-6" onClick={handleMapScreenClick}/>
                                            </div>
                                        </td>

                                        <td className="px-4 py-2 text-center align-middle relative whitespace-nowrap">
                                            <div className="flex justify-center items-center">
                                            <HiOutlineDotsVertical
                                                size={24}
                                                className="cursor-pointer"
                                                onClick={() => handleMenuToggle(index)}
                                            />
                                            </div>

                                            {openMenuIndex === index && (
                                            <div className="absolute top-full mt-2 right-0 w-28 bg-white border rounded shadow z-20">
                                                <button
                                                onClick={() => setIsEditOpen(true)}
                                                className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm"
                                                >
                                                Edit
                                                </button>
                                                
                                            </div>
                                            )}
                                        </td>
                                        </tr>
                                    ))}
                                    </tbody>


                                    </table>
                                </div>

                                {/* Pagination */}
                                <div className="flex justify-center items-center gap-2 mt-4">
                                    <button className="border rounded p-2 hover:bg-gray-100">
                                    <ChevronLeft className="w-4 h-4" />
                                    </button>
                                    <button className="border rounded px-3 py-1 bg-red-500 text-white">1</button>
                                    <button className="border rounded px-3 py-1 hover:bg-gray-100">2</button>
                                    <button className="border rounded px-3 py-1 hover:bg-gray-100">3</button>
                                    <span className="px-2">...</span>
                                    <button className="border rounded px-3 py-1 hover:bg-gray-100">12</button>
                                    <button className="border rounded p-2 hover:bg-gray-100">
                                    <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                                </div>

                                  
                                   
                                </div>
                            )}

                            <EditModal isOpen={isEditOpen} onClose={handleModal} />
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