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
    const envelope = response.data as Record<string, unknown> | undefined;
    // Supports { ok, data: { total, invoices } } or flat { total, invoices }
    const inner = envelope?.data as Record<string, unknown> | undefined;
    const body =
      inner &&
      typeof inner === "object" &&
      (Array.isArray(inner.invoices as unknown[]) ||
        Array.isArray(inner.items as unknown[]) ||
        typeof inner.total === "number")
        ? inner
        : (envelope as Record<string, unknown> | undefined);
    const raw =
      (body?.invoices as unknown[]) ??
      (body?.items as unknown[]) ??
      (body?.rows as unknown[]) ??
      (Array.isArray(body) ? body : []);
    const list = Array.isArray(raw)
      ? raw.map((inv) => {
          if (!inv || typeof inv !== "object") return inv;
          // Backend repeats list-level count on each row; strip so UI never treats it as invoice total
          const { total: _stripCountDup, ...rest } = inv as Record<string, unknown>;
          return rest;
        })
      : [];
    const totalRaw =
      (typeof body?.total === "number" ? body.total : undefined) ??
      (typeof body?.count === "number" ? body.count : undefined) ??
      (typeof envelope?.meta === "object" && envelope.meta !== null && "total" in envelope.meta
        ? Number((envelope.meta as Record<string, unknown>).total)
        : undefined) ??
      (typeof envelope?.total === "number" ? envelope.total : undefined);
    const total =
      typeof totalRaw === "number" && !Number.isNaN(totalRaw)
        ? totalRaw
        : list.length;
    return { ok: true, data: { total, data: list } };
  },

  getInvoiceDetail: async (id: number | string) => {
    const response = await apiClient.get("/invoices", {
      params: { id },
    });
    return { ok: true, data: response.data?.data };
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
