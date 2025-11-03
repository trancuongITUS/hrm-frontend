import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Toast } from 'primeng/toast';

@Component({
    selector: 'app-root',
    imports: [RouterModule, Toast],
    template: `
        <p-toast position="top-right" />
        <router-outlet />
    `
})
export class AppComponent {}
