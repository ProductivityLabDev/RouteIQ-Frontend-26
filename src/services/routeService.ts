import { apiClient } from "@/configs/api";
import { ApiResponse } from "@/types/api";

export interface CreateRoutePayload {
  instituteId: number;
  routeNumber: string;
  routeName: string;
  pickup: string;
  dropoff: string;
  routeDate: string; // YYYY-MM-DD
  routeTime: string; // HH:mm
  driverId: number;
  busId: number;
  createdByUserId?: number;
  studentIds: string; // Comma separated string e.g. '1,2,5'
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
    const response = await apiClient.post<ApiResponse<RouteResponse>>(
      "/institute/create-with-students",
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
};

