import { Injectable, InjectionToken } from '@angular/core';
import { environment } from '@environments/environment';
import { Environment } from '@environments/environment.interface';

/**
 * Injection token for environment configuration.
 * This allows for better testing and dependency injection.
 */
export const ENVIRONMENT = new InjectionToken<Environment>('environment', {
    providedIn: 'root',
    factory: () => environment
});

/**
 * Service to access environment configuration throughout the application.
 * This service provides a centralized way to access environment variables
 * with proper typing and encapsulation.
 */
@Injectable({
    providedIn: 'root'
})
export class EnvironmentService {
    private readonly env: Environment = environment;

    /**
     * Gets the complete environment configuration object.
     */
    get config(): Readonly<Environment> {
        return this.env;
    }

    /**
     * Checks if the application is running in production mode.
     */
    get isProduction(): boolean {
        return this.env.production;
    }

    /**
     * Gets the API base URL.
     */
    get apiUrl(): string {
        return this.env.apiUrl;
    }

    /**
     * Gets the application name.
     */
    get appName(): string {
        return this.env.appName;
    }

    /**
     * Gets the application version.
     */
    get version(): string {
        return this.env.version;
    }

    /**
     * Checks if debug tools are enabled.
     */
    get debugToolsEnabled(): boolean {
        return this.env.enableDebugTools;
    }

    /**
     * Gets the current log level.
     */
    get logLevel(): string {
        return this.env.logLevel;
    }

    /**
     * Checks if a specific feature is enabled.
     */
    isFeatureEnabled(feature: keyof Environment['features']): boolean {
        return this.env.features[feature];
    }
}
