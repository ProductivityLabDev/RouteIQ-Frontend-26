/**
 * API Configuration Utility
 * Centralized configuration for API base URL and prefix
 */

import axios, { type AxiosInstance, type AxiosRequestConfig, type InternalAxiosRequestConfig } from "axios";

export type ApiHeaders = Record<string, string>;

// Base URL for the API
export const BASE_URL: string =
  import.meta.env.VITE_BASE_URL || "http://localhost:3000";

// API prefix (if any)
export const API_PREFIX: string = import.meta.env.VITE_API_PREFIX || "";

// Full API URL (BASE_URL + API_PREFIX)
export const API_URL: string = `${BASE_URL}${API_PREFIX}`;

/**
 * Centralized Axios Instance
 * -------------------------
 * This instance automatically handles:
 * 1. Attaching the Bearer token from localStorage
 * 2. Redirecting to logout on 401 Unauthorized
 */
export const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Attach Auth Token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Global Error Handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("🚫 Unauthorized access - logging out...");
      // Use window.location.href to force a full reload to logout
      // this ensures all state is cleared.
      if (!window.location.pathname.includes("/account/sign-in")) {
        window.location.href = "/logout";
      }
    }
    return Promise.reject(error);
  }
);

// Helper function to get full endpoint URL
export const getApiUrl = (endpoint: string): string => {
  // Remove leading slash from endpoint if present to avoid double slashes
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint.slice(1) : endpoint;
  return `${BASE_URL}${API_PREFIX ? `/${API_PREFIX}` : ""}${
    cleanEndpoint ? `/${cleanEndpoint}` : ""
  }`;
};

// Helper function to get auth token from localStorage
export const getAuthToken = (): string | null => {
  return localStorage.getItem("token") || null;
};

// Legacy Helper (deprecated but kept for compatibility)
export const getAxiosConfig = (customHeaders: ApiHeaders = {}): AxiosRequestConfig => {
  const token = getAuthToken();
  return {
    withCredentials: true,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      "Content-Type": "application/json",
      ...customHeaders,
    },
  };
};

// Legacy Helper (deprecated but kept for compatibility)
export const createApiClient = (): AxiosInstance => apiClient;

export default {
  BASE_URL,
  API_PREFIX,
  API_URL,
  apiClient,
  getApiUrl,
  getAuthToken,
  getAxiosConfig,
  createApiClient,
};


