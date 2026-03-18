import { apiClient } from "@/configs/api";

export const vendorFeedbackService = {
  getStats: async () => {
    const response = await apiClient.get("/vendor/feedback/stats");
    return {
      ok: true,
      data: response.data?.data || { total: 0, positive: 0, negative: 0 },
    };
  },

  getFeedbackList: async ({ type, search, limit = 20, offset = 0 } = {}) => {
    const params = {
      ...(type ? { type } : {}),
      ...(search ? { search } : {}),
      limit,
      offset,
    };
    const response = await apiClient.get("/vendor/feedback", { params });
    return {
      ok: true,
      data: response.data?.data || [],
      limit: response.data?.limit ?? limit,
      offset: response.data?.offset ?? offset,
    };
  },

  getFeedbackDetail: async (id) => {
    const response = await apiClient.get(`/vendor/feedback/${id}`);
    return { ok: true, data: response.data?.data || null };
  },

  updateFeedbackStatus: async (id, status) => {
    const response = await apiClient.patch(`/vendor/feedback/${id}/status`, { status });
    return { ok: true, data: response.data };
  },
};

export default vendorFeedbackService;
