import { apiClient } from "@/configs/api";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface VendorDashboardStats {
  vehicles: { total: number; inactive: number };
  schools:  { total: number; pending: number  };
  trips:    { total: number; pending: number  };
}

export interface VendorSchool {
  id:          number;
  name:        string;
  contactInfo: string;
  email:       string;
  status:      string;
}

export interface VendorDriver {
  id:                 number;
  name:               string;
  payRate:            string;
  terminalAssignedTo: string;
  availability:       "Present" | "Absent";
}

// ─── Service ─────────────────────────────────────────────────────────────────

export const vendorService = {
  getDashboardStats: async () => {
    const response = await apiClient.get("/institute/vendor/dashboard");
    return { ok: true, data: response.data?.data as VendorDashboardStats };
  },

  getSchools: async (params?: { limit?: number; offset?: number; status?: string }) => {
    const response = await apiClient.get("/institute/vendor/schools", { params });
    return {
      ok: true,
      data: (response.data?.data ?? []) as VendorSchool[],
      total: (response.data?.total ?? 0) as number,
    };
  },

  getDrivers: async (params?: { limit?: number; offset?: number }) => {
    const response = await apiClient.get("/institute/vendor/drivers", { params });
    return {
      ok: true,
      data: (response.data?.data ?? []) as VendorDriver[],
      total: (response.data?.total ?? 0) as number,
    };
  },
};
