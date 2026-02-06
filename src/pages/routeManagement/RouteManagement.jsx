import React, { useEffect, useMemo, useState } from "react";
import MainLayout from "@/layouts/SchoolLayout";
import MapComponent from "@/components/MapComponent";
import VendorApprovedCard from "@/components/vendorRoutesCard/VendorApprovedCard";
import SchoolList from "./SchoolList";
import CreateRoute from "./CreateRoute";
import VendorGlobalModal from "@/components/Modals/VendorGlobalModal";

import {
  Button,
  ButtonGroup,
  Input,
  Popover,
  PopoverContent,
  PopoverHandler,
  Typography,
  Spinner,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
} from "@material-tailwind/react";

import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import { FaArrowDown, FaArrowUp, FaPlus } from "react-icons/fa";
import { FaEllipsisVertical } from "react-icons/fa6";
import { Toaster, toast } from "react-hot-toast";

import {
  burgerBar,
  calendar,
  leftArrow,
  rightArrow,
  routeTableIcon,
  ViewMap,
} from "@/assets";

import { tripsData } from "@/data";
import { busTrips } from "@/data/dummyData";

import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { createTerminal } from "@/redux/slices/busesSlice";
import {
  fetchRouteManagementTerminals,
  fetchRouteMap,
  fetchRouteStudents,
  fetchRouteMetrics,
  fetchRouteDetails,
} from "@/redux/slices/routesSlice";
import { fetchStates, fetchCities } from "@/redux/slices/employeSlices";

