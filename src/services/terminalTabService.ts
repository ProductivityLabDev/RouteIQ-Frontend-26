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
};
