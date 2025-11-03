/**
 * Standard API response models for type-safe HTTP communication.
 * These interfaces define the structure of API responses throughout the application.
 */

/**
 * Generic API response wrapper.
 * Used for standard API responses with success/error handling.
 *
 * @template T - The type of data returned in the response
 */
export interface ApiResponse<T = unknown> {
    success: boolean;
    data: T;
    message?: string;
    timestamp?: string;
}

/**
 * API error details.
 */
export interface ApiError {
    code: string;
    message: string;
    field?: string;
    details?: Record<string, any>;
}

/**
 * Error response from API.
 */
export interface ApiErrorResponse {
    success: false;
    error: ApiError;
    errors?: ApiError[];
    message: string;
    statusCode: number;
    timestamp?: string;
    path?: string;
}

/**
 * Validation error response.
 * Used when the API returns field-level validation errors.
 */
export interface ValidationErrorResponse extends ApiErrorResponse {
    errors: ApiError[];
}

/**
 * Pagination metadata.
 */
export interface PaginationMeta {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
}

/**
 * Paginated API response.
 * Used for endpoints that return paginated data.
 *
 * @template T - The type of items in the paginated response
 */
export interface PaginatedResponse<T = unknown> {
    success: boolean;
    data: T[];
    pagination: PaginationMeta;
    message?: string;
}

/**
 * Sort order for queries.
 */
export type SortOrder = 'asc' | 'desc';

/**
 * Pagination query parameters.
 */
export interface PaginationParams {
    page?: number;
    pageSize?: number;
    sortBy?: string;
    sortOrder?: SortOrder;
}

/**
 * Search query parameters.
 */
export interface SearchParams extends PaginationParams {
    search?: string;
    filters?: Record<string, any>;
}

/**
 * File upload response.
 */
export interface FileUploadResponse {
    success: boolean;
    data: {
        fileId: string;
        fileName: string;
        fileSize: number;
        mimeType: string;
        url: string;
        thumbnailUrl?: string;
    };
    message?: string;
}

/**
 * Batch operation response.
 * Used when performing bulk operations on multiple records.
 */
export interface BatchOperationResponse {
    success: boolean;
    data: {
        successCount: number;
        failureCount: number;
        totalCount: number;
        errors?: Array<{
            itemId: string;
            error: string;
        }>;
    };
    message?: string;
}

/**
 * Generic list response without pagination.
 */
export interface ListResponse<T = unknown> {
    success: boolean;
    data: T[];
    count: number;
    message?: string;
}

/**
 * Empty response for operations that don't return data.
 * Used for DELETE, UPDATE operations that return no content.
 */
export interface EmptyResponse {
    success: boolean;
    message?: string;
}

/**
 * Type guard to check if response is an error.
 */
export function isApiErrorResponse(
    response: ApiResponse<any> | ApiErrorResponse
): response is ApiErrorResponse {
    return !response.success && 'error' in response;
}

/**
 * Type guard to check if response is paginated.
 */
export function isPaginatedResponse<T>(
    response: ApiResponse<T> | PaginatedResponse<T>
): response is PaginatedResponse<T> {
    return 'pagination' in response;
}

/**
 * Type guard to check if response is a validation error.
 */
export function isValidationErrorResponse(
    response: ApiErrorResponse
): response is ValidationErrorResponse {
    return Array.isArray(response.errors) && response.errors.length > 0;
}

