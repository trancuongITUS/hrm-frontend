# Data Flow Patterns

**Document:** Data Flow & Service Layer Patterns  
**Version:** Angular 20  
**Last Updated:** November 2025

---

## Table of Contents

1. [Overview](#overview)
2. [Service Layer Pattern](#service-layer-pattern)
3. [API Response Models](#api-response-models)
4. [Data Transformation](#data-transformation)
5. [Error Handling](#error-handling)
6. [Caching Strategies](#caching-strategies)
7. [Best Practices](#best-practices)
8. [Related Documentation](#related-documentation)

---

## Overview

Data flow in Angular applications follows a clear pattern from the UI layer through services to the backend API and back. This document defines patterns and best practices for managing data flow.

### Data Flow Diagram

```
Component
   ↓ (requests data)
Service Layer
   ↓ (HTTP request)
BaseHttpService
   ↓ (HTTP call)
Backend API
   ↓ (response)
BaseHttpService
   ↓ (transform/map)
Service Layer
   ↓ (returns Observable/Signal)
Component
   ↓ (displays data)
Template
```

---

## Service Layer Pattern

Services are responsible for:
- Data fetching from APIs
- Data transformation (DTO → Domain Model)
- Business logic
- State management
- Error handling

### Basic Service Structure

```typescript
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { BaseHttpService } from '@core/http/base-http.service';
import { Employee, CreateEmployeeDto, UpdateEmployeeDto } from '../models/employee.model';

@Injectable({ providedIn: 'root' })
export class EmployeeService {
  private baseHttp = inject(BaseHttpService);
  
  // GET all employees
  getEmployees(): Observable<Employee[]> {
    return this.baseHttp.getList<Employee>('employees');
  }
  
  // GET employee by ID
  getEmployeeById(id: string): Observable<Employee> {
    return this.baseHttp.get<Employee>(`employees/${id}`);
  }
  
  // POST create employee
  createEmployee(dto: CreateEmployeeDto): Observable<Employee> {
    return this.baseHttp.post<Employee>('employees', dto);
  }
  
  // PUT update employee
  updateEmployee(id: string, dto: UpdateEmployeeDto): Observable<Employee> {
    return this.baseHttp.put<Employee>(`employees/${id}`, dto);
  }
  
  // PATCH partial update
  patchEmployee(id: string, changes: Partial<Employee>): Observable<Employee> {
    return this.baseHttp.patch<Employee>(`employees/${id}`, changes);
  }
  
  // DELETE employee
  deleteEmployee(id: string): Observable<void> {
    return this.baseHttp.delete(`employees/${id}`);
  }
}
```

### Service with Pagination

```typescript
@Injectable({ providedIn: 'root' })
export class EmployeeService {
  private baseHttp = inject(BaseHttpService);
  
  getEmployeesPaginated(
    page: number = 1,
    pageSize: number = 20,
    sortBy?: string,
    sortOrder?: 'asc' | 'desc'
  ): Observable<PaginatedResponse<Employee>> {
    return this.baseHttp.getPaginated<Employee>(
      'employees',
      { page, pageSize, sortBy, sortOrder }
    );
  }
}
```

### Service with Search

```typescript
@Injectable({ providedIn: 'root' })
export class EmployeeService {
  private baseHttp = inject(BaseHttpService);
  
  searchEmployees(
    searchTerm: string,
    filters?: EmployeeFilters
  ): Observable<PaginatedResponse<Employee>> {
    return this.baseHttp.search<Employee>(
      'employees/search',
      {
        search: searchTerm,
        filters: filters,
        page: 1,
        pageSize: 20
      }
    );
  }
}
```

---

## API Response Models

Standard response models ensure type safety and consistency.

### Response Types

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
```

### Type Guards

```typescript
export function isApiErrorResponse(response: unknown): response is ApiErrorResponse {
  return (
    typeof response === 'object' &&
    response !== null &&
    'success' in response &&
    response.success === false &&
    'error' in response
  );
}

export function isPaginatedResponse<T>(response: unknown): response is PaginatedResponse<T> {
  return (
    typeof response === 'object' &&
    response !== null &&
    'pagination' in response
  );
}
```

---

## Data Transformation

Transform API DTOs to domain models for clean separation.

### DTO to Domain Model

```typescript
// API DTO (from backend)
export interface EmployeeDto {
  id: string;
  first_name: string;
  last_name: string;
  email_address: string;
  hire_date: string;
  department_id: string;
}

// Domain Model (for frontend)
export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  hireDate: Date;
  departmentId: string;
}

// Transformation in service
@Injectable({ providedIn: 'root' })
export class EmployeeService {
  private baseHttp = inject(BaseHttpService);
  
  getEmployees(): Observable<Employee[]> {
    return this.baseHttp.get<EmployeeDto[]>('employees').pipe(
      map(dtos => dtos.map(dto => this.mapToEmployee(dto)))
    );
  }
  
  private mapToEmployee(dto: EmployeeDto): Employee {
    return {
      id: dto.id,
      firstName: dto.first_name,
      lastName: dto.last_name,
      fullName: `${dto.first_name} ${dto.last_name}`,
      email: dto.email_address,
      hireDate: new Date(dto.hire_date),
      departmentId: dto.department_id
    };
  }
  
  private mapToEmployeeDto(employee: Employee): EmployeeDto {
    return {
      id: employee.id,
      first_name: employee.firstName,
      last_name: employee.lastName,
      email_address: employee.email,
      hire_date: employee.hireDate.toISOString(),
      department_id: employee.departmentId
    };
  }
}
```

### Mapper Utility

```typescript
// shared/utils/mapper.util.ts
export class EmployeeMapper {
  static toEmployee(dto: EmployeeDto): Employee {
    return {
      id: dto.id,
      firstName: dto.first_name,
      lastName: dto.last_name,
      fullName: `${dto.first_name} ${dto.last_name}`,
      email: dto.email_address,
      hireDate: new Date(dto.hire_date),
      departmentId: dto.department_id
    };
  }
  
  static toEmployeeDto(employee: Employee): EmployeeDto {
    return {
      id: employee.id,
      first_name: employee.firstName,
      last_name: employee.lastName,
      email_address: employee.email,
      hire_date: employee.hireDate.toISOString(),
      department_id: employee.departmentId
    };
  }
  
  static toEmployees(dtos: EmployeeDto[]): Employee[] {
    return dtos.map(dto => this.toEmployee(dto));
  }
}

// Usage in service
getEmployees(): Observable<Employee[]> {
  return this.baseHttp.get<EmployeeDto[]>('employees').pipe(
    map(dtos => EmployeeMapper.toEmployees(dtos))
  );
}
```

---

## Error Handling

Error handling is centralized through interceptors and services.

### Service Level Error Handling

```typescript
@Injectable({ providedIn: 'root' })
export class EmployeeService {
  private baseHttp = inject(BaseHttpService);
  private logger = inject(LoggerService);
  
  getEmployees(): Observable<Employee[]> {
    return this.baseHttp.getList<Employee>('employees').pipe(
      catchError(error => {
        this.logger.error('Failed to fetch employees', error);
        // Re-throw or return fallback
        return throwError(() => error);
      })
    );
  }
  
  createEmployee(dto: CreateEmployeeDto): Observable<Employee> {
    return this.baseHttp.post<Employee>('employees', dto).pipe(
      catchError(error => {
        if (error.status === 422) {
          this.logger.warn('Validation error creating employee', error);
        } else {
          this.logger.error('Failed to create employee', error);
        }
        return throwError(() => error);
      })
    );
  }
}
```

### Component Level Error Handling

```typescript
export class EmployeeListComponent {
  private employeeService = inject(EmployeeService);
  private notificationService = inject(NotificationService);
  
  employees = signal<Employee[]>([]);
  error = signal<string | null>(null);
  
  loadEmployees(): void {
    this.employeeService.getEmployees().subscribe({
      next: (employees) => {
        this.employees.set(employees);
        this.error.set(null);
      },
      error: (error) => {
        this.error.set('Failed to load employees');
        this.notificationService.showError('Failed to load employees');
      }
    });
  }
}
```

---

## Caching Strategies

### Simple In-Memory Cache

```typescript
@Injectable({ providedIn: 'root' })
export class EmployeeService {
  private baseHttp = inject(BaseHttpService);
  private cache = new Map<string, Employee>();
  private listCache: Employee[] | null = null;
  private cacheTimestamp = 0;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  
  getEmployees(forceRefresh = false): Observable<Employee[]> {
    const now = Date.now();
    const isCacheValid = this.listCache && (now - this.cacheTimestamp) < this.CACHE_DURATION;
    
    if (!forceRefresh && isCacheValid) {
      return of(this.listCache!);
    }
    
    return this.baseHttp.getList<Employee>('employees').pipe(
      tap(employees => {
        this.listCache = employees;
        this.cacheTimestamp = now;
        // Update individual cache
        employees.forEach(emp => this.cache.set(emp.id, emp));
      })
    );
  }
  
  getEmployeeById(id: string, forceRefresh = false): Observable<Employee> {
    if (!forceRefresh && this.cache.has(id)) {
      return of(this.cache.get(id)!);
    }
    
    return this.baseHttp.get<Employee>(`employees/${id}`).pipe(
      tap(employee => this.cache.set(id, employee))
    );
  }
  
  clearCache(): void {
    this.cache.clear();
    this.listCache = null;
    this.cacheTimestamp = 0;
  }
}
```

### ShareReplay for HTTP Requests

```typescript
@Injectable({ providedIn: 'root' })
export class EmployeeService {
  private baseHttp = inject(BaseHttpService);
  private employees$: Observable<Employee[]> | null = null;
  
  getEmployees(): Observable<Employee[]> {
    if (!this.employees$) {
      this.employees$ = this.baseHttp.getList<Employee>('employees').pipe(
        shareReplay({ bufferSize: 1, refCount: true })
      );
    }
    return this.employees$;
  }
  
  refreshEmployees(): void {
    this.employees$ = null;
  }
}
```

---

## Best Practices

### 1. Use BaseHttpService

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

### 2. Type Everything

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

### 3. Transform Data in Services

```typescript
// ✅ Good: Transform in service
getEmployees(): Observable<Employee[]> {
  return this.baseHttp.get<EmployeeDto[]>('employees').pipe(
    map(dtos => EmployeeMapper.toEmployees(dtos))
  );
}

// ❌ Bad: Transform in component
// Component should receive clean domain models
```

### 4. Handle Errors Appropriately

```typescript
// ✅ Good: Specific error handling
createEmployee(dto: CreateEmployeeDto): Observable<Employee> {
  return this.baseHttp.post<Employee>('employees', dto).pipe(
    catchError(error => {
      if (error.status === 422) {
        // Handle validation errors
      } else if (error.status === 409) {
        // Handle conflicts
      }
      return throwError(() => error);
    })
  );
}
```

### 5. Use Pagination for Large Lists

```typescript
// ✅ Good: Paginated requests
getEmployees(page: number, pageSize: number): Observable<PaginatedResponse<Employee>> {
  return this.baseHttp.getPaginated<Employee>('employees', { page, pageSize });
}

// ❌ Bad: Loading all data at once
getEmployees(): Observable<Employee[]> {
  return this.baseHttp.getList<Employee>('employees'); // Could be thousands
}
```

### 6. Implement Caching When Appropriate

```typescript
// ✅ Good: Cache frequently accessed data
private cache$ = this.baseHttp.getList<Employee>('employees').pipe(
  shareReplay({ bufferSize: 1, refCount: true })
);

// Use when data doesn't change frequently
```

---

## Related Documentation

- **Previous:** [Routing Strategy](07-routing-strategy.md) - Routing configuration
- **Next:** [Configuration Layer](../core/configuration-layer.md) - Configuration management
- **See Also:** [HTTP Communication](../core/http-layer.md) - HTTP service details
- **Reference:** [Error Handling](../core/error-handling.md) - Error management

---

**Document Version:** 2.0  
**Last Updated:** November 2025  
**Maintained By:** Frontend Architecture Team

