# Performance Optimization

**Document:** Performance Best Practices  
**Version:** Angular 20  
**Last Updated:** November 2025

---

## Table of Contents

1. [Overview](#overview)
2. [Lazy Loading](#lazy-loading)
3. [Change Detection](#change-detection)
4. [Virtual Scrolling](#virtual-scrolling)
5. [Image Optimization](#image-optimization)
6. [Preloading Strategies](#preloading-strategies)
7. [Related Documentation](#related-documentation)

---

## Overview

Performance optimization ensures fast, responsive applications. This document outlines key strategies for optimizing Angular applications.

---

## Lazy Loading

### Lazy Load Routes

```typescript
// ✅ Good: Lazy load feature modules
export const appRoutes: Routes = [
  {
    path: 'employees',
    loadChildren: () => import('./features/employee/employee.routes')
      .then(m => m.employeeRoutes)
  }
];

// ❌ Bad: Eager loading
import { EmployeeListComponent } from './features/employee/components/employee-list.component';
export const appRoutes: Routes = [
  {
    path: 'employees',
    component: EmployeeListComponent
  }
];
```

---

## Change Detection

### Use OnPush Change Detection

```typescript
// ✅ Good: OnPush change detection
@Component({
  selector: 'app-employee-list',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmployeeListComponent { }
```

### Use TrackBy Functions

```typescript
// ✅ Good: TrackBy function
@Component({
  template: `
    @for (item of items(); track trackById($index, item)) {
      <div>{{ item.name }}</div>
    }
  `
})
export class MyComponent {
  trackById(index: number, item: Employee): string {
    return item.id;
  }
}

// ❌ Bad: No trackBy
@Component({
  template: `
    @for (item of items(); track $index) {
      <div>{{ item.name }}</div>
    }
  `
})
```

---

## Virtual Scrolling

```typescript
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

@Component({
  imports: [CdkVirtualScrollViewport],
  template: `
    <cdk-virtual-scroll-viewport itemSize="50" class="viewport">
      <div *cdkVirtualFor="let item of items">{{ item.name }}</div>
    </cdk-virtual-scroll-viewport>
  `
})
export class MyComponent {
  items = signal<Item[]>([...Array(10000)]);
}
```

---

## Image Optimization

```typescript
// ✅ Good: Use NgOptimizedImage
<img [ngSrc]="employee.photo" width="200" height="200" priority />

// ❌ Bad: Regular img tag
<img [src]="employee.photo" />
```

---

## Preloading Strategies

```typescript
// app.config.ts
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

## Related Documentation

- **See Also:** [Routing Strategy](../architecture/07-routing-strategy.md) - Routing configuration
- **Reference:** [Component Architecture](../architecture/05-component-architecture.md) - Component patterns

---

**Document Version:** 2.0  
**Last Updated:** November 2025  
**Maintained By:** Frontend Architecture Team

