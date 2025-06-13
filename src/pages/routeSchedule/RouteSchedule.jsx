import {
  burgerBar,
  calendar,
  leftArrow,
  rightArrow,
  routeTableIcon,
  ViewMap,
} from "@/assets";
import MapComponent from "@/components/MapComponent";
import VendorApprovedCard from "@/components/vendorRoutesCard/VendorApprovedCard";
import { tripsData } from "@/data";
import { busTrips, busTripsScheduling } from "@/data/dummyData";
import MainLayout from "@/layouts/SchoolLayout";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import {
  Button,
  ButtonGroup,
  Input,
  Popover,
  PopoverContent,
  PopoverHandler,
} from "@material-tailwind/react";
import { format } from "date-fns";
import React, { useState } from "react";
import { DayPicker } from "react-day-picker";
import { FaArrowDown, FaArrowUp, FaPlus } from "react-icons/fa";
import { FaEllipsisVertical } from "react-icons/fa6";
import SchoolList from "../routeManagement/SchoolList";
import SchoolRouteTable from "@/components/SchoolRouteTable";
import { useNavigate } from "react-router-dom";
import CreateTripForm from '../../components/CreateTripForm';

const RouteSchedule = () => {
  const [selectedTab, setSelectedTab] = useState("Trip Schedules");
  const [date, setDate] = useState();
  const [active, setActive] = useState(1);
  const [open, setOpen] = useState(false);
  const [openMapScreen, setOpenMapScreen] = useState(false);
  const [isEditable, setIsEditable] = useState(false);
  const [isCreateTrip, setIsCreateTrip] = useState(false);
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
  const [activeTab, setActiveTab] = useState("All");
  

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
    setIsEditable(false);
    setIsModalOpen(false);
    setModalPosition(null);
  };

  const handleEllipsisClick = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setModalPosition({
      top: rect.top + window.scrollY + 30,
      left: rect.left + window.scrollX - 140,
    });
    setIsModalOpen(true);
  };
  const hanldeEditModal = () => {
    setIsEditable(true);
    setOpen(!open);
  };
  const handleMapScreenClick = () => {
    setOpenMapScreen(true);
  };

  const handleBackClick = () => {
    setOpenMapScreen(false);
    
    setIsEditRoute(false);
    setIsRouteMap(false);
  };
 
    const handleOpenRoute = () => {
        setIsCreateTrip(true)
        
    }


  const handleRouteMap = () => {
    setIsRouteMap(true);
    setOpenMapScreen(true);
  };
  const closeCard = () => {
    setShowCard(false);
  };



  const tabs = [
    { id: "All", label: "All", active: true },
    { id: "Approved", label: "Approved", active: false },
    { id: "Pending", label: "Pending", active: false },
    { id: "Canceled", label: "Canceled", active: false },
  ];
  return (
    <MainLayout>
      {openMapScreen ? (
        <MapComponent
          onBack={handleBackClick}
          isRouteMap={isRouteMap}
          closeCard={closeCard}
          showCard={showCard}
        />
      ) : isCreateTrip  ? (
         <CreateTripForm />
      ) : (
        <section className="w-full h-full">
          <div className="flex w-[100%] justify-between flex-row h-[65px] mb-3 items-center">
            <ButtonGroup
              className="border-2 border-[#DDDDE1]/50 rounded-[10px] outline-none p-0"
              variant="text"
              size="lg"
            >
              {["School Routes", "Trip Schedules"].map((tab) => (
                <Button
                  key={tab}
                  className={
                    selectedTab === tab
                      ? "bg-[#C01824] hover:bg-[#C01824]/80 text-white px-6 py-3 lg:text-[14px] capitalize font-bold"
                      : "bg-white px-6 py-3 capitalize font-bold"
                  }
                  onClick={() => setSelectedTab(tab)}
                >
                  {tab}
                </Button>
              ))}
            </ButtonGroup>

           {selectedTab === "Trip Schedules" && (
                <Button
                    className="bg-[#C01824] md:px-10 py-3 capitalize text-sm md:text-[16px] font-normal flex items-center gap-2"
                    variant="filled"
                    size="lg"
                    onClick={handleOpenRoute}
                >
                    <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                    >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 4.5v15m7.5-7.5h-15"
                    />
                    </svg>
                    Create Trip
                </Button>
                )}


          </div>
          <div className="w-full space-y-4">
            {[...Array(4)].map((_, index) => (
              <div className="w-full bg-white border-b border-gray-200 shadow-sm">
                <div className="flex items-center justify-between px-4 py-2">
                  <div className="flex items-center space-x-3">
                    <button className="text-gray-600 hover:text-gray-800">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 6h16M4 12h16M4 18h16"
                        />
                      </svg>
                    </button>
                    <h2 className="font-medium text-gray-800 text-lg">
                      Terminal 1
                    </h2>
                    <button
                      className="text-gray-600 hover:text-gray-800"
                      onClick={() => setIsOpen(index === isOpen ? null : index)}
                    >
                      <svg
                        width="20"
                        height="24"
                        viewBox="0 0 20 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M3.27702 20.6328C3.01105 20.6328 2.78653 20.5278 2.60348 20.318C2.42056 20.1079 2.3291 19.8503 2.3291 19.5451V17.1006C2.3291 16.8114 2.3766 16.535 2.4716 16.2714C2.56646 16.0079 2.70195 15.7753 2.87806 15.5733L13.3191 3.61121C13.4924 3.42443 13.6848 3.28132 13.8962 3.18188C14.1074 3.08244 14.3292 3.03271 14.5614 3.03271C14.7903 3.03271 15.0139 3.08244 15.2322 3.18188C15.4504 3.28132 15.6426 3.43049 15.8087 3.62938L17.1687 5.19657C17.342 5.38334 17.4694 5.60295 17.5508 5.85538C17.6322 6.10765 17.6729 6.36096 17.6729 6.61531C17.6729 6.88177 17.6322 7.13715 17.5508 7.38145C17.4694 7.62592 17.342 7.8476 17.1687 8.04648L6.74848 20.0029C6.5725 20.205 6.36966 20.3604 6.13994 20.4693C5.91035 20.5783 5.66952 20.6328 5.41744 20.6328H3.27702ZM14.5556 7.94823L15.7222 6.61531L14.5506 5.26517L13.3789 6.60384L14.5556 7.94823Z"
                          fill="#1C1B1F"
                        />
                      </svg>
                    </button>
                  </div>

                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => setIsOpen(index === isOpen ? null : index)}
                      className="text-black hover:text-gray-800"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-6 w-6 transition-transform duration-200 `}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
                {isOpen === index &&
                  (selectedTab === "Trip Schedules" ? (
                    <div className="w-full">
                      {humburgerBar ? (
                        <div className="flex justify-end items-center pt-3 mb-0 px-7 py-1  border-t border-[#D5D5D5]">
                          <div
                            className="w-[30px] h-[30px] border border-[#D5D5D5] rounded-sm"
                            onClick={() => setHamburgerBar(!humburgerBar)}
                          >
                            <img src={routeTableIcon} />
                          </div>
                        </div>
                      ) : null}

                      <div className="flex items-center justify-between p-4">
                        {/* Left side - Status tabs */}
                        <div className="flex items-center space-x-1 border rounded">
                          {tabs.map((tab) => (
                            <button
                              key={tab.id}
                              onClick={() => setActiveTab(tab.id)}
                              className={`px-4 py-2 text-sm font-bold rounded-md transition-colors duration-200 ${
                                activeTab === tab.id
                                  ? "bg-[#C01824] text-white shadow-sm"
                                  : "text-[#141516] hover:text-gray-800 hover:bg-gray-100 border-l"
                              }`}
                            >
                              {tab.label}
                            </button>
                          ))}
                        </div>

                        {/* Right side - Trip filters and assign button */}
                        <div className="flex items-center space-x-3">
                          {/* Trip within 7 days indicator */}
                          <div className="flex items-center space-x-1">
                            <div className="w-3 h-3 bg-yellow-400 rounded-sm"></div>
                            <span className="text-sm text-[#141516]">
                              Trip within 7 days
                            </span>
                          </div>

                          {/* Trip within 2 days indicator */}
                          <div className="flex items-center space-x-1">
                            <div className="w-3 h-3 bg-red-500 rounded-sm"></div>
                            <span className="text-sm text-[#141516]">
                              Trip within 2 days
                            </span>
                          </div>

                          {/* Assign button */}
                          <button className="px-4 py-2 bg-[#C01824] text-white text-sm font-medium rounded-md hover:bg-red-700 transition-colors duration-200">
                            Assign
                          </button>
                        </div>
                      </div>

                      <div className="w-full p-4 overflow-hidden rounded-sm">
                        <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm">
                          <table className="w-full border-collapse">
                            <thead className="bg-[#EEEEEE]">
                              <tr>
                                {[
                                  "Flag",
                                  "Trip#",
                                  "Date",
                                  "Start Time",
                                  "End Time",
                                  "Bus no",
                                  "Driver Name",
                                  "Contact Name",
                                  "Pickup",
                                  "Pickup Time",
                                  "Drop-off",
                                  "Drop-off Time",
                                  "GL Code",
                                  "Status",
                                  "Note",
                                  "View Map",
                                  "No. of Passengers",
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
                              {busTripsScheduling?.map((trip) => (
                                <tr
                                  key={trip.id}
                                  className="border-t border-gray-200 hover:bg-gray-50"
                                >
                                  <td className="px-6 py-4 text-sm text-[#141516]">
                                    <img src={trip.flag} alt="flag" />
                                  </td>
                                  <td className="px-6 py-4 text-sm text-[#141516]">
                                    {trip.tripNo}
                                  </td>
                                  <td className="px-6 py-4 text-sm text-[#141516]">
                                    {trip.date}
                                  </td>
                                  <td className="px-6 py-4 text-sm text-[#141516]">
                                    {trip.startTime}
                                  </td>
                                  <td className="px-6 py-4 text-sm text-[#141516]">
                                    {trip.endTime}
                                  </td>
                                  <td className="px-6 py-4 text-sm text-[#141516]">
                                    {trip.busNo}
                                  </td>
                                  <td className="px-6 py-4 text-sm text-[#141516]">
                                    {trip.driverName}
                                  </td>
                                  <td className="px-6 py-4 text-sm text-[#141516]">
                                    {trip.contactName}
                                  </td>
                                  <td className="px-6 py-4 text-sm text-[#141516] relative">
                                    {trip.pickup?.replace(/\n/g, ", ")}
                                    {trip.hasAction && (
                                      <button className="absolute top-3 right-3 flex items-center justify-center bg-gray-200 rounded-full w-6 h-6">
                                        <FaPlus size={13} />
                                      </button>
                                    )}
                                  </td>
                                  <td className="px-6 py-4 text-sm text-[#141516]">
                                    {trip.pickupTime}
                                  </td>
                                  <td className="px-6 py-4 text-sm text-[#141516] relative">
                                    {trip.dropoff?.replace(/\n/g, ", ")} -{" "}
                                    {trip.dropoffAddress}
                                    {trip.hasAction && (
                                      <button className="absolute top-3 right-3 flex items-center justify-center bg-gray-200 rounded-full w-6 h-6">
                                        <FaPlus size={13} />
                                      </button>
                                    )}
                                  </td>
                                  <td className="px-6 py-4 text-sm text-[#141516]">
                                    {trip.dropoffTime}
                                  </td>
                                  <td className="px-6 py-4 text-sm text-[#141516]">
                                    {trip.glCode}
                                  </td>
                                  <td className="px-6 py-4 text-sm text-[#141516]">
                                    <div
                                      className={`w-[100px] text-center justify-center items-center flex h-[35px] rounded 
          ${
            trip.status === "Approved"
              ? "bg-[#CCFAEB] text-[#0BA071]"
              : "bg-[#F6DCDE] text-[#C01824]"
          }`}
                                    >
                                      {trip.status}
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 text-sm text-[#141516]">
                                    N/A
                                  </td>
                                  <td
                                    className="px-6 py-4 text-sm text-[#141516] cursor-pointer"
                                    onClick={handleMapScreenClick}
                                  >
                                    <img src={ViewMap} alt="view map" />
                                  </td>
                                  <td className="px-6 py-4 text-sm text-[#141516]">
                                    {trip.numberOfPersons}
                                  </td>
                                  <td
                                    className="px-6 py-4 text-sm text-[#141516] cursor-pointer"
                                    onClick={handleEllipsisClick}
                                  >
                                    <FaEllipsisVertical />
                                  </td>
                                </tr>
                              ))}
                            </tbody>

                            {isModalOpen && (
                              <div
                                id="custom-modal"
                                className="fixed w-40 bg-white border rounded shadow-lg z-50 text-left"
                                style={{
                                  top: modalPosition.top,
                                  left: modalPosition.left,
                                }}
                              >
                                <ul className="py-2">
                                  <li
                                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                    onClick={hanldeEditModal}
                                  >
                                    Edit
                                  </li>
                                </ul>
                              </div>
                            )}
                          </table>
                        </div>
                      </div>

                      <div className="flex justify-center mt-4 mb-2">
                        <button className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-md bg-[#919EAB]">
                          <img src={leftArrow} />
                        </button>

                        <button
                          className={`w-10 h-10 flex items-center justify-center border border-[#C01824] mx-1 ${
                            currentPage === 1 ? "text-[#C01824]" : ""
                          }`}
                        >
                          1
                        </button>

                        <button
                          className={`w-10 h-10 flex items-center justify-center border border-gray-300 mx-1 ${
                            currentPage === 2 ? "bg-red-600 text-white" : ""
                          }`}
                        >
                          2
                        </button>

                        <button
                          className={`w-10 h-10 flex items-center justify-center border border-gray-300 mx-1 ${
                            currentPage === 3 ? "bg-red-600 text-white" : ""
                          }`}
                        >
                          3
                        </button>
                        <p className="mx-3 text-[#000] text-[20px]">......</p>
                        <button
                          className={`w-10 h-10 flex items-center justify-center border border-gray-300 mx-1 ${
                            currentPage === 3 ? "bg-red-600 text-white" : ""
                          }`}
                        >
                          12
                        </button>
                        <button className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-md bg-[#919EAB]">
                          <img src={rightArrow} />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full bg-white border-t border-gray-200 shadow-sm">
                      <SchoolRouteTable />
                    </div>
                  ))}
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
        </section>
      )}

      {/* <TripPlannerModal open={open} handleOpen={handleOpen} isEditable={isEditable} /> */}
    </MainLayout>
  );
};

export default RouteSchedule;
