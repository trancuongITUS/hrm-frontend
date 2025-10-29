/**
 * Development environment configuration.
 * This configuration is used when running `ng serve` or `ng build` without production flag.
 */
import { Environment } from './environment.interface';

export const environment: Environment = {
    production: false,
    apiUrl: 'http://localhost:3000/api',
    appName: 'HRM Frontend (Dev)',
    version: '1.0.0-dev',
    enableDebugTools: true,
    logLevel: 'debug',
    features: {
        analytics: false,
        errorTracking: false
    }
};
