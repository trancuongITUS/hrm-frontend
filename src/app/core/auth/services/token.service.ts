import { Injectable, inject } from '@angular/core';
import { JwtPayload } from '../models/auth.model';

/**
 * Service for managing JWT tokens in localStorage.
 * Handles storage, retrieval, and validation of access and refresh tokens.
 */
@Injectable({
    providedIn: 'root'
})
export class TokenService {
    private readonly ACCESS_TOKEN_KEY = 'access_token';
    private readonly REFRESH_TOKEN_KEY = 'refresh_token';
    private readonly TOKEN_EXPIRY_KEY = 'token_expiry';

    /**
     * Stores the access token in localStorage.
     */
    setAccessToken(token: string): void {
        if (token) {
            localStorage.setItem(this.ACCESS_TOKEN_KEY, token);

            // Calculate and store expiry time
            const payload = this.decodeToken(token);
            if (payload?.exp) {
                localStorage.setItem(this.TOKEN_EXPIRY_KEY, payload.exp.toString());
            }
        }
    }

    /**
     * Retrieves the access token from localStorage.
     */
    getAccessToken(): string | null {
        return localStorage.getItem(this.ACCESS_TOKEN_KEY);
    }

    /**
     * Stores the refresh token in localStorage.
     */
    setRefreshToken(token: string): void {
        if (token) {
            localStorage.setItem(this.REFRESH_TOKEN_KEY, token);
        }
    }

    /**
     * Retrieves the refresh token from localStorage.
     */
    getRefreshToken(): string | null {
        return localStorage.getItem(this.REFRESH_TOKEN_KEY);
    }

    /**
     * Removes all tokens from localStorage.
     */
    clearTokens(): void {
        localStorage.removeItem(this.ACCESS_TOKEN_KEY);
        localStorage.removeItem(this.REFRESH_TOKEN_KEY);
        localStorage.removeItem(this.TOKEN_EXPIRY_KEY);
    }

    /**
     * Checks if the access token exists.
     */
    hasToken(): boolean {
        return !!this.getAccessToken();
    }

    /**
     * Checks if the access token is expired.
     */
    isTokenExpired(): boolean {
        const token = this.getAccessToken();
        if (!token) {
            return true;
        }

        const payload = this.decodeToken(token);
        if (!payload?.exp) {
            return true;
        }

        // Check if token is expired (with 30 second buffer)
        const expirationTime = payload.exp * 1000; // Convert to milliseconds
        const currentTime = Date.now();
        const bufferTime = 30 * 1000; // 30 seconds buffer

        return currentTime >= expirationTime - bufferTime;
    }

    /**
     * Checks if the token is valid (exists and not expired).
     */
    isTokenValid(): boolean {
        return this.hasToken() && !this.isTokenExpired();
    }

    /**
     * Decodes a JWT token without verification.
     * Note: This should only be used for reading token data, not for validation.
     */
    decodeToken(token: string): JwtPayload | null {
        try {
            const parts = token.split('.');
            if (parts.length !== 3) {
                return null;
            }

            const payload = parts[1];
            const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
            return JSON.parse(decoded) as JwtPayload;
        } catch (error) {
            console.error('Error decoding token:', error);
            return null;
        }
    }

    /**
     * Gets the user ID from the token payload.
     */
    getUserIdFromToken(): string | null {
        const token = this.getAccessToken();
        if (!token) {
            return null;
        }

        const payload = this.decodeToken(token);
        return payload?.sub ?? null;
    }

    /**
     * Gets the user roles from the token payload.
     */
    getUserRolesFromToken(): string[] {
        const token = this.getAccessToken();
        if (!token) {
            return [];
        }

        const payload = this.decodeToken(token);
        return payload?.roles ?? [];
    }

    /**
     * Gets the token expiration time in milliseconds.
     */
    getTokenExpiration(): number | null {
        const token = this.getAccessToken();
        if (!token) {
            return null;
        }

        const payload = this.decodeToken(token);
        if (!payload?.exp) {
            return null;
        }

        return payload.exp * 1000; // Convert to milliseconds
    }

    /**
     * Gets the time remaining until token expiration in seconds.
     */
    getTimeUntilExpiration(): number {
        const expiration = this.getTokenExpiration();
        if (!expiration) {
            return 0;
        }

        const timeRemaining = Math.floor((expiration - Date.now()) / 1000);
        return Math.max(0, timeRemaining);
    }
}
