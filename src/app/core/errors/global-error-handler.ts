import { ErrorHandler, Injectable, inject, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { ErrorLoggerService } from './error-logger.service';
import { NotificationService } from '@core/services/notification.service';
import { ApplicationError, ErrorType, ErrorSeverity } from './error.model';

/**
 * Global error handler that catches all unhandled errors in the application.
 * Provides centralized error handling, logging, and user notification.
 *
 * This handler:
 * - Catches unhandled JavaScript errors
 * - Logs errors with detailed information
 * - Shows user-friendly error messages
 * - Prevents application crashes
 *
 * @example
 * ```typescript
 * // Register in app.config.ts
 * {
 *   providers: [
 *     { provide: ErrorHandler, useClass: GlobalErrorHandler }
 *   ]
 * }
 * ```
 */
@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
    private readonly injector = inject(Injector);

    // Lazy-loaded services to avoid circular dependencies during initialization
    private errorLogger?: ErrorLoggerService;
    private notificationService?: NotificationService;
    private router?: Router;

    /**
     * Handles any uncaught errors in the application.
     */
    handleError(error: Error | ApplicationError | unknown): void {
        // Get services lazily to avoid circular dependency issues
        this.errorLogger = this.errorLogger ?? this.injector.get(ErrorLoggerService);
        this.notificationService = this.notificationService ?? this.injector.get(NotificationService);
        this.router = this.router ?? this.injector.get(Router);

        try {
            const appError = this.normalizeError(error);

            // Log the error
            this.errorLogger.logError(appError);

            // Show user notification
            this.notifyUser(appError);

            // Handle critical errors
            if (appError.severity === ErrorSeverity.CRITICAL) {
                this.handleCriticalError(appError);
            }
        } catch (loggingError) {
            // Fallback if error handling itself fails
            console.error('Error in GlobalErrorHandler:', error);
            console.error('Additional error during error handling:', loggingError);
        }

        // Re-throw in development for debugging
        if (!this.isProduction()) {
            throw error;
        }
    }

    /**
     * Normalizes any error type to ApplicationError.
     */
    private normalizeError(error: unknown): ApplicationError {
        // Already an ApplicationError
        if (error instanceof ApplicationError) {
            return error;
        }

        // Standard Error
        if (error instanceof Error) {
            return this.categorizeError(error);
        }

        // Unknown error type
        const message = typeof error === 'string' ? error : 'An unexpected error occurred';
        return new ApplicationError(message, ErrorType.UNKNOWN, ErrorSeverity.MEDIUM);
    }

    /**
     * Categorizes standard Error objects into appropriate ApplicationError types.
     */
    private categorizeError(error: Error): ApplicationError {
        const errorName = error.name.toLowerCase();
        const errorMessage = error.message.toLowerCase();

        // Network errors
        if (errorName.includes('network') || errorMessage.includes('network') || errorMessage.includes('fetch') || errorMessage.includes('timeout')) {
            return new ApplicationError('Network connection error. Please check your internet connection.', ErrorType.NETWORK, ErrorSeverity.HIGH, { originalError: error });
        }

        // Reference errors (undefined variables, functions)
        if (errorName === 'referenceerror') {
            return new ApplicationError('A programming error occurred. Please refresh the page.', ErrorType.RUNTIME, ErrorSeverity.HIGH, { originalError: error });
        }

        // Type errors
        if (errorName === 'typeerror') {
            return new ApplicationError('An unexpected error occurred. Please try again.', ErrorType.RUNTIME, ErrorSeverity.MEDIUM, { originalError: error });
        }

        // Syntax errors
        if (errorName === 'syntaxerror') {
            return new ApplicationError('A system error occurred. Please refresh the page.', ErrorType.RUNTIME, ErrorSeverity.CRITICAL, { originalError: error });
        }

        // Default runtime error
        return new ApplicationError(error.message || 'An unexpected error occurred', ErrorType.RUNTIME, ErrorSeverity.MEDIUM, { originalError: error });
    }

    /**
     * Shows appropriate user notification based on error type and severity.
     */
    private notifyUser(error: ApplicationError): void {
        const userMessage = this.getUserFriendlyMessage(error);

        switch (error.severity) {
            case ErrorSeverity.CRITICAL:
                this.notificationService?.showError(
                    userMessage,
                    'Critical Error',
                    { life: 0 } // Persistent notification
                );
                break;

            case ErrorSeverity.HIGH:
                this.notificationService?.showError(userMessage, 'Error', { life: 10000 });
                break;

            case ErrorSeverity.MEDIUM:
                this.notificationService?.showWarning(userMessage, 'Warning', { life: 7000 });
                break;

            case ErrorSeverity.LOW:
                this.notificationService?.showInfo(userMessage, 'Notice', { life: 5000 });
                break;
        }
    }

    /**
     * Generates user-friendly error messages.
     */
    private getUserFriendlyMessage(error: ApplicationError): string {
        // Use custom message if provided
        if (error.message && !this.isTechnicalMessage(error.message)) {
            return error.message;
        }

        // Generate user-friendly message based on error type
        switch (error.type) {
            case ErrorType.NETWORK:
                return 'Network connection error. Please check your internet connection and try again.';

            case ErrorType.AUTHENTICATION:
                return 'Authentication failed. Please log in again.';

            case ErrorType.AUTHORIZATION:
                return 'You do not have permission to perform this action.';

            case ErrorType.VALIDATION:
                return 'Please check your input and try again.';

            case ErrorType.HTTP:
                if (error.statusCode && error.statusCode >= 500) {
                    return 'Server error. Our team has been notified. Please try again later.';
                }
                return 'An error occurred while processing your request. Please try again.';

            case ErrorType.BUSINESS:
                return error.message || 'Unable to complete the operation. Please try again.';

            case ErrorType.RUNTIME:
                return 'An unexpected error occurred. Please refresh the page and try again.';

            default:
                return 'Something went wrong. Please try again.';
        }
    }

    /**
     * Checks if message is too technical for end users.
     */
    private isTechnicalMessage(message: string): boolean {
        const technicalKeywords = ['undefined', 'null', 'cannot read property', 'is not a function', 'is not defined', 'syntaxerror', 'typeerror', 'referenceerror'];

        const lowerMessage = message.toLowerCase();
        return technicalKeywords.some((keyword) => lowerMessage.includes(keyword));
    }

    /**
     * Handles critical errors that may require special actions.
     */
    private handleCriticalError(error: ApplicationError): void {
        // Log critical error details
        console.error('CRITICAL ERROR:', {
            message: error.message,
            type: error.type,
            timestamp: error.timestamp,
            context: error.context
        });

        // For critical runtime errors, suggest page refresh
        if (error.type === ErrorType.RUNTIME) {
            setTimeout(() => {
                const shouldReload = confirm('A critical error occurred. Would you like to reload the page?');
                if (shouldReload) {
                    window.location.reload();
                }
            }, 2000);
        }

        // Navigate to error page for certain error types
        if (error.type === ErrorType.AUTHENTICATION) {
            this.router?.navigate(['/auth/login'], {
                queryParams: { error: 'session_expired' }
            });
        }
    }

    /**
     * Checks if running in production environment.
     */
    private isProduction(): boolean {
        // Check environment through window object or other means
        // This is a simple check; adjust based on your environment setup
        return !/localhost|127\.0\.0\.1|0\.0\.0\.0/.test(window.location.hostname);
    }
}
