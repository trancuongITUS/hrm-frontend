import { InjectionToken } from '@angular/core';

/**
 * API endpoint configuration interface.
 * Extend this interface to add feature-specific endpoints as needed.
 */
export interface ApiEndpoints {
    readonly auth: {
        readonly login: string;
        readonly logout: string;
        readonly register: string;
        readonly refreshToken: string;
        readonly forgotPassword: string;
        readonly resetPassword: string;
        readonly verifyEmail: string;
        readonly changePassword: string;
    };
}

/**
 * API configuration with base URL and version.
 */
export interface ApiConfig {
    readonly baseUrl: string;
    readonly version: string;
    readonly endpoints: ApiEndpoints;
}

/**
 * Injection token for API configuration.
 */
export const API_CONFIG_TOKEN = new InjectionToken<ApiConfig>('api.config');

/**
 * Factory function to create API endpoints configuration.
 * @param baseUrl - The base API URL
 * @param version - The API version (e.g., 'v1')
 */
export function createApiEndpoints(baseUrl: string, version: string): ApiEndpoints {
    const apiBase = `${baseUrl}/${version}`;

    return {
        auth: {
            login: `${apiBase}/auth/login`,
            logout: `${apiBase}/auth/logout`,
            register: `${apiBase}/auth/register`,
            refreshToken: `${apiBase}/auth/refresh-token`,
            forgotPassword: `${apiBase}/auth/forgot-password`,
            resetPassword: `${apiBase}/auth/reset-password`,
            verifyEmail: `${apiBase}/auth/verify-email`,
            changePassword: `${apiBase}/auth/change-password`,
        },
    };
}

/**
 * Factory function to create complete API configuration.
 * @param baseUrl - The base API URL from environment
 */
export function createApiConfig(baseUrl: string): ApiConfig {
    const version = 'v1';
    return {
        baseUrl,
        version,
        endpoints: createApiEndpoints(baseUrl, version),
    };
}

