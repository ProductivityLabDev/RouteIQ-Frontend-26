import { apiClient } from "@/configs/api";
import type { ApiResponse } from "@/types/api";

export interface NotificationItem {
  NotificationId: number;
  Title?: string;
  Message?: string;
  NotificationType?: string;
  RelatedEntityType?: string | null;
  RelatedEntityId?: number | null;
  IsRead?: number | boolean;
  CreatedAt?: string;
  [key: string]: any;
}

export interface UnreadCountResponse {
  ok: boolean;
  unreadCount: number;
}

export interface SendNotificationPayload {
  title: string;
  message: string;
  audience: "general" | "parent" | "driver" | "vendor" | "institute" | "admin";
  userId?: number;
  // Optional scope controls (per guide)
  terminalId?: number;
  instituteId?: number;
  relatedEntityType?: string;
  relatedEntityId?: number;
}

export const notificationService = {
  getMyNotifications: async (params?: {
    limit?: number;
    offset?: number;
  }): Promise<ApiResponse<NotificationItem[]>> => {
    const response = await apiClient.get("/notifications", { params });
    const data = Array.isArray(response.data?.data)
      ? response.data.data
      : Array.isArray(response.data)
      ? response.data
      : [];
    return { ok: true, data };
  },

  getUnreadCount: async (): Promise<UnreadCountResponse> => {
    const response = await apiClient.get("/notifications/unread-count");
    return {
      ok: Boolean(response.data?.ok ?? true),
      unreadCount: Number(response.data?.unreadCount ?? 0),
    };
  },

  markRead: async (id: number | string): Promise<ApiResponse<any>> => {
    const response = await apiClient.patch(`/notifications/${id}/read`);
    return { ok: true, data: response.data };
  },

  markAllRead: async (): Promise<ApiResponse<any>> => {
    const response = await apiClient.patch(`/notifications/read-all`);
    return { ok: true, data: response.data };
  },

  send: async (payload: SendNotificationPayload): Promise<ApiResponse<any>> => {
    const response = await apiClient.post("/notifications/send", payload);
    return { ok: true, data: response.data };
  },

  getSent: async (params?: {
    limit?: number;
    offset?: number;
  }): Promise<ApiResponse<NotificationItem[]>> => {
    const response = await apiClient.get("/notifications/sent", { params });
    const data = Array.isArray(response.data?.data)
      ? response.data.data
      : Array.isArray(response.data)
      ? response.data
      : [];
    return { ok: true, data };
  },
};

