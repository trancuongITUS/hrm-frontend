import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { LoggerService } from '@core/services/logger.service';
import { NotificationService } from '@core/services/notification.service';
import { ErrorLoggerService } from '@core/errors/error-logger.service';

/**
 * HTTP error interceptor that handles different types of HTTP errors globally.
 * Provides centralized error handling, logging, and user notifications.
 * 
 * Features:
 * - Handles client-side and server-side errors
 * - Provides user-friendly error notifications
 * - Logs errors with detailed information
 * - Routes to appropriate error pages
 * - Extracts and formats validation errors
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    const router = inject(Router);
    const logger = inject(LoggerService);
    const notificationService = inject(NotificationService);
    const errorLogger = inject(ErrorLoggerService);

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            let errorMessage = 'An unknown error occurred';
            let showNotification = true;

            if (error.error instanceof ErrorEvent) {
                // Client-side or network error
                errorMessage = 'Network connection error. Please check your internet connection.';
                
                errorLogger.logNetworkError(error.error.message, {
                    url: req.url,
                    method: req.method
                });

                notificationService.showNetworkError(errorMessage);
            } else {
                // Backend returned an unsuccessful response code
                
                // Handle specific error codes
                switch (error.status) {
                    case 0:
                        // Connection refused or network error
                        errorMessage = 'Unable to connect to server. Please check your internet connection.';
                        notificationService.showNetworkError(errorMessage);
                        break;
                    
                    case 400:
                        errorMessage = 'Bad request. Please check your input.';
                        // Extract validation errors if available
                        if (error.error?.errors && typeof error.error.errors === 'object') {
                            notificationService.showValidationErrors(
                                error.error.errors,
                                'Validation Error'
                            );
                            showNotification = false;
                        } else {
                            notificationService.showWarning(errorMessage, 'Invalid Request');
                        }
                        logger.warn('Bad Request (400):', error);
                        break;
                    
                    case 401:
                        errorMessage = 'Your session has expired. Please log in again.';
                        notificationService.showAuthenticationError(errorMessage);
                        showNotification = false;
                        
                        // Navigate to login after a short delay
                        setTimeout(() => {
                            router.navigate(['/auth/login'], {
                                queryParams: { returnUrl: router.url }
                            });
                        }, 2000);
                        
                        logger.warn('Unauthorized (401):', error);
                        break;
                    
                    case 403:
                        errorMessage = 'You do not have permission to access this resource.';
                        notificationService.showAuthorizationError(errorMessage);
                        showNotification = false;
                        router.navigate(['/auth/access']);
                        logger.warn('Forbidden (403):', error);
                        break;
                    
                    case 404:
                        errorMessage = 'The requested resource was not found.';
                        notificationService.showWarning(errorMessage, 'Not Found');
                        showNotification = false;
                        logger.warn('Not Found (404):', error);
                        break;
                    
                    case 422:
                        errorMessage = 'Validation error. Please check your input.';
                        // Extract validation errors if available
                        if (error.error?.errors) {
                            notificationService.showValidationErrors(
                                error.error.errors,
                                'Validation Error'
                            );
                            showNotification = false;
                        } else {
                            notificationService.showWarning(errorMessage, 'Validation Error');
                            showNotification = false;
                        }
                        logger.warn('Unprocessable Entity (422):', error);
                        break;
                    
                    case 429:
                        errorMessage = 'Too many requests. Please wait a moment and try again.';
                        notificationService.showWarning(errorMessage, 'Rate Limit Exceeded', {
                            life: 7000
                        });
                        showNotification = false;
                        logger.warn('Too Many Requests (429):', error);
                        break;
                    
                    case 500:
                        errorMessage = 'Internal server error. Our team has been notified. Please try again later.';
                        notificationService.showError(errorMessage, 'Server Error', {
                            life: 7000
                        });
                        showNotification = false;
                        logger.error('Internal Server Error (500):', error);
                        break;
                    
                    case 502:
                    case 503:
                    case 504:
                        errorMessage = 'Service temporarily unavailable. Please try again in a few moments.';
                        notificationService.showError(errorMessage, 'Service Unavailable', {
                            life: 7000
                        });
                        showNotification = false;
                        logger.error('Service Unavailable:', error);
                        break;
                    
                    default:
                        errorMessage = `Server error: ${error.status}`;
                        logger.error('HTTP Error:', error);
                }

                // Extract error message from response if available
                if (error.error?.message) {
                    errorMessage = error.error.message;
                } else if (error.error?.error) {
                    errorMessage = error.error.error;
                }

                // Log HTTP error with detailed information
                errorLogger.logHttpError(
                    errorMessage,
                    error.status,
                    req.url,
                    req.method
                );

                // Show generic notification if not already shown
                if (showNotification && error.status >= 400) {
                    if (error.status >= 500) {
                        notificationService.showError(errorMessage, 'Error');
                    } else {
                        notificationService.showWarning(errorMessage, 'Warning');
                    }
                }
            }

            // Log the error for debugging with structured context
            logger
                .withContext({
                    component: 'ErrorInterceptor',
                    action: 'handleHttpError'
                })
                .error(`HTTP Error [${req.method} ${req.url}]:`, {
                    status: error.status,
                    message: errorMessage,
                    error: error.error
                });

            // Return an observable with a user-facing error message
            return throwError(() => ({
                message: errorMessage,
                status: error.status,
                originalError: error
            }));
        })
    );
};

