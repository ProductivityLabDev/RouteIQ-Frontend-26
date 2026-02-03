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
};

export default trackingService;
