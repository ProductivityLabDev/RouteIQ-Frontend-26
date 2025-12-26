import { apiClient } from "@/configs/api";
import { ApiResponse } from "@/types/api";

export interface Driver {
  id: number;
  name: string;
  // ... add more fields
}

export interface FuelType {
  id: number;
  name: string;
}

export interface Terminal {
  id: number;
  name: string;
  code?: string;
}

export interface Bus {
  BusId: number;
  VehicleName: string;
  // ... add more fields
}

export interface CreateBusPayload {
  vehicleName: string | null;
  busType: string | null;
  numberPlate: string | null;
  modelYear: number | null;
  serviceInterval: number | null;
  fuelTankSize: number | null;
  assignedTerminalId: number | null;
  expiredDate: string | null;
  vehicleMake: string | null;
  noOfPassenger: number | null;
  vinNo: string | null;
  mileage: number | null;
  driverId: number;
  fuelTypeId: number | null;
  insuranceExpiration: string | null;
  undercarriageStorage: number | null;
  userId: string | number | null;
}

export const busService = {
  getDrivers: async (): Promise<ApiResponse<Driver[]>> => {
    const response = await apiClient.get("/institute/drivers");
    return {
      ok: true,
      data: response.data?.data || response.data || [],
    };
  },

  getFuelTypes: async (): Promise<ApiResponse<FuelType[]>> => {
    const response = await apiClient.get("/institute/fueltypes");
    return {
      ok: true,
      data: response.data?.data || response.data || [],
    };
  },

  getTerminals: async (): Promise<ApiResponse<Terminal[]>> => {
    const response = await apiClient.get("/terminals");
    return {
      ok: true,
      data: response.data?.data || response.data || [],
    };
  },

  createTerminal: async (payload: { name: string; code: string; address?: string }): Promise<ApiResponse<any>> => {
    const response = await apiClient.post("/institute/createTerminal", payload);
    return {
      ok: true,
      data: response.data,
    };
  },

  getBusesByUserId: async (userId: number): Promise<ApiResponse<Bus[]>> => {
    const response = await apiClient.get(`/institute/GetBusInfo/${userId}`);
    return {
      ok: true,
      data: response.data?.data || response.data || [],
    };
  },

  createBus: async (payload: CreateBusPayload): Promise<ApiResponse<any>> => {
    const response = await apiClient.post("/institute/createbuses", payload);
    return {
      ok: true,
      data: response.data,
    };
  },
};

