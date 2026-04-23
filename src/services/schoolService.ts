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

export interface StudentsBySchoolResponse {
  rows: any[];
  total: number;
  limit: number;
  offset: number;
}

export interface UpdateStudentPayload {
  StudentName?: string;
  BusNo?: string | null;
  RouteNo?: string | null;
  Grade?: string;
  EmergencyContact?: string;
  Enrollment?: string;
  Address?: string;
  Guardian1?: string;
  Guardian2?: string | null;
  GuardianEmail?: string;
  Guardian1Phone?: string;
  Guardian2Phone?: string | null;
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

export interface SchoolDetail {
  id: number;
  InstituteId?: number;
  instituteName?: string | null;
  InstituteName?: string | null;
  instituteType?: number | null;
  InstituteType?: number | null;
  address?: string | null;
  Address?: string | null;
  city?: number | null;
  City?: number | null;
  stateId?: number | null;
  state?: number | null;
  StateId?: number | null;
  zipCode?: string | null;
  ZipCode?: string | null;
  contactPhone?: string | null;
  ContactPhone?: string | null;
  contactEmail?: string | null;
  ContactEmail?: string | null;
  contactPerson?: string | null;
  ContactPerson?: string | null;
  district?: string | null;
  District?: string | null;
  principle?: string | null;
  Principle?: string | null;
  president?: string | null;
  President?: string | null;
  terminalId?: number | null;
  TerminalId?: number | null;
  totalBus?: number | null;
  TotalBus?: number | null;
  totalStudent?: number | null;
  TotalStudent?: number | null;
  mobileNo?: string | null;
  MobileNo?: string | null;
  logoUrl?: string | null;
  LogoUrl?: string | null;
  lat?: number | null;
  Lat?: number | null;
  lng?: number | null;
  Lng?: number | null;
  isActive?: number | boolean | null;
  IsActive?: number | boolean | null;
}

export interface UpdateSchoolPayload {
  instituteName: string;
  instituteType: number | null;
  address: string;
  city: number | null;
  stateId: number | null;
  zipCode: string | null;
  contactPhone: string | null;
  contactEmail: string | null;
  contactPerson: string | null;
  district: string | null;
  principle: string | null;
  president: string | null;
  terminalId: number | null;
  totalBus: number | null;
  totalStudent: number | null;
  mobileNo: string | null;
  logoUrl: string | null;
  lat: number | null;
  lng: number | null;
  isActive: number | boolean | null;
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
  getStudentsBySchool: async (
    instituteId: number | string,
    options: { limit?: number; offset?: number } = {}
  ): Promise<ApiResponse<StudentsBySchoolResponse>> => {
    const { limit = 10, offset = 0 } = options;
    const response = await apiClient.get(
      `/institute/students-by-institute?instituteId=${instituteId}&limit=${limit}&offset=${offset}`
    );
    const data = response.data;
    const studentsArray = Array.isArray(data)
      ? data
      : data?.ok && Array.isArray(data.data)
      ? data.data
      : Array.isArray(data?.data)
      ? data.data
      : [];

    return {
      ok: true,
      data: {
        rows: studentsArray,
        total: Number(data?.total ?? studentsArray.length ?? 0),
        limit: Number(data?.limit ?? limit),
        offset: Number(data?.offset ?? offset),
      },
    };
  },

  updateStudent: async (
    instituteId: number | string,
    studentId: number | string,
    payload: UpdateStudentPayload
  ): Promise<ApiResponse<any>> => {
    const response = await apiClient.patch(
      `/institute/${instituteId}/students/${studentId}`,
      payload
    );
    return { ok: true, data: response.data };
  },

  deleteStudent: async (
    instituteId: number | string,
    studentId: number | string
  ): Promise<ApiResponse<any>> => {
    const response = await apiClient.delete(`/institute/${instituteId}/students/${studentId}`);
    return { ok: true, data: response.data };
  },

  createInstitute: async (payload: CreateInstitutePayload): Promise<ApiResponse<any>> => {
    const response = await apiClient.post("/institute/createinstituteInfo", payload);
    return { ok: true, data: response.data };
  },

  getSchoolById: async (schoolId: number | string): Promise<ApiResponse<SchoolDetail>> => {
    const response = await apiClient.get(`/institute/schools/${schoolId}`);
    const data = response.data;
    return { ok: true, data: data?.data ?? data };
  },

  updateSchool: async (
    schoolId: number | string,
    payload: UpdateSchoolPayload
  ): Promise<ApiResponse<any>> => {
    const response = await apiClient.patch(`/institute/schools/${schoolId}`, payload);
    return { ok: true, data: response.data };
  },
};

