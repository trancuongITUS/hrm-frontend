# Routing Strategy

**Document:** Routing Configuration & Strategy  
**Version:** Angular 20  
**Last Updated:** November 2025

---

## Table of Contents

1. [Overview](#overview)
2. [Route Configuration](#route-configuration)
3. [Lazy Loading](#lazy-loading)
4. [Guards](#guards)
5. [Resolvers](#resolvers)
6. [Route Parameters](#route-parameters)
7. [Preloading Strategies](#preloading-strategies)
8. [Best Practices](#best-practices)
9. [Related Documentation](#related-documentation)

---

## Overview

Routing is essential for navigation in single-page applications. This document defines routing strategies and best practices for the HRM Frontend application.

### Key Concepts

- **Lazy Loading** - Load modules on-demand for performance
- **Guards** - Control access to routes
- **Resolvers** - Pre-fetch data before activating routes
- **Route Parameters** - Pass data through URLs

---

## Route Configuration

### Root Routes (`app.routes.ts`)

```typescript
import { Routes } from '@angular/router';
import { MainLayoutComponent } from './layout/components/main-layout/main-layout.component';
import { AuthLayoutComponent } from './layout/components/auth-layout/auth-layout.component';
import { authGuard } from './core/auth/guards/auth.guard';
import { roleGuard } from './core/auth/guards/role.guard';

export const appRoutes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
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
        canActivate: [roleGuard],
        data: { roles: ['ADMIN', 'HR'] }
      },
      {
        path: 'attendance',
        loadChildren: () => import('./features/attendance/attendance.routes')
          .then(m => m.attendanceRoutes)
      },
      {
        path: 'payroll',
        loadChildren: () => import('./features/payroll/payroll.routes')
          .then(m => m.payrollRoutes),
        canActivate: [roleGuard],
        data: { roles: ['ADMIN', 'HR'] }
      },
      {
        path: 'reports',
        loadChildren: () => import('./features/reports/reports.routes')
          .then(m => m.reportsRoutes)
      },
      {
        path: 'settings',
        loadChildren: () => import('./features/settings/settings.routes')
          .then(m => m.settingsRoutes)
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
    path: 'error',
    loadChildren: () => import('./pages/error/error.routes')
      .then(m => m.errorRoutes)
  },
  {
    path: '**',
    redirectTo: '/error/404'
  }
];
```

### Feature Routes (`employee.routes.ts`)

```typescript
import { Routes } from '@angular/router';
import { EmployeeListComponent } from './components/employee-list/employee-list.component';
import { EmployeeDetailComponent } from './components/employee-detail/employee-detail.component';
import { EmployeeFormComponent } from './components/employee-form/employee-form.component';
import { employeeResolver } from './services/employee.resolver';
import { unsavedChangesGuard } from '@core/guards/unsaved-changes.guard';

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
    canDeactivate: [unsavedChangesGuard]
  },
  {
    path: ':id',
    component: EmployeeDetailComponent,
    resolve: { employee: employeeResolver },
    title: 'Employee Details'
  },
  {
    path: ':id/edit',
    component: EmployeeFormComponent,
    resolve: { employee: employeeResolver },
    title: 'Edit Employee',
    canDeactivate: [unsavedChangesGuard]
  }
];
```

---

## Lazy Loading

### Why Lazy Loading?

- **Faster Initial Load** - Smaller initial bundle size
- **Better Performance** - Load code only when needed
- **Improved User Experience** - Faster time to interactive

### Lazy Load Components

```typescript
{
  path: 'dashboard',
  loadComponent: () => import('./features/dashboard/dashboard.component')
    .then(m => m.DashboardComponent),
  title: 'Dashboard'
}
```

### Lazy Load Route Modules

```typescript
{
  path: 'employees',
  loadChildren: () => import('./features/employee/employee.routes')
    .then(m => m.employeeRoutes)
}
```

---

## Guards

Guards control access to routes based on specific conditions.

### Auth Guard

Protects routes that require authentication:

```typescript
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  if (authService.isAuthenticated()) {
    return true;
  }
  
  // Redirect to login with return URL
  return router.createUrlTree(['/auth/login'], {
    queryParams: { returnUrl: state.url }
  });
};
```

### Role Guard

Checks if user has required roles:

```typescript
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  const requiredRoles = route.data['roles'] as string[];
  const userRoles = authService.getUserRoles();
  
  const hasRole = requiredRoles.some(role => userRoles.includes(role));
  
  if (hasRole) {
    return true;
  }
  
  // Redirect to forbidden page
  return router.createUrlTree(['/error/403']);
};
```

### Permission Guard

Checks specific permissions:

```typescript
export const permissionGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  const requiredPermission = route.data['permission'] as string;
  
  if (authService.hasPermission(requiredPermission)) {
    return true;
  }
  
  return router.createUrlTree(['/error/403']);
};
```

### Unsaved Changes Guard

Warns before leaving form with unsaved changes:

```typescript
import { CanDeactivateFn } from '@angular/router';

export interface HasUnsavedChanges {
  hasUnsavedChanges(): boolean;
}

export const unsavedChangesGuard: CanDeactivateFn<HasUnsavedChanges> = (component) => {
  if (component.hasUnsavedChanges()) {
    return confirm('You have unsaved changes. Do you really want to leave?');
  }
  return true;
};
```

### Using Guards in Routes

```typescript
{
  path: 'employees',
  loadChildren: () => import('./features/employee/employee.routes')
    .then(m => m.employeeRoutes),
  canActivate: [authGuard, roleGuard],
  data: { roles: ['ADMIN', 'HR'] }
}

{
  path: 'employees/new',
  component: EmployeeFormComponent,
  canDeactivate: [unsavedChangesGuard]
}
```

---

## Resolvers

Resolvers pre-fetch data before activating a route.

### Creating a Resolver

```typescript
import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { EmployeeService } from './employee.service';
import { Employee } from '../models/employee.model';

export const employeeResolver: ResolveFn<Employee> = (route, state) => {
  const employeeService = inject(EmployeeService);
  const id = route.paramMap.get('id');
  
  if (!id) {
    throw new Error('Employee ID is required');
  }
  
  return employeeService.getEmployeeById(id);
};
```

### Using Resolvers

```typescript
{
  path: ':id',
  component: EmployeeDetailComponent,
  resolve: { employee: employeeResolver }
}
```

### Accessing Resolved Data

```typescript
@Component({
  selector: 'app-employee-detail'
})
export class EmployeeDetailComponent {
  private route = inject(ActivatedRoute);
  
  employee = signal<Employee | null>(null);
  
  constructor() {
    // Get resolved data from route
    this.route.data.subscribe(data => {
      this.employee.set(data['employee']);
    });
  }
}
```

---

## Route Parameters

### Path Parameters

```typescript
// Route definition
{
  path: 'employees/:id',
  component: EmployeeDetailComponent
}

// Accessing in component
export class EmployeeDetailComponent {
  private route = inject(ActivatedRoute);
  
  constructor() {
    const id = this.route.snapshot.paramMap.get('id');
    // Or observe changes
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
    });
  }
}
```

### Query Parameters

```typescript
// Navigate with query params
export class EmployeeListComponent {
  private router = inject(Router);
  
  applyFilters(filters: Filters): void {
    this.router.navigate(['/employees'], {
      queryParams: {
        department: filters.department,
        status: filters.status,
        page: 1
      }
    });
  }
}

// Read query params
export class EmployeeListComponent {
  private route = inject(ActivatedRoute);
  
  constructor() {
    this.route.queryParamMap.subscribe(params => {
      const department = params.get('department');
      const status = params.get('status');
      const page = params.get('page');
    });
  }
}
```

### Fragment (Hash)

```typescript
// Navigate with fragment
this.router.navigate(['/employees'], { fragment: 'section-2' });

// Read fragment
this.route.fragment.subscribe(fragment => {
  console.log(fragment); // 'section-2'
});
```

---

## Preloading Strategies

### PreloadAllModules

Preload all lazy-loaded modules after initial load:

```typescript
// app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { appRoutes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      appRoutes,
      withPreloading(PreloadAllModules)
    )
  ]
};
```

### Custom Preloading Strategy

Selectively preload modules based on route data:

```typescript
import { PreloadingStrategy, Route } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CustomPreloadingStrategy implements PreloadingStrategy {
  preload(route: Route, load: () => Observable<unknown>): Observable<unknown> {
    // Preload if route data includes preload: true
    if (route.data && route.data['preload']) {
      return load();
    }
    return of(null);
  }
}

// Usage in routes
{
  path: 'employees',
  loadChildren: () => import('./features/employee/employee.routes')
    .then(m => m.employeeRoutes),
  data: { preload: true }
}

// Register in app.config.ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      appRoutes,
      withPreloading(CustomPreloadingStrategy)
    )
  ]
};
```

---

## Best Practices

### 1. Use Lazy Loading

```typescript
// ✅ Good: Lazy load features
{
  path: 'employees',
  loadChildren: () => import('./features/employee/employee.routes')
    .then(m => m.employeeRoutes)
}

// ❌ Bad: Eager loading everything
import { EmployeeListComponent } from './features/employee/components/employee-list.component';
{
  path: 'employees',
  component: EmployeeListComponent
}
```

### 2. Use Functional Guards

```typescript
// ✅ Good: Functional guard
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  return authService.isAuthenticated();
};

// ❌ Bad: Class-based guard (legacy)
@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  canActivate(): boolean {
    return this.authService.isAuthenticated();
  }
}
```

### 3. Set Page Titles

```typescript
{
  path: 'employees',
  component: EmployeeListComponent,
  title: 'Employees' // Sets browser title
}
```

### 4. Handle 404 Routes

```typescript
{
  path: '**',
  redirectTo: '/error/404'
}
```

### 5. Use Route Data for Metadata

```typescript
{
  path: 'employees',
  component: EmployeeListComponent,
  data: {
    title: 'Employees',
    roles: ['ADMIN', 'HR'],
    breadcrumb: 'Employee Management'
  }
}
```

### 6. Group Related Routes

```typescript
// ✅ Good: Grouped under common layout
{
  path: '',
  component: MainLayoutComponent,
  children: [
    { path: 'dashboard', component: DashboardComponent },
    { path: 'employees', loadChildren: () => ... },
    { path: 'attendance', loadChildren: () => ... }
  ]
}
```

---

## Related Documentation

- **Previous:** [State Management](06-state-management.md) - State strategies
- **Next:** [Data Flow Patterns](08-data-flow-patterns.md) - Service patterns
- **See Also:** [Component Architecture](05-component-architecture.md) - Component patterns
- **Reference:** [Project Structure](02-project-structure.md) - Folder structure

---

**Document Version:** 2.0  
**Last Updated:** November 2025  
**Maintained By:** Frontend Architecture Team

