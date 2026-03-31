import { apiClient } from "@/configs/api";
import { ApiResponse } from "@/types/api";

export interface RepairSchedule {
  maintenanceId?: number;
  busId: number;
  empId?: number;
  serviceDesc?: string;
  partDesc?: string;
  passNum?: number;
  quantity?: number;
  partCost?: number;
  mileage?: number;
  repairDate?: string;
  estimatedCompletionTime?: string;
  vendor?: string;
  terminal?: string;
  repairType?: number;
  notes?: string;
  status?: string;
  completedDate?: string;
  createdAt?: string;
}

export interface CreateRepairSchedulePayload {
  busId: number;
  empId?: number;
  serviceDesc?: string;
  partDesc?: string;
  passNum?: number;
  quantity?: number;
  partCost?: number;
  mileage?: number;
  repairDate?: string;
  estimatedCompletionTime?: string;
  vendor?: string;
  terminal?: string;
  repairType?: number;
  notes?: string;
}

export interface UpdateRepairSchedulePayload {
  serviceDesc?: string;
  partDesc?: string;
  passNum?: number;
  quantity?: number;
  partCost?: number;
  mileage?: number;
  repairDate?: string;
  estimatedCompletionTime?: string;
  vendor?: string;
  terminal?: string;
  repairType?: number;
  notes?: string;
  status?: string;
  completedDate?: string;
}

export const repairScheduleService = {
  // GET all repair schedules
  getRepairSchedules: async (
    params?: number | {
      busId?: number;
      search?: string;
      repairTypes?: string[];
      serviceTypes?: string[];
      date?: string;
      sortBy?: string;
      limit?: number;
      offset?: number;
    }
  ): Promise<ApiResponse<RepairSchedule[]>> => {
    const queryParams =
      typeof params === "number"
        ? { busId: params }
        : params || {};

    const normalizedParams: Record<string, any> = {};
    if (queryParams.busId) normalizedParams.busId = queryParams.busId;
    if (queryParams.search) normalizedParams.search = queryParams.search;
    if (queryParams.repairTypes?.length) normalizedParams.repairTypes = queryParams.repairTypes.join(",");
    if (queryParams.serviceTypes?.length) normalizedParams.serviceTypes = queryParams.serviceTypes.join(",");
    if (queryParams.date) normalizedParams.date = queryParams.date;
    if (queryParams.sortBy) normalizedParams.sortBy = queryParams.sortBy;
    if (queryParams.limit !== undefined) normalizedParams.limit = queryParams.limit;
    if (queryParams.offset !== undefined) normalizedParams.offset = queryParams.offset;

    const response = await apiClient.get(`/institute/repair-schedule`, {
      params: normalizedParams,
    });
    return {
      ok: true,
      data: response.data?.data || response.data || [],
    };
  },

  // GET single repair schedule by ID
  getRepairScheduleById: async (maintenanceId: number): Promise<ApiResponse<RepairSchedule>> => {
    const response = await apiClient.get(`/institute/repair-schedule/${maintenanceId}`);
    return {
      ok: true,
      data: response.data?.data || response.data || {},
    };
  },

  // CREATE repair schedule
  createRepairSchedule: async (payload: CreateRepairSchedulePayload): Promise<ApiResponse<any>> => {
    const response = await apiClient.post(`/institute/repair-schedule`, payload);
    return {
      ok: true,
      data: response.data,
    };
  },

  // UPDATE repair schedule
  updateRepairSchedule: async (
    maintenanceId: number,
    payload: UpdateRepairSchedulePayload
  ): Promise<ApiResponse<any>> => {
    const response = await apiClient.patch(`/institute/repair-schedule/${maintenanceId}`, payload);
    return {
      ok: true,
      data: response.data,
    };
  },

  updateRepairScheduleNotes: async (
    maintenanceId: number,
    notes: string
  ): Promise<ApiResponse<any>> => {
    const response = await apiClient.patch(`/institute/repair-schedule/${maintenanceId}/notes`, {
      notes,
    });
    return {
      ok: true,
      data: response.data,
    };
  },

  // DELETE repair schedule (soft delete)
  deleteRepairSchedule: async (maintenanceId: number): Promise<ApiResponse<any>> => {
    const response = await apiClient.delete(`/institute/repair-schedule/${maintenanceId}`);
    return {
      ok: true,
      data: response.data,
    };
  },
};
