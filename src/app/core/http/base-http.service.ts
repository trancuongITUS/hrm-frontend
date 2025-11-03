import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpContext } from '@angular/common/http';
import { Observable, throwError, timer } from 'rxjs';
import { catchError, map, retry, timeout } from 'rxjs/operators';
import { AppConfigService } from '@core/config/app-config.service';
import { LoggerService } from '@core/services/logger.service';
import {
    ApiResponse,
    ApiErrorResponse,
    PaginatedResponse,
    PaginationParams,
    SearchParams,
    ListResponse,
    EmptyResponse,
} from './api-response.model';

/**
 * HTTP request options interface.
 */
export interface HttpRequestOptions {
    headers?: HttpHeaders | { [header: string]: string | string[] };
    params?: HttpParams | { [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean> };
    context?: HttpContext;
    observe?: 'body';
    reportProgress?: boolean;
    responseType?: 'json';
    withCredentials?: boolean;
}

/**
 * Base HTTP service that wraps Angular's HttpClient.
 * Provides a consistent interface for making API calls with automatic error handling,
 * retry logic, and response transformation.
 *
 * Features:
 * - Automatic timeout handling
 * - Retry logic for failed requests
 * - Type-safe response handling
 * - Consistent error handling
 * - Request/response logging in development
 *
 * @example
 * ```typescript
 * @Injectable({ providedIn: 'root' })
 * export class EmployeeService {
 *   private baseHttp = inject(BaseHttpService);
 *
 *   getEmployees(): Observable<Employee[]> {
 *     return this.baseHttp.get<Employee[]>('/employees');
 *   }
 *
 *   createEmployee(data: CreateEmployeeDto): Observable<Employee> {
 *     return this.baseHttp.post<Employee>('/employees', data);
 *   }
 * }
 * ```
 */
@Injectable({
    providedIn: 'root',
})
export class BaseHttpService {
    private readonly http = inject(HttpClient);
    private readonly config = inject(AppConfigService);
    private readonly logger = inject(LoggerService);

    /**
     * Performs a GET request.
     *
     * @template T - The expected response data type
     * @param url - The endpoint URL (relative or absolute)
     * @param options - Additional request options
     * @returns Observable of the response data
     */
    get<T>(url: string, options?: HttpRequestOptions): Observable<T> {
        const fullUrl = this.buildUrl(url);
        this.logRequest('GET', fullUrl, options);

        return this.http.get<ApiResponse<T>>(fullUrl, options).pipe(
            timeout(this.config.apiTimeout),
            retry({
                count: this.config.apiRetryAttempts,
                delay: (error, retryCount) => this.shouldRetry(error) ? timer(this.config.apiRetryDelay * retryCount) : throwError(() => error),
            }),
            map((response) => this.extractData<T>(response)),
            catchError((error) => this.handleError(error, 'GET', fullUrl))
        );
    }

    /**
     * Performs a GET request that returns a list of items.
     *
     * @template T - The type of items in the list
     * @param url - The endpoint URL
     * @param options - Additional request options
     * @returns Observable of the list response
     */
    getList<T>(url: string, options?: HttpRequestOptions): Observable<T[]> {
        const fullUrl = this.buildUrl(url);
        this.logRequest('GET', fullUrl, options);

        return this.http.get<ListResponse<T>>(fullUrl, options).pipe(
            timeout(this.config.apiTimeout),
            retry({
                count: this.config.apiRetryAttempts,
                delay: (error, retryCount) => this.shouldRetry(error) ? timer(this.config.apiRetryDelay * retryCount) : throwError(() => error),
            }),
            map((response) => response.data),
            catchError((error) => this.handleError(error, 'GET', fullUrl))
        );
    }

    /**
     * Performs a GET request that returns paginated data.
     *
     * @template T - The type of items in the paginated response
     * @param url - The endpoint URL
     * @param params - Pagination parameters
     * @param options - Additional request options
     * @returns Observable of the paginated response
     */
    getPaginated<T>(
        url: string,
        params?: PaginationParams,
        options?: HttpRequestOptions
    ): Observable<PaginatedResponse<T>> {
        const fullUrl = this.buildUrl(url);
        const httpParams = this.buildPaginationParams(params);
        const mergedOptions = this.mergeOptions(options, { params: httpParams });

        this.logRequest('GET', fullUrl, mergedOptions);

        return this.http.get<PaginatedResponse<T>>(fullUrl, mergedOptions).pipe(
            timeout(this.config.apiTimeout),
            retry({
                count: this.config.apiRetryAttempts,
                delay: (error, retryCount) => this.shouldRetry(error) ? timer(this.config.apiRetryDelay * retryCount) : throwError(() => error),
            }),
            catchError((error) => this.handleError(error, 'GET', fullUrl))
        );
    }

