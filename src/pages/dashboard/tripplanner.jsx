import React, { useState, useEffect } from 'react';
import { burgerBar, calendar, leftArrow, rightArrow, routeTableIcon, ViewMap } from '@/assets';
import VendorApprovedCard from '@/components/vendorRoutesCard/VendorApprovedCard';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSchoolTrips } from '@/redux/slices/schoolDashboardSlice';
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { Button, Input, Popover, PopoverContent, PopoverHandler } from '@material-tailwind/react';
import { format } from "date-fns";
import { DayPicker } from "react-day-picker";
import { FaArrowDown, FaArrowUp } from 'react-icons/fa';
import { FaEllipsisVertical } from "react-icons/fa6";
import CreateTripForm from '../../components/CreateTripForm';

export function TripPlanner() {
  const dispatch = useDispatch();
  const { trips, loading } = useSelector((s) => s.schoolDashboard);

  useEffect(() => {
    dispatch(fetchSchoolTrips());
  }, [dispatch]);

  const [selectedTrip, setSelectedTrip] = useState('All');
  const [selectedTab] = useState('Route Schedules');
  const [currentPage, setCurrentPage] = useState(1);
  const [openTerminals, setOpenTerminals] = useState({});
  const [humburgerBar, setHamburgerBar] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateTrip, setIsCreateTrip] = useState(false);
  const [date, setDate] = useState();
  const [modalPosition, setModalPosition] = useState(null);

  const toggleTerminal = (name) => {
    setOpenTerminals((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const hanldeEditModal = () => setIsModalOpen(false);
  const handleCancel = () => setIsCreateTrip(false);
  const handleEditRoute = () => {};
  const handleMapScreenClick = () => {};
  const handleOpenRoute = () => setIsCreateTrip(true);
  const handleRouteMap = () => {};

  const handleEllipsisClick = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setModalPosition({ top: rect.top + window.scrollY + 30, left: rect.left + window.scrollX - 140 });
    setIsModalOpen(true);
  };

  const filteredTrips = selectedTrip === 'All' ? trips : trips.filter((t) => t.status === selectedTrip);

  // Group by terminalName
  const groupedByTerminal = filteredTrips.reduce((acc, trip) => {
    const key = trip.terminalName || 'Other';
    if (!acc[key]) acc[key] = [];
    acc[key].push(trip);
    return acc;
  }, {});

  const terminalEntries = Object.entries(groupedByTerminal);

  return (
    <section className='mt-7'>
      {/* Top action bar */}
      <div className="flex w-full justify-between flex-row h-[65px] mb-3 items-center">
        <Button
          className='bg-[#C01824] md:!px-10 !py-3 capitalize text-sm md:text-[16px] font-normal flex items-center'
          variant='filled' size='lg' onClick={handleOpenRoute}
        >
          <span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
          </span>
          Create Route
        </Button>
      </div>

      {isCreateTrip ? (
        <CreateTripForm handleCancel={handleCancel} />
      ) : (
        <div className="w-full space-y-3">
          {/* Global toolbar: view toggle + date picker */}
          <div className="bg-white border border-gray-200 shadow-sm rounded-lg">
            <div className="flex justify-end items-center px-7 py-3 gap-4">
              <div
                style={{ width: '40px', height: '40px', borderColor: '#D2D1D1', borderWidth: '1px', borderRadius: '7px' }}
                className="flex items-center justify-center cursor-pointer"
                onClick={() => setHamburgerBar(!humburgerBar)}
                title={humburgerBar ? 'Switch to card view' : 'Switch to table view'}
              >
                <img src={humburgerBar ? routeTableIcon : burgerBar} alt="" />
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
                      <img src={calendar} alt="" className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
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
                        IconLeft: ({ ...props }) => <ChevronLeftIcon {...props} className="h-4 w-4 stroke-2" />,
                        IconRight: ({ ...props }) => <ChevronRightIcon {...props} className="h-4 w-4 stroke-2" />,
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>

          {/* Loading / empty states */}
          {loading.trips ? (
            <p className="text-center text-gray-500 text-sm py-8 bg-white rounded-lg border border-gray-200">Loading trips...</p>
          ) : filteredTrips.length === 0 ? (
            <p className="text-center text-gray-400 text-sm py-8 bg-white rounded-lg border border-gray-200">No trips found.</p>
          ) : (
            /* One accordion per terminal */
            terminalEntries.map(([terminalName, terminalTrips]) => (
              <div key={terminalName} className="w-full bg-white border border-gray-200 shadow-sm rounded-lg">
                {/* Accordion header */}
                <div
                  className="flex items-center justify-between px-4 py-3 cursor-pointer"
                  onClick={() => toggleTerminal(terminalName)}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-gray-500">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                      </svg>
                    </span>
                    <h2 className="font-medium text-gray-800 text-lg">{terminalName}</h2>
                    <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{terminalTrips.length} trip{terminalTrips.length !== 1 ? 's' : ''}</span>
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-5 w-5 transition-transform duration-200 ${openTerminals[terminalName] ? 'rotate-180' : ''}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>

                {/* Accordion body */}
                {openTerminals[terminalName] && (
                  <div className="border-t border-gray-200">
                    {humburgerBar ? (
                      /* Table view */
                      <div className="w-full p-4 overflow-hidden">
                        <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm">
                          <table className="w-full border-collapse">
                            <thead>
                              <tr className="bg-gray-100">
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-800"><div className="flex items-center">TripNo<FaArrowUp size={13} className="ml-1" /><FaArrowDown size={13} className="ml-1" /></div></th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-800"><div className="flex items-center">Bus No<FaArrowUp size={13} className="ml-1" /><FaArrowDown size={13} className="ml-1" /></div></th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-800"><div className="flex items-center">Date<FaArrowUp size={13} className="ml-1" /><FaArrowDown size={13} className="ml-1" /></div></th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-800"><div className="flex items-center">Time<FaArrowUp size={13} className="ml-1" /><FaArrowDown size={13} className="ml-1" /></div></th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-800"><div className="flex items-center">Driver<FaArrowUp size={13} className="ml-1" /><FaArrowDown size={13} className="ml-1" /></div></th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-800"><div className="flex items-center">Pickup<FaArrowUp size={13} className="ml-1" /><FaArrowDown size={13} className="ml-1" /></div></th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-800"><div className="flex items-center">Dropoff<FaArrowUp size={13} className="ml-1" /><FaArrowDown size={13} className="ml-1" /></div></th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-800"><div className="flex items-center">Persons<FaArrowUp size={13} className="ml-1" /><FaArrowDown size={13} className="ml-1" /></div></th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-800">Status</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-800">View Map</th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-800">Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {terminalTrips.map((trip) => (
                                <tr key={trip.id} className="border-t border-gray-200 hover:bg-gray-50">
                                  <td className="px-4 py-3.5 text-sm text-gray-800">{trip.tripNumber ?? trip.id ?? '--'}</td>
                                  <td className="px-4 py-3.5 text-sm text-gray-800">{trip.busNumber ?? '--'}</td>
                                  <td className="px-4 py-3.5 text-sm text-gray-800">{trip.startTime ? new Date(trip.startTime).toLocaleDateString() : '--'}</td>
                                  <td className="px-4 py-3.5 text-sm text-gray-800">{trip.startTime ? new Date(trip.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--'}</td>
                                  <td className="px-4 py-3.5 text-sm text-gray-800">{trip.driverName ?? '--'}</td>
                                  <td className="px-4 py-3.5 text-sm text-gray-800">{trip.pickup ?? '--'}</td>
                                  <td className="px-4 py-3.5 text-sm text-gray-800">{trip.dropoff ?? '--'}</td>
                                  <td className="px-4 py-3.5 text-sm text-gray-800">{trip.noOfPersons ?? '--'}</td>
                                  <td className="px-4 py-3.5 text-sm text-gray-800">
                                    <div className={`w-[90px] text-center flex items-center justify-center h-[30px] rounded text-xs font-medium ${trip.status === 'Approved' ? 'bg-[#CCFAEB] text-[#0BA071]' : trip.status === 'Pending' ? 'bg-[#FFF3CD] text-[#856404]' : 'bg-[#F6DCDE] text-[#C01824]'}`}>
                                      {trip.status ?? '--'}
                                    </div>
                                  </td>
                                  <td className="px-4 py-3.5 text-sm text-gray-800 cursor-pointer" onClick={handleMapScreenClick}><img src={ViewMap} alt="map" /></td>
                                  <td className="px-4 py-3.5 text-sm text-gray-800 cursor-pointer" onClick={handleEllipsisClick}><FaEllipsisVertical /></td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                          {isModalOpen && modalPosition && (
                            <div className="fixed w-40 bg-white border rounded shadow-lg z-50" style={{ top: modalPosition.top, left: modalPosition.left }}>
                              <ul className="py-2">
                                <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={hanldeEditModal}>Edit</li>
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      /* Card view */
                      <div className="flex flex-wrap gap-4 justify-evenly p-4">
                        {terminalTrips.map((trip, idx) => (
                          <VendorApprovedCard
                            key={trip.id ?? idx}
                            trip={trip}
                            trips={terminalTrips}
                            onEditClick={hanldeEditModal}
                            selectedTab={selectedTab}
                            handleMapScreenClick={handleMapScreenClick}
                            handleEditRoute={handleEditRoute}
                            handleRouteMap={handleRouteMap}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </section>
  );
}

export default TripPlanner;
