import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { LoggerService } from '@core/services/logger.service';

/**
 * HTTP error interceptor that handles different types of HTTP errors globally.
 * Provides centralized error handling and logging.
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    const router = inject(Router);
    const logger = inject(LoggerService);

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            let errorMessage = 'An unknown error occurred';

            if (error.error instanceof ErrorEvent) {
                // Client-side or network error
                errorMessage = `Network error: ${error.error.message}`;
                logger.error('Network Error:', error.error);
            } else {
                // Backend returned an unsuccessful response code
                errorMessage = `Server error: ${error.status} - ${error.statusText}`;
                
                // Handle specific error codes
                switch (error.status) {
                    case 400:
                        errorMessage = 'Bad request. Please check your input.';
                        logger.warn('Bad Request (400):', error);
                        break;
                    
                    case 401:
                        errorMessage = 'Unauthorized. Please log in again.';
                        logger.warn('Unauthorized (401):', error);
                        // Note: Token refresh is handled by auth.interceptor
                        break;
                    
                    case 403:
                        errorMessage = 'Access denied. You do not have permission to access this resource.';
                        logger.warn('Forbidden (403):', error);
                        router.navigate(['/auth/access']);
                        break;
                    
                    case 404:
                        errorMessage = 'Resource not found.';
                        logger.warn('Not Found (404):', error);
                        break;
                    
                    case 422:
                        errorMessage = 'Validation error. Please check your input.';
                        logger.warn('Unprocessable Entity (422):', error);
                        break;
                    
                    case 429:
                        errorMessage = 'Too many requests. Please try again later.';
                        logger.warn('Too Many Requests (429):', error);
                        break;
                    
                    case 500:
                        errorMessage = 'Internal server error. Please try again later.';
                        logger.error('Internal Server Error (500):', error);
                        break;
                    
                    case 502:
                    case 503:
                    case 504:
                        errorMessage = 'Service temporarily unavailable. Please try again later.';
                        logger.error('Service Unavailable:', error);
                        break;
                    
                    default:
                        logger.error('HTTP Error:', error);
                }

                // Extract error message from response if available
                if (error.error?.message) {
                    errorMessage = error.error.message;
                } else if (error.error?.error) {
                    errorMessage = error.error.error;
                }
            }

            // Log the error for debugging
            logger.error(`HTTP Error [${req.method} ${req.url}]:`, {
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

