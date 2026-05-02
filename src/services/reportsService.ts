import { apiClient } from "@/configs/api";

export const reportsService = {
  getGenerateReport: async (params?: {
    category?: "Employees" | "SchoolInvoices" | "TripInvoices" | "AccountsReceivable" | "AccountsPayable" | "GLCodes";
    dataType?: "Table";
    year?: number;
    month?: number;
    search?: string;
    sortBy?: "name" | "invoiceTotal" | "workHours";
    limit?: number;
    offset?: number;
  }) => {
    const response = await apiClient.get("/generate-report", { params });
    return { ok: true, data: response.data?.data };
  },
};
