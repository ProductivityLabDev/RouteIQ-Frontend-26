import { apiClient } from "@/configs/api";
import { ApiResponse } from "@/types/api";

export interface CreateRoutePayload {
  instituteId: number;
  routeNumber: string;
  routeName: string;
  pickup: string;
  dropoff: string;
  routeDate: string;
  routeTime: string;
  driverId: number;
  busId: number;
  createdByUserId?: number;
  studentIds: string;
  /** For SP @PickupLat, @PickupLng - RouteStops Pickup */
  pickupLat?: number | null;
  pickupLng?: number | null;
  /** For SP @DropoffLat, @DropoffLng - RouteStops Dropoff */
  dropoffLat?: number | null;
  dropoffLng?: number | null;
}

export interface UpdateRoutePayload {
  routeName: string;
  routeNumber: string;
  startLocation: string;
  endLocation: string;
  driverId: number;
  vehicleId: number;
  date: string;
  time: string;
}

// Backend DTO → sp_CreateRouteWithStudents (@PickupLat, @PickupLng, @DropoffLat, @DropoffLng, @DropoffTime)
interface CreateRouteBackendDto {
  instituteId: number;
  routeNumber: string;
  routeName: string;
  pickupLocation: string;
  dropoffLocation: string;
  routeDate: string;
  routeTime: string;
  pickupTime?: string;
  dropoffTime?: string;
  pickupLat?: number | null;
  pickupLng?: number | null;
  dropoffLat?: number | null;
  dropoffLng?: number | null;
  driverEmployeeId: number;
  vehicleId: number;
  studentIds: string;
  createdByUserId?: number;
}

export interface RouteResponse {
  id: number;
  pickup: string;
  dropoff: string;
  // ... add more fields based on your actual API response
}

export interface InstituteRouteSummary {
  routeId: number;
  routeNumber: string;
  routeName: string;
  vehicleId: number;
  vehicleNumberPlate: string;
  driverEmployeeId: number;
  driverName: string;
}

export interface RouteManagementInstituteSummary {
  instituteId: number;
  instituteName: string;
  totalStudents: number;
  totalBuses: number;
  totalRoutes: number;
}

export interface RouteManagementTerminalSummary {
  terminalId: number;
  terminalCode: string;
  terminalName: string;
  institutes: RouteManagementInstituteSummary[];
}

export interface RouteMapStop {
  stopId?: number;
  stopOrder?: number;
  stopType?: string;
  stopLatitude?: number;
  stopLongitude?: number;
  latitude?: number;
  longitude?: number;
  lat?: number;
  lng?: number;
  stopName?: string;
  stopAddress?: string;
}

export interface RouteMapStudent {
  studentId?: number;
  studentLatitude?: number;
  studentLongitude?: number;
  latitude?: number;
  longitude?: number;
  lat?: number;
  lng?: number;
  studentName?: string;
}

export interface RouteMapResponse {
  routeType?: string;
  school?: {
    latitude?: number;
    longitude?: number;
    address?: string;
    name?: string;
  } | null;
  startLocation?: {
    latitude?: number;
    longitude?: number;
    address?: string;
    name?: string;
  } | null;
  endLocation?: {
    latitude?: number;
    longitude?: number;
    address?: string;
    name?: string;
  } | null;
  stops?: RouteMapStop[];
  students?: RouteMapStudent[];
}

const pickRouteMapValue = (...values: any[]) =>
  values.find((value) => value !== undefined && value !== null && value !== "");

