import { apiClient } from "@/configs/api";

export const terminalTabService = {
  getSummary: async () => {
    const response = await apiClient.get("/terminal-tab/summary");
    return { ok: true, data: response.data?.data };
  },

  getList: async () => {
    const response = await apiClient.get("/terminal-tab/list");
    return { ok: true, data: response.data?.data };
  },

  getTrack: async (terminalId: number, year?: number) => {
    const response = await apiClient.get(`/terminal-tab/track/${terminalId}`, {
      params: year ? { year } : undefined,
    });
    return { ok: true, data: response.data?.data };
  },

  getInvoices: async (params?: {
    terminalId?: number | string;
    status?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }) => {
    const response = await apiClient.get("/terminal-tab/invoices", { params });
    const raw =
      response.data?.data?.items ??
      response.data?.data?.invoices ??
      response.data?.data?.rows ??
      response.data?.data;
    return {
      ok: true,
      data: {
        total: response.data?.data?.total ?? (Array.isArray(raw) ? raw.length : 0),
        data: Array.isArray(raw) ? raw : [],
      },
    };
  },

  getInvoiceById: async (id: number | string) => {
    const response = await apiClient.get(`/terminal-tab/invoices/${id}`);
    return { ok: true, data: response.data?.data };
  },

  createInvoice: async (data: any) => {
    const response = await apiClient.post("/terminal-tab/invoices", data);
    return { ok: true, data: response.data?.data };
  },

  deleteInvoice: async (id: number | string) => {
    const response = await apiClient.delete(`/terminal-tab/invoices/${id}`);
    return { ok: true, data: response.data?.data };
  },
};
