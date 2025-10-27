import { Routes } from '@angular/router';
import { Crud } from './components/crud';

export default [
    { path: '', component: Crud },
    { path: '**', redirectTo: '/notfound' }
] as Routes;

