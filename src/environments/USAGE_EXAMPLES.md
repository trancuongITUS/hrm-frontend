# Environment Configuration Usage Examples

This document provides examples of how to use the environment configuration in your Angular application.

## Basic Usage

### 1. Direct Import (Simple Cases)

```typescript
import { environment } from '@environments/environment';

// Use directly
const apiUrl = environment.apiUrl;
const isProduction = environment.production;
```

### 2. Using EnvironmentService (Recommended)

```typescript
import { Component, inject } from '@angular/core';
import { EnvironmentService } from '@core/services';

@Component({
  selector: 'app-example',
  template: `<p>API URL: {{ apiUrl }}</p>`
})
export class ExampleComponent {
  private readonly envService = inject(EnvironmentService);

  apiUrl = this.envService.apiUrl;
  isProduction = this.envService.isProduction;

  checkFeature(): void {
    if (this.envService.isFeatureEnabled('analytics')) {
      // Initialize analytics
    }
  }
}
```

### 3. Using in HTTP Interceptors

```typescript
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { EnvironmentService } from '@core/services';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const envService = inject(EnvironmentService);

  if (envService.isProduction) {
    // Add production-specific headers
  }

  return next(req);
};
```

### 4. Using in Services

```typescript
import { Injectable, inject } from '@angular/core';
import { EnvironmentService } from '@core/services';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly envService = inject(EnvironmentService);
  private readonly baseUrl = this.envService.apiUrl;

  getData(): Observable<any> {
    return this.http.get(`${this.baseUrl}/data`);
  }
}
```

### 5. Using in Guards

```typescript
import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { EnvironmentService } from '@core/services';

export const debugGuard: CanActivateFn = () => {
  const envService = inject(EnvironmentService);

  return envService.debugToolsEnabled;
};
```

## Running Different Configurations

### Development Mode

```bash
npm run start:dev
npm run build:dev
```

### Production Mode

```bash
npm run start:prod
npm run build:prod
```

### Default (uses development)

```bash
npm start
npm run build
```

## Adding New Environment Properties

1. Update the interface in `environment.interface.ts`:

```typescript
export interface Environment {
  // ... existing properties
  newProperty: string;
}
```

2. Add the property to all environment files:

- `environment.ts`
- `environment.development.ts`
- `environment.production.ts`

3. Optionally add a getter in `EnvironmentService`:

```typescript
get newProperty(): string {
  return this.env.newProperty;
}
```

## Best Practices

1. **Always use the EnvironmentService** for accessing environment variables in components and services
2. **Never hardcode environment-specific values** in your code
3. **Use feature flags** for conditional features across environments
4. **Keep sensitive data out** of environment files (use server-side configuration for secrets)
5. **Document all environment properties** in the interface with JSDoc comments
6. **Use TypeScript types** to ensure type safety across all environment files

