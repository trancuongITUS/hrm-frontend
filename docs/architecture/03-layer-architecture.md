# Layer Architecture

**Document:** Layer Architecture & Responsibilities  
**Version:** Angular 20  
**Last Updated:** November 2025

---

## Table of Contents

1. [Overview](#overview)
2. [Three-Tier Architecture](#three-tier-architecture)
3. [Core Layer](#core-layer)
4. [Shared Layer](#shared-layer)
5. [Feature Layer](#feature-layer)
6. [Layout Layer](#layout-layer)
7. [Pages Layer](#pages-layer)
8. [Layer Interaction Rules](#layer-interaction-rules)
9. [Related Documentation](#related-documentation)

---

## Overview

The application follows a **layered architecture** with clear separation of concerns. Each layer has specific responsibilities and follows dependency rules to maintain clean architecture.

### Dependency Flow

```
Pages Layer
    ↓
Layout Layer
    ↓
Feature Layer
    ↓
Shared Layer
    ↓
Core Layer
```

**Rule:** Higher layers can depend on lower layers, but not vice versa.

---

## Three-Tier Architecture

The application is organized into five distinct layers:

1. **Core Layer** - Foundation services and configuration
2. **Shared Layer** - Reusable UI components and utilities
3. **Feature Layer** - Business logic and domain-specific features
4. **Layout Layer** - Application shell and layouts
5. **Pages Layer** - Top-level route entry points

---

## Core Layer

**Location:** `src/app/core`

### Purpose
Singleton services, application-wide configurations, guards, interceptors, and foundational infrastructure.

### Characteristics
- Services provided in root (`providedIn: 'root'`)
- Should be imported/used only once
- No UI components
- Global application concerns

### Sub-layers

#### 1. **Config Layer** (`core/config`)
Application configuration, API endpoints, constants

```typescript
// core/config/app-config.service.ts
@Injectable({ providedIn: 'root' })
export class AppConfigService {
  get apiBaseUrl(): string {
    return this.environment.apiUrl;
  }
  
  get api() {
    return API_ENDPOINTS;
  }
}
```

#### 2. **HTTP Layer** (`core/http`)
Base HTTP service, API response models, type-safe HTTP communication

```typescript
// core/http/base-http.service.ts
@Injectable({ providedIn: 'root' })
export class BaseHttpService {
  get<T>(url: string, options?: HttpRequestOptions): Observable<T> {
    return this.http.get<T>(this.buildUrl(url), options).pipe(
      timeout(this.config.apiTimeout),
      retry({ count: 3, delay: 1000 }),
      catchError(this.handleError)
    );
  }
}
```

#### 3. **Auth Layer** (`core/auth`)
Authentication services, guards, interceptors

```typescript
// core/auth/guards/auth.guard.ts
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  if (authService.isAuthenticated()) {
    return true;
  }
  
  return router.createUrlTree(['/auth/login']);
};
```

#### 4. **Error Layer** (`core/errors`)
Error handling, logging, and global error handler

```typescript
// core/errors/global-error-handler.ts
@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  handleError(error: Error | ApplicationError | unknown): void {
    this.errorLogger.logError(error);
    this.notificationService.showError('An error occurred');
  }
}
```

#### 5. **Services** (`core/services`)
Core singleton services (logger, notification, environment, etc.)

```typescript
// core/services/logger.service.ts
@Injectable({ providedIn: 'root' })
export class LoggerService {
  info(message: string, ...args: unknown[]): void {
    if (!this.environment.production) {
      console.log(`[INFO] ${message}`, ...args);
    }
  }
}
```

#### 6. **Interceptors** (`core/interceptors`)
Global HTTP interceptors

```typescript
// core/interceptors/api.interceptor.ts
export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  const config = inject(AppConfigService);
  const modifiedReq = req.clone({
    url: `${config.apiBaseUrl}${req.url}`,
    setHeaders: {
      'Content-Type': 'application/json'
    }
  });
  return next(modifiedReq);
};
```

### Examples

```typescript
// ✅ Core services
@Injectable({ providedIn: 'root' })
export class AuthService { }

@Injectable({ providedIn: 'root' })
export class LoggerService { }

@Injectable({ providedIn: 'root' })
export class NotificationService { }

// ❌ NOT core (feature-specific)
export class EmployeeService { } // This belongs in features/employee
```

---

## Shared Layer

**Location:** `src/app/shared`

### Purpose
Reusable components, directives, pipes, and utilities that can be used across multiple features.

### Characteristics
- Stateless, presentational components
- Can be used across multiple features
- No business logic
- Heavy use of @Input/@Output

### Sub-layers

#### 1. **UI Components** (`shared/components/ui`)
Reusable UI components

```typescript
// shared/components/ui/button/button.component.ts
@Component({
  selector: 'app-button',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <button 
      [type]="type"
      [disabled]="disabled"
      [class]="buttonClass"
      (click)="onClick.emit()">
      <ng-content></ng-content>
    </button>
  `
})
export class ButtonComponent {
  @Input() type: 'button' | 'submit' = 'button';
  @Input() variant: 'primary' | 'secondary' = 'primary';
  @Input() disabled = false;
  @Output() onClick = new EventEmitter<void>();
  
  get buttonClass(): string {
    return `btn btn-${this.variant}`;
  }
}
```

#### 2. **Layout Components** (`shared/components/layout`)
Layout-specific shared components

```typescript
// shared/components/layout/loading-spinner/loading-spinner.component.ts
@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  template: `
    <div class="spinner-container">
      <div class="spinner"></div>
      @if (message) {
        <p>{{ message }}</p>
      }
    </div>
  `
})
export class LoadingSpinnerComponent {
  @Input() message?: string;
}
```

#### 3. **Directives** (`shared/directives`)
Custom directives

```typescript
// shared/directives/auto-focus.directive.ts
@Directive({
  selector: '[appAutoFocus]',
  standalone: true
})
export class AutoFocusDirective implements AfterViewInit {
  private elementRef = inject(ElementRef);
  
  ngAfterViewInit(): void {
    this.elementRef.nativeElement.focus();
  }
}
```

#### 4. **Pipes** (`shared/pipes`)
Custom pipes

```typescript
// shared/pipes/time-ago.pipe.ts
@Pipe({
  name: 'timeAgo',
  standalone: true
})
export class TimeAgoPipe implements PipeTransform {
  transform(value: Date | string): string {
    const date = new Date(value);
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    // ... more logic
    return date.toLocaleDateString();
  }
}
```

### Examples

```typescript
// ✅ Shared components (reusable across features)
export class ButtonComponent { }
export class CardComponent { }
export class ModalComponent { }
export class TableComponent { }

// ❌ NOT shared (feature-specific)
export class EmployeeCardComponent { } // This belongs in features/employee
```

---

## Feature Layer

**Location:** `src/app/features`

### Purpose
Business domains and feature modules containing domain-specific logic.

### Characteristics
- Encapsulates specific business functionality
- Contains smart (container) and dumb (presentational) components
- Feature-specific services and state management
- Lazy-loaded via routing

### Structure

```
features/employee/
├── components/        # Smart and dumb components
├── services/          # Feature-specific services
├── models/            # Domain models
├── guards/            # Feature guards
└── employee.routes.ts # Feature routing
```

### Smart Components (Container)

```typescript
// features/employee/components/employee-list/employee-list.component.ts
@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, EmployeeCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="employee-list">
      @for (employee of employees(); track employee.id) {
        <app-employee-card 
          [employee]="employee"
          (delete)="onDelete($event)"
          (edit)="onEdit($event)">
        </app-employee-card>
      }
    </div>
  `
})
export class EmployeeListComponent {
  private employeeService = inject(EmployeeService);
  
  employees = this.employeeService.getEmployees();
  
  onDelete(id: string): void {
    this.employeeService.deleteEmployee(id);
  }
  
  onEdit(employee: Employee): void {
    // Handle edit logic
  }
}
```

### Dumb Components (Presentational)

```typescript
// features/employee/components/employee-card/employee-card.component.ts
@Component({
  selector: 'app-employee-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="employee-card">
      <h3>{{ employee.name }}</h3>
      <p>{{ employee.position }}</p>
      <button (click)="edit.emit(employee)">Edit</button>
      <button (click)="delete.emit(employee.id)">Delete</button>
    </div>
  `
})
export class EmployeeCardComponent {
  @Input({ required: true }) employee!: Employee;
  @Output() edit = new EventEmitter<Employee>();
  @Output() delete = new EventEmitter<string>();
}
```

### Feature Services

```typescript
// features/employee/services/employee.service.ts
@Injectable({ providedIn: 'root' })
export class EmployeeService {
  private baseHttp = inject(BaseHttpService);
  private config = inject(AppConfigService);
  
  getEmployees(): Observable<Employee[]> {
    return this.baseHttp.getList<Employee>('employees');
  }
  
  getEmployeeById(id: string): Observable<Employee> {
    return this.baseHttp.get<Employee>(`employees/${id}`);
  }
  
  createEmployee(employee: CreateEmployeeDto): Observable<Employee> {
    return this.baseHttp.post<Employee>('employees', employee);
  }
}
```

---

## Layout Layer

**Location:** `src/app/layout`

### Purpose
Application shell and layout components that define the overall structure.

### Characteristics
- Defines the overall structure (header, footer, sidebar)
- Contains layout-switching logic
- Theme and responsive behavior

### Examples

```typescript
// layout/components/main-layout/main-layout.component.ts
@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, SidebarComponent, FooterComponent],
  template: `
    <div class="main-layout">
      <app-header />
      <div class="layout-content">
        <app-sidebar />
        <main class="main-content">
          <router-outlet />
        </main>
      </div>
      <app-footer />
    </div>
  `
})
export class MainLayoutComponent { }
```

---

## Pages Layer

**Location:** `src/app/pages`

### Purpose
Top-level route components that serve as entry points for major sections.

### Characteristics
- Acts as entry points for major sections
- Usually wraps feature components
- Minimal logic, mostly composition

### Examples

```typescript
// pages/auth/login/login.component.ts
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="login-page">
      <h1>Login</h1>
      <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
        <!-- form fields -->
      </form>
    </div>
  `
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  });
  
  onSubmit(): void {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe(() => {
        this.router.navigate(['/dashboard']);
      });
    }
  }
}
```

