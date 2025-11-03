# Naming Conventions

**Document:** Naming Conventions & Standards  
**Version:** Angular 20  
**Last Updated:** November 2025

---

## Table of Contents

1. [Overview](#overview)
2. [File Naming](#file-naming)
3. [Class and Type Naming](#class-and-type-naming)
4. [Variable and Function Naming](#variable-and-function-naming)
5. [Folder Naming](#folder-naming)
6. [Constants and Enums](#constants-and-enums)
7. [Observable and Signal Naming](#observable-and-signal-naming)
8. [Related Documentation](#related-documentation)

---

## Overview

Consistent naming conventions improve code readability, maintainability, and team collaboration. This document defines the naming standards for the HRM Frontend application.

### General Principles

- **Be Descriptive:** Names should clearly indicate purpose
- **Be Consistent:** Follow the same pattern throughout the codebase
- **Be Concise:** Avoid unnecessarily long names
- **Use English:** All names must be in English

---

## File Naming

All files use **kebab-case** (lowercase with hyphens).

### File Type Patterns

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

### Examples

```
✅ Good
employee-list.component.ts
auth.service.ts
time-ago.pipe.ts
auto-focus.directive.ts

❌ Bad
EmployeeList.component.ts
authService.ts
TimeAgoPipe.ts
auto_focus.directive.ts
```

### Companion Files

Component files should follow this pattern:

```
employee-list/
├── employee-list.component.ts      # Component logic
├── employee-list.component.html    # Template
├── employee-list.component.scss    # Styles
└── employee-list.component.spec.ts # Tests
```

---

## Class and Type Naming

Classes and types use **PascalCase** with appropriate suffixes.

### Class Naming

| Type | Convention | Example |
|------|------------|---------|
| Component Class | PascalCase + `Component` | `EmployeeListComponent` |
| Service Class | PascalCase + `Service` | `EmployeeService` |
| Guard Class | PascalCase + `Guard` | `AuthGuard` |
| Pipe Class | PascalCase + `Pipe` | `TimeAgoPipe` |
| Directive Class | PascalCase + `Directive` | `AutoFocusDirective` |
| Interceptor | PascalCase + `Interceptor` | `AuthInterceptor` |
| Resolver | PascalCase + `Resolver` | `EmployeeResolver` |

### Interface and Type Naming

| Type | Convention | Example |
|------|------------|---------|
| Interface | PascalCase (no prefix) | `Employee`, `UserProfile` |
| Type Alias | PascalCase | `EmployeeStatus`, `UserRole` |
| Enum | PascalCase | `UserRole`, `HttpStatus` |

### Examples

```typescript
// ✅ Good: Clear, descriptive names with appropriate suffixes
export class EmployeeListComponent { }
export class EmployeeService { }
export class AuthGuard implements CanActivate { }
export class TimeAgoPipe implements PipeTransform { }

export interface Employee {
  id: string;
  name: string;
}

export type EmployeeStatus = 'active' | 'inactive' | 'terminated';

export enum UserRole {
  ADMIN = 'admin',
  HR = 'hr',
  EMPLOYEE = 'employee'
}

// ❌ Bad: Missing suffixes or inconsistent naming
export class EmployeeList { } // Missing 'Component'
export class Employee_Service { } // Underscore instead of camelCase
export interface IEmployee { } // Hungarian notation prefix
export type employeeStatus = 'active' | 'inactive'; // Should be PascalCase
```

### Interface vs Type

**Use Interface when:**
- Defining object shapes
- Need to extend or merge declarations
- Defining class contracts

```typescript
// ✅ Good: Interface for object shapes
export interface Employee {
  id: string;
  name: string;
  email: string;
}

export interface Manager extends Employee {
  teamSize: number;
}
```

**Use Type Alias when:**
- Creating union types
- Creating intersection types
- Aliasing primitive types

```typescript
// ✅ Good: Type for unions and intersections
export type EmployeeStatus = 'active' | 'inactive' | 'terminated';
export type Result<T> = Success<T> | Error;
export type EmployeeWithMetadata = Employee & { metadata: Metadata };
```

---

## Variable and Function Naming

Variables and functions use **camelCase**.

### Variable Naming

| Type | Convention | Example |
|------|------------|---------|
| Variable | camelCase | `employeeList`, `isLoading` |
| Boolean | is/has/can + camelCase | `isVisible`, `hasPermission`, `canEdit` |
| Private Property | camelCase (no underscore) | `employees` |
| Observable | camelCase + `$` suffix | `employees$`, `isLoading$` |
| Signal | camelCase (no suffix) | `employees`, `isLoading` |

### Function Naming

| Type | Convention | Example |
|------|------------|---------|
| Function | camelCase | `loadEmployees()`, `calculateSalary()` |
| Event Handler | `on` + PascalCase | `onClick()`, `onSubmit()` |
| Boolean Function | is/has/can + camelCase | `isValid()`, `hasAccess()` |
| Private Method | camelCase (no underscore) | `handleError()` |

### Examples

```typescript
// ✅ Good: Clear, descriptive variable names
export class EmployeeListComponent {
  // Signals (no suffix)
  employees = signal<Employee[]>([]);
  isLoading = signal(false);
  selectedEmployee = signal<Employee | null>(null);
  
  // Computed signals
  employeeCount = computed(() => this.employees().length);
  hasEmployees = computed(() => this.employees().length > 0);
  
  // Observables ($ suffix)
  employees$ = this.employeeService.getEmployees();
  isLoading$ = new BehaviorSubject<boolean>(false);
  
  // Boolean variables
  isVisible = true;
  hasPermission = false;
  canEdit = true;
  
  // Methods
  loadEmployees(): void { }
  calculateSalary(employee: Employee): number { }
  
  // Event handlers
  onClick(): void { }
  onSubmit(): void { }
  onEmployeeSelect(employee: Employee): void { }
  
  // Boolean methods
  isValid(): boolean { }
  hasAccess(user: User): boolean { }
  canDelete(employee: Employee): boolean { }
  
  // Private methods (no underscore prefix)
  private handleError(error: Error): void { }
  private mapToViewModel(data: Employee[]): EmployeeViewModel[] { }
}

// ❌ Bad: Inconsistent or unclear naming
export class EmployeeListComponent {
  emp = signal<Employee[]>([]); // Too abbreviated
  _isLoading = signal(false); // Unnecessary underscore
  employees = this.service.get(); // Observable without $ suffix
  loading$ = signal(false); // Signal with $ suffix
  
  visible = true; // Boolean without is/has/can
  
  get(): void { } // Not descriptive
  clickHandler(): void { } // Should be onClick()
  valid(): boolean { } // Should be isValid()
  
  _handleError(): void { } // Unnecessary underscore
}
```

---

## Folder Naming

Folders use **kebab-case** (lowercase with hyphens).

### Examples

```
✅ Good
employee-management/
user-profile/
data-access/
shared-components/

❌ Bad
EmployeeManagement/
userProfile/
data_access/
SharedComponents/
```

### Feature Folder Structure

```
features/
├── employee/              # ✅ kebab-case
├── attendance-tracking/   # ✅ kebab-case with hyphen
├── leave-management/      # ✅ kebab-case with hyphen
└── performance-review/    # ✅ kebab-case with hyphen
```

---

## Constants and Enums

### Constants

Constants use **UPPER_SNAKE_CASE**.

```typescript
// ✅ Good: UPPER_SNAKE_CASE for constants
export const API_BASE_URL = 'http://localhost:3000/api';
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_UPLOAD_SIZE = 5 * 1024 * 1024; // 5MB

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
} as const;

// ❌ Bad: Inconsistent naming
export const apiBaseUrl = 'http://localhost:3000/api';
export const default_page_size = 20;
export const MaxUploadSize = 5 * 1024 * 1024;
```

### Enums

Enums use **PascalCase** for the enum name and **UPPER_CASE** for values.

```typescript
// ✅ Good: PascalCase enum name, UPPER_CASE values
export enum UserRole {
  ADMIN = 'admin',
  HR = 'hr',
  EMPLOYEE = 'employee',
  MANAGER = 'manager'
}

export enum HttpStatus {
  OK = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  NOT_FOUND = 404
}

// ❌ Bad: Inconsistent naming
export enum userRole { // Should be PascalCase
  admin = 'admin',     // Should be UPPER_CASE
  hr = 'hr'
}
```

---

## Observable and Signal Naming

### Observables

Observables should have a `$` suffix to distinguish them from regular values.

```typescript
// ✅ Good: Observables with $ suffix
export class EmployeeService {
  employees$: Observable<Employee[]>;
  isLoading$: Observable<boolean>;
  error$: Observable<string | null>;
}

export class EmployeeListComponent {
  private employeeService = inject(EmployeeService);
  
  // Observable properties
  employees$ = this.employeeService.getEmployees();
  searchTerm$ = new BehaviorSubject<string>('');
  
  // Combined observables
  filteredEmployees$ = combineLatest([
    this.employees$,
    this.searchTerm$
  ]).pipe(
    map(([employees, term]) => 
      employees.filter(emp => emp.name.includes(term))
    )
  );
}

// ❌ Bad: Observables without $ suffix
export class EmployeeService {
  employees: Observable<Employee[]>; // Missing $
  loading: Observable<boolean>;       // Missing $
}
```

### Signals

Signals do NOT use a suffix. They are named like regular variables.

```typescript
// ✅ Good: Signals without suffix
export class EmployeeListComponent {
  employees = signal<Employee[]>([]);
  isLoading = signal(false);
  selectedEmployee = signal<Employee | null>(null);
  searchTerm = signal('');
  
  // Computed signals
  employeeCount = computed(() => this.employees().length);
  filteredEmployees = computed(() => {
    const term = this.searchTerm().toLowerCase();
    return this.employees().filter(emp => 
      emp.name.toLowerCase().includes(term)
    );
  });
}

// ❌ Bad: Signals with $ or other suffixes
export class EmployeeListComponent {
  employees$ = signal<Employee[]>([]); // Don't use $ with signals
  employeesSignal = signal<Employee[]>([]); // Don't use 'Signal' suffix
}
```

### Mixing Observables and Signals

When using both in the same component, the naming makes it clear which is which:

```typescript
export class EmployeeListComponent {
  // Signals (no suffix)
  localState = signal(0);
  isVisible = signal(true);
  
  // Observables ($ suffix)
  employees$ = this.employeeService.getEmployees();
  currentUser$ = this.authService.currentUser$;
  
  // Clearly distinguishable
  loadData(): void {
    this.employees$.subscribe(data => {
      this.localState.set(data.length); // Observable → Signal
    });
  }
}
```

---

## Related Documentation

- **Previous:** [Layer Architecture](03-layer-architecture.md) - Architectural layers
- **Next:** [Component Architecture](05-component-architecture.md) - Component patterns
- **See Also:** [Code Organization](../best-practices/code-organization.md) - Organization best practices
- **Reference:** [Project Structure](02-project-structure.md) - Folder structure

---

**Document Version:** 2.0  
**Last Updated:** November 2025  
**Maintained By:** Frontend Architecture Team

