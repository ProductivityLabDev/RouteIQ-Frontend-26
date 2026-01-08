import { burgerBar, calendar, leftArrow, rightArrow, routeTableIcon, ViewMap } from '@/assets';
import MapComponent from '@/components/MapComponent';
import VendorApprovedCard from '@/components/vendorRoutesCard/VendorApprovedCard';
import { tripsData } from '@/data';
import { busTrips } from '@/data/dummyData';
import MainLayout from '@/layouts/SchoolLayout';
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { Button, ButtonGroup, Input, Popover, PopoverContent, PopoverHandler, Typography, Spinner, Select, Option, Menu, MenuHandler, MenuList, MenuItem } from '@material-tailwind/react';
import { format } from "date-fns";
import React, { useEffect, useMemo, useState } from 'react';
import { DayPicker } from "react-day-picker";
import { FaArrowDown, FaArrowUp, FaPlus } from 'react-icons/fa';
import { FaEllipsisVertical } from "react-icons/fa6";
import { Toaster, toast } from "react-hot-toast";
import CreateRoute from './CreateRoute';
import SchoolList from './SchoolList';
import VendorGlobalModal from "@/components/Modals/VendorGlobalModal";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { createTerminal } from "@/redux/slices/busesSlice";
import { fetchRouteManagementTerminals, fetchRouteMap, fetchRouteStudents, fetchRouteMetrics, fetchRouteDetails } from "@/redux/slices/routesSlice";
import { fetchStates, fetchCities } from "@/redux/slices/employeSlices";

