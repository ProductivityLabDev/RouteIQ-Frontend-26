/**
 * API Configuration Utility
 * Centralized configuration for API base URL and prefix
 */

import axios from 'axios';

// Base URL for the API
export const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:3000';

// API prefix (if any)
export const API_PREFIX = import.meta.env.VITE_API_PREFIX || '';

// Full API URL (BASE_URL + API_PREFIX)
export const API_URL = `${BASE_URL}${API_PREFIX}`;

// Helper function to get full endpoint URL
export const getApiUrl = (endpoint) => {
    // Remove leading slash from endpoint if present to avoid double slashes
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
    return `${BASE_URL}${API_PREFIX ? `/${API_PREFIX}` : ''}${cleanEndpoint ? `/${cleanEndpoint}` : ''}`;
};

// Helper function to get auth token from localStorage
export const getAuthToken = () => {
    return localStorage.getItem('token') || null;
};

// Helper function to get axios config with auth headers
export const getAxiosConfig = (customHeaders = {}) => {
    const token = getAuthToken();
    return {
        withCredentials: true,
        headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
            'Content-Type': 'application/json',
            ...customHeaders,
        },
    };
};

// Helper function to create axios instance with default config
export const createApiClient = () => {
    const token = getAuthToken();
    return axios.create({
        baseURL: BASE_URL,
        withCredentials: true,
        headers: {
            ...(token && { Authorization: `Bearer ${token}` }),
            'Content-Type': 'application/json',
        },
    });
};

// Default export with all API config
export default {
    BASE_URL,
    API_PREFIX,
    API_URL,
    getApiUrl,
    getAuthToken,
    getAxiosConfig,
    createApiClient,
};

