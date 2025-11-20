import { provideHttpClient, withFetch, withInterceptors, withXsrfConfiguration } from '@angular/common/http';
import { ApplicationConfig, ErrorHandler } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter, withEnabledBlockingInitialNavigation, withInMemoryScrolling } from '@angular/router';
import { apiInterceptor } from '@core/interceptors';
import { authInterceptor, errorInterceptor, loadingInterceptor } from '@core/auth';
import { GlobalErrorHandler } from '@core/errors';
import { MessageService, ConfirmationService } from 'primeng/api';
import Aura from '@primeuix/themes/aura';
import { providePrimeNG } from 'primeng/config';
import { appRoutes } from './app.routes';

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(appRoutes, withInMemoryScrolling({ anchorScrolling: 'enabled', scrollPositionRestoration: 'enabled' }), withEnabledBlockingInitialNavigation()),
        provideHttpClient(
            withFetch(),
            withInterceptors([
                apiInterceptor, // Must be first: adds base API URL
                authInterceptor, // Adds JWT token to requests
                loadingInterceptor, // Manages loading state
                errorInterceptor // Handles HTTP errors globally
            ]),
            withXsrfConfiguration({
                cookieName: 'XSRF-TOKEN',
                headerName: 'X-XSRF-TOKEN'
            })
        ),
        provideAnimationsAsync(),
        providePrimeNG({ theme: { preset: Aura, options: { darkModeSelector: '.app-dark' } } }),
        // Global error handler for uncaught errors
        { provide: ErrorHandler, useClass: GlobalErrorHandler },
        // PrimeNG services for toast notifications and confirmations
        MessageService,
        ConfirmationService
    ]
};
