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
  TerminalId: number;
  TerminalCode: string;
  TerminalName: string;
  Address?: string;
  City?: string;
  State?: string;
  ZipCode?: string;
  IsActive?: boolean;
  IsDeleted?: boolean;
  CreatedAt?: string;
  UpdatedAt?: string | null;
  // Legacy support for backward compatibility
  id?: number;
  name?: string;
  code?: string;
}

export interface Bus {
  BusId: number;
  VehicleName: string;
  // ... add more fields
}

export interface CreateTerminalPayload {
  // Preferred shape (UI forms)
  name?: string;
  code?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;

  // Backward/alternate shapes (some screens may pass backend-shaped keys)
  TerminalName?: string;
  TerminalCode?: string;
  Address?: string | null;
  City?: string | null;
  State?: string | null;
  ZipCode?: string | null;
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
  driverName: string | null;
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
    const response = await apiClient.get("/terminals/my");
    return {
      ok: true,
      data: response.data?.data || response.data || [],
    };
  },

  // Backend/SP expects TerminalCode/TerminalName/Address/City/State/ZipCode
  createTerminal: async (payload: CreateTerminalPayload): Promise<ApiResponse<any>> => {
    // Backend route: POST /terminals/create-terminals
    const terminalCode =
      (payload.code ?? payload.TerminalCode ?? "")?.toString().trim();
    const terminalName =
      (payload.name ?? payload.TerminalName ?? "")?.toString().trim();
    const address =
      (payload.address ?? payload.Address ?? undefined) ?? undefined;
    const city = (payload.city ?? payload.City ?? undefined) ?? undefined;
    const state = (payload.state ?? payload.State ?? undefined) ?? undefined;
    const zipCode =
      (payload.zipCode ?? payload.ZipCode ?? undefined) ?? undefined;

    const response = await apiClient.post("/terminals/create-terminals", {
      TerminalCode: terminalCode,
      TerminalName: terminalName,
      Address: address ?? null,
      City: city ?? null,
      State: state ?? null,
      ZipCode: zipCode ?? null,
    });
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

  getBusByVehicleId: async (vehicleId: number): Promise<ApiResponse<Bus>> => {
    const response = await apiClient.get(`/institute/bus/${vehicleId}`);
    return {
      ok: true,
      data: response.data?.data || response.data || {},
    };
  },

  createBus: async (payload: CreateBusPayload): Promise<ApiResponse<any>> => {
    const response = await apiClient.post("/institute/createbuses", payload);
    return {
      ok: true,
      data: response.data,
    };
  },

  updateBus: async (vehicleId: number, payload: CreateBusPayload): Promise<ApiResponse<any>> => {
    console.log("🔄 [busService] Updating vehicle with ID:", vehicleId);
    console.log("🔄 [busService] Payload:", payload);
    
    // The payload already contains vehicleId, so we just send it as is
    const response = await apiClient.post(`/institute/updatevehicle`, payload);
    console.log("✅ [busService] Update response:", response.data);
    
    return {
      ok: true,
      data: response.data,
    };
  },
};

