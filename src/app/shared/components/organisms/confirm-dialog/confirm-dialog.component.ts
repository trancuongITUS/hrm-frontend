import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

/**
 * ConfirmDialog component - Global confirmation dialog
 *
 * Place this component in your app root template once:
 * ```html
 * <app-confirm-dialog></app-confirm-dialog>
 * ```
 *
 * Then use the ConfirmDialogService to show dialogs from anywhere
 */
@Component({
    selector: 'app-confirm-dialog',
    imports: [CommonModule, ConfirmDialogModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: ` <p-confirmDialog></p-confirmDialog> `
})
export class ConfirmDialogComponent {}
