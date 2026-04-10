import React, { useEffect, useMemo, useRef, useState } from "react";
import MainLayout from "@/layouts/SchoolLayout";
import MapComponent from "@/components/MapComponent";
import VendorApprovedCard from "@/components/vendorRoutesCard/VendorApprovedCard";
import SchoolList from "./SchoolList";
import CreateRoute from "./CreateRoute";
import VendorGlobalModal from "@/components/Modals/VendorGlobalModal";
import { Autocomplete, useJsApiLoader } from "@react-google-maps/api";

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
import { HiOutlineLocationMarker } from "react-icons/hi";
import { Toaster, toast } from "react-hot-toast";

import {
  burgerBar,
  calendar,
  leftArrow,
  rightArrow,
  routeTableIcon,
  ViewMap,
} from "@/assets";

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
import { routeSchedulingService } from "@/services/routeSchedulingService";

const INITIAL_TERMINAL_FORM = {
  name: "",
  code: "",
  address: "",
  city: "",
  state: "",
  zipCode: "",
};

const GOOGLE_LIBRARIES = ["places"];

const normalizeTripRecord = (trip) => ({
  ...trip,
  id: trip?.id ?? trip?.TripId,
  tripId: trip?.tripId ?? trip?.TripId,
  tripName: trip?.tripName ?? trip?.TripName ?? "--",
  tripNumber: trip?.tripNumber ?? trip?.TripNumber ?? trip?.TripNo ?? "--",
  startTime: trip?.startTime ?? trip?.StartTime ?? null,
  endTime: trip?.endTime ?? trip?.EndTime ?? null,
  pickup: trip?.pickup ?? trip?.PickupLocation ?? trip?.PickUp ?? "--",
  pickupAddress: trip?.pickupAddress ?? trip?.PickupAddress ?? "",
  dropoff: trip?.dropoff ?? trip?.DropoffLocation ?? trip?.Dropoff ?? "--",
  dropoffAddress: trip?.dropoffAddress ?? trip?.DropoffAddress ?? "",
  noOfPersons: trip?.noOfPersons ?? trip?.NoOfPersons ?? trip?.NoOfPassengers ?? "--",
  status: trip?.status ?? trip?.Status ?? "--",
  busNumber: trip?.busNumber ?? trip?.BusNumber ?? trip?.BusNo ?? "--",
  driverName: trip?.driverName ?? trip?.DriverName ?? "--",
  contactName: trip?.contactName ?? trip?.ContactName ?? trip?.Contact ?? "",
  flagColor: trip?.flagColor ?? trip?.FlagColor ?? "",
});

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
  const [selectedEditableRoute, setSelectedEditableRoute] = useState(null);

  // ✅ This decides whether MapComponent should call Directions (Uber style)
  const [isRouteMap, setIsRouteMap] = useState(false);

  const [showCard, setShowCard] = useState(true);

  const [humburgerBar, setHamburgerBar] = useState(false);

  const [modalPosition, setModalPosition] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isOpen, setIsOpen] = useState(null);
  const [tripsByTerminal, setTripsByTerminal] = useState({});
  const [tripsLoadingByTerminal, setTripsLoadingByTerminal] = useState({});

  // Add terminal modal
  const [isAddTerminalModalOpen, setIsAddTerminalModalOpen] = useState(false);
  const [terminalForm, setTerminalForm] = useState(INITIAL_TERMINAL_FORM);
  const [terminalErrors, setTerminalErrors] = useState({});
  const [citySearch, setCitySearch] = useState("");
  const [terminalAddressAutocomplete, setTerminalAddressAutocomplete] = useState(null);
  const [isFetchingTerminalLocation, setIsFetchingTerminalLocation] = useState(false);
  const terminalAddressInputRef = useRef(null);

  const { isLoaded: isGooglePlacesLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "",
    libraries: GOOGLE_LIBRARIES,
  });

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
    setTerminalErrors({});
    setCitySearch("");
  };

  const handleCloseAddTerminalModal = () => {
    setIsAddTerminalModalOpen(false);
    resetTerminalForm();
  };

  const handleTerminalFormChange = (e) => {
    const { name, value } = e.target;
    setTerminalForm((prev) => ({ ...prev, [name]: value }));
    if (terminalErrors[name]) setTerminalErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const applyAddressComponentsToTerminalForm = (formattedAddress, addressComponents = []) => {
    const componentMap = addressComponents.reduce((acc, component) => {
      component.types.forEach((type) => {
        acc[type] = component;
      });
      return acc;
    }, {});

    const city =
      componentMap.locality?.long_name ||
      componentMap.sublocality?.long_name ||
      componentMap.administrative_area_level_2?.long_name ||
      "";
    const stateName = componentMap.administrative_area_level_1?.long_name || "";
    const zipCode = componentMap.postal_code?.long_name || "";
    const matchedState = (Array.isArray(states) ? states : []).find((state) => {
      const name = state.StateName || state.stateName || state.name || "";
      return name.toLowerCase() === stateName.toLowerCase();
    });
    const stateValue = matchedState
      ? String(matchedState.StateId || matchedState.stateId || matchedState.id || "")
      : "";

    setTerminalForm((prev) => ({
      ...prev,
      address: formattedAddress || prev.address,
      city: city || prev.city,
      state: stateValue || prev.state,
      zipCode: zipCode || prev.zipCode,
    }));
  };

  const handleTerminalAddressPlaceChanged = () => {
    const place = terminalAddressAutocomplete?.getPlace?.();
    if (!place) return;

    applyAddressComponentsToTerminalForm(
      place.formatted_address || place.name || "",
      place.address_components || []
    );
  };

  const handleUseCurrentTerminalLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Location access is not supported in this browser");
      return;
    }

    if (!window.google?.maps?.Geocoder) {
      toast.error("Google location services are not ready yet");
      return;
    }

    setIsFetchingTerminalLocation(true);

    navigator.geolocation.getCurrentPosition(
      async ({ coords }) => {
        try {
          const geocoder = new window.google.maps.Geocoder();
          const response = await geocoder.geocode({
            location: { lat: coords.latitude, lng: coords.longitude },
          });

          const result = response.results?.[0];
          if (!result) {
            toast.error("Unable to fetch address for current location");
            return;
          }

          applyAddressComponentsToTerminalForm(
            result.formatted_address || "",
            result.address_components || []
          );
          toast.success("Current location fetched");
        } catch (error) {
          toast.error("Failed to fetch current location");
        } finally {
          setIsFetchingTerminalLocation(false);
        }
      },
      () => {
        setIsFetchingTerminalLocation(false);
        toast.error("Location permission denied");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const handleCreateTerminalSubmit = async () => {
    const name = String(terminalForm.name || "").trim();
    const code = String(terminalForm.code || "").trim();

    const errs = {};
    if (!name) errs.name = "Terminal Name is required";
    if (!code) errs.code = "Terminal Code is required";

    if (Object.keys(errs).length > 0) {
      setTerminalErrors(errs);
      return;
    }

    try {
      const payload = {
        name,
        code,
        address: terminalForm.address ? String(terminalForm.address).trim() : undefined,
        city: terminalForm.city ? String(terminalForm.city).trim() : undefined,
        state: terminalForm.state ? String(terminalForm.state).trim() : undefined,
        zipCode: terminalForm.zipCode ? String(terminalForm.zipCode).trim() : undefined,
      };

      const result = await dispatch(createTerminal(payload));
      if (createTerminal.fulfilled.match(result)) {
        toast.success("Terminal created successfully!");
        handleCloseAddTerminalModal();
        dispatch(fetchRouteManagementTerminals());
      } else {
        toast.error(String(result.payload || "Failed to create terminal"));
      }
    } catch (err) {
      toast.error(err?.message || "Failed to create terminal");
    }
  };

  const handleSort = (column) => {
    if (sortColumn === column) setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    else {
      setSortColumn(column);
      setSortDirection("asc");
    }
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

  useEffect(() => {
    if (selectedTab !== "Trip Planner" || isOpen === null) return;

    const terminal = displayedTerminals[isOpen];
    const terminalId = terminal?.terminalId;
    if (!terminalId || tripsByTerminal[terminalId] || tripsLoadingByTerminal[terminalId]) return;

    const loadTrips = async () => {
      try {
        setTripsLoadingByTerminal((prev) => ({ ...prev, [terminalId]: true }));
        const response = await routeSchedulingService.getTripsByTerminal(terminalId);
        if (response.ok) {
          const normalizedTrips = Array.isArray(response.data)
            ? response.data.map(normalizeTripRecord)
            : [];
          setTripsByTerminal((prev) => ({ ...prev, [terminalId]: normalizedTrips }));
        } else {
          setTripsByTerminal((prev) => ({ ...prev, [terminalId]: [] }));
        }
      } catch (error) {
        setTripsByTerminal((prev) => ({ ...prev, [terminalId]: [] }));
        toast.error("Failed to load trips");
      } finally {
        setTripsLoadingByTerminal((prev) => ({ ...prev, [terminalId]: false }));
      }
    };

    loadTrips();
  }, [selectedTab, isOpen, displayedTerminals, tripsByTerminal, tripsLoadingByTerminal]);

  // ---------------------------
  // ✅ OPEN MAP SCREEN (ROUTE MAP)
  // ---------------------------
  const handleMapScreenClick = (routeOrTrip) => {
    const resolvedId = resolveRouteId(routeOrTrip);

    if (!resolvedId) {
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
    setSelectedEditableRoute(null);
    setShowCard(true);
  };

  const handleOpenRoute = () => {
    setIsCreateRoute(true);
    setIsEditRoute(false);
    setSelectedEditableRoute(null);
  };

  const handleEditRoute = (route) => {
    const resolvedId = resolveRouteId(route);
    setSelectedEditableRoute(route || null);
    setIsEditRoute(true);
    setIsCreateRoute(true);

    if (resolvedId) {
      dispatch(fetchRouteDetails(resolvedId));
      dispatch(fetchRouteStudents({ routeId: resolvedId, type: "AM", limit: 100, offset: 0 }));
    }
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
      payload.students?.data ||
      payload.students ||
      payload.data?.students?.data ||
      payload.data?.students ||
      [];

    const studentsByStopId = (Array.isArray(studentsRaw) ? studentsRaw : []).reduce((acc, stu, idx) => {
      const stopId = stu.stopId ?? stu.StopId;
      if (stopId == null) return acc;

      const first = stu.firstName ?? stu.FirstName ?? "";
      const last = stu.lastName ?? stu.LastName ?? "";
      const name =
        (first || last)
          ? `${first} ${last}`.trim()
          : (stu.studentName || stu.StudentName || `Student ${idx + 1}`);

      if (!acc[stopId]) acc[stopId] = [];
      acc[stopId].push({
        id: String(stu.studentId ?? stu.StudentId ?? idx),
        name,
        address: stu.studentAddress || stu.StudentAddress || "",
      });
      return acc;
    }, {});

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
          students: studentsByStopId[stop.stopId || stop.StopId] || [],
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
      details: { address: s.address, students: s.students || [] },
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

    // Do not render separate student pins on top of stop pins.
    // Route Management should show stop markers and expose assigned students inside the stop popup.
    const stopPositions = stops.map((stop) => stop.position).filter(Boolean);
    const samePosition = (a, b) =>
      a && b &&
      Math.abs(a.lat - b.lat) < 1e-5 &&
      Math.abs(a.lng - b.lng) < 1e-5;

    const studentMarkersFiltered = studentMarkers.filter((sm) => {
      return !stopPositions.some((stopPos) => samePosition(sm.position, stopPos));
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
        mapView?.loading ? (
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
          initialRoute={selectedEditableRoute}
          initialRouteDetails={selectedEditableRoute ? detailsByRoute?.[resolveRouteId(selectedEditableRoute)] : null}
          initialRouteStudents={selectedEditableRoute ? studentsByRoute?.[resolveRouteId(selectedEditableRoute)] || [] : []}
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
                        {(() => {
                          const terminalTrips = tripsByTerminal[terminal.terminalId] || [];
                          const isTripsLoading = !!tripsLoadingByTerminal[terminal.terminalId];

                          return (
                            <>
                        {/* ✅ your Trip Planner UI — keep as is */}
                        {/* IMPORTANT FIX: View Map click must pass route/trip */}
                        {humburgerBar ? (
                          <div className="w-full p-4 overflow-hidden rounded-sm">
                            <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm">
                              <table className="w-full border-collapse">
                                <thead>{/* your headers */}</thead>
                                <tbody>
                                  {terminalTrips?.map((trip) => (
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
                        ) : isTripsLoading ? (
                          <div className="flex justify-center py-8">
                            <Spinner className="h-8 w-8 text-[#C01824]" />
                          </div>
                        ) : terminalTrips.length === 0 ? (
                          <div className="px-4 py-8 text-center text-gray-500">
                            No trips found for this terminal.
                          </div>
                        ) : (
                          <div className="flex flex-wrap gap-2 justify-evenly">
                            {terminalTrips.map((trip, idx) => (
                                <VendorApprovedCard
                                  key={idx}
                                  trip={trip}
                                  trips={terminalTrips}
                                  onEditClick={hanldeEditModal}
                                  selectedTab={selectedTab}
                                  handleMapScreenClick={handleMapScreenClick} // ✅ ensure card calls with route obj
                                  handleEditRoute={handleEditRoute}
                                />
                              ))}
                          </div>
                        )}
                            </>
                          );
                        })()}
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
        <style>
          {`
            .pac-container {
              z-index: 99999 !important;
            }
          `}
        </style>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col">
            <Typography variant="small" color="blue-gray" className="mb-2 font-medium text-left">
              Terminal Name <span className="text-red-500">*</span>
            </Typography>
            <Input
              size="lg"
              placeholder="e.g. West Coast Terminal"
              name="name"
              value={terminalForm.name}
              onChange={handleTerminalFormChange}
              error={!!terminalErrors.name}
              className={terminalErrors.name ? "!border-red-400 focus:!border-red-500" : "!border-t-blue-gray-200 focus:!border-t-gray-900"}
              labelProps={{ className: "before:content-none after:content-none" }}
            />
            {terminalErrors.name && <p className="text-red-500 text-xs mt-1">{terminalErrors.name}</p>}
          </div>

          <div className="flex flex-col">
            <Typography variant="small" color="blue-gray" className="mb-2 font-medium text-left">
              Terminal Code <span className="text-red-500">*</span>
            </Typography>
            <Input
              size="lg"
              placeholder="e.g. T-101"
              name="code"
              value={terminalForm.code}
              onChange={handleTerminalFormChange}
              error={!!terminalErrors.code}
              className={terminalErrors.code ? "!border-red-400 focus:!border-red-500" : "!border-t-blue-gray-200 focus:!border-t-gray-900"}
              labelProps={{ className: "before:content-none after:content-none" }}
            />
            {terminalErrors.code && <p className="text-red-500 text-xs mt-1">{terminalErrors.code}</p>}
          </div>

          <div className="flex flex-col">
            <Typography variant="small" color="blue-gray" className="mb-2 font-medium text-left">
              Address / Location
            </Typography>
            <div className="relative">
              {isGooglePlacesLoaded && window.google?.maps?.places ? (
                <Autocomplete
                  onLoad={setTerminalAddressAutocomplete}
                  onPlaceChanged={handleTerminalAddressPlaceChanged}
                  options={{
                    fields: ["formatted_address", "address_components", "name", "geometry"],
                    types: ["address"],
                  }}
                >
                  <Input
                    inputRef={terminalAddressInputRef}
                    size="lg"
                    placeholder="Enter full address"
                    name="address"
                    value={terminalForm.address}
                    onChange={handleTerminalFormChange}
                    className="!border-t-blue-gray-200 focus:!border-t-gray-900 pr-12"
                    labelProps={{ className: "before:content-none after:content-none" }}
                  />
                </Autocomplete>
              ) : (
                <Input
                  inputRef={terminalAddressInputRef}
                  size="lg"
                  placeholder="Enter full address"
                  name="address"
                  value={terminalForm.address}
                  onChange={handleTerminalFormChange}
                  className="!border-t-blue-gray-200 focus:!border-t-gray-900 pr-12"
                  labelProps={{ className: "before:content-none after:content-none" }}
                />
              )}

              <button
                type="button"
                onClick={handleUseCurrentTerminalLocation}
                disabled={!isGooglePlacesLoaded || isFetchingTerminalLocation}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-[#C81E1E] transition hover:bg-red-50 disabled:cursor-not-allowed disabled:text-gray-400"
                title="Use current location"
                aria-label="Use current location"
              >
                {isFetchingTerminalLocation ? (
                  <Spinner className="h-4 w-4" />
                ) : (
                  <HiOutlineLocationMarker className="h-5 w-5" />
                )}
              </button>
            </div>
            <p className="mt-1 text-xs text-gray-500">
              Type manually for Google suggestions, or use the location button.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      size="md"
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

            <div className="flex flex-col md:col-span-2">
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
