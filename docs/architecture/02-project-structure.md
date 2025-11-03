# Project Structure

**Document:** Project Structure & Folder Organization  
**Version:** Angular 20  
**Last Updated:** November 2025

---

## Table of Contents

1. [Overview](#overview)
2. [Complete Project Structure](#complete-project-structure)
3. [Folder Organization](#folder-organization)
4. [Feature Module Structure](#feature-module-structure)
5. [Index Files (Barrel Exports)](#index-files-barrel-exports)
6. [Related Documentation](#related-documentation)

---

## Overview

The HRM Frontend follows a **feature-based modular design** that organizes code by business domains rather than technical layers. This structure promotes:

- **Scalability** - Easy to add new features
- **Maintainability** - Clear boundaries between modules
- **Team Collaboration** - Multiple developers can work on different features independently
- **Code Discovery** - Intuitive file organization

---

## Complete Project Structure

```
hrm-frontend/
├── docs/                           # Documentation
│   ├── README.md                   # Documentation hub
│   ├── architecture/               # Architecture documentation
│   ├── core/                       # Core systems documentation
│   ├── best-practices/             # Best practices guides
│   ├── architecture-diagram.md     # Visual diagrams
│   └── scalability.md              # Scalability guidelines
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

## Folder Organization

### Core Layer (`src/app/core`)

**Purpose:** Singleton services, application-wide configurations, guards, interceptors

**Rules:**
- Services provided in root (`providedIn: 'root'`)
- Should be imported/used only once
- No UI components
- Organized by functionality (auth, config, http, errors, services, interceptors)

**Example:**
```typescript
// core/services/logger.service.ts
@Injectable({ providedIn: 'root' })
export class LoggerService {
  info(message: string): void {
    console.log(`[INFO] ${message}`);
  }
}
```

### Shared Layer (`src/app/shared`)

**Purpose:** Reusable components, directives, pipes, and utilities

**Rules:**
- Stateless, presentational components
- Can be used across multiple features
- No business logic
- Heavy use of @Input/@Output

**Example:**
```typescript
// shared/components/ui/button/button.component.ts
@Component({
  selector: 'app-button',
  standalone: true,
  template: `
    <button [class]="classes" (click)="onClick.emit()">
      <ng-content></ng-content>
    </button>
  `
})
export class ButtonComponent {
  @Input() variant: 'primary' | 'secondary' = 'primary';
  @Output() onClick = new EventEmitter<void>();
  
  get classes(): string {
    return `btn btn-${this.variant}`;
  }
}
```

### Feature Layer (`src/app/features`)

**Purpose:** Business domains and feature modules

**Rules:**
- Encapsulates specific business functionality
- Contains smart (container) and dumb (presentational) components
- Feature-specific services and state management
- Lazy-loaded via routing

**Example:**
```typescript
// features/employee/employee.routes.ts
export const employeeRoutes: Routes = [
  {
    path: '',
    component: EmployeeListComponent,
    title: 'Employees'
  },
  {
    path: ':id',
    component: EmployeeDetailComponent,
    title: 'Employee Details'
  }
];
```

### Layout Layer (`src/app/layout`)

**Purpose:** Application shell and layout components

**Rules:**
- Defines the overall structure (header, footer, sidebar)
- Contains layout-switching logic
- Theme and responsive behavior

### Pages Layer (`src/app/pages`)

**Purpose:** Top-level route components

**Rules:**
- Acts as entry points for major sections
- Usually wraps feature components
- Minimal logic, mostly composition

---

## Feature Module Structure

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

## Index Files (Barrel Exports)

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

**Benefits:**
- Cleaner imports
- Single point of export
- Easy to refactor internal structure

---

## Related Documentation

- **Previous:** [Overview & Principles](01-overview.md) - Understand core principles
- **Next:** [Layer Architecture](03-layer-architecture.md) - Deep dive into architectural layers
- **See Also:** [Naming Conventions](04-naming-conventions.md) - File naming standards
- **Visual Guide:** [Architecture Diagrams](../architecture-diagram.md) - Visual representation

---

**Document Version:** 2.0  
**Last Updated:** November 2025  
**Maintained By:** Frontend Architecture Team

