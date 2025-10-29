import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { LoadingService } from '../services/loading.service';

/**
 * HTTP interceptor that manages global loading state.
 * Shows loading indicator during HTTP requests.
 */
export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
    const loadingService = inject(LoadingService);

    // Skip loading indicator for specific endpoints (optional)
    const skipLoading = req.headers.has('X-Skip-Loading') || 
                       req.url.includes('/auth/refresh'); // Don't show loading for token refresh

    if (skipLoading) {
        return next(req);
    }

    // Increment the loading counter
    loadingService.show();

    // Handle the request and decrement the counter when done
    return next(req).pipe(
        finalize(() => loadingService.hide())
    );
};