---

## Layer Interaction Rules

### ✅ Allowed Dependencies

- **Pages** → Layout, Features, Shared, Core
- **Layout** → Shared, Core
- **Features** → Shared, Core
- **Shared** → Core (minimal)
- **Core** → No dependencies on other layers

### ❌ Forbidden Dependencies

- **Core** → Features, Shared, Layout, Pages
- **Shared** → Features, Layout, Pages
- **Features** → Other Features (avoid circular dependencies)

### Best Practices

1. **Never import from higher layers**
```typescript
// ❌ Bad: Core importing from Feature
// core/services/some.service.ts
import { EmployeeService } from '@features/employee';

// ✅ Good: Feature importing from Core
// features/employee/services/employee.service.ts
import { BaseHttpService } from '@core/http';
```

2. **Keep shared components truly reusable**
```typescript
// ❌ Bad: Feature-specific logic in shared component
export class ButtonComponent {
  @Input() employee!: Employee; // Feature-specific
}

// ✅ Good: Generic, reusable component
export class ButtonComponent {
  @Input() label!: string;
  @Input() variant: 'primary' | 'secondary' = 'primary';
}
```

3. **Feature isolation**
```typescript
// ❌ Bad: Feature importing another feature
// features/employee/services/employee.service.ts
import { PayrollService } from '@features/payroll';

// ✅ Good: Both features use core services
// features/employee/services/employee.service.ts
import { BaseHttpService } from '@core/http';
```

---

## Related Documentation

- **Previous:** [Project Structure](02-project-structure.md) - Folder organization
- **Next:** [Naming Conventions](04-naming-conventions.md) - Naming standards
- **See Also:** [Component Architecture](05-component-architecture.md) - Component patterns
- **Visual Guide:** [Architecture Diagrams](../architecture-diagram.md) - Visual representation

---

**Document Version:** 2.0  
**Last Updated:** November 2025  
**Maintained By:** Frontend Architecture Team