const RouteManagement = () => {
    // --- Mock Data for the Functional Map UI ---
    const mapMarkers = [
        { id: 'school-1', position: { lat: 44.9778, lng: -93.2650 }, title: "Terminal 1", type: 'school' },
        { id: 'bus-1', position: { lat: 44.9850, lng: -93.2750 }, title: "Bus 101", type: 'bus' },
        { id: 'bus-2', position: { lat: 44.9700, lng: -93.2500 }, title: "Bus 202", type: 'bus' },
    ];

    const mapRoutes = [
        {
            id: 'route-1',
            color: '#7B61FF', // The purple from your screenshot
            path: [
                { lat: 44.9778, lng: -93.2650 },
                { lat: 44.9800, lng: -93.2700 },
                { lat: 44.9850, lng: -93.2750 },
            ]
        }
    ];

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

    const dispatch = useAppDispatch();
    const { terminalsHierarchy, loading: routesLoading, mapView, studentsByRoute, metricsByRoute, detailsByRoute } = useAppSelector((state) => state.routes);
    const { states, cities, loading: employeeLoading } = useAppSelector((state) => state.employees);

    const [citySearch, setCitySearch] = useState("");

    const resetTerminalForm = () => {
        setTerminalForm(INITIAL_TERMINAL_FORM);
        setCitySearch("");
    };

    const handleCloseAddTerminalModal = () => {
        setIsAddTerminalModalOpen(false);
        resetTerminalForm();
    };

    // Load Route Management hierarchy: Terminal -> Institutes + States/Cities for dropdown
    useEffect(() => {
        dispatch(fetchRouteManagementTerminals());
        dispatch(fetchStates());
        dispatch(fetchCities()); // City list (we will render only top N + search)
    }, [dispatch]);

    const displayedTerminals = useMemo(() => {
        if (Array.isArray(terminalsHierarchy) && terminalsHierarchy.length > 0) return terminalsHierarchy;
        return [];
    }, [terminalsHierarchy]);

    const handleTerminalFormChange = (e) => {
        const { name, value } = e.target;
        setTerminalForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleCreateTerminalSubmit = async () => {
        console.log("🚀 Creating Terminal from Route Management:", terminalForm);
        try {
            // busService.createTerminal expects { name, code, address?, city?, state?, zipCode? }
            const payload = {
                name: String(terminalForm.name || "").trim(),
                code: String(terminalForm.code || "").trim(),
                address: terminalForm.address ? String(terminalForm.address).trim() : undefined,
                city: terminalForm.city ? String(terminalForm.city).trim() : undefined,
                state: terminalForm.state ? String(terminalForm.state).trim() : undefined,
                zipCode: terminalForm.zipCode ? String(terminalForm.zipCode).trim() : undefined,
            };

            if (!payload.name) {
                toast.error("Terminal Name is required");
                return;
            }
            if (!payload.code) {
                toast.error("Terminal Code is required");
                return;
            }

            const result = await dispatch(createTerminal(payload));
            if (createTerminal.fulfilled.match(result)) {
                toast.success("Terminal created successfully!");
                handleCloseAddTerminalModal();
                // refresh hierarchy so the new terminal appears in Route Management list
                dispatch(fetchRouteManagementTerminals());
            } else {
                const errorMessage = result.payload || "Failed to create terminal";
                toast.error(String(errorMessage));
            }
        } catch (err) {
            console.error("Error creating terminal:", err);
            toast.error("Failed to create terminal");
        }
    };

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
    const resolveRouteId = (route) =>
        route?.routeId ??
        route?.RouteId ??
        route?.routeID ??
        route?.routeid ??
        route?.id ??
        route?.ID;

    const handleMapScreenClick = (route) => {
        // If called from a bare button (event object), just open the map with fallback markers.
        if (route && route.nativeEvent) {
            setIsRouteMap(false);
            setShowCard(true);
            setOpenMapScreen(true);
            return;
        }

        const resolvedId = resolveRouteId(route);
        if (resolvedId) {
            setShowCard(true);
            dispatch(fetchRouteMap({ routeId: resolvedId, type: "AM" }));
            // Load students (with lat/lng) for map points, but avoid refetch if cached
            const already = Array.isArray(studentsByRoute?.[resolvedId]) && studentsByRoute[resolvedId].length > 0;
            const isLoading = routesLoading?.routeStudents?.[resolvedId];
            if (!already && !isLoading) {
                dispatch(fetchRouteStudents({ routeId: resolvedId, type: "AM" }));
            }

            // Compute metrics once per route (cache)
            const hasMetrics = Boolean(metricsByRoute?.[resolvedId]?.distanceKm);
            const metricsLoading = routesLoading?.routeMetrics?.[resolvedId];
            if (!hasMetrics && !metricsLoading) {
                dispatch(fetchRouteMetrics(resolvedId));
            }

            // Fetch route details for the bus card (cache)
            const hasDetails = Boolean(detailsByRoute?.[resolvedId] && Object.keys(detailsByRoute[resolvedId]).length > 0);
            const detailsLoading = routesLoading?.routeDetails?.[resolvedId];
            if (!hasDetails && !detailsLoading) {
                dispatch(fetchRouteDetails(resolvedId));
            }
            setIsRouteMap(true);
        } else {
            console.warn("⚠️ Route ID not found for map call", route);
        }
        setOpenMapScreen(true);
    };

    const handleBackClick = () => {
        setOpenMapScreen(false);
        setIsCreateRoute(false)
        setIsEditRoute(false)
        setIsRouteMap(false)
        setShowCard(true)
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

    const mapData = useMemo(() => {
        const payload = mapView?.data || {};
        const stops = payload.stops || payload.data?.stops || [];
        // For student markers we prefer route students endpoint (has lat/lng)
        const selectedRouteId = mapView?.routeId;
        const students =
            (selectedRouteId ? studentsByRoute?.[selectedRouteId] : null) ||
            payload.students ||
            payload.data?.students ||
            [];

        const normalizedStops = stops
            .map((stop, idx) => {
                const lat =
                    stop.stopLatitude ??
                    stop.StopLatitude ??
                    stop.latitude ??
                    stop.lat;
                const lng =
                    stop.stopLongitude ??
                    stop.StopLongitude ??
                    stop.longitude ??
                    stop.lng;
                if (lat === undefined || lng === undefined) return null;
                return {
                    id: stop.stopId || stop.StopId || `stop-${idx}`,
                    order: stop.stopOrder ?? stop.StopOrder ?? idx + 1,
                    position: { lat: Number(lat), lng: Number(lng) },
                    title: stop.stopName || stop.StopName || `Stop ${stop.stopOrder ?? stop.StopOrder ?? idx + 1}`,
                };
            })
            .filter(Boolean)
            .sort((a, b) => (a.order || 0) - (b.order || 0));

        const stopMarkers = normalizedStops.map((s) => ({
            id: s.id,
            position: s.position,
            title: s.title,
            type: "stop",
            order: s.order,
            stopRole:
                s.order === normalizedStops[0]?.order
                    ? "start"
                    : s.order === normalizedStops[normalizedStops.length - 1]?.order
                    ? "end"
                    : "mid",
            details: {
                address:
                    (stops || []).find((x) => (x.stopId ?? x.StopId) === s.id)?.stopAddress ||
                    (stops || []).find((x) => (x.stopId ?? x.StopId) === s.id)?.StopAddress,
            },
        }));

        const path = normalizedStops.map((s) => s.position);

        const studentMarkers = (Array.isArray(students) ? students : [])
            .map((stu, idx) => {
                const lat =
                    stu.studentLatitude ??
                    stu.StudentLatitude ??
                    stu.latitude ??
                    stu.Latitude ??
                    stu.lat;
                const lng =
                    stu.studentLongitude ??
                    stu.StudentLongitude ??
                    stu.longitude ??
                    stu.Longitude ??
                    stu.lng;
                if (lat === undefined || lng === undefined) return null;
                return {
                    id: stu.studentId || stu.StudentId || `student-${idx}`,
                    position: { lat: Number(lat), lng: Number(lng) },
                    title: stu.studentName || stu.StudentName || `Student ${idx + 1}`,
                    type: "student",
                };
            })
            .filter(Boolean);

        const markers = [...stopMarkers, ...studentMarkers];
        // Match the original static-map "mauve/burgundy" route line color
        const routes = path.length > 0 ? [{ id: "route-path", color: "#8B6B73", path, stops: stopMarkers }] : [];

        // Compute center (avg of all markers) if available
        let center = null;
        if (markers.length > 0) {
            const sum = markers.reduce(
                (acc, m) => ({
                    lat: acc.lat + m.position.lat,
                    lng: acc.lng + m.position.lng,
                }),
                { lat: 0, lng: 0 }
            );
            center = {
                lat: sum.lat / markers.length,
                lng: sum.lng / markers.length,
            };
        }

        return {
            markers,
            routes,
            center,
        };
    }, [mapView]);

    const effectiveMarkers = mapData.markers && mapData.markers.length > 0 ? mapData.markers : mapMarkers;
    const effectiveRoutes = mapData.routes && mapData.routes.length > 0 ? mapData.routes : mapRoutes;
    const effectiveCenter = mapData.center || (mapMarkers[0] ? mapMarkers[0].position : undefined);

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

    const scheduleStart = pickFirst(
        details.scheduleStartTime,
        details.ScheduleStartTime,
        details.startTime,
        details.StartTime,
        details.routeStartTime,
        details.RouteStartTime
    );
    const scheduleEnd = pickFirst(
        details.scheduleEndTime,
        details.ScheduleEndTime,
        details.endTime,
        details.EndTime,
        details.routeEndTime,
        details.RouteEndTime
    );

    // Some backends return schedule as array/object
    const scheduleObj = Array.isArray(details.schedule)
        ? details.schedule[0]
        : details.schedule || details.Schedule || null;
    const scheduleStart2 = scheduleObj
        ? pickFirst(scheduleObj.startTime, scheduleObj.StartTime, scheduleObj.scheduleStartTime, scheduleObj.ScheduleStartTime)
        : null;
    const scheduleEnd2 = scheduleObj
        ? pickFirst(scheduleObj.endTime, scheduleObj.EndTime, scheduleObj.scheduleEndTime, scheduleObj.ScheduleEndTime)
        : null;

    // Vendor schedule response uses pickupTime/dropoffTime
    const schedulePickup = scheduleObj
        ? pickFirst(scheduleObj.pickupTime, scheduleObj.PickupTime)
        : null;
    const scheduleDropoff = scheduleObj
        ? pickFirst(scheduleObj.dropoffTime, scheduleObj.DropoffTime)
        : null;

    const finalScheduleStart = scheduleStart || scheduleStart2;
    const finalScheduleEnd = scheduleEnd || scheduleEnd2;
    const finalPickup = schedulePickup ? hhmm(schedulePickup) : null;
    const finalDropoff = scheduleDropoff ? hhmm(scheduleDropoff) : null;

    const driverName = pickFirst(details.driverName, details.DriverName, details.driverFullName, details.DriverFullName);
    const driverPhone = pickFirst(
        details.driverPhone,
        details.DriverPhone,
        details.phone,
        details.Phone,
        details.mobile,
        details.Mobile,
        details.driverMobile,
        details.DriverMobile
    );

    const lastStop = (mapView?.data?.stops || [])[((mapView?.data?.stops || []).length || 1) - 1];
    const destinationName = lastStop?.stopName || lastStop?.StopName;
    const destinationAddress = lastStop?.stopAddress || lastStop?.StopAddress;
    const destinationLat = lastStop?.latitude ?? lastStop?.Latitude ?? lastStop?.stopLatitude ?? lastStop?.StopLatitude;
    const destinationLng = lastStop?.longitude ?? lastStop?.Longitude ?? lastStop?.stopLongitude ?? lastStop?.StopLongitude;
    const destinationLatLng =
        destinationLat !== undefined && destinationLng !== undefined
            ? { lat: Number(destinationLat), lng: Number(destinationLng) }
            : null;
    return (
        <MainLayout>
            <Toaster
                position="top-right"
                reverseOrder={false}
                toastOptions={{
                    duration: 3000,
                }}
            />
            {openMapScreen ? (
                mapView?.loading ? (
                    <div className="flex flex-col items-center justify-center h-full py-12">
                        <Spinner className="h-10 w-10 text-[#C01824]" />
                        <Typography className="mt-3 text-gray-600 font-medium">Loading map data...</Typography>
                    </div>
                ) : (
                    <MapComponent 
                        key={mapView?.routeId || "route-map"}
                        onBack={handleBackClick} 
                        isRouteMap={isRouteMap} 
                        closeCard={closeCard} 
                        showCard={showCard}
                        markers={effectiveMarkers}
                        routes={effectiveRoutes}
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
                            finalPickup || finalDropoff
                                ? `${finalPickup || "—"} - ${finalDropoff || "—"}`
                                : finalScheduleStart || finalScheduleEnd
                                ? `${finalScheduleStart || "—"} - ${finalScheduleEnd || "—"}`
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
                <CreateRoute onBack={handleBackClick} editRoute={isEditRoute} isEditable={isEditable} handleBackTrip={handleBackTrip} />
            ) :
                <section className='w-full h-full'>
                    <div className="flex w-[100%] justify-between flex-row h-[65px] mb-3 items-center">
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
                            :
                            <div className="flex gap-4">
                                <Button
                                    className='bg-[#C01824] md:!px-10 !py-3 capitalize text-sm md:text-[16px] font-normal flex items-center gap-2'
                                    variant='filled'
                                    size='lg'
                                    onClick={() => {
                                        resetTerminalForm();
                                        setIsAddTerminalModalOpen(true);
                                    }}
                                >
                                    <FaPlus size={16} />
                                    Add Terminal
                                </Button>
                                <Button className='bg-[#C01824] md:!px-10 !py-3 capitalize text-sm md:text-[16px] font-normal flex items-center'
                                    variant='filled' size='lg' onClick={handleOpenRoute}>
                                    <span>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                        </svg>
                                    </span>
                                    Create Route
                                </Button>
                            </div>
                        }
                    </div>
                    
                    <div className="w-full space-y-4">
                        {routesLoading?.terminalsHierarchy && displayedTerminals.length === 0 ? (
                            <div className="bg-white border border-gray-200 rounded-lg p-4 text-gray-600">
                                Loading terminals...
                            </div>
                        ) : displayedTerminals.length > 0 ? (
                            displayedTerminals.map((terminal, index) => (
                            <div key={terminal.terminalId || `terminal-${index}`} className="w-full bg-white border-b border-gray-200 shadow-sm">
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
                                        <button className="text-gray-600 hover:text-gray-800"  onClick={() => setIsOpen(index === isOpen ? null : index)}>
                                           <svg width="20" height="24" viewBox="0 0 20 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                           <path d="M3.27702 20.6328C3.01105 20.6328 2.78653 20.5278 2.60348 20.318C2.42056 20.1079 2.3291 19.8503 2.3291 19.5451V17.1006C2.3291 16.8114 2.3766 16.535 2.4716 16.2714C2.56646 16.0079 2.70195 15.7753 2.87806 15.5733L13.3191 3.61121C13.4924 3.42443 13.6848 3.28132 13.8962 3.18188C14.1074 3.08244 14.3292 3.03271 14.5614 3.03271C14.7903 3.03271 15.0139 3.08244 15.2322 3.18188C15.4504 3.28132 15.6426 3.43049 15.8087 3.62938L17.1687 5.19657C17.342 5.38334 17.4694 5.60295 17.5508 5.85538C17.6322 6.10765 17.6729 6.36096 17.6729 6.61531C17.6729 6.88177 17.6322 7.13715 17.5508 7.38145C17.4694 7.62592 17.342 7.8476 17.1687 8.04648L6.74848 20.0029C6.5725 20.205 6.36966 20.3604 6.13994 20.4693C5.91035 20.5783 5.66952 20.6328 5.41744 20.6328H3.27702ZM14.5556 7.94823L15.7222 6.61531L14.5506 5.26517L13.3789 6.60384L14.5556 7.94823Z" fill="#1C1B1F"/>
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
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
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
                                                                        onClick={() => handleSort("tripNo")}
                                                                    >
                                                                        <div className="flex items-center">
                                                                            Current Trip
                                                                            <FaArrowUp size={13} className="ml-1" />
                                                                            <FaArrowDown size={13} className="ml-1" />
                                                                        </div>
                                                                    </th>

                                                                    <th
                                                                        className="px-4 py-3 text-left text-sm font-medium text-gray-800 cursor-pointer"
                                                                        onClick={() => handleSort("tripNo")}
                                                                    >
                                                                        <div className="flex items-center">
                                                                            Company/Group Name
                                                                            <FaArrowUp size={13} className="ml-1" />
                                                                            <FaArrowDown size={13} className="ml-1" />
                                                                        </div>
                                                                    </th>
                                                                     <th
                                                                        className="px-4 py-3 text-left text-sm font-medium text-gray-800 cursor-pointer"
                                                                        onClick={() => handleSort("tripNo")}
                                                                    >
                                                                        <div className="flex items-center">
                                                                            Phone Number
                                                                            <FaArrowUp size={13} className="ml-1" />
                                                                            <FaArrowDown size={13} className="ml-1" />
                                                                        </div>
                                                                    </th>
                                                                     <th
                                                                        className="px-4 py-3 text-left text-sm font-medium text-gray-800 cursor-pointer"
                                                                        onClick={() => handleSort("tripNo")}
                                                                    >
                                                                        <div className="flex items-center">
                                                                            Email Adress
                                                                            <FaArrowUp size={13} className="ml-1" />
                                                                            <FaArrowDown size={13} className="ml-1" />
                                                                        </div>
                                                                    </th>
                                                                    <th
                                                                        className="px-4 py-3 text-left text-sm font-medium text-gray-800 cursor-pointer"
                                                                        onClick={() => handleSort("tripNo")}
                                                                    >
                                                                        <div className="flex items-center">
                                                                            Round Trip
                                                                            <FaArrowUp size={13} className="ml-1" />
                                                                            <FaArrowDown size={13} className="ml-1" />
                                                                        </div>
                                                                    </th>
                                                                    

                                                                     <th
                                                                        className="px-4 py-3 text-left text-sm font-medium text-gray-800 cursor-pointer"
                                                                        onClick={() => handleSort("tripNo")}
                                                                    >
                                                                        <div className="flex items-center">
                                                                            Is a Wheelchair Lift Required
                                                                            <FaArrowUp size={13} className="ml-1" />
                                                                            <FaArrowDown size={13} className="ml-1" />
                                                                        </div>
                                                                    </th>
                                                                     <th
                                                                        className="px-4 py-3 text-left text-sm font-medium text-gray-800 cursor-pointer"
                                                                        onClick={() => handleSort("tripNo")}
                                                                    >
                                                                        <div className="flex items-center">
                                                                            Bus Type
                                                                            <FaArrowUp size={13} className="ml-1" />
                                                                            <FaArrowDown size={13} className="ml-1" />
                                                                        </div>
                                                                    </th>

                                                                     <th
                                                                        className="px-4 py-3 text-left text-sm font-medium text-gray-800 cursor-pointer"
                                                                        onClick={() => handleSort("tripNo")}
                                                                    >
                                                                        <div className="flex items-center">
                                                                            Return Date
                                                                            <FaArrowUp size={13} className="ml-1" />
                                                                            <FaArrowDown size={13} className="ml-1" />
                                                                        </div>
                                                                    </th>
                                                                    <th
                                                                        className="px-4 py-3 text-left text-sm font-medium text-gray-800 cursor-pointer"
                                                                        onClick={() => handleSort("tripNo")}
                                                                    >
                                                                        <div className="flex items-center">
                                                                            Return Time
                                                                            <FaArrowUp size={13} className="ml-1" />
                                                                            <FaArrowDown size={13} className="ml-1" />
                                                                        </div>
                                                                    </th>

                                                                    <th
                                                                        className="px-4 py-3 text-left text-sm font-medium text-gray-800 cursor-pointer"
                                                                        onClick={() => handleSort("tripNo")}
                                                                    >
                                                                        <div className="flex items-center">
                                                                            Type Of Group
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
                                                                            Pickup Date
                                                                            <FaArrowUp size={13} className="ml-1" />
                                                                            <FaArrowDown size={13} className="ml-1" />
                                                                        </div>
                                                                    </th>
                                                                    <th
                                                                        className="px-4 py-3 text-left text-sm font-medium text-gray-800 cursor-pointer"
                                                                        onClick={() => handleSort("time")}
                                                                    >
                                                                        <div className="flex items-center">
                                                                            Pickup Time
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
                                                                            Pickup Address
                                                                            <FaArrowUp size={13} className="ml-1" />
                                                                            <FaArrowDown size={13} className="ml-1" />
                                                                        </div>
                                                                    </th>
                                                                    <th
                                                                        className="px-4 py-3 text-left text-sm font-medium text-gray-800 cursor-pointer"
                                                                        onClick={() => handleSort("pickup")}
                                                                    >
                                                                        <div className="flex items-center">
                                                                            Pickup City
                                                                            <FaArrowUp size={13} className="ml-1" />
                                                                            <FaArrowDown size={13} className="ml-1" />
                                                                        </div>
                                                                    </th>

                                                                     <th
                                                                        className="px-4 py-3 text-left text-sm font-medium text-gray-800 cursor-pointer"
                                                                        onClick={() => handleSort("pickup")}
                                                                    >
                                                                        <div className="flex items-center">
                                                                            Pickup State
                                                                            <FaArrowUp size={13} className="ml-1" />
                                                                            <FaArrowDown size={13} className="ml-1" />
                                                                        </div>
                                                                    </th>

                                                                     <th
                                                                        className="px-4 py-3 text-left text-sm font-medium text-gray-800 cursor-pointer"
                                                                        onClick={() => handleSort("pickup")}
                                                                    >
                                                                        <div className="flex items-center">
                                                                            Pickup Zip
                                                                            <FaArrowUp size={13} className="ml-1" />
                                                                            <FaArrowDown size={13} className="ml-1" />
                                                                        </div>
                                                                    </th>

                                                                     <th
                                                                        className="px-4 py-3 text-left text-sm font-medium text-gray-800 cursor-pointer"
                                                                        onClick={() => handleSort("pickup")}
                                                                    >
                                                                        <div className="flex items-center">
                                                                            Additional Destination
                                                                            <FaArrowUp size={13} className="ml-1" />
                                                                            <FaArrowDown size={13} className="ml-1" />
                                                                        </div>
                                                                    </th>

                                                                     <th
                                                                        className="px-4 py-3 text-left text-sm font-medium text-gray-800 cursor-pointer"
                                                                        onClick={() => handleSort("pickup")}
                                                                    >
                                                                        <div className="flex items-center">
                                                                            Destination Address
                                                                            <FaArrowUp size={13} className="ml-1" />
                                                                            <FaArrowDown size={13} className="ml-1" />
                                                                        </div>
                                                                    </th>

                                                                     <th
                                                                        className="px-4 py-3 text-left text-sm font-medium text-gray-800 cursor-pointer"
                                                                        onClick={() => handleSort("pickup")}
                                                                    >
                                                                        <div className="flex items-center">
                                                                            Destination City
                                                                            <FaArrowUp size={13} className="ml-1" />
                                                                            <FaArrowDown size={13} className="ml-1" />
                                                                        </div>
                                                                    </th>

                                                                     <th
                                                                        className="px-4 py-3 text-left text-sm font-medium text-gray-800 cursor-pointer"
                                                                        onClick={() => handleSort("pickup")}
                                                                    >
                                                                        <div className="flex items-center">
                                                                            Destination State
                                                                            <FaArrowUp size={13} className="ml-1" />
                                                                            <FaArrowDown size={13} className="ml-1" />
                                                                        </div>
                                                                    </th>

                                                                     <th
                                                                        className="px-4 py-3 text-left text-sm font-medium text-gray-800 cursor-pointer"
                                                                        onClick={() => handleSort("pickup")}
                                                                    >
                                                                        <div className="flex items-center">
                                                                            Destination Zip
                                                                            <FaArrowUp size={13} className="ml-1" />
                                                                            <FaArrowDown size={13} className="ml-1" />
                                                                        </div>
                                                                    </th>

                                                                     <th
                                                                        className="px-4 py-3 text-left text-sm font-medium text-gray-800 cursor-pointer"
                                                                        onClick={() => handleSort("pickup")}
                                                                    >
                                                                        <div className="flex items-center">
                                                                            How Were You Referred To Us
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
                                                                        <td className="px-4 py-3.5 text-sm text-gray-800">{trip.currenttrip}</td>
                                                                        <td className="px-4 py-3.5 text-sm text-gray-800">{trip.companyname}</td>
                                                                         <td className="px-4 py-3.5 text-sm text-gray-800">{trip.phonenuber}</td>
                                                                          <td className="px-4 py-3.5 text-sm text-gray-800">{trip.email}</td>
                                                                           <td className="px-4 py-3.5 text-sm text-gray-800">{trip.roundtrip}</td>
                                                                           <td className="px-4 py-3.5 text-sm text-gray-800">{trip.iswheelchairliftrequired}</td>
                                                                           <td className="px-4 py-3.5 text-sm text-gray-800">{trip.bustype}</td>
                                                                           <td className="px-4 py-3.5 text-sm text-gray-800">{trip.returndate}</td>
                                                                           <td className="px-4 py-3.5 text-sm text-gray-800">{trip.returntime}</td>
                                                                           <td className="px-4 py-3.5 text-sm text-gray-800">{trip.typeofgroup}</td>



                                                                        
                                                                        <td className="px-4 py-3.5 text-sm text-gray-800 whitespace-pre-line">
                                                                            {formatTextWithLineBreaks(trip.busNo)} 
                                                                        </td>
                                                                        <td className="px-4 py-3.5 text-sm text-gray-800">{trip.date}</td>
                                                                        <td className="px-4 py-3.5 text-sm text-gray-800">{trip.time}</td>
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
                                                                            {trip.pickupcity}
                                                                        </td>

                                                                        <td className="px-4 py-3.5 text-sm text-gray-800 whitespace-pre-line relative">
                                                                            {trip.pickupstate}
                                                                        </td>

                                                                        <td className="px-4 py-3.5 text-sm text-gray-800 whitespace-pre-line relative">
                                                                            {trip.pickupzip}
                                                                        </td>

                                                                         <td className="px-4 py-3.5 text-sm text-gray-800 whitespace-pre-line relative">
                                                                            {trip.additionaldestination}
                                                                        </td>
                                                                        <td className="px-4 py-3.5 text-sm text-gray-800 whitespace-pre-line relative">
                                                                            {trip.destinationaddress}
                                                                        </td>
                                                                        <td className="px-4 py-3.5 text-sm text-gray-800 whitespace-pre-line relative">
                                                                            {trip.destinationcity}
                                                                        </td>
                                                                        <td className="px-4 py-3.5 text-sm text-gray-800 whitespace-pre-line relative">
                                                                            {trip.destinationstate}
                                                                        </td>
                                                                        <td className="px-4 py-3.5 text-sm text-gray-800 whitespace-pre-line relative">
                                                                            {trip.destinationzip}
                                                                        </td>
                                                                        <td className="px-4 py-3.5 text-sm text-gray-800 whitespace-pre-line relative">
                                                                            {trip.howwereyoureferredtous}
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
                                                                        <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer">Send Message</li>
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
                                            <SchoolList
                                                institutes={terminal.institutes || []}
                                                handleMapScreenClick={handleMapScreenClick}
                                                handleEditRoute={handleEditRoute}
                                            />
                                        </div>


                                )}
                            </div>
                        ))
                        ) : (
                            <div className="bg-white border border-gray-200 rounded-lg p-4 text-gray-600">
                                No terminals found for this vendor.
                            </div>
                        )}
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
            {/* TripPlannerModal ya CreateAnnouncementModal yahan aa sakte hain */}
            
            {/* 🚀 Naya Terminal Creation Modal */}
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
                            labelProps={{
                                className: "before:content-none after:content-none",
                            }}
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
                            labelProps={{
                                className: "before:content-none after:content-none",
                            }}
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
                            labelProps={{
                                className: "before:content-none after:content-none",
                            }}
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
                                            labelProps={{
                                                className: "before:content-none after:content-none",
                                            }}
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
                                            labelProps={{
                                                className: "before:content-none after:content-none",
                                            }}
                                            crossOrigin={undefined}
                                        />
                                    </div>
                                    <div className="max-h-64 overflow-y-auto">
                                        {(employeeLoading?.cities) ? (
                                            <MenuItem disabled>Loading cities...</MenuItem>
                                        ) : (() => {
                                            const all = Array.isArray(cities) ? cities : [];
                                            const term = citySearch.toLowerCase();
                                            const filtered = all
                                                .filter((c) => {
                                                    const name = (c.CityName || c.cityName || c.name || "").toLowerCase();
                                                    return term ? name.includes(term) : true;
                                                })
                                                .slice(0, 100); // limit render to top 100
                                            if (filtered.length === 0) {
                                                return <MenuItem disabled>No matches</MenuItem>;
                                            }
                                            return filtered.map((city) => {
                                                const name = city.CityName || city.cityName || city.name || "Unknown";
                                                return (
                                                    <MenuItem
                                                        key={city.CityId || city.cityId || city.id || name}
                                                        onClick={() => {
                                                            setTerminalForm((prev) => ({ ...prev, city: name }));
                                                        }}
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
                                labelProps={{
                                    className: "before:content-none after:content-none",
                                }}
                            />
                        </div>
                    </div>
                </div>
            </VendorGlobalModal>
        </MainLayout >
    )
}

export default RouteManagement