    /**
     * Performs a GET request with search and filter capabilities.
     *
     * @template T - The type of items in the response
     * @param url - The endpoint URL
     * @param params - Search parameters including filters
     * @param options - Additional request options
     * @returns Observable of the paginated response
     */
    search<T>(
        url: string,
        params?: SearchParams,
        options?: HttpRequestOptions
    ): Observable<PaginatedResponse<T>> {
        const fullUrl = this.buildUrl(url);
        const httpParams = this.buildSearchParams(params);
        const mergedOptions = this.mergeOptions(options, { params: httpParams });

        this.logRequest('GET', fullUrl, mergedOptions);

        return this.http.get<PaginatedResponse<T>>(fullUrl, mergedOptions).pipe(
            timeout(this.config.apiTimeout),
            retry({
                count: this.config.apiRetryAttempts,
                delay: (error, retryCount) => this.shouldRetry(error) ? timer(this.config.apiRetryDelay * retryCount) : throwError(() => error),
            }),
            catchError((error) => this.handleError(error, 'GET', fullUrl))
        );
    }

    /**
     * Performs a POST request.
     *
     * @template T - The expected response data type
     * @param url - The endpoint URL
     * @param body - The request body
     * @param options - Additional request options
     * @returns Observable of the response data
     */
    post<T>(url: string, body: any, options?: HttpRequestOptions): Observable<T> {
        const fullUrl = this.buildUrl(url);
        this.logRequest('POST', fullUrl, options, body);

        return this.http.post<ApiResponse<T>>(fullUrl, body, options).pipe(
            timeout(this.config.apiTimeout),
            map((response) => this.extractData<T>(response)),
            catchError((error) => this.handleError(error, 'POST', fullUrl))
        );
    }

    /**
     * Performs a PUT request.
     *
     * @template T - The expected response data type
     * @param url - The endpoint URL
     * @param body - The request body
     * @param options - Additional request options
     * @returns Observable of the response data
     */
    put<T>(url: string, body: any, options?: HttpRequestOptions): Observable<T> {
        const fullUrl = this.buildUrl(url);
        this.logRequest('PUT', fullUrl, options, body);

        return this.http.put<ApiResponse<T>>(fullUrl, body, options).pipe(
            timeout(this.config.apiTimeout),
            map((response) => this.extractData<T>(response)),
            catchError((error) => this.handleError(error, 'PUT', fullUrl))
        );
    }

    /**
     * Performs a PATCH request.
     *
     * @template T - The expected response data type
     * @param url - The endpoint URL
     * @param body - The request body (partial update)
     * @param options - Additional request options
     * @returns Observable of the response data
     */
    patch<T>(url: string, body: any, options?: HttpRequestOptions): Observable<T> {
        const fullUrl = this.buildUrl(url);
        this.logRequest('PATCH', fullUrl, options, body);

        return this.http.patch<ApiResponse<T>>(fullUrl, body, options).pipe(
            timeout(this.config.apiTimeout),
            map((response) => this.extractData<T>(response)),
            catchError((error) => this.handleError(error, 'PATCH', fullUrl))
        );
    }

    /**
     * Performs a DELETE request.
     *
     * @param url - The endpoint URL
     * @param options - Additional request options
     * @returns Observable of empty response
     */
    delete(url: string, options?: HttpRequestOptions): Observable<void> {
        const fullUrl = this.buildUrl(url);
        this.logRequest('DELETE', fullUrl, options);

        return this.http.delete<EmptyResponse>(fullUrl, options).pipe(
            timeout(this.config.apiTimeout),
            map(() => undefined),
            catchError((error) => this.handleError(error, 'DELETE', fullUrl))
        );
    }

    /**
     * Performs a DELETE request that returns data.
     *
     * @template T - The expected response data type
     * @param url - The endpoint URL
     * @param options - Additional request options
     * @returns Observable of the response data
     */
    deleteWithResponse<T>(url: string, options?: HttpRequestOptions): Observable<T> {
        const fullUrl = this.buildUrl(url);
        this.logRequest('DELETE', fullUrl, options);

        return this.http.delete<ApiResponse<T>>(fullUrl, options).pipe(
            timeout(this.config.apiTimeout),
            map((response) => this.extractData<T>(response)),
            catchError((error) => this.handleError(error, 'DELETE', fullUrl))
        );
    }

