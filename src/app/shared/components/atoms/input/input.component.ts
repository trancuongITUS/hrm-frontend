import { Component, ChangeDetectionStrategy, input, output, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { PasswordModule } from 'primeng/password';
import { ComponentSize, InputType } from '@shared/models';

/**
 * Input component - Wraps PrimeNG InputText with custom features
 *
 * @example
 * ```html
 * <app-input
 *   [type]="'text'"
 *   [placeholder]="'Enter your name'"
 *   [value]="username()"
 *   [hasError]="hasError()"
 *   [prefixIcon]="'pi pi-user'"
 *   (valueChange)="onUsernameChange($event)">
 * </app-input>
 * ```
 */
@Component({
    selector: 'app-input',
    imports: [CommonModule, FormsModule, InputTextModule, InputNumberModule, PasswordModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <div class="flex items-center relative" [class]="containerClass()">
            @if (prefixIcon()) {
                <i [class]="prefixIcon() + ' absolute left-3 text-muted-color'"></i>
            }

            @switch (type()) {
                @case ('password') {
                    <p-password
                        [(ngModel)]="internalValue"
                        [placeholder]="placeholder()"
                        [disabled]="disabled()"
                        [feedback]="showPasswordStrength()"
                        [toggleMask]="true"
                        [class]="inputClass()"
                        [ariaLabel]="ariaLabel()"
                        (ngModelChange)="handleChange($event)"
                        [styleClass]="'w-full'"
                    />
                }
                @case ('number') {
                    @if (min() !== undefined || max() !== undefined) {
                        <p-inputNumber
                            [(ngModel)]="internalValue"
                            [placeholder]="placeholder()"
                            [disabled]="disabled()"
                            [readonly]="readonly()"
                            [min]="min()!"
                            [max]="max()!"
                            [step]="step()"
                            [class]="inputClass()"
                            [ariaLabel]="ariaLabel()"
                            (ngModelChange)="handleChange($event)"
                            [inputStyleClass]="'w-full'"
                        />
                    } @else {
                        <p-inputNumber
                            [(ngModel)]="internalValue"
                            [placeholder]="placeholder()"
                            [disabled]="disabled()"
                            [readonly]="readonly()"
                            [step]="step()"
                            [class]="inputClass()"
                            [ariaLabel]="ariaLabel()"
                            (ngModelChange)="handleChange($event)"
                            [inputStyleClass]="'w-full'"
                        />
                    }
                }
                @default {
                    <input
                        pInputText
                        [(ngModel)]="internalValue"
                        [type]="type()"
                        [placeholder]="placeholder()"
                        [disabled]="disabled()"
                        [readonly]="readonly()"
                        [size]="primeSize()"
                        [class]="inputClass()"
                        [attr.aria-label]="ariaLabel()"
                        (ngModelChange)="handleChange($event)"
                    />
                }
            }

            @if (suffixIcon()) {
                <i [class]="suffixIcon() + ' absolute right-3 text-muted-color'"></i>
            }
        </div>
    `,
    styles: [
        `
            :host ::ng-deep {
                .p-inputtext {
                    width: 100%;
                }

                .has-prefix input,
                .has-prefix .p-inputtext {
                    padding-left: 2.5rem;
                }

                .has-suffix input,
                .has-suffix .p-inputtext {
                    padding-right: 2.5rem;
                }

                .has-error input,
                .has-error .p-inputtext {
                    border-color: var(--p-red-500);
                }

                .has-error input:focus,
                .has-error .p-inputtext:focus {
                    box-shadow: 0 0 0 0.2rem rgba(239, 68, 68, 0.2);
                }
            }
        `
    ]
})
export class InputComponent {
    // Inputs
    type = input<InputType>('text');
    value = input<string | number>('');
    placeholder = input<string>('');
    size = input<ComponentSize>('medium');
    disabled = input<boolean>(false);
    readonly = input<boolean>(false);
    hasError = input<boolean>(false);
    prefixIcon = input<string>('');
    suffixIcon = input<string>('');
    ariaLabel = input<string>('');

    // Number-specific inputs
    min = input<number | undefined>(undefined);
    max = input<number | undefined>(undefined);
    step = input<number>(1);

    // Password-specific inputs
    showPasswordStrength = input<boolean>(true);

    // Output
    valueChange = output<string | number>();
    blur = output<FocusEvent>();
    focus = output<FocusEvent>();

    // Internal state
    internalValue = signal<string | number>('');

    constructor() {
        // Initialize internal value from input
        this.internalValue.set(this.value());
    }

    // Computed properties
    primeSize = computed((): 'small' | 'large' | undefined => {
        const sizeMap: Record<ComponentSize, 'small' | 'large' | undefined> = {
            small: 'small',
            medium: undefined,
            large: 'large'
        };
        return sizeMap[this.size()];
    });

    containerClass = computed(() => {
        const classes = ['w-full'];
        if (this.prefixIcon()) classes.push('has-prefix');
        if (this.suffixIcon()) classes.push('has-suffix');
        return classes.join(' ');
    });

    inputClass = computed(() => {
        const classes = ['w-full'];
        if (this.hasError()) classes.push('has-error');
        return classes.join(' ');
    });

    handleChange(value: string | number): void {
        this.internalValue.set(value);
        this.valueChange.emit(value);
    }
}
