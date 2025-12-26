import { apiClient } from "@/configs/api";
import { ApiResponse } from "@/types/api";

export interface State {
  id: number;
  name: string;
}

export interface City {
  id: number;
  name: string;
}

export interface InstituteType {
  id: number;
  name: string;
}

export interface SchoolSummary {
  id: number;
  InstituteName: string;
  // ... add more fields
}

export interface CreateInstitutePayload {
  District: string | null;
  Principle: string | null;
  TerminalId: number | null;
  InstituteType: number | null;
  InstituteName: string | null;
  TotalStudent: number | null;
  TotalBus: number | null;
  ContactPhone: string | null;
  Address: string | null;
  ContactEmail: string | null;
  City: number | null;
  StateId: number | null;
  ZipCode: string | null;
  UserId: number | null;
}

export const schoolService = {
  getStates: async (): Promise<ApiResponse<State[]>> => {
    const response = await apiClient.get("/institute/GetStates");
    const data = response.data;
    const statesArray = Array.isArray(data) ? data : (data?.ok && Array.isArray(data.data)) ? data.data : data.data || [];
    return { ok: true, data: statesArray };
  },

  getCities: async (): Promise<ApiResponse<City[]>> => {
    const response = await apiClient.get("/institute/GetCities");
    const data = response.data;
    const citiesArray = Array.isArray(data) ? data : (data?.ok && Array.isArray(data.data)) ? data.data : data.data || [];
    return { ok: true, data: citiesArray };
  },

  getInstituteTypes: async (): Promise<ApiResponse<InstituteType[]>> => {
    const response = await apiClient.get("/institute/GetInstituteType");
    const data = response.data;
    const typesArray = Array.isArray(data) ? data : (data?.ok && Array.isArray(data.data)) ? data.data : data.data || [];
    return { ok: true, data: typesArray };
  },

  getSchoolManagementSummary: async (userId: number): Promise<ApiResponse<SchoolSummary[]>> => {
    const response = await apiClient.get(`/institute/GetSchoolManagementSummary?createdByUserId=${userId}`);
    const data = response.data;
    const summaryArray = Array.isArray(data) ? data : (data?.ok && Array.isArray(data.data)) ? data.data : data.data || [];
    return { ok: true, data: summaryArray };
  },

  /**
   * Fetch students for a specific school (used in the nested table)
   */
  getStudentsBySchool: async (instituteId: number | string): Promise<ApiResponse<any[]>> => {
    const response = await apiClient.get(`/school/GetStudents?InstituteId=${instituteId}`);
    const data = response.data;
    const studentsArray = Array.isArray(data) ? data : (data?.ok && Array.isArray(data.data)) ? data.data : data.data || [];
    return { ok: true, data: studentsArray };
  },

  createInstitute: async (payload: CreateInstitutePayload): Promise<ApiResponse<any>> => {
    const response = await apiClient.post("/institute/createinstituteInfo", payload);
    return { ok: true, data: response.data };
  },
};

