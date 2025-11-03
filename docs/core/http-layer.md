# HTTP Communication Layer

**Document:** HTTP Service & API Communication  
**Version:** Angular 20  
**Last Updated:** November 2025

---

## Table of Contents

1. [Overview](#overview)
2. [Base HTTP Service](#base-http-service)
3. [API Response Models](#api-response-models)
4. [URL Handling](#url-handling)
5. [Error Handling](#error-handling)
6. [Best Practices](#best-practices)
7. [Related Documentation](#related-documentation)

---

## Overview

The HTTP layer (`src/app/core/http`) provides a robust, type-safe wrapper around Angular's HttpClient with built-in error handling, retry logic, and response transformation.

### Features

- ✅ Automatic timeout handling
- ✅ Retry logic for failed requests
- ✅ Type-safe request/response handling
- ✅ Consistent error handling
- ✅ Request/response logging (development mode)
- ✅ Pagination support
- ✅ Search and filter capabilities

---

## Base HTTP Service

### Available Methods

```typescript
export class BaseHttpService {
  // Standard CRUD operations
  get<T>(url: string, options?: HttpRequestOptions): Observable<T>
  post<T>(url: string, body: any, options?: HttpRequestOptions): Observable<T>
  put<T>(url: string, body: any, options?: HttpRequestOptions): Observable<T>
  patch<T>(url: string, body: any, options?: HttpRequestOptions): Observable<T>
  delete(url: string, options?: HttpRequestOptions): Observable<void>
  
  // Specialized methods
  getList<T>(url: string, options?: HttpRequestOptions): Observable<T[]>
  getPaginated<T>(url: string, params?: PaginationParams, options?: HttpRequestOptions): Observable<PaginatedResponse<T>>
  search<T>(url: string, params?: SearchParams, options?: HttpRequestOptions): Observable<PaginatedResponse<T>>
  deleteWithResponse<T>(url: string, options?: HttpRequestOptions): Observable<T>
}
```

### Usage Examples

```typescript
@Injectable({ providedIn: 'root' })
export class EmployeeService {
  private baseHttp = inject(BaseHttpService);
  
  // Simple GET request
  getEmployees(): Observable<Employee[]> {
    return this.baseHttp.getList<Employee>('employees');
  }
  
  // GET with pagination
  getEmployeesPaginated(page: number, pageSize: number): Observable<PaginatedResponse<Employee>> {
    return this.baseHttp.getPaginated<Employee>(
      'employees',
      { page, pageSize, sortBy: 'name', sortOrder: 'asc' }
    );
  }
  
  // Search with filters
  searchEmployees(searchTerm: string, filters: EmployeeFilters): Observable<PaginatedResponse<Employee>> {
    return this.baseHttp.search<Employee>(
      'employees/search',
      { search: searchTerm, filters, page: 1, pageSize: 20 }
    );
  }
  
  // POST request
  createEmployee(data: CreateEmployeeDto): Observable<Employee> {
    return this.baseHttp.post<Employee>('employees', data);
  }
  
  // PUT request (full update)
  updateEmployee(id: string, data: UpdateEmployeeDto): Observable<Employee> {
    return this.baseHttp.put<Employee>(`employees/${id}`, data);
  }
  
  // PATCH request (partial update)
  patchEmployee(id: string, changes: Partial<Employee>): Observable<Employee> {
    return this.baseHttp.patch<Employee>(`employees/${id}`, changes);
  }
  
  // DELETE request
  deleteEmployee(id: string): Observable<void> {
    return this.baseHttp.delete(`employees/${id}`);
  }
  
  // DELETE with response
  archiveEmployee(id: string): Observable<ArchiveResponse> {
    return this.baseHttp.deleteWithResponse<ArchiveResponse>(`employees/${id}/archive`);
  }
}
```

---

## API Response Models

### Standard Response Types

```typescript
// Standard response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp?: string;
}

// Error response
export interface ApiErrorResponse {
  success: false;
  error: ApiError;
  errors?: ApiError[];
  message: string;
  statusCode: number;
  timestamp?: string;
  path?: string;
}

export interface ApiError {
  code: string;
  message: string;
  field?: string;
}

// Paginated response
export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: PaginationMeta;
  message?: string;
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// List response (non-paginated)
export interface ListResponse<T> {
  success: boolean;
  data: T[];
  count: number;
  message?: string;
}

// Batch operation response
export interface BatchOperationResponse {
  success: boolean;
  data: {
    successCount: number;
    failureCount: number;
    totalCount: number;
    errors?: Array<{ itemId: string; error: string; }>;
  };
  message?: string;
}
```

### Type Guards

```typescript
// Check if response is an error
export function isApiErrorResponse(response: unknown): response is ApiErrorResponse {
  return (
    typeof response === 'object' &&
    response !== null &&
    'success' in response &&
    response.success === false &&
    'error' in response
  );
}

// Check if response is paginated
export function isPaginatedResponse<T>(response: unknown): response is PaginatedResponse<T> {
  return (
    typeof response === 'object' &&
    response !== null &&
    'pagination' in response
  );
}

// Check if error is validation error
export function isValidationErrorResponse(errorResponse: ApiErrorResponse): boolean {
  return errorResponse.statusCode === 422 && Array.isArray(errorResponse.errors);
}
```

### Usage with Type Guards

```typescript
this.employeeService.getEmployees().subscribe({
  next: (response) => {
    if (isPaginatedResponse(response)) {
      console.log(`Total pages: ${response.pagination.totalPages}`);
    }
  },
  error: (error) => {
    if (isApiErrorResponse(error)) {
      console.error(error.error.message);
      
      if (isValidationErrorResponse(error)) {
        error.errors?.forEach(err => {
          console.log(`${err.field}: ${err.message}`);
        });
      }
    }
  }
});
```

---

## URL Handling

The `BaseHttpService` intelligently handles URL construction:

### 1. Relative URLs

Automatically prepends base URL and version:

```typescript
// Input: 'employees'
// Output: 'http://localhost:3000/api/v1/employees'
this.baseHttp.get<Employee[]>('employees');
```

### 2. Absolute URLs

Used as-is without modification:

```typescript
// Used directly without modification
this.baseHttp.get<Data>('https://external-api.com/data');
```

### 3. Using Config Service (Recommended)

Best practice for configured endpoints:

```typescript
@Injectable({ providedIn: 'root' })
export class AuthService {
  private config = inject(AppConfigService);
  private baseHttp = inject(BaseHttpService);
  
  login(credentials: LoginCredentials): Observable<AuthResponse> {
    // Recommended: Use configured endpoint
    return this.baseHttp.post<AuthResponse>(
      this.config.api.endpoints.auth.login,
      credentials
    );
  }
}
```

---

## Error Handling

The HTTP layer provides comprehensive error handling:

### Automatic Features

1. **Automatic Retry** - Failed requests retry automatically (5xx errors and network issues)
2. **Timeout Handling** - Requests timeout after configured duration (default: 30s)
3. **Consistent Error Format** - All errors transformed to `ApiErrorResponse`
4. **Development Logging** - Detailed request/response logging in development mode

### Example Error Handling

```typescript
this.employeeService.getEmployees().subscribe({
  next: (employees) => {
    // Handle success
    this.employees.set(employees);
  },
  error: (error: ApiErrorResponse) => {
    // Error is always in consistent format
    console.error(error.message);
    console.error(error.statusCode);
    
    // Handle specific errors
    if (error.statusCode === HTTP_STATUS.NOT_FOUND) {
      this.router.navigate(['/not-found']);
    } else if (error.statusCode === HTTP_STATUS.UNAUTHORIZED) {
      this.router.navigate(['/auth/login']);
    }
  }
});
```

### Service-Level Error Handling

```typescript
@Injectable({ providedIn: 'root' })
export class EmployeeService {
  private baseHttp = inject(BaseHttpService);
  private logger = inject(LoggerService);
  
  getEmployees(): Observable<Employee[]> {
    return this.baseHttp.getList<Employee>('employees').pipe(
      catchError((error: ApiErrorResponse) => {
        this.logger.error('Failed to fetch employees', error);
        
        // Handle specific error cases
        if (error.statusCode === HTTP_STATUS.NOT_FOUND) {
          return of([]); // Return empty array
        }
        
        // Re-throw for component to handle
        return throwError(() => error);
      })
    );
  }
}
```

---

## Best Practices

### 1. Always Use BaseHttpService

```typescript
// ✅ Good: Use BaseHttpService
private baseHttp = inject(BaseHttpService);

getEmployees(): Observable<Employee[]> {
  return this.baseHttp.getList<Employee>('employees');
}

// ❌ Bad: Direct HttpClient usage
private http = inject(HttpClient);

getEmployees(): Observable<Employee[]> {
  return this.http.get<Employee[]>('/api/v1/employees');
}
```

### 2. Use Type Parameters for Type Safety

```typescript
// ✅ Good: Fully typed
getEmployees(): Observable<Employee[]> {
  return this.baseHttp.getList<Employee>('employees');
}

// ❌ Bad: Any type
getEmployees(): Observable<any> {
  return this.baseHttp.getList('employees');
}
```

### 3. Leverage Specialized Methods

```typescript
// ✅ Good: Use specialized paginated method
getEmployees(page: number, pageSize: number): Observable<PaginatedResponse<Employee>> {
  return this.baseHttp.getPaginated<Employee>('employees', { page, pageSize });
}

// ✅ Good: Use specialized list method
getEmployees(): Observable<Employee[]> {
  return this.baseHttp.getList<Employee>('employees');
}

// ❌ Bad: Generic get with manual handling
getEmployees(): Observable<Employee[]> {
  return this.baseHttp.get<ApiResponse<Employee[]>>('employees').pipe(
    map(response => response.data)
  );
}
```

### 4. Use AppConfigService for Configured Endpoints

```typescript
// ✅ Good: Use configured endpoints
private config = inject(AppConfigService);
private baseHttp = inject(BaseHttpService);

login(credentials: LoginCredentials): Observable<AuthResponse> {
  return this.baseHttp.post<AuthResponse>(
    this.config.api.endpoints.auth.login,
    credentials
  );
}

// ❌ Bad: Hardcoded endpoints
login(credentials: LoginCredentials): Observable<AuthResponse> {
  return this.baseHttp.post<AuthResponse>('/auth/login', credentials);
}
```

### 5. Handle Errors Gracefully

```typescript
// ✅ Good: Specific error handling
this.baseHttp.get<Employee>(url).pipe(
  catchError((error: ApiErrorResponse) => {
    // Handle specific error cases
    if (error.statusCode === HTTP_STATUS.NOT_FOUND) {
      this.router.navigate(['/not-found']);
    } else if (error.statusCode === HTTP_STATUS.FORBIDDEN) {
      this.notificationService.showError('Access denied');
    }
    return throwError(() => error);
  })
);
```

### 6. Use Pagination for Large Lists

```typescript
// ✅ Good: Paginated requests
getEmployees(page: number = 1, pageSize: number = 20): Observable<PaginatedResponse<Employee>> {
  return this.baseHttp.getPaginated<Employee>('employees', { page, pageSize });
}

// ❌ Bad: Loading all data at once
getEmployees(): Observable<Employee[]> {
  return this.baseHttp.getList<Employee>('employees'); // Could be thousands of records
}
```

---

## Related Documentation

- **Previous:** [Configuration Layer](configuration-layer.md) - Configuration management
- **Next:** [Error Handling](error-handling.md) - Error management system
- **See Also:** [Data Flow Patterns](../architecture/08-data-flow-patterns.md) - Service patterns
- **Reference:** [Layer Architecture](../architecture/03-layer-architecture.md) - Core layer overview

---

**Document Version:** 2.0  
**Last Updated:** November 2025  
**Maintained By:** Frontend Architecture Team

