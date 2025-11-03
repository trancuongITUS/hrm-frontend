# Error Handling & Notification System

**Document:** Error Management & User Notifications  
**Version:** Angular 20  
**Last Updated:** November 2025

---

## Table of Contents

1. [Overview](#overview)
2. [Error Models](#error-models)
3. [Error Logger Service](#error-logger-service)
4. [Global Error Handler](#global-error-handler)
5. [Notification Service](#notification-service)
6. [HTTP Error Handling](#http-error-handling)
7. [Best Practices](#best-practices)
8. [Related Documentation](#related-documentation)

---

## Overview

The application implements a comprehensive error handling and notification system (`src/app/core/errors`) that provides:

- ✅ **Global Error Handler** - Catches all unhandled JavaScript errors
- ✅ **HTTP Error Interceptor** - Handles API errors with user-friendly notifications
- ✅ **Structured Error Logging** - Detailed error logging with context
- ✅ **Toast Notifications** - User-friendly feedback using PrimeNG Toast
- ✅ **Type-Safe Error Models** - Strongly typed error classes for different scenarios

---

## Error Models

### Error Types and Severity

```typescript
// Error severity levels
export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

// Error types
export enum ErrorType {
  NETWORK = 'network',
  HTTP = 'http',
  VALIDATION = 'validation',
  AUTHENTICATION = 'authentication',
  AUTHORIZATION = 'authorization',
  BUSINESS = 'business',
  RUNTIME = 'runtime',
  UNKNOWN = 'unknown'
}
```

### Base Error Class

```typescript
export class ApplicationError extends Error {
  readonly type: ErrorType;
  readonly severity: ErrorSeverity;
  readonly timestamp: Date;
  readonly code?: string;
  readonly context?: Record<string, unknown>;
  
  constructor(
    message: string,
    type: ErrorType,
    severity: ErrorSeverity = ErrorSeverity.MEDIUM,
    code?: string,
    context?: Record<string, unknown>
  ) {
    super(message);
    this.name = 'ApplicationError';
    this.type = type;
    this.severity = severity;
    this.timestamp = new Date();
    this.code = code;
    this.context = context;
  }
  
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      type: this.type,
      severity: this.severity,
      timestamp: this.timestamp,
      code: this.code,
      context: this.context,
      stack: this.stack
    };
  }
}
```

### Specialized Error Classes

```typescript
export class HttpError extends ApplicationError {
  readonly statusCode: number;
  readonly url: string;
  readonly method: string;
  
  constructor(
    message: string,
    statusCode: number,
    url: string,
    method: string,
    context?: Record<string, unknown>
  ) {
    super(message, ErrorType.HTTP, ErrorSeverity.HIGH, `HTTP_${statusCode}`, context);
    this.name = 'HttpError';
    this.statusCode = statusCode;
    this.url = url;
    this.method = method;
  }
}

export class ValidationError extends ApplicationError {
  readonly field?: string;
  
  constructor(
    message: string,
    field?: string,
    context?: Record<string, unknown>
  ) {
    super(message, ErrorType.VALIDATION, ErrorSeverity.LOW, 'VALIDATION_ERROR', context);
    this.name = 'ValidationError';
    this.field = field;
  }
}

export class NetworkError extends ApplicationError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, ErrorType.NETWORK, ErrorSeverity.HIGH, 'NETWORK_ERROR', context);
    this.name = 'NetworkError';
  }
}

export class AuthenticationError extends ApplicationError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, ErrorType.AUTHENTICATION, ErrorSeverity.HIGH, 'AUTH_ERROR', context);
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends ApplicationError {
  constructor(message: string, context?: Record<string, unknown>) {
    super(message, ErrorType.AUTHORIZATION, ErrorSeverity.MEDIUM, 'AUTHZ_ERROR', context);
    this.name = 'AuthorizationError';
  }
}

export class BusinessError extends ApplicationError {
  constructor(message: string, code?: string, context?: Record<string, unknown>) {
    super(message, ErrorType.BUSINESS, ErrorSeverity.MEDIUM, code, context);
    this.name = 'BusinessError';
  }
}
```

---

## Error Logger Service

### Implementation

```typescript
@Injectable({ providedIn: 'root' })
export class ErrorLoggerService {
  private environment = inject(EnvironmentService);
  private logger = inject(LoggerService);
  
  // Log general errors
  logError(error: Error | ApplicationError): void {
    const errorInfo = this.normalizeError(error);
    
    if (this.environment.production) {
      // Send to remote logging service (Sentry, LogRocket, etc.)
      this.sendToRemoteLogger(errorInfo);
    } else {
      // Log to console in development
      console.error('[ERROR]', errorInfo);
    }
  }
  
  // Log HTTP errors
  logHttpError(error: unknown, statusCode: number, url: string, method: string): void {
    const httpError = new HttpError(
      `HTTP ${statusCode} error on ${method} ${url}`,
      statusCode,
      url,
      method,
      { error }
    );
    
    this.logError(httpError);
  }
  
  // Log validation errors
  logValidationError(message: string, field?: string, context?: Record<string, unknown>): void {
    const validationError = new ValidationError(message, field, context);
    this.logError(validationError);
  }
  
  // Log network errors
  logNetworkError(message: string, context?: Record<string, unknown>): void {
    const networkError = new NetworkError(message, context);
    this.logError(networkError);
  }
  
  // Log business errors
  logBusinessError(message: string, context?: Record<string, unknown>): void {
    const businessError = new BusinessError(message, undefined, context);
    this.logError(businessError);
  }
  
  // Log authentication errors
  logAuthenticationError(message: string, context?: Record<string, unknown>): void {
    const authError = new AuthenticationError(message, context);
    this.logError(authError);
  }
  
  // Log authorization errors
  logAuthorizationError(message: string, context?: Record<string, unknown>): void {
    const authzError = new AuthorizationError(message, context);
    this.logError(authzError);
  }
  
  private normalizeError(error: unknown): ApplicationError | Error {
    if (error instanceof ApplicationError) {
      return error;
    }
    if (error instanceof Error) {
      return error;
    }
    return new Error(String(error));
  }
  
  private sendToRemoteLogger(error: ApplicationError | Error): void {
    // Integrate with Sentry, LogRocket, or other logging service
    // Example: Sentry.captureException(error);
  }
}
```

---

## Global Error Handler

### Implementation

```typescript
@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  private errorLogger = inject(ErrorLoggerService);
  private notificationService = inject(NotificationService);
  private router = inject(Router);
  private environment = inject(EnvironmentService);
  
  handleError(error: Error | ApplicationError | unknown): void {
    // Normalize error
    const normalizedError = this.normalizeError(error);
    
    // Log error
    this.errorLogger.logError(normalizedError);
    
    // Show user-friendly notification
    this.showUserNotification(normalizedError);
    
    // Handle critical errors
    if (this.isCriticalError(normalizedError)) {
      this.handleCriticalError(normalizedError);
    }
    
    // Re-throw in development for debugging
    if (!this.environment.production) {
      console.error('Global Error Handler:', normalizedError);
      throw normalizedError;
    }
  }
  
  private normalizeError(error: unknown): ApplicationError | Error {
    if (error instanceof ApplicationError) {
      return error;
    }
    if (error instanceof Error) {
      return error;
    }
    return new Error('An unknown error occurred');
  }
  
  private showUserNotification(error: ApplicationError | Error): void {
    if (error instanceof HttpError) {
      this.notificationService.showError(`Request failed: ${error.message}`);
    } else if (error instanceof ValidationError) {
      this.notificationService.showWarning(error.message);
    } else if (error instanceof AuthenticationError) {
      this.notificationService.showAuthenticationError();
    } else if (error instanceof AuthorizationError) {
      this.notificationService.showAuthorizationError();
    } else if (error instanceof NetworkError) {
      this.notificationService.showNetworkError();
    } else {
      this.notificationService.showError('An unexpected error occurred');
    }
  }
  
  private isCriticalError(error: ApplicationError | Error): boolean {
    return error instanceof ApplicationError && 
           error.severity === ErrorSeverity.CRITICAL;
  }
  
  private handleCriticalError(error: ApplicationError | Error): void {
    // Navigate to error page or show critical error modal
    this.router.navigate(['/error/500']);
  }
}
```

### Registration

```typescript
// app.config.ts
import { ApplicationConfig, ErrorHandler } from '@angular/core';
import { GlobalErrorHandler } from './core/errors/global-error-handler';

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
    // ... other providers
  ]
};
```

---

## Notification Service

### Implementation

```typescript
@Injectable({ providedIn: 'root' })
export class NotificationService {
  private messageService = inject(MessageService);
  
  // Basic notifications
  showSuccess(message: string, title: string = 'Success', options?: NotificationOptions): void {
    this.messageService.add({
      severity: 'success',
      summary: title,
      detail: message,
      life: options?.duration || 3000
    });
  }
  
  showInfo(message: string, title: string = 'Info', options?: NotificationOptions): void {
    this.messageService.add({
      severity: 'info',
      summary: title,
      detail: message,
      life: options?.duration || 3000
    });
  }
  
  showWarning(message: string, title: string = 'Warning', options?: NotificationOptions): void {
    this.messageService.add({
      severity: 'warn',
      summary: title,
      detail: message,
      life: options?.duration || 5000
    });
  }
  
  showError(message: string, title: string = 'Error', options?: NotificationOptions): void {
    this.messageService.add({
      severity: 'error',
      summary: title,
      detail: message,
      life: options?.duration || 5000
    });
  }
  
  // Specialized notifications
  showOperationSuccess(operation: 'created' | 'updated' | 'deleted' | 'saved', entity?: string): void {
    const messages = {
      created: `${entity || 'Item'} created successfully`,
      updated: `${entity || 'Item'} updated successfully`,
      deleted: `${entity || 'Item'} deleted successfully`,
      saved: `${entity || 'Changes'} saved successfully`
    };
    this.showSuccess(messages[operation]);
  }
  
  showOperationError(operation: 'create' | 'update' | 'delete' | 'save' | 'load', entity?: string): void {
    const messages = {
      create: `Failed to create ${entity || 'item'}`,
      update: `Failed to update ${entity || 'item'}`,
      delete: `Failed to delete ${entity || 'item'}`,
      save: `Failed to save ${entity || 'changes'}`,
      load: `Failed to load ${entity || 'data'}`
    };
    this.showError(messages[operation]);
  }
  
  showValidationErrors(errors: Record<string, string[]> | string[], title?: string): void {
    const errorMessages = Array.isArray(errors) 
      ? errors 
      : Object.entries(errors).flatMap(([field, msgs]) => msgs.map(msg => `${field}: ${msg}`));
    
    errorMessages.forEach(msg => {
      this.showWarning(msg, title || 'Validation Error');
    });
  }
  
  showNetworkError(message?: string): void {
    this.showError(
      message || 'Network connection error. Please check your internet connection.',
      'Network Error'
    );
  }
  
  showAuthenticationError(message?: string): void {
    this.showError(
      message || 'Your session has expired. Please log in again.',
      'Authentication Required'
    );
  }
  
  showAuthorizationError(message?: string): void {
    this.showWarning(
      message || 'You do not have permission to perform this action.',
      'Access Denied'
    );
  }
  
  // Advanced features
  showLoading(message: string = 'Loading...', title: string = 'Please wait'): () => void {
    const key = `loading-${Date.now()}`;
    this.messageService.add({
      key,
      severity: 'info',
      summary: title,
      detail: message,
      sticky: true
    });
    
    // Return cleanup function
    return () => this.clearByKey(key);
  }
  
  clearAll(): void {
    this.messageService.clear();
  }
  
  clearByKey(key: string): void {
    this.messageService.clear(key);
  }
}
```

### Setup

1. **Register MessageService** in `app.config.ts`:
```typescript
import { ApplicationConfig } from '@angular/core';
import { MessageService } from 'primeng/api';

export const appConfig: ApplicationConfig = {
  providers: [
    MessageService,
    // ... other providers
  ]
};
```

2. **Add Toast component** to `app.component.ts`:
```typescript
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Toast } from 'primeng/toast';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, Toast],
  template: `
    <p-toast position="top-right" />
    <router-outlet />
  `
})
export class AppComponent {}
```

### Usage Examples

```typescript
export class EmployeeListComponent {
  private employeeService = inject(EmployeeService);
  private notificationService = inject(NotificationService);
  
  loadEmployees(): void {
    this.employeeService.getEmployees().subscribe({
      next: (employees) => {
        this.employees.set(employees);
      },
      error: () => {
        this.notificationService.showOperationError('load', 'employees');
      }
    });
  }
  
  deleteEmployee(id: string): void {
    this.employeeService.deleteEmployee(id).subscribe({
      next: () => {
        this.notificationService.showOperationSuccess('deleted', 'Employee');
        this.loadEmployees();
      },
      error: () => {
        this.notificationService.showOperationError('delete', 'employee');
      }
    });
  }
  
  async performLongOperation(): Promise<void> {
    const clearLoading = this.notificationService.showLoading('Processing...');
    
    try {
      await this.service.performOperation();
      this.notificationService.showSuccess('Operation completed');
    } catch (error) {
      this.notificationService.showError('Operation failed');
    } finally {
      clearLoading();
    }
  }
}
```

---

## HTTP Error Handling

### Error Interceptor Integration

```typescript
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notificationService = inject(NotificationService);
  const errorLogger = inject(ErrorLoggerService);
  const router = inject(Router);
  
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Log error
      errorLogger.logHttpError(error, error.status, req.url, req.method);
      
      // Show appropriate notification
      if (error.status === 401) {
        notificationService.showAuthenticationError();
        router.navigate(['/auth/login']);
      } else if (error.status === 403) {
        notificationService.showAuthorizationError();
      } else if (error.status === 422) {
        notificationService.showValidationErrors(error.error.errors);
      } else if (error.status >= 500) {
        notificationService.showError('Server error occurred');
      } else if (error.status === 0) {
        notificationService.showNetworkError();
      }
      
      return throwError(() => error);
    })
  );
};
```

---

## Best Practices

### 1. Use Appropriate Error Types

```typescript
// ✅ Good: Use specific error types
throw new ValidationError('Invalid email', 'email');
throw new AuthenticationError('Invalid credentials');
throw new BusinessError('Insufficient balance', 'INSUFFICIENT_BALANCE');

// ❌ Bad: Generic errors
throw new Error('Something went wrong');
```

### 2. Provide User-Friendly Messages

```typescript
// ✅ Good: User-friendly message
this.notificationService.showError('Unable to load data. Please try again.');

// ❌ Bad: Technical message
this.notificationService.showError('TypeError: Cannot read property x of undefined');
```

### 3. Log with Context

```typescript
// ✅ Good: Log with context
this.errorLogger.logError(error, {
  component: 'EmployeeService',
  action: 'createEmployee',
  userId: currentUser.id,
  employeeData: employee
});

// ❌ Bad: Log without context
console.error(error);
```

### 4. Handle Errors Gracefully in Components

```typescript
// ✅ Good: Graceful error handling
export class EmployeeListComponent {
  private notificationService = inject(NotificationService);
  
  loadEmployees(): void {
    this.employeeService.getEmployees().subscribe({
      next: (employees) => {
        this.employees.set(employees);
      },
      error: () => {
        // Error already logged by interceptor
        this.employees.set([]); // Fallback to empty array
      }
    });
  }
}
```

---

## Related Documentation

- **Previous:** [HTTP Communication](http-layer.md) - HTTP service
- **See Also:** [Configuration Layer](configuration-layer.md) - Configuration management
- **Reference:** [Layer Architecture](../architecture/03-layer-architecture.md) - Core layer overview
- **Usage:** [Data Flow Patterns](../architecture/08-data-flow-patterns.md) - Error handling in services

---

**Document Version:** 2.0  
**Last Updated:** November 2025  
**Maintained By:** Frontend Architecture Team

