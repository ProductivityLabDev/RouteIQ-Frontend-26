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
import { apiClient } from "@/configs/api";
import { routeSchedulingService } from "@/services/routeSchedulingService";

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
   const [addtrip, setAddTrip] = useState(false);
  const [selectedTripId, setSelectedTripId] = useState(null);
  const [selectedTripData, setSelectedTripData] = useState(null);
  const [selectedTerminalId, setSelectedTerminalId] = useState(null);
  const [terminals, setTerminals] = useState([]);
  const [terminalsLoading, setTerminalsLoading] = useState(false);
  const [institutesByTerminal, setInstitutesByTerminal] = useState({});
  const [institutesLoadingByTerminal, setInstitutesLoadingByTerminal] = useState({});
  const [routesByInstitute, setRoutesByInstitute] = useState({});
  const [routesLoadingByInstitute, setRoutesLoadingByInstitute] = useState({});
  const [mapMarkers, setMapMarkers] = useState([]);
  const [mapCenter, setMapCenter] = useState(undefined);
  const [mapCardInfo, setMapCardInfo] = useState({});
  const [tripsByTerminal, setTripsByTerminal] = useState({});
  const [tripsLoadingByTerminal, setTripsLoadingByTerminal] = useState({});

  // Refetch trips when status filter (activeTab) changes and a terminal is expanded in Trip Schedules
  React.useEffect(() => {
    if (selectedTab !== "Trip Schedules" || isOpen == null || typeof isOpen !== "number") return;
    const terminal = terminals[isOpen];
    if (!terminal) return;
    const tid = terminal?.TerminalId ?? terminal?.terminalId ?? terminal?.id ?? null;
    if (!tid) return;
    const statusFilter = activeTab === "All" ? undefined : activeTab;
    let cancelled = false;
    setTripsLoadingByTerminal((prev) => ({ ...prev, [tid]: true }));
    routeSchedulingService.getTripsByTerminal(tid, statusFilter)
      .then((res) => {
        if (!cancelled) setTripsByTerminal((prev) => ({ ...prev, [tid]: res?.data || [] }));
      })
      .catch((err) => {
        if (!cancelled) {
          console.error("Failed to fetch trips:", err);
          setTripsByTerminal((prev) => ({ ...prev, [tid]: [] }));
        }
      })
      .finally(() => {
        if (!cancelled) setTripsLoadingByTerminal((prev) => ({ ...prev, [tid]: false }));
      });
    return () => { cancelled = true; };
  }, [activeTab, selectedTab, isOpen, terminals]);

  React.useEffect(() => {
    let isMounted = true;
    const fetchSchedulingTerminals = async () => {
      try {
        setTerminalsLoading(true);
        const response = await apiClient.get("/route-scheduling/terminals");
        const terminalList = Array.isArray(response?.data?.data)
          ? response.data.data
          : Array.isArray(response?.data)
          ? response.data
          : [];
        if (isMounted) setTerminals(terminalList);
      } catch (error) {
        console.error("Failed to fetch terminals:", error);
        if (isMounted) setTerminals([]);
      } finally {
        if (isMounted) setTerminalsLoading(false);
      }
    };
    fetchSchedulingTerminals();
    return () => {
      isMounted = false;
    };
  }, []);

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

  const handleEllipsisClick = (event, trip, terminalId) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setModalPosition({
      top: rect.top + window.scrollY + 30,
      left: rect.left + window.scrollX - 140,
    });
    setSelectedTripId(
      trip?.tripId ??
      trip?.id ??
      trip?.TripId ??
      trip?.Id ??
      trip?.tripID ??
      null
    );
    setSelectedTripData(trip || null);
    setSelectedTerminalId(terminalId ?? null);
    setIsModalOpen(true);
  };
  const hanldeEditModal = async () => {
    if (!selectedTripId) {
      setIsModalOpen(false);
      return;
    }

    // Open edit form immediately from row data so UX doesn't block on detail API.
    setIsCreateTrip(true);
    setIsEditable(true);
    setIsModalOpen(false);
  };
  const handleMapScreenClick = async (payload) => {
    // Supports:
    // 1) routeId (number|string) -> legacy behavior
    // 2) student row object -> show only that student's pickup/drop + best-route polyline
    setOpenMapScreen(true);
    const isDomEventPayload =
      payload &&
      typeof payload === "object" &&
      ("nativeEvent" in payload || ("target" in payload && "currentTarget" in payload));
    const routeContextPayload =
      payload &&
      typeof payload === "object" &&
      !isDomEventPayload &&
      (payload.routeId != null || payload.RouteId != null);
    const isStudentPayload =
      payload && typeof payload === "object" && !isDomEventPayload && !routeContextPayload;

    // Student-specific map: show ONLY this student's pickup/drop markers + directions polyline
    if (isStudentPayload) {
      setShowCard(true);
      const studentName = payload.studentName || payload.StudentName || "Student";
      const pickupLat = payload.pickupLat ?? payload.PickupLatitude ?? payload.PickupLat;
      const pickupLng = payload.pickupLng ?? payload.PickupLongitude ?? payload.PickupLng;
      const dropLat = payload.dropLat ?? payload.DropLatitude ?? payload.DropLat ?? payload.dropoffLat;
      const dropLng = payload.dropLng ?? payload.DropLongitude ?? payload.DropLng ?? payload.dropoffLng;

      const pickupOk = Number.isFinite(Number(pickupLat)) && Number.isFinite(Number(pickupLng));
      const dropOk = Number.isFinite(Number(dropLat)) && Number.isFinite(Number(dropLng));

      const markers = [];
      if (pickupOk) {
        markers.push({
          id: `student-pickup-${studentName}`,
          type: "pickup",
          stopRole: "start",
          order: 1,
          title: `${studentName} (Pickup)`,
          position: { lat: Number(pickupLat), lng: Number(pickupLng) },
        });
      }
      if (dropOk) {
        markers.push({
          id: `student-dropoff-${studentName}`,
          type: "dropoff",
          stopRole: "end",
          order: 2,
          title: `${studentName} (Dropoff)`,
          position: { lat: Number(dropLat), lng: Number(dropLng) },
        });
      }

      setMapMarkers(markers);
      setIsRouteMap(true); // enable directions polyline in MapComponent

      // ── Card info: student ka schedule, driver (contact), destination ──
      const pickupAddr  = payload.pickup  || payload.PickupAddress  || payload.pickupLocation  || "";
      const dropoffAddr = payload.dropoff || payload.DropoffAddress || payload.dropoffLocation || "";
      const driverName  = payload.driverName  || payload.DriverName  || "";
      const dateVal     = payload.date    || payload.Date    || "";
      const timeVal     = payload.pickupTime || payload.PickupTime || "";
      const scheduleStr = [dateVal, timeVal].filter(Boolean).join(" • ") || "";

      setMapCardInfo({
        cardTitle:          studentName,
        scheduleText:       scheduleStr || (pickupAddr ? `Pickup: ${pickupAddr}` : ""),
        contactText:        driverName || "Driver",
        destinationName:    dropoffAddr ? "Drop-off" : "",
        destinationAddress: dropoffAddr,
        destinationLatLng:  dropOk ? { lat: Number(dropLat), lng: Number(dropLng) } : null,
      });

      if (markers.length > 0) {
        const sum = markers.reduce(
          (acc, m) => ({ lat: acc.lat + m.position.lat, lng: acc.lng + m.position.lng }),
          { lat: 0, lng: 0 }
        );
        setMapCenter({ lat: sum.lat / markers.length, lng: sum.lng / markers.length });
      } else {
        setMapCenter(undefined);
      }

      return;
    }

    // Legacy: routeId-based (kept for compatibility)
    setShowCard(false);
    setMapCardInfo({ cardTitle: "Route", scheduleText: "", contactText: "", destinationName: "", destinationAddress: "" });
    const rawRouteId = routeContextPayload
      ? (payload.routeId ?? payload.RouteId)
      : payload;
    const routeIdNum = rawRouteId != null && rawRouteId !== "" ? Number(rawRouteId) : null;
    if (!routeIdNum || Number.isNaN(routeIdNum)) return;

    try {
      const response = await apiClient.get(`/route-scheduling/routes/${routeIdNum}/students`);
      const list = Array.isArray(response?.data?.data)
        ? response.data.data
        : Array.isArray(response?.data)
        ? response.data
        : [];

      const rows = Array.isArray(list) ? list : [];
      const rowsWithPickup = rows.filter((s) => {
        const pickupLat = s?.PickupLatitude ?? s?.pickupLatitude;
        const pickupLng = s?.PickupLongitude ?? s?.pickupLongitude;
        return Number.isFinite(Number(pickupLat)) && Number.isFinite(Number(pickupLng));
      });

      // Prefer AM assignments for "towards school drop-off" optimization.
      const amRows = rowsWithPickup.filter((s) =>
        String(s?.AssignmentType ?? s?.assignmentType ?? "").toUpperCase() === "AM"
      );
      const drivingRows = amRows.length > 0 ? amRows : rowsWithPickup;

      const pickupMarkers = drivingRows.map((s, idx) => {
        const studentId = s?.StudentId ?? s?.studentId ?? idx;
        const studentName = s?.StudentName ?? s?.studentName ?? `Student ${studentId}`;
        const pickupLat = s?.PickupLatitude ?? s?.pickupLatitude;
        const pickupLng = s?.PickupLongitude ?? s?.pickupLongitude;

        return {
          id: `route-${routeIdNum}-pickup-${studentId}-${idx}`,
          type: "pickup",
          stopRole: idx === 0 ? "start" : "mid",
          order: idx + 1,
          title: `${studentName} (Pickup)`,
          position: { lat: Number(pickupLat), lng: Number(pickupLng) },
        };
      });

      const dropCandidate =
        drivingRows.find((s) => {
          const dropLat = s?.DropLatitude ?? s?.dropLatitude ?? s?.DropoffLatitude ?? s?.dropoffLatitude;
          const dropLng = s?.DropLongitude ?? s?.dropLongitude ?? s?.DropoffLongitude ?? s?.dropoffLongitude;
          return Number.isFinite(Number(dropLat)) && Number.isFinite(Number(dropLng));
        }) || null;

      const destinationMarker = dropCandidate
        ? {
            id: `route-${routeIdNum}-destination-dropoff`,
            type: "dropoff",
            stopRole: "end",
            order: pickupMarkers.length + 1,
            title: "School (Drop-off)",
            position: {
              lat: Number(
                dropCandidate?.DropLatitude ??
                  dropCandidate?.dropLatitude ??
                  dropCandidate?.DropoffLatitude ??
                  dropCandidate?.dropoffLatitude
              ),
              lng: Number(
                dropCandidate?.DropLongitude ??
                  dropCandidate?.dropLongitude ??
                  dropCandidate?.DropoffLongitude ??
                  dropCandidate?.dropoffLongitude
              ),
            },
          }
        : null;

      const markers = destinationMarker ? [...pickupMarkers, destinationMarker] : pickupMarkers;

      setMapMarkers(markers);
      setIsRouteMap(true);
      const instituteName = routeContextPayload
        ? (payload.instituteName ?? payload.InstituteName ?? "")
        : "";
      const terminalName = routeContextPayload
        ? (payload.terminalName ?? payload.TerminalName ?? "")
        : "";
      const contextParts = [terminalName, instituteName].filter(Boolean);
      const destinationAddress =
        dropCandidate?.DropoffAddress ??
        dropCandidate?.dropoffAddress ??
        dropCandidate?.DropoffLocation ??
        dropCandidate?.dropoffLocation ??
        "";

      setMapCardInfo({
        cardTitle: `Route #${routeIdNum}`,
        scheduleText: `${drivingRows.length} stop${drivingRows.length === 1 ? "" : "s"}${contextParts.length ? ` • ${contextParts.join(" • ")}` : ""}`,
        contactText: "",
        destinationName: destinationAddress ? "Drop-off" : "",
        destinationAddress,
        destinationLatLng: destinationMarker ? destinationMarker.position : null,
      });

      if (markers.length > 0) {
        const sum = markers.reduce(
          (acc, m) => ({ lat: acc.lat + m.position.lat, lng: acc.lng + m.position.lng }),
          { lat: 0, lng: 0 }
        );
        setMapCenter({ lat: sum.lat / markers.length, lng: sum.lng / markers.length });
      } else {
        setMapCenter(undefined);
      }
    } catch (e) {
      console.error("Failed to load map students:", e);
      setMapMarkers([]);
      setMapCenter(undefined);
    }
  };

  const handleBackClick = () => {
    setOpenMapScreen(false);
    
    setIsEditRoute(false);
    setIsRouteMap(false);
  };
 
    const handleOpenRoute = () => {
        setIsCreateTrip(true)
        
    }

    const handleCancel = () => {
      setIsCreateTrip(false);
      setIsEditable(false);
      setSelectedTripId(null);
      setSelectedTripData(null);
    };


  const handleRouteMap = () => {
    setIsRouteMap(true);
    setOpenMapScreen(true);
  };
  const closeCard = () => {
    setShowCard(false);
  };

  const getTerminalId = (terminal) =>
    terminal?.TerminalId ?? terminal?.terminalId ?? terminal?.id ?? null;

  const handleTripSaved = () => {
    if (selectedTerminalId) {
      fetchTripsForTerminal(selectedTerminalId, activeTab);
    }
  };

  const fetchTripsForTerminal = async (terminalId, statusFilter) => {
    if (!terminalId) return;
    try {
      setTripsLoadingByTerminal((prev) => ({ ...prev, [terminalId]: true }));
      const res = await routeSchedulingService.getTripsByTerminal(
        terminalId,
        statusFilter === "All" || !statusFilter ? undefined : statusFilter
      );
      setTripsByTerminal((prev) => ({ ...prev, [terminalId]: res?.data || [] }));
    } catch (err) {
      console.error("Failed to fetch trips:", err);
      setTripsByTerminal((prev) => ({ ...prev, [terminalId]: [] }));
    } finally {
      setTripsLoadingByTerminal((prev) => ({ ...prev, [terminalId]: false }));
    }
  };

  const handleTerminalToggle = async (index, terminal) => {
    const nextOpen = index === isOpen ? null : index;
    setIsOpen(nextOpen);

    const terminalId = getTerminalId(terminal);

    if (selectedTab === "Trip Schedules" && nextOpen !== null && terminalId) {
      fetchTripsForTerminal(terminalId, activeTab);
      return;
    }

    if (nextOpen === null || selectedTab !== "School Routes") return;

    if (!terminalId || institutesByTerminal[terminalId]) return;

    try {
      setInstitutesLoadingByTerminal((prev) => ({ ...prev, [terminalId]: true }));
      const response = await apiClient.get(
        `/route-scheduling/terminals/${terminalId}/institutes`
      );
      const institutes = Array.isArray(response?.data?.data)
        ? response.data.data
        : Array.isArray(response?.data)
        ? response.data
        : [];
      setInstitutesByTerminal((prev) => ({ ...prev, [terminalId]: institutes }));

      // Prefetch routes for loaded institutes (per institute endpoint)
      institutes.forEach(async (inst) => {
        const instituteId =
          inst?.InstituteId ??
          inst?.instituteId ??
          inst?.InstituteID ??
          inst?.instituteID ??
          inst?.id ??
          null;
        if (!instituteId || routesByInstitute[instituteId]) return;

        try {
          setRoutesLoadingByInstitute((prev) => ({ ...prev, [instituteId]: true }));
          const routeRes = await apiClient.get(
            `/route-scheduling/institutes/${instituteId}/routes`
          );
          const routeList = Array.isArray(routeRes?.data?.data)
            ? routeRes.data.data
            : Array.isArray(routeRes?.data)
            ? routeRes.data
            : [];
          setRoutesByInstitute((prev) => ({ ...prev, [instituteId]: routeList }));
        } catch (error) {
          console.error("Failed to fetch routes by institute:", error);
          setRoutesByInstitute((prev) => ({ ...prev, [instituteId]: [] }));
        } finally {
          setRoutesLoadingByInstitute((prev) => ({ ...prev, [instituteId]: false }));
        }
      });
    } catch (error) {
      console.error("Failed to fetch institutes:", error);
      setInstitutesByTerminal((prev) => ({ ...prev, [terminalId]: [] }));
    } finally {
      setInstitutesLoadingByTerminal((prev) => ({ ...prev, [terminalId]: false }));
    }
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
          markers={mapMarkers}
          center={mapCenter}
          cardTitle={mapCardInfo.cardTitle}
          scheduleText={mapCardInfo.scheduleText}
          contactText={mapCardInfo.contactText}
          destinationName={mapCardInfo.destinationName}
          destinationAddress={mapCardInfo.destinationAddress}
          destinationLatLng={mapCardInfo.destinationLatLng}
        />
      ) : isCreateTrip  ? (
         <CreateTripForm
           handleCancel={handleCancel}
           mode={isEditable ? "edit" : "create"}
           initialData={selectedTripData}
           tripId={selectedTripId}
           onSaved={handleTripSaved}
         />
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
            {(terminals.length > 0 ? terminals : [...Array(4)].map((_, i) => ({ _placeholder: i }))).map((terminal, index) => (
              <div key={terminal?.TerminalId ?? terminal?.terminalId ?? terminal?._placeholder ?? index} className="w-full bg-white border-b border-gray-200 shadow-sm">
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
                      {terminal?.TerminalName || terminal?.terminalName || "Terminal 1"}
                    </h2>
                    <button
                      className="text-gray-600 hover:text-gray-800"
                      onClick={() => handleTerminalToggle(index, terminal)}
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
                      onClick={() => handleTerminalToggle(index, terminal)}
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
                    <>
                    <div className="w-full">
                      {(() => {
                        const tid = getTerminalId(terminal);
                        const trips = tripsByTerminal[tid] || [];
                        const tripsLoading = tripsLoadingByTerminal[tid];
                        const toRow = (t) => ({
                          id: t.id ?? t.TripId ?? t.tripId,
                          tripId: t.TripId ?? t.tripId ?? t.id ?? t.Id,
                          tripName: t.tripName ?? t.TripName ?? "",
                          flag: t.flag,
                          flagColor: t.flagColor ?? t.FlagColor ?? "",
                          tripNo: t.tripNo ?? t.TripNumber ?? t.tripNumber ?? t.TripNo ?? "-",
                          date: t.date ?? t.StartTime ?? t.startTime ? format(new Date(t.StartTime || t.startTime), "M/d/yy") : "-",
                          startTime: t.startTime ?? t.StartTime ? format(new Date(t.StartTime || t.startTime), "H:mm") : "-",
                          endTime: t.endTime ?? t.EndTime ? format(new Date(t.EndTime || t.endTime), "H:mm") : "-",
                          busNo: t.busNo ?? t.BusNumber ?? t.BusNo ?? "-",
                          driverName: t.driverName ?? t.DriverName ?? "-",
                          contactName: t.contactName ?? t.ContactName ?? t.Contact ?? "-",
                          pickup: t.pickup ?? t.PickupLocation ?? t.Pickup ?? "-",
                          pickupTime: t.pickupTime ?? t.PickupTime ?? "-",
                          dropoff: t.dropoff ?? t.DropoffLocation ?? t.Dropoff ?? "-",
                          dropoffTime: t.dropoffTime ?? t.DropoffTime ?? "-",
                          dropoffAddress: t.dropoffAddress ?? t.DropoffAddress ?? "",
                          glCode: t.glCode ?? t.GLCode ?? "-",
                          status: t.status ?? t.Status ?? "-",
                          numberOfPersons: t.numberOfPersons ?? t.NoOfPersons ?? t.NoOfPassengers ?? "-",
                        });
                        const rows = trips.map(toRow);
                        return tripsLoading ? (
                          <div className="p-8 text-center text-gray-500">Loading trips...</div>
                        ) : (
                    <>
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
                          {/* <button className="px-4 py-2 bg-[#C01824] text-white text-sm font-medium rounded-md hover:bg-red-700 transition-colors duration-200">
                            Assign
                          </button> */}
                        </div>
                      </div>

                      <div className="w-full p-4 overflow-hidden rounded-sm">
                        <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm bg-white">
                          <table className="min-w-[1900px] w-full border-collapse [&_th]:px-4 [&_th]:py-3 [&_th]:text-xs [&_th]:font-bold [&_th]:text-[#374151] [&_th]:border-b [&_th]:border-[#D9D9D9] [&_th]:whitespace-nowrap [&_td]:px-4 [&_td]:py-3 [&_td]:text-xs [&_td]:text-[#1F2937] [&_td]:align-top">
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
                                    className="text-left"
                                  >
                                    {header}
                                  </th>
                                ))}
                              </tr>
                            </thead>

                            <tbody>
                              {rows.length === 0 ? (
                                <tr>
                                  <td colSpan={18} className="px-6 py-10 text-center">
                                    <div className="flex flex-col items-center justify-center gap-2 text-gray-500">
                                      <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="26"
                                        height="26"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      >
                                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                        <line x1="16" y1="2" x2="16" y2="6"></line>
                                        <line x1="8" y1="2" x2="8" y2="6"></line>
                                        <line x1="3" y1="10" x2="21" y2="10"></line>
                                      </svg>
                                      <p className="text-sm font-medium">No trips found for this terminal.</p>
                                      <p className="text-xs">Try changing status filter or create a new trip.</p>
                                    </div>
                                  </td>
                                </tr>
                              ) : rows?.map((trip) => (
                                <tr
                                  key={trip.id}
                                  className="border-t border-gray-200 hover:bg-gray-50"
                                >
                                  <td className="text-center align-middle">
                                    {trip.flag ? (
                                      <img src={trip.flag} alt="flag" />
                                    ) : (
                                      <span
                                        className="w-4 h-3 inline-block rounded-sm border border-gray-200"
                                        style={{ backgroundColor: trip.flagColor || "#E5E7EB" }}
                                        title={trip.flagColor || "No flag color"}
                                      />
                                    )}
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
                                  <td>
                                    <div
                                      className={`w-[90px] text-center justify-center items-center flex h-[28px] rounded text-[11px] font-medium
                                      ${
                                        trip.status === "Approved"
                                          ? "bg-[#CCFAEB] text-[#0BA071]"
                                          : trip.status === "Pending"
                                          ? "bg-[#FEF3C7] text-[#D97706]"
                                          : trip.status === "Canceled"
                                          ? "bg-gray-200 text-gray-600"
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
                                    className="cursor-pointer text-center align-middle"
                                    onClick={handleMapScreenClick}
                                  >
                                    <img src={ViewMap} alt="view map" className="inline-block" />
                                  </td>
                                  <td className="px-6 py-4 text-sm text-[#141516]">
                                    {trip.numberOfPersons}
                                  </td>
                                  <td
                                    className="cursor-pointer text-center align-middle"
                                    onClick={(e) => handleEllipsisClick(e, trip, tid)}
                                  >
                                    <FaEllipsisVertical />
                                  </td>
                                </tr>
                              ))}
                            </tbody>

                          </table>
                        </div>
                      </div>

                      {rows.length > 0 && (
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
                      )}
                    </>
                        );
                      })()}
                    </div>
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
                    </>
                  ) : (
                    <div className="w-full bg-white border-t border-gray-200 shadow-sm">
                      <SchoolRouteTable
                        handleMapScreenClick={handleMapScreenClick}
                        institutes={institutesByTerminal[getTerminalId(terminal)] || []}
                        loading={institutesLoadingByTerminal[getTerminalId(terminal)] || false}
                        routesByInstitute={routesByInstitute}
                        routesLoadingByInstitute={routesLoadingByInstitute}
                        terminalName={terminal?.TerminalName || terminal?.terminalName || ""}
                      />
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
