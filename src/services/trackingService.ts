import { apiClient } from "@/configs/api";
import { ApiResponse } from "@/types/api";

// ============================================
// Interfaces for Tracking APIs
// ============================================

export interface CurrentLocation {
  latitude: number;
  longitude: number;
  speed: number;
  heading: number;
  timestamp: string;
}

export interface VehicleTracking {
  vehicleId: number;
  vehicleName: string;
  numberPlate: string;
  driverId: number;
  driverName: string;
  terminalId?: number;
  routeId?: number;
  routeName?: string;
  currentLocation: CurrentLocation;
  studentsOnBoard?: number;
  totalStudents?: number;
  status: string;
  instituteId?: number;
  instituteName?: string;
}

const pickFirst = <T,>(...values: T[]): T | undefined =>
  values.find((value) => value !== undefined && value !== null);

const toNumber = (value: any): number | undefined => {
  if (value === undefined || value === null || value === "") return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

const normalizeCurrentLocation = (source: any): CurrentLocation | undefined => {
  if (!source) return undefined;

  const loc = source.currentLocation || source.CurrentLocation || source;
  const latitude = toNumber(
    pickFirst(
      loc.latitude,
      loc.Latitude,
      source.latitude,
      source.Latitude
    )
  );
  const longitude = toNumber(
    pickFirst(
      loc.longitude,
      loc.Longitude,
      source.longitude,
      source.Longitude
    )
  );

  if (latitude === undefined || longitude === undefined) return undefined;

  return {
    latitude,
    longitude,
    speed: toNumber(pickFirst(loc.speed, loc.Speed, source.speed, source.Speed)) || 0,
    heading:
      toNumber(pickFirst(loc.heading, loc.Heading, source.heading, source.Heading)) || 0,
    timestamp:
      pickFirst(loc.timestamp, loc.Timestamp, source.timestamp, source.Timestamp, "") || "",
  };
};

const normalizeVehicleTracking = (vehicle: any): VehicleTracking => {
  const currentLocation = normalizeCurrentLocation(vehicle);
  return {
    vehicleId:
      toNumber(pickFirst(vehicle.vehicleId, vehicle.VehicleId, vehicle.BusId, vehicle.id)) || 0,
    vehicleName:
      pickFirst(
        vehicle.vehicleName,
        vehicle.VehicleName,
        vehicle.busName,
        vehicle.name,
        vehicle.Name,
        "Unknown Vehicle"
      ) || "Unknown Vehicle",
    numberPlate:
      pickFirst(
        vehicle.numberPlate,
        vehicle.NumberPlate,
        vehicle.busNumber,
        vehicle.registrationNumber,
        "N/A"
      ) || "N/A",
    driverId:
      toNumber(pickFirst(vehicle.driverId, vehicle.DriverId, vehicle.employeeId, vehicle.EmployeeId)) ||
      0,
    driverName:
      pickFirst(
        vehicle.driverName,
        vehicle.DriverName,
        vehicle.assignedDriverName,
        vehicle.employeeName,
        "Unknown Driver"
      ) || "Unknown Driver",
    terminalId: toNumber(pickFirst(vehicle.terminalId, vehicle.TerminalId)),
    routeId: toNumber(pickFirst(vehicle.routeId, vehicle.RouteId)),
    routeName: pickFirst(vehicle.routeName, vehicle.RouteName),
    currentLocation: currentLocation as CurrentLocation,
    studentsOnBoard: toNumber(
      pickFirst(vehicle.studentsOnBoard, vehicle.StudentsOnBoard, vehicle.onBoardCount)
    ),
    totalStudents: toNumber(
      pickFirst(vehicle.totalStudents, vehicle.TotalStudents, vehicle.capacity)
    ),
    status:
      pickFirst(vehicle.status, vehicle.Status, vehicle.tripStatus, vehicle.busStatus, "Unknown") ||
      "Unknown",
    instituteId: toNumber(pickFirst(vehicle.instituteId, vehicle.InstituteId, vehicle.schoolId)),
    instituteName: pickFirst(vehicle.instituteName, vehicle.InstituteName, vehicle.schoolName),
  };
};

const normalizeRouteMapPoint = (source: any): RouteMapPoint | null => {
  if (!source) return null;

  if (typeof source === "string") {
    return {
      latitude: 0,
      longitude: 0,
      address: source,
      name: source,
    };
  }

  const latitude = toNumber(
    pickFirst(source.latitude, source.Latitude, source.lat, source.Lat)
  );
  const longitude = toNumber(
    pickFirst(source.longitude, source.Longitude, source.lng, source.Lng)
  );

  return {
    latitude: latitude ?? 0,
    longitude: longitude ?? 0,
    address: pickFirst(source.address, source.Address, source.location, source.Location),
    name: pickFirst(source.name, source.Name, source.label, source.Label),
  };
};

export interface StudentOnBoard {
  studentId: number;
  studentName: string;
  pickupLocation: string;
  dropoffLocation?: string;
  pickupTime?: string;
  estimatedDropoff?: string;
  status?: string;
}

export interface StudentsOnBoardResponse {
  routeId: number;
  studentsOnBoard: StudentOnBoard[];
  totalStudents: number;
  onBoardCount: number;
  pickedUpCount: number;
  droppedOffCount: number;
}

// Single vehicle location detail
export interface VehicleLocationDetail {
  TrackingId: number;
  VehicleId: number;
  VehicleName: string;
  NumberPlate: string;
  Latitude: number;
  Longitude: number;
  Speed: number;
  Heading: number;
  Timestamp: string;
  driverId: number;
  driverName: string;
  RouteId?: number;
  RouteName?: string;
  Status: string;
}

// Vehicle history point (for polyline)
export interface VehicleHistoryPoint {
  TrackingId: number;
  VehicleId: number;
  Latitude: number;
  Longitude: number;
  Speed: number;
  Heading: number;
  Timestamp: string;
}

export interface VehicleHistoryResponse {
  data: VehicleHistoryPoint[];
  total: number;
  limit: number;
}

// Live route tracking
export interface NextStop {
  stopId: number;
  stopName: string;
  latitude: number;
  longitude: number;
  etaMinutes?: number | null;
  estimatedArrival?: string;
}

export interface LiveRouteData {
  routeId: number;
  routeName: string;
  routeNumber?: string;
  vehicleId: number;
  vehicleName: string;
  driverId: number;
  driverName: string;
  currentLocation: CurrentLocation;
  nextStop?: NextStop;
  studentsOnBoard: StudentOnBoard[];
  totalStudents: number;
  studentsOnBoardCount: number;
  status: string;
  routeProgress?: number;
}

// Driver location
export interface DriverLocation {
  driverId: number;
  driverName: string;
  employeeId: string;
  vehicleId: number;
  vehicleName: string;
  numberPlate: string;
  currentLocation: {
    TrackingId: number;
    VehicleId: number;
    Latitude: number;
    Longitude: number;
    Speed: number;
    Heading: number;
    Timestamp: string;
    Status: string;
  };
  routeId?: number;
  routeName?: string;
  status: string;
}

export interface DriverActiveRoute {
  routeId?: number | null;
  routeName?: string;
  vehicleId?: number | null;
  vehicleName?: string;
  busNumber?: string;
  numberPlate?: string;
  terminalId?: number | null;
  currentLocation?: CurrentLocation | null;
}

// Route history (replay)
export interface RouteHistoryData {
  routeId: number;
  routeName: string;
  tripId?: number;
  startTime?: string;
  endTime?: string;
  actualDistance?: number;
  status?: string;
  trackingPoints: VehicleHistoryPoint[];
  stopsCompleted?: number;
  totalStops?: number;
}

export interface RouteMapPoint {
  latitude: number;
  longitude: number;
  address?: string;
  name?: string;
}

export interface RouteMapStop extends RouteMapPoint {
  stopId?: number | null;
  stopName?: string;
  stopAddress?: string;
  stopOrder?: number;
  stopType?: string;
  estimatedArrivalTime?: string | null;
  isDropoff?: boolean;
  // From /live endpoint — stop completion status
  arrivedAt?: string | null;
  departedAt?: string | null;
}

export interface RouteMapData {
  routeId?: number;
  routeName?: string;
  routeNumber?: string;
  routeType?: string;
  school?: RouteMapPoint | null;
  startLocation?: RouteMapPoint | null;
  endLocation?: RouteMapPoint | null;
  stops: RouteMapStop[];
}

const resolveTrackingRouteType = (source: any, fallbackType: string = "AM") => {
  const rawType = String(
    pickFirst(
      source?.routeType,
      source?.RouteType,
      source?.type,
      source?.Type,
      source?.assignmentType,
      source?.AssignmentType,
      fallbackType
    ) || fallbackType
  ).toUpperCase();

  return rawType === "PM" ? "PM" : "AM";
};

// ============================================
// Tracking Service Functions
// ============================================

export const trackingService = {
  /**
   * 4.7 Get Active Vehicles Tracking (Vendor Only)
   * GET /tracking/vehicles/active
   */
  getActiveVehicles: async (params?: {
    terminalId?: number;
    status?: string;
  }): Promise<ApiResponse<VehicleTracking[]>> => {
    const queryParams = new URLSearchParams();
    if (params?.terminalId) queryParams.append("terminalId", params.terminalId.toString());
    if (params?.status) queryParams.append("status", params.status);

    const queryString = queryParams.toString();
    const url = `/tracking/vehicles/active${queryString ? `?${queryString}` : ""}`;

    const response = await apiClient.get(url);
    const rawData = response.data?.data || response.data || [];
    return {
      ok: true,
      data: Array.isArray(rawData) ? rawData.map(normalizeVehicleTracking) : [],
    };
  },

  /**
   * 4.8 Get Terminal Vehicles Tracking (Vendor Only)
   * GET /tracking/terminals/:terminalId/vehicles
   */
  getTerminalVehicles: async (terminalId: number): Promise<ApiResponse<VehicleTracking[]>> => {
    const response = await apiClient.get(`/tracking/terminals/${terminalId}/vehicles`);
    const rawData = response.data?.data || response.data || [];
    return {
      ok: true,
      data: Array.isArray(rawData) ? rawData.map(normalizeVehicleTracking) : [],
    };
  },

  /**
   * 4.6 Get School Vehicles Tracking (Vendor Only)
   * School portal vehicles
   * GET /school/buses
   */
  getSchoolVehicles: async (
    schoolId: number,
    terminalId?: number
  ): Promise<ApiResponse<VehicleTracking[]>> => {
    const response = await apiClient.get(`/school/buses`);
    const rawData = response.data?.data || response.data || [];
    const normalized = Array.isArray(rawData) ? rawData.map(normalizeVehicleTracking) : [];
    const filtered =
      schoolId && normalized.some((item) => item.instituteId != null)
        ? normalized.filter((item) => item.instituteId === schoolId)
        : normalized;

    return {
      ok: true,
      data: terminalId
        ? filtered.filter((item) =>
            toNumber((item as any).terminalId ?? (item as any).TerminalId) === terminalId
          )
        : filtered,
    };
  },

  /**
   * 4.10 Get Students On Board Status
   * GET /tracking/routes/:routeId/students/onboard
   */
  getStudentsOnBoard: async (
    routeId: number,
    type?: "AM" | "PM"
  ): Promise<ApiResponse<StudentsOnBoardResponse>> => {
    const queryString = type ? `?type=${type}` : "";
    const response = await apiClient.get(`/tracking/routes/${routeId}/students/onboard${queryString}`);
    return {
      ok: true,
      data: response.data?.data || response.data,
    };
  },

  /**
   * Get Single Vehicle Location (Detail Card)
   * GET /tracking/vehicles/:vehicleId/location
   */
  getVehicleLocation: async (vehicleId: number): Promise<ApiResponse<VehicleLocationDetail>> => {
    const response = await apiClient.get(`/tracking/vehicles/${vehicleId}/location`);
    return {
      ok: true,
      data: response.data?.data || response.data,
    };
  },

  /**
   * Get Vehicle Location History (Path/Polyline)
   * GET /tracking/vehicles/:vehicleId/history
   */
  getVehicleHistory: async (
    vehicleId: number,
    params?: {
      startDate?: string;
      endDate?: string;
      limit?: number;
    }
  ): Promise<ApiResponse<VehicleHistoryResponse>> => {
    const queryParams = new URLSearchParams();
    if (params?.startDate) queryParams.append("startDate", params.startDate);
    if (params?.endDate) queryParams.append("endDate", params.endDate);
    if (params?.limit) queryParams.append("limit", params.limit.toString());

    const queryString = queryParams.toString();
    const url = `/tracking/vehicles/${vehicleId}/history${queryString ? `?${queryString}` : ""}`;

    const response = await apiClient.get(url);
    return {
      ok: true,
      data: response.data?.data || response.data || { data: [], total: 0, limit: 100 },
    };
  },

  /**
   * Get Live Route Tracking (Route + Vehicle + Students)
   * GET /tracking/routes/:routeId/live
   */
  getLiveRoute: async (
    routeId: number,
    type?: "AM" | "PM"
  ): Promise<ApiResponse<LiveRouteData>> => {
    const queryString = type ? `?type=${type}` : "";
    const response = await apiClient.get(`/tracking/routes/${routeId}/live${queryString}`);
    return {
      ok: true,
      data: response.data?.data || response.data,
    };
  },

  /**
   * Get Route Map (start/end + ordered stops)
   * GET /tracking/routes/:routeId/map
   */
  getRouteMap: async (
    routeId: number,
    type?: "AM" | "PM"
  ): Promise<ApiResponse<RouteMapData>> => {
    const queryString = type ? `?type=${type}` : "";
    const response = await apiClient.get(`/tracking/routes/${routeId}/map${queryString}`);
    const raw = response.data?.data || response.data || {};
    const source = raw?.stops || raw?.startLocation || raw?.endLocation ? raw : raw?.data || {};
    const routeType = resolveTrackingRouteType(source, type || "AM");
    const normalizedStops = Array.isArray(source.stops)
      ? source.stops
          .map((stop: any, index: number) => {
            const latitude = toNumber(
              pickFirst(stop.stopLatitude, stop.StopLatitude, stop.latitude, stop.Latitude, stop.lat, stop.Lat)
            );
            const longitude = toNumber(
              pickFirst(stop.stopLongitude, stop.StopLongitude, stop.longitude, stop.Longitude, stop.lng, stop.Lng)
            );

            if (latitude === undefined || longitude === undefined) {
              return null;
            }

            const stopType = String(
              pickFirst(
                stop.stopType,
                stop.StopType,
                stop.type,
                routeType === "PM" ? "dropoff" : "pickup"
              ) || (routeType === "PM" ? "dropoff" : "pickup")
            ).toLowerCase();

            return {
              stopId: toNumber(pickFirst(stop.stopId, stop.StopId)),
              stopName: pickFirst(stop.stopName, stop.StopName, stop.name, stop.Name),
              stopAddress: pickFirst(stop.stopAddress, stop.StopAddress, stop.address, stop.Address),
              latitude,
              longitude,
              stopOrder: toNumber(pickFirst(stop.stopOrder, stop.StopOrder, stop.order)) || index + 1,
              stopType,
              estimatedArrivalTime: pickFirst(
                stop.estimatedArrivalTime,
                stop.EstimatedArrivalTime,
                stop.eta,
                stop.ETA,
                null
              ),
              isDropoff: stopType === "dropoff" || Boolean(pickFirst(stop.isDropoff, stop.IsDropoff, false)),
            };
          })
          .filter(Boolean)
          .sort((left: any, right: any) => Number(left?.stopOrder || 0) - Number(right?.stopOrder || 0))
      : [];

    const schoolPoint = normalizeRouteMapPoint(
      source.school || source.School || source.schoolObject || source.SchoolObject || source.institute
    );
    const rawStart = normalizeRouteMapPoint(source.startLocation || source.StartLocation);
    const rawEnd = normalizeRouteMapPoint(source.endLocation || source.EndLocation);
    const startLocation = routeType === "PM" ? schoolPoint || rawStart : rawStart;
    const endLocation = routeType === "PM" ? rawEnd : schoolPoint || rawEnd;

    return {
      ok: true,
      data: {
        routeId: toNumber(pickFirst(source.routeId, source.RouteId)),
        routeName: pickFirst(source.routeName, source.RouteName),
        routeNumber: pickFirst(source.routeNumber, source.RouteNumber),
        routeType,
        school: schoolPoint,
        startLocation,
        endLocation,
        stops: normalizedStops,
      },
    };
  },

  /**
   * Get Driver Location (Driver Pin on Map)
   * GET /tracking/drivers/:driverId/location
   */
  getDriverLocation: async (driverId: number): Promise<ApiResponse<DriverLocation>> => {
    const response = await apiClient.get(`/tracking/drivers/${driverId}/location`);
    return {
      ok: true,
      data: response.data?.data || response.data,
    };
  },

  /**
   * Get today's active route for a driver
   * GET /tracking/drivers/:driverId/active-route
   */
  getDriverActiveRoute: async (driverId: number): Promise<ApiResponse<DriverActiveRoute | null>> => {
    const response = await apiClient.get(`/tracking/drivers/${driverId}/active-route`);
    const raw = response.data?.data ?? response.data ?? null;

    if (!raw) {
      return {
        ok: true,
        data: null,
      };
    }

    return {
      ok: true,
      data: {
        routeId: toNumber(pickFirst(raw.routeId, raw.RouteId)),
        routeName: pickFirst(raw.routeName, raw.RouteName),
        vehicleId: toNumber(
          pickFirst(raw.vehicleId, raw.VehicleId, raw.vehicle?.vehicleId, raw.vehicle?.VehicleId)
        ),
        vehicleName: pickFirst(
          raw.vehicleName,
          raw.VehicleName,
          raw.busName,
          raw.BusName,
          raw.vehicle?.vehicleName,
          raw.vehicle?.VehicleName,
          raw.vehicle?.busName,
          raw.vehicle?.BusName
        ),
        busNumber: pickFirst(
          raw.busNumber,
          raw.BusNumber,
          raw.numberPlate,
          raw.NumberPlate,
          raw.vehicle?.busNumber,
          raw.vehicle?.BusNumber,
          raw.vehicle?.numberPlate,
          raw.vehicle?.NumberPlate
        ),
        numberPlate: pickFirst(
          raw.numberPlate,
          raw.NumberPlate,
          raw.busNumber,
          raw.BusNumber,
          raw.vehicle?.numberPlate,
          raw.vehicle?.NumberPlate,
          raw.vehicle?.busNumber,
          raw.vehicle?.BusNumber
        ),
        terminalId: toNumber(
          pickFirst(raw.terminalId, raw.TerminalId, raw.vehicle?.terminalId, raw.vehicle?.TerminalId)
        ),
        currentLocation: normalizeCurrentLocation(raw.currentLocation || raw.CurrentLocation || raw),
      },
    };
  },

  /**
   * Get Route Tracking History (Replay)
   * GET /tracking/routes/:routeId/history
   */
  getRouteHistory: async (
    routeId: number,
    params?: {
      tripId?: number;
      date?: string;
      startDate?: string;
      endDate?: string;
    }
  ): Promise<ApiResponse<RouteHistoryData>> => {
    const queryParams = new URLSearchParams();
    if (params?.tripId) queryParams.append("tripId", params.tripId.toString());
    if (params?.date) queryParams.append("date", params.date);
    if (params?.startDate) queryParams.append("startDate", params.startDate);
    if (params?.endDate) queryParams.append("endDate", params.endDate);

    const queryString = queryParams.toString();
    const url = `/tracking/routes/${routeId}/history${queryString ? `?${queryString}` : ""}`;

    const response = await apiClient.get(url);
    return {
      ok: true,
      data: response.data?.data || response.data,
    };
  },

  /**
   * Get Latest Route Location (lightweight polling fallback)
   * GET /tracking/routes/:routeId/latest
   */
  getLatestRouteLocation: async (routeId: number): Promise<ApiResponse<CurrentLocation>> => {
    const response = await apiClient.get(`/tracking/routes/${routeId}/latest`);
    return {
      ok: true,
      data: response.data?.data || response.data,
    };
  },

  /**
   * Get All On-Board Students by Terminal (Vendor screen)
   * GET /tracking/students/onboard
   * GET /tracking/students/onboard?terminalId=1
   */
  getTerminalStudentsOnboard: async (terminalId?: number): Promise<ApiResponse<StudentOnBoard[]>> => {
    const url = terminalId
      ? `/tracking/students/onboard?terminalId=${terminalId}`
      : `/tracking/students/onboard`;
    const response = await apiClient.get(url);
    const rawData = response.data?.data || response.data || [];
    return {
      ok: true,
      data: Array.isArray(rawData) ? rawData : [],
    };
  },
};

export default trackingService;
