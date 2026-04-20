/**
 * API Configuration Utility
 * Centralized configuration for API base URL and prefix
 */

import axios, { type AxiosInstance, type AxiosRequestConfig, type InternalAxiosRequestConfig } from "axios";

export type ApiHeaders = Record<string, string>;

const RAW_BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3000";

export const BASE_URL: string = String(RAW_BASE_URL).replace(/\/+$/, "");

export const API_PREFIX: string = import.meta.env.VITE_API_PREFIX || "";

export const API_URL: string = `${BASE_URL}${API_PREFIX}`;

export const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

let refreshPromise: Promise<string | null> | null = null;

export const getAuthToken = (): string | null => {
  return localStorage.getItem("token") || null;
};

export const getRefreshToken = (): string | null => {
  return localStorage.getItem("refreshToken") || null;
};

export const setAuthTokens = (
  accessToken: string,
  refreshToken?: string | null
): void => {
  localStorage.setItem("token", accessToken);
  if (refreshToken === null) {
    localStorage.removeItem("refreshToken");
  } else if (refreshToken) {
    localStorage.setItem("refreshToken", refreshToken);
  }
};

export const clearAuthTokens = (): void => {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
};

const isAuthEndpoint = (url?: string): boolean => {
  if (!url) return false;
  return (
    url.includes("/auth/login") ||
    url.includes("/auth/refresh") ||
    url.includes("/auth/logout")
  );
};

const refreshAccessToken = async (): Promise<string | null> => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;

  if (!refreshPromise) {
    refreshPromise = axios
      .post(
        `${BASE_URL}/auth/refresh`,
        { refreshToken },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        const newAccessToken =
          response.data?.access_token ||
          response.data?.accessToken ||
          response.data?.token ||
          response.data?.data?.access_token;

        const newRefreshToken =
          response.data?.refresh_token ||
          response.data?.refreshToken ||
          response.data?.data?.refresh_token ||
          refreshToken;

        if (!newAccessToken) {
          throw new Error("Access token not found in refresh response");
        }

        setAuthTokens(newAccessToken, newRefreshToken);
        return newAccessToken;
      })
      .catch(() => {
        clearAuthTokens();
        return null;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
};

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getAuthToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !isAuthEndpoint(originalRequest.url)
    ) {
      originalRequest._retry = true;

      const newAccessToken = await refreshAccessToken();
      if (newAccessToken) {
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return apiClient(originalRequest);
      }
    }

    if (
      error.response?.status === 401 &&
      !isAuthEndpoint(originalRequest?.url) &&
      !window.location.pathname.includes("/account/sign-in")
    ) {
      window.location.href = "/logout";
    }

    return Promise.reject(error);
  }
);

export const getApiUrl = (endpoint: string): string => {
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint.slice(1) : endpoint;
  return `${BASE_URL}${API_PREFIX ? `/${API_PREFIX}` : ""}${
    cleanEndpoint ? `/${cleanEndpoint}` : ""
  }`;
};

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

export const createApiClient = (): AxiosInstance => apiClient;

export default {
  BASE_URL,
  API_PREFIX,
  API_URL,
  apiClient,
  getApiUrl,
  getAuthToken,
  getRefreshToken,
  setAuthTokens,
  clearAuthTokens,
  getAxiosConfig,
  createApiClient,
};
