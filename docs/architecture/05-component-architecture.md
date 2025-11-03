# Component Architecture

**Document:** Component Architecture & Best Practices  
**Version:** Angular 20  
**Last Updated:** November 2025

---

## Table of Contents

1. [Overview](#overview)
2. [Smart vs Dumb Components](#smart-vs-dumb-components)
3. [Component Lifecycle](#component-lifecycle)
4. [Change Detection Strategy](#change-detection-strategy)
5. [Component Communication](#component-communication)
6. [Best Practices](#best-practices)
7. [Related Documentation](#related-documentation)

---

## Overview

Components are the building blocks of Angular applications. This document defines patterns and best practices for building maintainable, performant components.

### Component Types

1. **Smart (Container) Components** - Handle logic and state
2. **Dumb (Presentational) Components** - Handle UI and display
3. **Layout Components** - Handle application structure
4. **Page Components** - Handle route entry points

---

## Smart vs Dumb Components

### Smart (Container) Components

**Responsibilities:**
- Handle business logic
- Manage state
- Communicate with services
- Handle routing
- Orchestrate child components

**Characteristics:**
- Fewer @Input/@Output decorators
- Subscribes to observables or uses signals
- Uses OnPush change detection
- Contains business logic

**Example:**

```typescript
@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, EmployeeCardComponent, LoadingSpinnerComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="employee-list">
      <h2>Employees</h2>
      
      @if (isLoading()) {
        <app-loading-spinner />
      } @else if (error()) {
        <div class="error">{{ error() }}</div>
      } @else {
        <div class="employee-grid">
          @for (employee of employees(); track employee.id) {
            <app-employee-card 
              [employee]="employee"
              (delete)="onDelete($event)"
              (edit)="onEdit($event)">
            </app-employee-card>
          }
        </div>
      }
    </div>
  `
})
export class EmployeeListComponent {
  private employeeService = inject(EmployeeService);
  private router = inject(Router);
  private notificationService = inject(NotificationService);
  
  // State using signals
  employees = signal<Employee[]>([]);
  isLoading = signal(false);
  error = signal<string | null>(null);
  
  // Computed values
  employeeCount = computed(() => this.employees().length);
  
  constructor() {
    this.loadEmployees();
  }
  
  private loadEmployees(): void {
    this.isLoading.set(true);
    this.employeeService.getEmployees().subscribe({
      next: (employees) => {
        this.employees.set(employees);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.error.set('Failed to load employees');
        this.isLoading.set(false);
      }
    });
  }
  
  onDelete(id: string): void {
    this.employeeService.deleteEmployee(id).subscribe({
      next: () => {
        this.employees.update(list => list.filter(emp => emp.id !== id));
        this.notificationService.showSuccess('Employee deleted');
      },
      error: () => {
        this.notificationService.showError('Failed to delete employee');
      }
    });
  }
  
  onEdit(employee: Employee): void {
    this.router.navigate(['/employees', employee.id, 'edit']);
  }
}
```

### Dumb (Presentational) Components

**Responsibilities:**
- Display data
- Emit events
- Pure UI logic only
- No business logic

**Characteristics:**
- Heavy use of @Input/@Output
- No service injection (except UI-only services)
- OnPush change detection
- Highly reusable

**Example:**

```typescript
@Component({
  selector: 'app-employee-card',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="employee-card" [class.selected]="isSelected">
      <div class="employee-avatar">
        <img [src]="employee.photo" [alt]="employee.name" />
      </div>
      <div class="employee-info">
        <h3>{{ employee.name }}</h3>
        <p class="position">{{ employee.position }}</p>
        <p class="email">{{ employee.email }}</p>
      </div>
      <div class="employee-actions">
        <button class="btn-edit" (click)="edit.emit(employee)">
          Edit
        </button>
        <button class="btn-delete" (click)="onDeleteClick()">
          Delete
        </button>
      </div>
    </div>
  `,
  styles: [`
    .employee-card {
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 16px;
      transition: box-shadow 0.3s;
    }
    
    .employee-card.selected {
      border-color: #007bff;
      box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
    }
    
    .employee-card:hover {
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }
  `]
})
export class EmployeeCardComponent {
  @Input({ required: true }) employee!: Employee;
  @Input() isSelected = false;
  
  @Output() edit = new EventEmitter<Employee>();
  @Output() delete = new EventEmitter<string>();
  @Output() select = new EventEmitter<Employee>();
  
  onDeleteClick(): void {
    if (confirm(`Delete ${this.employee.name}?`)) {
      this.delete.emit(this.employee.id);
    }
  }
}
```

### When to Use Each Type

| Scenario | Component Type |
|----------|----------------|
| Fetching data from API | Smart |
| Displaying a list of items | Dumb |
| Managing form state | Smart |
| Rendering a single form field | Dumb |
| Handling route parameters | Smart |
| Showing a button or card | Dumb |
| Business logic/calculations | Smart |
| Pure UI presentation | Dumb |

---

## Component Lifecycle

### Lifecycle Hooks

```typescript
export class MyComponent implements OnInit, AfterViewInit, OnDestroy {
  ngOnInit(): void {
    // Component initialization
    // Fetch initial data
  }
  
  ngAfterViewInit(): void {
    // After view is initialized
    // Access ViewChild elements
  }
  
  ngOnDestroy(): void {
    // Cleanup before component is destroyed
    // Unsubscribe from observables
  }
}
```

### Modern Approach with Signals and Effects

```typescript
export class MyComponent {
  count = signal(0);
  doubled = computed(() => this.count() * 2);
  
  constructor() {
    // Effect runs when dependencies change
    effect(() => {
      console.log('Count changed:', this.count());
      // Side effects here
    });
  }
}
```

### Subscription Management

**Option 1: takeUntil Pattern**

```typescript
export class MyComponent implements OnInit, OnDestroy {
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

**Option 2: Async Pipe (Recommended)**

```typescript
@Component({
  template: `
    @if (data$ | async; as data) {
      <div>{{ data.name }}</div>
    }
  `
})
export class MyComponent {
  data$ = this.dataService.getData();
}
```

**Option 3: Signals (Modern Approach)**

```typescript
export class MyComponent {
  data = this.dataService.getDataAsSignal();
  
  // No manual subscription management needed!
}
```

---

## Change Detection Strategy

### OnPush Change Detection

**Always use OnPush** for better performance:

```typescript
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MyComponent { }
```

### How OnPush Works

Change detection runs only when:
1. Input reference changes
2. Event is triggered in component
3. Observable emits (with async pipe)
4. Signal value changes
5. Manually triggered with `ChangeDetectorRef.markForCheck()`

### Example with OnPush

```typescript
@Component({
  selector: 'app-employee-card',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div>{{ employee.name }}</div>
  `
})
export class EmployeeCardComponent {
  @Input() employee!: Employee;
  
  // ✅ Change detection runs when employee reference changes
  // ❌ Change detection doesn't run if employee properties mutate
}
```

### Triggering Change Detection

```typescript
export class MyComponent {
  private cdr = inject(ChangeDetectorRef);
  
  updateData(): void {
    // Mutate data
    this.data.name = 'New Name';
    
    // Manually trigger change detection
    this.cdr.markForCheck();
  }
}
```

---

## Component Communication

### Parent to Child (@Input)

```typescript
// Parent
@Component({
  template: `<app-child [data]="parentData" />`
})
export class ParentComponent {
  parentData = { name: 'John' };
}

// Child
@Component({
  selector: 'app-child'
})
export class ChildComponent {
  @Input({ required: true }) data!: { name: string };
}
```

### Child to Parent (@Output)

```typescript
// Child
@Component({
  selector: 'app-child',
  template: `<button (click)="sendData()">Send</button>`
})
export class ChildComponent {
  @Output() dataEmitted = new EventEmitter<string>();
  
  sendData(): void {
    this.dataEmitted.emit('Hello Parent');
  }
}

// Parent
@Component({
  template: `<app-child (dataEmitted)="onDataReceived($event)" />`
})
export class ParentComponent {
  onDataReceived(data: string): void {
    console.log(data);
  }
}
```

### Two-Way Binding

```typescript
// Child
@Component({
  selector: 'app-counter'
})
export class CounterComponent {
  @Input() count = 0;
  @Output() countChange = new EventEmitter<number>();
  
  increment(): void {
    this.count++;
    this.countChange.emit(this.count);
  }
}

// Parent
@Component({
  template: `<app-counter [(count)]="value" />`
})
export class ParentComponent {
  value = 0;
}
```

### Via Service (Shared State)

```typescript
@Injectable({ providedIn: 'root' })
export class DataSharingService {
  private dataSubject = new BehaviorSubject<string>('');
  data$ = this.dataSubject.asObservable();
  
  updateData(data: string): void {
    this.dataSubject.next(data);
  }
}

// Component A
export class ComponentA {
  private dataService = inject(DataSharingService);
  
  sendData(): void {
    this.dataService.updateData('Hello');
  }
}

// Component B
export class ComponentB {
  private dataService = inject(DataSharingService);
  data$ = this.dataService.data$;
}
```

---

## Best Practices

### 1. Keep Components Small and Focused

```typescript
// ✅ Good: Small, focused component
@Component({
  selector: 'app-user-profile',
  template: `
    <app-user-avatar [user]="user" />
    <app-user-info [user]="user" />
    <app-user-actions [user]="user" />
  `
})
export class UserProfileComponent {
  @Input() user!: User;
}

// ❌ Bad: Large component with too many responsibilities
@Component({
  selector: 'app-user-profile',
  template: `
    <!-- 500 lines of template -->
  `
})
export class UserProfileComponent {
  // 1000 lines of logic
}
```

### 2. Use Required Inputs

```typescript
// ✅ Good: Required input
@Input({ required: true }) employee!: Employee;

// ❌ Bad: Optional input with potential null issues
@Input() employee?: Employee;
```

### 3. Use trackBy with *ngFor

```typescript
@Component({
  template: `
    @for (item of items; track trackById($index, item)) {
      <div>{{ item.name }}</div>
    }
  `
})
export class MyComponent {
  trackById(index: number, item: Item): string {
    return item.id;
  }
}
```

### 4. Avoid Logic in Templates

```typescript
// ❌ Bad: Complex logic in template
<div *ngIf="user && user.role === 'admin' && user.permissions.includes('write')">
  Admin Content
</div>

// ✅ Good: Move logic to component
@Component({
  template: `
    @if (canEditContent()) {
      <div>Admin Content</div>
    }
  `
})
export class MyComponent {
  canEditContent(): boolean {
    return this.user?.role === 'admin' && 
           this.user?.permissions.includes('write');
  }
}
```

### 5. Use Standalone Components

```typescript
// ✅ Good: Standalone component
@Component({
  selector: 'app-my-component',
  standalone: true,
  imports: [CommonModule, OtherComponent]
})
export class MyComponent { }

// ❌ Bad: NgModule-based (legacy)
@NgModule({
  declarations: [MyComponent],
  imports: [CommonModule]
})
export class MyModule { }
```

### 6. Use Dependency Injection with inject()

```typescript
// ✅ Good: Modern inject() function
export class MyComponent {
  private userService = inject(UserService);
  private router = inject(Router);
}

// ❌ Bad: Constructor injection (verbose)
export class MyComponent {
  constructor(
    private userService: UserService,
    private router: Router
  ) { }
}
```

---

## Related Documentation

- **Previous:** [Naming Conventions](04-naming-conventions.md) - Naming standards
- **Next:** [State Management](06-state-management.md) - State patterns
- **See Also:** [Best Practices](../best-practices/code-organization.md) - Code organization
- **Reference:** [Layer Architecture](03-layer-architecture.md) - Architectural layers

---

**Document Version:** 2.0  
**Last Updated:** November 2025  
**Maintained By:** Frontend Architecture Team

