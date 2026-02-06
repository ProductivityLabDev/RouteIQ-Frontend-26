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
  routeId?: number;
  routeName?: string;
  currentLocation: CurrentLocation;
  studentsOnBoard?: number;
  totalStudents?: number;
  status: string;
  instituteId?: number;
  instituteName?: string;
}

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
    return {
      ok: true,
      data: response.data?.data || response.data || [],
    };
  },

  /**
   * 4.8 Get Terminal Vehicles Tracking (Vendor Only)
   * GET /tracking/terminals/:terminalId/vehicles
   */
  getTerminalVehicles: async (terminalId: number): Promise<ApiResponse<VehicleTracking[]>> => {
    const response = await apiClient.get(`/tracking/terminals/${terminalId}/vehicles`);
    return {
      ok: true,
      data: response.data?.data || response.data || [],
    };
  },

  /**
   * 4.6 Get School Vehicles Tracking (Vendor Only)
   * GET /tracking/schools/:schoolId/vehicles
   */
  getSchoolVehicles: async (
    schoolId: number,
    terminalId?: number
  ): Promise<ApiResponse<VehicleTracking[]>> => {
    const queryString = terminalId ? `?terminalId=${terminalId}` : "";
    const response = await apiClient.get(`/tracking/schools/${schoolId}/vehicles${queryString}`);
    return {
      ok: true,
      data: response.data?.data || response.data || [],
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
};

export default trackingService;
