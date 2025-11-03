# Configuration Layer

**Document:** Configuration Management System  
**Version:** Angular 20  
**Last Updated:** November 2025

---

## Table of Contents

1. [Overview](#overview)
2. [API Configuration](#api-configuration)
3. [App Config Service](#app-config-service)
4. [Constants](#constants)
5. [Best Practices](#best-practices)
6. [Related Documentation](#related-documentation)

---

## Overview

The configuration layer (`src/app/core/config`) provides centralized management of application settings, API endpoints, and constants. This ensures consistency, type safety, and easy maintenance.

### Components

- **API Configuration** (`api.config.ts`) - API endpoint definitions
- **App Config Service** (`app-config.service.ts`) - Runtime configuration service
- **Constants** (`constants.ts`) - Application-wide constants

---

## API Configuration

### Purpose

Defines all API endpoints in a type-safe, organized structure.

### Implementation (`api.config.ts`)

```typescript
export interface ApiEndpoints {
  readonly auth: {
    readonly login: string;
    readonly logout: string;
    readonly register: string;
    readonly refreshToken: string;
    readonly resetPassword: string;
    readonly changePassword: string;
    readonly profile: string;
  };
  readonly employees: {
    readonly base: string;
    readonly byId: (id: string) => string;
    readonly search: string;
    readonly export: string;
  };
  readonly attendance: {
    readonly base: string;
    readonly checkin: string;
    readonly checkout: string;
    readonly summary: string;
  };
  readonly payroll: {
    readonly base: string;
    readonly calculate: string;
    readonly history: string;
  };
  readonly reports: {
    readonly base: string;
    readonly generate: string;
    readonly download: string;
  };
}

export const API_ENDPOINTS: ApiEndpoints = {
  auth: {
    login: '/auth/login',
    logout: '/auth/logout',
    register: '/auth/register',
    refreshToken: '/auth/refresh-token',
    resetPassword: '/auth/reset-password',
    changePassword: '/auth/change-password',
    profile: '/auth/profile'
  },
  employees: {
    base: '/employees',
    byId: (id: string) => `/employees/${id}`,
    search: '/employees/search',
    export: '/employees/export'
  },
  attendance: {
    base: '/attendance',
    checkin: '/attendance/checkin',
    checkout: '/attendance/checkout',
    summary: '/attendance/summary'
  },
  payroll: {
    base: '/payroll',
    calculate: '/payroll/calculate',
    history: '/payroll/history'
  },
  reports: {
    base: '/reports',
    generate: '/reports/generate',
    download: '/reports/download'
  }
};
```

### Features

- ✅ Type-safe endpoint definitions
- ✅ Factory functions for dynamic URL generation
- ✅ Centralized API versioning
- ✅ Easy to maintain and extend
- ✅ Auto-completion in IDEs

### Usage Example

```typescript
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfigService } from '@core/config/app-config.service';
import { BaseHttpService } from '@core/http/base-http.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private config = inject(AppConfigService);
  private baseHttp = inject(BaseHttpService);
  
  login(credentials: LoginCredentials): Observable<AuthResponse> {
    // Type-safe endpoint access
    const url = this.config.api.endpoints.auth.login;
    return this.baseHttp.post<AuthResponse>(url, credentials);
  }
  
  getEmployeeById(id: string): Observable<Employee> {
    // Dynamic URL generation
    const url = this.config.api.endpoints.employees.byId(id);
    return this.baseHttp.get<Employee>(url);
  }
}
```

---

## App Config Service

### Purpose

Runtime configuration service providing unified access to all application settings.

### Implementation (`app-config.service.ts`)

```typescript
import { Injectable, inject } from '@angular/core';
import { environment } from '@environments/environment';
import { API_ENDPOINTS, ApiEndpoints } from './api.config';

@Injectable({ providedIn: 'root' })
export class AppConfigService {
  // Environment configuration
  get environment() {
    return environment;
  }
  
  get production(): boolean {
    return environment.production;
  }
  
  // API configuration
  get apiBaseUrl(): string {
    return environment.apiUrl;
  }
  
  get apiVersion(): string {
    return environment.apiVersion || 'v1';
  }
  
  get apiTimeout(): number {
    return environment.apiTimeout || 30000;
  }
  
  // API endpoints
  get api(): { endpoints: ApiEndpoints } {
    return { endpoints: API_ENDPOINTS };
  }
  
  // Application settings
  get appName(): string {
    return 'HRM System';
  }
  
  get defaultPageSize(): number {
    return 20;
  }
  
  get maxPageSize(): number {
    return 100;
  }
  
  get dateFormat(): string {
    return 'MM/DD/YYYY';
  }
  
  get timeFormat(): string {
    return 'HH:mm:ss';
  }
  
  // Feature flags
  isFeatureEnabled(feature: string): boolean {
    const features = environment.features || {};
    return features[feature] === true;
  }
  
  // Helper methods
  getEndpoint(path: string, ...params: string[]): string {
    let endpoint = path;
    params.forEach((param, index) => {
      endpoint = endpoint.replace(`{${index}}`, param);
    });
    return endpoint;
  }
  
  getFullApiUrl(endpoint: string): string {
    return `${this.apiBaseUrl}/api/${this.apiVersion}${endpoint}`;
  }
}
```

### Usage Examples

```typescript
export class MyComponent {
  private appConfig = inject(AppConfigService);
  
  ngOnInit(): void {
    // Access API endpoints
    const loginUrl = this.appConfig.api.endpoints.auth.login;
    
    // Access configuration
    const timeout = this.appConfig.apiTimeout;
    const pageSize = this.appConfig.defaultPageSize;
    const isProduction = this.appConfig.production;
    
    // Check feature flags
    if (this.appConfig.isFeatureEnabled('analytics')) {
      this.initAnalytics();
    }
    
    // Get full API URL
    const fullUrl = this.appConfig.getFullApiUrl('/employees');
    // Result: "http://localhost:3000/api/v1/employees"
  }
}
```

---

## Constants

### Purpose

Application-wide constants organized by domain to avoid magic numbers and strings.

### Implementation (`constants.ts`)

```typescript
// API Configuration
export const API_CONFIG = {
  TIMEOUT: 30000,
  RETRY_COUNT: 3,
  RETRY_DELAY: 1000,
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100
} as const;

// Storage Keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_PROFILE: 'user_profile',
  THEME: 'theme_preference',
  LANGUAGE: 'language_preference'
} as const;

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'MM/DD/YYYY',
  API: 'YYYY-MM-DD',
  DATETIME: 'MM/DD/YYYY HH:mm:ss',
  TIME: 'HH:mm:ss'
} as const;

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503
} as const;

// Authentication
export const AUTH_CONFIG = {
  TOKEN_HEADER: 'Authorization',
  TOKEN_PREFIX: 'Bearer',
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
  REFRESH_BEFORE_EXPIRY: 5 * 60 * 1000 // 5 minutes
} as const;

// Validation Patterns
export const VALIDATION = {
  EMAIL_PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_PATTERN: /^\+?[1-9]\d{1,14}$/,
  PASSWORD_PATTERN: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  USERNAME_PATTERN: /^[a-zA-Z0-9_]{3,20}$/,
  URL_PATTERN: /^https?:\/\/.+/
} as const;

// UI Configuration
export const UI_CONFIG = {
  DEBOUNCE_TIME: 300,
  ANIMATION_DURATION: 200,
  TOAST_DURATION: 3000,
  MODAL_ANIMATION: 150
} as const;

// File Upload
export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
  ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.gif', '.pdf']
} as const;

// Application Routes
export const APP_ROUTES = {
  HOME: '/',
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  DASHBOARD: '/dashboard',
  EMPLOYEES: '/employees',
  ATTENDANCE: '/attendance',
  PAYROLL: '/payroll',
  REPORTS: '/reports',
  SETTINGS: '/settings',
  PROFILE: '/profile',
  NOT_FOUND: '/error/404',
  FORBIDDEN: '/error/403',
  SERVER_ERROR: '/error/500'
} as const;

// User Roles
export const USER_ROLES = {
  ADMIN: 'admin',
  HR: 'hr',
  MANAGER: 'manager',
  EMPLOYEE: 'employee'
} as const;

// User Status
export const USER_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  SUSPENDED: 'suspended',
  TERMINATED: 'terminated'
} as const;

// Employee Status
export const EMPLOYEE_STATUS = {
  ACTIVE: 'active',
  ON_LEAVE: 'on_leave',
  TERMINATED: 'terminated'
} as const;

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_PAGE_SIZE: 20,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100]
} as const;
```

### Usage Examples

```typescript
import { 
  STORAGE_KEYS, 
  VALIDATION, 
  USER_ROLES, 
  HTTP_STATUS,
  API_CONFIG 
} from '@core/config';

// Storage
localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);
const theme = localStorage.getItem(STORAGE_KEYS.THEME);

// Validation
const isValidEmail = VALIDATION.EMAIL_PATTERN.test(email);
const isValidPassword = VALIDATION.PASSWORD_PATTERN.test(password);

// User roles
if (user.role === USER_ROLES.ADMIN) {
  // Admin-specific logic
}

// HTTP status
if (response.status === HTTP_STATUS.UNAUTHORIZED) {
  this.router.navigate(['/auth/login']);
}

// API config
const timeout = API_CONFIG.TIMEOUT;
const pageSize = API_CONFIG.DEFAULT_PAGE_SIZE;
```

---

## Best Practices

### 1. Never Hardcode URLs or Magic Values

```typescript
// ❌ Bad: Hardcoded values
const url = 'http://localhost:3000/api/v1/employees';
if (status === 200) { }
const pageSize = 20;

// ✅ Good: Use configuration
const url = this.appConfig.getFullApiUrl(this.appConfig.api.endpoints.employees.base);
if (status === HTTP_STATUS.OK) { }
const pageSize = API_CONFIG.DEFAULT_PAGE_SIZE;
```

### 2. Use Type-Safe Constants

```typescript
// ❌ Bad: String literals
if (user.role === 'admin') { }
localStorage.setItem('token', value);

// ✅ Good: Constants
if (user.role === USER_ROLES.ADMIN) { }
localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, value);
```

### 3. Centralize All Configuration

```typescript
// ❌ Bad: Scattered configuration
const timeout = 30000;
const retryCount = 3;
const pageSize = 20;

// ✅ Good: Centralized configuration
const timeout = API_CONFIG.TIMEOUT;
const retryCount = API_CONFIG.RETRY_COUNT;
const pageSize = API_CONFIG.DEFAULT_PAGE_SIZE;
```

### 4. Use Factory Functions for Dynamic URLs

```typescript
// ❌ Bad: String concatenation
const url = `/employees/${id}`;

// ✅ Good: Factory function
const url = this.appConfig.api.endpoints.employees.byId(id);
```

### 5. Leverage Feature Flags

```typescript
export class MyComponent {
  private appConfig = inject(AppConfigService);
  
  ngOnInit(): void {
    if (this.appConfig.isFeatureEnabled('newFeature')) {
      this.enableNewFeature();
    }
  }
}

// In environment files
export const environment = {
  production: false,
  features: {
    newFeature: true,
    analytics: false,
    betaFeatures: true
  }
};
```

---

## Related Documentation

- **Next:** [HTTP Communication Layer](http-layer.md) - HTTP service implementation
- **See Also:** [Error Handling](error-handling.md) - Error management system
- **Reference:** [Layer Architecture](../architecture/03-layer-architecture.md) - Core layer overview
- **Usage:** [Data Flow Patterns](../architecture/08-data-flow-patterns.md) - Service patterns

---

**Document Version:** 2.0  
**Last Updated:** November 2025  
**Maintained By:** Frontend Architecture Team

