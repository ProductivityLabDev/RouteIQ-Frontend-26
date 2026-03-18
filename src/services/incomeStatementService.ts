import { apiClient } from "@/configs/api";

export const incomeStatementService = {
  getIncomeStatement: async (startDate?: string, endDate?: string) => {
    const params: Record<string, string> = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    const response = await apiClient.get("/income-statement", { params });
    return { ok: true, data: response.data?.data };
  },

  getIncomeStatementChart: async (year?: number) => {
    const params = year ? { year } : {};
    const response = await apiClient.get("/income-statement/chart", { params });
    return { ok: true, data: response.data?.data };
  },
};
