import { apiClient } from "@/configs/api";
import { ApiResponse } from "@/types/api";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Invoice {
  id: number;
  source?: string;
  status?: string;
  date?: string;
  paymentDate?: string;
  paymentMethod?: string;
  tripId?: number;
  tripStatus?: string;
  client?: string;
  invoiceId?: number;
  billTo?: string;
  type?: string;
  milesPerRate?: number;
  invoiceTotal?: number;
  [key: string]: any;
}

export interface InvoiceListResponse {
  total: number;
  data: Invoice[];
  limit: number;
  offset: number;
}

// ─── Service ──────────────────────────────────────────────────────────────────

export const accountsReceivableService = {

  getInvoices: async (params?: {
    source?: "All" | "Trip" | "School" | "Retail";
    status?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<ApiResponse<InvoiceListResponse>> => {
    const response = await apiClient.get("/accounts-receivable", { params });
    return { ok: true, data: { total: response.data?.total, data: response.data?.data } };
  },

  getInvoiceDetail: async (id: number): Promise<ApiResponse<Invoice>> => {
    const response = await apiClient.get(`/accounts-receivable/${id}`);
    return { ok: true, data: response.data?.data };
  },

  markInvoicePaid: async (id: number) => {
    const response = await apiClient.patch(`/accounts-receivable/${id}/pay`);
    return { ok: true, data: response.data?.data };
  },
};