const toRouteMapNumber = (value: any) => {
  if (value === undefined || value === null || value === "") return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

const normalizeRouteMapPoint = (source: any) => {
  if (!source) return null;

  const latitude = toRouteMapNumber(
    pickRouteMapValue(source.latitude, source.Latitude, source.lat, source.Lat)
  );
  const longitude = toRouteMapNumber(
    pickRouteMapValue(source.longitude, source.Longitude, source.lng, source.Lng)
  );

  if (latitude === undefined || longitude === undefined) return null;

  return {
    latitude,
    longitude,
    address: pickRouteMapValue(source.address, source.Address, source.location, source.Location),
    name: pickRouteMapValue(source.name, source.Name, source.label, source.Label),
  };
};

const resolveRouteMapType = (source: any, fallbackType: string = "AM") => {
  const rawType = String(
    pickRouteMapValue(
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

export interface RouteStudent {
  assignmentId?: number;
  studentId?: number;
  studentName?: string;
  studentAddress?: string;
  time?: string;
  pickupTime?: string;
  pickupAddress?: string;
  pickupCity?: string;
  pickupState?: string;
  studentLatitude?: number;
  studentLongitude?: number;
  assignmentType?: string;
  busNumber?: string;
  stopId?: number;
  stopName?: string;
  stopAddress?: string;
  stopOrder?: number;
  estimatedArrivalTime?: string;
}

export interface RouteStudentsResponse extends ApiResponse<RouteStudent[]> {
  total?: number;
  limit?: number;
  offset?: number;
}

export interface RouteMetrics {
  ok?: boolean;
  routeId: number;
  distanceKm: number;
  durationMinutes: number;
  google?: {
    distanceMeters?: number;
    durationSeconds?: number;
  };
}

export interface RouteDetails {
  routeId?: number;
  routeNumber?: string;
  routeName?: string;
  vehicleNumberPlate?: string;
  driverName?: string;
  driverPhone?: string;
  scheduleStartTime?: string;
  scheduleEndTime?: string;
  // allow extra backend fields without breaking
  [key: string]: any;
}

export interface RouteStop {
  stopId?: number;
  stopName?: string;
  stopAddress?: string;
  latitude?: number;
  longitude?: number;
  stopOrder?: number;
  estimatedArrivalTime?: string;
  [key: string]: any;
}

export interface UpdateRouteIconPayload {
  routeAnimalIcon: string;
}

export interface UpdateStudentLocationPayload {
  latitude: number;
  longitude: number;
}

export interface FindStudentsByLocationPayload {
  instituteId: number;
  pickupLocation: string;
  pickupLatitude?: number;
  pickupLongitude?: number;
  dropoffLocation: string;
  dropoffLatitude?: number;
  dropoffLongitude?: number;
  radiusKm?: number; // Used when matchType=coordinate (min 0.01, max 50)
  radiusMeters?: number; // Used when matchType=address (min 10, max 5000, default 50)
  maxResults?: number;
  matchType?: "coordinate" | "address";
}

export interface MatchedStudent {
  studentId: number;
  firstName?: string;
  lastName?: string;
  studentName?: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  distanceKm?: number;
  [key: string]: any;
}

export interface FindStudentsByLocationResponse {
  ok: boolean;
  message?: string;
  data: {
    matchedStudents: MatchedStudent[];
    totalMatched: number;
    totalSearched?: number;
    searchRadiusKm?: number;
    matchType?: string;
    suggestion?: any;
  };
}

export interface AssignStudentToRouteResponse {
  ok: boolean;
  message?: string;
  data: {
    routeId: number;
    studentId: number;
    assignmentType?: string;
    Inserted?: number;
    AlreadyAssigned?: number;
    [key: string]: any;
  };
}

export interface CreateRouteBasicPayload {
  instituteId: number;
  routeNumber: string;
  routeName: string;
  routeAnimalIcon?: string;
  pickupLat?: number;
  pickupLng?: number;
  dropoffLat?: number;
  dropoffLng?: number;
  pickup: string;
  dropoff: string;
  routeDate: string; // YYYY-MM-DD
  routeTime: string; // HH:MM
  driverId: number;
  busId: number;
  studentIds?: string; // Comma-separated string e.g. '1,2,5'
}

/**
 * Route Service
 * -------------
 * Handles all API calls related to Route Management.
 */
export const routeService = {
  /**
   * Create a new route
   */
  createRoute: async (payload: CreateRoutePayload): Promise<ApiResponse<RouteResponse>> => {
    const routeTime = String(payload.routeTime ?? "").trim();
    const body: CreateRouteBackendDto = {
      instituteId: Number(payload.instituteId),
      routeNumber: String(payload.routeNumber ?? ""),
      routeName: String(payload.routeName ?? ""),
      pickupLocation: String(payload.pickup ?? ""),
      dropoffLocation: String(payload.dropoff ?? ""),
      routeDate: String(payload.routeDate ?? ""),
      routeTime,
      pickupTime: routeTime || undefined,
      dropoffTime: routeTime || undefined,
      pickupLat: payload.pickupLat != null ? Number(payload.pickupLat) : null,
      pickupLng: payload.pickupLng != null ? Number(payload.pickupLng) : null,
      dropoffLat: payload.dropoffLat != null ? Number(payload.dropoffLat) : null,
      dropoffLng: payload.dropoffLng != null ? Number(payload.dropoffLng) : null,
      driverEmployeeId: Number(payload.driverId),
      vehicleId: Number(payload.busId),
      studentIds: String(payload.studentIds ?? ""),
      ...(payload.createdByUserId !== undefined ? { createdByUserId: Number(payload.createdByUserId) } : {}),
    };

    const response = await apiClient.post<ApiResponse<RouteResponse>>(
      "/institute/create-with-students",
      body
    );
    return response.data;
  },

  updateRoute: async (
    routeId: number,
    payload: UpdateRoutePayload
  ): Promise<ApiResponse<any>> => {
    const response = await apiClient.patch<ApiResponse<any>>(
      `/route-management/routes/${routeId}`,
      payload
    );
    return response.data;
  },

  /**
   * Fetch all routes
   */
  getRoutes: async (): Promise<ApiResponse<RouteResponse[]>> => {
    // Note: Use the real endpoint once known
    const response = await apiClient.get<ApiResponse<RouteResponse[]>>(
      "/institute/GetRoutes"
    );
    return response.data;
  },

  /**
   * Fetch vendor terminals + institutes hierarchy for Route Management screen
   */
  getRouteManagementTerminals: async (): Promise<ApiResponse<RouteManagementTerminalSummary[]>> => {
    const response = await apiClient.get<RouteManagementTerminalSummary[]>(
      "/route-management/terminals"
    );
    return {
      ok: true,
      data: Array.isArray(response.data) ? response.data : [],
    };
  },

  /**
   * Fetch routes for a specific institute (school)
   */
  getInstituteRoutes: async (instituteId: number): Promise<ApiResponse<InstituteRouteSummary[]>> => {
    const response = await apiClient.get<InstituteRouteSummary[]>(
      `/route-management/institutes/${instituteId}/routes`
    );
    return {
      ok: true,
      data: Array.isArray(response.data) ? response.data : [],
    };
  },

  /**
   * Fetch map data for a specific route (stops + students)
   * @param routeId number
   * @param type "AM" | "PM" | string
   */
  getRouteMap: async (
    routeId: number,
    type: string = "AM"
  ): Promise<RouteMapResponse> => {
    const response = await apiClient.get<any>(
      `/route-management/routes/${routeId}/map`,
      {
        params: { type },
      }
    );

    const raw = response.data;
    const payload =
      raw?.stops || raw?.students
        ? raw
        : raw?.data && (raw.data.stops || raw.data.students)
        ? raw.data
        : {};
    const routeType = resolveRouteMapType(payload, type);
    const schoolPoint = normalizeRouteMapPoint(
      payload?.school ||
      payload?.School ||
      payload?.schoolObject ||
      payload?.SchoolObject ||
      payload?.institute ||
      payload?.Institute
    );
    const fallbackStart = normalizeRouteMapPoint(payload?.startLocation || payload?.StartLocation);
    const fallbackEnd = normalizeRouteMapPoint(payload?.endLocation || payload?.EndLocation);
    const normalizedStops = Array.isArray(payload?.stops)
      ? payload.stops
          .map((stop: any, index: number) => {
            const latitude = toRouteMapNumber(
              pickRouteMapValue(
                stop?.stopLatitude,
                stop?.StopLatitude,
                stop?.latitude,
                stop?.Latitude,
                stop?.lat,
                stop?.Lat
              )
            );
            const longitude = toRouteMapNumber(
              pickRouteMapValue(
                stop?.stopLongitude,
                stop?.StopLongitude,
                stop?.longitude,
                stop?.Longitude,
                stop?.lng,
                stop?.Lng
              )
            );

            if (latitude === undefined || longitude === undefined) {
              return null;
            }

            return {
              ...stop,
              stopId: pickRouteMapValue(stop?.stopId, stop?.StopId),
              stopOrder:
                toRouteMapNumber(pickRouteMapValue(stop?.stopOrder, stop?.StopOrder, stop?.order)) ??
                index + 1,
              stopType: String(
                pickRouteMapValue(
                  stop?.stopType,
                  stop?.StopType,
                  stop?.type,
                  routeType === "PM" ? "dropoff" : "pickup"
                ) || (routeType === "PM" ? "dropoff" : "pickup")
              ).toLowerCase(),
              stopName: pickRouteMapValue(stop?.stopName, stop?.StopName, stop?.name, stop?.Name),
              stopAddress: pickRouteMapValue(
                stop?.stopAddress,
                stop?.StopAddress,
                stop?.address,
                stop?.Address,
                stop?.stopName,
                stop?.StopName
              ),
              latitude,
              longitude,
            };
          })
          .filter(Boolean)
          .sort(
            (left: any, right: any) =>
              Number(left?.stopOrder || 0) - Number(right?.stopOrder || 0)
          )
      : [];

    return {
      ...payload,
      routeType,
      school: schoolPoint,
      startLocation: routeType === "PM" ? schoolPoint || fallbackStart : fallbackStart,
      endLocation: routeType === "PM" ? fallbackEnd : schoolPoint || fallbackEnd,
      stops: normalizedStops,
    };
  },

  /**
   * Fetch students for a specific route (AM/PM/Both/All)
   */
  getRouteStudents: async (
    routeId: number,
    type: string = "AM",
    options: { limit?: number; offset?: number } = {}
  ): Promise<RouteStudentsResponse> => {
    const { limit = 10, offset = 0 } = options;
    const response = await apiClient.get<any>(
      `/route-management/routes/${routeId}/students`,
      {
        params: { type, limit, offset },
      }
    );
    const raw = response.data;
    const payload = Array.isArray(raw)
      ? raw
      : raw?.ok && Array.isArray(raw.data)
      ? raw.data
      : Array.isArray(raw?.data)
      ? raw.data
      : [];

    return {
      ok: true,
      data: payload,
      total: Number(raw?.total ?? payload.length ?? 0),
      limit: Number(raw?.limit ?? limit),
      offset: Number(raw?.offset ?? offset),
    };
  },

  /**
   * Compute route metrics (distance + duration) for a route.
   */
  computeRouteMetrics: async (routeId: number): Promise<RouteMetrics> => {
    const response = await apiClient.post<RouteMetrics>(
      `/route-management/routes/${routeId}/compute-metrics`
    );
    return response.data;
  },

  /**
   * Route details + schedule for the route card
   */
  getRouteDetails: async (routeId: number): Promise<RouteDetails> => {
    const response = await apiClient.get<any>(
      `/route-management/routes/${routeId}/details`
    );
    const raw = response.data;

    // Unwrap common Nest/ApiResponse shapes
    let payload: any =
      raw?.data && typeof raw.data === "object" ? raw.data : raw && typeof raw === "object" ? raw : {};

    // Sometimes APIs nest again: { data: { data: ... } }
    if (payload?.data && typeof payload.data === "object") payload = payload.data;

    // Some SP endpoints return arrays
    const pickFirst = (v: any) => (Array.isArray(v) ? v[0] : v);

    const routeDetails =
      pickFirst(payload.routeDetails) ||
      pickFirst(payload.routeDetail) ||
      pickFirst(payload.details) ||
      pickFirst(payload.route) ||
      pickFirst(payload);

    const schedule =
      pickFirst(payload.routeSchedule) ||
      pickFirst(payload.schedule) ||
      pickFirst(payload.schedules) ||
      pickFirst(payload.RouteSchedule) ||
      pickFirst(payload.Schedule) ||
      null;

    const driver =
      pickFirst(payload.driver) ||
      pickFirst(payload.Driver) ||
      pickFirst(payload.driverInfo) ||
      pickFirst(payload.DriverInfo) ||
      null;

    // Merge into a single flat object; keep nested schedule too
    const merged: RouteDetails = {
      ...(routeDetails && typeof routeDetails === "object" ? routeDetails : {}),
      ...(driver && typeof driver === "object" ? driver : {}),
    };

    if (schedule) merged.schedule = schedule;
    if (payload?.Schedule && !merged.Schedule) merged.Schedule = payload.Schedule;
    if (payload?.routeSchedule && !merged.routeSchedule) merged.routeSchedule = payload.routeSchedule;

    return merged || {};
  },

  /**
   * Get route stops (ordered list with lat/lng for map rendering)
   */
  getRouteStops: async (routeId: number): Promise<ApiResponse<RouteStop[]>> => {
    const response = await apiClient.get<RouteStop[]>(
      `/route-management/routes/${routeId}/stops`
    );
    return {
      ok: true,
      data: Array.isArray(response.data) ? response.data : [],
    };
  },

  /**
   * Update route animal icon (e.g. lion, fox, elephant)
   */
  updateRouteIcon: async (
    routeId: number,
    icon: string
  ): Promise<ApiResponse<any>> => {
    const payload: UpdateRouteIconPayload = {
      routeAnimalIcon: icon,
    };
    const response = await apiClient.patch<any>(
      `/route-management/routes/${routeId}/icon`,
      payload
    );
    return {
      ok: true,
      data: response.data,
    };
  },

  /**
   * Update student location coordinates (latitude/longitude)
   */
  updateStudentLocation: async (
    studentId: number,
    latitude: number,
    longitude: number
  ): Promise<ApiResponse<any>> => {
    const payload: UpdateStudentLocationPayload = {
      latitude,
      longitude,
    };
    const response = await apiClient.patch<any>(
      `/route-management/students/${studentId}/location`,
      payload
    );
    return {
      ok: true,
      data: response.data,
    };
  },

  /**
   * Find students by location (smart matching for route creation)
   * Supports coordinate-based (Haversine) or address-based matching
   */
  findStudentsByLocation: async (
    payload: FindStudentsByLocationPayload
  ): Promise<FindStudentsByLocationResponse> => {
    const response = await apiClient.post<FindStudentsByLocationResponse>(
      "/route-management/find-students-by-location",
      payload
    );
    return response.data;
  },

  /**
   * Assign a single student to an existing route (Smart Match / manual)
   */
  assignStudentToRoute: async (
    routeId: number,
    studentId: number,
    assignmentType: string = "SMART_MATCH"
  ): Promise<AssignStudentToRouteResponse> => {
    const response = await apiClient.post<AssignStudentToRouteResponse>(
      `/route-management/routes/${routeId}/assign-student`,
      {
        studentId,
        assignmentType,
      }
    );

    return response.data;
  },

  /**
   * Create route (basic) - without students or with optional comma-separated studentIds
   */
  createRouteBasic: async (
    payload: CreateRouteBasicPayload
  ): Promise<ApiResponse<RouteResponse>> => {
    const body: any = {
      instituteId: Number(payload.instituteId),
      routeNumber: String(payload.routeNumber ?? ""),
      routeName: String(payload.routeName ?? ""),
      pickup: String(payload.pickup ?? ""),
      dropoff: String(payload.dropoff ?? ""),
      routeDate: String(payload.routeDate ?? ""),
      routeTime: String(payload.routeTime ?? ""),
      driverId: Number(payload.driverId),
      busId: Number(payload.busId),
    };

    // Optional fields
    if (payload.routeAnimalIcon) {
      body.routeAnimalIcon = String(payload.routeAnimalIcon);
    }
    if (payload.pickupLat !== undefined) {
      body.pickupLat = Number(payload.pickupLat);
    }
    if (payload.pickupLng !== undefined) {
      body.pickupLng = Number(payload.pickupLng);
    }
    if (payload.dropoffLat !== undefined) {
      body.dropoffLat = Number(payload.dropoffLat);
    }
    if (payload.dropoffLng !== undefined) {
      body.dropoffLng = Number(payload.dropoffLng);
    }
    if (payload.studentIds) {
      body.studentIds = String(payload.studentIds);
    }

    const response = await apiClient.post<ApiResponse<RouteResponse>>(
      "/institute/createRoute",
      body
    );
    return response.data;
  },
};
