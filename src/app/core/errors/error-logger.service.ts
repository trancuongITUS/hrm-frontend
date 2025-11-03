import { Injectable, inject } from '@angular/core';
import { LoggerService } from '@core/services/logger.service';
import { EnvironmentService } from '@core/services/environment.service';
import { ErrorInfo, ErrorSeverity, ErrorType, ApplicationError } from './error.model';

/**
 * Error logging configuration interface.
 */
interface ErrorLogConfig {
    readonly logToConsole: boolean;
    readonly logToServer: boolean;
    readonly includeStackTrace: boolean;
    readonly includeContext: boolean;
}

/**
 * Service responsible for structured error logging.
 * Provides centralized error logging with support for different error types and severities.
 */
@Injectable({
    providedIn: 'root'
})
export class ErrorLoggerService {
    private readonly logger = inject(LoggerService);
    private readonly envService = inject(EnvironmentService);

    private readonly config: ErrorLogConfig = {
        logToConsole: true,
        logToServer: !this.envService.isProduction,
        includeStackTrace: !this.envService.isProduction,
        includeContext: true
    };

    /**
     * Logs an error with structured information.
     */
    logError(error: Error | ApplicationError | unknown): void {
        const appError = this.normalizeError(error);
        const errorInfo = this.createErrorInfo(appError);

        this.logToConsole(errorInfo, appError);

        if (this.config.logToServer && this.shouldLogToServer(errorInfo)) {
            this.logToServer(errorInfo);
        }
    }

    /**
     * Logs an HTTP error with specific HTTP details.
     */
    logHttpError(
        error: unknown,
        statusCode: number,
        url: string,
        method: string
    ): void {
        const message = this.extractErrorMessage(error);
        const appError = new ApplicationError(
            message,
            ErrorType.HTTP,
            this.getSeverityFromStatus(statusCode),
            {
                statusCode,
                context: {
                    url,
                    method,
                    timestamp: new Date().toISOString()
                }
            }
        );

        this.logError(appError);
    }

    /**
     * Logs a validation error with field-specific details.
     */
    logValidationError(
        message: string,
        field?: string,
        context?: Record<string, unknown>
    ): void {
        const appError = new ApplicationError(
            message,
            ErrorType.VALIDATION,
            ErrorSeverity.LOW,
            {
                context: {
                    field,
                    ...context
                }
            }
        );

        this.logError(appError);
    }

    /**
     * Logs a network error.
     */
    logNetworkError(message: string, context?: Record<string, unknown>): void {
        const appError = new ApplicationError(
            message,
            ErrorType.NETWORK,
            ErrorSeverity.HIGH,
            { context }
        );

        this.logError(appError);
    }

    /**
     * Logs a business logic error.
     */
    logBusinessError(message: string, context?: Record<string, unknown>): void {
        const appError = new ApplicationError(
            message,
            ErrorType.BUSINESS,
            ErrorSeverity.MEDIUM,
            { context }
        );

        this.logError(appError);
    }

    /**
     * Logs an authentication error.
     */
    logAuthenticationError(message: string, context?: Record<string, unknown>): void {
        const appError = new ApplicationError(
            message,
            ErrorType.AUTHENTICATION,
            ErrorSeverity.HIGH,
            { context }
        );

        this.logError(appError);
    }

    /**
     * Logs an authorization error.
     */
    logAuthorizationError(message: string, context?: Record<string, unknown>): void {
        const appError = new ApplicationError(
            message,
            ErrorType.AUTHORIZATION,
            ErrorSeverity.MEDIUM,
            { context }
        );

        this.logError(appError);
    }

    /**
     * Normalizes any error type to ApplicationError.
     */
    private normalizeError(error: unknown): ApplicationError {
        if (error instanceof ApplicationError) {
            return error;
        }

        return ApplicationError.fromError(error);
    }

    /**
     * Creates structured error information from ApplicationError.
     */
    private createErrorInfo(error: ApplicationError): ErrorInfo {
        return {
            message: error.message,
            type: error.type,
            severity: error.severity,
            timestamp: error.timestamp,
            code: error.code,
            statusCode: error.statusCode,
            stack: this.config.includeStackTrace ? error.stack : undefined,
            context: this.config.includeContext ? error.context : undefined
        };
    }

