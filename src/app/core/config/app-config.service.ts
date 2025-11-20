import { Injectable, inject } from '@angular/core';
import { EnvironmentService } from '@core/services/environment.service';
import { ApiConfig, createApiConfig } from './api.config';
import { API_CONFIG, AUTH_CONFIG, UI_CONFIG, STORAGE_KEYS, DATE_FORMATS } from './constants';

/**
 * Runtime application configuration service.
 * Provides centralized access to all application configuration including
 * API endpoints, constants, and environment-specific settings.
 *
 * @example
 * ```typescript
 * export class MyComponent {
 *   private appConfig = inject(AppConfigService);
 *
 *   ngOnInit(): void {
 *     const loginUrl = this.appConfig.api.endpoints.auth.login;
 *     const timeout = this.appConfig.apiTimeout;
 *   }
 * }
 * ```
 */
@Injectable({
    providedIn: 'root'
})
export class AppConfigService {
    private readonly envService = inject(EnvironmentService);
    private readonly apiConfig: ApiConfig;

    constructor() {
        // Initialize API configuration from environment
        this.apiConfig = createApiConfig(this.envService.apiUrl);
    }

    /**
     * Gets the complete API configuration including base URL and all endpoints.
     */
    get api(): Readonly<ApiConfig> {
        return this.apiConfig;
    }

    /**
     * Gets the application name.
     */
    get appName(): string {
        return this.envService.appName;
    }

    /**
     * Gets the application version.
     */
    get appVersion(): string {
        return this.envService.version;
    }

    /**
     * Checks if the application is running in production mode.
     */
    get isProduction(): boolean {
        return this.envService.isProduction;
    }

    /**
     * Checks if debug tools are enabled.
     */
    get debugEnabled(): boolean {
        return this.envService.debugToolsEnabled;
    }

    /**
     * Gets the current log level.
     */
    get logLevel(): string {
        return this.envService.logLevel;
    }

    /**
     * Gets the API timeout in milliseconds.
     */
    get apiTimeout(): number {
        return API_CONFIG.TIMEOUT;
    }

    /**
     * Gets the number of retry attempts for failed API calls.
     */
    get apiRetryAttempts(): number {
        return API_CONFIG.RETRY_ATTEMPTS;
    }

    /**
     * Gets the delay between retry attempts in milliseconds.
     */
    get apiRetryDelay(): number {
        return API_CONFIG.RETRY_DELAY;
    }

    /**
     * Gets the default page size for paginated requests.
     */
    get defaultPageSize(): number {
        return API_CONFIG.PAGE_SIZE_DEFAULT;
    }

    /**
     * Gets the available page size options.
     */
    get pageSizeOptions(): readonly number[] {
        return API_CONFIG.PAGE_SIZE_OPTIONS;
    }

    /**
     * Gets the authentication configuration.
     */
    get authConfig(): typeof AUTH_CONFIG {
        return AUTH_CONFIG;
    }

    /**
     * Gets the UI configuration.
     */
    get uiConfig(): typeof UI_CONFIG {
        return UI_CONFIG;
    }

    /**
     * Gets the storage keys.
     */
    get storageKeys(): typeof STORAGE_KEYS {
        return STORAGE_KEYS;
    }

    /**
     * Gets the date format constants.
     */
    get dateFormats(): typeof DATE_FORMATS {
        return DATE_FORMATS;
    }

    /**
     * Checks if a specific feature is enabled.
     * @param feature - The feature name
     */
    isFeatureEnabled(feature: string): boolean {
        return this.envService.isFeatureEnabled(feature as any);
    }

    /**
     * Gets a specific API endpoint by path.
     * Useful for dynamic endpoint access.
     *
     * @example
     * ```typescript
     * const employeeUrl = this.appConfig.getEndpoint('employees.byId', '123');
     * ```
     */
    getEndpoint(path: string, ...args: string[]): string {
        const parts = path.split('.');
        let endpoint: any = this.apiConfig.endpoints;

        for (const part of parts) {
            endpoint = endpoint[part];
            if (!endpoint) {
                throw new Error(`Invalid endpoint path: ${path}`);
            }
        }

        // If endpoint is a function, call it with arguments
        if (typeof endpoint === 'function') {
            return endpoint(...args);
        }

        return endpoint;
    }

    /**
     * Gets a configuration value by key path.
     * Supports nested property access using dot notation.
     *
     * @param keyPath - The configuration key path (e.g., 'api.timeout')
     * @param defaultValue - Default value if key is not found
     *
     * @example
     * ```typescript
     * const timeout = this.appConfig.get<number>('apiTimeout');
     * const customValue = this.appConfig.get<string>('custom.key', 'default');
     * ```
     */
    get<T>(keyPath: string, defaultValue?: T): T | undefined {
        const keys = keyPath.split('.');
        let value: any = this;

        for (const key of keys) {
            if (value && typeof value === 'object' && key in value) {
                value = value[key];
            } else {
                return defaultValue;
            }
        }

        return value as T;
    }
}
