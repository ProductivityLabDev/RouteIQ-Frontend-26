import { apiClient } from "@/configs/api";

export const vendorDocumentsService = {
  getCategories: async () => {
    const response = await apiClient.get("/vendor/documents/categories");
    return { ok: true, data: response.data?.data || [] };
  },

  getCorporateDocuments: async ({ category, limit = 20, offset = 0 } = {}) => {
    const params = { ...(category ? { category } : {}), limit, offset };
    const response = await apiClient.get("/vendor/documents/corporate", { params });
    return {
      ok: true,
      data: response.data?.data || [],
      limit: response.data?.limit ?? limit,
      offset: response.data?.offset ?? offset,
    };
  },

  uploadCorporateDocument: async (formData) => {
    const response = await apiClient.post("/vendor/documents/corporate", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return { ok: true, data: response.data };
  },

  deleteCorporateDocument: async (id) => {
    const response = await apiClient.delete(`/vendor/documents/corporate/${id}`);
    return { ok: true, data: response.data };
  },

  getTrainingEmployees: async () => {
    const response = await apiClient.get("/vendor/documents/training/employees");
    return { ok: true, data: response.data?.data || [] };
  },

  getTrainingDocuments: async ({ employeeId, category, limit = 20, offset = 0 } = {}) => {
    const params = {
      ...(employeeId ? { employeeId } : {}),
      ...(category ? { category } : {}),
      limit,
      offset,
    };
    const response = await apiClient.get("/vendor/documents/training", { params });
    return {
      ok: true,
      data: response.data?.data || [],
      limit: response.data?.limit ?? limit,
      offset: response.data?.offset ?? offset,
    };
  },

  uploadTrainingDocument: async (formData) => {
    const response = await apiClient.post("/vendor/documents/training", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return { ok: true, data: response.data };
  },

  deleteTrainingDocument: async (id) => {
    const response = await apiClient.delete(`/vendor/documents/training/${id}`);
    return { ok: true, data: response.data };
  },
};

export default vendorDocumentsService;
