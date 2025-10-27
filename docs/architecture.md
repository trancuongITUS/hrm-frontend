# Enterprise Angular Architecture Guide

**Version:** Angular 20  
**Project Type:** HRM Frontend  
**Architecture Pattern:** Feature-Based Modular Design with Standalone Components  
**Last Updated:** October 2025

---

## Table of Contents

1. [Overview](#overview) (Lines 30-40)
2. [Architectural Principles](#architectural-principles) (Lines 43-68)
3. [Project Structure](#project-structure) (Lines 71-311)
4. [Layer Architecture](#layer-architecture) (Lines 315-359)
5. [Folder Organization](#folder-organization) (Lines 362-399)
6. [Naming Conventions](#naming-conventions) (Lines 403-447)
7. [Component Architecture](#component-architecture) (Lines 450-574)
8. [State Management](#state-management) (Lines 577-667)
9. [Routing Strategy](#routing-strategy) (Lines 670-776)
10. [Data Flow Patterns](#data-flow-patterns) (Lines 779-854)
11. [Code Organization Best Practices](#code-organization-best-practices) (Lines 857-926)
12. [Testing Strategy](#testing-strategy) (Lines 929-1018)
13. [Performance Optimization](#performance-optimization) (Lines 1021-1084)
14. [Security Considerations](#security-considerations) (Lines 1087-1155)
15. [Scalability Guidelines](#scalability-guidelines) (Lines 1158-1198)

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
│   │   │   │   │   └── role.guard.ts
│   │   │   │   ├── interceptors/
│   │   │   │   │   ├── auth.interceptor.ts
│   │   │   │   │   ├── error.interceptor.ts
│   │   │   │   │   └── loading.interceptor.ts
│   │   │   │   ├── services/
│   │   │   │   │   ├── auth.service.ts
│   │   │   │   │   ├── token.service.ts
│   │   │   │   │   └── session.service.ts
│   │   │   │   └── models/
│   │   │   │       ├── user.model.ts
│   │   │   │       └── auth.model.ts
│   │   │   │
│   │   │   ├── config/
│   │   │   │   ├── app.config.ts
│   │   │   │   ├── environment.config.ts
│   │   │   │   └── api.config.ts
│   │   │   │
│   │   │   ├── services/
│   │   │   │   ├── logger.service.ts
│   │   │   │   ├── notification.service.ts
│   │   │   │   ├── storage.service.ts
│   │   │   │   └── error-handler.service.ts
│   │   │   │
│   │   │   └── utils/
│   │   │       ├── date.util.ts
│   │   │       ├── validation.util.ts
│   │   │       └── string.util.ts
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
- **Examples:** AuthService, LoggerService, HTTP Interceptors

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

**Document Version:** 1.0  
**Last Updated:** October 2025  
**Maintained By:** Frontend Architecture Team

