# Overview & Architectural Principles

**Document:** Architecture Overview  
**Version:** Angular 20  
**Last Updated:** November 2025

---

## Table of Contents

1. [Introduction](#introduction)
2. [What This Document Covers](#what-this-document-covers)
3. [Architectural Principles](#architectural-principles)
4. [Technology Stack](#technology-stack)
5. [Key Features](#key-features)
6. [Related Documentation](#related-documentation)

---

## Introduction

This document defines the enterprise-level architecture for a modern Angular 20 application built for Human Resource Management (HRM). The architecture emphasizes:

- **Standalone Components** (no NgModules)
- **Strict TypeScript** configuration
- **Reactive programming** with RxJS
- **Lazy loading** for optimal performance
- **Clean separation of concerns**
- **Testability and maintainability**

---

## What This Document Covers

The HRM Frontend architecture documentation provides comprehensive guidelines for:

- **Project structure and organization** - How files and folders are organized
- **Layer architecture** - Separation of concerns across Core, Shared, Feature, Layout, and Pages layers
- **Component patterns** - Smart vs. Dumb components, lifecycle management
- **State management** - Strategies for local and global state
- **Routing** - Lazy loading, guards, and route configuration
- **Data flow** - Service patterns and API communication
- **Best practices** - Code organization, testing, performance, and security
- **Scalability** - Guidelines for growing the application

---

## Architectural Principles

### 1. **Separation of Concerns (SoC)**

Each layer, module, and component has a single, well-defined responsibility.

**Example:**
```typescript
// ✅ Good: Service handles data, component handles UI
export class EmployeeService {
  getEmployees(): Observable<Employee[]> {
    return this.baseHttp.getList<Employee>('employees');
  }
}

export class EmployeeListComponent {
  employees = this.employeeService.getEmployees();
}

// ❌ Bad: Component has data fetching logic
export class EmployeeListComponent {
  employees: Employee[] = [];
  
  loadEmployees(): void {
    this.http.get('/api/employees').subscribe(data => {
      this.employees = data;
    });
  }
}
```

### 2. **DRY (Don't Repeat Yourself)**

Shared logic is extracted into reusable services, utilities, or components.

**Example:**
```typescript
// ✅ Good: Shared validation logic
export class ValidationUtils {
  static isValidEmail(email: string): boolean {
    return VALIDATION.EMAIL_PATTERN.test(email);
  }
}

// ❌ Bad: Duplicated validation logic in multiple components
```

### 3. **SOLID Principles**

#### **S - Single Responsibility Principle**
Each class or module should have one reason to change.

```typescript
// ✅ Good: Separate concerns
export class EmployeeService {
  getEmployees(): Observable<Employee[]> { }
}

export class EmployeeValidator {
  validate(employee: Employee): ValidationErrors { }
}

// ❌ Bad: Multiple responsibilities
export class EmployeeService {
  getEmployees(): Observable<Employee[]> { }
  validate(employee: Employee): ValidationErrors { }
  formatEmployeeName(employee: Employee): string { }
}
```

#### **O - Open/Closed Principle**
Open for extension, closed for modification.

```typescript
// ✅ Good: Extensible through inheritance/composition
export abstract class BaseValidator {
  abstract validate(value: unknown): boolean;
}

export class EmailValidator extends BaseValidator {
  validate(value: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }
}
```

#### **L - Liskov Substitution Principle**
Derived classes should be substitutable for their base classes.

#### **I - Interface Segregation Principle**
Clients should not depend on interfaces they don't use.

```typescript
// ✅ Good: Specific interfaces
export interface Readable {
  read(): string;
}

export interface Writable {
  write(data: string): void;
}

// ❌ Bad: Fat interface
export interface Storage {
  read(): string;
  write(data: string): void;
  delete(): void;
  compress(): void;
  encrypt(): void;
}
```

#### **D - Dependency Inversion Principle**
Depend on abstractions, not concretions.

```typescript
// ✅ Good: Depend on abstraction
export class UserComponent {
  private storage = inject(StorageService); // Abstract interface
}

// ❌ Bad: Depend on concrete implementation
export class UserComponent {
  private storage = new LocalStorageImpl(); // Concrete class
}
```

### 4. **Reactive First**

Prefer RxJS Observables and Angular Signals for asynchronous operations and state management.

**Example:**
```typescript
// ✅ Good: Reactive approach with Signals
export class EmployeeListComponent {
  private employeeService = inject(EmployeeService);
  
  employees = this.employeeService.getEmployees();
  isLoading = signal(false);
  error = signal<string | null>(null);
}

// ✅ Good: Reactive approach with RxJS
export class EmployeeListComponent {
  private employeeService = inject(EmployeeService);
  
  employees$ = this.employeeService.getEmployees().pipe(
    catchError(error => {
      console.error('Failed to load employees', error);
      return of([]);
    })
  );
}

// ❌ Bad: Imperative approach
export class EmployeeListComponent {
  employees: Employee[] = [];
  
  loadEmployees(): void {
    this.employeeService.getEmployees().subscribe(
      data => this.employees = data
    );
  }
}
```

### 5. **Type Safety**

Strict TypeScript configuration with no `any` types.

**Example:**
```typescript
// ✅ Good: Strict typing
export interface Employee {
  id: string;
  name: string;
  email: string;
  hireDate: Date;
}

export class EmployeeService {
  getEmployees(): Observable<Employee[]> {
    return this.baseHttp.getList<Employee>('employees');
  }
}

// ❌ Bad: Using 'any'
export class EmployeeService {
  getEmployees(): Observable<any> {
    return this.http.get('/api/employees');
  }
}

// ✅ Good: Use 'unknown' when type is truly unknown
function processData(data: unknown): void {
  if (typeof data === 'string') {
    console.log(data.toUpperCase());
  }
}
```

### 6. **Performance by Default**

- **Lazy loading routes** - Load feature modules on-demand
- **OnPush change detection** - Optimize component re-rendering
- **Signal-based reactivity** - Leverage Angular 20+ fine-grained reactivity
- **Virtual scrolling** - Handle large lists efficiently
- **Image optimization** - Use Angular's built-in image optimization

**Example:**
```typescript
// ✅ Good: OnPush change detection
@Component({
  selector: 'app-employee-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @for (employee of employees(); track employee.id) {
      <app-employee-card [employee]="employee" />
    }
  `
})
export class EmployeeListComponent {
  employees = signal<Employee[]>([]);
}

// ✅ Good: Lazy loading
export const appRoutes: Routes = [
  {
    path: 'employees',
    loadChildren: () => import('./features/employee/employee.routes')
      .then(m => m.employeeRoutes)
  }
];
```

---

## Technology Stack

### Core Technologies

- **Angular 20** - Modern web application framework
- **TypeScript 5.x** - Strict type checking and modern JavaScript features
- **RxJS 7.x** - Reactive programming library
- **Signals** - Angular's fine-grained reactivity system

### UI Framework

- **PrimeNG** - Enterprise-grade UI component library
- **SCSS** - Advanced CSS preprocessing

### Development Tools

- **Angular CLI** - Project scaffolding and build tools
- **ESLint** - Code linting and quality enforcement
- **Prettier** - Code formatting
- **Jasmine/Karma** - Unit testing framework
- **Cypress/Playwright** - E2E testing

### State Management Options

- **Local State** - Angular Signals for component-level state
- **Service-Based State** - Shared state across components
- **NgRx Signal Store** - Enterprise-level state management (for complex scenarios)

---

## Key Features

### ✅ Standalone Components

Modern Angular architecture without NgModules:

```typescript
@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, EmployeeCardComponent],
  templateUrl: './employee-list.component.html'
})
export class EmployeeListComponent { }
```

### ✅ Functional Guards and Interceptors

Using functional approach instead of class-based:

```typescript
// Guard
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  return authService.isAuthenticated();
};

// Interceptor
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(TokenService).getToken();
  if (token) {
    req = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  }
  return next(req);
};
```

### ✅ Dependency Injection with `inject()`

Modern injection pattern:

```typescript
export class EmployeeService {
  private http = inject(HttpClient);
  private config = inject(AppConfigService);
  private logger = inject(LoggerService);
}
```

### ✅ Signal-Based Reactivity

Angular's modern reactivity system:

```typescript
export class EmployeeListComponent {
  employees = signal<Employee[]>([]);
  searchTerm = signal('');
  
  filteredEmployees = computed(() => {
    const term = this.searchTerm().toLowerCase();
    return this.employees().filter(emp => 
      emp.name.toLowerCase().includes(term)
    );
  });
}
```

---

## Related Documentation

- **Next Steps:** [Project Structure](02-project-structure.md) - Understand the folder organization
- **Architecture:** [Layer Architecture](03-layer-architecture.md) - Learn about architectural layers
- **Visual Guide:** [Architecture Diagrams](../architecture-diagram.md) - See visual representations
- **Best Practices:** [Code Organization](../best-practices/code-organization.md) - Learn coding standards

---

**Document Version:** 2.0  
**Last Updated:** November 2025  
**Maintained By:** Frontend Architecture Team

