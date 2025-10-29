/**
 * Base environment configuration.
 * This file is used as a fallback and should contain default values.
 */
import { Environment } from './environment.interface';

export const environment: Environment = {
    production: false,
    apiUrl: 'http://localhost:3000/api',
    appName: 'HRM Frontend',
    version: '1.0.0',
    enableDebugTools: true,
    logLevel: 'debug',
    features: {
        analytics: false,
        errorTracking: false
    }
};
