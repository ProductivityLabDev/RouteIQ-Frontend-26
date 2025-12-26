/**
 * Standard API Response structure
 */
export interface ApiResponse<T = any> {
  data: T;
  ok: boolean;
  message?: string;
  status?: number;
}

/**
 * Common Error Response
 */
export interface ApiError {
  message: string;
  error?: string;
  statusCode?: number;
}

