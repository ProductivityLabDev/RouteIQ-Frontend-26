import { burgerBar, calendar, leftArrow, rightArrow, routeTableIcon, ViewMap } from '@/assets';
import MapComponent from '@/components/MapComponent';
import VendorApprovedCard from '@/components/vendorRoutesCard/VendorApprovedCard';
import { tripsData } from '@/data';
import { busTrips } from '@/data/dummyData';
import MainLayout from '@/layouts/SchoolLayout';
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { Button, ButtonGroup, Input, Popover, PopoverContent, PopoverHandler } from '@material-tailwind/react';
import { format } from "date-fns";
import React, { useState } from 'react';
import { DayPicker } from "react-day-picker";
import { FaArrowDown, FaArrowUp, FaPlus } from 'react-icons/fa';
import { FaEllipsisVertical } from "react-icons/fa6";
import CreateRoute from './CreateRoute';
import SchoolList from './SchoolList';

const RouteManagement = () => {
    const [selectedTab, setSelectedTab] = useState('Route Schedules');
    const [date, setDate] = useState();
    const [active, setActive] = useState(1);
    const [open, setOpen] = useState(false);
    const [openMapScreen, setOpenMapScreen] = useState(false);
    const [isEditable, setIsEditable] = useState(false);
    const [isCreateRoute, setIsCreateRoute] = useState(false);
    const [isEditRoute, setIsEditRoute] = useState(false);
    const [isRouteMap, setIsRouteMap] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [showCard, setShowCard] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [humburgerBar, setHamburgerBar] = useState(false);
    const [sortColumn, setSortColumn] = useState(null);
    const [sortDirection, setSortDirection] = useState("asc");
    const [modalPosition, setModalPosition] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSort = (column) => {
        if (sortColumn === column) {
            setSortDirection(sortDirection === "asc" ? "desc" : "asc");
        } else {
            setSortColumn(column);
            setSortDirection("asc");
        }
    };

    const formatTextWithLineBreaks = (text) => {
        return text.split("\n").map((line, index) => (
            <React.Fragment key={index}>
                {line}
                {index < text.split("\n").length - 1 && <br />}
            </React.Fragment>
        ));
    };
    const next = () => {
        if (active === 10) return;
        setActive(active + 1);
    };

    const prev = () => {
        if (active === 1) return;
        setActive(active - 1);
    };

    const handleBackTrip = () => {
        setIsEditable(false)
        setIsModalOpen(false)
        setModalPosition(null)
    }
    const handleEllipsisClick = (event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        setModalPosition({ top: rect.top + window.scrollY + 30, left: rect.left + window.scrollX - 140 });
        setIsModalOpen(true);
    };
    const hanldeEditModal = () => {
        setIsEditable(true)
        setOpen(!open)
    }
    const handleMapScreenClick = () => {
        setOpenMapScreen(true);
    };

    const handleBackClick = () => {
        setOpenMapScreen(false);
        setIsCreateRoute(false)
        setIsEditRoute(false)
        setIsRouteMap(false)
    };
    const handleOpenRoute = () => {
        setIsCreateRoute(true)
        setIsEditRoute(false)
    }
    const handleEditRoute = () => {
        setIsEditRoute(true)
        setIsCreateRoute(true)
    }
    const handleRouteMap = () => {
        setIsRouteMap(true)
        setOpenMapScreen(true)
    }
    const closeCard = () => {
        setShowCard(false);
    };
    return (
        <MainLayout>
            {openMapScreen ? (
                <MapComponent onBack={handleBackClick} isRouteMap={isRouteMap} closeCard={closeCard} showCard={showCard} />
            ) : isCreateRoute || isEditable ? (
                <CreateRoute onBack={handleBackClick} editRoute={isEditRoute} isEditable={isEditable} handleBackTrip={handleBackTrip} />
            ) :
                <section className='w-full h-full'>
                    <div className="flex w-[96%] justify-between flex-row h-[65px] mb-3 items-center">
                        <ButtonGroup className="border-2 border-[#DDDDE1]/50 rounded-[10px] outline-none p-0" variant="text" size='lg'>
                            {['Route Schedules', 'Trip Planner'].map(tab => (
                                <Button
                                    key={tab}
                                    className={selectedTab === tab ? 'bg-[#C01824] hover:bg-[#C01824]/80 text-white px-6 py-3 lg:text-[14px] capitalize font-bold' : 'bg-white px-6 py-3 capitalize font-bold'}
                                    onClick={() => setSelectedTab(tab)}
                                >
                                    {tab}
                                </Button>
                            ))}
                        </ButtonGroup>
                        {selectedTab === "Trip Planner" ?
                            null
                            // <Button className='bg-[#C01824] md:!px-10 !py-3 capitalize text-sm md:text-[16px] font-normal flex items-center'
                            //     variant='filled' size='lg' onClick={handleOpen}>
                            //     <span>
                            //         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            //             <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            //         </svg>
                            //     </span>
                            //     Create Trip
                            // </Button>
                            :
                            <Button className='bg-[#C01824] md:!px-10 !py-3 capitalize text-sm md:text-[16px] font-normal flex items-center'
                                variant='filled' size='lg' onClick={handleOpenRoute}>
                                <span>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                    </svg>
                                </span>
                                Create Route
                            </Button>

                        }
                    </div>
                    <div className="w-full space-y-4">
                        {[...Array(4)].map((_, index) => (
                            <div className="w-full bg-white border-b border-gray-200 shadow-sm">
                                <div className="flex items-center justify-between px-4 py-2">
                                    <div className="flex items-center space-x-3">
                                        <button className="text-gray-600 hover:text-gray-800">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                            </svg>
                                        </button>
                                        <h2 className="font-medium text-gray-800 text-lg">Terminal 1</h2>
                                        <button className="text-gray-600 hover:text-gray-800">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                            </svg>
                                        </button>

                                    </div>

                                    <div className="flex items-center space-x-4">

                                        <button
                                            onClick={() => setIsOpen(index === isOpen ? null : index)}
                                            className="text-gray-600 hover:text-gray-800"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className={`h-6 w-6 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                                {isOpen === index && (
                                    selectedTab === "Trip Planner" ?
                                        <div className="w-full">
                                            {humburgerBar ?
                                                <div className="flex justify-end items-center pt-3 mb-0 px-7 py-1  border-t border-[#D5D5D5]">
                                                    <div className="w-[30px] h-[30px] border border-[#D5D5D5] rounded-sm" onClick={() => setHamburgerBar(!humburgerBar)}>
                                                        <img src={routeTableIcon} />
                                                    </div>
                                                </div>
                                                :
                                                <div className="flex justify-end items-center mt-4 mb-2 px-7 py-3 gap-4 border-t border-[#D5D5D5]">
                                                    <div style={{ width: "40px", height: "40px", borderColor: '#D2D1D1', borderWidth: '1px', borderRadius: '7px', }} className="flex items-center justify-center" onClick={() => setHamburgerBar(!humburgerBar)}>
                                                        <img src={burgerBar} />
                                                    </div>
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
                                                </div>
                                            }
                                            {humburgerBar ?
                                                <div className="w-full p-4 overflow-hidden rounded-sm">
                                                    <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm">
                                                        <table className="w-full border-collapse">
                                                            <thead>
                                                                <tr className="bg-gray-100">
                                                                    <th
                                                                        className="px-4 py-3 text-left text-sm font-medium text-gray-800 cursor-pointer"
                                                                        onClick={() => handleSort("tripNo")}
                                                                    >
                                                                        <div className="flex items-center">
                                                                            TripNo
                                                                            <FaArrowUp size={13} className="ml-1" />
                                                                            <FaArrowDown size={13} className="ml-1" />
                                                                        </div>
                                                                    </th>
                                                                    <th
                                                                        className="px-4 py-3 text-left text-sm font-medium text-gray-800 cursor-pointer"
                                                                        onClick={() => handleSort("busNo")}
                                                                    >
                                                                        <div className="flex items-center">
                                                                            Bus no
                                                                            <FaArrowUp size={13} className="ml-1" />
                                                                            <FaArrowDown size={13} className="ml-1" />
                                                                        </div>
                                                                    </th>
                                                                    <th
                                                                        className="px-4 py-3 text-left text-sm font-medium text-gray-800 cursor-pointer"
                                                                        onClick={() => handleSort("date")}
                                                                    >
                                                                        <div className="flex items-center">
                                                                            Date
                                                                            <FaArrowUp size={13} className="ml-1" />
                                                                            <FaArrowDown size={13} className="ml-1" />
                                                                        </div>
                                                                    </th>
                                                                    <th
                                                                        className="px-4 py-3 text-left text-sm font-medium text-gray-800 cursor-pointer"
                                                                        onClick={() => handleSort("time")}
                                                                    >
                                                                        <div className="flex items-center">
                                                                            Time
                                                                            <FaArrowUp size={13} className="ml-1" />
                                                                            <FaArrowDown size={13} className="ml-1" />
                                                                        </div>
                                                                    </th>
                                                                    <th
                                                                        className="px-4 py-3 text-left text-sm font-medium text-gray-800 cursor-pointer"
                                                                        onClick={() => handleSort("driverName")}
                                                                    >
                                                                        <div className="flex items-center">
                                                                            Driver Name
                                                                            <FaArrowUp size={13} className="ml-1" />
                                                                            <FaArrowDown size={13} className="ml-1" />
                                                                        </div>
                                                                    </th>
                                                                    <th
                                                                        className="px-4 py-3 text-left text-sm font-medium text-gray-800 cursor-pointer"
                                                                        onClick={() => handleSort("pickup")}
                                                                    >
                                                                        <div className="flex items-center">
                                                                            Pickup
                                                                            <FaArrowUp size={13} className="ml-1" />
                                                                            <FaArrowDown size={13} className="ml-1" />
                                                                        </div>
                                                                    </th>
                                                                    <th
                                                                        className="px-4 py-3 text-left text-sm font-medium text-gray-800 cursor-pointer"
                                                                        onClick={() => handleSort("dropoff")}
                                                                    >
                                                                        <div className="flex items-center">
                                                                            Dropoff
                                                                            <FaArrowUp size={13} className="ml-1" />
                                                                            <FaArrowDown size={13} className="ml-1" />
                                                                        </div>
                                                                    </th>
                                                                    <th
                                                                        className="px-4 py-3 text-left text-sm font-medium text-gray-800 cursor-pointer"
                                                                        onClick={() => handleSort("numberOfPersons")}
                                                                    >
                                                                        <div className="flex items-center">
                                                                            No. of Person
                                                                            <FaArrowUp size={13} className="ml-1" />
                                                                            <FaArrowDown size={13} className="ml-1" />
                                                                        </div>
                                                                    </th>
                                                                    <th
                                                                        className="px-4 py-3 text-left text-sm font-medium text-gray-800 cursor-pointer"
                                                                        onClick={() => handleSort("glCode")}
                                                                    >
                                                                        <div className="flex items-center">
                                                                            GL Code
                                                                            <FaArrowUp size={13} className="ml-1" />
                                                                            <FaArrowDown size={13} className="ml-1" />
                                                                        </div>
                                                                    </th>
                                                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-800">Status</th>
                                                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-800">View Map</th>
                                                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-800">Action</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {busTrips?.map((trip) => (
                                                                    <tr key={trip.id} className="border-t border-gray-200 hover:bg-gray-50">
                                                                        <td className="px-4 py-3.5 text-sm text-gray-800">{trip.tripNo}</td>
                                                                        <td className="px-4 py-3.5 text-sm text-gray-800 whitespace-pre-line">
                                                                            {formatTextWithLineBreaks(trip.busNo)}
                                                                        </td>
                                                                        <td className="px-4 py-3.5 text-sm text-gray-800">{trip.time}</td>
                                                                        <td className="px-4 py-3.5 text-sm text-gray-800">{trip.date}</td>
                                                                        <td className="px-4 py-3.5 text-sm text-gray-800 whitespace-pre-line">
                                                                            {formatTextWithLineBreaks(trip.driverName)}
                                                                        </td>
                                                                        <td className="px-4 py-3.5 text-sm text-gray-800 whitespace-pre-line relative">
                                                                            {trip.pickup && formatTextWithLineBreaks(trip.pickup)}
                                                                            {trip.hasAction && (
                                                                                <button
                                                                                    className="absolute top-3.5 right-3.5 flex items-center justify-center bg-gray-200 rounded-full w-6 h-6"
                                                                                >
                                                                                    <FaPlus size={13} />
                                                                                </button>
                                                                            )}
                                                                        </td>
                                                                        <td className="px-4 py-3.5 text-sm text-gray-800 whitespace-pre-line relative">
                                                                            {trip.pickupAddress && formatTextWithLineBreaks(trip.dropoff)}
                                                                            {trip.dropoffAddress && formatTextWithLineBreaks(trip.dropoffAddress)}
                                                                            {trip.hasAction && (
                                                                                <button
                                                                                    className="absolute top-3.5 right-3.5 flex items-center justify-center bg-gray-200 rounded-full w-6 h-6"
                                                                                >
                                                                                    <FaPlus size={13} />
                                                                                </button>
                                                                            )}
                                                                        </td>
                                                                        <td className="px-4 py-3.5 text-sm  text-gray-800">{trip.numberOfPersons}</td>
                                                                        <td className="px-4 py-3.5 text-sm  text-gray-800">{trip.glCode}</td>
                                                                        <td className={`px-4 py-3.5 text-sm  text-gray-800`}>
                                                                            <div className={`w-[100px] text-center justify-center items-center flex h-[35px] rounded  ${trip.status === "Approved" ? "bg-[#CCFAEB] text-[#0BA071]" : "bg-[#F6DCDE] text-[#C01824]"}`}>
                                                                                {trip.status}
                                                                            </div>
                                                                        </td>
                                                                        <td className="px-4 py-3.5 text-sm  text-gray-800 cursor-pointer" onClick={handleMapScreenClick}><img src={ViewMap} /></td>
                                                                        <td className="px-4 py-3.5 text-sm  text-gray-800 cursor-pointer" onClick={handleEllipsisClick}><FaEllipsisVertical /></td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                            {isModalOpen && (
                                                                <div id="custom-modal" className="fixed w-40 bg-white border rounded shadow-lg z-50 text-left" style={{ top: modalPosition.top, left: modalPosition.left }}>
                                                                    <ul className="py-2">
                                                                        <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={hanldeEditModal}>Edit</li>
                                                                    </ul>
                                                                </div>
                                                            )}
                                                        </table>
                                                    </div>
                                                </div>
                                                :
                                                <div className="flex flex-wrap gap-2 justify-evenly">
                                                    {[...Array(4)].map((_, index) => (
                                                        tripsData
                                                            .filter(card => card.status === 'Approved')
                                                            .map((trip, idx) => (
                                                                <VendorApprovedCard
                                                                    key={idx}
                                                                    trip={trip}
                                                                    trips={tripsData}
                                                                    onEditClick={hanldeEditModal}
                                                                    selectedTab={selectedTab}
                                                                    handleMapScreenClick={handleMapScreenClick}
                                                                    handleEditRoute={handleEditRoute}
                                                                    handleRouteMap={handleRouteMap}
                                                                />
                                                            ))

                                                    ))}
                                                </div>
                                            }
                                            <div className="flex justify-center mt-4 mb-2">
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
                                                <p className='mx-3 text-[#000] text-[20px]'>......</p>
                                                <button className={`w-10 h-10 flex items-center justify-center border border-gray-300 mx-1 ${currentPage === 3 ? 'bg-red-600 text-white' : ''}`}>
                                                    12
                                                </button>
                                                <button className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-md bg-[#919EAB]">
                                                    <img src={rightArrow} />
                                                </button>
                                            </div>
                                        </div>
                                        :
                                        <div className="w-full bg-white border-t border-gray-200 shadow-sm">
                                            <SchoolList handleMapScreenClick={handleMapScreenClick} handleEditRoute={handleEditRoute} />
                                        </div>


                                )}
                            </div>
                        ))}
                    </div>

                    {/* <div className='flex justify-between items-center mt-6 mb-4 px-7 py-3'>
                        <Typography color="gray" className='text-[#202224]/60 font-semibold text-[14px]'>
                            Page {active} - 06 of 20
                        </Typography>
                        <div className='!p-0 bg-[#FAFBFD] flex justify-around items-center w-[86px] h-[33px] border border-[#D5D5D5] rounded-[12px] space-x-3'>
                            <img onClick={prev}
                                disabled={active === 1} src={previcon} alt='' strokeWidth={2} className="h-[24px] w-[24px] cursor-pointer" />
                            <img onClick={next}
                                disabled={active === 10} src={nexticon} alt='' strokeWidth={2} className="h-[24px] w-[24px] cursor-pointer" />
                        </div>
                    </div> */}
                </section >
            }

            {/* <TripPlannerModal open={open} handleOpen={handleOpen} isEditable={isEditable} /> */}
        </MainLayout >
    )
}

export default RouteManagement
