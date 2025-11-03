# Code Organization Best Practices

**Document:** Code Organization & Structure  
**Version:** Angular 20  
**Last Updated:** November 2025

---

## Table of Contents

1. [Overview](#overview)
2. [Barrel Exports](#barrel-exports)
3. [Path Aliases](#path-aliases)
4. [Dependency Injection](#dependency-injection)
5. [Type Safety](#type-safety)
6. [File Organization](#file-organization)
7. [Related Documentation](#related-documentation)

---

## Overview

Proper code organization improves readability, maintainability, and developer experience. This document outlines best practices for organizing code in the HRM Frontend application.

---

## Barrel Exports

### What Are Barrel Exports?

Barrel exports use `index.ts` files to simplify imports by re-exporting multiple modules from a single entry point.

### Implementation

```typescript
// features/employee/index.ts
export * from './components/employee-list/employee-list.component';
export * from './components/employee-detail/employee-detail.component';
export * from './components/employee-form/employee-form.component';
export * from './services/employee.service';
export * from './services/employee-state.service';
export * from './models/employee.model';
export * from './models/employee-filter.model';
```

### Usage

```typescript
// ✅ Good: Clean import from barrel
import { 
  EmployeeListComponent, 
  Employee, 
  EmployeeService,
  EmployeeFilters
} from '@/features/employee';

// ❌ Bad: Multiple deep imports
import { EmployeeListComponent } from '@/features/employee/components/employee-list/employee-list.component';
import { Employee } from '@/features/employee/models/employee.model';
import { EmployeeService } from '@/features/employee/services/employee.service';
```

### Benefits

- ✅ Cleaner imports
- ✅ Single point of export
- ✅ Easy to refactor internal structure
- ✅ Better IDE auto-completion

---

## Path Aliases

### Configuration

Configure path aliases in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "baseUrl": "./",
    "paths": {
      "@/*": ["src/app/*"],
      "@core/*": ["src/app/core/*"],
      "@shared/*": ["src/app/shared/*"],
      "@features/*": ["src/app/features/*"],
      "@layout/*": ["src/app/layout/*"],
      "@pages/*": ["src/app/pages/*"],
      "@environments/*": ["src/environments/*"],
      "@assets/*": ["src/assets/*"]
    }
  }
}
```

### Usage

```typescript
// ✅ Good: Path aliases
import { AuthService } from '@core/auth/services/auth.service';
import { ButtonComponent } from '@shared/components/ui/button/button.component';
import { EmployeeService } from '@features/employee/services/employee.service';
import { environment } from '@environments/environment';

// ❌ Bad: Relative paths
import { AuthService } from '../../../core/auth/services/auth.service';
import { ButtonComponent } from '../../../../shared/components/ui/button/button.component';
```

### Benefits

- ✅ No relative path hell (`../../../`)
- ✅ Easier to move files
- ✅ More readable imports
- ✅ Better IDE navigation

---

## Dependency Injection

### Modern Approach: inject() Function

```typescript
// ✅ Good: Modern inject() function
export class EmployeeListComponent {
  private employeeService = inject(EmployeeService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private notificationService = inject(NotificationService);
  
  loadEmployees(): void {
    this.employeeService.getEmployees().subscribe(...);
  }
}

// ❌ Bad: Constructor injection (verbose)
export class EmployeeListComponent {
  constructor(
    private employeeService: EmployeeService,
    private router: Router,
    private route: ActivatedRoute,
    private notificationService: NotificationService
  ) { }
}
```

### Benefits of inject()

- ✅ Less boilerplate
- ✅ More flexible (can inject anywhere, not just constructor)
- ✅ Easier to refactor
- ✅ Better for functional programming style

---

## Type Safety

### Always Define Types

```typescript
// ✅ Good: Strict typing
export interface Employee {
  id: string;
  name: string;
  email: string;
  hireDate: Date;
  department: Department;
}

export interface Department {
  id: string;
  name: string;
}

// Component
export class EmployeeListComponent {
  employees = signal<Employee[]>([]);
  
  getEmployeeById(id: string): Employee | undefined {
    return this.employees().find(emp => emp.id === id);
  }
}

// ❌ Bad: Using 'any'
let employee: any;
let employees: any[];

function getEmployee(id: any): any {
  // Implementation
}
```

### Use 'unknown' for Truly Unknown Types

```typescript
// ✅ Good: Using 'unknown' with type guards
function processData(data: unknown): void {
  if (typeof data === 'string') {
    console.log(data.toUpperCase());
  } else if (typeof data === 'number') {
    console.log(data.toFixed(2));
  } else if (isEmployee(data)) {
    console.log(data.name);
  }
}

function isEmployee(value: unknown): value is Employee {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    'name' in value
  );
}

// ❌ Bad: Using 'any' without type checks
function processData(data: any): void {
  console.log(data.toUpperCase()); // Runtime error if not a string
}
```

### Avoid Type Assertions

```typescript
// ✅ Good: Type guards
function getEmployeeName(employee: unknown): string {
  if (isEmployee(employee)) {
    return employee.name;
  }
  return 'Unknown';
}

// ❌ Bad: Type assertions
function getEmployeeName(employee: unknown): string {
  return (employee as Employee).name; // Unsafe
}
```

---

## File Organization

### Component Files

```
employee-list/
├── employee-list.component.ts      # Component logic
├── employee-list.component.html    # Template
├── employee-list.component.scss    # Styles
└── employee-list.component.spec.ts # Tests
```

### Service Files

```
employee/
├── services/
│   ├── employee.service.ts         # Data access service
│   ├── employee.service.spec.ts    # Service tests
│   ├── employee-state.service.ts   # State management
│   └── index.ts                    # Barrel export
```

### Model Files

```
employee/
├── models/
│   ├── employee.model.ts           # Domain model
│   ├── employee-filter.model.ts    # Filter models
│   ├── employee-dto.model.ts       # DTOs
│   └── index.ts                    # Barrel export
```

---

## Related Documentation

- **See Also:** [Project Structure](../architecture/02-project-structure.md) - Folder structure
- **Reference:** [Naming Conventions](../architecture/04-naming-conventions.md) - Naming standards
- **Usage:** [Component Architecture](../architecture/05-component-architecture.md) - Component patterns

---

**Document Version:** 2.0  
**Last Updated:** November 2025  
**Maintained By:** Frontend Architecture Team

