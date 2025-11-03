# State Management

**Document:** State Management Strategies  
**Version:** Angular 20  
**Last Updated:** November 2025

---

## Table of Contents

1. [Overview](#overview)
2. [State Management Strategies](#state-management-strategies)
3. [Local Component State](#local-component-state)
4. [Service-Based State](#service-based-state)
5. [NgRx Signal Store](#ngrx-signal-store)
6. [Decision Tree](#decision-tree)
7. [Best Practices](#best-practices)
8. [Related Documentation](#related-documentation)

---

## Overview

State management is crucial for building maintainable Angular applications. This document outlines different strategies for managing state based on complexity and scope.

### Types of State

1. **Local State** - Component-specific state
2. **Shared State** - State shared between components within a feature
3. **Global State** - Application-wide state

---

## State Management Strategies

### Strategy Overview

| Strategy | Use Case | Complexity | Scope |
|----------|----------|------------|-------|
| Local Component State | Simple component state | Low | Single component |
| Service-Based State | Shared feature state | Medium | Feature module |
| NgRx Signal Store | Complex global state | High | Application-wide |

---

## Local Component State

**When to Use:**
- State is only needed within a single component
- Simple data structures
- No need to share with other components

### Using Signals (Recommended)

```typescript
export class EmployeeListComponent {
  // State signals
  employees = signal<Employee[]>([]);
  isLoading = signal(false);
  selectedEmployee = signal<Employee | null>(null);
  searchTerm = signal('');
  
  // Computed values
  employeeCount = computed(() => this.employees().length);
  
  filteredEmployees = computed(() => {
    const term = this.searchTerm().toLowerCase();
    return this.employees().filter(emp => 
      emp.name.toLowerCase().includes(term)
    );
  });
  
  hasEmployees = computed(() => this.employees().length > 0);
  
  // Actions
  selectEmployee(employee: Employee): void {
    this.selectedEmployee.set(employee);
  }
  
  updateSearchTerm(term: string): void {
    this.searchTerm.set(term);
  }
  
  addEmployee(employee: Employee): void {
    this.employees.update(current => [...current, employee]);
  }
  
  removeEmployee(id: string): void {
    this.employees.update(current => 
      current.filter(emp => emp.id !== id)
    );
  }
}
```

### Using RxJS (Alternative)

```typescript
export class EmployeeListComponent {
  private employeesSubject = new BehaviorSubject<Employee[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private searchTermSubject = new BehaviorSubject<string>('');
  
  // Exposed as observables
  employees$ = this.employeesSubject.asObservable();
  isLoading$ = this.loadingSubject.asObservable();
  
  // Computed observables
  filteredEmployees$ = combineLatest([
    this.employees$,
    this.searchTermSubject.asObservable()
  ]).pipe(
    map(([employees, term]) => 
      employees.filter(emp => emp.name.toLowerCase().includes(term.toLowerCase()))
    )
  );
  
  employeeCount$ = this.employees$.pipe(
    map(employees => employees.length)
  );
  
  // Actions
  setEmployees(employees: Employee[]): void {
    this.employeesSubject.next(employees);
  }
  
  setLoading(loading: boolean): void {
    this.loadingSubject.next(loading);
  }
  
  updateSearchTerm(term: string): void {
    this.searchTermSubject.next(term);
  }
}
```

---

## Service-Based State

**When to Use:**
- State needs to be shared between multiple components
- Within a feature module
- Medium complexity

### State Service Pattern

```typescript
@Injectable({ providedIn: 'root' })
export class EmployeeStateService {
  // Private state
  private employeesState = signal<Employee[]>([]);
  private loadingState = signal(false);
  private errorState = signal<string | null>(null);
  private selectedEmployeeIdState = signal<string | null>(null);
  
  // Read-only public accessors
  readonly employees = this.employeesState.asReadonly();
  readonly loading = this.loadingState.asReadonly();
  readonly error = this.errorState.asReadonly();
  
  // Computed values
  readonly employeeCount = computed(() => this.employeesState().length);
  
  readonly selectedEmployee = computed(() => {
    const id = this.selectedEmployeeIdState();
    if (!id) return null;
    return this.employeesState().find(emp => emp.id === id) ?? null;
  });
  
  readonly hasEmployees = computed(() => this.employeesState().length > 0);
  
  // Actions
  setEmployees(employees: Employee[]): void {
    this.employeesState.set(employees);
    this.errorState.set(null);
  }
  
  addEmployee(employee: Employee): void {
    this.employeesState.update(current => [...current, employee]);
  }
  
  updateEmployee(id: string, updates: Partial<Employee>): void {
    this.employeesState.update(current =>
      current.map(emp => emp.id === id ? { ...emp, ...updates } : emp)
    );
  }
  
  removeEmployee(id: string): void {
    this.employeesState.update(current => 
      current.filter(emp => emp.id !== id)
    );
  }
  
  selectEmployee(id: string): void {
    this.selectedEmployeeIdState.set(id);
  }
  
  setLoading(loading: boolean): void {
    this.loadingState.set(loading);
  }
  
  setError(error: string | null): void {
    this.errorState.set(error);
  }
  
  clearState(): void {
    this.employeesState.set([]);
    this.loadingState.set(false);
    this.errorState.set(null);
    this.selectedEmployeeIdState.set(null);
  }
}
```

### Using State Service in Components

```typescript
@Component({
  selector: 'app-employee-list',
  template: `
    <div class="employee-list">
      @if (employeeState.loading()) {
        <app-loading-spinner />
      }
      
      @if (employeeState.error()) {
        <div class="error">{{ employeeState.error() }}</div>
      }
      
      <div class="employee-count">
        Total: {{ employeeState.employeeCount() }}
      </div>
      
      @for (employee of employeeState.employees(); track employee.id) {
        <app-employee-card 
          [employee]="employee"
          [isSelected]="employeeState.selectedEmployee()?.id === employee.id"
          (select)="onSelect(employee.id)" />
      }
    </div>
  `
})
export class EmployeeListComponent {
  protected employeeState = inject(EmployeeStateService);
  private employeeService = inject(EmployeeService);
  
  constructor() {
    this.loadEmployees();
  }
  
  private loadEmployees(): void {
    this.employeeState.setLoading(true);
    this.employeeService.getEmployees().subscribe({
      next: (employees) => {
        this.employeeState.setEmployees(employees);
        this.employeeState.setLoading(false);
      },
      error: (error) => {
        this.employeeState.setError('Failed to load employees');
        this.employeeState.setLoading(false);
      }
    });
  }
  
  onSelect(id: string): void {
    this.employeeState.selectEmployee(id);
  }
}
```

---

## NgRx Signal Store

**When to Use:**
- Complex application-wide state
- Need time-travel debugging
- Multiple features interact with same state
- Need advanced state management features

### Installation

```bash
npm install @ngrx/signals
```

### Creating a Signal Store

```typescript
import { signalStore, withState, withComputed, withMethods } from '@ngrx/signals';

interface EmployeeState {
  employees: Employee[];
  loading: boolean;
  error: string | null;
  selectedEmployeeId: string | null;
  filters: EmployeeFilters;
}

const initialState: EmployeeState = {
  employees: [],
  loading: false,
  error: null,
  selectedEmployeeId: null,
  filters: {
    searchTerm: '',
    department: null,
    status: null
  }
};

export const EmployeeStore = signalStore(
  { providedIn: 'root' },
  
  // Define state
  withState(initialState),
  
  // Add computed selectors
  withComputed((store) => ({
    employeeCount: computed(() => store.employees().length),
    
    selectedEmployee: computed(() => {
      const id = store.selectedEmployeeId();
      return store.employees().find(emp => emp.id === id) ?? null;
    }),
    
    filteredEmployees: computed(() => {
      const employees = store.employees();
      const filters = store.filters();
      
      return employees.filter(emp => {
        if (filters.searchTerm && !emp.name.toLowerCase().includes(filters.searchTerm.toLowerCase())) {
          return false;
        }
        if (filters.department && emp.department !== filters.department) {
          return false;
        }
        if (filters.status && emp.status !== filters.status) {
          return false;
        }
        return true;
      });
    }),
    
    hasEmployees: computed(() => store.employees().length > 0),
    isFiltering: computed(() => {
      const filters = store.filters();
      return filters.searchTerm !== '' || 
             filters.department !== null || 
             filters.status !== null;
    })
  })),
  
  // Add methods
  withMethods((store, employeeService = inject(EmployeeService)) => ({
    async loadEmployees() {
      patchState(store, { loading: true, error: null });
      
      try {
        const employees = await firstValueFrom(employeeService.getEmployees());
        patchState(store, { employees, loading: false });
      } catch (error) {
        patchState(store, { 
          error: 'Failed to load employees', 
          loading: false 
        });
      }
    },
    
    addEmployee(employee: Employee) {
      patchState(store, {
        employees: [...store.employees(), employee]
      });
    },
    
    updateEmployee(id: string, updates: Partial<Employee>) {
      patchState(store, {
        employees: store.employees().map(emp =>
          emp.id === id ? { ...emp, ...updates } : emp
        )
      });
    },
    
    removeEmployee(id: string) {
      patchState(store, {
        employees: store.employees().filter(emp => emp.id !== id)
      });
    },
    
    selectEmployee(id: string) {
      patchState(store, { selectedEmployeeId: id });
    },
    
    updateFilters(filters: Partial<EmployeeFilters>) {
      patchState(store, {
        filters: { ...store.filters(), ...filters }
      });
    },
    
    clearFilters() {
      patchState(store, {
        filters: initialState.filters
      });
    },
    
    reset() {
      patchState(store, initialState);
    }
  }))
);
```

### Using Signal Store in Components

```typescript
@Component({
  selector: 'app-employee-list',
  template: `
    <div class="employee-list">
      <!-- Filters -->
      <div class="filters">
        <input 
          type="text"
          [value]="store.filters().searchTerm"
          (input)="onSearchChange($event)" 
          placeholder="Search employees..." />
        
        @if (store.isFiltering()) {
          <button (click)="store.clearFilters()">Clear Filters</button>
        }
      </div>
      
      <!-- Loading state -->
      @if (store.loading()) {
        <app-loading-spinner />
      }
      
      <!-- Error state -->
      @if (store.error()) {
        <div class="error">{{ store.error() }}</div>
      }
      
      <!-- Employee count -->
      <div class="count">
        Showing {{ store.filteredEmployees().length }} of {{ store.employeeCount() }} employees
      </div>
      
      <!-- Employee list -->
      @for (employee of store.filteredEmployees(); track employee.id) {
        <app-employee-card 
          [employee]="employee"
          [isSelected]="store.selectedEmployee()?.id === employee.id"
          (click)="store.selectEmployee(employee.id)" />
      }
    </div>
  `
})
export class EmployeeListComponent {
  protected store = inject(EmployeeStore);
  
  constructor() {
    this.store.loadEmployees();
  }
  
  onSearchChange(event: Event): void {
    const searchTerm = (event.target as HTMLInputElement).value;
    this.store.updateFilters({ searchTerm });
  }
}
```

---

## Decision Tree

```
Do you need to share state?
├─ NO → Use Local Component State (signals)
└─ YES → Is it complex with many interactions?
    ├─ NO → Is it within a single feature?
    │   ├─ YES → Use Service-Based State
    │   └─ NO → Use NgRx Signal Store
    └─ YES → Use NgRx Signal Store
```

### Quick Reference

| Scenario | Strategy |
|----------|----------|
| Form state in a single component | Local State (Signals) |
| List filtering in a single component | Local State (Signals) |
| Shared state within employee feature | Service-Based State |
| Shopping cart across multiple features | NgRx Signal Store |
| User authentication state | Service-Based State or NgRx |
| Complex filter state across features | NgRx Signal Store |

---

## Best Practices

### 1. Keep State Immutable

```typescript
// ✅ Good: Immutable updates
this.employees.update(current => [...current, newEmployee]);
this.employee.update(current => ({ ...current, name: newName }));

// ❌ Bad: Mutating state
this.employees().push(newEmployee); // DON'T DO THIS
this.employee().name = newName;     // DON'T DO THIS
```

### 2. Use Computed for Derived State

```typescript
// ✅ Good: Computed values
employeeCount = computed(() => this.employees().length);
hasEmployees = computed(() => this.employees().length > 0);

// ❌ Bad: Duplicating state
employeeCount = signal(0);
hasEmployees = signal(false);

addEmployee(employee: Employee): void {
  this.employees.update(current => [...current, employee]);
  this.employeeCount.set(this.employees().length); // Redundant
  this.hasEmployees.set(true); // Redundant
}
```

### 3. Provide Read-Only Access

```typescript
// ✅ Good: Read-only public access
export class EmployeeStateService {
  private employeesState = signal<Employee[]>([]);
  readonly employees = this.employeesState.asReadonly();
  
  setEmployees(employees: Employee[]): void {
    this.employeesState.set(employees);
  }
}

// ❌ Bad: Exposing mutable state
export class EmployeeStateService {
  employees = signal<Employee[]>([]);
}
```

### 4. Clear State When Appropriate

```typescript
export class EmployeeStateService {
  clearState(): void {
    this.employeesState.set([]);
    this.loadingState.set(false);
    this.errorState.set(null);
  }
}

// Use in component
ngOnDestroy(): void {
  this.employeeState.clearState();
}
```

### 5. Handle Loading and Error States

```typescript
export class EmployeeStateService {
  private employeesState = signal<Employee[]>([]);
  private loadingState = signal(false);
  private errorState = signal<string | null>(null);
  
  readonly employees = this.employeesState.asReadonly();
  readonly loading = this.loadingState.asReadonly();
  readonly error = this.errorState.asReadonly();
}
```

---

## Related Documentation

- **Previous:** [Component Architecture](05-component-architecture.md) - Component patterns
- **Next:** [Routing Strategy](07-routing-strategy.md) - Routing configuration
- **See Also:** [Data Flow Patterns](08-data-flow-patterns.md) - Service patterns
- **Reference:** [Best Practices](../best-practices/code-organization.md) - Code organization

---

**Document Version:** 2.0  
**Last Updated:** November 2025  
**Maintained By:** Frontend Architecture Team

