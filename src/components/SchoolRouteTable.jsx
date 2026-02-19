import React, { useState } from 'react';
import { AnimalIcon, ViewMap } from '@/assets';
import { ChevronLeft, ChevronRight } from "lucide-react";
import { HiOutlineDotsVertical } from "react-icons/hi";
import EditModal from './EditModal';
import { apiClient } from "@/configs/api";

const STUDENTS_PER_PAGE = 10;

const PencilIcon = () => (
  <svg width="18" height="22" viewBox="0 0 20 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M3.27702 20.6328C3.01105 20.6328 2.78653 20.5278 2.60348 20.318C2.42056 20.1079 2.3291 19.8503 2.3291 19.5451V17.1006C2.3291 16.8114 2.3766 16.535 2.4716 16.2714C2.56646 16.0079 2.70195 15.7753 2.87806 15.5733L13.3191 3.61121C13.4924 3.42443 13.6848 3.28132 13.8962 3.18188C14.1074 3.08244 14.3292 3.03271 14.5614 3.03271C14.7903 3.03271 15.0139 3.08244 15.2322 3.18188C15.4504 3.28132 15.6426 3.43049 15.8087 3.62938L17.1687 5.19657C17.342 5.38334 17.4694 5.60295 17.5508 5.85538C17.6322 6.10765 17.6729 6.36096 17.6729 6.61531C17.6729 6.88177 17.6322 7.13715 17.5508 7.38145C17.4694 7.62592 17.342 7.8476 17.1687 8.04648L6.74848 20.0029C6.5725 20.205 6.36966 20.3604 6.13994 20.4693C5.91035 20.5783 5.66952 20.6328 5.41744 20.6328H3.27702ZM14.5556 7.94823L15.7222 6.61531L14.5506 5.26517L13.3789 6.60384L14.5556 7.94823Z" fill="#1C1B1F" />
  </svg>
);

const BurgerIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const ChevronDown = ({ open }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"
    className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}>
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

