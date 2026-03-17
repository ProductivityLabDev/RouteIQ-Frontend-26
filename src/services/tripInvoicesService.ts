import { apiClient } from "@/configs/api";
import { ApiResponse } from "@/types/api";

export const tripInvoicesService = {

  getTerminals: async () => {
    const response = await apiClient.get("/trip-invoices/terminals");
    return { ok: true, data: response.data?.data };
  },

  getInvoices: async (params?: {
    terminalId?: number;
    status?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }) => {
    const response = await apiClient.get("/trip-invoices", { params });
    const raw = response.data?.data?.invoices ?? response.data?.data;
    return { ok: true, data: { total: response.data?.data?.total, data: Array.isArray(raw) ? raw : [] } };
  },

  createInvoice: async (data: any) => {
    const response = await apiClient.post("/trip-invoices", data);
    return { ok: true, data: response.data?.data };
  },

  batchInvoice: async (data: { invoiceIds: number[]; notes?: string }) => {
    const response = await apiClient.post("/trip-invoices/batch", data);
    return { ok: true, data: response.data?.data };
  },

  sendInvoice: async (id: number) => {
    const response = await apiClient.post(`/trip-invoices/${id}/send`);
    return { ok: true, data: response.data?.data };
  },

  importInvoices: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await apiClient.post("/trip-invoices/import", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return { ok: true, data: response.data?.data };
  },

  deleteInvoice: async (id: number) => {
    const response = await apiClient.delete(`/trip-invoices/${id}`);
    return { ok: true, data: response.data?.data };
  },

  exportInvoice: async (id: number, format: "pdf" | "csv" | "excel" = "pdf") => {
    const response = await apiClient.get(`/trip-invoices/${id}/export`, {
      params: { format },
      responseType: "blob",
    });
    return response.data;
  },
};
