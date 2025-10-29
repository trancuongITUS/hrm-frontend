import { Routes } from '@angular/router';
import { AppLayout } from './app/layout/components/app.layout';
import { Dashboard } from './app/features/dashboard/dashboard';
import { Documentation } from './app/pages/documentation/documentation';
import { Landing } from './app/pages/landing/landing';
import { Notfound } from './app/pages/notfound/notfound';
import { authGuard } from './app/core/auth';

export const appRoutes: Routes = [
    {
        path: '',
        component: AppLayout,
        canActivate: [authGuard], // Protect all routes under AppLayout
        children: [
            { path: '', component: Dashboard },
            { path: 'uikit', loadChildren: () => import('./app/features/uikit/uikit.routes') },
            { path: 'documentation', component: Documentation },
            { path: 'pages', loadChildren: () => import('./app/pages/pages.routes') }
        ]
    },
    { path: 'landing', component: Landing }, // Public landing page
    { path: 'notfound', component: Notfound }, // Public 404 page
    { path: 'auth', loadChildren: () => import('./app/pages/auth/auth.routes') }, // Auth routes (login, register, etc.)
    { path: '**', redirectTo: '/notfound' }
];
