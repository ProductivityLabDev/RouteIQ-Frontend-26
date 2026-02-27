import { apiClient } from "@/configs/api";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface SchoolDashboardStats {
  totalStudents: number;
  totalBuses: number;
  totalDrivers: number;
  activeBuses: number;
}

export interface TodayAttendance {
  pickedUp: number;
  droppedOff: number;
}

export interface SchoolDashboardData {
  stats: SchoolDashboardStats;
  todayAttendance: TodayAttendance;
  recentAnnouncements: any[];
}

export interface SchoolStudent {
  id: number;
  firstName: string;
  lastName: string;
  grade: string;
  emergencyContact: string;
  pickupLocation?: string;
  dropLocation?: string;
  address?: string;
  enrollmentNo?: string;
  busNo?: string;
}

export interface SchoolDriver {
  id: number;
  name: string;
  phone?: string;
  email?: string;
  licenseNumber?: string;
  status?: string;
}

export interface SchoolRoute {
  id: number;
  routeNumber: string;
  routeName: string;
  pickupLocation: string;
  dropoffLocation: string;
  totalDistance?: string;
  estimatedTime?: string;
  status?: string;
  busId?: number;
  busName?: string;
  busNumber?: string;
  driverId?: number;
  driverName?: string;
}

export interface SchoolBus {
  id: number;
  name: string;
  numberPlate: string;
  busType?: string;
  capacity?: number;
  driverName?: string;
  routeCount?: number;
}

export interface SchoolAnnouncement {
  id: number;
  title: string;
  content: string;
  announcementType?: string;
  targetAudience?: string;
  imageUrl?: string;
  createdAt?: string;
}

export interface SchoolTrip {
  id: number;
  tripName: string;
  tripNumber?: string;
  pickupLocation: string;
  dropoffLocation: string;
  startTime: string;
  status: string;
  noOfPersons?: number;
  specialInstructions?: string;
}

// ─── Service ─────────────────────────────────────────────────────────────────

export const schoolDashboardService = {
  getDashboard: async () => {
    const response = await apiClient.get("/school/dashboard");
    return { ok: true, data: response.data?.data as SchoolDashboardData };
  },

  getAttendanceChart: async (params?: { type?: string; month?: number; year?: number }) => {
    const response = await apiClient.get("/school/dashboard/attendance-chart", { params });
    return { ok: true, data: response.data?.data ?? [] };
  },

  getStudents: async () => {
    const response = await apiClient.get("/school/students");
    return {
      ok: true,
      data: (response.data?.data ?? []) as SchoolStudent[],
      total: (response.data?.total ?? 0) as number,
    };
  },

  getDrivers: async () => {
    const response = await apiClient.get("/school/drivers");
    return {
      ok: true,
      data: (response.data?.data ?? []) as SchoolDriver[],
      total: (response.data?.total ?? 0) as number,
    };
  },

  getRoutes: async () => {
    const response = await apiClient.get("/school/routes");
    return {
      ok: true,
      data: (response.data?.data ?? []) as SchoolRoute[],
    };
  },

  getBuses: async () => {
    const response = await apiClient.get("/school/buses");
    return {
      ok: true,
      data: (response.data?.data ?? []) as SchoolBus[],
    };
  },

  getAnnouncements: async (params?: { limit?: number; offset?: number }) => {
    const response = await apiClient.get("/school/announcements", { params });
    return {
      ok: true,
      data: (response.data?.data ?? []) as SchoolAnnouncement[],
      total: (response.data?.total ?? 0) as number,
    };
  },

  createAnnouncement: async (payload: FormData | Record<string, any>) => {
    const isFormData = payload instanceof FormData;
    const response = await apiClient.post("/school/announcements", payload, {
      headers: isFormData ? { "Content-Type": "multipart/form-data" } : undefined,
    });
    return { ok: true, data: response.data };
  },

  updateAnnouncement: async (id: number, payload: FormData | Record<string, any>) => {
    const isFormData = payload instanceof FormData;
    const response = await apiClient.patch(`/school/announcements/${id}`, payload, {
      headers: isFormData ? { "Content-Type": "multipart/form-data" } : undefined,
    });
    return { ok: true, data: response.data };
  },

  deleteAnnouncement: async (id: number) => {
    const response = await apiClient.delete(`/school/announcements/${id}`);
    return { ok: true, data: response.data };
  },

  getTrips: async (params?: { status?: string; date?: string; limit?: number; offset?: number }) => {
    const response = await apiClient.get("/school/trips", { params });
    return {
      ok: true,
      data: (response.data?.data ?? []) as SchoolTrip[],
    };
  },

  createTrip: async (payload: {
    tripName: string;
    pickupLocation: string;
    dropoffLocation: string;
    startTime: string;
    pickupAddress?: string;
    dropoffAddress?: string;
    noOfPersons?: number;
    specialInstructions?: string;
  }) => {
    const response = await apiClient.post("/school/CreateTrips", payload);
    return { ok: true, data: response.data };
  },

  updateTrip: async (id: number, payload: Record<string, any>) => {
    const response = await apiClient.patch(`/school/trips/${id}`, payload);
    return { ok: true, data: response.data };
  },

  cancelTrip: async (id: number) => {
    const response = await apiClient.delete(`/school/trips/${id}`);
    return { ok: true, data: response.data };
  },

  getProfile: async () => {
    const response = await apiClient.get("/school/profile");
    return { ok: true, data: response.data?.data ?? response.data };
  },

  updateProfile: async (payload: FormData) => {
    const response = await apiClient.patch("/school/profile", payload, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return { ok: true, data: response.data };
  },
};