    /**
     * Builds the full URL from a relative or absolute path.
     * If the URL is already absolute (starts with http:// or https://), returns it as-is.
     * Otherwise, prepends the API base URL.
     */
    private buildUrl(url: string): string {
        if (url.startsWith('http://') || url.startsWith('https://')) {
            return url;
        }

        // Remove leading slash if present to avoid double slashes
        const cleanUrl = url.startsWith('/') ? url.slice(1) : url;
        return `${this.config.api.baseUrl}/${this.config.api.version}/${cleanUrl}`;
    }

    /**
     * Builds HTTP params from pagination parameters.
     */
    private buildPaginationParams(params?: PaginationParams): HttpParams {
        let httpParams = new HttpParams();

        if (params) {
            if (params.page !== undefined) {
                httpParams = httpParams.set('page', params.page.toString());
            }
            if (params.pageSize !== undefined) {
                httpParams = httpParams.set('pageSize', params.pageSize.toString());
            }
            if (params.sortBy) {
                httpParams = httpParams.set('sortBy', params.sortBy);
            }
            if (params.sortOrder) {
                httpParams = httpParams.set('sortOrder', params.sortOrder);
            }
        }

        return httpParams;
    }

    /**
     * Builds HTTP params from search parameters including filters.
     */
    private buildSearchParams(params?: SearchParams): HttpParams {
        let httpParams = this.buildPaginationParams(params);

        if (params) {
            if (params.search) {
                httpParams = httpParams.set('search', params.search);
            }
            if (params.filters) {
                Object.entries(params.filters).forEach(([key, value]) => {
                    if (value !== null && value !== undefined) {
                        httpParams = httpParams.set(key, String(value));
                    }
                });
            }
        }

        return httpParams;
    }

    /**
     * Merges request options.
     */
    private mergeOptions(
        options?: HttpRequestOptions,
        additionalOptions?: HttpRequestOptions
    ): HttpRequestOptions {
        if (!additionalOptions) {
            return options || {};
        }

        return {
            ...options,
            ...additionalOptions,
            headers: this.mergeHeaders(options?.headers, additionalOptions.headers),
            params: this.mergeParams(options?.params, additionalOptions.params),
        };
    }

    /**
     * Merges HTTP headers.
     */
    private mergeHeaders(
        headers1?: HttpHeaders | { [header: string]: string | string[] },
        headers2?: HttpHeaders | { [header: string]: string | string[] }
    ): HttpHeaders {
        let merged = new HttpHeaders(headers1);
        if (headers2) {
            if (headers2 instanceof HttpHeaders) {
                headers2.keys().forEach((key) => {
                    const values = headers2.getAll(key);
                    if (values) {
                        merged = merged.set(key, values);
                    }
                });
            } else {
                Object.entries(headers2).forEach(([key, value]) => {
                    merged = merged.set(key, value);
                });
            }
        }
        return merged;
    }

    /**
     * Merges HTTP params.
     */
    private mergeParams(
        params1?: HttpParams | { [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean> },
        params2?: HttpParams | { [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean> }
    ): HttpParams {
        let merged = new HttpParams({ fromObject: params1 as any });
        if (params2) {
            if (params2 instanceof HttpParams) {
                params2.keys().forEach((key) => {
                    const values = params2.getAll(key);
                    if (values) {
                        merged = merged.set(key, values);
                    }
                });
            } else {
                Object.entries(params2).forEach(([key, value]) => {
                    merged = merged.set(key, String(value));
                });
            }
        }
        return merged;
    }

    /**
     * Extracts data from API response.
     */
    private extractData<T>(response: ApiResponse<T>): T {
        if (response.success) {
            return response.data;
        }
        throw new Error(response.message || 'API request failed');
    }

    /**
     * Determines if a request should be retried based on the error.
     */
    private shouldRetry(error: any): boolean {
        // Only retry on network errors or 5xx server errors
        if (!error.status) {
            return true; // Network error
        }
        return error.status >= 500 && error.status < 600;
    }

    /**
     * Handles HTTP errors.
     */
    private handleError(error: any, method: string, url: string): Observable<never> {
        this.logger.error(`HTTP ${method} Error [${url}]:`, error);

        // Transform error to a consistent format
        const apiError: ApiErrorResponse = {
            success: false,
            error: {
                code: error.status?.toString() || 'UNKNOWN_ERROR',
                message: error.message || 'An unexpected error occurred',
            },
            message: error.error?.message || error.message || 'An unexpected error occurred',
            statusCode: error.status || 0,
            timestamp: new Date().toISOString(),
            path: url,
        };

        return throwError(() => apiError);
    }

    /**
     * Logs HTTP requests in development mode.
     */
    private logRequest(method: string, url: string, options?: HttpRequestOptions, body?: any): void {
        if (!this.config.debugEnabled) {
            return;
        }

        this.logger.debug(`HTTP ${method} Request:`, {
            url,
            options,
            body,
        });
    }
}

