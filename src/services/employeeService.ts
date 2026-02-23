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

// ─── Employee Dashboard Types ───────────────────────────────────────────────

export type PunchAction = "punch_in" | "punch_out" | "break_start" | "break_end";

export interface DashboardToday {
  shiftId: number | null;
  punchStatus: "NOT_PUNCHED" | "PUNCHED_IN" | "PUNCHED_OUT" | "ON_BREAK";
  punchInTime: string | null;
  punchOutTime: string | null;
  breakStartTime: string | null;
  breakEndTime: string | null;
  workingHours: string;
  breakHours: string;
}

export interface DashboardMonthly {
  totalDays: number;
  totalHours: number;
}

export interface DashboardData {
  today: DashboardToday;
  monthly: DashboardMonthly;
}

export interface AttendanceRecord {
  shiftId: number;
  date: string;
  punchIn: string;
  punchOut: string;
  breakStart: string | null;
  breakEnd: string | null;
  duration: string;
  status: string;
}

export interface AttendanceReportData {
  month: number;
  year: number;
  summary: {
    totalDays: number;
    totalHours: number;
    totalMinutes: number;
  };
  records: AttendanceRecord[];
}

export const employeeDashboardService = {
  getDashboard: async (): Promise<ApiResponse<DashboardData>> => {
    const response = await apiClient.get("/employee/dashboard");
    return { ok: true, data: response.data?.data };
  },

  postAttendance: async (action: PunchAction): Promise<ApiResponse<{ time: string }>> => {
    const response = await apiClient.post("/employee/attendance", { action });
    return { ok: true, data: response.data };
  },

  getAttendanceReport: async (
    month?: number,
    year?: number
  ): Promise<ApiResponse<AttendanceReportData>> => {
    const params: Record<string, number> = {};
    if (month !== undefined) params.month = month;
    if (year !== undefined) params.year = year;
    const response = await apiClient.get("/employee/attendance/report", { params });
    return { ok: true, data: response.data?.data };
  },
};

// ─── Time Off Types ──────────────────────────────────────────────────────────

export interface TimeOffRequest {
  id: number;
  leaveType: "SICK" | "CASUAL" | "ANNUAL" | "PERSONAL";
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string | null;
  attachmentUrl: string | null;
  status: "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";
  approvedBy: string | null;
  approvedAt: string | null;
  submittedAt: string;
}

// ─── Schedule Types ──────────────────────────────────────────────────────────

export interface ScheduleEvent {
  id: number;
  title: string;
  description: string | null;
  eventType: string;
  startTime: string;
  endTime: string;
  location: string | null;
  isAllDay: boolean;
  color: string;
}

export interface ScheduleData {
  weekStart: string;
  weekEnd: string;
  events: ScheduleEvent[];
}

// ─── Profile Types ───────────────────────────────────────────────────────────

export interface EmployeeProfile {
  EmployeeId: number;
  Name: string;
  Email: string;
  Phone: string;
  Address: string;
  City: string;
  StateId: number;
  ZipCode: string;
  FilePath: string | null;
  PositionType: number;
  TerminalAssignedId: number;
}

// ─── Document Types ──────────────────────────────────────────────────────────

export interface EmployeeDocument {
  id: number;
  documentType: string;
  documentName: string | null;
  fileUrl: string;
  issueDate: string | null;
  expiryDate: string | null;
  issuingAuthority: string | null;
  uploadedAt: string;
}

// ─── Employee Module Service (Time-off, Schedule, Profile, Documents) ─────────

export const employeeModuleService = {
  // Time Off
  getTimeOff: async (params?: { status?: string; limit?: number; offset?: number }) => {
    const response = await apiClient.get("/employee/time-off", { params });
    return { ok: true, data: (response.data?.data ?? []) as TimeOffRequest[], total: (response.data?.total ?? 0) as number };
  },

  createTimeOff: async (data: FormData | Record<string, unknown>) => {
    const isFormData = data instanceof FormData;
    const response = await apiClient.post("/employee/time-off", data, {
      headers: isFormData ? { "Content-Type": "multipart/form-data" } : {},
    });
    return { ok: true, data: response.data };
  },

  cancelTimeOff: async (id: number) => {
    const response = await apiClient.patch(`/employee/time-off/${id}`);
    return { ok: true, data: response.data };
  },

  // Schedule
  getSchedule: async (weekStart?: string) => {
    const response = await apiClient.get("/employee/schedule", {
      params: weekStart ? { weekStart } : {},
    });
    return { ok: true, data: response.data?.data as ScheduleData };
  },

  // Profile
  getProfile: async () => {
    const response = await apiClient.get("/employee/profile");
    return { ok: true, data: response.data?.data as EmployeeProfile };
  },

  updateProfile: async (data: FormData | Record<string, unknown>) => {
    const isFormData = data instanceof FormData;
    const response = await apiClient.patch("/employee/profile", data, {
      headers: isFormData ? { "Content-Type": "multipart/form-data" } : {},
    });
    return { ok: true, data: response.data };
  },

  // Documents
  getDocuments: async () => {
    const response = await apiClient.get("/employee/documents");
    return { ok: true, data: response.data?.data as { total: number; documents: EmployeeDocument[] } };
  },

  uploadDocument: async (formData: FormData) => {
    const response = await apiClient.post("/employee/documents", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return { ok: true, data: response.data };
  },
};

// ─────────────────────────────────────────────────────────────────────────────

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

