# Enterprise Angular Architecture Guide

**Version:** Angular 20  
**Project Type:** HRM Frontend  
**Architecture Pattern:** Feature-Based Modular Design with Standalone Components  
**Last Updated:** October 2025

---

## Table of Contents

1. [Overview](#overview)
2. [Architectural Principles](#architectural-principles)
3. [Project Structure](#project-structure)
4. [Layer Architecture](#layer-architecture)
5. [Folder Organization](#folder-organization)
6. [Naming Conventions](#naming-conventions)
7. [Component Architecture](#component-architecture)
8. [State Management](#state-management)
9. [Routing Strategy](#routing-strategy)
10. [Data Flow Patterns](#data-flow-patterns)
11. [Configuration Layer](#configuration-layer)
12. [HTTP Communication Layer](#http-communication-layer)
13. [Code Organization Best Practices](#code-organization-best-practices)
14. [Testing Strategy](#testing-strategy)
15. [Performance Optimization](#performance-optimization)
16. [Security Considerations](#security-considerations)
17. [Scalability Guidelines](#scalability-guidelines)

---

## Overview

This document defines the enterprise-level architecture for a modern Angular 20 application built for Human Resource Management (HRM). The architecture emphasizes:

- **Standalone Components** (no NgModules)
- **Strict TypeScript** configuration
- **Reactive programming** with RxJS
- **Lazy loading** for optimal performance
- **Clean separation of concerns**
- **Testability and maintainability**

---

## Architectural Principles

### 1. **Separation of Concerns (SoC)**
Each layer, module, and component has a single, well-defined responsibility.

### 2. **DRY (Don't Repeat Yourself)**
Shared logic is extracted into reusable services, utilities, or components.

### 3. **SOLID Principles**
- **S**ingle Responsibility
- **O**pen/Closed
- **L**iskov Substitution
- **I**nterface Segregation
- **D**ependency Inversion

### 4. **Reactive First**
Prefer RxJS Observables for asynchronous operations and state management.

### 5. **Type Safety**
Strict TypeScript configuration with no `any` types.

### 6. **Performance by Default**
- Lazy loading routes
- OnPush change detection
- Signal-based reactivity (Angular 20+)

---

## Project Structure

```
hrm-frontend/
├── docs/                           # Documentation
│   ├── architecture.md
│   ├── api-integration.md
│   └── deployment.md
│
├── public/                         # Static assets
│   ├── icons/
│   ├── images/
│   └── locales/                    # i18n translation files
│
├── src/
│   ├── app/
│   │   ├── core/                   # Singleton services, guards, interceptors
│   │   │   ├── auth/
│   │   │   │   ├── guards/
│   │   │   │   │   ├── auth.guard.ts
│   │   │   │   │   ├── role.guard.ts
│   │   │   │   │   └── index.ts
│   │   │   │   ├── interceptors/
│   │   │   │   │   ├── auth.interceptor.ts
│   │   │   │   │   ├── error.interceptor.ts
│   │   │   │   │   ├── loading.interceptor.ts
│   │   │   │   │   └── index.ts
│   │   │   │   ├── services/
│   │   │   │   │   ├── auth.service.ts
│   │   │   │   │   ├── token.service.ts
│   │   │   │   │   ├── session.service.ts
│   │   │   │   │   └── index.ts
│   │   │   │   ├── models/
│   │   │   │   │   ├── user.model.ts
│   │   │   │   │   ├── auth.model.ts
│   │   │   │   │   └── index.ts
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── config/              # Application configuration layer
│   │   │   │   ├── api.config.ts       # API endpoints configuration
│   │   │   │   ├── app-config.service.ts # Runtime config service
│   │   │   │   ├── constants.ts        # App-wide constants
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── http/                # HTTP communication layer
│   │   │   │   ├── base-http.service.ts  # Base HTTP service wrapper
│   │   │   │   ├── api-response.model.ts # Standard API response types
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── errors/              # Error handling layer
│   │   │   │   ├── error.model.ts        # Error types and classes
│   │   │   │   ├── error-logger.service.ts # Structured error logging
│   │   │   │   ├── global-error-handler.ts # Global error handler
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── services/
│   │   │   │   ├── environment.service.ts
│   │   │   │   ├── logger.service.ts      # Enhanced structured logging
│   │   │   │   ├── notification.service.ts # Toast notification service
│   │   │   │   ├── loading.service.ts
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   ├── interceptors/
│   │   │   │   ├── api.interceptor.ts
│   │   │   │   └── index.ts
│   │   │   │
│   │   │   └── index.ts
│   │   │
│   │   ├── shared/                 # Shared components, directives, pipes
│   │   │   ├── components/
│   │   │   │   ├── ui/             # Presentational UI components
│   │   │   │   │   ├── button/
│   │   │   │   │   │   ├── button.component.ts
│   │   │   │   │   │   ├── button.component.html
│   │   │   │   │   │   ├── button.component.scss
│   │   │   │   │   │   └── button.component.spec.ts
│   │   │   │   │   ├── card/
│   │   │   │   │   ├── modal/
│   │   │   │   │   ├── table/
│   │   │   │   │   ├── form-field/
│   │   │   │   │   ├── breadcrumb/
│   │   │   │   │   └── pagination/
│   │   │   │   │
│   │   │   │   └── layout/         # Layout-specific shared components
│   │   │   │       ├── header/
│   │   │   │       ├── footer/
│   │   │   │       ├── sidebar/
│   │   │   │       └── loading-spinner/
│   │   │   │
│   │   │   ├── directives/
│   │   │   │   ├── auto-focus.directive.ts
│   │   │   │   ├── click-outside.directive.ts
│   │   │   │   ├── permission.directive.ts
│   │   │   │   └── lazy-load.directive.ts
│   │   │   │
│   │   │   ├── pipes/
│   │   │   │   ├── safe-html.pipe.ts
│   │   │   │   ├── truncate.pipe.ts
│   │   │   │   ├── time-ago.pipe.ts
│   │   │   │   └── currency-format.pipe.ts
│   │   │   │
│   │   │   ├── models/
│   │   │   │   ├── common.model.ts
│   │   │   │   ├── api-response.model.ts
│   │   │   │   └── pagination.model.ts
│   │   │   │
│   │   │   └── validators/
│   │   │       ├── custom-validators.ts
│   │   │       └── async-validators.ts
│   │   │
│   │   ├── features/               # Feature modules (business domains)
│   │   │   │
│   │   │   ├── employee/           # Employee management feature
│   │   │   │   ├── components/
│   │   │   │   │   ├── employee-list/
│   │   │   │   │   │   ├── employee-list.component.ts
│   │   │   │   │   │   ├── employee-list.component.html
│   │   │   │   │   │   ├── employee-list.component.scss
│   │   │   │   │   │   └── employee-list.component.spec.ts
│   │   │   │   │   ├── employee-detail/
│   │   │   │   │   ├── employee-form/
│   │   │   │   │   └── employee-card/       # Presentational sub-component
│   │   │   │   │
│   │   │   │   ├── services/
│   │   │   │   │   ├── employee.service.ts
│   │   │   │   │   ├── employee-state.service.ts
│   │   │   │   │   └── employee.resolver.ts
│   │   │   │   │
│   │   │   │   ├── models/
│   │   │   │   │   ├── employee.model.ts
│   │   │   │   │   ├── employee-filter.model.ts
│   │   │   │   │   └── employee-dto.model.ts
│   │   │   │   │
│   │   │   │   ├── guards/
│   │   │   │   │   └── employee-access.guard.ts
│   │   │   │   │
│   │   │   │   └── employee.routes.ts
│   │   │   │
│   │   │   ├── attendance/         # Attendance tracking feature
│   │   │   │   ├── components/
│   │   │   │   ├── services/
│   │   │   │   ├── models/
│   │   │   │   └── attendance.routes.ts
│   │   │   │
│   │   │   ├── payroll/            # Payroll management feature
│   │   │   │   ├── components/
│   │   │   │   ├── services/
│   │   │   │   ├── models/
│   │   │   │   └── payroll.routes.ts
│   │   │   │
│   │   │   ├── leave/              # Leave management feature
│   │   │   │   ├── components/
│   │   │   │   ├── services/
│   │   │   │   ├── models/
│   │   │   │   └── leave.routes.ts
│   │   │   │
│   │   │   ├── recruitment/        # Recruitment feature
│   │   │   │   ├── components/
│   │   │   │   ├── services/
│   │   │   │   ├── models/
│   │   │   │   └── recruitment.routes.ts
│   │   │   │
│   │   │   ├── performance/        # Performance review feature
│   │   │   │   ├── components/
│   │   │   │   ├── services/
│   │   │   │   ├── models/
│   │   │   │   └── performance.routes.ts
│   │   │   │
│   │   │   ├── dashboard/          # Dashboard feature
│   │   │   │   ├── components/
│   │   │   │   │   ├── dashboard-container.component.ts
│   │   │   │   │   └── widgets/
│   │   │   │   │       ├── stats-widget.component.ts
│   │   │   │   │       ├── chart-widget.component.ts
│   │   │   │   │       └── notification-widget.component.ts
│   │   │   │   ├── services/
│   │   │   │   └── dashboard.routes.ts
│   │   │   │
│   │   │   ├── reports/            # Reporting feature
│   │   │   │   ├── components/
│   │   │   │   ├── services/
│   │   │   │   ├── models/
│   │   │   │   └── reports.routes.ts
│   │   │   │
│   │   │   └── settings/           # Application settings
│   │   │       ├── components/
│   │   │       ├── services/
│   │   │       └── settings.routes.ts
│   │   │
│   │   ├── layout/                 # Application layout components
│   │   │   ├── components/
│   │   │   │   ├── main-layout/
│   │   │   │   │   ├── main-layout.component.ts
│   │   │   │   │   ├── main-layout.component.html
│   │   │   │   │   └── main-layout.component.scss
│   │   │   │   ├── auth-layout/
│   │   │   │   ├── admin-layout/
│   │   │   │   └── public-layout/
│   │   │   │
│   │   │   └── services/
│   │   │       ├── layout.service.ts
│   │   │       └── theme.service.ts
│   │   │
│   │   └── pages/                  # Top-level page components
│   │       ├── auth/
│   │       │   ├── login/
│   │       │   ├── register/
│   │       │   ├── forgot-password/
│   │       │   └── auth.routes.ts
│   │       │
│   │       ├── error/
│   │       │   ├── not-found/
│   │       │   ├── forbidden/
│   │       │   ├── server-error/
│   │       │   └── error.routes.ts
│   │       │
│   │       └── landing/
│   │           └── landing.component.ts
│   │
│   ├── assets/                     # Application assets
│   │   ├── styles/
│   │   │   ├── abstracts/          # Variables, mixins, functions
│   │   │   │   ├── _variables.scss
│   │   │   │   ├── _mixins.scss
│   │   │   │   └── _functions.scss
│   │   │   ├── base/               # Reset, typography, global styles
│   │   │   │   ├── _reset.scss
│   │   │   │   └── _typography.scss
│   │   │   ├── components/         # Component-specific styles
│   │   │   ├── layout/             # Layout-specific styles
│   │   │   ├── themes/             # Theme definitions
│   │   │   │   ├── _light.scss
│   │   │   │   └── _dark.scss
│   │   │   └── styles.scss         # Main style entry point
│   │   │
│   │   ├── images/
│   │   ├── icons/
│   │   └── fonts/
│   │
│   ├── environments/               # Environment configurations
│   │   ├── environment.ts
│   │   ├── environment.development.ts
│   │   ├── environment.staging.ts
│   │   └── environment.production.ts
│   │
│   ├── app.component.ts            # Root component
│   ├── app.config.ts               # Application configuration
│   ├── app.routes.ts               # Root routing configuration
│   ├── main.ts                     # Application entry point
│   └── index.html                  # HTML entry point
│
├── .eslintrc.json                  # ESLint configuration
├── .prettierrc                     # Prettier configuration
├── angular.json                    # Angular CLI configuration
├── tsconfig.json                   # TypeScript configuration
├── tsconfig.app.json               # TypeScript config for app
├── tsconfig.spec.json              # TypeScript config for tests
├── karma.conf.js                   # Karma test runner config
└── package.json                    # Dependencies and scripts
```

---

## Layer Architecture

The application follows a **three-tier architecture**:

### 1. **Core Layer** (`src/app/core`)
- **Purpose:** Singleton services, application-wide configurations, guards, interceptors
- **Characteristics:**
  - Services provided in root (`providedIn: 'root'`)
  - Should be imported/used only once
  - No UI components
- **Sub-layers:**
  - **Config Layer:** Application configuration, API endpoints, constants
  - **HTTP Layer:** Base HTTP service, API response models, type-safe HTTP communication
  - **Auth Layer:** Authentication services, guards, interceptors
  - **Error Layer:** Error handling, logging, and global error handler
  - **Services:** Core singleton services (logger, notification, environment, etc.)
  - **Interceptors:** Global HTTP interceptors
- **Examples:** AuthService, LoggerService, NotificationService, ErrorLoggerService, HTTP Interceptors, AppConfigService, BaseHttpService

### 2. **Shared Layer** (`src/app/shared`)
- **Purpose:** Reusable components, directives, pipes, and utilities
- **Characteristics:**
  - Stateless, presentational components
  - Can be used across multiple features
  - No business logic
- **Examples:** ButtonComponent, FormFieldComponent, DatePipe

### 3. **Feature Layer** (`src/app/features`)
- **Purpose:** Business domains and feature modules
- **Characteristics:**
  - Encapsulates specific business functionality
  - Contains smart (container) and dumb (presentational) components
  - Feature-specific services and state management
  - Lazy-loaded via routing
- **Examples:** EmployeeModule, AttendanceModule, PayrollModule

### 4. **Layout Layer** (`src/app/layout`)
- **Purpose:** Application shell and layout components
- **Characteristics:**
  - Defines the overall structure (header, footer, sidebar)
  - Contains layout-switching logic
  - Theme and responsive behavior
- **Examples:** MainLayoutComponent, AuthLayoutComponent

### 5. **Pages Layer** (`src/app/pages`)
- **Purpose:** Top-level route components
- **Characteristics:**
  - Acts as entry points for major sections
  - Usually wraps feature components
  - Minimal logic, mostly composition
- **Examples:** LoginPage, DashboardPage, NotFoundPage

---

## Folder Organization

### Feature Module Structure

Each feature follows this consistent structure:

```
features/employee/
├── components/                     # All UI components for this feature
│   ├── employee-list/              # Smart (container) component
│   │   ├── employee-list.component.ts
│   │   ├── employee-list.component.html
│   │   ├── employee-list.component.scss
│   │   └── employee-list.component.spec.ts
│   ├── employee-detail/            # Smart component
│   └── employee-card/              # Dumb (presentational) component
│
├── services/                       # Feature-specific services
│   ├── employee.service.ts         # Data access service
│   ├── employee-state.service.ts   # State management
│   └── employee.resolver.ts        # Route resolver
│
├── models/                         # TypeScript interfaces/types
│   ├── employee.model.ts           # Domain model
│   ├── employee-filter.model.ts    # Filter/query models
│   └── employee-dto.model.ts       # Data Transfer Objects
│
├── guards/                         # Feature-specific guards
│   └── employee-access.guard.ts
│
├── validators/                     # Custom validators (if needed)
│   └── employee-validators.ts
│
├── constants/                      # Feature-specific constants
│   └── employee.constants.ts
│
└── employee.routes.ts              # Feature routing configuration
```

---

## Naming Conventions

### Files

| Type | Pattern | Example |
|------|---------|---------|
| Component | `{name}.component.ts` | `employee-list.component.ts` |
| Service | `{name}.service.ts` | `employee.service.ts` |
| Guard | `{name}.guard.ts` | `auth.guard.ts` |
| Interceptor | `{name}.interceptor.ts` | `error.interceptor.ts` |
| Pipe | `{name}.pipe.ts` | `time-ago.pipe.ts` |
| Directive | `{name}.directive.ts` | `auto-focus.directive.ts` |
| Model/Interface | `{name}.model.ts` or `{name}.interface.ts` | `employee.model.ts` |
| Resolver | `{name}.resolver.ts` | `employee.resolver.ts` |
| Validator | `{name}.validator.ts` | `email.validator.ts` |
| Utility | `{name}.util.ts` | `date.util.ts` |
| Constants | `{name}.constants.ts` | `api.constants.ts` |
| Routes | `{name}.routes.ts` | `employee.routes.ts` |
| Config | `{name}.config.ts` | `app.config.ts` |

### Classes and Types

| Type | Convention | Example |
|------|------------|---------|
| Component Class | PascalCase + `Component` | `EmployeeListComponent` |
| Service Class | PascalCase + `Service` | `EmployeeService` |
| Guard Class | PascalCase + `Guard` | `AuthGuard` |
| Pipe Class | PascalCase + `Pipe` | `TimeAgoPipe` |
| Directive Class | PascalCase + `Directive` | `AutoFocusDirective` |
| Interface | PascalCase (no prefix) | `Employee`, `UserProfile` |
| Type Alias | PascalCase | `EmployeeStatus` |
| Enum | PascalCase | `UserRole` |
| Const | UPPER_SNAKE_CASE | `API_BASE_URL` |

### Variables and Functions

| Type | Convention | Example |
|------|------------|---------|
| Variable | camelCase | `employeeList`, `isLoading` |
| Function | camelCase | `loadEmployees()`, `calculateSalary()` |
| Boolean | is/has/can + camelCase | `isVisible`, `hasPermission`, `canEdit` |
| Private Property | camelCase (no underscore) | `employees` |
| Observable | camelCase + `$` suffix | `employees$`, `isLoading$` |
| Signal | camelCase (no suffix) | `employees`, `isLoading` |

---

## Component Architecture

### Smart vs. Dumb Components

#### **Smart (Container) Components**
- **Responsibilities:**
  - Handle business logic
  - Manage state
  - Communicate with services
  - Handle routing
- **Characteristics:**
  - Fewer @Input/@Output decorators
  - Subscribes to observables
  - Uses OnPush change detection
- **Example:**

```typescript
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
  
  // Using signals (Angular 20+)
  employees = this.employeeService.getEmployees();
  
  onDelete(id: string): void {
    this.employeeService.deleteEmployee(id);
  }
  
  onEdit(employee: Employee): void {
    // Handle edit logic
  }
}
```

#### **Dumb (Presentational) Components**
- **Responsibilities:**
  - Display data
  - Emit events
  - Pure UI logic only
- **Characteristics:**
  - Heavy use of @Input/@Output
  - No service injection (except UI-only services)
  - OnPush change detection
  - Highly reusable
- **Example:**

```typescript
@Component({
  selector: 'app-employee-card',
  standalone: true,
  imports: [CommonModule],
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

### Component Lifecycle Best Practices

1. **Use Signals and Effects (Angular 20+)**
   ```typescript
   export class MyComponent {
     count = signal(0);
     doubled = computed(() => this.count() * 2);
     
     constructor() {
       effect(() => {
         console.log('Count changed:', this.count());
       });
     }
   }
   ```

2. **Cleanup Subscriptions**
   ```typescript
   export class MyComponent implements OnDestroy {
     private destroy$ = new Subject<void>();
     
     ngOnInit(): void {
       this.dataService.getData()
         .pipe(takeUntil(this.destroy$))
         .subscribe(data => this.handleData(data));
     }
     
     ngOnDestroy(): void {
       this.destroy$.next();
       this.destroy$.complete();
     }
   }
   ```

3. **Use OnPush Change Detection**
   ```typescript
   @Component({
     changeDetection: ChangeDetectionStrategy.OnPush
   })
   ```

---

## State Management

### State Management Strategy

For enterprise applications, choose the appropriate state management approach:

#### 1. **Local Component State (Simple Features)**
Use Angular Signals or RxJS BehaviorSubject for component-level state.

```typescript
export class EmployeeListComponent {
  // Using Signals
  employees = signal<Employee[]>([]);
  isLoading = signal(false);
  selectedEmployee = signal<Employee | null>(null);
  
  // Computed values
  employeeCount = computed(() => this.employees().length);
}
```

#### 2. **Service-Based State (Shared State)**
For state shared between multiple components within a feature.

```typescript
@Injectable({ providedIn: 'root' })
export class EmployeeStateService {
  // State
  private employeesState = signal<Employee[]>([]);
  private loadingState = signal(false);
  
  // Read-only exposure
  readonly employees = this.employeesState.asReadonly();
  readonly loading = this.loadingState.asReadonly();
  
  // Actions
  setEmployees(employees: Employee[]): void {
    this.employeesState.set(employees);
  }
  
  addEmployee(employee: Employee): void {
    this.employeesState.update(current => [...current, employee]);
  }
  
  removeEmployee(id: string): void {
    this.employeesState.update(current => 
      current.filter(emp => emp.id !== id)
    );
  }
}
```

#### 3. **NgRx or Signal Store (Complex State)**
For application-wide complex state with time-travel debugging needs.

```typescript
// Using @ngrx/signals
export const EmployeeStore = signalStore(
  { providedIn: 'root' },
  withState<EmployeeState>({
    employees: [],
    loading: false,
    error: null
  }),
  withComputed((store) => ({
    employeeCount: computed(() => store.employees().length)
  })),
  withMethods((store, employeeService = inject(EmployeeService)) => ({
    async loadEmployees() {
      patchState(store, { loading: true });
      try {
        const employees = await employeeService.getAll();
        patchState(store, { employees, loading: false });
      } catch (error) {
        patchState(store, { error, loading: false });
      }
    }
  }))
);
```

### State Management Decision Tree

```
Is the state needed across multiple features?
├─ NO → Use local component state (signals)
└─ YES → Is the state complex with many interactions?
    ├─ NO → Use service-based state
    └─ YES → Use NgRx or Signal Store
```

---

## Routing Strategy

### Route Configuration

#### Root Routes (`app.routes.ts`)
```typescript
export const appRoutes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component')
          .then(m => m.DashboardComponent),
        title: 'Dashboard'
      },
      {
        path: 'employees',
        loadChildren: () => import('./features/employee/employee.routes')
          .then(m => m.employeeRoutes),
        canActivate: [RoleGuard],
        data: { roles: ['ADMIN', 'HR'] }
      }
    ]
  },
  {
    path: 'auth',
    component: AuthLayoutComponent,
    loadChildren: () => import('./pages/auth/auth.routes')
      .then(m => m.authRoutes)
  },
  {
    path: '**',
    redirectTo: '/error/404'
  }
];
```

#### Feature Routes (`employee.routes.ts`)
```typescript
export const employeeRoutes: Routes = [
  {
    path: '',
    component: EmployeeListComponent,
    title: 'Employees'
  },
  {
    path: 'new',
    component: EmployeeFormComponent,
    title: 'Add Employee',
    canDeactivate: [UnsavedChangesGuard]
  },
  {
    path: ':id',
    component: EmployeeDetailComponent,
    resolve: { employee: EmployeeResolver },
    title: 'Employee Details'
  },
  {
    path: ':id/edit',
    component: EmployeeFormComponent,
    resolve: { employee: EmployeeResolver },
    title: 'Edit Employee',
    canDeactivate: [UnsavedChangesGuard]
  }
];
```

### Guards

#### Auth Guard
```typescript
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  if (authService.isAuthenticated()) {
    return true;
  }
  
  return router.createUrlTree(['/auth/login'], {
    queryParams: { returnUrl: state.url }
  });
};
```

#### Role Guard
```typescript
export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  const requiredRoles = route.data['roles'] as string[];
  const userRoles = authService.getUserRoles();
  
  const hasRole = requiredRoles.some(role => userRoles.includes(role));
  
  if (hasRole) {
    return true;
  }
  
  return router.createUrlTree(['/error/403']);
};
```

---

## Data Flow Patterns

### Service Layer Pattern

```typescript
@Injectable({ providedIn: 'root' })
export class EmployeeService {
  private http = inject(HttpClient);
  private apiUrl = inject(API_BASE_URL);
  
  getEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(`${this.apiUrl}/employees`)
      .pipe(
        map(response => this.mapToEmployees(response)),
        catchError(error => this.handleError(error))
      );
  }
  
  getEmployeeById(id: string): Observable<Employee> {
    return this.http.get<Employee>(`${this.apiUrl}/employees/${id}`)
      .pipe(
        catchError(error => this.handleError(error))
      );
  }
  
  createEmployee(employee: CreateEmployeeDto): Observable<Employee> {
    return this.http.post<Employee>(`${this.apiUrl}/employees`, employee)
      .pipe(
        catchError(error => this.handleError(error))
      );
  }
  
  private handleError(error: HttpErrorResponse): Observable<never> {
    // Handle error appropriately
    return throwError(() => new Error('Something went wrong'));
  }
  
  private mapToEmployees(data: any[]): Employee[] {
    // Transform API response to domain model
    return data.map(item => ({
      id: item.id,
      name: `${item.firstName} ${item.lastName}`,
      // ... other mappings
    }));
  }
}
```

### API Response Models

```typescript
// api-response.model.ts
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  errors?: ApiError[];
}

export interface ApiError {
  code: string;
  message: string;
  field?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
}
```

---

## Configuration Layer

### Overview

The configuration layer (`src/app/core/config`) provides centralized management of application settings, API endpoints, and constants.

### Components

#### 1. **API Configuration (`api.config.ts`)**

Defines all API endpoints in a type-safe, organized structure.

```typescript
export interface ApiEndpoints {
  readonly auth: {
    readonly login: string;
    readonly logout: string;
    readonly register: string;
    readonly refreshToken: string;
    // ... more auth endpoints
  };
  // Add more feature-specific endpoints as needed
}
```

**Features:**
- Type-safe endpoint definitions
- Factory functions for dynamic URL generation
- Centralized API versioning
- Easy to maintain and extend

**Usage:**
```typescript
export class AuthService {
  private config = inject(AppConfigService);
  
  login(credentials: LoginCredentials): Observable<AuthResponse> {
    const url = this.config.api.endpoints.auth.login;
    return this.baseHttp.post<AuthResponse>(url, credentials);
  }
}
```

#### 2. **App Config Service (`app-config.service.ts`)**

Runtime configuration service providing unified access to all application settings.

**Features:**
- Environment-based configuration
- API endpoints access
- Application constants
- Feature flag checking
- Type-safe configuration retrieval

**Usage:**
```typescript
export class MyComponent {
  private appConfig = inject(AppConfigService);
  
  ngOnInit(): void {
    const loginUrl = this.appConfig.api.endpoints.auth.login;
    const timeout = this.appConfig.apiTimeout;
    const pageSize = this.appConfig.defaultPageSize;
    
    if (this.appConfig.isFeatureEnabled('analytics')) {
      // Enable analytics
    }
  }
}
```

#### 3. **Constants (`constants.ts`)**

Application-wide constants organized by domain.

**Categories:**
- API configuration (timeout, retry, pagination)
- Storage keys
- Date formats
- HTTP status codes
- Authentication config
- Validation patterns
- UI configuration
- File upload settings
- Application routes
- User roles and statuses

**Usage:**
```typescript
import { STORAGE_KEYS, VALIDATION, USER_ROLES } from '@core/config';

// Store token
localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, token);

// Validate email
const isValid = VALIDATION.EMAIL_PATTERN.test(email);

// Check role
if (user.role === USER_ROLES.ADMIN) {
  // Admin logic
}
```

### Best Practices

1. **Never hardcode URLs or magic values**
   ```typescript
   // Bad
   const url = 'http://localhost:3000/api/v1/employees';
   
   // Good
   const url = this.appConfig.api.endpoints.employees.base;
   ```

2. **Use type-safe constants**
   ```typescript
   // Bad
   if (status === 200) { }
   
   // Good
   import { HTTP_STATUS } from '@core/config';
   if (status === HTTP_STATUS.OK) { }
   ```

3. **Leverage factory functions for dynamic URLs**
   ```typescript
   const employeeUrl = this.appConfig.getEndpoint('employees.byId', employeeId);
   ```

---

## HTTP Communication Layer

### Overview

The HTTP layer (`src/app/core/http`) provides a robust, type-safe wrapper around Angular's HttpClient with built-in error handling, retry logic, and response transformation.

### Components

#### 1. **Base HTTP Service (`base-http.service.ts`)**

A comprehensive HTTP client wrapper with enterprise features.

**Features:**
- Automatic timeout handling
- Retry logic for failed requests (configurable)
- Type-safe request/response handling
- Consistent error handling
- Request/response logging in development
- Pagination support
- Search and filter capabilities

**Available Methods:**

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

**Usage Example:**

```typescript
@Injectable({ providedIn: 'root' })
export class DataService {
  private baseHttp = inject(BaseHttpService);
  private config = inject(AppConfigService);
  
  // Simple GET request
  getItems<T>(): Observable<T[]> {
    return this.baseHttp.getList<T>('items');
  }
  
  // GET with pagination
  getItemsPaginated<T>(page: number, pageSize: number): Observable<PaginatedResponse<T>> {
    return this.baseHttp.getPaginated<T>(
      'items',
      { page, pageSize, sortBy: 'name', sortOrder: 'asc' }
    );
  }
  
  // Search with filters
  searchItems<T>(searchTerm: string, filters: any): Observable<PaginatedResponse<T>> {
    return this.baseHttp.search<T>(
      'items/search',
      { search: searchTerm, filters, page: 1, pageSize: 20 }
    );
  }
  
  // POST request
  createItem<T>(data: any): Observable<T> {
    return this.baseHttp.post<T>('items', data);
  }
  
  // PUT request
  updateItem<T>(id: string, data: any): Observable<T> {
    return this.baseHttp.put<T>(`items/${id}`, data);
  }
  
  // PATCH request (partial update)
  patchItem<T>(id: string, changes: Partial<T>): Observable<T> {
    return this.baseHttp.patch<T>(`items/${id}`, changes);
  }
  
  // DELETE request
  deleteItem(id: string): Observable<void> {
    return this.baseHttp.delete(`items/${id}`);
  }
}
```

#### 2. **API Response Models (`api-response.model.ts`)**

Standardized TypeScript interfaces for API responses.

**Response Types:**

```typescript
// Standard response wrapper
interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp?: string;
}

// Error response
interface ApiErrorResponse {
  success: false;
  error: ApiError;
  errors?: ApiError[];
  message: string;
  statusCode: number;
  timestamp?: string;
  path?: string;
}

// Paginated response
interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: PaginationMeta;
  message?: string;
}

// List response (non-paginated)
interface ListResponse<T> {
  success: boolean;
  data: T[];
  count: number;
  message?: string;
}

// Batch operation response
interface BatchOperationResponse {
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

**Type Guards:**

```typescript
// Check if response is an error
if (isApiErrorResponse(response)) {
  console.error(response.error.message);
}

// Check if response is paginated
if (isPaginatedResponse(response)) {
  console.log(`Total pages: ${response.pagination.totalPages}`);
}

// Check if error is validation error
if (isValidationErrorResponse(errorResponse)) {
  errorResponse.errors.forEach(err => {
    console.log(`${err.field}: ${err.message}`);
  });
}
```

### URL Handling

The `BaseHttpService` intelligently handles URL construction:

1. **Relative URLs:** Automatically prepends base URL and version
   ```typescript
   // Input: 'items'
   // Output: 'http://localhost:3000/api/v1/items'
   this.baseHttp.get<Item[]>('items');
   ```

2. **Absolute URLs:** Used as-is
   ```typescript
   // Used directly without modification
   this.baseHttp.get<Data>('https://external-api.com/data');
   ```

3. **Using Config Service (recommended for auth endpoints):**
   ```typescript
   // Recommended approach for configured endpoints
   this.baseHttp.post<AuthResponse>(
     this.config.api.endpoints.auth.login,
     credentials
   );
   ```

### Error Handling

The HTTP layer provides comprehensive error handling:

1. **Automatic Retry:** Failed requests are retried automatically (5xx errors and network issues)
2. **Timeout Handling:** Requests timeout after configured duration (default: 30s)
3. **Consistent Error Format:** All errors are transformed to `ApiErrorResponse`
4. **Development Logging:** Detailed request/response logging in development mode

```typescript
this.dataService.getItems()
  .subscribe({
    next: (items) => {
      // Handle success
    },
    error: (error: ApiErrorResponse) => {
      // Error is always in consistent format
      console.error(error.message);
      console.error(error.statusCode);
    }
  });
```

### Best Practices

1. **Always use BaseHttpService instead of HttpClient directly**
   ```typescript
   // Bad
   private http = inject(HttpClient);
   
   // Good
   private baseHttp = inject(BaseHttpService);
   ```

2. **Use type parameters for type safety**
   ```typescript
   // Bad
   getEmployees(): Observable<any>
   
   // Good
   getEmployees(): Observable<Employee[]>
   ```

3. **Leverage specialized methods**
   ```typescript
   // For paginated data
   this.baseHttp.getPaginated<Item>(url, { page: 1, pageSize: 20 });
   
   // For simple lists
   this.baseHttp.getList<Item>(url);
   ```

4. **Use AppConfigService for configured endpoints**
   ```typescript
   private config = inject(AppConfigService);
   private baseHttp = inject(BaseHttpService);
   
   login(credentials: LoginCredentials): Observable<AuthResponse> {
     return this.baseHttp.post<AuthResponse>(
       this.config.api.endpoints.auth.login,
       credentials
     );
   }
   ```

5. **Handle errors gracefully**
   ```typescript
   this.baseHttp.get<Item>(url).pipe(
     catchError((error: ApiErrorResponse) => {
       // Handle specific error cases
       if (error.statusCode === HTTP_STATUS.NOT_FOUND) {
         this.router.navigate(['/not-found']);
       }
       return throwError(() => error);
     })
   );
   ```

---

## Error Handling and Notification System

### Overview

The application implements a comprehensive error handling and notification system that provides:

- **Global Error Handler:** Catches all unhandled JavaScript errors
- **HTTP Error Interceptor:** Handles API errors with user-friendly notifications
- **Structured Error Logging:** Detailed error logging with context
- **Toast Notifications:** User-friendly feedback using PrimeNG Toast
- **Type-Safe Error Models:** Strongly typed error classes for different error scenarios

### Error Layer Architecture

The error handling system (`src/app/core/errors`) consists of:

#### 1. **Error Models (`error.model.ts`)**

Defines typed error classes and severity levels:

```typescript
// Error severity levels
enum ErrorSeverity {
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high',
    CRITICAL = 'critical'
}

// Error types
enum ErrorType {
    NETWORK = 'network',
    HTTP = 'http',
    VALIDATION = 'validation',
    AUTHENTICATION = 'authentication',
    AUTHORIZATION = 'authorization',
    BUSINESS = 'business',
    RUNTIME = 'runtime',
    UNKNOWN = 'unknown'
}

// Base error class
class ApplicationError extends Error {
    readonly type: ErrorType;
    readonly severity: ErrorSeverity;
    readonly timestamp: Date;
    readonly code?: string;
    readonly context?: Record<string, unknown>;
}

// Specialized error classes
class HttpError extends ApplicationError { }
class ValidationError extends ApplicationError { }
```

**Features:**
- Type-safe error classification
- Severity-based error handling
- Contextual error information
- Serializable error objects

#### 2. **Error Logger Service (`error-logger.service.ts`)**

Provides structured error logging with server integration support:

```typescript
@Injectable({ providedIn: 'root' })
export class ErrorLoggerService {
    // Log various error types
    logError(error: Error | ApplicationError): void
    logHttpError(error: unknown, statusCode: number, url: string, method: string): void
    logValidationError(message: string, field?: string, context?: Record<string, unknown>): void
    logNetworkError(message: string, context?: Record<string, unknown>): void
    logBusinessError(message: string, context?: Record<string, unknown>): void
    logAuthenticationError(message: string, context?: Record<string, unknown>): void
    logAuthorizationError(message: string, context?: Record<string, unknown>): void
}
```

**Features:**
- Structured error logging with context
- Environment-aware logging (production vs. development)
- Severity-based console logging
- Ready for remote logging integration (Sentry, LogRocket, etc.)
- Automatic stack trace inclusion in development

#### 3. **Global Error Handler (`global-error-handler.ts`)**

Catches all unhandled errors in the application:

```typescript
@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
    handleError(error: Error | ApplicationError | unknown): void {
        // Normalizes errors
        // Logs with detailed information
        // Shows user notifications
        // Handles critical errors
        // Prevents application crashes
    }
}
```

**Features:**
- Catches all unhandled JavaScript errors
- Categorizes errors automatically
- Shows user-friendly notifications
- Logs errors with full context
- Handles critical errors with recovery options
- Re-throws errors in development for debugging

**Registration:**
```typescript
// app.config.ts
export const appConfig: ApplicationConfig = {
    providers: [
        { provide: ErrorHandler, useClass: GlobalErrorHandler },
        // ... other providers
    ]
};
```

### Notification System

#### **Notification Service (`notification.service.ts`)**

Provides a simplified, type-safe API for showing toast notifications:

```typescript
@Injectable({ providedIn: 'root' })
export class NotificationService {
    // Basic notifications
    showSuccess(message: string, title?: string, options?: NotificationOptions): void
    showInfo(message: string, title?: string, options?: NotificationOptions): void
    showWarning(message: string, title?: string, options?: NotificationOptions): void
    showError(message: string, title?: string, options?: NotificationOptions): void
    
    // Specialized notifications
    showValidationErrors(errors: Record<string, string[]> | string[], title?: string): void
    showOperationSuccess(operation: 'created' | 'updated' | 'deleted' | 'saved', entity?: string): void
    showOperationError(operation: 'create' | 'update' | 'delete' | 'save' | 'load', entity?: string): void
    showNetworkError(message?: string): void
    showAuthenticationError(message?: string): void
    showAuthorizationError(message?: string): void
    
    // Advanced features
    showLoading(message?: string, title?: string): () => void
    showMultiple(notifications: Notification[]): void
    clearAll(): void
    clearByKey(key: string): void
}
```

**Features:**
- Type-safe notification API
- Built-in message templates for common scenarios
- Configurable duration and behavior
- Support for sticky notifications
- Loading indicators with cleanup
- Multiple notification management

**Setup:**

1. **Register MessageService** in `app.config.ts`:
```typescript
export const appConfig: ApplicationConfig = {
    providers: [
        MessageService,
        // ... other providers
    ]
};
```

2. **Add Toast component** to `app.component.ts`:
```typescript
@Component({
    selector: 'app-root',
    imports: [RouterModule, Toast],
    template: `
        <p-toast position="top-right" />
        <router-outlet />
    `
})
export class AppComponent {}
```

### Enhanced Logger Service

The logger service has been enhanced with structured logging capabilities:

```typescript
@Injectable({ providedIn: 'root' })
export class LoggerService {
    // Standard logging
    debug(message: string, ...args: unknown[]): void
    info(message: string, ...args: unknown[]): void
    warn(message: string, ...args: unknown[]): void
    error(message: string, ...args: unknown[]): void
    
    // Structured logging with context
    withContext(context: LogContext): LoggerService
    
    // Grouping and organization
    group(label: string, callback: () => void): void
    groupCollapsed(label: string, callback: () => void): void
    table(data: unknown, columns?: string[]): void
    
    // Performance measurement
    time(label: string): () => void
    measureAsync<T>(label: string, operation: () => Promise<T>): Promise<T>
    measure<T>(label: string, operation: () => T): T
    
    // Debugging
    trace(message: string, ...args: unknown[]): void
    clear(): void
}
```

**Usage Examples:**

```typescript
// Simple logging
this.logger.info('User logged in');

// Logging with context
this.logger
    .withContext({ component: 'AuthComponent', action: 'login' })
    .info('Login attempt', { email: user.email });

// Performance measurement
await this.logger.measureAsync('Fetch Users', async () => {
    return await this.userService.getUsers();
});

// Grouped logs
this.logger.group('API Call', () => {
    this.logger.info('Request sent');
    this.logger.info('Response received');
});
```

### HTTP Error Handling Integration

The error interceptor integrates with the notification system:

```typescript
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    const notificationService = inject(NotificationService);
    const errorLogger = inject(ErrorLoggerService);
    
    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            // Log error
            errorLogger.logHttpError(error, error.status, req.url, req.method);
            
            // Show appropriate notification
            if (error.status === 401) {
                notificationService.showAuthenticationError();
            } else if (error.status === 403) {
                notificationService.showAuthorizationError();
            } else if (error.status === 422) {
                notificationService.showValidationErrors(error.error.errors);
            } else if (error.status >= 500) {
                notificationService.showError('Server error occurred');
            }
            
            return throwError(() => error);
        })
    );
};
```

### Best Practices

#### 1. **Use Appropriate Error Types**

```typescript
// For HTTP errors
throw new HttpError('Not found', 404, url, 'GET');

// For validation errors
throw new ValidationError('Invalid email', { field: 'email' });

// For business logic errors
this.errorLogger.logBusinessError('Insufficient balance', { 
    userId: user.id, 
    balance: user.balance 
});
```

#### 2. **Provide User-Friendly Messages**

```typescript
// Bad: Technical message
this.notificationService.showError('TypeError: Cannot read property x of undefined');

// Good: User-friendly message
this.notificationService.showError('Unable to load data. Please try again.');
```

#### 3. **Log with Context**

```typescript
this.logger
    .withContext({
        component: 'EmployeeService',
        action: 'createEmployee',
        userId: currentUser.id
    })
    .error('Failed to create employee', { error, employeeData });
```

#### 4. **Handle Errors Gracefully in Components**

```typescript
export class EmployeeListComponent {
    private notificationService = inject(NotificationService);
    
    loadEmployees(): void {
        this.employeeService.getEmployees()
            .subscribe({
                next: (employees) => {
                    this.employees = employees;
                },
                error: (error) => {
                    // Error already logged by interceptor
                    // Optionally handle specific error cases
                    this.employees = [];
                }
            });
    }
    
    deleteEmployee(id: string): void {
        this.employeeService.delete(id)
            .subscribe({
                next: () => {
                    this.notificationService.showOperationSuccess('deleted', 'Employee');
                    this.loadEmployees();
                },
                error: () => {
                    // Error notification already shown by interceptor
                }
            });
    }
}
```

#### 5. **Use Loading Indicators**

```typescript
async performLongOperation(): Promise<void> {
    const clearLoading = this.notificationService.showLoading('Processing...');
    
    try {
        await this.service.performOperation();
        this.notificationService.showSuccess('Operation completed');
    } catch (error) {
        // Error handling
    } finally {
        clearLoading();
    }
}
```

#### 6. **Validation Error Handling**

```typescript
submitForm(): void {
    this.formService.submit(this.formData)
        .subscribe({
            next: () => {
                this.notificationService.showOperationSuccess('saved', 'Form');
            },
            error: (error) => {
                if (error.status === 422 && error.error.errors) {
                    this.notificationService.showValidationErrors(error.error.errors);
                }
            }
        });
}
```

### Error Handling Flow

```
1. Error Occurs
   ↓
2. HTTP Error Interceptor (for API errors)
   - Logs error via ErrorLoggerService
   - Shows appropriate notification
   - Navigates if needed (401, 403)
   ↓
3. Global Error Handler (for unhandled errors)
   - Normalizes error
   - Logs via ErrorLoggerService
   - Shows user notification
   - Handles critical errors
   ↓
4. ErrorLoggerService
   - Logs to console (development)
   - Sends to server (production, for critical errors)
   - Includes context and stack trace
   ↓
5. NotificationService
   - Shows toast notification
   - User-friendly message
   - Appropriate severity
```

### Configuration

**Development Environment:**
- All errors logged to console
- Stack traces included
- Errors re-thrown for debugging
- Verbose logging

**Production Environment:**
- Only critical errors logged to server
- User-friendly messages only
- No stack traces exposed
- Minimal logging

### Testing Error Handling

```typescript
describe('ErrorHandling', () => {
    it('should handle HTTP errors', () => {
        const notificationService = TestBed.inject(NotificationService);
        spyOn(notificationService, 'showError');
        
        // Trigger error
        httpMock.expectOne('/api/data').error(new ErrorEvent('Network error'));
        
        expect(notificationService.showError).toHaveBeenCalledWith(
            jasmine.stringContaining('Network')
        );
    });
    
    it('should log errors with context', () => {
        const errorLogger = TestBed.inject(ErrorLoggerService);
        spyOn(errorLogger, 'logError');
        
        const error = new ApplicationError('Test error', ErrorType.BUSINESS);
        errorLogger.logError(error);
        
        expect(errorLogger.logError).toHaveBeenCalledWith(error);
    });
});
```

---

## Code Organization Best Practices

### 1. **Barrel Exports (Index Files)**

Use index files to simplify imports:

```typescript
// features/employee/index.ts
export * from './components/employee-list/employee-list.component';
export * from './components/employee-detail/employee-detail.component';
export * from './services/employee.service';
export * from './models/employee.model';

// Usage
import { EmployeeListComponent, Employee, EmployeeService } from '@/features/employee';
```

### 2. **Path Aliases**

Configure in `tsconfig.json`:
```json
{
  "compilerOptions": {
    "baseUrl": "./",
    "paths": {
      "@/*": ["src/app/*"],
      "@core/*": ["src/app/core/*"],
      "@shared/*": ["src/app/shared/*"],
      "@features/*": ["src/app/features/*"],
      "@environments/*": ["src/environments/*"]
    }
  }
}
```

### 3. **Dependency Injection**

Use `inject()` function (Angular 14+):
```typescript
export class MyComponent {
  private employeeService = inject(EmployeeService);
  private router = inject(Router);
  
  // Instead of constructor injection
}
```

### 4. **Type Safety**

```typescript
// Good: Strict typing
interface Employee {
  id: string;
  name: string;
  email: string;
  hireDate: Date;
}

// Bad: Using 'any'
let employee: any;

// Good: Using 'unknown' when type is truly unknown
function processData(data: unknown): void {
  if (typeof data === 'string') {
    // Type guard
    console.log(data.toUpperCase());
  }
}
```

---

## Testing Strategy

### Unit Testing

#### Component Testing
```typescript
describe('EmployeeListComponent', () => {
  let component: EmployeeListComponent;
  let mockEmployeeService: jasmine.SpyObj<EmployeeService>;
  
  beforeEach(async () => {
    mockEmployeeService = jasmine.createSpyObj('EmployeeService', ['getEmployees']);
    
    await TestBed.configureTestingModule({
      imports: [EmployeeListComponent],
      providers: [
        { provide: EmployeeService, useValue: mockEmployeeService }
      ]
    }).compileComponents();
    
    const fixture = TestBed.createComponent(EmployeeListComponent);
    component = fixture.componentInstance;
  });
  
  it('should load employees on init', () => {
    const mockEmployees = [{ id: '1', name: 'John Doe' }];
    mockEmployeeService.getEmployees.and.returnValue(of(mockEmployees));
    
    component.ngOnInit();
    
    expect(component.employees()).toEqual(mockEmployees);
  });
});
```

#### Service Testing
```typescript
describe('EmployeeService', () => {
  let service: EmployeeService;
  let httpMock: HttpTestingController;
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [EmployeeService]
    });
    
    service = TestBed.inject(EmployeeService);
    httpMock = TestBed.inject(HttpTestingController);
  });
  
  afterEach(() => {
    httpMock.verify();
  });
  
  it('should fetch employees', () => {
    const mockEmployees = [{ id: '1', name: 'John Doe' }];
    
    service.getEmployees().subscribe(employees => {
      expect(employees).toEqual(mockEmployees);
    });
    
    const req = httpMock.expectOne('/api/employees');
    expect(req.request.method).toBe('GET');
    req.flush(mockEmployees);
  });
});
```

### Integration Testing

Use Cypress or Playwright for E2E testing:

```typescript
// cypress/e2e/employee-list.cy.ts
describe('Employee List', () => {
  beforeEach(() => {
    cy.visit('/employees');
  });
  
  it('should display list of employees', () => {
    cy.get('.employee-card').should('have.length.greaterThan', 0);
  });
  
  it('should navigate to employee detail on click', () => {
    cy.get('.employee-card').first().click();
    cy.url().should('include', '/employees/');
  });
});
```

---

## Performance Optimization

### 1. **Lazy Loading**
```typescript
// Lazy load feature modules
{
  path: 'employees',
  loadChildren: () => import('./features/employee/employee.routes')
}
```

### 2. **OnPush Change Detection**
```typescript
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})
```

### 3. **TrackBy Functions**
```typescript
@Component({
  template: `
    @for (item of items(); track trackById(i, item)) {
      <div>{{ item.name }}</div>
    }
  `
})
export class MyComponent {
  trackById(index: number, item: Employee): string {
    return item.id;
  }
}
```

### 4. **Virtual Scrolling**
```typescript
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

@Component({
  template: `
    <cdk-virtual-scroll-viewport itemSize="50" class="viewport">
      <div *cdkVirtualFor="let item of items">{{ item.name }}</div>
    </cdk-virtual-scroll-viewport>
  `
})
```

### 5. **Image Optimization**
```typescript
<img [ngSrc]="employee.photo" width="200" height="200" priority />
```

### 6. **Preloading Strategy**
```typescript
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      appRoutes,
      withPreloading(PreloadAllModules)
    )
  ]
};
```

---

## Security Considerations

### 1. **Authentication & Authorization**

```typescript
// Store tokens securely
@Injectable({ providedIn: 'root' })
export class TokenService {
  private readonly TOKEN_KEY = 'auth_token';
  
  setToken(token: string): void {
    // Use httpOnly cookies in production
    sessionStorage.setItem(this.TOKEN_KEY, token);
  }
  
  getToken(): string | null {
    return sessionStorage.getItem(this.TOKEN_KEY);
  }
}
```

### 2. **HTTP Interceptor**

```typescript
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);
  const token = tokenService.getToken();
  
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
  
  return next(req);
};
```

### 3. **Sanitization**

```typescript
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Injectable({ providedIn: 'root' })
export class SafeHtmlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}
  
  transform(value: string): SafeHtml {
    return this.sanitizer.sanitize(SecurityContext.HTML, value);
  }
}
```

### 4. **CSRF Protection**

Enable CSRF tokens in Angular:
```typescript
provideHttpClient(
  withInterceptorsFromDi(),
  withXsrfConfiguration({
    cookieName: 'XSRF-TOKEN',
    headerName: 'X-XSRF-TOKEN'
  })
)
```

---

## Scalability Guidelines

### 1. **Module Boundaries**
- Keep features independent
- Avoid circular dependencies
- Use dependency injection

### 2. **Code Splitting**
- Lazy load routes
- Lazy load heavy libraries
- Use dynamic imports

### 3. **Performance Budgets**
```json
// angular.json
{
  "budgets": [
    {
      "type": "initial",
      "maximumWarning": "500kb",
      "maximumError": "1mb"
    },
    {
      "type": "anyComponentStyle",
      "maximumWarning": "2kb",
      "maximumError": "4kb"
    }
  ]
}
```

### 4. **Monitoring**
- Implement error tracking (Sentry, LogRocket)
- Add performance monitoring
- Track Core Web Vitals

### 5. **Documentation**
- Document complex logic
- Maintain architecture decision records (ADRs)
- Keep API documentation updated

---

## Conclusion

This enterprise architecture provides:
- ✅ **Scalability** through modular design
- ✅ **Maintainability** through clear separation of concerns
- ✅ **Performance** through lazy loading and optimization
- ✅ **Type Safety** through strict TypeScript
- ✅ **Testability** through dependency injection and clean architecture
- ✅ **Security** through best practices and interceptors

By following these guidelines, the HRM frontend application will remain maintainable, scalable, and performant as it grows.

---

**Document Version:** 1.2  
**Last Updated:** November 2025  
**Maintained By:** Frontend Architecture Team

---

## Changelog

### Version 1.2 (November 2025)
- **Added Error Handling and Notification System**
  - Comprehensive error handling layer with typed error models
  - Global error handler for unhandled JavaScript errors
  - Error logger service with structured logging
  - Notification service with PrimeNG Toast integration
  - Enhanced logger service with context and performance measurement
  - Updated HTTP error interceptor with notification integration
  - Added error handling best practices and examples
- Updated project structure to include errors sub-layer in core
- Enhanced core services with notification.service.ts
- Added setup instructions for Toast component

### Version 1.1 (November 2025)
- Added Configuration Layer section with AppConfigService, API config, and constants
- Added HTTP Communication Layer section with BaseHttpService and API response models
- Updated project structure to include config and http sub-layers in core
- Enhanced Layer Architecture section with sub-layer descriptions
- Added comprehensive examples and best practices for config and HTTP layers
- Included auth-related endpoints configuration (ready to extend with business features)

