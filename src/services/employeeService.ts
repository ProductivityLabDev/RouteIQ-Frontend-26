import { apiClient } from "@/configs/api";
import { ApiResponse } from "@/types/api";

export interface PayType {
  id: number;
  name: string;
}

export interface PayCycle {
  id: number;
  name: string;
}

export const employeeService = {
  getPayTypes: async (): Promise<ApiResponse<PayType[]>> => {
    const response = await apiClient.get("/institute/paytypes");
    return {
      ok: true,
      data: response.data?.data || response.data || [],
    };
  },

  getPayCycles: async (): Promise<ApiResponse<PayCycle[]>> => {
    const response = await apiClient.get("/institute/paycycles");
    return {
      ok: true,
      data: response.data?.data || response.data || [],
    };
  },

  /**
   * Create employee with multipart/form-data for files
   */
  createEmployee: async (data: FormData): Promise<ApiResponse<any>> => {
    const response = await apiClient.post("/institute/createEmployeeInfo", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return {
      ok: true,
      data: response.data,
    };
  },

  getEmployees: async (userId: number): Promise<ApiResponse<any[]>> => {
    const response = await apiClient.get(`/institute/GetEmployeeInfo/${userId}`);
    return {
      ok: true,
      data: Array.isArray(response.data)
        ? response.data
        : Array.isArray(response.data.data)
          ? response.data.data
          : [],
    };
  },
};

