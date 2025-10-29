import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { EnvironmentService } from '@core/services';

/**
 * HTTP interceptor that adds the base API URL to all relative requests.
 * This interceptor demonstrates how to use environment configuration in interceptors.
 */
export const apiInterceptor: HttpInterceptorFn = (req, next) => {
    const envService = inject(EnvironmentService);

    // Only modify the request if it's a relative URL
    if (!req.url.startsWith('http://') && !req.url.startsWith('https://')) {
        const apiUrl = envService.apiUrl;
        const apiReq = req.clone({
            url: `${apiUrl}${req.url.startsWith('/') ? '' : '/'}${req.url}`
        });
        return next(apiReq);
    }

    return next(req);
};