const RouteManagement = () => {
  const dispatch = useAppDispatch();

  const {
    terminalsHierarchy,
    loading: routesLoading,
    mapView,
    studentsByRoute,
    metricsByRoute,
    detailsByRoute,
  } = useAppSelector((state) => state.routes);

  const { states, cities, loading: employeeLoading } = useAppSelector(
    (state) => state.employees
  );

  const [selectedTab, setSelectedTab] = useState("Route Schedules");
  const [date, setDate] = useState();
  const [openMapScreen, setOpenMapScreen] = useState(false);

  const [isEditable, setIsEditable] = useState(false);
  const [isCreateRoute, setIsCreateRoute] = useState(false);
  const [isEditRoute, setIsEditRoute] = useState(false);

  // ✅ This decides whether MapComponent should call Directions (Uber style)
  const [isRouteMap, setIsRouteMap] = useState(false);

  const [showCard, setShowCard] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [humburgerBar, setHamburgerBar] = useState(false);

  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");

  const [modalPosition, setModalPosition] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isOpen, setIsOpen] = useState(null);

  // Add terminal modal
  const [isAddTerminalModalOpen, setIsAddTerminalModalOpen] = useState(false);
  const INITIAL_TERMINAL_FORM = {
    name: "",
    code: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
  };
  const [terminalForm, setTerminalForm] = useState(INITIAL_TERMINAL_FORM);
  const [citySearch, setCitySearch] = useState("");

  // ---------------------------
  // ✅ LOAD INITIAL DATA
  // ---------------------------
  useEffect(() => {
    dispatch(fetchRouteManagementTerminals());
    dispatch(fetchStates());
    dispatch(fetchCities());
  }, [dispatch]);

  const displayedTerminals = useMemo(() => {
    if (Array.isArray(terminalsHierarchy) && terminalsHierarchy.length > 0)
      return terminalsHierarchy;
    return [];
  }, [terminalsHierarchy]);

  // ---------------------------
  // ✅ UTILITIES
  // ---------------------------
  const resetTerminalForm = () => {
    setTerminalForm(INITIAL_TERMINAL_FORM);
    setCitySearch("");
  };

  const handleCloseAddTerminalModal = () => {
    setIsAddTerminalModalOpen(false);
    resetTerminalForm();
  };

  const handleTerminalFormChange = (e) => {
    const { name, value } = e.target;
    setTerminalForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateTerminalSubmit = async () => {
    try {
      const payload = {
        name: String(terminalForm.name || "").trim(),
        code: String(terminalForm.code || "").trim(),
        address: terminalForm.address ? String(terminalForm.address).trim() : undefined,
        city: terminalForm.city ? String(terminalForm.city).trim() : undefined,
        state: terminalForm.state ? String(terminalForm.state).trim() : undefined,
        zipCode: terminalForm.zipCode ? String(terminalForm.zipCode).trim() : undefined,
      };

      if (!payload.name) return toast.error("Terminal Name is required");
      if (!payload.code) return toast.error("Terminal Code is required");

      const result = await dispatch(createTerminal(payload));
      if (createTerminal.fulfilled.match(result)) {
        toast.success("Terminal created successfully!");
        handleCloseAddTerminalModal();
        dispatch(fetchRouteManagementTerminals());
      } else {
        toast.error(String(result.payload || "Failed to create terminal"));
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to create terminal");
    }
  };

  const handleSort = (column) => {
    if (sortColumn === column) setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  const formatTextWithLineBreaks = (text) => {
    const t = String(text || "");
    return t.split("\n").map((line, index) => (
      <React.Fragment key={index}>
        {line}
        {index < t.split("\n").length - 1 && <br />}
      </React.Fragment>
    ));
  };

  const handleEllipsisClick = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setModalPosition({
      top: rect.top + window.scrollY + 30,
      left: rect.left + window.scrollX - 140,
    });
    setIsModalOpen(true);
  };

  const handleBackTrip = () => {
    setIsEditable(false);
    setIsModalOpen(false);
    setModalPosition(null);
  };

  const hanldeEditModal = () => {
    setIsEditable(true);
    setIsModalOpen(false);
  };

  const resolveRouteId = (route) =>
    route?.routeId ??
    route?.RouteId ??
    route?.routeID ??
    route?.routeid ??
    route?.id ??
    route?.ID;

  // ---------------------------
  // ✅ OPEN MAP SCREEN (ROUTE MAP)
  // ---------------------------
  const handleMapScreenClick = (routeOrTrip) => {
    const resolvedId = resolveRouteId(routeOrTrip);

    if (!resolvedId) {
      console.warn("⚠️ Route ID not found for map call", routeOrTrip);
      toast.error("Route ID not found");
      return;
    }

    setShowCard(true);
    setIsRouteMap(true);        // ✅ Uber/Careem route mode
    setOpenMapScreen(true);

    // Load route stops (for directions waypoints)
    dispatch(fetchRouteMap({ routeId: resolvedId, type: "AM" }));

    // Load students (markers)
    const alreadyStudents =
      Array.isArray(studentsByRoute?.[resolvedId]) && studentsByRoute[resolvedId].length > 0;
    const loadingStudents = routesLoading?.routeStudents?.[resolvedId];
    if (!alreadyStudents && !loadingStudents) {
      dispatch(fetchRouteStudents({ routeId: resolvedId, type: "AM" }));
    }

    // Metrics cache
    const hasMetrics = Boolean(metricsByRoute?.[resolvedId]?.distanceKm);
    const metricsLoading = routesLoading?.routeMetrics?.[resolvedId];
    if (!hasMetrics && !metricsLoading) {
      dispatch(fetchRouteMetrics(resolvedId));
    }

    // Details cache
    const hasDetails = Boolean(detailsByRoute?.[resolvedId] && Object.keys(detailsByRoute[resolvedId]).length > 0);
    const detailsLoading = routesLoading?.routeDetails?.[resolvedId];
    if (!hasDetails && !detailsLoading) {
      dispatch(fetchRouteDetails(resolvedId));
    }
  };

  const handleBackClick = () => {
    setOpenMapScreen(false);
    setIsCreateRoute(false);
    setIsEditRoute(false);
    setIsRouteMap(false);
    setShowCard(true);
  };

  const handleOpenRoute = () => {
    setIsCreateRoute(true);
    setIsEditRoute(false);
  };

  const handleEditRoute = () => {
    setIsEditRoute(true);
    setIsCreateRoute(true);
  };

  const closeCard = () => setShowCard(false);

  // ---------------------------
  // ✅ CLEAN MAP DATA (NO MOCK, NO MANUAL POLYLINES)
  // ---------------------------
  const mapData = useMemo(() => {
    const payload = mapView?.data || {};
    const stopsRaw = payload.stops || payload.data?.stops || [];
    const selectedRouteId = mapView?.routeId;

    const studentsRaw =
      (selectedRouteId ? studentsByRoute?.[selectedRouteId] : null) ||
      payload.students ||
      payload.data?.students ||
      [];

    const stops = (Array.isArray(stopsRaw) ? stopsRaw : [])
      .map((stop, idx) => {
        const lat =
          stop.stopLatitude ??
          stop.StopLatitude ??
          stop.latitude ??
          stop.Latitude ??
          stop.lat;

        const lng =
          stop.stopLongitude ??
          stop.StopLongitude ??
          stop.longitude ??
          stop.Longitude ??
          stop.lng;

        const latNum = Number(lat);
        const lngNum = Number(lng);
        if (!Number.isFinite(latNum) || !Number.isFinite(lngNum)) return null;

        const order = Number(stop.stopOrder ?? stop.StopOrder ?? stop.order ?? idx + 1);

        return {
          id: stop.stopId || stop.StopId || `stop-${idx}`,
          order,
          title: stop.stopName || stop.StopName || `Stop ${Number.isFinite(order) ? order : idx + 1}`,
          position: { lat: latNum, lng: lngNum },
          address: stop.stopAddress || stop.StopAddress || "",
        };
      })
      .filter(Boolean)
      .sort((a, b) => (a.order || 0) - (b.order || 0));

    const stopMarkers = stops.map((s, i) => ({
      id: String(s.id),
      type: "stop",
      order: s.order,
      stopRole: i === 0 ? "start" : i === stops.length - 1 ? "end" : "mid",
      title: s.title,
      position: s.position,
      details: { address: s.address },
    }));

    const studentMarkers = (Array.isArray(studentsRaw) ? studentsRaw : [])
      .map((stu, idx) => {
        const lat =
          stu.studentLatitude ??
          stu.StudentLatitude ??
          stu.pickupLatitude ??
          stu.PickupLatitude ??
          stu.latitude ??
          stu.Latitude ??
          stu.lat;

        const lng =
          stu.studentLongitude ??
          stu.StudentLongitude ??
          stu.pickupLongitude ??
          stu.PickupLongitude ??
          stu.longitude ??
          stu.Longitude ??
          stu.lng;

        const latNum = Number(lat);
        const lngNum = Number(lng);
        if (!Number.isFinite(latNum) || !Number.isFinite(lngNum)) return null;

        const first = stu.firstName ?? stu.FirstName ?? "";
        const last = stu.lastName ?? stu.LastName ?? "";
        const name =
          (first || last) ? `${first} ${last}`.trim() : (stu.studentName || stu.StudentName || `Student ${idx + 1}`);

        return {
          id: String(stu.studentId ?? stu.StudentId ?? `student-${idx}`),
          type: "student",
          title: name,
          position: { lat: latNum, lng: lngNum },
          details: { name },
        };
      })
      .filter(Boolean);

    // Don't show student (red pin) on first/last stop — only stop marker (red circle) should show there (pickup/school)
    const firstStopPos = stops[0]?.position;
    const lastStopPos = stops.length > 1 ? stops[stops.length - 1]?.position : undefined;
    const samePosition = (a, b) =>
      a && b &&
      Math.abs(a.lat - b.lat) < 1e-5 &&
      Math.abs(a.lng - b.lng) < 1e-5;

    const studentMarkersFiltered = studentMarkers.filter((sm) => {
      const atFirst = samePosition(sm.position, firstStopPos);
      const atLast = samePosition(sm.position, lastStopPos);
      return !atFirst && !atLast;
    });

    const markers = [...stopMarkers, ...studentMarkersFiltered];

    let center = undefined;
    if (markers.length > 0) {
      const sum = markers.reduce(
        (acc, m) => ({ lat: acc.lat + m.position.lat, lng: acc.lng + m.position.lng }),
        { lat: 0, lng: 0 }
      );
      center = { lat: sum.lat / markers.length, lng: sum.lng / markers.length };
    }

    return { markers, center, stopCount: stopMarkers.length };
  }, [mapView, studentsByRoute]);

  const effectiveMarkers = mapData.markers || [];
  const effectiveCenter = mapData.center;

  // Directions requires 2+ stops
  const hasEnoughStopsForRoute = (mapData.stopCount || 0) >= 2;

  // ---------------------------
  // ✅ CARD INFO FROM DETAILS/METRICS
  // ---------------------------
  const activeRouteId = mapView?.routeId;
  const activeRouteMetrics = activeRouteId ? metricsByRoute?.[activeRouteId] : null;
  const activeRouteDetails = activeRouteId ? detailsByRoute?.[activeRouteId] : null;

  const details = activeRouteDetails || {};
  const pickFirst = (...vals) => vals.find((v) => v !== undefined && v !== null && String(v).trim() !== "");
  const hhmm = (iso) => {
    if (!iso) return null;
    if (typeof iso === "string" && iso.includes("T")) return iso.split("T")[1]?.slice(0, 5) || null;
    try {
      const d = new Date(iso);
      if (isNaN(d.getTime())) return String(iso);
      const h = String(d.getHours()).padStart(2, "0");
      const m = String(d.getMinutes()).padStart(2, "0");
      return `${h}:${m}`;
    } catch {
      return String(iso);
    }
  };

  const scheduleObj = Array.isArray(details.schedule) ? details.schedule[0] : details.schedule || details.Schedule || null;
  const schedulePickup = scheduleObj ? pickFirst(scheduleObj.pickupTime, scheduleObj.PickupTime) : null;
  const scheduleDropoff = scheduleObj ? pickFirst(scheduleObj.dropoffTime, scheduleObj.DropoffTime) : null;

  const driverName = pickFirst(details.driverName, details.DriverName, details.driverFullName, details.DriverFullName);
  const driverPhone = pickFirst(details.driverPhone, details.DriverPhone, details.phone, details.Phone, details.mobile, details.Mobile);

  const payloadStops = mapView?.data?.stops || [];
  const lastStop = payloadStops[payloadStops.length - 1];
  const destinationName = lastStop?.stopName || lastStop?.StopName;
  const destinationAddress = lastStop?.stopAddress || lastStop?.StopAddress;
  const destinationLat =
    lastStop?.latitude ?? lastStop?.Latitude ?? lastStop?.stopLatitude ?? lastStop?.StopLatitude;
  const destinationLng =
    lastStop?.longitude ?? lastStop?.Longitude ?? lastStop?.stopLongitude ?? lastStop?.StopLongitude;

  const destinationLatLng =
    destinationLat !== undefined && destinationLng !== undefined
      ? { lat: Number(destinationLat), lng: Number(destinationLng) }
      : null;

  // ---------------------------
  // ✅ RENDER
  // ---------------------------
  return (
    <MainLayout>
      <Toaster position="top-right" reverseOrder={false} toastOptions={{ duration: 3000 }} />

      {openMapScreen ? (
        routesLoading?.mapView ? (
          <div className="flex flex-col items-center justify-center h-full py-12">
            <Spinner className="h-10 w-10 text-[#C01824]" />
            <Typography className="mt-3 text-gray-600 font-medium">Loading map data...</Typography>
          </div>
        ) : isRouteMap && !hasEnoughStopsForRoute ? (
          <div className="flex flex-col items-center justify-center h-full py-12 bg-white rounded-lg border border-gray-200">
            <Typography className="text-lg font-semibold text-gray-800">
              No stops/coordinates found for this route yet
            </Typography>
            <Typography className="text-sm mt-2 text-gray-600 max-w-xl text-center">
              Need at least 2 stops (pickup/drop) with lat/lng for the route. Add stops and try again.
            </Typography>
            <Button onClick={handleBackClick} className="mt-5 bg-[#C01824]">
              Back
            </Button>
          </div>
        ) : (
          <MapComponent
            key={mapView?.routeId || "route-map"}
            onBack={handleBackClick}
            isRouteMap={isRouteMap}
            closeCard={closeCard}
            showCard={showCard}
            markers={effectiveMarkers}
            routes={[]} // ✅ IMPORTANT: never pass manual polylines in route map
            center={effectiveCenter}
            distanceKm={activeRouteMetrics?.distanceKm}
            durationMinutes={activeRouteMetrics?.durationMinutes}
            cardTitle={
              details?.routeNumber ||
              details?.RouteNumber ||
              details?.routeName ||
              details?.RouteName ||
              `Route #${activeRouteId || ""}`
            }
            scheduleText={
              schedulePickup || scheduleDropoff
                ? `${hhmm(schedulePickup) || "—"} - ${hhmm(scheduleDropoff) || "—"}`
                : null
            }
            contactText={driverName || null}
            contactPhone={driverPhone || null}
            destinationName={destinationName || null}
            destinationAddress={destinationAddress || null}
            destinationLatLng={destinationLatLng}
          />
        )
      ) : isCreateRoute || isEditable ? (
        <CreateRoute
          onBack={handleBackClick}
          editRoute={isEditRoute}
          isEditable={isEditable}
          handleBackTrip={handleBackTrip}
        />
      ) : (
        // ===========================
        // ✅ YOUR EXISTING UI BELOW (kept same)
        // ===========================
        <section className="w-full h-full">
          <div className="flex w-[100%] justify-between flex-row h-[65px] mb-3 items-center">
            <ButtonGroup className="border-2 border-[#DDDDE1]/50 rounded-[10px] outline-none p-0" variant="text" size="lg">
              {["Route Schedules", "Trip Planner"].map((tab) => (
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

            {selectedTab === "Trip Planner" ? null : (
              <div className="flex gap-4">
                <Button
                  className="bg-[#C01824] md:!px-10 !py-3 capitalize text-sm md:text-[16px] font-normal flex items-center gap-2"
                  variant="filled"
                  size="lg"
                  onClick={() => {
                    resetTerminalForm();
                    setIsAddTerminalModalOpen(true);
                  }}
                >
                  <FaPlus size={16} />
                  Add Terminal
                </Button>

                <Button
                  className="bg-[#C01824] md:!px-10 !py-3 capitalize text-sm md:text-[16px] font-normal flex items-center"
                  variant="filled"
                  size="lg"
                  onClick={handleOpenRoute}
                >
                  <span className="mr-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                  </span>
                  Create Route
                </Button>
              </div>
            )}
          </div>

          {/* ✅ terminals list stays same */}
          <div className="w-full space-y-4">
            {routesLoading?.terminalsHierarchy && displayedTerminals.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-lg p-4 text-gray-600">
                Loading terminals...
              </div>
            ) : displayedTerminals.length > 0 ? (
              displayedTerminals.map((terminal, index) => (
                <div key={terminal.terminalId || `terminal-${index}`} className="w-full bg-white border-b border-gray-200 shadow-sm">
                  {/* terminal header */}
                  <div className="flex items-center justify-between px-4 py-2">
                    <div className="flex items-center space-x-3">
                      <button className="text-gray-600 hover:text-gray-800">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                      </button>

                      <h2 className="font-medium text-gray-800 text-lg">
                        {terminal.terminalName || `Terminal ${terminal.terminalId || index + 1}`}
                      </h2>

                      <button className="text-gray-600 hover:text-gray-800" onClick={() => setIsOpen(index === isOpen ? null : index)}>
                        {/* edit icon */}
                        <svg width="20" height="24" viewBox="0 0 20 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M3.27702 20.6328C3.01105 20.6328 2.78653 20.5278 2.60348 20.318C2.42056 20.1079 2.3291 19.8503 2.3291 19.5451V17.1006C2.3291 16.8114 2.3766 16.535 2.4716 16.2714C2.56646 16.0079 2.70195 15.7753 2.87806 15.5733L13.3191 3.61121C13.4924 3.42443 13.6848 3.28132 13.8962 3.18188C14.1074 3.08244 14.3292 3.03271 14.5614 3.03271C14.7903 3.03271 15.0139 3.08244 15.2322 3.18188C15.4504 3.28132 15.6426 3.43049 15.8087 3.62938L17.1687 5.19657C17.342 5.38334 17.4694 5.60295 17.5508 5.85538C17.6322 6.10765 17.6729 6.36096 17.6729 6.61531C17.6729 6.88177 17.6322 7.13715 17.5508 7.38145C17.4694 7.62592 17.342 7.8476 17.1687 8.04648L6.74848 20.0029C6.5725 20.205 6.36966 20.3604 6.13994 20.4693C5.91035 20.5783 5.66952 20.6328 5.41744 20.6328H3.27702ZM14.5556 7.94823L15.7222 6.61531L14.5506 5.26517L13.3789 6.60384L14.5556 7.94823Z" fill="#1C1B1F" />
                        </svg>
                      </button>
                    </div>

                    <div className="flex items-center space-x-4">
                      <button onClick={() => setIsOpen(index === isOpen ? null : index)} className="text-black hover:text-gray-800">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* terminal body */}
                  {isOpen === index && (
                    selectedTab === "Trip Planner" ? (
                      <div className="w-full">
                        {/* ✅ your Trip Planner UI — keep as is */}
                        {/* IMPORTANT FIX: View Map click must pass route/trip */}
                        {humburgerBar ? (
                          <div className="w-full p-4 overflow-hidden rounded-sm">
                            <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm">
                              <table className="w-full border-collapse">
                                <thead>{/* your headers */}</thead>
                                <tbody>
                                  {busTrips?.map((trip) => (
                                    <tr key={trip.id} className="border-t border-gray-200 hover:bg-gray-50">
                                      {/* ... your cells */}
                                      <td
                                        className="px-4 py-3.5 text-sm text-gray-800 cursor-pointer"
                                        onClick={() => handleMapScreenClick(trip)} // ✅ FIX
                                      >
                                        <img src={ViewMap} alt="ViewMap" />
                                      </td>

                                      <td className="px-4 py-3.5 text-sm text-gray-800 cursor-pointer" onClick={handleEllipsisClick}>
                                        <FaEllipsisVertical />
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-wrap gap-2 justify-evenly">
                            {tripsData
                              .filter((card) => card.status === "Approved")
                              .map((trip, idx) => (
                                <VendorApprovedCard
                                  key={idx}
                                  trip={trip}
                                  trips={tripsData}
                                  onEditClick={hanldeEditModal}
                                  selectedTab={selectedTab}
                                  handleMapScreenClick={handleMapScreenClick} // ✅ ensure card calls with route obj
                                  handleEditRoute={handleEditRoute}
                                />
                              ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="w-full bg-white border-t border-gray-200 shadow-sm">
                        <SchoolList
                          institutes={terminal.institutes || []}
                          handleMapScreenClick={handleMapScreenClick}
                          handleEditRoute={handleEditRoute}
                        />
                      </div>
                    )
                  )}
                </div>
              ))
            ) : (
              <div className="bg-white border border-gray-200 rounded-lg p-4 text-gray-600">
                No terminals found for this vendor.
              </div>
            )}
          </div>
        </section>
      )}

      {/* ✅ Add Terminal Modal */}
      <VendorGlobalModal
        isOpen={isAddTerminalModalOpen}
        onClose={handleCloseAddTerminalModal}
        title="Add New Terminal"
        primaryButtonText="Create"
        secondaryButtonText="Cancel"
        onPrimaryAction={handleCreateTerminalSubmit}
      >
        <div className="flex flex-col gap-4">
          <div className="flex flex-col">
            <Typography variant="small" color="blue-gray" className="mb-2 font-medium text-left">
              Terminal Name
            </Typography>
            <Input
              size="lg"
              placeholder="e.g. West Coast Terminal"
              name="name"
              value={terminalForm.name}
              onChange={handleTerminalFormChange}
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{ className: "before:content-none after:content-none" }}
            />
          </div>

          <div className="flex flex-col">
            <Typography variant="small" color="blue-gray" className="mb-2 font-medium text-left">
              Terminal Code
            </Typography>
            <Input
              size="lg"
              placeholder="e.g. T-101"
              name="code"
              value={terminalForm.code}
              onChange={handleTerminalFormChange}
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{ className: "before:content-none after:content-none" }}
            />
          </div>

          <div className="flex flex-col">
            <Typography variant="small" color="blue-gray" className="mb-2 font-medium text-left">
              Address / Location
            </Typography>
            <Input
              size="lg"
              placeholder="Enter full address"
              name="address"
              value={terminalForm.address}
              onChange={handleTerminalFormChange}
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{ className: "before:content-none after:content-none" }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex flex-col">
              <Typography variant="small" color="blue-gray" className="mb-2 font-medium text-left">
                City
              </Typography>
              <Menu placement="bottom-start">
                <MenuHandler>
                  <div>
                    <Input
                      size="lg"
                      placeholder="Select City (search)"
                      readOnly
                      value={terminalForm.city || ""}
                      className="cursor-pointer !border-t-blue-gray-200 focus:!border-t-gray-900"
                      labelProps={{ className: "before:content-none after:content-none" }}
                      crossOrigin={undefined}
                    />
                  </div>
                </MenuHandler>

                <MenuList className="max-h-96 w-72">
                  <div className="p-2">
                    <Input
                      size="sm"
                      placeholder="Search city..."
                      value={citySearch}
                      onChange={(e) => setCitySearch(e.target.value)}
                      labelProps={{ className: "before:content-none after:content-none" }}
                      crossOrigin={undefined}
                    />
                  </div>

                  <div className="max-h-64 overflow-y-auto">
                    {employeeLoading?.cities ? (
                      <MenuItem disabled>Loading cities...</MenuItem>
                    ) : (() => {
                        const all = Array.isArray(cities) ? cities : [];
                        const term = citySearch.toLowerCase();
                        const filtered = all
                          .filter((c) => {
                            const name = (c.CityName || c.cityName || c.name || "").toLowerCase();
                            return term ? name.includes(term) : true;
                          })
                          .slice(0, 100);

                        if (filtered.length === 0) return <MenuItem disabled>No matches</MenuItem>;

                        return filtered.map((city) => {
                          const name = city.CityName || city.cityName || city.name || "Unknown";
                          return (
                            <MenuItem
                              key={city.CityId || city.cityId || city.id || name}
                              onClick={() => setTerminalForm((prev) => ({ ...prev, city: name }))}
                            >
                              {name}
                            </MenuItem>
                          );
                        });
                      })()}
                  </div>
                </MenuList>
              </Menu>
            </div>

            <div className="flex flex-col">
              <Typography variant="small" color="blue-gray" className="mb-2 font-medium text-left">
                State
              </Typography>
              <select
                className="h-11 w-full rounded-md border border-blue-gray-200 bg-transparent px-3 text-sm text-blue-gray-700 outline-none focus:border-gray-900"
                value={terminalForm.state || ""}
                onChange={(e) => setTerminalForm((prev) => ({ ...prev, state: e.target.value }))}
              >
                <option value="" disabled>
                  {employeeLoading?.states ? "Loading states..." : "Select State"}
                </option>
                {(Array.isArray(states) ? states : []).map((state) => {
                  const id = state.StateId || state.stateId || state.id;
                  const name = state.StateName || state.stateName || state.name || `State ${id}`;
                  return (
                    <option key={id ?? name} value={String(id)}>
                      {name}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="flex flex-col">
              <Typography variant="small" color="blue-gray" className="mb-2 font-medium text-left">
                Zip Code
              </Typography>
              <Input
                size="lg"
                placeholder="e.g. 60601"
                name="zipCode"
                value={terminalForm.zipCode}
                onChange={handleTerminalFormChange}
                className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{ className: "before:content-none after:content-none" }}
                crossOrigin={undefined}
              />
            </div>
          </div>
        </div>
      </VendorGlobalModal>
    </MainLayout>
  );
};

export default RouteManagement;
