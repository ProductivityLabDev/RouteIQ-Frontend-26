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
import { apiClient } from "@/configs/api";



export default function SchoolList({
  handleMapScreenClick,
  institutes = [],
  loading = false,
  routesByInstitute = {},
  routesLoadingByInstitute = {},
}) {

      const [active, setActive] = useState("All");
     
      const [openMenuIndex, setOpenMenuIndex] = useState(null);
      const [isEditOpen, setIsEditOpen] = useState(false);


      const handleModal = () => {
        setIsEditOpen(false)
        setOpenMenuIndex(false)
      }

const handleMenuToggle = (index) => {
  setOpenMenuIndex(openMenuIndex === index ? null : index);
};

const instituteAt = (index) => (Array.isArray(institutes) ? institutes[index] : null);
const nameAt = (index, fallback) =>
  instituteAt(index)?.InstituteName || instituteAt(index)?.instituteName || fallback;
const studentsAt = (index, fallback = 459) =>
  instituteAt(index)?.TotalStudents ?? instituteAt(index)?.totalStudents ?? fallback;
const busesAt = (index, fallback = 10) =>
  instituteAt(index)?.TotalBuses ?? instituteAt(index)?.totalBuses ?? fallback;
const instituteIdAt = (index) =>
  instituteAt(index)?.InstituteId ??
  instituteAt(index)?.instituteId ??
  instituteAt(index)?.InstituteID ??
  instituteAt(index)?.instituteID ??
  instituteAt(index)?.id ??
  null;
const routesAt = (index) => {
  const instituteId = instituteIdAt(index);
  if (!instituteId) return [];
  return Array.isArray(routesByInstitute?.[instituteId]) ? routesByInstitute[instituteId] : [];
};
const routeLabel = (index, routeIndex, fallback) => {
  const route = routesAt(index)?.[routeIndex];
  return route?.RouteNumber || route?.routeNumber || route?.RouteName || route?.routeName || fallback;
};
const routeAt = (index, routeIndex = 0) => routesAt(index)?.[routeIndex] || null;
const routeField = (index, routeIndex, keys, fallback = "") => {
  const route = routeAt(index, routeIndex);
  if (!route) return fallback;
  for (const key of keys) {
    if (route[key] !== undefined && route[key] !== null && `${route[key]}`.trim() !== "") {
      return route[key];
    }
  }
  return fallback;
};

const parseDateField = (raw) => {
  if (!raw) return "";
  if (typeof raw === "string" && raw.includes("T")) return raw.split("T")[0];
  try {
    const d = new Date(raw);
    return isNaN(d.getTime()) ? String(raw) : d.toISOString().slice(0, 10);
  } catch {
    return String(raw);
  }
};

const parseTimeField = (raw) => {
  if (!raw) return "";
  if (typeof raw === "string" && raw.includes("T")) return raw.split("T")[1]?.slice(0, 5) || "";
  if (typeof raw === "string" && raw.length >= 5 && raw[2] === ":") return raw.slice(0, 5);
  try {
    const d = new Date(raw);
    if (isNaN(d.getTime())) return "";
    const h = String(d.getHours()).padStart(2, "0");
    const m = String(d.getMinutes()).padStart(2, "0");
    return `${h}:${m}`;
  } catch {
    return "";
  }
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
    const [studentsByRoute, setStudentsByRoute] = useState({});
    const [studentsLoadingByRoute, setStudentsLoadingByRoute] = useState({});

    const ensureRouteStudents = async (routeId) => {
        if (!routeId) return;
        if (studentsByRoute[routeId]) return;
        if (studentsLoadingByRoute[routeId]) return;

        try {
            setStudentsLoadingByRoute((prev) => ({ ...prev, [routeId]: true }));
            const response = await apiClient.get(`/route-scheduling/routes/${routeId}/students`);
            const list = Array.isArray(response?.data?.data)
                ? response.data.data
                : Array.isArray(response?.data)
                    ? response.data
                    : [];
            setStudentsByRoute((prev) => ({ ...prev, [routeId]: list }));
        } catch (e) {
            console.error("Failed to fetch route students:", e);
            setStudentsByRoute((prev) => ({ ...prev, [routeId]: [] }));
        } finally {
            setStudentsLoadingByRoute((prev) => ({ ...prev, [routeId]: false }));
        }
    };

    const toggleRoute = (routeKey) => {
        setExpandedRoutes(prev => {
            const nextVal = !prev[routeKey];

            if (nextVal) {
                const slotIndex =
                    routeKey === "route1" ? 0 :
                    routeKey === "route2" ? 1 :
                    routeKey === "route3" ? 2 :
                    routeKey === "route4" ? 3 : 0;
                const rid = routeField(0, slotIndex, ["RouteId", "routeId"], "");
                const routeIdNum = rid ? Number(rid) : null;
                if (routeIdNum) ensureRouteStudents(routeIdNum);
            }

            return {
                ...prev,
                [routeKey]: nextVal
            };
        });
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

    const tableRowsForRouteKey = (routeKey) => {
        const slotIndex =
            routeKey === "route1" ? 0 :
            routeKey === "route2" ? 1 :
            routeKey === "route3" ? 2 :
            routeKey === "route4" ? 3 : 0;

        const rid = routeField(0, slotIndex, ["RouteId", "routeId"], "");
        const routeIdNum = rid ? Number(rid) : null;
        if (!routeIdNum) return data;

        const apiRows = studentsByRoute[routeIdNum];
        if (!Array.isArray(apiRows) || apiRows.length === 0) return data;

        const driverName =
            routeField(0, slotIndex, ["DriverName", "driverName"], "") ||
            "Driver";

        return apiRows.map((s) => {
            const studentName =
                s?.StudentName ||
                s?.studentName ||
                s?.Name ||
                s?.name ||
                `${s?.FirstName || s?.firstName || ""} ${s?.LastName || s?.lastName || ""}`.trim() ||
                "Student";

            const pickup =
                s?.Pickup ||
                s?.pickup ||
                s?.PickupLocation ||
                s?.pickupLocation ||
                s?.PickupAddress ||
                s?.pickupAddress ||
                s?.Address ||
                s?.address ||
                "";

            const dropoff =
                s?.Dropoff ||
                s?.dropoff ||
                s?.DropoffLocation ||
                s?.dropoffLocation ||
                s?.DropoffAddress ||
                s?.dropoffAddress ||
                "";

            const dateVal = parseDateField(
                s?.Date || s?.date || s?.TripDate || s?.tripDate || s?.ScheduleDate || s?.scheduleDate
            );
            const timeVal = parseTimeField(
                s?.PickupTime || s?.pickupTime || s?.Time || s?.time || s?.StartTime || s?.startTime
            );

            return {
                date: dateVal || "-",
                pickupTime: timeVal || "-",
                studentName,
                driverName,
                pickup: pickup || "-",
                dropoff: dropoff || "-",
                pickupLat: s?.PickupLatitude ?? s?.pickupLatitude ?? null,
                pickupLng: s?.PickupLongitude ?? s?.pickupLongitude ?? null,
                dropLat: s?.DropLatitude ?? s?.dropLatitude ?? s?.DropoffLatitude ?? s?.dropoffLatitude ?? null,
                dropLng: s?.DropLongitude ?? s?.dropLongitude ?? s?.DropoffLongitude ?? s?.dropoffLongitude ?? null,
            };
        });
    };


    if (loading) {
        return <div className="p-4 text-gray-600">Loading institutes...</div>;
    }

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

                        <div className="font-bold text-lg">{nameAt(0, "Skyline High School")}</div>

                        <button className="text-gray-600 hover:text-gray-800 ml-3" onClick={() => setIsOpen(!isOpen)}>
                             <svg width="20" height="24" viewBox="0 0 20 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3.27702 20.6328C3.01105 20.6328 2.78653 20.5278 2.60348 20.318C2.42056 20.1079 2.3291 19.8503 2.3291 19.5451V17.1006C2.3291 16.8114 2.3766 16.535 2.4716 16.2714C2.56646 16.0079 2.70195 15.7753 2.87806 15.5733L13.3191 3.61121C13.4924 3.42443 13.6848 3.28132 13.8962 3.18188C14.1074 3.08244 14.3292 3.03271 14.5614 3.03271C14.7903 3.03271 15.0139 3.08244 15.2322 3.18188C15.4504 3.28132 15.6426 3.43049 15.8087 3.62938L17.1687 5.19657C17.342 5.38334 17.4694 5.60295 17.5508 5.85538C17.6322 6.10765 17.6729 6.36096 17.6729 6.61531C17.6729 6.88177 17.6322 7.13715 17.5508 7.38145C17.4694 7.62592 17.342 7.8476 17.1687 8.04648L6.74848 20.0029C6.5725 20.205 6.36966 20.3604 6.13994 20.4693C5.91035 20.5783 5.66952 20.6328 5.41744 20.6328H3.27702ZM14.5556 7.94823L15.7222 6.61531L14.5506 5.26517L13.3789 6.60384L14.5556 7.94823Z" fill="#1C1B1F"/>
                            </svg>
                        </button>
                    </div>

                    <div className="flex items-center">
                        <div className="mr-4">
                            <span className="font-bold">Total Students:</span> {studentsAt(0)}
                        </div>

                        <div className="mr-4">
                            <span className="font-bold">Total Buses:</span> {busesAt(0)}
                        </div>

                        <button
                            className="bg-[#C01824] text-white px-3 py-1 rounded mr-3 flex items-center"
                            onClick={() => handleMapScreenClick(routeField(0, 0, ["RouteId", "routeId"], null))}
                        >
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
                                    <div className="font-bold">{routeLabel(0, 0, "Route 1")}</div>
                                    <button className="text-gray-600 hover:text-gray-800 ml-3" onClick={() => toggleRoute('route1')}>
                                         <svg width="20" height="24" viewBox="0 0 20 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                           <path d="M3.27702 20.6328C3.01105 20.6328 2.78653 20.5278 2.60348 20.318C2.42056 20.1079 2.3291 19.8503 2.3291 19.5451V17.1006C2.3291 16.8114 2.3766 16.535 2.4716 16.2714C2.56646 16.0079 2.70195 15.7753 2.87806 15.5733L13.3191 3.61121C13.4924 3.42443 13.6848 3.28132 13.8962 3.18188C14.1074 3.08244 14.3292 3.03271 14.5614 3.03271C14.7903 3.03271 15.0139 3.08244 15.2322 3.18188C15.4504 3.28132 15.6426 3.43049 15.8087 3.62938L17.1687 5.19657C17.342 5.38334 17.4694 5.60295 17.5508 5.85538C17.6322 6.10765 17.6729 6.36096 17.6729 6.61531C17.6729 6.88177 17.6322 7.13715 17.5508 7.38145C17.4694 7.62592 17.342 7.8476 17.1687 8.04648L6.74848 20.0029C6.5725 20.205 6.36966 20.3604 6.13994 20.4693C5.91035 20.5783 5.66952 20.6328 5.41744 20.6328H3.27702ZM14.5556 7.94823L15.7222 6.61531L14.5506 5.26517L13.3789 6.60384L14.5556 7.94823Z" fill="#1C1B1F"/>
                                           </svg>
                                    </button>
                                </div>
                                <div className='flex items-center gap-5'>
                                   
                                    <div className="flex flex-wrap gap-2 items-center">
                                        <button className="text-[#C01824] px-4 py-2 border border-[#C01824] rounded">
                                          School start time: {routeField(0, 0, ["SchoolStartTime", "schoolStartTime"], "08:00AM")}
                                        </button>
                                        <button className="text-[#C01824] px-4 py-2 border border-[#C01824] rounded">
                                          School dismissal time: {routeField(0, 0, ["SchoolDismissalTime", "schoolDismissalTime"], "12:00PM")}
                                        </button>
                                       
                                       <button className="text-black text-[14px] font-bold  py-2 flex items-center gap-2">
                                        Route Animal Icon
                                        <img src={AnimalIcon} alt="Animal Icon" className="w-6 h-6" />
                                        </button>
                                        <div className="ml-auto flex gap-4 items-center text-[13px] font-bold text-black">
                                        <span>Route ID: {routeField(0, 0, ["RouteId", "routeId"], "25065")}</span>
                                        <span>Bus no: {routeField(0, 0, ["BusNumber", "busNumber", "VehicleName", "vehicleName"], "SSD107")}</span>
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
                                    {tableRowsForRouteKey('route1').map((row, index) => (
                                        <tr key={index} className="border-b border-[#D9D9D9]">
                                        <td className="px-4 py-2 text-sm text-left align-middle whitespace-nowrap">{row.date}</td>
                                        <td className="px-4 py-2 text-sm text-left align-middle whitespace-nowrap">{row.pickupTime}</td>
                                        <td className="px-4 py-2 text-sm text-left align-middle whitespace-nowrap">{row.studentName}</td>
                                        <td className="px-4 py-2 text-sm text-left align-middle whitespace-nowrap">{row.driverName}</td>
                                        <td className="px-4 py-2 text-sm text-left align-middle whitespace-nowrap">{row.pickup}</td>
                                        <td className="px-4 py-2 text-sm text-left align-middle whitespace-nowrap">{row.dropoff}</td>

                                        <td className="px-4 py-2 text-center align-middle whitespace-nowrap">
                                            <div className="flex justify-center items-center" >
                                            <img
                                                src={ViewMap}
                                                alt="View Map"
                                                className="w-6 h-6"
                                                onClick={() => handleMapScreenClick(row)}
                                            />
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
                                    <div className="font-bold">{routeLabel(0, 1, "Route 2")}</div>
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
                                    <div className="font-bold">{routeLabel(0, 2, "Route 3")}</div>
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
                                    <div className="font-bold">{routeLabel(0, 3, "Route 4")}</div>
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

                    <div className="font-bold text-lg">{nameAt(1, "Lakeview High School")}</div>
                    <button className="text-gray-600 hover:text-gray-800 ml-3">
                         <svg width="20" height="24" viewBox="0 0 20 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M3.27702 20.6328C3.01105 20.6328 2.78653 20.5278 2.60348 20.318C2.42056 20.1079 2.3291 19.8503 2.3291 19.5451V17.1006C2.3291 16.8114 2.3766 16.535 2.4716 16.2714C2.56646 16.0079 2.70195 15.7753 2.87806 15.5733L13.3191 3.61121C13.4924 3.42443 13.6848 3.28132 13.8962 3.18188C14.1074 3.08244 14.3292 3.03271 14.5614 3.03271C14.7903 3.03271 15.0139 3.08244 15.2322 3.18188C15.4504 3.28132 15.6426 3.43049 15.8087 3.62938L17.1687 5.19657C17.342 5.38334 17.4694 5.60295 17.5508 5.85538C17.6322 6.10765 17.6729 6.36096 17.6729 6.61531C17.6729 6.88177 17.6322 7.13715 17.5508 7.38145C17.4694 7.62592 17.342 7.8476 17.1687 8.04648L6.74848 20.0029C6.5725 20.205 6.36966 20.3604 6.13994 20.4693C5.91035 20.5783 5.66952 20.6328 5.41744 20.6328H3.27702ZM14.5556 7.94823L15.7222 6.61531L14.5506 5.26517L13.3789 6.60384L14.5556 7.94823Z" fill="#1C1B1F"/>
                        </svg>
                    </button>
                </div>

                <div className="flex items-center">
                    <div className="mr-8">
                        <span className="font-bold">Total Students:</span> {studentsAt(1)}
                    </div>

                    <div className="mr-4">
                        <span className="font-bold">Total Buses:</span> {busesAt(1)}
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

                    <div className="font-bold text-lg">{nameAt(2, "Springdale Elementary School")}</div>
                    <button className="text-gray-600 hover:text-gray-800 ml-3">
                         <svg width="20" height="24" viewBox="0 0 20 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M3.27702 20.6328C3.01105 20.6328 2.78653 20.5278 2.60348 20.318C2.42056 20.1079 2.3291 19.8503 2.3291 19.5451V17.1006C2.3291 16.8114 2.3766 16.535 2.4716 16.2714C2.56646 16.0079 2.70195 15.7753 2.87806 15.5733L13.3191 3.61121C13.4924 3.42443 13.6848 3.28132 13.8962 3.18188C14.1074 3.08244 14.3292 3.03271 14.5614 3.03271C14.7903 3.03271 15.0139 3.08244 15.2322 3.18188C15.4504 3.28132 15.6426 3.43049 15.8087 3.62938L17.1687 5.19657C17.342 5.38334 17.4694 5.60295 17.5508 5.85538C17.6322 6.10765 17.6729 6.36096 17.6729 6.61531C17.6729 6.88177 17.6322 7.13715 17.5508 7.38145C17.4694 7.62592 17.342 7.8476 17.1687 8.04648L6.74848 20.0029C6.5725 20.205 6.36966 20.3604 6.13994 20.4693C5.91035 20.5783 5.66952 20.6328 5.41744 20.6328H3.27702ZM14.5556 7.94823L15.7222 6.61531L14.5506 5.26517L13.3789 6.60384L14.5556 7.94823Z" fill="#1C1B1F"/>
                        </svg>
                    </button>
                </div>

                <div className="flex items-center">
                    <div className="mr-8">
                        <span className="font-bold">Total Students:</span> {studentsAt(2)}
                    </div>

                    <div className="mr-4">
                        <span className="font-bold">Total Buses:</span> {busesAt(2)}
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

                    <div className="font-bold text-lg">{nameAt(3, "Rosewood Elementary School")}</div>

                    <button className="text-gray-600 hover:text-gray-800 ml-3">
                       <svg width="20" height="24" viewBox="0 0 20 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3.27702 20.6328C3.01105 20.6328 2.78653 20.5278 2.60348 20.318C2.42056 20.1079 2.3291 19.8503 2.3291 19.5451V17.1006C2.3291 16.8114 2.3766 16.535 2.4716 16.2714C2.56646 16.0079 2.70195 15.7753 2.87806 15.5733L13.3191 3.61121C13.4924 3.42443 13.6848 3.28132 13.8962 3.18188C14.1074 3.08244 14.3292 3.03271 14.5614 3.03271C14.7903 3.03271 15.0139 3.08244 15.2322 3.18188C15.4504 3.28132 15.6426 3.43049 15.8087 3.62938L17.1687 5.19657C17.342 5.38334 17.4694 5.60295 17.5508 5.85538C17.6322 6.10765 17.6729 6.36096 17.6729 6.61531C17.6729 6.88177 17.6322 7.13715 17.5508 7.38145C17.4694 7.62592 17.342 7.8476 17.1687 8.04648L6.74848 20.0029C6.5725 20.205 6.36966 20.3604 6.13994 20.4693C5.91035 20.5783 5.66952 20.6328 5.41744 20.6328H3.27702ZM14.5556 7.94823L15.7222 6.61531L14.5506 5.26517L13.3789 6.60384L14.5556 7.94823Z" fill="#1C1B1F"/>
                        </svg>
                    </button>
                </div>

                <div className="flex items-center">
                    <div className="mr-8">
                        <span className="font-bold">Total Students:</span> {studentsAt(3)}
                    </div>

                    <div className="mr-4">
                        <span className="font-bold">Total Buses:</span> {busesAt(3)}
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