    /**
     * Logs error information to console based on severity.
     */
    private logToConsole(errorInfo: ErrorInfo, error: ApplicationError): void {
        if (!this.config.logToConsole) {
            return;
        }

        const logMessage = this.formatLogMessage(errorInfo);
        const logData = this.formatLogData(errorInfo, error);

        switch (errorInfo.severity) {
            case ErrorSeverity.CRITICAL:
            case ErrorSeverity.HIGH:
                this.logger.error(logMessage, logData);
                break;

            case ErrorSeverity.MEDIUM:
                this.logger.warn(logMessage, logData);
                break;

            case ErrorSeverity.LOW:
                this.logger.info(logMessage, logData);
                break;

            default:
                this.logger.debug(logMessage, logData);
        }
    }

    /**
     * Formats the log message for console output.
     */
    private formatLogMessage(errorInfo: ErrorInfo): string {
        const parts = [
            `[${errorInfo.type.toUpperCase()}]`,
            errorInfo.code ? `[${errorInfo.code}]` : '',
            errorInfo.statusCode ? `[${errorInfo.statusCode}]` : '',
            errorInfo.message
        ].filter(Boolean);

        return parts.join(' ');
    }

    /**
     * Formats additional log data for console output.
     */
    private formatLogData(errorInfo: ErrorInfo, error: ApplicationError): Record<string, unknown> {
        const data: Record<string, unknown> = {
            type: errorInfo.type,
            severity: errorInfo.severity,
            timestamp: errorInfo.timestamp.toISOString()
        };

        if (errorInfo.code) {
            data['code'] = errorInfo.code;
        }

        if (errorInfo.statusCode) {
            data['statusCode'] = errorInfo.statusCode;
        }

        if (errorInfo.context) {
            data['context'] = errorInfo.context;
        }

        if (errorInfo.stack && this.config.includeStackTrace) {
            data['stack'] = errorInfo.stack;
        }

        if (error.originalError) {
            data['originalError'] = {
                name: error.originalError.name,
                message: error.originalError.message
            };
        }

        return data;
    }

    /**
     * Determines if error should be logged to server.
     */
    private shouldLogToServer(errorInfo: ErrorInfo): boolean {
        // Only log high severity errors to server in production
        if (this.envService.isProduction) {
            return errorInfo.severity === ErrorSeverity.HIGH || 
                   errorInfo.severity === ErrorSeverity.CRITICAL;
        }

        // Log all errors to server in development
        return true;
    }

    /**
     * Logs error information to remote server.
     * This is a placeholder implementation. In production, this would send
     * error data to a logging service like Sentry, LogRocket, etc.
     */
    private logToServer(errorInfo: ErrorInfo): void {
        // TODO: Implement remote logging service integration
        // Example: Send to Sentry, LogRocket, CloudWatch, etc.
        
        if (!this.envService.isProduction) {
            this.logger.debug('[ErrorLogger] Would log to server in production:', errorInfo);
        }

        // Example implementation:
        // this.http.post('/api/logs/errors', errorInfo).subscribe({
        //     error: (err) => console.error('Failed to log error to server', err)
        // });
    }

    /**
     * Extracts error message from various error types.
     */
    private extractErrorMessage(error: unknown): string {
        if (error instanceof Error) {
            return error.message;
        }

        if (typeof error === 'string') {
            return error;
        }

        if (error && typeof error === 'object' && 'message' in error) {
            return String((error as { message: unknown }).message);
        }

        return 'An unknown error occurred';
    }

    /**
     * Determines error severity based on HTTP status code.
     */
    private getSeverityFromStatus(statusCode: number): ErrorSeverity {
        if (statusCode >= 500) {
            return ErrorSeverity.CRITICAL;
        }
        if (statusCode === 401 || statusCode === 403) {
            return ErrorSeverity.HIGH;
        }
        if (statusCode >= 400) {
            return ErrorSeverity.MEDIUM;
        }
        return ErrorSeverity.LOW;
    }
}

