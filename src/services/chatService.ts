import { apiClient } from "@/configs/api";
import type { ApiResponse, PaginationMeta } from "@/types/api";

export interface Participant {
  id: number;
  type: string;
  name: string;
  avatar?: string;
}

export interface Conversation {
  id: number;
  type: "DIRECT" | "GROUP";
  name?: string;
  avatar?: string;
  // DIRECT conversations
  participant?: Participant;
  // GROUP conversations
  participants?: Participant[];
  lastMessage?: string;
  lastMessageAt?: string;
  unreadCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Message {
  id: number;
  conversationId?: number;
  content: string;
  messageType?: "TEXT" | "IMAGE" | "FILE";
  attachmentUrl?: string;
  sender?: Participant;
  // Flattened fields (backward compat)
  senderId?: number;
  senderType?: string;
  senderName?: string;
  fileUrl?: string;
  fileType?: string;
  createdAt: string;
  status?: string;
  deliveredTo?: number;
  readBy?: number;
}

export interface Contact {
  id: number;
  name: string;
  type: string;
  avatar?: string;
  existingConversationId?: number | null;
}

export const chatService = {
  getContacts: async (type: string): Promise<ApiResponse<Contact[]>> => {
    const response = await apiClient.get("/chat/contacts", { params: { type } });
    const raw = response.data;
    const data = Array.isArray(raw?.contacts)
      ? raw.contacts
      : Array.isArray(raw?.data)
      ? raw.data
      : Array.isArray(raw)
      ? raw
      : [];
    return { ok: true, data };
  },

  getConversations: async (type?: string): Promise<ApiResponse<Conversation[]>> => {
    const response = await apiClient.get("/chat/conversations", {
      params: type ? { type } : undefined,
    });
    const raw = response.data;
    const data = Array.isArray(raw?.conversations)
      ? raw.conversations
      : Array.isArray(raw?.data)
      ? raw.data
      : Array.isArray(raw)
      ? raw
      : [];
    return { ok: true, data };
  },

  createConversation: async (payload: {
    participantId: number;
    participantType: string;
    type?: "DIRECT" | "GROUP";
    name?: string;
  }): Promise<ApiResponse<Conversation>> => {
    const response = await apiClient.post("/chat/conversations", payload);
    return { ok: true, data: response.data?.data || response.data };
  },

  getMessages: async (
    conversationId: number,
    params?: { page?: number; limit?: number }
  ): Promise<ApiResponse<Message[]>> => {
    const response = await apiClient.get(
      `/chat/conversations/${conversationId}/messages`,
      { params }
    );
    const raw = response.data;
    const data = Array.isArray(raw?.messages)
      ? raw.messages
      : Array.isArray(raw?.data)
      ? raw.data
      : Array.isArray(raw)
      ? raw
      : [];
    const hasMore = raw?.hasMore ?? false;
    const total = raw?.total;
    return { ok: true, data, pagination: total != null ? { page: params?.page || 1, limit: params?.limit || 50, total, totalPages: Math.ceil(total / (params?.limit || 50)), hasMore } as any : undefined };
  },

  sendMessage: async (payload: {
    conversationId: number;
    content?: string;
    file?: File;
  }): Promise<ApiResponse<Message>> => {
    const formData = new FormData();
    formData.append("conversationId", String(payload.conversationId));
    if (payload.content) formData.append("content", payload.content);
    if (payload.file) formData.append("file", payload.file);

    const response = await apiClient.post("/chat/messages", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return { ok: true, data: response.data?.data || response.data };
  },

  markAsRead: async (conversationId: number): Promise<ApiResponse<any>> => {
    const response = await apiClient.patch(
      `/chat/conversations/${conversationId}/read`
    );
    return { ok: true, data: response.data };
  },

  addParticipant: async (
    conversationId: number,
    participantId: number,
    participantType: string
  ): Promise<ApiResponse<any>> => {
    const response = await apiClient.post(
      `/chat/conversations/${conversationId}/participants`,
      { id: participantId, type: participantType }
    );
    return { ok: true, data: response.data };
  },

  removeParticipant: async (
    conversationId: number,
    participantId: number,
    participantType: string
  ): Promise<ApiResponse<any>> => {
    const response = await apiClient.delete(
      `/chat/conversations/${conversationId}/participants/${participantId}/${participantType}`
    );
    return { ok: true, data: response.data };
  },

  updateGroup: async (
    conversationId: number,
    payload: { name?: string; avatar?: string }
  ): Promise<ApiResponse<Conversation>> => {
    const response = await apiClient.patch(
      `/chat/conversations/${conversationId}`,
      payload
    );
    return { ok: true, data: response.data?.data || response.data };
  },

  getMonitoringConversations: async (
    params?: Record<string, any>
  ): Promise<ApiResponse<Conversation[]>> => {
    // Backend DTO: page, limit, sourceType, targetType (ParticipantType: DRIVER | GUARDIAN | SCHOOL | VENDOR).
    // Both optional. sourceType/targetType filter by participant types in the conversation.
    const safeParams: Record<string, any> = {};
    if (params) {
      if (params.page !== undefined) safeParams.page = params.page;
      if (params.limit !== undefined) safeParams.limit = params.limit;
      const src = params.sourceType ?? params.participantType ?? params.type;
      if (src && String(src).trim()) safeParams.sourceType = String(src).trim();
      const tgt = params.targetType;
      if (tgt && String(tgt).trim()) safeParams.targetType = String(tgt).trim();
    }
    const response = await apiClient.get("/chat/monitoring/conversations", {
      params: safeParams,
    });
    const raw = response.data;
    const data = Array.isArray(raw?.data)
      ? raw.data
      : Array.isArray(raw?.conversations)
      ? raw.conversations
      : Array.isArray(raw)
      ? raw
      : [];
    const pagination: PaginationMeta | undefined =
      raw?.meta?.pagination || raw?.pagination || (raw?.total != null
        ? {
            page: params?.page || 1,
            limit: params?.limit || 20,
            total: raw.total,
            totalPages: Math.ceil(raw.total / (params?.limit || 20)),
          }
        : undefined);
    return { ok: true, data, pagination };
  },

  getMonitoringMessages: async (
    conversationId: number,
    params?: { page?: number; limit?: number; beforeMessageId?: number }
  ): Promise<ApiResponse<Message[]>> => {
    const response = await apiClient.get(
      `/chat/monitoring/conversations/${conversationId}/messages`,
      { params }
    );
    const raw = response.data;
    // Backend returns { ok, messages, hasMore, total }
    const data = Array.isArray(raw?.data)
      ? raw.data
      : Array.isArray(raw?.messages)
      ? raw.messages
      : Array.isArray(raw)
      ? raw
      : [];
    const total = raw?.total;
    const hasMore = raw?.hasMore ?? (total != null && data.length < total);
    const pagination: PaginationMeta | undefined =
      raw?.meta?.pagination || raw?.pagination || (total != null
        ? {
            page: params?.page || 1,
            limit: params?.limit || 50,
            total,
            totalPages: Math.ceil(total / (params?.limit || 50)),
            hasMore,
          }
        : undefined);
    return { ok: true, data, pagination };
  },
};
