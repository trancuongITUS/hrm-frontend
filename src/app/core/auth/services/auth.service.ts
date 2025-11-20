import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, throwError, of, timer } from 'rxjs';
import { map, tap, catchError, switchMap, shareReplay } from 'rxjs/operators';
import { TokenService } from './token.service';
import { SessionService } from './session.service';
import { LoginCredentials, AuthResponse, RefreshTokenRequest, RefreshTokenResponse, PasswordResetRequest, PasswordResetConfirmation, RegistrationData } from '../models/auth.model';
import { User } from '../models/user.model';

/**
 * Authentication service that handles login, logout, token refresh, and user authentication state.
 * Uses modern Angular patterns with signals and functional dependency injection.
 */
@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private readonly http = inject(HttpClient);
    private readonly router = inject(Router);
    private readonly tokenService = inject(TokenService);
    private readonly sessionService = inject(SessionService);

    // Authentication endpoints
    private readonly AUTH_ENDPOINTS = {
        LOGIN: '/auth/login',
        LOGOUT: '/auth/logout',
        REFRESH: '/auth/refresh',
        ME: '/auth/me',
        REGISTER: '/auth/register',
        PASSWORD_RESET: '/auth/password-reset',
        PASSWORD_RESET_CONFIRM: '/auth/password-reset-confirm'
    };

    // Loading state
    private readonly loadingSubject = new BehaviorSubject<boolean>(false);
    readonly loading$ = this.loadingSubject.asObservable();

    // Error state
    private readonly errorSubject = new BehaviorSubject<string | null>(null);
    readonly error$ = this.errorSubject.asObservable();

    // Authentication state (delegated to SessionService)
    readonly isAuthenticated = this.sessionService.isAuthenticated;
    readonly currentUser = this.sessionService.user;
    readonly userProfile = this.sessionService.userProfile;

    // Token refresh observable to prevent multiple simultaneous refresh requests
    private refreshTokenInProgress = false;
    private refreshTokenSubject = new BehaviorSubject<string | null>(null);

    constructor() {
        this.initializeAuth();
    }

    /**
     * Initializes authentication by checking for stored tokens and validating session.
     */
    private initializeAuth(): void {
        if (this.tokenService.isTokenValid() && this.sessionService.hasStoredSession()) {
            // Token and session exist, verify with server
            this.verifySession().subscribe({
                error: () => this.handleAuthError()
            });
        } else {
            // Clear invalid session
            this.clearAuthState();
        }
    }

    /**
     * Authenticates a user with email and password.
     */
    login(credentials: LoginCredentials): Observable<AuthResponse> {
        this.setLoading(true);
        this.clearError();

        return this.http.post<AuthResponse>(this.AUTH_ENDPOINTS.LOGIN, credentials).pipe(
            tap((response) => this.handleAuthSuccess(response)),
            catchError((error) => this.handleError('Login failed', error)),
            tap(() => this.setLoading(false))
        );
    }

    /**
     * Registers a new user.
     */
    register(data: RegistrationData): Observable<AuthResponse> {
        this.setLoading(true);
        this.clearError();

        return this.http.post<AuthResponse>(this.AUTH_ENDPOINTS.REGISTER, data).pipe(
            tap((response) => this.handleAuthSuccess(response)),
            catchError((error) => this.handleError('Registration failed', error)),
            tap(() => this.setLoading(false))
        );
    }

    /**
     * Logs out the current user.
     */
    logout(): Observable<void> {
        this.setLoading(true);

        // Call logout endpoint (optional, depends on backend)
        return this.http.post<void>(this.AUTH_ENDPOINTS.LOGOUT, {}).pipe(
            catchError(() => of(void 0)), // Ignore errors on logout
            tap(() => {
                this.clearAuthState();
                this.router.navigate(['/auth/login']);
            }),
            tap(() => this.setLoading(false))
        );
    }

    /**
     * Logs out the user locally without calling the backend.
     */
    logoutLocal(): void {
        this.clearAuthState();
        this.router.navigate(['/auth/login']);
    }

    /**
     * Refreshes the access token using the refresh token.
     */
    refreshToken(): Observable<string> {
        // If refresh is already in progress, wait for it to complete
        if (this.refreshTokenInProgress) {
            return this.refreshTokenSubject.asObservable().pipe(switchMap((token) => (token ? of(token) : throwError(() => new Error('Token refresh failed')))));
        }

        const refreshToken = this.tokenService.getRefreshToken();
        if (!refreshToken) {
            return throwError(() => new Error('No refresh token available'));
        }

        this.refreshTokenInProgress = true;
        this.refreshTokenSubject.next(null);

        const request: RefreshTokenRequest = { refreshToken };

        return this.http.post<RefreshTokenResponse>(this.AUTH_ENDPOINTS.REFRESH, request).pipe(
            tap((response) => {
                this.tokenService.setAccessToken(response.accessToken);
                this.tokenService.setRefreshToken(response.refreshToken);
                this.refreshTokenSubject.next(response.accessToken);
            }),
            map((response) => response.accessToken),
            catchError((error) => {
                this.handleAuthError();
                return throwError(() => error);
            }),
            tap(() => {
                this.refreshTokenInProgress = false;
            }),
            shareReplay(1)
        );
    }

    /**
     * Verifies the current session by fetching user data from the server.
     */
    verifySession(): Observable<User> {
        return this.http.get<User>(this.AUTH_ENDPOINTS.ME).pipe(
            tap((user) => this.sessionService.setUser(user)),
            catchError((error) => {
                this.handleAuthError();
                return throwError(() => error);
            })
        );
    }

    /**
     * Initiates password reset process.
     */
    requestPasswordReset(request: PasswordResetRequest): Observable<void> {
        this.setLoading(true);
        this.clearError();

        return this.http.post<void>(this.AUTH_ENDPOINTS.PASSWORD_RESET, request).pipe(
            catchError((error) => this.handleError('Password reset request failed', error)),
            tap(() => this.setLoading(false))
        );
    }

    /**
     * Confirms password reset with new password.
     */
    confirmPasswordReset(confirmation: PasswordResetConfirmation): Observable<void> {
        this.setLoading(true);
        this.clearError();

        return this.http.post<void>(this.AUTH_ENDPOINTS.PASSWORD_RESET_CONFIRM, confirmation).pipe(
            catchError((error) => this.handleError('Password reset confirmation failed', error)),
            tap(() => this.setLoading(false))
        );
    }

    /**
     * Checks if the user has a specific role.
     */
    hasRole(role: string): boolean {
        return this.sessionService.hasRole(role);
    }

    /**
     * Checks if the user has any of the specified roles.
     */
    hasAnyRole(roles: string[]): boolean {
        return this.sessionService.hasAnyRole(roles);
    }

    /**
     * Checks if the user has all of the specified roles.
     */
    hasAllRoles(roles: string[]): boolean {
        return this.sessionService.hasAllRoles(roles);
    }

    /**
     * Checks if the user has a specific permission.
     */
    hasPermission(permission: string): boolean {
        return this.sessionService.hasPermission(permission);
    }

    /**
     * Handles successful authentication response.
     */
    private handleAuthSuccess(response: AuthResponse): void {
        this.tokenService.setAccessToken(response.accessToken);
        this.tokenService.setRefreshToken(response.refreshToken);
        this.sessionService.setUser(response.user);
        this.clearError();
    }

    /**
     * Handles authentication errors by clearing state and redirecting to login.
     */
    private handleAuthError(): void {
        this.clearAuthState();
        this.router.navigate(['/auth/login'], {
            queryParams: { returnUrl: this.router.url }
        });
    }

    /**
     * Clears all authentication state.
     */
    private clearAuthState(): void {
        this.tokenService.clearTokens();
        this.sessionService.clearSession();
    }

    /**
     * Sets loading state.
     */
    private setLoading(loading: boolean): void {
        this.loadingSubject.next(loading);
    }

    /**
     * Sets error message.
     */
    private setError(error: string): void {
        this.errorSubject.next(error);
    }

    /**
     * Clears error message.
     */
    private clearError(): void {
        this.errorSubject.next(null);
    }

    /**
     * Generic error handler.
     */
    private handleError(message: string, error: unknown): Observable<never> {
        const errorMessage = this.extractErrorMessage(error);
        this.setError(`${message}: ${errorMessage}`);
        this.setLoading(false);
        return throwError(() => error);
    }

    /**
     * Extracts error message from error object.
     */
    private extractErrorMessage(error: unknown): string {
        if (typeof error === 'string') {
            return error;
        }

        if (error && typeof error === 'object') {
            const err = error as { error?: { message?: string }; message?: string };
            return err.error?.message || err.message || 'Unknown error occurred';
        }

        return 'Unknown error occurred';
    }
}
