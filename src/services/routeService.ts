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
      "/institute/createRoute",
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
};

