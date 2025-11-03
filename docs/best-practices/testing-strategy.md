# Testing Strategy

**Document:** Testing Best Practices  
**Version:** Angular 20  
**Last Updated:** November 2025

---

## Table of Contents

1. [Overview](#overview)
2. [Unit Testing](#unit-testing)
3. [Integration Testing](#integration-testing)
4. [Best Practices](#best-practices)
5. [Related Documentation](#related-documentation)

---

## Overview

Testing ensures application reliability and maintainability. This document outlines testing strategies for components, services, and end-to-end scenarios.

---

## Unit Testing

### Component Testing

```typescript
describe('EmployeeListComponent', () => {
  let component: EmployeeListComponent;
  let mockEmployeeService: jasmine.SpyObj<EmployeeService>;
  
  beforeEach(async () => {
    mockEmployeeService = jasmine.createSpyObj('EmployeeService', ['getEmployees', 'deleteEmployee']);
    
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
    const mockEmployees = [{ id: '1', name: 'John Doe', email: 'john@example.com' }];
    mockEmployeeService.getEmployees.and.returnValue(of(mockEmployees));
    
    component.ngOnInit();
    
    expect(component.employees()).toEqual(mockEmployees);
  });
  
  it('should handle delete employee', () => {
    mockEmployeeService.deleteEmployee.and.returnValue(of(void 0));
    
    component.onDelete('1');
    
    expect(mockEmployeeService.deleteEmployee).toHaveBeenCalledWith('1');
  });
});
```

### Service Testing

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
    
    const req = httpMock.expectOne('/api/v1/employees');
    expect(req.request.method).toBe('GET');
    req.flush({ success: true, data: mockEmployees });
  });
  
  it('should create employee', () => {
    const newEmployee = { name: 'Jane Doe', email: 'jane@example.com' };
    const createdEmployee = { id: '2', ...newEmployee };
    
    service.createEmployee(newEmployee).subscribe(employee => {
      expect(employee).toEqual(createdEmployee);
    });
    
    const req = httpMock.expectOne('/api/v1/employees');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newEmployee);
    req.flush({ success: true, data: createdEmployee });
  });
});
```

---

## Integration Testing

### E2E Testing with Cypress

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
    cy.get('h1').should('contain', 'Employee Details');
  });
  
  it('should filter employees by search term', () => {
    cy.get('[data-testid="search-input"]').type('John');
    cy.get('.employee-card').should('have.length', 1);
    cy.get('.employee-card').first().should('contain', 'John');
  });
});
```

---

## Best Practices

### 1. Test Behavior, Not Implementation

```typescript
// ✅ Good: Test behavior
it('should show success message after creating employee', () => {
  component.createEmployee(newEmployee);
  expect(notificationService.showSuccess).toHaveBeenCalled();
});

// ❌ Bad: Test implementation details
it('should call private method', () => {
  spyOn(component as any, 'mapEmployeeData');
  component.createEmployee(newEmployee);
  expect(component as any).mapEmployeeData).toHaveBeenCalled();
});
```

### 2. Use TestBed for Angular Testing

```typescript
// ✅ Good: Use TestBed
beforeEach(async () => {
  await TestBed.configureTestingModule({
    imports: [MyComponent],
    providers: [MyService]
  }).compileComponents();
});

// ❌ Bad: Manual instantiation
const component = new MyComponent(new MyService());
```

### 3. Mock Dependencies

```typescript
// ✅ Good: Mock dependencies
const mockService = jasmine.createSpyObj('EmployeeService', ['getEmployees']);
TestBed.configureTestingModule({
  providers: [{ provide: EmployeeService, useValue: mockService }]
});
```

---

## Related Documentation

- **See Also:** [Component Architecture](../architecture/05-component-architecture.md) - Component patterns
- **Reference:** [Code Organization](code-organization.md) - Code structure

---

**Document Version:** 2.0  
**Last Updated:** November 2025  
**Maintained By:** Frontend Architecture Team

