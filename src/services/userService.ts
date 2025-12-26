import { apiClient } from "@/configs/api";
import { ApiResponse } from "@/types/api";

export interface User {
  id?: number;
  UserId?: number;
  Username?: string;
  username?: string;
  Email?: string;
  email?: string;
  PhoneNumber?: string;
  phoneNumber?: string;
  RoleCode?: string;
  roleCode?: string;
  Control?: string;
  control?: string;
  Modules?: any;
  modules?: any;
  isActive?: boolean;
  createdAt?: string;
  VendorSignupId?: number;
}

export interface CreateUserPayload {
  username: string;
  password?: string;
  roleCode: string;
  terminalIds: number[];
  moduleIds: number[];
  control: string;
  isActive: boolean;
  email: string;
  phoneNumber: string;
  department?: string;
  permission?: string;
  VendorSignupId: number | null;
}

/**
 * User Service
 * ------------
 * Handles all API calls related to Access/User Management.
 */
export const userService = {
  /**
   * Fetch users for a specific vendor
   */
  getUsersByVendor: async (vendorId: number): Promise<ApiResponse<User[]>> => {
    const response = await apiClient.get<User[] | { data: User[] }>(
      `/institute/GetUserCredentials/${vendorId}`
    );
    
    // Normalize response based on what backend returns
    const rawData = response.data;
    const list = Array.isArray(rawData) ? rawData : (rawData as any).data || [];
    
    return {
      ok: true,
      data: list,
    };
  },

  /**
   * Create a new vendor user
   */
  createUser: async (payload: CreateUserPayload): Promise<ApiResponse<User>> => {
    const response = await apiClient.post<User>("/vendor/users", payload);
    return {
      ok: true,
      data: response.data,
    };
  },

  /**
   * Update an existing user
   */
  updateUser: async (userId: number | string, payload: Partial<CreateUserPayload>): Promise<ApiResponse<User>> => {
    const response = await apiClient.patch<User>(`/vendor/users/${userId}`, payload);
    return {
      ok: true,
      data: response.data,
    };
  },

  /**
   * Soft delete a user
   */
  deleteUser: async (userId: number | string): Promise<ApiResponse<any>> => {
    const response = await apiClient.delete(`/vendor/users/${userId}/soft-delete`);
    return {
      ok: true,
      data: response.data,
    };
  },
};

