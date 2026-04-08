import { apiClient } from "@/configs/api";

const unwrap = (raw: any) => raw?.data ?? raw;

export const kpiService = {
  getSummary: async () => {
    const res = await apiClient.get("/kpi/summary");
    return unwrap(res.data);
  },

  getRevenueChart: async (year?: number) => {
    const res = await apiClient.get("/kpi/revenue-chart", {
      params: year ? { year } : undefined,
    });
    return unwrap(res.data);
  },

  getCurrentStatistic: async (year?: number) => {
    const res = await apiClient.get("/kpi/current-statistic", {
      params: year ? { year } : undefined,
    });
    return unwrap(res.data);
  },

  getInvoiceOverview: async (year?: number) => {
    const res = await apiClient.get("/kpi/invoice-overview", {
      params: year ? { year } : undefined,
    });
    return unwrap(res.data);
  },

  getSatisfaction: async (year?: number, month?: number) => {
    const params: Record<string, number> = {};
    if (year) params.year = year;
    if (month) params.month = month;
    const res = await apiClient.get("/kpi/satisfaction", {
      params: Object.keys(params).length ? params : undefined,
    });
    return unwrap(res.data);
  },
};

export default kpiService;
