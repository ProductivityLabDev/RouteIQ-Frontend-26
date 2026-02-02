import { apiClient } from "@/configs/api";
import { ApiResponse } from "@/types/api";

export interface CreateRoutePayload {
  instituteId: number;
  routeNumber: string;
  routeName: string;
  // UI field names
  pickup: string;
  dropoff: string;
  routeDate: string; // YYYY-MM-DD
  routeTime: string; // HH:mm
  // UI field names
  driverId: number;
  busId: number;
  createdByUserId?: number;
  studentIds: string; // Comma separated string e.g. '1,2,5'
}

// Backend DTO expects these keys (forbidNonWhitelisted=true)
interface CreateRouteBackendDto {
  instituteId: number;
  routeNumber: string;
  routeName: string;
  pickupLocation: string;
  dropoffLocation: string;
  routeDate: string;
  routeTime: string;
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
  stopLatitude?: number;
  stopLongitude?: number;
  latitude?: number;
  longitude?: number;
  lat?: number;
  lng?: number;
  stopName?: string;
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
  stops?: RouteMapStop[];
  students?: RouteMapStudent[];
}

export interface RouteStudent {
  studentId?: number;
  studentName?: string;
  time?: string;
  pickupTime?: string;
  pickupAddress?: string;
  pickupCity?: string;
  pickupState?: string;
  studentLatitude?: number;
  studentLongitude?: number;
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
    const body: CreateRouteBackendDto = {
      instituteId: Number(payload.instituteId),
      routeNumber: String(payload.routeNumber ?? ""),
      routeName: String(payload.routeName ?? ""),
      pickupLocation: String(payload.pickup ?? ""),
      dropoffLocation: String(payload.dropoff ?? ""),
      routeDate: String(payload.routeDate ?? ""),
      routeTime: String(payload.routeTime ?? ""),
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

    return payload || {};
  },

  /**
   * Fetch students for a specific route (AM/PM/Both/All)
   */
  getRouteStudents: async (
    routeId: number,
    type: string = "AM"
  ): Promise<ApiResponse<RouteStudent[]>> => {
    const response = await apiClient.get<RouteStudent[]>(
      `/route-management/routes/${routeId}/students`,
      {
        params: { type },
      }
    );
    return {
      ok: true,
      data: Array.isArray(response.data) ? response.data : [],
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

