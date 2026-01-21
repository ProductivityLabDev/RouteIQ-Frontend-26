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
  getRepairSchedules: async (busId?: number): Promise<ApiResponse<RepairSchedule[]>> => {
    const url = busId 
      ? `/institute/repair-schedule?busId=${busId}`
      : `/institute/repair-schedule`;
    const response = await apiClient.get(url);
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

  // DELETE repair schedule (soft delete)
  deleteRepairSchedule: async (maintenanceId: number): Promise<ApiResponse<any>> => {
    const response = await apiClient.delete(`/institute/repair-schedule/${maintenanceId}`);
    return {
      ok: true,
      data: response.data,
    };
  },
};
