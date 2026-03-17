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

  getInvoices: async (params?: {
    terminalId?: number;
    status?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }) => {
    const response = await apiClient.get("/terminal-tab/invoices", { params });
    return { ok: true, data: response.data?.data };
  },

  createInvoice: async (payload: {
    terminalId: number;
    lineItems: { glCodeId: number; description: string; quantity: number; unitPrice: number }[];
    [key: string]: unknown;
  }) => {
    const response = await apiClient.post("/terminal-tab/invoices", payload);
    return { ok: true, data: response.data?.data };
  },

  deleteInvoice: async (id: number) => {
    await apiClient.delete(`/terminal-tab/invoices/${id}`);
    return { ok: true, id };
  },

  getTrack: async (terminalId: number, year?: number) => {
    const response = await apiClient.get(`/terminal-tab/track/${terminalId}`, {
      params: year ? { year } : undefined,
    });
    return { ok: true, data: response.data?.data };
  },
};
