# Security Best Practices

**Document:** Security Guidelines  
**Version:** Angular 20  
**Last Updated:** November 2025

---

## Table of Contents

1. [Overview](#overview)
2. [Authentication & Authorization](#authentication--authorization)
3. [HTTP Interceptors](#http-interceptors)
4. [Sanitization](#sanitization)
5. [CSRF Protection](#csrf-protection)
6. [Related Documentation](#related-documentation)

---

## Overview

Security is critical for protecting user data and preventing vulnerabilities. This document outlines security best practices for Angular applications.

---

## Authentication & Authorization

### Store Tokens Securely

```typescript
@Injectable({ providedIn: 'root' })
export class TokenService {
  private readonly TOKEN_KEY = 'auth_token';
  
  setToken(token: string): void {
    // ✅ Use httpOnly cookies in production
    // ✅ Use sessionStorage for temporary tokens
    sessionStorage.setItem(this.TOKEN_KEY, token);
  }
  
  getToken(): string | null {
    return sessionStorage.getItem(this.TOKEN_KEY);
  }
  
  removeToken(): void {
    sessionStorage.removeItem(this.TOKEN_KEY);
  }
}
```

---

## HTTP Interceptors

### Add Auth Headers

```typescript
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenService = inject(TokenService);
  const token = tokenService.getToken();
  
  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
  
  return next(req);
};
```

---

## Sanitization

### Use Angular's Built-in Sanitization

```typescript
import { DomSanitizer } from '@angular/platform-browser';

@Pipe({ name: 'safeHtml' })
export class SafeHtmlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}
  
  transform(value: string): SafeHtml {
    return this.sanitizer.sanitize(SecurityContext.HTML, value) || '';
  }
}

// Usage
<div [innerHTML]="htmlContent | safeHtml"></div>
```

---

## CSRF Protection

### Enable CSRF Tokens

```typescript
// app.config.ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withXsrfConfiguration({
        cookieName: 'XSRF-TOKEN',
        headerName: 'X-XSRF-TOKEN'
      })
    )
  ]
};
```

---

## Related Documentation

- **See Also:** [Error Handling](../core/error-handling.md) - Error management
- **Reference:** [HTTP Communication](../core/http-layer.md) - HTTP service

---

**Document Version:** 2.0  
**Last Updated:** November 2025  
**Maintained By:** Frontend Architecture Team