export default function SchoolRouteTable({
  handleMapScreenClick,
  institutes = [],
  loading = false,
  routesByInstitute = {},
  routesLoadingByInstitute = {},
}) {
  const [expandedInstitutes, setExpandedInstitutes] = useState({});
  const [expandedRoutes, setExpandedRoutes] = useState({});
  const [studentsByRoute, setStudentsByRoute] = useState({});
  const [studentsLoadingByRoute, setStudentsLoadingByRoute] = useState({});
  const [currentPageByRoute, setCurrentPageByRoute] = useState({});
  const [searchByRoute, setSearchByRoute] = useState({});
  const [activeTabByRoute, setActiveTabByRoute] = useState({});
  const [openMenuIndex, setOpenMenuIndex] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  // ─── Helpers ───────────────────────────────────────────────────────────────
  const getInstituteId = (inst) =>
    inst?.InstituteId ?? inst?.instituteId ?? inst?.InstituteID ?? inst?.instituteID ?? inst?.id ?? null;

  const getRouteId = (route) =>
    route?.RouteId ?? route?.routeId ?? route?.id ?? null;

  const getRouteName = (route) =>
    route?.RouteNumber || route?.routeNumber || route?.RouteName || route?.routeName || `Route ${getRouteId(route)}`;

  const parseDateField = (raw) => {
    if (!raw) return "";
    if (typeof raw === "string" && raw.includes("T")) return raw.split("T")[0];
    try {
      const d = new Date(raw);
      return isNaN(d.getTime()) ? String(raw) : d.toISOString().slice(0, 10);
    } catch { return String(raw); }
  };

  const parseTimeField = (raw) => {
    if (!raw) return "";
    if (typeof raw === "string" && raw.includes("T")) return raw.split("T")[1]?.slice(0, 5) || "";
    if (typeof raw === "string" && raw.length >= 5 && raw[2] === ":") return raw.slice(0, 5);
    try {
      const d = new Date(raw);
      if (isNaN(d.getTime())) return "";
      return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
    } catch { return ""; }
  };

  const parseTimeToMinutes = (timeStr) => {
    if (!timeStr || timeStr === "-") return null;
    const parts = timeStr.split(":");
    if (parts.length < 2) return null;
    const h = parseInt(parts[0]);
    const m = parseInt(parts[1]);
    if (isNaN(h) || isNaN(m)) return null;
    return h * 60 + m;
  };

  // ─── Fetch students when route expands ─────────────────────────────────────
  const toggleRoute = async (routeId) => {
    const nextVal = !expandedRoutes[routeId];
    setExpandedRoutes(prev => ({ ...prev, [routeId]: nextVal }));

    if (nextVal && !studentsByRoute[routeId] && !studentsLoadingByRoute[routeId]) {
      try {
        setStudentsLoadingByRoute(prev => ({ ...prev, [routeId]: true }));
        const response = await apiClient.get(`/route-scheduling/routes/${routeId}/students`);
        const list = Array.isArray(response?.data?.data)
          ? response.data.data
          : Array.isArray(response?.data)
          ? response.data
          : [];
        setStudentsByRoute(prev => ({ ...prev, [routeId]: list }));
      } catch (e) {
        console.error("Failed to fetch route students:", e);
        setStudentsByRoute(prev => ({ ...prev, [routeId]: [] }));
      } finally {
        setStudentsLoadingByRoute(prev => ({ ...prev, [routeId]: false }));
      }
    }
  };

  // ─── Map API students to table rows ────────────────────────────────────────
  const mapStudentsToRows = (students, driverName) => {
    return (students || []).map((s) => {
      const studentName =
        s?.StudentName || s?.studentName || s?.Name || s?.name ||
        `${s?.FirstName || s?.firstName || ""} ${s?.LastName || s?.lastName || ""}`.trim() || "Student";

      const pickup =
        s?.Pickup || s?.pickup || s?.PickupLocation || s?.pickupLocation ||
        s?.PickupAddress || s?.pickupAddress || s?.Address || s?.address || "-";

      const dropoff =
        s?.Dropoff || s?.dropoff || s?.DropoffLocation || s?.dropoffLocation ||
        s?.DropoffAddress || s?.dropoffAddress || "-";

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
        driverName: driverName || "-",
        pickup: pickup || "-",
        dropoff: dropoff || "-",
        pickupLat: s?.PickupLatitude ?? s?.pickupLatitude ?? null,
        pickupLng: s?.PickupLongitude ?? s?.pickupLongitude ?? null,
        dropLat: s?.DropLatitude ?? s?.dropLatitude ?? s?.DropoffLatitude ?? s?.dropoffLatitude ?? null,
        dropLng: s?.DropLongitude ?? s?.dropLongitude ?? s?.DropoffLongitude ?? s?.dropoffLongitude ?? null,
      };
    });
  };

  // ─── Filter by search + AM/PM ───────────────────────────────────────────────
  const getFilteredRows = (rows, routeId) => {
    const search = (searchByRoute[routeId] || "").toLowerCase().trim();
    const tab = activeTabByRoute[routeId] || "All";

    return rows.filter(row => {
      if (search) {
        const haystack = [row.studentName, row.driverName, row.pickup, row.dropoff]
          .join(" ").toLowerCase();
        if (!haystack.includes(search)) return false;
      }
      if (tab !== "All") {
        const mins = parseTimeToMinutes(row.pickupTime);
        if (mins === null) return false;
        if (tab === "AM" && mins >= 720) return false;
        if (tab === "PM" && mins < 720) return false;
      }
      return true;
    });
  };

  const getTabClass = (routeId, label) => {
    const active = activeTabByRoute[routeId] || "All";
    return active === label
      ? "bg-[#C01824] text-white px-4 py-2 rounded text-sm font-bold"
      : "bg-gray-200 hover:bg-gray-300 text-black px-4 py-2 rounded text-sm font-bold";
  };

  const handleModal = () => {
    setIsEditOpen(false);
    setOpenMenuIndex(null);
  };

  // ─── Loading / Empty states ─────────────────────────────────────────────────
  if (loading) {
    return <div className="p-6 text-gray-500 text-center">Loading institutes...</div>;
  }

  if (!institutes || institutes.length === 0) {
    return <div className="p-6 text-gray-400 text-center">No institutes found for this terminal.</div>;
  }

  // ─── Main Render ────────────────────────────────────────────────────────────
  return (
    <div className="w-full p-4 space-y-3">
      {institutes.map((inst, instIdx) => {
        const instituteId = getInstituteId(inst);
        const instituteName = inst?.InstituteName || inst?.instituteName || `Institute ${instIdx + 1}`;
        const totalStudents =
          inst?.TotalStudents ?? inst?.totalStudents ??
          inst?.TotalStudent  ?? inst?.totalStudent  ?? "-";
        const totalBuses =
          inst?.TotalBuses ?? inst?.totalBuses ??
          inst?.TotalBus   ?? inst?.totalBus   ?? "-";
        const isInstOpen = !!expandedInstitutes[instituteId];
        const routes = Array.isArray(routesByInstitute?.[instituteId]) ? routesByInstitute[instituteId] : [];
        const routesLoading = routesLoadingByInstitute?.[instituteId] || false;

        return (
          <div key={instituteId ?? instIdx} className="border border-gray-200 rounded-lg shadow-sm">

            {/* ── Institute Header ── */}
            <div className="p-4 flex items-center justify-between border-b border-gray-200">
              <div className="flex items-center gap-3">
                <button className="text-gray-400"><BurgerIcon /></button>
                <div className="w-10 h-10 rounded-full bg-[#C01824] flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                  {instituteName.charAt(0).toUpperCase()}
                </div>
                <span className="font-bold text-lg">{instituteName}</span>
                <button className="text-gray-500 hover:text-gray-700"><PencilIcon /></button>
              </div>

              <div className="flex items-center gap-4 flex-wrap justify-end">
                <span className="text-sm"><span className="font-bold">Total Students:</span> {totalStudents}</span>
                <span className="text-sm"><span className="font-bold">Total Buses:</span> {totalBuses}</span>
                <button
                  className="bg-[#C01824] text-white px-3 py-1 rounded flex items-center gap-1 text-sm"
                  onClick={() => {
                    const firstRouteId = routes.length > 0 ? getRouteId(routes[0]) : null;
                    if (firstRouteId) handleMapScreenClick(firstRouteId);
                  }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="3 11 22 2 13 21 11 13 3 11" />
                  </svg>
                  Map
                </button>
                <button onClick={() => setExpandedInstitutes(prev => ({ ...prev, [instituteId]: !prev[instituteId] }))}>
                  <ChevronDown open={isInstOpen} />
                </button>
              </div>
            </div>

            {/* ── Routes List ── */}
            {isInstOpen && (
              <div className="p-4 space-y-3">
                {routesLoading ? (
                  <div className="text-gray-400 text-center py-6">Loading routes...</div>
                ) : routes.length === 0 ? (
                  <div className="text-gray-400 text-center py-6">No routes found for this institute.</div>
                ) : (
                  routes.map((route, routeIdx) => {
                    const routeId = getRouteId(route);
                    const routeName = getRouteName(route);
                    const isRouteOpen = !!expandedRoutes[routeId];
                    const students = studentsByRoute[routeId];
                    const studentsLoading = studentsLoadingByRoute[routeId];
                    const driverName = route?.DriverName || route?.driverName || "-";

                    const allRows = mapStudentsToRows(students, driverName);
                    const filteredRows = getFilteredRows(allRows, routeId);
                    const page = currentPageByRoute[routeId] || 1;
                    const totalPages = Math.max(1, Math.ceil(filteredRows.length / STUDENTS_PER_PAGE));
                    const pageRows = filteredRows.slice((page - 1) * STUDENTS_PER_PAGE, page * STUDENTS_PER_PAGE);

                    const schoolStartTime =
                      route?.SchoolStartTime || route?.schoolStartTime ||
                      route?.StartTime       || route?.startTime       ||
                      route?.OpenTime        || route?.openTime        ||
                      route?.ShiftStart      || route?.shiftStart      || "-";
                    const schoolDismissalTime =
                      route?.SchoolDismissalTime || route?.schoolDismissalTime ||
                      route?.DismissalTime       || route?.dismissalTime       ||
                      route?.EndTime             || route?.endTime             ||
                      route?.CloseTime           || route?.closeTime           ||
                      route?.ShiftEnd            || route?.shiftEnd            || "-";
                    const busNumber = route?.BusNumber || route?.busNumber || route?.VehicleName || route?.vehicleName || "-";

                    return (
                      <div key={routeId ?? routeIdx} className="mb-2">

                        {/* ── Route Header ── */}
                        <div className="border border-gray-200 rounded-md p-3 flex items-center justify-between flex-wrap gap-2">
                          <div className="flex items-center gap-3">
                            <button className="text-gray-400"><BurgerIcon /></button>
                            <span className="font-bold">{routeName}</span>
                            <button className="text-gray-500 hover:text-gray-700" onClick={() => toggleRoute(routeId)}>
                              <PencilIcon />
                            </button>
                          </div>

                          <div className="flex flex-wrap items-center gap-2">
                            <button className="text-[#C01824] px-3 py-1 border border-[#C01824] rounded text-sm whitespace-nowrap">
                              School start time: {schoolStartTime}
                            </button>
                            <button className="text-[#C01824] px-3 py-1 border border-[#C01824] rounded text-sm whitespace-nowrap">
                              School dismissal time: {schoolDismissalTime}
                            </button>
                            <span className="text-sm font-bold flex items-center gap-1">
                              Route Animal Icon
                              <img src={AnimalIcon} alt="Animal Icon" className="w-5 h-5" />
                            </span>
                            <span className="text-sm font-bold">Route ID: {routeId}</span>
                            <span className="text-sm font-bold">Bus no: {busNumber}</span>
                            <button onClick={() => toggleRoute(routeId)}>
                              <ChevronDown open={isRouteOpen} />
                            </button>
                          </div>
                        </div>

                        {/* ── Students Table ── */}
                        {isRouteOpen && (
                          <div className="p-4 space-y-3 bg-white border border-t-0 border-gray-200 rounded-b-md">

                            {/* Search + AM/PM tabs */}
                            <div className="flex justify-end items-center gap-2 flex-wrap">
                              <input
                                type="text"
                                placeholder="Search"
                                value={searchByRoute[routeId] || ""}
                                onChange={(e) => {
                                  setSearchByRoute(prev => ({ ...prev, [routeId]: e.target.value }));
                                  setCurrentPageByRoute(prev => ({ ...prev, [routeId]: 1 }));
                                }}
                                className="border px-3 py-2 rounded w-full max-w-xs text-sm"
                              />
                              {["All", "AM", "PM"].map(tab => (
                                <button
                                  key={tab}
                                  onClick={() => {
                                    setActiveTabByRoute(prev => ({ ...prev, [routeId]: tab }));
                                    setCurrentPageByRoute(prev => ({ ...prev, [routeId]: 1 }));
                                  }}
                                  className={getTabClass(routeId, tab)}
                                >
                                  {tab}
                                </button>
                              ))}
                            </div>

                            {/* Table */}
                            {studentsLoading ? (
                              <div className="text-center py-8 text-gray-400">Loading students...</div>
                            ) : (
                              <div className="overflow-x-auto">
                                <table className="w-full border border-[#EEEEEE] rounded text-center">
                                  <thead className="bg-[#EEEEEE]">
                                    <tr>
                                      {["Date", "Pick-up Time", "Student Name", "Drivers Name", "Pickup", "Dropoff", "View Map", "Action"].map(h => (
                                        <th key={h} className="px-6 py-4 text-[14px] font-bold text-[#141516] border-b border-[#D9D9D9] whitespace-nowrap">
                                          {h}
                                        </th>
                                      ))}
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {pageRows.length === 0 ? (
                                      <tr>
                                        <td colSpan={8} className="py-8 text-gray-400 text-sm">
                                          {students === undefined ? "Expand to load students." : "No students found."}
                                        </td>
                                      </tr>
                                    ) : pageRows.map((row, idx) => {
                                      const globalIdx = `${routeId}-${(page - 1) * STUDENTS_PER_PAGE + idx}`;
                                      return (
                                        <tr key={globalIdx} className="border-b border-[#D9D9D9] hover:bg-gray-50">
                                          <td className="px-4 py-2 text-sm text-left align-middle whitespace-nowrap">{row.date}</td>
                                          <td className="px-4 py-2 text-sm text-left align-middle whitespace-nowrap">{row.pickupTime}</td>
                                          <td className="px-4 py-2 text-sm text-left align-middle whitespace-nowrap">{row.studentName}</td>
                                          <td className="px-4 py-2 text-sm text-left align-middle whitespace-nowrap">{row.driverName}</td>
                                          <td className="px-4 py-2 text-sm text-left align-middle max-w-[180px]">
                                            <span className="block truncate" title={row.pickup}>{row.pickup}</span>
                                          </td>
                                          <td className="px-4 py-2 text-sm text-left align-middle max-w-[180px]">
                                            <span className="block truncate" title={row.dropoff}>{row.dropoff}</span>
                                          </td>
                                          <td className="px-4 py-2 text-center align-middle">
                                            <div className="flex justify-center">
                                              <img
                                                src={ViewMap}
                                                alt="View Map"
                                                className="w-6 h-6 cursor-pointer"
                                                onClick={() => handleMapScreenClick(row)}
                                              />
                                            </div>
                                          </td>
                                          <td className="px-4 py-2 text-center align-middle relative">
                                            <div className="flex justify-center">
                                              <HiOutlineDotsVertical
                                                size={22}
                                                className="cursor-pointer"
                                                onClick={() => setOpenMenuIndex(openMenuIndex === globalIdx ? null : globalIdx)}
                                              />
                                            </div>
                                            {openMenuIndex === globalIdx && (
                                              <div className="absolute top-full mt-1 right-0 w-28 bg-white border rounded shadow z-20">
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
                                      );
                                    })}
                                  </tbody>
                                </table>
                              </div>
                            )}

                            {/* Pagination */}
                            {!studentsLoading && totalPages > 1 && (
                              <div className="flex justify-center items-center gap-2 mt-3">
                                <button
                                  className="border rounded p-2 hover:bg-gray-100 disabled:opacity-40"
                                  disabled={page === 1}
                                  onClick={() => setCurrentPageByRoute(prev => ({ ...prev, [routeId]: page - 1 }))}
                                >
                                  <ChevronLeft className="w-4 h-4" />
                                </button>

                                {Array.from({ length: totalPages }, (_, i) => i + 1)
                                  .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                                  .reduce((acc, p, i, arr) => {
                                    if (i > 0 && p - arr[i - 1] > 1) acc.push("...");
                                    acc.push(p);
                                    return acc;
                                  }, [])
                                  .map((p, i) =>
                                    p === "..." ? (
                                      <span key={`ellipsis-${i}`} className="px-2 text-gray-400">...</span>
                                    ) : (
                                      <button
                                        key={p}
                                        onClick={() => setCurrentPageByRoute(prev => ({ ...prev, [routeId]: p }))}
                                        className={`border rounded px-3 py-1 text-sm ${
                                          page === p
                                            ? "bg-[#C01824] text-white border-[#C01824]"
                                            : "hover:bg-gray-100"
                                        }`}
                                      >
                                        {p}
                                      </button>
                                    )
                                  )}

                                <button
                                  className="border rounded p-2 hover:bg-gray-100 disabled:opacity-40"
                                  disabled={page === totalPages}
                                  onClick={() => setCurrentPageByRoute(prev => ({ ...prev, [routeId]: page + 1 }))}
                                >
                                  <ChevronRight className="w-4 h-4" />
                                </button>
                              </div>
                            )}

                            <EditModal isOpen={isEditOpen} onClose={handleModal} />
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
