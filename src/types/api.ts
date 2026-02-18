/**
 * Pagination metadata from API responses
 */
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

/**
 * Standard API Response structure
 */
export interface ApiResponse<T = any> {
  data: T;
  ok: boolean;
  message?: string;
  status?: number;
  pagination?: PaginationMeta;
}

/**
 * Common Error Response
 */
export interface ApiError {
  message: string;
  error?: string;
  statusCode?: number;
}

