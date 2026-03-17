import { apiClient } from "@/configs/api";

export const balanceSheetService = {

  getBalanceSheet: async () => {
    const response = await apiClient.get("/balance-sheet");
    return { ok: true, data: response.data?.data };
  },

  getSummary: async (startDate?: string, endDate?: string) => {
    const params: Record<string, string> = {};
    if (startDate) params.startDate = startDate;
    if (endDate) params.endDate = endDate;
    const response = await apiClient.get("/balance-sheet/summary", { params });
    return { ok: true, data: response.data?.data };
  },

  getChartData: async (year?: number) => {
    const params = year ? { year } : {};
    const response = await apiClient.get("/balance-sheet/chart", { params });
    return { ok: true, data: response.data?.data };
  },

  addEntry: async (data: { section: string; label: string; amount: number; sortOrder?: number }) => {
    const response = await apiClient.post("/balance-sheet/entry", data);
    return { ok: true, data: response.data?.data };
  },

  updateEntry: async (id: number, data: { label?: string; amount?: number; sortOrder?: number }) => {
    const response = await apiClient.patch(`/balance-sheet/entry/${id}`, data);
    return { ok: true, data: response.data?.data };
  },

  deleteEntry: async (id: number) => {
    const response = await apiClient.delete(`/balance-sheet/entry/${id}`);
    return { ok: true, data: response.data?.data };
  },
};
