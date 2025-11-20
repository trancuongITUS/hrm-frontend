import { Component, ChangeDetectionStrategy, input, computed, contentChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentSize } from '@shared/models';

/**
 * FormField component - Combines label, input control, and error message
 *
 * @example
 * ```html
 * <app-form-field
 *   [label]="'Email'"
 *   [required]="true"
 *   [error]="emailError()"
 *   [hint]="'We will never share your email'">
 *   <input pInputText type="email" [(ngModel)]="email" />
 * </app-form-field>
 * ```
 */
@Component({
    selector: 'app-form-field',
    imports: [CommonModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div [class]="containerClass()">
            @if (label()) {
                <label [for]="fieldId()" [class]="labelClass()">
                    {{ label() }}
                    @if (required()) {
                        <span class="text-red-500 ml-1">*</span>
                    }
                </label>
            }

            <div class="mt-1">
                <ng-content></ng-content>
            </div>

            @if (hint() && !error()) {
                <p class="mt-1 text-sm text-muted-color">
                    {{ hint() }}
                </p>
            }

            @if (error()) {
                <p class="mt-1 text-sm text-red-500" role="alert">
                    <i class="pi pi-exclamation-circle mr-1"></i>
                    {{ error() }}
                </p>
            }
        </div>
    `,
    styles: []
})
export class FormFieldComponent {
    // Inputs
    label = input<string>('');
    fieldId = input<string>('');
    required = input<boolean>(false);
    error = input<string>('');
    hint = input<string>('');
    size = input<ComponentSize>('medium');
    fullWidth = input<boolean>(true);

    // Computed properties
    containerClass = computed(() => {
        const classes: string[] = [];

        if (this.fullWidth()) {
            classes.push('w-full');
        }

        return classes.join(' ');
    });

    labelClass = computed(() => {
        const classes = ['block', 'font-medium', 'text-surface-900', 'dark:text-surface-0'];

        const sizeClasses: Record<ComponentSize, string> = {
            small: 'text-xs mb-1',
            medium: 'text-sm mb-1.5',
            large: 'text-base mb-2'
        };
        classes.push(sizeClasses[this.size()]);

        return classes.join(' ');
    });
}
