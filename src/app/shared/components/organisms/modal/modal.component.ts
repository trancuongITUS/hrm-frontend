import { Component, ChangeDetectionStrategy, input, output, model } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { ModalSize } from '@shared/models';

/**
 * Modal component - Wraps PrimeNG Dialog
 *
 * @example
 * ```html
 * <app-modal
 *   [(visible)]="showDialog"
 *   [header]="'Edit User'"
 *   [size]="'lg'"
 *   [confirmLabel]="'Save'"
 *   [cancelLabel]="'Cancel'"
 *   (confirm)="saveUser()"
 *   (cancel)="closeDialog()">
 *   <p>Modal content goes here</p>
 * </app-modal>
 * ```
 */
@Component({
    selector: 'app-modal',
    imports: [CommonModule, DialogModule, ButtonModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <p-dialog
            [(visible)]="visible"
            [header]="header()"
            [modal]="modal()"
            [closable]="closable()"
            [dismissableMask]="dismissableMask()"
            [closeOnEscape]="closeOnEscape()"
            [draggable]="draggable()"
            [resizable]="resizable()"
            [maximizable]="maximizable()"
            [styleClass]="dialogClass()"
            (onHide)="handleHide()"
        >
            <ng-template pTemplate="header" *ngIf="header()">
                <div class="flex items-center gap-3">
                    @if (headerIcon()) {
                        <i [class]="headerIcon() + ' text-2xl'"></i>
                    }
                    <span class="font-semibold text-xl">{{ header() }}</span>
                </div>
            </ng-template>

            <ng-content></ng-content>

            <ng-template pTemplate="footer" *ngIf="showFooter()">
                <div class="flex items-center justify-end gap-2">
                    <ng-content select="[footerLeft]"></ng-content>

                    <div class="flex-1"></div>

                    @if (showCancelButton()) {
                        <p-button [label]="cancelLabel()" [icon]="cancelIcon()" [severity]="'secondary'" [text]="true" [disabled]="loading()" (onClick)="handleCancel()" />
                    }

                    @if (showConfirmButton()) {
                        <p-button [label]="confirmLabel()" [icon]="confirmIcon()" [severity]="confirmSeverity()" [loading]="loading()" [disabled]="confirmDisabled()" (onClick)="handleConfirm()" />
                    }

                    <ng-content select="[footerRight]"></ng-content>
                </div>
            </ng-template>
        </p-dialog>
    `,
    styles: []
})
export class ModalComponent {
    // Two-way binding for visibility
    visible = model<boolean>(false);

    // Inputs
    header = input<string>('');
    headerIcon = input<string>('');
    size = input<ModalSize>('md');
    modal = input<boolean>(true);
    closable = input<boolean>(true);
    dismissableMask = input<boolean>(false);
    closeOnEscape = input<boolean>(true);
    draggable = input<boolean>(false);
    resizable = input<boolean>(false);
    maximizable = input<boolean>(false);

    // Footer
    showFooter = input<boolean>(true);
    showConfirmButton = input<boolean>(true);
    showCancelButton = input<boolean>(true);
    confirmLabel = input<string>('Confirm');
    cancelLabel = input<string>('Cancel');
    confirmIcon = input<string>('');
    cancelIcon = input<string>('');
    confirmSeverity = input<'primary' | 'secondary' | 'success' | 'info' | 'warn' | 'danger'>('primary');
    confirmDisabled = input<boolean>(false);
    loading = input<boolean>(false);

    // Outputs
    confirm = output<void>();
    cancel = output<void>();
    hide = output<void>();

    dialogClass(): string {
        const sizeMap: Record<ModalSize, string> = {
            sm: 'w-full md:w-96',
            md: 'w-full md:w-[32rem]',
            lg: 'w-full md:w-[48rem]',
            xl: 'w-full md:w-[64rem]',
            full: 'w-full h-full m-0'
        };

        return sizeMap[this.size()];
    }

    handleConfirm(): void {
        this.confirm.emit();
    }

    handleCancel(): void {
        this.cancel.emit();
        this.visible.set(false);
    }

    handleHide(): void {
        this.hide.emit();
    }
}
