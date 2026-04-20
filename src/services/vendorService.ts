import { apiClient } from "@/configs/api";
import axios from "axios";
import { BASE_URL } from "@/configs/api";

const shouldTryFallback = (error: any) => {
  const status = error?.response?.status;
  return status === 404 || status === 405;
};

const requestWithFallback = async <T = any>(
  primary: () => Promise<T>,
  fallback?: () => Promise<T>
): Promise<T> => {
  try {
    return await primary();
  } catch (error) {
    if (fallback && shouldTryFallback(error)) {
      return fallback();
    }
    throw error;
  }
};

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

export interface VendorProfilePayload {
  fullName?: string;
  username?: string;
  companyName?: string;
  contactNumber?: string;
  officePhone?: string;
  nameAndTitle?: string;
  address?: string;
  zipCode?: string;
  stateId?: number;
  cityId?: number;
}

export interface VendorSearchResult {
  id: number | string;
  label: string;
  type: string;
  subLabel?: string;
}

export interface InviteSummary {
  id: number | string;
  email: string;
  role: string;
  fullName: string;
  status: string;
  createdAt?: string;
  expiresAt?: string;
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

  getProfile: async () => {
    const response = await requestWithFallback(
      () => apiClient.get("/vendor/profile"),
      () => apiClient.get("/institute/vendor/profile")
    );
    console.log("[VendorProfile][getProfile] raw response:", response.data);
    return { ok: true, data: response.data?.data ?? response.data };
  },

  updateProfile: async (payload: VendorProfilePayload) => {
    const response = await requestWithFallback(
      () => apiClient.patch("/vendor/profile", payload),
      () => apiClient.patch("/institute/vendor/profile", payload)
    );
    return { ok: true, data: response.data?.data ?? response.data };
  },

  updateProfileLogo: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await requestWithFallback(
      () =>
        apiClient.patch("/vendor/profile/logo", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        }),
      () =>
        apiClient.patch("/institute/vendor/profile/logo", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        })
    );
    return { ok: true, data: response.data?.data ?? response.data };
  },

  search: async (query: string) => {
    const response = await apiClient.get("/vendor/search", { params: { q: query } });
    const raw = response.data?.data ?? response.data ?? [];
    return { ok: true, data: (Array.isArray(raw) ? raw : []) as VendorSearchResult[] };
  },

  createInvite: async (payload: { email: string; role: string; fullName: string }) => {
    const response = await apiClient.post("/vendor/invites", payload);
    return { ok: true, data: response.data?.data ?? response.data };
  },

  getInvites: async () => {
    const response = await apiClient.get("/vendor/invites");
    const raw = response.data?.data ?? response.data ?? [];
    return { ok: true, data: Array.isArray(raw) ? raw : [] };
  },

  deleteInvite: async (id: number | string) => {
    const response = await apiClient.delete(`/vendor/invites/${id}`);
    return { ok: true, data: response.data?.data ?? response.data };
  },
};

export const inviteService = {
  verifyInvite: async (token: string) => {
    const response = await axios.get(`${BASE_URL}/invite/verify`, { params: { token } });
    return { ok: true, data: response.data?.data ?? response.data };
  },

  acceptInvite: async (payload: { token: string; password: string }) => {
    const response = await axios.post(`${BASE_URL}/invite/accept`, payload, {
      headers: { "Content-Type": "application/json" },
    });
    return { ok: true, data: response.data?.data ?? response.data };
  },
};
