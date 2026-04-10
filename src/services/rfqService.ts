import axios from "axios";
import { getAuthToken } from "@/configs/api";

const RFQ_BASE_URL = "http://167.88.167.187:3002";

const rfqClient = axios.create({
  baseURL: RFQ_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

rfqClient.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface RFQStatusPayload {
  status: "Accepted" | "Rejected";
  quotedAmount?: number;
  vehicleId?: number;
  driverId?: number;
}

export const rfqService = {
  getAllRFQs: async () => {
    const response = await rfqClient.get("/vendor/retailer/rfqs");
    return response.data;
  },

  updateRFQStatus: async (id: number | string, payload: RFQStatusPayload) => {
    const response = await rfqClient.patch(`/vendor/retailer/rfq/${id}/status`, payload);
    return response.data;
  },
};
