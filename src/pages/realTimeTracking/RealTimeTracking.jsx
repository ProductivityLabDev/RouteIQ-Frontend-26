import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import MainLayout from '@/layouts/SchoolLayout';
import { tripDetails, tripStages } from '@/data';
import { ButtonGroup, Tab, Tabs, TabsBody, TabsHeader, Button, Spinner } from '@material-tailwind/react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import { fetchTerminals, fetchSchoolManagementSummary } from '@/redux/slices/schoolSlice';
import { fetchStudentsByInstitute, clearStudents } from '@/redux/slices/studentSlice';
import trackingService from '@/services/trackingService';
import { vendorService } from '@/services/vendorService';
import { toast } from 'react-hot-toast';
import { GoogleMap, useJsApiLoader, MarkerF, PolylineF, InfoWindowF } from '@react-google-maps/api';
import { redbusicon, greenbusicon, orangebusicon } from '@/assets';
import { io } from 'socket.io-client';
import { BASE_URL, getAuthToken } from '@/configs/api';

let trackingSocketSingleton = null;

// Polling interval (milliseconds)
const POLLING_INTERVAL = 7000; // 7 seconds

// Get bus icon based on status
const getBusIcon = (status) => {
  const s = (status || '').toLowerCase();
  if (s.includes('transit') || s === 'in transit') return greenbusicon;  // ðŸŸ¢ Green bus
  if (s.includes('stop') || s === 'at stop') return orangebusicon;       // ðŸŸ  Orange bus
  return redbusicon;  // ðŸ”´ Red bus for idle/unknown
};

const createStudentPinSvg = ({ label = 'S', fill = '#ef4444', stroke = '#991b1b', textFill = '#111827' }) =>
  `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="44" height="58" viewBox="0 0 44 58">
      <defs>
        <filter id="studentPinShadow" x="-25%" y="-20%" width="150%" height="160%">
          <feDropShadow dx="0" dy="2" stdDeviation="2.2" flood-opacity="0.28"/>
        </filter>
      </defs>
      <path
        d="M22 3C11.507 3 3 11.201 3 21.316c0 13.221 16.251 28.815 17.942 30.413a1.6 1.6 0 002.116 0C24.749 50.131 41 34.537 41 21.316 41 11.201 32.493 3 22 3z"
        fill="${fill}"
        stroke="${stroke}"
        stroke-width="1.5"
        filter="url(#studentPinShadow)"
      />
      <circle cx="22" cy="20" r="11" fill="white" />
      <text
        x="22"
        y="24"
        text-anchor="middle"
        font-size="${label.length <= 2 ? 11 : 8}"
        font-weight="800"
        fill="${textFill}"
        font-family="Arial, Helvetica, sans-serif"
      >${label}</text>
    </svg>
  `)}`;

const createSchoolPinSvg = () =>
  `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="54" height="70" viewBox="0 0 54 70">
      <defs>
        <linearGradient id="schoolPinFill" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#ef4444"/>
          <stop offset="100%" stop-color="#991b1b"/>
        </linearGradient>
        <filter id="schoolPinShadow" x="-25%" y="-20%" width="150%" height="170%">
          <feDropShadow dx="0" dy="4" stdDeviation="3.2" flood-opacity="0.24"/>
        </filter>
      </defs>
      <path
        d="M27 4C14.297 4 4 14.01 4 26.356c0 15.932 19.337 34.517 21.349 36.413a2 2 0 0 0 2.73 0C30.663 60.873 50 42.288 50 26.356 50 14.01 39.703 4 27 4z"
        fill="url(#schoolPinFill)"
        filter="url(#schoolPinShadow)"
      />
      <circle cx="27" cy="25" r="14.5" fill="#fff7ed" stroke="#ffffff" stroke-width="2"/>
      <path
        d="M19 29.5V20.8l8-4.1 8 4.1v8.7"
        fill="none"
        stroke="#991b1b"
        stroke-width="2.4"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M17.8 21.2 27 16.4l9.2 4.8"
        fill="none"
        stroke="#991b1b"
        stroke-width="2.4"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M22.8 29.5v-4.8h8.4v4.8"
        fill="none"
        stroke="#991b1b"
        stroke-width="2.2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <circle cx="27" cy="21.9" r="1.4" fill="#991b1b"/>
    </svg>
  `)}`;

const tabsData = [
  { label: 'All Students', value: 'allstudents' },
  { label: 'On Board', value: 'onboard' },
];

const GOOGLE_LIBRARIES = ['places'];

// Pre-computed module-level SVG constants (never change, safe outside JSX)
const SCHOOL_PIN_SVG = createSchoolPinSvg();
const ROUTE_START_PIN_SVG = createStudentPinSvg({ label: 'S', fill: '#16a34a', stroke: '#166534', textFill: '#14532d' });
const ROUTE_END_PIN_SVG = createStudentPinSvg({ label: 'E', fill: '#7c3aed', stroke: '#5b21b6', textFill: '#ffffff' });
const GOOGLE_ROADS_CHUNK_SIZE = 100;
const MAX_TRACKING_POINT_JUMP_KM = 10;
const MAX_DISPLAY_HISTORY_POINTS = 80;
const MIN_TRACKING_STEP_KM = 0.04;

// ETA display formatter (from backend guide Section 6)
const formatETA = (minutesAway) => {
  if (minutesAway === null || minutesAway === undefined) return 'Calculating...';
  if (minutesAway <= 1) return 'Arriving now';
  if (minutesAway < 60) return `${minutesAway} min away`;
  const hours = Math.floor(minutesAway / 60);
  const mins = minutesAway % 60;
  return mins > 0 ? `${hours} hr ${mins} min away` : `${hours} hr away`;
};

// Format stop estimated arrival time as "X min away"
// API sends "1970-01-01T13:00:00.000Z" (time-only as UTC epoch) or "08:15:00" plain string
// Extract HH:MM, build today's date at that time, diff with now → minutes
const formatStopTime = (value) => {
  if (!value) return null;
  try {
    let hours, minutes;

    const plainMatch = String(value).match(/^(\d{1,2}):(\d{2})/);
    if (plainMatch) {
      hours = parseInt(plainMatch[1], 10);
      minutes = parseInt(plainMatch[2], 10);
    } else {
      const d = new Date(value);
      if (!Number.isFinite(d.getTime())) return null;
      hours = d.getUTCHours();
      minutes = d.getUTCMinutes();
    }

    const now = new Date();
    const target = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes, 0);
    const diffMin = Math.round((target.getTime() - now.getTime()) / 60000);

    if (diffMin < -60) return null; // long past, skip
    if (diffMin <= 1) return 'Arriving now';
    if (diffMin < 60) return `${diffMin} min away`;
    const h = Math.floor(diffMin / 60);
    const m = diffMin % 60;
    return m > 0 ? `${h} hr ${m} min away` : `${h} hr away`;
  } catch {
    return null;
  }
};

const isValidCoordinate = (value) => Number.isFinite(Number(value));

// Validate that coordinates are within reasonable bounds (not null, not 0,0, not out of range)
const isReasonableLocation = (lat, lng) => {
  const la = Number(lat);
  const ln = Number(lng);
  if (!Number.isFinite(la) || !Number.isFinite(ln)) return false;
  if (la === 0 && ln === 0) return false; // null island
  if (la < -90 || la > 90 || ln < -180 || ln > 180) return false;
  return true;
};

const toMapPoint = (source = {}) => {
  const lat = Number(source?.lat ?? source?.Lat ?? source?.latitude ?? source?.Latitude);
  const lng = Number(source?.lng ?? source?.Lng ?? source?.longitude ?? source?.Longitude);
  if (!isReasonableLocation(lat, lng)) return null;
  return { lat, lng };
};

const dedupeSequentialPoints = (points = []) =>
  points.filter(
    (point, index, array) =>
      index === 0 || point.lat !== array[index - 1]?.lat || point.lng !== array[index - 1]?.lng
  );

const getClosestPathPointIndex = (path = [], targetPoint) => {
  if (!Array.isArray(path) || path.length === 0 || !targetPoint) return 0;

  let closestIndex = 0;
  let smallestDistance = Number.POSITIVE_INFINITY;

  path.forEach((point, index) => {
    const distance = getDistanceInKm(point, targetPoint);
    if (distance < smallestDistance) {
      smallestDistance = distance;
      closestIndex = index;
    }
  });

  return closestIndex;
};

const normalizePathPoints = (points = []) =>
  points
    .map((point) => ({
      lat: Number(point?.lat ?? point?.Latitude),
      lng: Number(point?.lng ?? point?.Longitude),
    }))
    .filter((point) => isValidCoordinate(point.lat) && isValidCoordinate(point.lng));

const toRadians = (value) => (Number(value) * Math.PI) / 180;

const getDistanceInKm = (start, end) => {
  const earthRadiusKm = 6371;
  const deltaLat = toRadians(end.lat - start.lat);
  const deltaLng = toRadians(end.lng - start.lng);
  const startLat = toRadians(start.lat);
  const endLat = toRadians(end.lat);

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(startLat) * Math.cos(endLat) * Math.sin(deltaLng / 2) * Math.sin(deltaLng / 2);

  return 2 * earthRadiusKm * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const filterPathOutliers = (points = [], maxJumpKm = MAX_TRACKING_POINT_JUMP_KM) => {
  if (points.length <= 2) return points;

  const filteredPoints = [points[0]];

  for (let index = 1; index < points.length; index += 1) {
    const previousPoint = filteredPoints[filteredPoints.length - 1];
    const currentPoint = points[index];
    const distanceKm = getDistanceInKm(previousPoint, currentPoint);

    if (distanceKm <= maxJumpKm) {
      filteredPoints.push(currentPoint);
    }
  }

  return filteredPoints;
};

const compressPathPoints = (points = [], minStepKm = MIN_TRACKING_STEP_KM) => {
  if (points.length <= 2) return points;

  const compressedPoints = [points[0]];

  for (let index = 1; index < points.length; index += 1) {
    const currentPoint = points[index];
    const lastKeptPoint = compressedPoints[compressedPoints.length - 1];

    if (!lastKeptPoint || getDistanceInKm(lastKeptPoint, currentPoint) >= minStepKm) {
      compressedPoints.push(currentPoint);
    }
  }

  const lastPoint = points[points.length - 1];
  const finalPoint = compressedPoints[compressedPoints.length - 1];
  if (lastPoint && finalPoint && (lastPoint.lat !== finalPoint.lat || lastPoint.lng !== finalPoint.lng)) {
    compressedPoints.push(lastPoint);
  }

  return dedupeSequentialPoints(compressedPoints);
};

const trimPathTail = (points = [], maxPoints = MAX_DISPLAY_HISTORY_POINTS) =>
  points.length > maxPoints ? points.slice(points.length - maxPoints) : points;

const prepareTrackingPath = (points = []) =>
  trimPathTail(compressPathPoints(filterPathOutliers(normalizePathPoints(points))));

const extractHistoryArray = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (!payload || typeof payload !== 'object') return [];

  const candidates = [
    payload.data,
    payload.history,
    payload.items,
    payload.points,
    payload.trackingPoints,
    payload.TrackingPoints,
    payload.results,
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) return candidate;
  }

  return [];
};

const getHistoryPointTimestamp = (point = {}) => {
  const rawValue =
    point?.timestamp ??
    point?.Timestamp ??
    point?.createdAt ??
    point?.CreatedAt ??
    point?.recordedAt ??
    point?.RecordedAt;

  if (!rawValue) return 0;
  const timeValue = new Date(rawValue).getTime();
  return Number.isFinite(timeValue) ? timeValue : 0;
};

const chunkPathPoints = (points, size) => {
  const chunks = [];
  for (let index = 0; index < points.length; index += size - 1) {
    chunks.push(points.slice(index, index + size));
  }
  return chunks;
};

const snapPathToRoads = async (points, apiKey) => {
  const normalizedPoints = normalizePathPoints(points);
  if (!apiKey || normalizedPoints.length < 2) return normalizedPoints;

  const snappedPath = [];
  const chunks = chunkPathPoints(normalizedPoints, GOOGLE_ROADS_CHUNK_SIZE);

  for (const chunk of chunks) {
    const pathParam = chunk.map((point) => `${point.lat},${point.lng}`).join('|');
    const response = await fetch(
      `https://roads.googleapis.com/v1/snapToRoads?interpolate=true&path=${encodeURIComponent(pathParam)}&key=${apiKey}`
    );

    if (!response.ok) {
      throw new Error(`Roads API request failed with status ${response.status}`);
    }

    const data = await response.json();
    const snappedPoints = (data?.snappedPoints || [])
      .map((point) => ({
        lat: Number(point?.location?.latitude),
        lng: Number(point?.location?.longitude),
      }))
      .filter((point) => isValidCoordinate(point.lat) && isValidCoordinate(point.lng));

    if (snappedPoints.length === 0) continue;

    if (snappedPath.length > 0) {
      const lastPoint = snappedPath[snappedPath.length - 1];
      const [firstPoint, ...restPoints] = snappedPoints;
      if (lastPoint && firstPoint && lastPoint.lat === firstPoint.lat && lastPoint.lng === firstPoint.lng) {
        snappedPath.push(...restPoints);
      } else {
        snappedPath.push(...snappedPoints);
      }
    } else {
      snappedPath.push(...snappedPoints);
    }
  }

  return snappedPath.length > 1 ? snappedPath : normalizedPoints;
};

