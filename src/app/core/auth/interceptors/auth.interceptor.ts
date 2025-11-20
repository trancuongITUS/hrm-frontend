import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, switchMap, throwError } from 'rxjs';
import { TokenService } from '../services/token.service';
import { AuthService } from '../services/auth.service';

/**
 * HTTP interceptor that adds the JWT token to outgoing requests.
 * Also handles token refresh when receiving 401 responses.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const tokenService = inject(TokenService);
    const authService = inject(AuthService);

    // Skip token addition for auth endpoints
    const isAuthEndpoint = req.url.includes('/auth/login') || req.url.includes('/auth/register') || req.url.includes('/auth/refresh');

    if (isAuthEndpoint) {
        return next(req);
    }

    // Get the access token
    const token = tokenService.getAccessToken();

    // Clone the request and add the authorization header if token exists
    const authReq = token
        ? req.clone({
              setHeaders: {
                  Authorization: `Bearer ${token}`
              }
          })
        : req;

    // Handle the request and catch 401 errors for token refresh
    return next(authReq).pipe(
        catchError((error: HttpErrorResponse) => {
            // If we get a 401 and it's not a refresh request, try to refresh the token
            if (error.status === 401 && !req.url.includes('/auth/refresh')) {
                return authService.refreshToken().pipe(
                    switchMap((newToken) => {
                        // Retry the original request with the new token
                        const retryReq = req.clone({
                            setHeaders: {
                                Authorization: `Bearer ${newToken}`
                            }
                        });
                        return next(retryReq);
                    }),
                    catchError((refreshError) => {
                        // If refresh fails, log out the user
                        authService.logoutLocal();
                        return throwError(() => refreshError);
                    })
                );
            }

            return throwError(() => error);
        })
    );
};
