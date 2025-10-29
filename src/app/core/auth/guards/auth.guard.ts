import { inject } from '@angular/core';
import { Router, CanActivateFn, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { TokenService } from '../services/token.service';

/**
 * Auth guard that protects routes from unauthorized access.
 * Redirects unauthenticated users to the login page.
 * 
 * Usage in routes:
 * ```typescript
 * {
 *   path: 'protected',
 *   component: ProtectedComponent,
 *   canActivate: [authGuard]
 * }
 * ```
 */
export const authGuard: CanActivateFn = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
) => {
    const authService = inject(AuthService);
    const tokenService = inject(TokenService);
    const router = inject(Router);

    // Check if user is authenticated
    const isAuthenticated = authService.isAuthenticated();
    const hasValidToken = tokenService.isTokenValid();

    if (isAuthenticated && hasValidToken) {
        return true;
    }

    // Store the attempted URL for redirecting after login
    const returnUrl = state.url;

    // Redirect to login page with return url
    router.navigate(['/auth/login'], {
        queryParams: { returnUrl }
    });

    return false;
};

/**
 * Guard that redirects authenticated users away from auth pages.
 * Useful for login/register pages - prevents authenticated users from accessing them.
 * 
 * Usage in routes:
 * ```typescript
 * {
 *   path: 'login',
 *   component: LoginComponent,
 *   canActivate: [noAuthGuard]
 * }
 * ```
 */
export const noAuthGuard: CanActivateFn = () => {
    const authService = inject(AuthService);
    const tokenService = inject(TokenService);
    const router = inject(Router);

    const isAuthenticated = authService.isAuthenticated();
    const hasValidToken = tokenService.isTokenValid();

    if (isAuthenticated && hasValidToken) {
        // User is already authenticated, redirect to home
        router.navigate(['/']);
        return false;
    }

    return true;
};