const RealTimeTracking = () => {
  const dispatch = useAppDispatch();
  const { terminals, schoolManagementSummary, loading } = useAppSelector((state) => state.schools);
  const { students, loading: studentsLoading } = useAppSelector((state) => state.students);

  const [selectedTab, setSelectedTab] = useState(null); // terminalId
  const [selectedInfo, setSelectedInfo] = useState('Track School');
  const [activeTab, setActiveTab] = useState('allstudents');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [selectedSchoolTab, setSelectedSchoolTab] = useState(true);

  // API data state
  const [terminalVehicles, setTerminalVehicles] = useState([]);
  const [schoolVehicles, setSchoolVehicles] = useState([]);
  const [activeDrivers, setActiveDrivers] = useState([]);
  const [studentsOnBoard, setStudentsOnBoard] = useState([]);
  const [loadingVehicles, setLoadingVehicles] = useState(false);
  const [loadingDrivers, setLoadingDrivers] = useState(false);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [selectedRouteId, setSelectedRouteId] = useState(null);
  const [focusedDriverRouteId, setFocusedDriverRouteId] = useState(null);
  const [map, setMap] = useState(null);

  // âœ… NEW: All active vehicles (main map - page load + polling)
  const [allActiveVehicles, setAllActiveVehicles] = useState([]);
  const [loadingAllVehicles, setLoadingAllVehicles] = useState(false);

  // âœ… NEW: Selected vehicle detail + polyline path
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [isVehiclePanelOpen, setIsVehiclePanelOpen] = useState(false);
  const [vehicleDetail, setVehicleDetail] = useState(null);
  const [rawVehiclePath, setRawVehiclePath] = useState([]);
  const [vehiclePath, setVehiclePath] = useState([]); // for polyline
  const [selectedRouteMap, setSelectedRouteMap] = useState(null);
  const [liveRouteStops, setLiveRouteStops] = useState([]); // from getLiveRoute — always has arrivedAt/departedAt
  const [studentRoutePath, setStudentRoutePath] = useState([]);
  const [routeDirectionsPath, setRouteDirectionsPath] = useState([]);
  const [busToNextStopPath, setBusToNextStopPath] = useState([]);
  const [selectedMapStopInfo, setSelectedMapStopInfo] = useState(null);
  const [isSnappingVehiclePath, setIsSnappingVehiclePath] = useState(false);
  const [vehiclePathSource, setVehiclePathSource] = useState('idle');
  const [loadingVehicleDetail, setLoadingVehicleDetail] = useState(false);
  const [liveStudentStatusById, setLiveStudentStatusById] = useState({});
  const [liveStopStatusById, setLiveStopStatusById] = useState({});
  const [liveRouteEtaByStopId, setLiveRouteEtaByStopId] = useState({});
  const [socketDebug, setSocketDebug] = useState({
    connected: false,
    routeJoined: null,
    terminalJoined: null,
    lastEvent: 'waiting',
    lastEventAt: null,
  });
  const [selectedDriverSnapshot, setSelectedDriverSnapshot] = useState(null);

  // âœ… NEW: Polling control + last update time
  const [isPollingEnabled, setIsPollingEnabled] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [currentTimestamp, setCurrentTimestamp] = useState(Date.now());

  // AM/PM auto-detect based on time + manual override
  const [tripType, setTripType] = useState(() => (new Date().getHours() < 12 ? 'AM' : 'PM'));

  const pollingRef = useRef(null);
  const pathRequestIdRef = useRef(0);
  const snapRequestIdRef = useRef(0);
  const selectedVehicleIdRef = useRef(null);
  const trackingSocketRef = useRef(null);
  const joinedRouteRef = useRef(null);
  const joinedTerminalRef = useRef(null);

  // âœ… Track if initial fit bounds done (don't re-fit on polling)
  const hasInitialFit = useRef(false);
  const lastMarkerCount = useRef(0);

  // Google Maps API Loader
  const { isLoaded: isMapLoaded, loadError: mapLoadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
    libraries: GOOGLE_LIBRARIES,
  });
  const googleMapsApiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
  // Default to Chicago (most schools are here) instead of ocean/world view
  const initialUsCenter = { lat: 41.8781, lng: -87.6298 };
  const initialUsZoom = 11;

  // ---------- STUDENTS LIST ----------
  const filterStudents = () => {
    if (selectedInfo !== 'Track School') return [];

    if (activeTab === 'onboard') {
      return studentsOnBoard.map((student) => ({
        name: student.studentName || student.StudentName || 'Student',
        busNo: student.busNo || student.BusNo || student.busNumber || 'N/A',
        imgSrc: student.profilePicture || student.ProfilePicture || '',
        studentId: student.studentId || student.StudentId,
        pickupLocation: student.pickupLocation || student.PickupLocation || student.studentAddress || '',
        dropoffLocation: student.dropoffLocation || student.DropLocation || student.stopAddress || '',
        status:
          liveStudentStatusById[student.studentId || student.StudentId] ||
          student.status ||
          student.assignmentType ||
          'Active',
        routeNo: student.routeNo || student.RouteNo || 'N/A',
        routeId: student.routeId || student.RouteId || null,
        pickupLatitude: Number(
          student.pickupLatitude ?? student.PickupLatitude ?? student.studentLatitude ?? student.StudentLatitude
        ),
        pickupLongitude: Number(
          student.pickupLongitude ?? student.PickupLongitude ?? student.studentLongitude ?? student.StudentLongitude
        ),
        dropLatitude: Number(student.dropLatitude ?? student.DropLatitude ?? student.stopLatitude ?? student.StopLatitude),
        dropLongitude: Number(
          student.dropLongitude ?? student.DropLongitude ?? student.stopLongitude ?? student.StopLongitude
        ),
      }));
    }

    if (activeTab === 'allstudents' && selectedSchool?.instituteId) {
      const allStudents = students || [];
      return allStudents
        .filter((item) => !!(item.id || item.StudentId || item.studentId))
        .map((student) => {
          const firstName = student.firstName || student.FirstName || student.first_name || '';
          const lastName = student.lastName || student.LastName || student.last_name || '';
          const fullName =
            firstName && lastName
              ? `${firstName} ${lastName}`
              : student.name ||
                student.Name ||
                student.studentName ||
                student.StudentName ||
                `Student ${student.id || student.StudentId || student.studentId || ''}`;

          return {
            name: fullName,
            busNo: student.busNo || student.BusNo || student.busNumber || 'N/A',
            imgSrc: student.profilePicture || student.ProfilePicture || '',
            studentId: student.id || student.StudentId || student.studentId,
            pickupLocation: student.pickupLocation || student.PickupLocation || '',
            dropoffLocation: student.dropLocation || student.DropLocation || student.dropoffLocation || '',
            status: liveStudentStatusById[student.id || student.StudentId || student.studentId] || student.status || 'Active',
            routeNo: student.routeNo || student.RouteNo || 'N/A',
            routeId: student.routeId || student.RouteId || null,
            pickupLatitude: Number(student.pickupLatitude ?? student.PickupLatitude),
            pickupLongitude: Number(student.pickupLongitude ?? student.PickupLongitude),
            dropLatitude: Number(student.dropLatitude ?? student.DropLatitude),
            dropLongitude: Number(student.dropLongitude ?? student.DropLongitude),
          };
        });
    }

    return [];
  };

  const filteredStudentsList = useMemo(() => filterStudents(), [
    selectedInfo, activeTab, studentsOnBoard, students, selectedSchool, liveStudentStatusById,
  ]);
  const showBusMarkersInSchoolMode = false;

  useEffect(() => {
    if (selectedInfo !== 'Track School' || filteredStudentsList.length === 0) return;

    console.groupCollapsed(
      `[RealTimeTracking] Student bus numbers (${activeTab}) - ${filteredStudentsList.length} students`
    );
    filteredStudentsList.forEach((student, index) => {
    });
    console.groupEnd();
  }, [selectedInfo, activeTab, filteredStudentsList]);

  // ---------- MARKERS ----------
  const mapMarkers = useMemo(() => {
    const markers = [];
    const seenIds = new Set();

    const addMarker = (marker) => {
      if (!seenIds.has(marker.id)) {
        seenIds.add(marker.id);
        markers.push(marker);
      }
    };

    // Helper: only add vehicle marker if location is valid
    const addVehicleMarker = (prefix, vehicle) => {
      const lat = vehicle.currentLocation?.latitude;
      const lng = vehicle.currentLocation?.longitude;
      if (!isReasonableLocation(lat, lng)) return;
      addMarker({
        id: `${prefix}-${vehicle.vehicleId}`,
        position: { lat: Number(lat), lng: Number(lng) },
        title: `${vehicle.vehicleName} - ${vehicle.numberPlate}`,
        type: 'vehicle',
        status: vehicle.status,
        vehicleData: vehicle,
      });
    };

    // =============================================
    // MODE: Track Drivers → only bus icons on map
    // =============================================
    if (selectedInfo === 'Track Drivers') {
      allActiveVehicles.forEach((vehicle) => {
        const lat = vehicle.currentLocation?.latitude;
        const lng = vehicle.currentLocation?.longitude;
        if (!isReasonableLocation(lat, lng)) return;
        addMarker({
          id: `driver-vehicle-${vehicle.vehicleId}`,
          position: { lat: Number(lat), lng: Number(lng) },
          title: `${vehicle.driverName || 'Driver'} - ${vehicle.numberPlate || vehicle.vehicleName}`,
          type: 'vehicle', // bus icon for drivers too
          status: vehicle.status || 'In Transit',
          vehicleData: vehicle,
        });
      });

      if (focusedDriverRouteId && selectedRouteMap) {
        const orderedStops = Array.isArray(selectedRouteMap.stops)
          ? [...selectedRouteMap.stops].sort(
              (left, right) => Number(left?.stopOrder || 0) - Number(right?.stopOrder || 0)
            )
          : [];

        const startPoint = toMapPoint(selectedRouteMap.startLocation || {});
        const endPoint = toMapPoint(selectedRouteMap.endLocation || {});

        if (startPoint) {
          addMarker({
            id: `route-start-${selectedRouteMap.routeId || focusedDriverRouteId || 'active'}`,
            position: startPoint,
            title:
              selectedRouteMap.startLocation?.name ||
              selectedRouteMap.startLocation?.address ||
              'Route Start',
            type: 'route-start',
            status: 'route-start',
          });
        }

        orderedStops.forEach((stop, index) => {
          const point = toMapPoint(stop);
          if (!point) return;

          const stopId = stop?.stopId ?? stop?.StopId ?? `index-${index}`;
          const stopOrder = stop?.stopOrder ?? stop?.StopOrder ?? index + 1;
          const eta = liveRouteEtaByStopId[Number(stopId)];
          const liveStatus = liveStopStatusById[Number(stopId)];
          addMarker({
            id: `route-stop-${stopId}`,
            position: point,
            title: `${stop?.stopName || stop?.StopName || `Stop ${stopOrder}`}${
              eta !== undefined && eta !== null ? ` • ${formatETA(eta)}` : ''
            }${liveStatus ? ` • ${liveStatus}` : ''}`,
            type: 'route-stop',
            status: liveStatus || 'route-stop',
            stopData: stop,
          });
        });

        if (endPoint) {
          addMarker({
            id: `route-end-${selectedRouteMap.routeId || focusedDriverRouteId || 'active'}`,
            position: endPoint,
            title:
              selectedRouteMap.endLocation?.name ||
              selectedRouteMap.endLocation?.address ||
              'Route End',
            type: 'route-end',
            status: 'route-end',
          });
        }
      }
    }

    // =============================================
    // MODE: Track School → school pin + students
    // (bus icons only when no school selected yet)
    // =============================================
    if (selectedInfo === 'Track School') {
      if (!selectedTab && !selectedSchool && showBusMarkersInSchoolMode) {
        // Default view: show all active vehicles as bus icons
        allActiveVehicles.forEach((v) => addVehicleMarker('all-vehicle', v));
      }

      // Terminal selected → show terminal vehicles
      if (selectedTab && !selectedSchool && showBusMarkersInSchoolMode) {
        terminalVehicles.forEach((v) => addVehicleMarker('vehicle', v));
      }

      // School selected → show school pin (NO bus icons in school view)
      if (selectedSchool?.instituteId) {
        // School location pin
        if (isReasonableLocation(selectedSchool.lat, selectedSchool.lng)) {
          addMarker({
            id: `school-pin-${selectedSchool.instituteId}`,
            position: { lat: Number(selectedSchool.lat), lng: Number(selectedSchool.lng) },
            title: selectedSchool.schoolName || 'School',
            type: 'school',
            status: 'school',
            schoolData: selectedSchool,
          });
        }

        filteredStudentsList.forEach((student) => {
          if (!isReasonableLocation(student.pickupLatitude, student.pickupLongitude)) return;
          if (selectedStudent?.studentId && student.studentId === selectedStudent.studentId) return;
          addMarker({
            id: `student-${student.studentId}`,
            position: { lat: Number(student.pickupLatitude), lng: Number(student.pickupLongitude) },
            title: student.name || 'Student',
            type: 'student',
            status: student.status || 'Active',
            studentData: student,
          });
        });

        if (selectedStudent && !selectedStudent?.role) {
          if (isReasonableLocation(selectedStudent.pickupLatitude, selectedStudent.pickupLongitude)) {
            addMarker({
              id: `selected-student-pickup-${selectedStudent.studentId || 'active'}`,
              position: {
                lat: Number(selectedStudent.pickupLatitude),
                lng: Number(selectedStudent.pickupLongitude),
              },
              title: `${selectedStudent.name || 'Student'} Pickup`,
              type: 'selected-student-pickup',
              status: selectedStudent.status || 'Active',
              studentData: selectedStudent,
            });
          }

          if (isReasonableLocation(selectedStudent.dropLatitude, selectedStudent.dropLongitude)) {
            addMarker({
              id: `selected-student-dropoff-${selectedStudent.studentId || 'active'}`,
              position: {
                lat: Number(selectedStudent.dropLatitude),
                lng: Number(selectedStudent.dropLongitude),
              },
              title: `${selectedStudent.name || 'Student'} Dropoff`,
              type: 'selected-student-dropoff',
              status: selectedStudent.status || 'Active',
              studentData: selectedStudent,
            });
          }
        }
      }
    }

    // =============================================
    // MODE: Track Terminals (if exists)
    // =============================================
    if (selectedInfo === 'Track Terminals' && selectedTab) {
      terminalVehicles.forEach((v) => addVehicleMarker('terminal-vehicle', v));
    }

    return markers;
  }, [
    terminalVehicles,
    schoolVehicles,
    activeDrivers,
    allActiveVehicles,
    selectedTab,
    selectedSchool,
    selectedInfo,
    filteredStudentsList,
    selectedStudent,
    selectedVehicle,
    selectedRouteMap,
    focusedDriverRouteId,
    liveRouteEtaByStopId,
    liveStopStatusById,
  ]);

  // FIXED: Only used as INITIAL center — never changes after mount.
  // This prevents map from jumping on every poll update.
  // All subsequent centering is handled by fitBounds effect + user interaction.
  const [mapInitialCenter] = useState(initialUsCenter);

  const onMapLoad = useCallback((mapInstance) => {
    setMap(mapInstance);
    // fitBounds effect will handle centering once markers arrive
  }, []);

  const onMapUnmount = useCallback(() => setMap(null), []);

  const routeMapPath = useMemo(() => {
    if (selectedInfo !== 'Track Drivers' || !focusedDriverRouteId || !selectedRouteMap) return [];

    const orderedStops = Array.isArray(selectedRouteMap.stops)
      ? [...selectedRouteMap.stops].sort(
          (left, right) => Number(left?.stopOrder || 0) - Number(right?.stopOrder || 0)
        )
      : [];

    const pathPoints = [
      toMapPoint(selectedRouteMap.startLocation || {}),
      ...orderedStops.map((stop) => toMapPoint(stop)).filter(Boolean),
      toMapPoint(selectedRouteMap.endLocation || {}),
    ].filter(Boolean);

    return dedupeSequentialPoints(pathPoints);
  }, [selectedInfo, focusedDriverRouteId, selectedRouteMap]);

  const selectedVehicleLivePoint = useMemo(() => {
    const lat = Number(
      vehicleDetail?.Latitude ??
        vehicleDetail?.latitude ??
        selectedVehicle?.currentLocation?.latitude ??
        selectedVehicle?.currentLocation?.Latitude
    );
    const lng = Number(
      vehicleDetail?.Longitude ??
        vehicleDetail?.longitude ??
        selectedVehicle?.currentLocation?.longitude ??
        selectedVehicle?.currentLocation?.Longitude
    );

    return isReasonableLocation(lat, lng) ? { lat, lng } : null;
  }, [selectedVehicle, vehicleDetail]);

  const nextRouteStopPoint = useMemo(() => {
    const sourceStops =
      liveRouteStops.length > 0
        ? liveRouteStops
        : Array.isArray(selectedRouteMap?.stops)
        ? selectedRouteMap.stops
        : [];

    if (sourceStops.length === 0) return null;

    const orderedStops = [...sourceStops].sort(
      (left, right) => Number(left?.stopOrder || left?.StopOrder || 0) - Number(right?.stopOrder || right?.StopOrder || 0)
    );

    const currentOrNextStop =
      orderedStops.find((stop) => stop?.arrivedAt && !stop?.departedAt) ||
      orderedStops.find((stop) => !stop?.departedAt) ||
      orderedStops[orderedStops.length - 1];

    return toMapPoint(currentOrNextStop || {});
  }, [liveRouteStops, selectedRouteMap]);

  const activeRouteDisplayPath = routeDirectionsPath.length > 1 ? routeDirectionsPath : routeMapPath;
  const remainingRoutePath = useMemo(() => {
    if (activeRouteDisplayPath.length <= 1) return [];
    if (!nextRouteStopPoint) return activeRouteDisplayPath;

    const closestPointIndex = getClosestPathPointIndex(activeRouteDisplayPath, nextRouteStopPoint);
    return dedupeSequentialPoints(activeRouteDisplayPath.slice(closestPointIndex));
  }, [activeRouteDisplayPath, nextRouteStopPoint]);

  const activeVehicleFocusPath =
    remainingRoutePath.length > 1
      ? remainingRoutePath
      : activeRouteDisplayPath.length > 1
      ? activeRouteDisplayPath
      : vehiclePath;

  // ---------- MOUNT ----------
  useEffect(() => {
    dispatch(fetchTerminals());
    dispatch(fetchSchoolManagementSummary());
  }, [dispatch]);

  // ---------- FETCH TERMINAL VEHICLES ----------
  useEffect(() => {
    if (selectedInfo === 'Track School' && selectedTab) {
      fetchTerminalVehicles(selectedTab);
    }
  }, [selectedTab, selectedInfo]);

  // ---------- DRIVERS MODE ----------
  useEffect(() => {
    if (selectedInfo === 'Track Drivers') {
      fetchActiveDrivers();
    } else {
      // leave drivers mode => clear drivers data
      setActiveDrivers([]);
      setLoadingDrivers(false);
    }
  }, [selectedInfo]);

  // ---------- SCHOOL SELECTED ----------
  useEffect(() => {
    if (selectedInfo === 'Track School' && selectedSchool?.instituteId) {
      dispatch(clearStudents());
      fetchSchoolVehicles(selectedSchool.instituteId);
      dispatch(fetchStudentsByInstitute(selectedSchool.instituteId));
    }
  }, [selectedSchool, selectedInfo, dispatch]);

  // ---------- ROUTE SELECTED (ONBOARD) ----------
  useEffect(() => {
    if (selectedRouteId && activeTab === 'onboard') {
      fetchStudentsOnBoard(selectedRouteId);
    }
  }, [selectedRouteId, activeTab, tripType]);

  // ---------- FIT BOUNDS ----------
  // Only fit bounds on SELECTION change (school/terminal/mode), never during polling updates
  useEffect(() => {
    if (!map || mapMarkers.length === 0 || !window.google?.maps?.LatLngBounds) return;

    const isInitialFit = !hasInitialFit.current;
    if (!isInitialFit) return; // after first fit, user controls zoom manually

    hasInitialFit.current = true;

    if (mapMarkers.length <= 3) {
      const avgLat = mapMarkers.reduce((sum, m) => sum + m.position.lat, 0) / mapMarkers.length;
      const avgLng = mapMarkers.reduce((sum, m) => sum + m.position.lng, 0) / mapMarkers.length;
      const targetCenter = mapMarkers.length === 1 ? mapMarkers[0].position : { lat: avgLat, lng: avgLng };
      map.panTo(targetCenter);
      map.setZoom(15);
    } else {
      const bounds = new window.google.maps.LatLngBounds();
      mapMarkers.forEach((m) => bounds.extend(m.position));
      map.fitBounds(bounds, { top: 50, bottom: 80, left: 50, right: 50 });
      window.google.maps.event.addListenerOnce(map, 'idle', () => {
        const currentZoom = map.getZoom();
        if (currentZoom > 17) map.setZoom(17);
        if (currentZoom < 8) map.setZoom(10);
      });
    }
  }, [map, mapMarkers]);

  useEffect(() => {
    if (!map || activeVehicleFocusPath.length <= 1 || !window.google?.maps?.LatLngBounds || !selectedVehicle) return;

    const bounds = new window.google.maps.LatLngBounds();
    activeVehicleFocusPath.forEach((point) => bounds.extend(point));
    map.fitBounds(bounds, { top: 80, bottom: 80, left: 120, right: 120 });

    window.google.maps.event.addListenerOnce(map, 'idle', () => {
      const currentZoom = map.getZoom();
      if (currentZoom > 16) map.setZoom(16);
    });
  }, [map, activeVehicleFocusPath, selectedVehicle]);

  // Re-fit bounds when user changes school, terminal, or mode selection
  useEffect(() => {
    hasInitialFit.current = false;
  }, [selectedSchool?.instituteId, selectedTab, selectedInfo, selectedStudent?.studentId]);

  // ---------- API CALLS ----------
  const fetchTerminalVehicles = async (terminalId) => {
    try {
      setLoadingVehicles(true);
      const response = await trackingService.getTerminalVehicles(terminalId);
      if (response.ok && response.data) {
        setTerminalVehicles(response.data);
      } else {
        toast.error('Failed to fetch terminal vehicles');
      }
    } catch (error) {
      toast.error('Error loading terminal vehicles');
    } finally {
      setLoadingVehicles(false);
    }
  };

  const fetchSchoolVehicles = async (schoolId) => {
    try {
      setLoadingVehicles(true);
      const response = await trackingService.getSchoolVehicles(schoolId);
      if (response.ok && response.data) {
        setSchoolVehicles(response.data);
      } else {
        toast.error('Failed to fetch school vehicles');
      }
    } catch (error) {
      toast.error('Error loading school vehicles');
    } finally {
      setLoadingVehicles(false);
    }
  };

  const fetchActiveDrivers = async () => {
    try {
      setLoadingDrivers(true);
      const response = await vendorService.getDrivers();
      if (response.ok && response.data) {
        const driversList = response.data
          .map((driver) => ({
            name: driver.name || 'Unknown Driver',
            busNo: 'No active route',
            imgSrc: '',
            role: 'driver',
            driverId: driver.id,
            vehicleId: null,
            vehicleName: '',
            terminalId: null,
            currentLocation: null,
            routeId: null,
            routeName: '',
          }));
        setActiveDrivers(driversList);
      } else {
        toast.error('Failed to fetch active drivers');
      }
    } catch (error) {
      toast.error('Error loading drivers');
    } finally {
      setLoadingDrivers(false);
    }
  };

  const fetchStudentsOnBoard = async (routeId) => {
    try {
      setLoadingStudents(true);
      const response = await trackingService.getStudentsOnBoard(routeId, tripType);
      if (response.ok && response.data) {
        // Guide shows data is a flat array; legacy wrapped format also supported
        const list = Array.isArray(response.data)
          ? response.data
          : response.data.studentsOnBoard || [];
        setStudentsOnBoard(list);
      } else {
        toast.error('Failed to fetch students on board');
      }
    } catch (error) {
      toast.error('Error loading students');
    } finally {
      setLoadingStudents(false);
    }
  };

  // âœ… Fetch ALL active vehicles (main map - page load + polling)
  const fetchAllActiveVehicles = async (silent = false) => {
    try {
      if (!silent) setLoadingAllVehicles(true);
      const response = await trackingService.getActiveVehicles();
      if (response.ok && response.data) {
        setAllActiveVehicles(response.data);
        setLastUpdated(new Date());
      }
    } catch (error) {
      if (!silent) toast.error('Error loading vehicles');
    } finally {
      if (!silent) setLoadingAllVehicles(false);
    }
  };

  // âœ… Fetch single vehicle detail (on marker click)
  const fetchVehicleDetail = async (vehicleId) => {
    try {
      setLoadingVehicleDetail(true);
      const response = await trackingService.getVehicleLocation(vehicleId);
      if (response.ok && response.data) {
        setVehicleDetail(response.data);
      }
    } catch (error) {
      // silently fail â€” fallback to selectedVehicle data
    } finally {
      setLoadingVehicleDetail(false);
    }
  };

  // âœ… Fetch vehicle path/history (for polyline)
  const fetchRouteMap = async (routeId) => {
    try {
      const response = await trackingService.getRouteMap(routeId);
      if (response.ok && response.data) {
        setSelectedRouteMap(response.data);
        return;
      }
      setSelectedRouteMap(null);
    } catch (error) {
      setSelectedRouteMap(null);
    }
  };

  const handleDriverSelect = async (driver) => {
    setSelectedStudent(driver);
    setIsVehiclePanelOpen(false);
    setSelectedVehicle(null);
    setSelectedRouteMap(null);
    setSelectedRouteId(null);
    setFocusedDriverRouteId(null);
    setSelectedDriverSnapshot(null);
    setLiveRouteStops([]);

    const activeRouteResponse = await trackingService.getDriverActiveRoute(driver?.driverId);
    const activeRoute = activeRouteResponse?.ok ? activeRouteResponse.data : null;

    if (!activeRoute?.routeId) {
      toast('No active route today');
      return;
    }

    const matchedVehicle =
      allActiveVehicles.find(
        (vehicle) => Number(vehicle?.driverId ?? vehicle?.DriverId) === Number(driver?.driverId)
      ) || {
        driverId: driver?.driverId,
        driverName: driver?.name,
        routeId: activeRoute.routeId,
        routeName: activeRoute.routeName || '',
        vehicleId: activeRoute.vehicleId || null,
        vehicleName: activeRoute.vehicleName || activeRoute.busNumber || '',
        numberPlate: activeRoute.numberPlate || activeRoute.busNumber || '',
        terminalId: activeRoute.terminalId || null,
        currentLocation: activeRoute.currentLocation || null,
        status: activeRoute.currentLocation ? 'In Transit' : 'Idle',
      };

    setActiveDrivers((current) =>
      current.map((item) =>
        Number(item?.driverId) === Number(driver?.driverId)
          ? {
              ...item,
              busNo: matchedVehicle.numberPlate || matchedVehicle.vehicleName || activeRoute.busNumber || 'Assigned',
              routeId: activeRoute.routeId || matchedVehicle.routeId || null,
              routeName: activeRoute.routeName || matchedVehicle.routeName || '',
              vehicleId: matchedVehicle.vehicleId || activeRoute.vehicleId || null,
              vehicleName: matchedVehicle.vehicleName || activeRoute.vehicleName || '',
              terminalId: matchedVehicle.terminalId || activeRoute.terminalId || null,
              currentLocation: matchedVehicle.currentLocation || activeRoute.currentLocation || null,
            }
          : item
      )
    );

    await handleVehicleClick({
      ...matchedVehicle,
      routeId: activeRoute.routeId || matchedVehicle.routeId || null,
      routeName: activeRoute.routeName || matchedVehicle.routeName || '',
      vehicleId: matchedVehicle.vehicleId || activeRoute.vehicleId || null,
      vehicleName: matchedVehicle.vehicleName || activeRoute.vehicleName || activeRoute.busNumber || '',
      numberPlate: matchedVehicle.numberPlate || activeRoute.numberPlate || activeRoute.busNumber || '',
      terminalId: matchedVehicle.terminalId || activeRoute.terminalId || null,
      currentLocation: matchedVehicle.currentLocation || activeRoute.currentLocation || null,
    });
  };

  const fetchVehiclePath = async (vehicleId) => {
    const requestId = ++pathRequestIdRef.current;
    try {
      const response = await trackingService.getVehicleHistory(vehicleId, { limit: 200 });
      if (response.ok && response.data) {
        const historyData = extractHistoryArray(response.data)
          .slice()
          .sort((left, right) => getHistoryPointTimestamp(left) - getHistoryPointTimestamp(right));
        const path = historyData.map((point) => ({
          lat: point.Latitude ?? point.latitude ?? point.lat ?? point.Lat,
          lng: point.Longitude ?? point.longitude ?? point.lng ?? point.Lng,
        }));
        const filteredPath = prepareTrackingPath(path);

        if (pathRequestIdRef.current !== requestId) return;

        setRawVehiclePath(filteredPath);
        setVehiclePath(filteredPath);
        setVehiclePathSource('raw');
      }
    } catch (error) {
      if (pathRequestIdRef.current === requestId) {
        setRawVehiclePath([]);
        setVehiclePath([]);
        setIsSnappingVehiclePath(false);
        setVehiclePathSource('history_failed');
      }
    }
  };

  useEffect(() => {
    const normalizedRawPath = prepareTrackingPath(rawVehiclePath);
    const activeSnapRequestId = ++snapRequestIdRef.current;

    if (normalizedRawPath.length <= 1) {
      setVehiclePath(normalizedRawPath);
      setIsSnappingVehiclePath(false);
      setVehiclePathSource(normalizedRawPath.length === 0 ? 'idle' : 'not_enough_points');
      return undefined;
    }

    if (!googleMapsApiKey) {
      setVehiclePath(normalizedRawPath);
      setIsSnappingVehiclePath(false);
      setVehiclePathSource('missing_key');
      return undefined;
    }

    setVehiclePath(normalizedRawPath);
    setIsSnappingVehiclePath(true);
    setVehiclePathSource('snapping');

    const timeoutId = window.setTimeout(async () => {
      try {
        const snappedPath = await snapPathToRoads(normalizedRawPath, googleMapsApiKey);
        if (snapRequestIdRef.current !== activeSnapRequestId) return;

        const cleanedSnappedPath = prepareTrackingPath(snappedPath);

        if (cleanedSnappedPath.length > 1) {
          setVehiclePath(cleanedSnappedPath);
          setVehiclePathSource('roads');
        } else {
          setVehiclePath(normalizedRawPath);
          setVehiclePathSource('raw');
        }
      } catch (error) {
        if (snapRequestIdRef.current !== activeSnapRequestId) return;
        setVehiclePath(normalizedRawPath);
        setVehiclePathSource('roads_failed');
      } finally {
        if (snapRequestIdRef.current === activeSnapRequestId) {
          setIsSnappingVehiclePath(false);
        }
      }
    }, 350);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [rawVehiclePath, googleMapsApiKey]);

  // âœ… NEW: Handle vehicle marker click
  const handleVehicleClick = async (vehicle) => {
    const vehicleId = vehicle.vehicleId || vehicle.VehicleId;
    const routeId = vehicle.routeId || vehicle.RouteId;

    setSelectedVehicle(vehicle);
    setSelectedDriverSnapshot(vehicle);
    selectedVehicleIdRef.current = Number(vehicle?.vehicleId || vehicle?.VehicleId || 0);
    setIsVehiclePanelOpen(true);
    setSelectedStudent(null);
    setVehicleDetail(null);
    setRawVehiclePath([]);
    setVehiclePath([]);
    setSelectedRouteMap(null);
    setLiveRouteStops([]);
    setBusToNextStopPath([]);
    setSelectedMapStopInfo(null);
    setVehiclePathSource('idle');
    setSelectedRouteId(routeId || null);
    setFocusedDriverRouteId(routeId || null);

    if (!vehicleId) return;

    const requests = [
      fetchVehicleDetail(vehicleId).catch(() => {}),
      fetchVehiclePath(vehicleId).catch(() => {}),
    ];

    if (routeId) {
      requests.push(fetchRouteMap(routeId).catch(() => {}));
      // Load live route → stops list for panel + seed stop status
      requests.push(
        trackingService.getLiveRoute(routeId, tripType).then((res) => {
          if (!res.ok || !res.data) return;
          const data = res.data.data || res.data;
          const stops = data.stops || [];
          if (!Array.isArray(stops) || stops.length === 0) return;
          setLiveRouteStops(stops);
          setLiveStopStatusById((current) => {
            const next = { ...current };
            stops.forEach((stop) => {
              const stopId = Number(stop.stopId ?? stop.StopId);
              if (!stopId) return;
              if (stop.departedAt) next[stopId] = 'departed';
              else if (stop.arrivedAt) next[stopId] = 'arrived';
            });
            return next;
          });
        }).catch(() => {})
      );
    }

    await Promise.all(requests);
  };

  // âœ… NEW: Close vehicle detail panel
  const handleCloseVehiclePanel = () => {
    setIsVehiclePanelOpen(false);
    setSelectedDriverSnapshot(null);
    setBusToNextStopPath([]);
    setSelectedMapStopInfo(null);
    setRawVehiclePath([]);
    setVehiclePath([]);
    setVehiclePathSource('idle');
    selectedVehicleIdRef.current = null;
  };

  // âœ… NEW: Toggle polling
  const activeTrackingRouteId = useMemo(
    () =>
      (selectedInfo === 'Track Drivers'
        ? focusedDriverRouteId ||
          selectedVehicle?.routeId ||
          selectedVehicle?.RouteId
        : selectedRouteId || selectedStudent?.routeId) ||
      null,
    [selectedInfo, focusedDriverRouteId, selectedRouteId, selectedVehicle, selectedStudent]
  );

  const activeTrackingTerminalId = useMemo(
    () =>
      selectedTab ||
      selectedVehicle?.terminalId ||
      selectedVehicle?.TerminalId ||
      selectedVehicle?.currentLocation?.terminalId ||
      selectedVehicle?.currentLocation?.TerminalId ||
      null,
    [selectedTab, selectedVehicle]
  );

  const updateVehicleInCollection = useCallback((collection = [], liveData) => {
    const incomingVehicleId = Number(
      liveData?.vehicleId ?? liveData?.VehicleId ?? liveData?.id ?? liveData?.vehicle?.vehicleId
    );
    if (!incomingVehicleId) return collection;

    return collection.map((item) => {
      const currentVehicleId = Number(item?.vehicleId ?? item?.VehicleId ?? item?.id);
      if (currentVehicleId !== incomingVehicleId) return item;

      const nextLocation = {
        ...(item.currentLocation || {}),
        latitude: Number(liveData?.lat ?? liveData?.latitude ?? liveData?.Latitude ?? item?.currentLocation?.latitude),
        longitude: Number(liveData?.lng ?? liveData?.longitude ?? liveData?.Longitude ?? item?.currentLocation?.longitude),
        speed: liveData?.speed ?? liveData?.Speed ?? item?.currentLocation?.speed,
        timestamp: liveData?.timestamp ?? liveData?.Timestamp ?? new Date().toISOString(),
        routeId: liveData?.routeId ?? liveData?.RouteId ?? item?.currentLocation?.routeId,
      };

      return {
        ...item,
        routeId: liveData?.routeId ?? liveData?.RouteId ?? item?.routeId,
        status: liveData?.status ?? liveData?.Status ?? item?.status,
        currentLocation: nextLocation,
      };
    });
  }, []);

  const togglePolling = () => {
    setIsPollingEnabled((prev) => !prev);
  };

  // ---------- POLLING EFFECT ----------
  useEffect(() => {
    // Initial fetch on mount
    fetchAllActiveVehicles();

    // Setup polling interval
    if (isPollingEnabled) {
      pollingRef.current = setInterval(() => {
        fetchAllActiveVehicles(true); // silent refresh (no loading spinner)
      }, POLLING_INTERVAL);
    }

    // Cleanup on unmount or when polling disabled
    return () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
        pollingRef.current = null;
      }
    };
  }, [isPollingEnabled]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTimestamp(Date.now());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const token = getAuthToken();
    const socket =
      trackingSocketSingleton ||
      io(`${BASE_URL}/tracking`, {
        auth: token ? { token } : undefined,
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 2000,
      });

    trackingSocketSingleton = socket;

    trackingSocketRef.current = socket;

    const markSocketEvent = (eventName) => {
      setSocketDebug((current) => ({
        ...current,
        connected: socket.connected,
        lastEvent: eventName,
        lastEventAt: new Date(),
      }));
    };

    const handleConnect = () => {
      setSocketDebug((current) => ({
        ...current,
        connected: true,
        lastEvent: 'connect',
        lastEventAt: new Date(),
      }));
    };

    const handleDisconnect = () => {
      setSocketDebug((current) => ({
        ...current,
        connected: false,
        lastEvent: 'disconnect',
        lastEventAt: new Date(),
      }));
    };

    const handleConnectError = () => {
      setSocketDebug((current) => ({
        ...current,
        connected: false,
        lastEvent: 'connect_error',
        lastEventAt: new Date(),
      }));
    };

    const handleJoined = (data) => {
      const room = data?.room || '';
      setSocketDebug((current) => ({
        ...current,
        routeJoined: room.startsWith('route:') ? room.replace('route:', '') : current.routeJoined,
        terminalJoined: room.startsWith('terminal:') ? room.replace('terminal:', '') : current.terminalJoined,
        lastEvent: `joined:${room}`,
        lastEventAt: new Date(),
      }));
    };

    const handleVehicleLocation = (data) => {
      markSocketEvent('vehicle:location');
      setLastUpdated(new Date());
      setAllActiveVehicles((current) => updateVehicleInCollection(current, data));
      setTerminalVehicles((current) => updateVehicleInCollection(current, data));
      setSchoolVehicles((current) => updateVehicleInCollection(current, data));
      setActiveDrivers((current) => updateVehicleInCollection(current, data));
      setSelectedVehicle((current) => {
        if (!current) return current;
        const currentVehicleId = Number(current?.vehicleId ?? current?.VehicleId ?? current?.id);
        const incomingVehicleId = Number(data?.vehicleId ?? data?.VehicleId ?? data?.id);
        if (!currentVehicleId || currentVehicleId !== incomingVehicleId) return current;

        return updateVehicleInCollection([current], data)[0];
      });
      setVehicleDetail((current) => {
        if (!current) return current;
        const currentVehicleId = Number(current?.VehicleId ?? current?.vehicleId ?? current?.id);
        const incomingVehicleId = Number(data?.vehicleId ?? data?.VehicleId ?? data?.id);
        if (!currentVehicleId || currentVehicleId !== incomingVehicleId) return current;

        return {
          ...current,
          Latitude: Number(data?.lat ?? data?.latitude ?? data?.Latitude ?? current?.Latitude),
          Longitude: Number(data?.lng ?? data?.longitude ?? data?.Longitude ?? current?.Longitude),
          Speed: data?.speed ?? data?.Speed ?? current?.Speed,
          Timestamp: data?.timestamp ?? data?.Timestamp ?? new Date().toISOString(),
          Status: data?.status ?? data?.Status ?? current?.Status,
          RouteId: data?.routeId ?? data?.RouteId ?? current?.RouteId,
        };
      });

      // Extend polyline live — only for the vehicle whose panel is open
      const incomingLat = Number(data?.lat ?? data?.latitude ?? data?.Latitude);
      const incomingLng = Number(data?.lng ?? data?.longitude ?? data?.Longitude);
      const incomingVid = Number(data?.vehicleId ?? data?.VehicleId ?? data?.id);
      if (
        selectedVehicleIdRef.current &&
        incomingVid === selectedVehicleIdRef.current &&
        isReasonableLocation(incomingLat, incomingLng)
      ) {
        setRawVehiclePath((currentPath) => {
          if (currentPath.length === 0) return [{ lat: incomingLat, lng: incomingLng }];
          const lastPoint = currentPath[currentPath.length - 1];
          if (lastPoint && lastPoint.lat === incomingLat && lastPoint.lng === incomingLng) return currentPath;
          const nextPath = [...currentPath, { lat: incomingLat, lng: incomingLng }];
          return prepareTrackingPath(nextPath);
        });
      }
    };

    const handleStudentStatus = (data) => {
      markSocketEvent('student:status');
      const studentId = Number(data?.studentId ?? data?.StudentId);
      const nextStatus = data?.status ?? data?.Status;
      if (!studentId || !nextStatus) return;

      setLastUpdated(new Date());
      setLiveStudentStatusById((current) => ({
        ...current,
        [studentId]: nextStatus,
      }));
      setStudentsOnBoard((current) =>
        current.map((student) =>
          Number(student?.studentId ?? student?.StudentId) === studentId
            ? {
                ...student,
                status: nextStatus,
                pickupTime: data?.pickupTime ?? data?.PickupTime ?? student.pickupTime,
                dropoffTime: data?.dropoffTime ?? data?.DropoffTime ?? student.dropoffTime,
              }
            : student
        )
      );
      setSelectedStudent((current) =>
        Number(current?.studentId) === studentId
          ? { ...current, status: nextStatus }
          : current
      );
    };

    const handleStopUpdate = (data) => {
      markSocketEvent('stop:update');
      const stopId = Number(data?.stopId ?? data?.StopId);
      const event = data?.event ?? data?.status ?? 'updated';
      if (!stopId) return;

      setLastUpdated(new Date());

      // Update stop status map (drives pin colors + panel state)
      setLiveStopStatusById((current) => ({
        ...current,
        [stopId]: event,
      }));

      // Also update liveRouteStops arrivedAt/departedAt so panel reflects reality
      setLiveRouteStops((current) =>
        current.map((stop) => {
          const sid = Number(stop?.stopId ?? stop?.StopId);
          if (sid !== stopId) return stop;
          if (event === 'arrived') {
            return { ...stop, arrivedAt: data?.timestamp ?? new Date().toISOString() };
          }
          if (event === 'departed') {
            return {
              ...stop,
              arrivedAt: stop.arrivedAt || data?.timestamp || new Date().toISOString(),
              departedAt: data?.timestamp ?? new Date().toISOString(),
            };
          }
          return stop;
        })
      );
    };

    const handleRouteEta = (data) => {
      markSocketEvent('route:eta');
      const stops = Array.isArray(data?.stops) ? data.stops : [];
      if (stops.length === 0) return;

      setLastUpdated(new Date());

      // Build ETA lookup from incoming data
      const etaLookup = {};
      stops.forEach((stop) => {
        const stopId = Number(stop?.stopId ?? stop?.StopId);
        if (!stopId) return;
        etaLookup[stopId] = stop?.minutesAway ?? stop?.eta ?? null;
      });

      setLiveRouteEtaByStopId((current) => ({ ...current, ...etaLookup }));

      // Also merge estimatedArrival into liveRouteStops
      setLiveRouteStops((current) =>
        current.map((stop) => {
          const sid = Number(stop?.stopId ?? stop?.StopId);
          const incoming = stops.find((s) => Number(s?.stopId ?? s?.StopId) === sid);
          if (!incoming) return stop;
          return {
            ...stop,
            estimatedArrivalTime: incoming.estimatedArrival || stop.estimatedArrivalTime,
          };
        })
      );
    };

    socket.off('connect', handleConnect);
    socket.off('disconnect', handleDisconnect);
    socket.off('connect_error', handleConnectError);
    socket.off('joined', handleJoined);
    socket.off('vehicle:location', handleVehicleLocation);
    socket.off('student:status', handleStudentStatus);
    socket.off('stop:update', handleStopUpdate);
    socket.off('route:eta', handleRouteEta);

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);
    socket.on('connect_error', handleConnectError);
    socket.on('joined', handleJoined);
    socket.on('vehicle:location', handleVehicleLocation);
    socket.on('student:status', handleStudentStatus);
    socket.on('stop:update', handleStopUpdate);
    socket.on('route:eta', handleRouteEta);

    if (socket.connected) {
      handleConnect();
    }

    return () => {
      if (joinedRouteRef.current) {
        socket.emit('leave:room', { room: `route:${joinedRouteRef.current}` });
        joinedRouteRef.current = null;
      }
      if (joinedTerminalRef.current) {
        socket.emit('leave:room', { room: `terminal:${joinedTerminalRef.current}` });
        joinedTerminalRef.current = null;
      }
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('connect_error', handleConnectError);
      socket.off('joined', handleJoined);
      socket.off('vehicle:location', handleVehicleLocation);
      socket.off('student:status', handleStudentStatus);
      socket.off('stop:update', handleStopUpdate);
      socket.off('route:eta', handleRouteEta);
      trackingSocketRef.current = null;
    };
  }, [updateVehicleInCollection]);

  useEffect(() => {
    const socket = trackingSocketRef.current;
    if (!socket) return;

    if (joinedRouteRef.current && joinedRouteRef.current !== activeTrackingRouteId) {
      socket.emit('leave:room', { room: `route:${joinedRouteRef.current}` });
      setSocketDebug((current) => ({
        ...current,
        routeJoined: null,
        lastEvent: 'leave:room',
        lastEventAt: new Date(),
      }));
      joinedRouteRef.current = null;
    }

    if (activeTrackingRouteId && joinedRouteRef.current !== activeTrackingRouteId) {
      socket.emit('join:route', { routeId: activeTrackingRouteId });
      joinedRouteRef.current = activeTrackingRouteId;
      setSocketDebug((current) => ({
        ...current,
        routeJoined: activeTrackingRouteId,
        lastEvent: 'join:route',
        lastEventAt: new Date(),
      }));
    }

    if (joinedTerminalRef.current && joinedTerminalRef.current !== activeTrackingTerminalId) {
      socket.emit('leave:room', { room: `terminal:${joinedTerminalRef.current}` });
      setSocketDebug((current) => ({
        ...current,
        terminalJoined: null,
        lastEvent: 'leave:room',
        lastEventAt: new Date(),
      }));
      joinedTerminalRef.current = null;
    }

    if (activeTrackingTerminalId && joinedTerminalRef.current !== activeTrackingTerminalId) {
      socket.emit('join:terminal', { terminalId: activeTrackingTerminalId });
      joinedTerminalRef.current = activeTrackingTerminalId;
      setSocketDebug((current) => ({
        ...current,
        terminalJoined: activeTrackingTerminalId,
        lastEvent: 'join:terminal',
        lastEventAt: new Date(),
      }));
    }
  }, [activeTrackingRouteId, activeTrackingTerminalId]);

  // ---------- UI ACTIONS ----------
  const toggleStudentPanel = (studentOrDriver) => {
    setSelectedStudent(studentOrDriver);
    setIsVehiclePanelOpen(false);
    setFocusedDriverRouteId(null);
    setSelectedVehicle(null);
    setSelectedRouteMap(null);
    setBusToNextStopPath([]);
    setSelectedMapStopInfo(null);
    if (studentOrDriver?.routeId) setSelectedRouteId(studentOrDriver.routeId);
  };

  // âœ… School select => terminal auto-select + (polish) terminal vehicles sync
  const toggleSchoolPanel = (school) => {
    // âœ… Reset fit bounds so new school gets proper zoom
    hasInitialFit.current = false;
    lastMarkerCount.current = 0;

    setSelectedSchool(school);
    setSelectedSchoolTab(false);
    setActiveTab('allstudents');

    setSelectedStudent(null);
    setSelectedRouteId(null);
    setStudentsOnBoard([]);
    setIsVehiclePanelOpen(false);
    setFocusedDriverRouteId(null);
    setSelectedVehicle(null);
    setSelectedRouteMap(null);
    setBusToNextStopPath([]);
    setSelectedMapStopInfo(null);

    // Auto select terminal
    const tId = school?.terminalId ?? null;
    if (tId) {
      setSelectedTab(tId);

      // polish: keep terminal vehicles in sync
      if (selectedInfo === 'Track School') {
        fetchTerminalVehicles(tId);
      }
    }
  };

  const handleClosePanel = () => {
    setSelectedStudent(null);
    setSelectedRouteId(null);
    setFocusedDriverRouteId(null);
    setStudentRoutePath([]);
    setRouteDirectionsPath([]);
    setBusToNextStopPath([]);
    setSelectedMapStopInfo(null);
  };

  const selectedStudentPath = useMemo(() => {
    if (selectedInfo !== 'Track School' || !selectedStudent || selectedStudent?.role === 'driver') return [];

    const startLat = Number(selectedStudent.pickupLatitude);
    const startLng = Number(selectedStudent.pickupLongitude);
    const destinationLat = Number(selectedStudent.dropLatitude);
    const destinationLng = Number(selectedStudent.dropLongitude);

    if (!isReasonableLocation(startLat, startLng) || !isReasonableLocation(destinationLat, destinationLng)) {
      return [];
    }

    return [
      { lat: startLat, lng: startLng },
      { lat: destinationLat, lng: destinationLng },
    ].filter((point, index, array) => index === 0 || point.lat !== array[index - 1].lat || point.lng !== array[index - 1].lng);
  }, [selectedInfo, selectedStudent, selectedSchool]);

  useEffect(() => {
    let cancelled = false;

    if (selectedInfo !== 'Track School' || !window.google?.maps?.DirectionsService || selectedStudentPath.length < 2) {
      setStudentRoutePath([]);
      return () => {
        cancelled = true;
      };
    }

    const directionsService = new window.google.maps.DirectionsService();
    directionsService.route(
      {
        origin: selectedStudentPath[0],
        destination: selectedStudentPath[selectedStudentPath.length - 1],
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (cancelled) return;

        if (status === 'OK' && result?.routes?.[0]?.overview_path?.length) {
          setStudentRoutePath(
            result.routes[0].overview_path.map((point) => ({
              lat: point.lat(),
              lng: point.lng(),
            }))
          );
          return;
        }

        setStudentRoutePath([]);
      }
    );

    return () => {
      cancelled = true;
    };
  }, [selectedInfo, selectedStudentPath]);

  const activeStudentRoutePath = studentRoutePath.length > 1 ? studentRoutePath : selectedStudentPath;

  useEffect(() => {
    let cancelled = false;

    if (selectedInfo !== 'Track Drivers' || !selectedRouteMap || !window.google?.maps?.DirectionsService) {
      setRouteDirectionsPath([]);
      return () => {
        cancelled = true;
      };
    }

    const baseRoutePoints = routeMapPath;
    if (baseRoutePoints.length < 2) {
      setRouteDirectionsPath([]);
      return () => {
        cancelled = true;
      };
    }
    const directionsService = new window.google.maps.DirectionsService();

    const fetchSegment = (origin, destination) =>
      new Promise((resolve, reject) => {
        directionsService.route(
          {
            origin,
            destination,
            travelMode: window.google.maps.TravelMode.DRIVING,
          },
          (result, status) => {
            if (status === 'OK' && result?.routes?.[0]?.overview_path?.length) {
              resolve(
                result.routes[0].overview_path.map((point) => ({
                  lat: point.lat(),
                  lng: point.lng(),
                }))
              );
              return;
            }

            reject(new Error(`Directions failed with status ${status}`));
          }
        );
      });

    (async () => {
      try {
        const segments = [];
        for (let index = 0; index < baseRoutePoints.length - 1; index += 1) {
          const segment = await fetchSegment(baseRoutePoints[index], baseRoutePoints[index + 1]);
          if (cancelled) return;
          segments.push(...segment);
        }

        if (segments.length > 1) {
          setRouteDirectionsPath(dedupeSequentialPoints(segments));
          return;
        }

        setRouteDirectionsPath([]);
      } catch (error) {
        if (!cancelled) {
          setRouteDirectionsPath([]);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [selectedInfo, selectedRouteMap, routeMapPath]);

  useEffect(() => {
    let cancelled = false;

    if (
      selectedInfo !== 'Track Drivers' ||
      !selectedVehicleLivePoint ||
      !nextRouteStopPoint ||
      !window.google?.maps?.DirectionsService
    ) {
      setBusToNextStopPath([]);
      return () => {
        cancelled = true;
      };
    }

    const directionsService = new window.google.maps.DirectionsService();
    directionsService.route(
      {
        origin: selectedVehicleLivePoint,
        destination: nextRouteStopPoint,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (cancelled) return;

        if (status === 'OK' && result?.routes?.[0]?.overview_path?.length) {
          setBusToNextStopPath(
            result.routes[0].overview_path.map((point) => ({
              lat: point.lat(),
              lng: point.lng(),
            }))
          );
          return;
        }

        setBusToNextStopPath([]);
      }
    );

    return () => {
      cancelled = true;
    };
  }, [selectedInfo, selectedVehicleLivePoint, nextRouteStopPoint]);

  const freshnessMeta = useMemo(() => {
    if (!lastUpdated) {
      return {
        secondsSinceUpdate: null,
        relativeLabel: 'Waiting for first sync',
        toneClass: 'bg-gray-100 text-gray-600',
        dotClass: 'bg-gray-400',
      };
    }

    const secondsSinceUpdate = Math.max(0, Math.floor((currentTimestamp - lastUpdated.getTime()) / 1000));
    const isFresh = secondsSinceUpdate <= POLLING_INTERVAL / 1000 + 3;
    const isAging = secondsSinceUpdate > POLLING_INTERVAL / 1000 + 3 && secondsSinceUpdate <= 30;
    const relativeLabel =
      secondsSinceUpdate < 2
        ? 'Updated just now'
        : `Updated ${secondsSinceUpdate}s ago`;

    return {
      secondsSinceUpdate,
      relativeLabel,
      toneClass: isFresh
        ? 'bg-green-100 text-green-700'
        : isAging
        ? 'bg-yellow-100 text-yellow-700'
        : 'bg-red-100 text-red-700',
      dotClass: isFresh ? 'bg-green-500' : isAging ? 'bg-yellow-500' : 'bg-red-500',
    };
  }, [currentTimestamp, lastUpdated]);

  const trackingSummary = useMemo(() => {
    if (selectedInfo === 'Track Drivers') {
      return {
        title: 'Driver Tracking',
        subtitle: selectedVehicle
          ? `${selectedVehicle.vehicleName || selectedVehicle.busNo || 'Selected bus'} focused`
          : `${activeDrivers.length} active buses on map`,
      };
    }

    if (selectedStudent) {
      return {
        title: 'Student Journey',
        subtitle: `${selectedStudent.name || 'Student'} pickup to dropoff path`,
      };
    }

    if (selectedSchool) {
      return {
        title: selectedSchool.schoolName || 'School Tracking',
        subtitle: `${filteredStudentsList.length} students available for tracking`,
      };
    }

    return {
      title: 'School Tracking',
      subtitle: 'Select a school to view pickup points and student journey',
    };
  }, [selectedInfo, selectedVehicle, activeDrivers.length, selectedStudent, selectedSchool, filteredStudentsList.length]);

  const vehicleStatusCounts = useMemo(() => {
    const inTransit = allActiveVehicles.filter((vehicle) =>
      (vehicle.status || '').toLowerCase().includes('transit')
    ).length;
    const atStop = allActiveVehicles.filter((vehicle) =>
      (vehicle.status || '').toLowerCase().includes('stop')
    ).length;
    const idle = allActiveVehicles.filter((vehicle) => {
      const normalizedStatus = (vehicle.status || '').toLowerCase();
      return !normalizedStatus.includes('transit') && !normalizedStatus.includes('stop');
    }).length;

    return { inTransit, atStop, idle };
  }, [allActiveVehicles]);

  // âœ… Main fix: tab switch pe hard reset (mix + stale list khatam)
  const handleSelectedTabInfo = (tab) => {
    setSelectedInfo(tab);

    // âœ… Reset fit bounds so new selection gets proper zoom
    hasInitialFit.current = false;
    lastMarkerCount.current = 0;

    // hard reset on every switch
    setSelectedStudent(null);
    setSelectedRouteId(null);
    setStudentsOnBoard([]);
    setIsVehiclePanelOpen(false);
    setFocusedDriverRouteId(null);
    setSelectedVehicle(null);
    setSelectedRouteMap(null);
    setBusToNextStopPath([]);
    setSelectedMapStopInfo(null);
    setTerminalVehicles([]);
    setSchoolVehicles([]);
    dispatch(clearStudents());
    setActiveTab('allstudents');

    if (tab === 'Track School') {
      // show ALL schools by default (no terminal selected)
      setSelectedTab(null);

      // clear drivers
      setActiveDrivers([]);
      setLoadingDrivers(false);

      // reset school selection so schools list show
      setSelectedSchool(null);
      setSelectedSchoolTab(true);
    } else {
      // drivers mode
      setSelectedSchool(null);
      setSelectedSchoolTab(false);
      setSelectedTab(null);
    }
  };

  const handleTerminalSelect = (terminalId) => {
    if (selectedInfo !== 'Track School') return;

    // âœ… Reset fit bounds so new terminal gets proper zoom
    hasInitialFit.current = false;
    lastMarkerCount.current = 0;

    setSelectedTab(terminalId);
    setSelectedSchool(null);
    setSelectedSchoolTab(true);

    setSelectedStudent(null);
    setSelectedRouteId(null);
    setStudentsOnBoard([]);
    setIsVehiclePanelOpen(false);
    setFocusedDriverRouteId(null);
    setSelectedVehicle(null);
    setSelectedRouteMap(null);
    setBusToNextStopPath([]);
    setSelectedMapStopInfo(null);
    setSchoolVehicles([]);
    dispatch(clearStudents());
  };

  return (
    <MainLayout>
      <section className="w-full h-full">
        <div className="mt-7 md:min-h-[750px] h-auto relative">
          <ButtonGroup
            className="border-2 border-[#DDDDE1]/50 rounded-[10px] outline-none p-0 w-[30%]"
            variant="text"
            size="lg"
          >
            {['Track School', 'Track Drivers'].map((tab) => (
              <Button
                key={tab}
                className={
                  selectedInfo === tab
                    ? 'bg-[#C01824] hover:bg-[#C01824]/80 text-white px-6 py-3 lg:text-[14px] capitalize font-bold'
                    : 'bg-white px-6 py-3 capitalize font-bold'
                }
                onClick={() => handleSelectedTabInfo(tab)}
              >
                {tab}
              </Button>
            ))}
          </ButtonGroup>

          {/* Terminal buttons only in Track School */}
          {selectedInfo === 'Track School' && (
            <div className="flex flex-row justify-between mt-4">
              {loading.terminals ? (
                <div className="flex items-center gap-2">
                  <Spinner className="h-4 w-4" />
                  <span className="text-sm">Loading terminals...</span>
                </div>
              ) : (
                <ButtonGroup className="border-0 rounded-[4px] outline-none p-0" variant="text">
                  {terminals && terminals.length > 0 ? (
                    terminals.map((terminal) => {
                      const terminalId = terminal.TerminalId || terminal.id;
                      const terminalName = terminal.TerminalName || terminal.name || `Terminal ${terminalId}`;
                      return (
                        <Button
                          key={terminalId}
                          className={
                            selectedTab === terminalId
                              ? 'bg-[#C01824] hover:bg-[#C01824]/80 text-white text-xs md:text-[14px] capitalize font-medium'
                              : 'bg-white text-xs md:text-[14px] text-[#141516] capitalize font-medium'
                          }
                          onClick={() => handleTerminalSelect(terminalId)}
                        >
                          {terminalName}
                        </Button>
                      );
                    })
                  ) : (
                    <span className="text-sm text-gray-500">No terminals available</span>
                  )}
                </ButtonGroup>
              )}
            </div>
          )}

          {/* âœ… Scroll fix: fixed height + overflow hidden - reduced height for status bar */}
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-[#e8e2d4] bg-white px-4 py-3 shadow-sm">
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#8b6f4e]">
                {selectedInfo}
              </p>
              <h3 className="truncate text-[18px] font-bold text-[#141516]">{trackingSummary.title}</h3>
              <p className="text-[13px] font-medium text-[#6b7280]">{trackingSummary.subtitle}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {/* AM/PM Trip Type Toggle */}
              <div className="inline-flex rounded-full border border-[#e5e7eb] bg-[#f9fafb] p-0.5">
                {['AM', 'PM'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setTripType(type)}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                      tripType === type
                        ? 'bg-[#C01824] text-white shadow-sm'
                        : 'text-[#6b7280] hover:text-[#374151]'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
              <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold ${freshnessMeta.toneClass}`}>
                <span className={`h-2.5 w-2.5 rounded-full ${freshnessMeta.dotClass}`}></span>
                {freshnessMeta.relativeLabel}
              </span>
              <span
                className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold ${
                  socketDebug.connected ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                }`}
              >
                <span
                  className={`h-2.5 w-2.5 rounded-full ${
                    socketDebug.connected ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'
                  }`}
                ></span>
                {socketDebug.connected ? 'Socket connected' : 'Socket disconnected'}
              </span>
              <span className="inline-flex items-center rounded-full bg-[#f3f4f6] px-3 py-1.5 text-xs font-semibold text-[#374151]">
                {selectedInfo === 'Track Drivers' ? `${activeDrivers.length} drivers listed` : `${mapMarkers.length} map points visible`}
              </span>
              {Object.keys(liveRouteEtaByStopId).length > 0 && (
                <span className="inline-flex items-center rounded-full bg-[#eff6ff] px-3 py-1.5 text-xs font-semibold text-[#1d4ed8]">
                  Live ETA active
                </span>
              )}
              {Object.keys(liveStopStatusById).length > 0 && (
                <span className="inline-flex items-center rounded-full bg-[#ecfdf5] px-3 py-1.5 text-xs font-semibold text-[#15803d]">
                  Stop updates active
                </span>
              )}
              {activeStudentRoutePath.length > 1 && (
                <span className="inline-flex items-center rounded-full bg-[#fdecef] px-3 py-1.5 text-xs font-semibold text-[#c01824]">
                  Student route active
                </span>
              )}
              <span className="inline-flex items-center rounded-full bg-[#f8fafc] px-3 py-1.5 text-xs font-medium text-[#4b5563]">
                Route: {socketDebug.routeJoined || 'not joined'}
              </span>
              {selectedInfo === 'Track Drivers' && selectedDriverSnapshot?.routeId && (
                <span className="inline-flex items-center rounded-full bg-[#eff6ff] px-3 py-1.5 text-xs font-medium text-[#1d4ed8]">
                  Clicked route: {selectedDriverSnapshot.routeId}
                </span>
              )}
              <span className="inline-flex items-center rounded-full bg-[#f8fafc] px-3 py-1.5 text-xs font-medium text-[#4b5563]">
                Terminal: {socketDebug.terminalJoined || 'not joined'}
              </span>
              <span className="inline-flex items-center rounded-full bg-[#f8fafc] px-3 py-1.5 text-xs font-medium text-[#4b5563]">
                Event: {socketDebug.lastEvent}
                {socketDebug.lastEventAt ? ` @ ${socketDebug.lastEventAt.toLocaleTimeString()}` : ''}
              </span>
            </div>
          </div>
          <div className="flex md:flex-row flex-col md:space-y-0 space-y-5 mt-6 border shadow-sm rounded-md space-x-1 relative h-[calc(100vh-270px)] overflow-hidden">
            {/* âœ… Remount fix + scroll fix */}
            <div
              key={selectedInfo}
              className="bg-white w-full md:max-w-[280px] pt-2 h-full overflow-y-auto overscroll-contain"
            >
              <Tabs value={activeTab}>
                {/* Student tabs only when Track School + school selected */}
                {selectedInfo === 'Track School' && selectedSchool && (
                  <TabsHeader
                    className="rounded-none border-b border-blue-gray-50 bg-transparent p-0"
                    indicatorProps={{
                      className: 'bg-transparent border-b-2 border-[#C01824] shadow-none rounded-none',
                    }}
                  >
                    {tabsData.map(({ label, value }) => (
                      <Tab
                        key={value}
                        value={value}
                        onClick={() => setActiveTab(value)}
                        className={activeTab === value ? 'font-bold text-[#C01824]' : ''}
                      >
                        {label}
                      </Tab>
                    ))}
                  </TabsHeader>
                )}

                <TabsBody className="pt-2">
                  {/* TRACK SCHOOL */}
                  {selectedInfo === 'Track School' ? (
                    !selectedSchool ? (
                      loading.schoolManagementSummary ? (
                        <div className="flex items-center justify-center py-8">
                          <Spinner className="h-6 w-6" />
                          <span className="ml-2 text-sm">Loading schools...</span>
                        </div>
                      ) : (() => {
                          const raw =
                            schoolManagementSummary && schoolManagementSummary.length > 0
                              ? schoolManagementSummary.filter((item) => {
                                  const schoolTerminalId = item.TerminalId || item.terminalId;
                                  // âœ… If terminal not selected => show ALL schools
                                  const matchTerminal = selectedTab ? schoolTerminalId === selectedTab : true;

                                  const hasInstitute = !!(item.InstituteId != null && item.InstituteName);
                                  const noDriverOrPerson = !(
                                    item.driverId ||
                                    item.role === 'driver' ||
                                    item.vehicleId ||
                                    item.numberPlate ||
                                    item.driverName ||
                                    item.DriverName ||
                                    item.busNo ||
                                    item.vehicleName ||
                                    (item.firstName && item.lastName)
                                  );

                                  return matchTerminal && hasInstitute && noDriverOrPerson;
                                })
                              : [];

                          return raw.length > 0 ? (
                            raw.map((school, index) => {
                              const instituteId = Array.isArray(school.InstituteId)
                                ? school.InstituteId[0]
                                : typeof school.InstituteId === 'string'
                                ? parseInt(school.InstituteId.split(',')[0])
                                : school.InstituteId;

                              const terminalIdForSchool = school.TerminalId || school.terminalId || null;

                              return (
                                <div key={`school-${instituteId}-${terminalIdForSchool ?? 'all'}-${index}`}>
                                  <Button
                                    className={`flex items-center gap-3 py-3 pl-4 w-full rounded-none bg-[#fff] transition-all ${
                                      selectedSchool?.instituteId === instituteId ? 'bg-[#C01824] text-white' : ''
                                    }`}
                                    onClick={() =>
                                      toggleSchoolPanel({
                                        schoolName: school.InstituteName,
                                        instituteId,
                                        type: school.InstituteType || 'School',
                                        terminalId: terminalIdForSchool,
                                        lat: school.lat ?? school.Lat ?? school.latitude ?? school.Latitude,
                                        lng: school.lng ?? school.Lng ?? school.longitude ?? school.Longitude,
                                        address: school.Address || school.address || '',
                                      })
                                    }
                                  >
                                    <div className="rounded-full w-[43px] h-[43px] bg-gray-300 flex items-center justify-center">
                                      <span className="text-lg font-bold text-gray-600">
                                        {school.InstituteName?.charAt(0)?.toUpperCase() || 'S'}
                                      </span>
                                    </div>
                                    <div
                                      className={`text-start text-base ${
                                        selectedSchool?.instituteId === instituteId ? 'text-white' : 'text-[#2C2F32]'
                                      }`}
                                    >
                                      <h6 className="font-bold text-[16px] capitalize">{school.InstituteName}</h6>
                                      <p className="font-bold text-[14px]">{school.InstituteType || 'School'}</p>
                                    </div>
                                  </Button>
                                  <hr className="h-px bg-gray-200 border-1 dark:bg-gray-800" />
                                </div>
                              );
                            })
                          ) : (
                            <div className="flex items-center justify-center py-8">
                              <span className="text-sm text-gray-500">
                                {selectedTab ? 'No schools found for this terminal' : 'No schools found'}
                              </span>
                            </div>
                          );
                        })()
                    ) : (activeTab === 'onboard' && loadingStudents) ||
                      (activeTab === 'allstudents' && studentsLoading.fetchStudentsByInstitute) ? (
                      <div className="flex items-center justify-center py-8">
                        <Spinner className="h-6 w-6" />
                        <span className="ml-2 text-sm">Loading students...</span>
                      </div>
                    ) : filteredStudentsList.length > 0 ? (
                      filteredStudentsList.map((student, index) => (
                        <div key={`student-${student.studentId}-${index}`}>
                          <Button
                            className={`flex items-center gap-3 py-3 pl-4 w-full rounded-none bg-[#fff] transition-all ${
                              selectedStudent?.studentId === student.studentId
                                ? 'bg-[#C01824] text-white'
                                : 'bg-none hover:bg-[#C01824] group'
                            }`}
                            onClick={() => toggleStudentPanel(student)}
                          >
                            <div className="rounded-full w-[43px] h-[43px] bg-gray-300 flex items-center justify-center">
                              <span className="text-lg font-bold text-gray-600">
                                {student.name?.charAt(0)?.toUpperCase() || 'S'}
                              </span>
                            </div>
                            <div
                              className={`text-start text-base ${
                                selectedStudent?.studentId === student.studentId
                                  ? 'text-white'
                                  : 'text-[#2C2F32] group-hover:text-white'
                              }`}
                            >
                              <h6 className="font-bold text-[16px] capitalize">{student.name}</h6>
                              <p className="font-light text-[14px]">
                                Bus NO. <span className="font-bold">{student.busNo}</span>
                              </p>
                            </div>
                          </Button>
                          <hr className="h-px bg-gray-200 border-1 dark:bg-gray-800" />
                        </div>
                      ))
                    ) : (
                      <div className="flex items-center justify-center py-8">
                        <span className="text-sm text-gray-500">
                          {activeTab === 'onboard' ? 'No students on board' : 'No students found'}
                        </span>
                      </div>
                    )
                  ) : (
                    // TRACK DRIVERS
                    <>
                      {loadingDrivers ? (
                        <div className="flex items-center justify-center py-8">
                          <Spinner className="h-6 w-6" />
                          <span className="ml-2 text-sm">Loading drivers...</span>
                        </div>
                      ) : activeDrivers.length > 0 ? (
                        activeDrivers.map((driver, index) => (
                          <div key={`driver-${driver.driverId}-${index}`}>
                            <Button
                              variant="gradient"
                              className={`flex items-center gap-3 py-3 pl-4 w-full rounded-none transition-all ${
                                selectedStudent?.driverId === driver.driverId
                                  ? 'bg-black text-white'
                                  : 'bg-none hover:bg-black group'
                              }`}
                              onClick={() => handleDriverSelect(driver)}
                            >
                              <div className="rounded-full w-[43px] h-[43px] bg-gray-300 flex items-center justify-center">
                                <span className="text-lg font-bold text-gray-600">
                                  {driver.name?.charAt(0)?.toUpperCase() || 'D'}
                                </span>
                              </div>
                              <div
                                className={`text-start text-base ${
                                  selectedStudent?.driverId === driver.driverId
                                    ? 'text-white'
                                    : 'text-[#2C2F32] group-hover:text-white'
                                }`}
                              >
                                <h6 className="font-bold text-[16px] capitalize">{driver.name}</h6>
                                <p className="font-light text-[14px]">
                                  Bus NO. <span className="font-bold">{driver.busNo}</span>
                                </p>
                              </div>
                            </Button>
                            <hr className="h-px bg-gray-200 border-1 dark:bg-gray-800" />
                          </div>
                        ))
                      ) : (
                        <div className="flex items-center justify-center py-8">
                          <span className="text-sm text-gray-500">No active drivers found</span>
                        </div>
                      )}
                    </>
                  )}
                </TabsBody>
              </Tabs>
            </div>

            {selectedStudent && (
              <div className="absolute md:left-[18rem] left-0 w-full top-0 md:w-full max-w-[370px] rounded-[20px] border border-[#d8dee8] bg-white/98 p-4 shadow-[0_20px_50px_rgba(15,23,42,0.18)] overflow-y-auto z-[500] backdrop-blur">
                {selectedStudent?.role === 'driver' || selectedStudent?.driverId ? (
                  <div className="flex justify-between">
                    <div className="bg-[#DDDDE1] text-[#141516] leading-tight rounded-md px-3 py-1 text-center h-[6vh]">
                      <p className="text-[13px] font-normal">EMPLOYEE ID</p>
                      <p className="text-[14px] font-bold">
                        {selectedStudent.driverId || selectedStudent.busNo}
                      </p>
                    </div>
                    <div className="flex items-center flex-col ps-3 gap-2 w-full bg-none">
                      <div className="rounded-full w-[89px] h-[90px] bg-gray-300 flex items-center justify-center">
                        <span className="text-3xl font-bold text-gray-600">
                          {selectedStudent.name?.charAt(0)?.toUpperCase() || 'D'}
                        </span>
                      </div>
                      <div className="text-center leading-tight text-[#141516] group-hover:text-white">
                        <h6 className="font-bold text-[18px]">{selectedStudent.name}</h6>
                        <p className="font-normal text-[14px]">Driver</p>
                      </div>
                    </div>
                    <div className="bg-[#DDDDE1] text-[#141516] leading-tight rounded-md px-3 py-1 text-center h-[6vh]">
                      <p className="text-[14px] font-normal">BUS NO.</p>
                      <p className="text-[14px] font-bold">
                        {selectedStudent.busNo || selectedStudent.vehicleName || 'N/A'}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      {selectedStudent.imgSrc ? (
                        <img
                          src={selectedStudent.imgSrc}
                          alt={selectedStudent.name}
                          className="h-[64px] w-[64px] rounded-2xl border border-[#dde6f0] object-cover shadow-sm"
                          onError={(event) => {
                            event.currentTarget.style.display = 'none';
                            const sibling = event.currentTarget.nextElementSibling;
                            if (sibling) sibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      <div
                        className="h-[64px] w-[64px] items-center justify-center rounded-2xl border border-[#dbe4ef] bg-[linear-gradient(135deg,#eef3ff,#dfe9ff)] shadow-sm"
                        style={{ display: selectedStudent.imgSrc ? 'none' : 'flex' }}
                      >
                        <span className="text-[24px] font-extrabold text-[#36518c]">
                          {selectedStudent.name?.charAt(0)?.toUpperCase() || 'S'}
                        </span>
                      </div>
                      <div className="min-w-0 leading-tight text-[#141516]">
                        <h6 className="truncate font-bold text-[20px]">{selectedStudent.name}</h6>
                        <p className="pt-1 text-[13px] font-medium uppercase tracking-[0.12em] text-[#7b8794]">Student</p>
                      </div>
                    </div>
                    <div className="min-w-[74px] rounded-2xl bg-[#edf0f4] px-3 py-2 text-center text-[#141516] shadow-sm">
                      <p className="text-[11px] font-semibold tracking-[0.12em] text-[#6b7280]">BUS NO.</p>
                      <p className="pt-1 text-[18px] font-extrabold leading-tight">{selectedStudent.busNo}</p>
                    </div>
                  </div>
                )}

                {selectedStudent?.role === 'driver' || selectedStudent?.driverId ? (
                  selectedStudent.currentLocation && (
                    <div className="text-black pt-3">
                      <p className="text-[13.5px] font-medium">Current Location</p>
                      <p className="text-[14px] font-bold">
                        Lat: {selectedStudent.currentLocation.latitude?.toFixed(6)}, Lng:{' '}
                        {selectedStudent.currentLocation.longitude?.toFixed(6)}
                      </p>
                      {selectedStudent.currentLocation.speed && (
                        <p className="text-[13px] mt-1">
                          Speed: {selectedStudent.currentLocation.speed} km/h
                        </p>
                      )}
                      {selectedStudent.routeName && (
                        <p className="text-[13px] mt-1">Route: {selectedStudent.routeName}</p>
                      )}
                    </div>
                  )
                ) : (
                  <div className="mt-4 space-y-3">
                    {selectedStudent?.pickupLocation && (
                      <div className="rounded-2xl border border-[#edf1f5] bg-[#f8fafc] px-4 py-3 text-black">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#7b8794]">Pickup Location</p>
                        <p className="pt-1 text-[15px] font-bold leading-snug">{selectedStudent.pickupLocation}</p>
                      </div>
                    )}
                    {selectedStudent?.dropoffLocation && (
                      <div className="rounded-2xl border border-[#edf1f5] bg-[#f8fafc] px-4 py-3 text-black">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#7b8794]">Dropoff Location</p>
                        <p className="pt-1 text-[15px] font-bold leading-snug">{selectedStudent.dropoffLocation}</p>
                      </div>
                    )}
                    {selectedStudent?.status && (
                      <div className="rounded-2xl border border-[#edf1f5] bg-[#f8fafc] px-4 py-3 text-black">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#7b8794]">Status</p>
                        <p className="pt-1 text-[15px] font-bold">{selectedStudent.status}</p>
                      </div>
                    )}
                  </div>
                )}

                <div className="mt-4 h-full max-h-[570px] overflow-y-auto rounded-[18px] border border-[#d9e0e7] bg-[#fcfdff] p-3">
                  {tripDetails.map((trip, index) => (
                    <div key={index} className="rounded-[18px] bg-[#0f172a] p-4 text-white leading-tight shadow-sm">
                      <div className="flex items-start justify-between gap-4">
                        <div className="min-w-0 flex-1 space-y-1">
                          <div className="flex pb-2 space-x-2 text-white/80 font-semibold text-[11.5px]">
                            <p>{trip.time}</p>
                            <p>{trip.date}</p>
                          </div>
                          {[
                            selectedStudent?.pickupLocation || trip.places?.[0],
                            selectedStudent?.dropoffLocation || trip.places?.[1],
                          ].filter(Boolean).map((place, idx) => (
                            <div key={`${place}-${idx}`} className="flex items-center space-x-2">
                              <img src={trip.iconSrc} className="w-4 h-4" alt="not found" />
                              <p className="text-[13.5px] text-white font-semibold leading-snug break-words">{place}</p>
                            </div>
                          ))}
                        </div>
                        <div className="mt-4 min-w-[92px] text-end text-white">
                          <p className="text-[11.5px] font-semibold text-white/75">ROUTE NO.</p>
                          <p className="whitespace-nowrap text-[24px] font-extrabold tracking-tight">{selectedStudent?.routeNo || 'N/A'}</p>
                        </div>
                      </div>
                    </div>
                  ))}

                  {tripStages
                    .filter((stage) => ['Pickup', 'Drop-off'].includes(stage.label))
                    .map((stage, index) => (
                    <div key={index} className="my-3 flex items-center space-x-3 rounded-2xl border border-[#e7edf4] bg-white px-3 py-3 shadow-sm">
                      <div className="flex w-[82px] flex-col items-center justify-center rounded-2xl bg-[#eef2f6] py-3">
                        <img src={stage.iconSrc} className="w-[43px] h-[23px]" alt="not found" />
                        <p className="pt-2 text-[12px] font-bold uppercase tracking-[0.08em]">{stage.label}</p>
                      </div>
                      <div className="flex min-w-0 flex-1 flex-col items-start justify-start text-black">
                        <p className="text-[11.5px] font-semibold text-[#7b8794]">{stage.time}</p>
                        <p className="text-[16px] font-bold leading-snug">
                          {stage.label === 'Pickup'
                            ? (selectedStudent?.pickupLocation || stage.location)
                            : (selectedStudent?.dropoffLocation || stage.location)}
                        </p>
                        <p className="text-[13px] font-medium text-[#4b5563] leading-snug">
                          {stage.label === 'Pickup'
                            ? (selectedStudent?.pickupLocation || stage.address)
                            : (selectedStudent?.dropoffLocation || stage.address)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  className="absolute right-3 top-3 rounded-full bg-[#eef2f6] p-2 text-gray-700 transition-all hover:bg-[#dde5ee]"
                  onClick={handleClosePanel}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-700" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            )}

            {/* âœ… NEW: Vehicle Detail Panel (when marker clicked) */}
            {selectedVehicle && isVehiclePanelOpen && (
              <div className="absolute md:left-[18rem] left-0 w-full top-0 md:w-full max-w-[370px] bg-white shadow-lg rounded-lg p-4 overflow-y-auto z-[500] max-h-full">
                {loadingVehicleDetail ? (
                  <div className="flex items-center justify-center py-8">
                    <Spinner className="h-6 w-6" />
                    <span className="ml-2 text-sm">Loading vehicle details...</span>
                  </div>
                ) : (
                  <>
                    {/* âœ… Use vehicleDetail if available, otherwise fallback to selectedVehicle */}
                    {(() => {
                      // Merge data: prefer vehicleDetail, fallback to selectedVehicle
                      const v = vehicleDetail || {};
                      const sv = selectedVehicle || {};
                      const loc = sv.currentLocation || {};

                      const vehicleName = v.VehicleName || sv.vehicleName || 'Unknown Vehicle';
                      const numberPlate = v.NumberPlate || sv.numberPlate || 'N/A';
                      const status = v.Status || sv.status || loc.Status || 'Unknown';
                      const driverName = v.driverName || sv.driverName || 'N/A';
                      const routeName = v.RouteName || sv.routeName;
                      const lat = v.Latitude || loc.latitude;
                      const lng = v.Longitude || loc.longitude;
                      const speed = v.Speed ?? loc.speed;
                      const timestamp = v.Timestamp || loc.timestamp;

                      return (
                        <>
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="text-xl font-bold text-gray-900">{vehicleName}</h3>
                              <p className="text-sm text-gray-600">{numberPlate}</p>
                            </div>
                            <div
                              className={`px-3 py-1 rounded-full text-xs font-bold text-white ${
                                (status || '').toLowerCase().includes('transit')
                                  ? 'bg-green-500'
                                  : (status || '').toLowerCase().includes('stop')
                                  ? 'bg-yellow-500'
                                  : 'bg-gray-400'
                              }`}
                            >
                              {status}
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div className="bg-gray-50 p-3 rounded-lg">
                              <p className="text-xs font-medium text-gray-500 uppercase">Driver</p>
                              <p className="text-sm font-bold text-gray-900">{driverName}</p>
                            </div>

                            {routeName && (
                              <div className="bg-gray-50 p-3 rounded-lg">
                                <p className="text-xs font-medium text-gray-500 uppercase">Route</p>
                                <p className="text-sm font-bold text-gray-900">{routeName}</p>
                                <p className="mt-1 text-[11px] font-semibold text-blue-700">
                                  {vehiclePathSource === 'roads' && 'Roads API Active'}
                                  {vehiclePathSource === 'snapping' && 'Roads API request in progress'}
                                  {vehiclePathSource === 'roads_failed' && 'Raw GPS fallback: Roads API failed'}
                                  {vehiclePathSource === 'raw' && 'Raw GPS path loaded'}
                                  {vehiclePathSource === 'not_enough_points' && 'Roads API skipped: not enough history points'}
                                  {vehiclePathSource === 'missing_key' && 'Roads API skipped: API key missing'}
                                  {vehiclePathSource === 'history_failed' && 'Vehicle history request failed'}
                                </p>
                              </div>
                            )}

                            {lat && lng && (
                              <div className="bg-gray-50 p-3 rounded-lg">
                                <p className="text-xs font-medium text-gray-500 uppercase">Current Location</p>
                                <p className="text-sm font-bold text-gray-900">
                                  {Number(lat).toFixed(6)}, {Number(lng).toFixed(6)}
                                </p>
                              </div>
                            )}

                            {speed !== undefined && speed !== null && (
                              <div className="bg-gray-50 p-3 rounded-lg">
                                <p className="text-xs font-medium text-gray-500 uppercase">Speed</p>
                                <p className="text-sm font-bold text-gray-900">{speed} km/h</p>
                              </div>
                            )}

                            {timestamp && (
                              <div className="bg-gray-50 p-3 rounded-lg">
                                <p className="text-xs font-medium text-gray-500 uppercase">Last Update</p>
                                <p className="text-sm font-bold text-gray-900">
                                  {new Date(timestamp).toLocaleString()}
                                </p>
                              </div>
                            )}

                            {sv.studentsOnBoard !== undefined && (
                              <div className="bg-gray-50 p-3 rounded-lg">
                                <p className="text-xs font-medium text-gray-500 uppercase">Students</p>
                                <p className="text-sm font-bold text-gray-900">
                                  {sv.studentsOnBoard || 0} / {sv.totalStudents || 0} on board
                                </p>
                              </div>
                            )}

                            {/* Route Stop List with ETA — liveRouteStops first, fallback to routeMap stops */}
                            {(() => {
                              const panelStops = liveRouteStops.length > 0
                                ? liveRouteStops
                                : (selectedRouteMap?.stops || []);
                              if (panelStops.length === 0) return null;
                              return (
                              <div className="rounded-lg border border-[#e2e8f0] overflow-hidden">
                                <p className="text-xs font-semibold uppercase tracking-wide bg-[#f1f5f9] px-3 py-2 text-[#475569]">
                                  Route Stops ({panelStops.length})
                                </p>
                                <div className="max-h-[260px] overflow-y-auto divide-y divide-[#f1f5f9]">
                                  {[...panelStops]
                                    .sort((a, b) => Number(a.stopOrder ?? 0) - Number(b.stopOrder ?? 0))
                                    .map((stop, idx) => {
                                      const sid = Number(stop.stopId ?? stop.StopId ?? 0);
                                      const liveEta = sid ? liveRouteEtaByStopId[sid] : undefined;
                                      const liveStatus = sid ? liveStopStatusById[sid] : undefined;
                                      const isDone = liveStatus === 'departed';
                                      const isActive = liveStatus === 'arrived';
                                      const etaDisplay = liveEta != null
                                        ? formatETA(liveEta)
                                        : formatStopTime(stop.estimatedArrivalTime);
                                      return (
                                        <div
                                          key={sid || idx}
                                          className={`flex items-center gap-3 px-3 py-2.5 ${
                                            isActive ? 'bg-orange-50' : isDone ? 'bg-green-50' : 'bg-white'
                                          }`}
                                        >
                                          {/* Status dot */}
                                          <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white ${
                                            isDone ? 'bg-green-500' : isActive ? 'bg-orange-500' : 'bg-[#94a3b8]'
                                          }`}>
                                            {isDone ? '✓' : isActive ? '●' : String(stop.stopOrder ?? idx + 1)}
                                          </div>
                                          {/* Stop info */}
                                          <div className="flex-1 min-w-0">
                                            <p className={`text-[13px] font-semibold truncate ${isDone ? 'text-green-700 line-through' : 'text-[#1e293b]'}`}>
                                              {stop.stopName || `Stop ${idx + 1}`}
                                            </p>
                                            {etaDisplay && (
                                              <p className={`text-[11px] font-medium ${
                                                isActive ? 'text-orange-600' : isDone ? 'text-green-600' : liveEta != null ? 'text-blue-600' : 'text-[#64748b]'
                                              }`}>
                                                {isActive ? 'Bus is here' : isDone ? 'Completed' : etaDisplay}
                                              </p>
                                            )}
                                          </div>
                                        </div>
                                      );
                                    })}
                                </div>
                              </div>
                              );
                            })()}
                          </div>
                        </>
                      );
                    })()}
                  </>
                )}

                <button
                  className="absolute top-2 right-2 p-2 bg-gray-200 rounded-lg transition-all hover:bg-gray-300"
                  onClick={handleCloseVehiclePanel}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-700" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            )}

            <div className="relative h-full w-auto overflow-hidden md:h-full md:w-full">
              {mapLoadError ? (
                <div className="flex h-full w-full flex-col items-center justify-center bg-red-50 p-6 text-center">
                  <p className="font-bold text-red-600">Map Loading Error</p>
                  <p className="mt-2 text-gray-600">Please check your Google Maps API key</p>
                </div>
              ) : !isMapLoaded ? (
                <div className="flex h-full w-full items-center justify-center bg-gray-100">
                  <Spinner className="h-8 w-8" />
                  <span className="ml-3 text-sm">Loading map...</span>
                </div>
              ) : (
                <GoogleMap
                  mapContainerStyle={{ width: '100%', height: '100%' }}
                  center={mapInitialCenter}
                  zoom={initialUsZoom}
                  onLoad={onMapLoad}
                  onUnmount={onMapUnmount}
                  options={{
                    disableDefaultUI: false,
                    zoomControl: true,
                    mapTypeControl: false,
                    streetViewControl: false,
                    fullscreenControl: true,
                    gestureHandling: 'greedy',
                  }}
                >
                  {mapMarkers.map((marker) => {
                    const isGoogleReady = !!window.google?.maps?.Size && !!window.google?.maps?.Point;
                    const studentLabel = marker.studentData?.name?.charAt(0)?.toUpperCase() || 'S';
                    const pickupPinSvg = createStudentPinSvg({
                      label: studentLabel,
                      fill: '#2563eb',
                      stroke: '#1d4ed8',
                      textFill: '#1e3a8a',
                    });
                    const dropoffPinSvg = createStudentPinSvg({
                      label: studentLabel,
                      fill: '#22c55e',
                      stroke: '#15803d',
                      textFill: '#166534',
                    });
                    const studentPinSvg = createStudentPinSvg({
                      label: studentLabel,
                      fill: '#f97316',
                      stroke: '#c2410c',
                      textFill: '#9a3412',
                    });
                    const stopLabel = String(
                      marker.stopData?.stopOrder ??
                        marker.stopData?.StopOrder ??
                        marker.stopData?.stopName ??
                        marker.stopData?.StopName ??
                        'T'
                    )
                      .trim()
                      .charAt(0)
                      .toUpperCase();
                    const stopMarkerId = Number(marker.stopData?.stopId ?? marker.stopData?.StopId ?? 0);
                    const stopEtaMin = stopMarkerId ? liveRouteEtaByStopId[stopMarkerId] : undefined;
                    const stopLiveStatus = stopMarkerId ? liveStopStatusById[stopMarkerId] : undefined;
                    // Stop color: departed=green, arrived(active)=orange pulse, ETA=blue, upcoming=dark
                    const stopFill =
                      stopLiveStatus === 'departed' ? '#16a34a'
                      : stopLiveStatus === 'arrived' ? '#f97316'
                      : stopEtaMin != null ? '#1d4ed8'
                      : '#0f172a';
                    const stopStroke =
                      stopLiveStatus === 'departed' ? '#166534'
                      : stopLiveStatus === 'arrived' ? '#c2410c'
                      : stopEtaMin != null ? '#1e40af'
                      : '#334155';
                    const stopPinLabel =
                      stopLiveStatus === 'departed' ? '✓'
                      : stopEtaMin != null ? `${stopEtaMin}m`
                      : stopLabel;
                    const routeStopPinSvg = createStudentPinSvg({
                      label: stopPinLabel,
                      fill: stopFill,
                      stroke: stopStroke,
                      textFill: '#ffffff',
                    });
                    const markerLabelText =
                      marker.type === 'route-start'
                        ? 'Start'
                        : marker.type === 'route-end'
                        ? 'Dropoff'
                        : marker.type === 'route-stop'
                        ? marker.stopData?.stopName || `Stop ${marker.stopData?.stopOrder || ''}`.trim()
                        : '';

                    const markerIcon =
                      marker.type === 'school'
                        ? SCHOOL_PIN_SVG
                        : marker.type === 'route-start'
                        ? ROUTE_START_PIN_SVG
                        : marker.type === 'route-end'
                        ? ROUTE_END_PIN_SVG
                        : marker.type === 'route-stop'
                        ? routeStopPinSvg
                        : marker.type === 'selected-student-pickup'
                        ? pickupPinSvg
                        : marker.type === 'selected-student-dropoff'
                        ? dropoffPinSvg
                        : marker.type === 'student'
                        ? studentPinSvg
                        : getBusIcon(marker.status);

                    const isStudentDot =
                      marker.type === 'student' ||
                      marker.type === 'selected-student-pickup' ||
                      marker.type === 'selected-student-dropoff' ||
                      marker.type === 'route-start' ||
                      marker.type === 'route-end' ||
                      marker.type === 'route-stop';
                    const iconSize = marker.type === 'school' ? 40 : isStudentDot ? 44 : 40;
                    const iconHeight = marker.type === 'school' ? 52 : isStudentDot ? 58 : 40;

                    const iconConfig = {
                      url: markerIcon,
                      scaledSize: isGoogleReady ? new window.google.maps.Size(iconSize, iconHeight) : undefined,
                      anchor: isGoogleReady ? new window.google.maps.Point(iconSize / 2, iconHeight) : undefined,
                    };

                    return (
                      <MarkerF
                        key={marker.id}
                        position={marker.position}
                        title={marker.title}
                        icon={iconConfig}
                        label={
                          markerLabelText
                            ? {
                                text: markerLabelText,
                                color: '#0f172a',
                                fontSize: '12px',
                                fontWeight: '700',
                                className: 'route-map-marker-label',
                              }
                            : undefined
                        }
                        onClick={() => {
                          if (marker.type === 'route-stop' || marker.type === 'route-start' || marker.type === 'route-end') {
                            setSelectedMapStopInfo({
                              id: marker.id,
                              position: marker.position,
                              order:
                                marker.stopData?.stopOrder ||
                                marker.stopData?.StopOrder ||
                                null,
                              title:
                                marker.stopData?.stopName ||
                                marker.stopData?.StopName ||
                                marker.title ||
                                'Route Stop',
                              eta:
                                stopEtaMin != null
                                  ? formatETA(stopEtaMin)
                                  : formatStopTime(
                                      marker.stopData?.estimatedArrivalTime ||
                                        marker.stopData?.EstimatedArrivalTime
                                    ),
                              status:
                                stopLiveStatus === 'departed'
                                  ? 'Completed'
                                  : stopLiveStatus === 'arrived'
                                  ? 'Bus is here'
                                  : 'Upcoming',
                            });
                            return;
                          }

                          if (marker.schoolData) {
                            setSelectedMapStopInfo({
                              id: marker.id,
                              position: marker.position,
                              order: null,
                              title: marker.schoolData?.schoolName || marker.title || 'School',
                              eta: marker.schoolData?.address || 'School location',
                              status: 'School',
                            });
                            return;
                          }

                          if (marker.studentData) {
                            setSelectedVehicle(null);
                            setVehicleDetail(null);
                            setRawVehiclePath([]);
                            setVehiclePath([]);
                            setVehiclePathSource('idle');
                            toggleStudentPanel(marker.studentData);
                            return;
                          }

                          if (marker.vehicleData) {
                            setSelectedMapStopInfo(null);
                            handleVehicleClick(marker.vehicleData);
                          }
                        }}
                        onDblClick={() => {
                          if (map) {
                            map.panTo(marker.position);
                            map.setZoom(Math.min((map.getZoom() || 12) + 4, 18));
                          }
                        }}
                      />
                    );
                  })}

                  {selectedMapStopInfo && (
                    <InfoWindowF
                      position={selectedMapStopInfo.position}
                      onCloseClick={() => setSelectedMapStopInfo(null)}
                      options={{
                        pixelOffset: window.google?.maps?.Size
                          ? new window.google.maps.Size(0, -36)
                          : undefined,
                      }}
                    >
                      <div className="min-w-[220px] rounded-[20px] border border-[#dbe4ee] bg-white px-3 py-3 shadow-[0_18px_40px_rgba(15,23,42,0.18)]">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex min-w-0 items-start gap-2.5">
                            <div className="mt-0.5 h-2.5 w-2.5 rounded-full bg-[#111827]" />
                            <div className="min-w-0">
                              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#94a3b8]">
                                Route Stop
                              </p>
                              <p className="mt-0.5 text-[14px] font-extrabold leading-tight text-[#0f172a]">
                                {selectedMapStopInfo.title}
                              </p>
                            </div>
                          </div>
                          {selectedMapStopInfo.order ? (
                            <span className="inline-flex h-7 min-w-[28px] items-center justify-center rounded-full bg-[#111827] px-2 text-[11px] font-extrabold text-white">
                              {selectedMapStopInfo.order}
                            </span>
                          ) : null}
                        </div>
                        <div className="mt-3 flex items-center gap-2">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-bold ${
                              selectedMapStopInfo.status === 'Completed'
                                ? 'bg-green-100 text-green-700'
                                : selectedMapStopInfo.status === 'Bus is here'
                                ? 'bg-orange-100 text-orange-700'
                                : selectedMapStopInfo.status === 'School'
                                ? 'bg-red-100 text-red-700'
                                : 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {selectedMapStopInfo.status}
                          </span>
                        </div>
                        <div className="mt-3 rounded-2xl bg-[#f8fafc] px-3 py-2.5">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#94a3b8]">
                            Estimated Arrival
                          </p>
                          <p className="mt-1 text-[12px] font-bold text-[#1e293b]">
                            {selectedMapStopInfo.eta || 'ETA unavailable'}
                          </p>
                        </div>
                      </div>
                    </InfoWindowF>
                  )}

                  {activeRouteDisplayPath.length > 1 && (
                    <PolylineF
                      path={activeRouteDisplayPath}
                      options={{
                        strokeColor: '#111827',
                        strokeOpacity: 0.38,
                        strokeWeight: 6,
                        clickable: false,
                        geodesic: true,
                        zIndex: 3,
                      }}
                    />
                  )}

                  {remainingRoutePath.length > 1 && (
                    <PolylineF
                      path={remainingRoutePath}
                      options={{
                        strokeColor: '#111827',
                        strokeOpacity: 0.96,
                        strokeWeight: 7,
                        clickable: false,
                        geodesic: true,
                        zIndex: 5,
                      }}
                    />
                  )}

                  {busToNextStopPath.length > 1 && (
                    <PolylineF
                      path={busToNextStopPath}
                      options={{
                        strokeColor: '#111827',
                        strokeOpacity: 0.96,
                        strokeWeight: 7,
                        clickable: false,
                        geodesic: true,
                        zIndex: 6,
                      }}
                    />
                  )}

                  {activeStudentRoutePath.length > 1 && (
                    <PolylineF
                      path={activeStudentRoutePath}
                      options={{
                        strokeColor: '#C01824',
                        strokeOpacity: 0.94,
                        strokeWeight: 6,
                        clickable: false,
                        geodesic: true,
                        zIndex: 6,
                      }}
                    />
                  )}
                </GoogleMap>
              )}
            </div>
          </div>

          <div className="mt-2 rounded-2xl border border-[#d7dce3] bg-white px-4 py-3 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <span className="inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1.5 font-semibold text-green-700">
                  <span className="h-2.5 w-2.5 rounded-full bg-green-500"></span>
                  {vehicleStatusCounts.inTransit} In Transit
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-yellow-50 px-3 py-1.5 font-semibold text-yellow-700">
                  <span className="h-2.5 w-2.5 rounded-full bg-yellow-500"></span>
                  {vehicleStatusCounts.atStop} At Stop
                </span>
                <span className="inline-flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1.5 font-semibold text-gray-700">
                  <span className="h-2.5 w-2.5 rounded-full bg-gray-400"></span>
                  {vehicleStatusCounts.idle} Idle
                </span>
                {freshnessMeta.secondsSinceUpdate !== null && freshnessMeta.secondsSinceUpdate > 30 && (
                  <span className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1.5 font-semibold text-red-700">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-500"></span>
                    Location feed looks stale
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {lastUpdated && (
                  <span className="rounded-full bg-[#f8fafc] px-3 py-1.5 text-xs font-medium text-[#6b7280]">
                    Last sync: {lastUpdated.toLocaleTimeString()}
                  </span>
                )}
                <button
                  onClick={togglePolling}
                  className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold transition-colors ${
                    isPollingEnabled
                      ? 'bg-green-100 text-green-700 hover:bg-green-200'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <span className={`h-2.5 w-2.5 rounded-full ${isPollingEnabled ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></span>
                  {isPollingEnabled ? 'Auto refresh on' : 'Auto refresh paused'}
                </button>
                <button
                  onClick={() => fetchAllActiveVehicles()}
                  disabled={loadingAllVehicles}
                  className="flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1.5 text-xs font-bold text-blue-700 transition-colors hover:bg-blue-200 disabled:opacity-50"
                >
                  {loadingAllVehicles ? (
                    <Spinner className="h-3 w-3" />
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                    </svg>
                  )}
                  Refresh now
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default RealTimeTracking;




