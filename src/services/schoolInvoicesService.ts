import { apiClient } from "@/configs/api";
import { ApiResponse } from "@/types/api";

export interface InvoiceTerminal {
  TerminalId: number;
  TerminalName: string;
  TerminalCode?: string;
  Address?: string;
  City?: string;
  State?: string;
  [key: string]: any;
}

export interface InvoiceSchool {
  instituteId: number;
  instituteName: string;
  [key: string]: any;
}

export const schoolInvoicesService = {
  getTerminals: async (): Promise<ApiResponse<InvoiceTerminal[]>> => {
    const response = await apiClient.get("/school-invoices/terminals");
    return { ok: true, data: response.data?.data };
  },

  getSchoolsByTerminal: async (
    terminalId: number,
    params?: { limit?: number; offset?: number }
  ): Promise<ApiResponse<{ total: number; data: InvoiceSchool[] }>> => {
    const response = await apiClient.get(`/school-invoices/terminals/${terminalId}/schools`, { params });
    return { ok: true, data: { total: response.data?.data?.total, data: response.data?.data?.schools } };
  },

  getInvoices: async (params?: {
    instituteId?: number;
    status?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<ApiResponse<{ total: number; data: any[] }>> => {
    const response = await apiClient.get("/school-invoices", { params });
    const raw = response.data?.data?.invoices;
    return { ok: true, data: { total: response.data?.data?.total, data: Array.isArray(raw) ? raw : [] } };
  },

  createInvoice: async (data: any) => {
    const response = await apiClient.post("/school-invoices", data);
    return { ok: true, data: response.data?.data };
  },

  batchInvoice: async (data: { invoiceIds: number[]; instituteId: number; notes?: string }) => {
    const response = await apiClient.post("/school-invoices/batch", data);
    return { ok: true, data: response.data?.data };
  },

  sendInvoice: async (id: number) => {
    const response = await apiClient.post(`/school-invoices/${id}/send`);
    return { ok: true, data: response.data?.data };
  },

  importInvoices: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await apiClient.post("/school-invoices/import", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return { ok: true, data: response.data?.data };
  },

  deleteInvoice: async (id: number) => {
    const response = await apiClient.delete(`/school-invoices/${id}`);
    return { ok: true, data: response.data?.data };
  },

  exportInvoice: async (id: number, format: "pdf" | "csv" | "excel" = "pdf") => {
    const response = await apiClient.get(`/school-invoices/${id}/export`, {
      params: { format },
      responseType: "blob",
    });
    return response.data;
  },
};
