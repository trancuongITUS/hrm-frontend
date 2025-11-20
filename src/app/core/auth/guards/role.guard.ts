import { inject } from '@angular/core';
import { Router, CanActivateFn, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { TokenService } from '../services/token.service';

/**
 * Factory function that creates a role-based guard.
 * Checks if the user has one or more required roles.
 *
 * Usage in routes:
 * ```typescript
 * {
 *   path: 'admin',
 *   component: AdminComponent,
 *   canActivate: [authGuard, roleGuard(['ADMIN'])]
 * }
 *
 * // Multiple roles (user must have at least one)
 * {
 *   path: 'management',
 *   component: ManagementComponent,
 *   canActivate: [authGuard, roleGuard(['ADMIN', 'MANAGER'])]
 * }
 * ```
 */
export function roleGuard(allowedRoles: string[]): CanActivateFn {
    return (route: ActivatedRouteSnapshot) => {
        const authService = inject(AuthService);
        const tokenService = inject(TokenService);
        const router = inject(Router);

        // First check if user is authenticated
        if (!authService.isAuthenticated() || !tokenService.isTokenValid()) {
            router.navigate(['/auth/login']);
            return false;
        }

        // Check if user has any of the required roles
        const hasRequiredRole = authService.hasAnyRole(allowedRoles);

        if (!hasRequiredRole) {
            // User doesn't have required role, redirect to access denied page
            router.navigate(['/auth/access']);
            return false;
        }

        return true;
    };
}

/**
 * Factory function that creates a strict role-based guard.
 * Checks if the user has all required roles.
 *
 * Usage in routes:
 * ```typescript
 * {
 *   path: 'super-admin',
 *   component: SuperAdminComponent,
 *   canActivate: [authGuard, strictRoleGuard(['ADMIN', 'SUPER_USER'])]
 * }
 * ```
 */
export function strictRoleGuard(requiredRoles: string[]): CanActivateFn {
    return (route: ActivatedRouteSnapshot) => {
        const authService = inject(AuthService);
        const tokenService = inject(TokenService);
        const router = inject(Router);

        // First check if user is authenticated
        if (!authService.isAuthenticated() || !tokenService.isTokenValid()) {
            router.navigate(['/auth/login']);
            return false;
        }

        // Check if user has all required roles
        const hasAllRoles = authService.hasAllRoles(requiredRoles);

        if (!hasAllRoles) {
            router.navigate(['/auth/access']);
            return false;
        }

        return true;
    };
}

/**
 * Factory function that creates a permission-based guard.
 * Checks if the user has a specific permission.
 *
 * Usage in routes:
 * ```typescript
 * {
 *   path: 'users/edit',
 *   component: UserEditComponent,
 *   canActivate: [authGuard, permissionGuard('users.edit')]
 * }
 * ```
 */
export function permissionGuard(permission: string): CanActivateFn {
    return (route: ActivatedRouteSnapshot) => {
        const authService = inject(AuthService);
        const tokenService = inject(TokenService);
        const router = inject(Router);

        // First check if user is authenticated
        if (!authService.isAuthenticated() || !tokenService.isTokenValid()) {
            router.navigate(['/auth/login']);
            return false;
        }

        // Check if user has the required permission
        const hasPermission = authService.hasPermission(permission);

        if (!hasPermission) {
            router.navigate(['/auth/access']);
            return false;
        }

        return true;
    };
}

/**
 * Guard that can read allowed roles from route data.
 * More flexible approach using route configuration.
 *
 * Usage in routes:
 * ```typescript
 * {
 *   path: 'admin',
 *   component: AdminComponent,
 *   canActivate: [authGuard, dataRoleGuard],
 *   data: { roles: ['ADMIN', 'MANAGER'] }
 * }
 * ```
 */
export const dataRoleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
    const authService = inject(AuthService);
    const tokenService = inject(TokenService);
    const router = inject(Router);

    // First check if user is authenticated
    if (!authService.isAuthenticated() || !tokenService.isTokenValid()) {
        router.navigate(['/auth/login']);
        return false;
    }

    // Get allowed roles from route data
    const allowedRoles = route.data['roles'] as string[] | undefined;

    if (!allowedRoles || allowedRoles.length === 0) {
        // No role restrictions, allow access
        return true;
    }

    // Check if user has any of the required roles
    const hasRequiredRole = authService.hasAnyRole(allowedRoles);

    if (!hasRequiredRole) {
        router.navigate(['/auth/access']);
        return false;
    }

    return true;
};
