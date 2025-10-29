/**
 * Environment configuration interface.
 * This interface defines the structure of environment configuration objects.
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface Environment {
    production: boolean;
    apiUrl: string;
    appName: string;
    version: string;
    enableDebugTools: boolean;
    logLevel: LogLevel;
    features: {
        analytics: boolean;
        errorTracking: boolean;
    };
}
