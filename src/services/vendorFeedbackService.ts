import { apiClient } from "@/configs/api";

const pickFirst = (...values) => values.find((value) => value !== undefined && value !== null && value !== "");

const normalizeFeedbackStats = (raw = {}) => ({
  total: Number(pickFirst(raw?.total, raw?.Total, raw?.count, 0)) || 0,
  positive: Number(pickFirst(raw?.positive, raw?.Positive, raw?.positiveCount, 0)) || 0,
  negative: Number(pickFirst(raw?.negative, raw?.Negative, raw?.negativeCount, 0)) || 0,
  open: Number(pickFirst(raw?.open, raw?.Open, raw?.openCount, 0)) || 0,
  resolved: Number(pickFirst(raw?.resolved, raw?.Resolved, raw?.resolvedCount, 0)) || 0,
});

const normalizeFeedbackItem = (item = {}) => ({
  FeedbackId: pickFirst(item?.FeedbackId, item?.feedbackId, item?.Id, item?.id, ""),
  Subject: String(pickFirst(item?.Subject, item?.subject, "--")),
  Message: String(pickFirst(item?.Message, item?.message, item?.Body, item?.body, "")),
  FeedbackType: String(pickFirst(item?.FeedbackType, item?.feedbackType, item?.Type, item?.type, "--")),
  Rating: String(pickFirst(item?.Rating, item?.rating, "--")),
  Status: String(pickFirst(item?.Status, item?.status, "Open")),
  CreatedAt: pickFirst(item?.CreatedAt, item?.createdAt, item?.Date, item?.date, ""),
  UpdatedAt: pickFirst(item?.UpdatedAt, item?.updatedAt, ""),
  senderName: String(
    pickFirst(
      item?.senderName,
      item?.SenderName,
      item?.FullName,
      item?.fullName,
      item?.ContactName,
      item?.contactName,
      item?.Email,
      item?.email,
      "Unknown"
    )
  ),
  senderType: String(
    pickFirst(
      item?.senderType,
      item?.SenderType,
      item?.Role,
      item?.role,
      item?.SendTo,
      item?.sendTo,
      ""
    )
  ),
  messagePreview: String(
    pickFirst(item?.messagePreview, item?.MessagePreview, item?.Message, item?.message, "")
  ),
  email: String(pickFirst(item?.vendorEmail, item?.VendorEmail, item?.Email, item?.email, "")),
  companyName: String(pickFirst(item?.CompanyName, item?.companyName, "")),
  contactName: String(pickFirst(item?.ContactName, item?.contactName, "")),
  phone: String(pickFirst(item?.Phone, item?.phone, "")),
});

export const vendorFeedbackService = {
  getStats: async () => {
    const response = await apiClient.get("/vendor/feedback/stats");
    return {
      ok: true,
      data: normalizeFeedbackStats(response.data?.data || response.data || {}),
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
    const raw = response.data?.data ?? response.data ?? [];
    const items = Array.isArray(raw)
      ? raw
      : Array.isArray(raw?.items)
      ? raw.items
      : Array.isArray(raw?.feedback)
      ? raw.feedback
      : [];
    return {
      ok: true,
      data: items.map(normalizeFeedbackItem),
      limit: response.data?.limit ?? raw?.limit ?? limit,
      offset: response.data?.offset ?? raw?.offset ?? offset,
    };
  },

  getFeedbackDetail: async (id) => {
    const response = await apiClient.get(`/vendor/feedback/${id}`);
    return { ok: true, data: normalizeFeedbackItem(response.data?.data || response.data || null) };
  },

  updateFeedbackStatus: async (id, status) => {
    const response = await apiClient.patch(`/vendor/feedback/${id}/status`, { status });
    return { ok: true, data: response.data };
  },

  submitCompanyFeedback: async (payload) => {
    const response = await apiClient.post("/vendor/feedback/company", payload);
    return {
      ok: true,
      message: pickFirst(response.data?.message, response.data?.data?.message, "Feedback sent successfully"),
      data: response.data?.data ?? response.data ?? {},
    };
  },

  getSuperAdminStats: async () => {
    const response = await apiClient.get("/super-admin/feedback/stats");
    return {
      ok: true,
      data: normalizeFeedbackStats(response.data?.data || response.data || {}),
    };
  },

  getSuperAdminFeedbackList: async ({
    search,
    feedbackType,
    status,
    limit = 20,
    offset = 0,
  } = {}) => {
    const params = {
      ...(search ? { search } : {}),
      ...(feedbackType ? { feedbackType } : {}),
      ...(status ? { status } : {}),
      limit,
      offset,
    };
    const response = await apiClient.get("/super-admin/feedback", { params });
    const raw = response.data?.data ?? response.data ?? {};
    const items = Array.isArray(raw)
      ? raw
      : Array.isArray(raw?.items)
      ? raw.items
      : Array.isArray(raw?.feedback)
      ? raw.feedback
      : Array.isArray(raw?.rows)
      ? raw.rows
      : [];

    return {
      ok: true,
      data: items.map(normalizeFeedbackItem),
      total: Number(pickFirst(raw?.total, response.data?.total, items.length)) || items.length,
      limit: pickFirst(raw?.limit, response.data?.limit, limit),
      offset: pickFirst(raw?.offset, response.data?.offset, offset),
    };
  },

  getSuperAdminFeedbackDetail: async (id) => {
    const response = await apiClient.get(`/super-admin/feedback/${id}`);
    return {
      ok: true,
      data: normalizeFeedbackItem(response.data?.data || response.data || {}),
    };
  },

  updateSuperAdminFeedbackStatus: async (id, status) => {
    const response = await apiClient.patch(`/super-admin/feedback/${id}/status`, { status });
    return { ok: true, data: response.data?.data ?? response.data };
  },
};

export default vendorFeedbackService;
