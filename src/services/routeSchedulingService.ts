import { apiClient } from "@/configs/api";
import type { ApiResponse } from "@/types/api";

/** DTO for POST /route-scheduling/trips (CreateTripDto) */
export interface CreateTripDto {
  startTime: string;
  pickupLocation: string;
  dropoffLocation: string;
  companyName?: string;
  phoneNumber?: string;
  emailAddress?: string;
  tripType?: string;
  noOfBuses?: number;
  noOfPersons?: number;
  wheelchairLiftRequired?: number;
  busType?: string;
  endTime?: string;
  groupType?: string;
  busName?: string;
  pickupAddress?: string;
  pickupCity?: string;
  pickupState?: string;
  pickupZip?: string;
  dropoffAddress?: string;
  destinationCity?: string;
  destinationState?: string;
  destinationZip?: string;
  specialInstructions?: string;
  referralSource?: string;
  vehicleId?: number;
  driverId?: number;
  routeId?: number;
}

export interface CreateTripResponse {
  ok: boolean;
  message: string;
  tripNumber: string;
}

export interface TripListItem {
  id?: number;
  TripId?: number;
  TripNumber?: string;
  tripNo?: string;
  StartTime?: string;
  startTime?: string;
  EndTime?: string;
  endTime?: string;
  Status?: string;
  status?: string;
  BusNumber?: string;
  busNo?: string;
  DriverName?: string;
  driverName?: string;
  [key: string]: any;
}

export const routeSchedulingService = {
  getTripsByTerminal: async (
    terminalId: number | string,
    status?: "Approved" | "Pending" | "Canceled"
  ): Promise<ApiResponse<TripListItem[]>> => {
    const params = status ? { status } : {};
    const response = await apiClient.get(
      `/route-scheduling/terminals/${terminalId}/trips`,
      { params }
    );
    const raw = response.data;
    const data = Array.isArray(raw?.data)
      ? raw.data
      : Array.isArray(raw?.trips)
      ? raw.trips
      : Array.isArray(raw)
      ? raw
      : [];
    return { ok: true, data };
  },

  createTrip: async (dto: CreateTripDto): Promise<ApiResponse<CreateTripResponse>> => {
    const response = await apiClient.post("/route-scheduling/trips", dto);
    const raw = response.data;
    const data = raw?.data ?? raw;
    return {
      ok: true,
      data: {
        ok: data?.ok ?? true,
        message: data?.message ?? "Trip created successfully",
        tripNumber: data?.tripNumber ?? "",
      },
    };
  },
};
