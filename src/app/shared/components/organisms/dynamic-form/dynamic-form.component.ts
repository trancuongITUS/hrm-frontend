import { Component, ChangeDetectionStrategy, input, output, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { MultiSelectModule } from 'primeng/multiselect';
import { CheckboxModule } from 'primeng/checkbox';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { DatePickerModule } from 'primeng/datepicker';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { FormFieldConfig } from '@shared/models';

/**
 * DynamicForm component - JSON-driven form generation
 *
 * @example
 * ```typescript
 * const formConfig: FormFieldConfig[] = [
 *   {
 *     name: 'email',
 *     label: 'Email',
 *     type: 'email',
 *     required: true,
 *     validators: [Validators.email]
 *   },
 *   {
 *     name: 'role',
 *     label: 'Role',
 *     type: 'select',
 *     options: [
 *       { label: 'Admin', value: 'admin' },
 *       { label: 'User', value: 'user' }
 *     ]
 *   }
 * ];
 * ```
 *
 * ```html
 * <app-dynamic-form
 *   [fields]="formConfig"
 *   [columns]="2"
 *   (formSubmit)="handleSubmit($event)">
 * </app-dynamic-form>
 * ```
 */
@Component({
    selector: 'app-dynamic-form',
    imports: [CommonModule, ReactiveFormsModule, InputTextModule, TextareaModule, InputNumberModule, SelectModule, MultiSelectModule, CheckboxModule, RadioButtonModule, ToggleSwitchModule, DatePickerModule, AutoCompleteModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <form [formGroup]="form" (ngSubmit)="handleSubmit()" [class]="formClass()">
            <div [class]="gridClass()">
                @for (field of visibleFields(); track field.name) {
                    <div [class]="getFieldColClass(field)">
                        <div class="flex flex-col gap-2">
                            <label [for]="field.name" class="font-medium text-sm">
                                {{ field.label }}
                                @if (field.required) {
                                    <span class="text-red-500 ml-1">*</span>
                                }
                            </label>

                            @switch (field.type) {
                                @case ('text') {
                                    <input pInputText [id]="field.name" [formControlName]="field.name" [placeholder]="field.placeholder || ''" [disabled]="field.disabled || false" [readonly]="field.readonly || false" class="w-full" />
                                }
                                @case ('email') {
                                    <input pInputText type="email" [id]="field.name" [formControlName]="field.name" [placeholder]="field.placeholder || ''" [disabled]="field.disabled || false" [readonly]="field.readonly || false" class="w-full" />
                                }
                                @case ('password') {
                                    <input pInputText type="password" [id]="field.name" [formControlName]="field.name" [placeholder]="field.placeholder || ''" [disabled]="field.disabled || false" [readonly]="field.readonly || false" class="w-full" />
                                }
                                @case ('number') {
                                    <p-inputNumber [id]="field.name" [formControlName]="field.name" [placeholder]="field.placeholder || ''" [disabled]="field.disabled || false" [readonly]="field.readonly || false" [inputStyleClass]="'w-full'" />
                                }
                                @case ('textarea') {
                                    <textarea
                                        pTextarea
                                        [id]="field.name"
                                        [formControlName]="field.name"
                                        [placeholder]="field.placeholder || ''"
                                        [disabled]="field.disabled || false"
                                        [readonly]="field.readonly || false"
                                        [rows]="5"
                                        class="w-full"
                                    ></textarea>
                                }
                                @case ('select') {
                                    <p-select
                                        [id]="field.name"
                                        [formControlName]="field.name"
                                        [options]="field.options || []"
                                        [placeholder]="field.placeholder || 'Select'"
                                        [disabled]="field.disabled || false"
                                        optionLabel="label"
                                        optionValue="value"
                                        [class]="'w-full'"
                                    />
                                }
                                @case ('multiselect') {
                                    <p-multiSelect
                                        [id]="field.name"
                                        [formControlName]="field.name"
                                        [options]="field.options || []"
                                        [placeholder]="field.placeholder || 'Select'"
                                        [disabled]="field.disabled || false"
                                        optionLabel="label"
                                        optionValue="value"
                                        [styleClass]="'w-full'"
                                    />
                                }
                                @case ('checkbox') {
                                    <p-checkbox [id]="field.name" [formControlName]="field.name" [binary]="true" [disabled]="field.disabled || false" />
                                }
                                @case ('switch') {
                                    <p-toggleswitch [id]="field.name" [formControlName]="field.name" [disabled]="field.disabled || false" />
                                }
                                @case ('date') {
                                    <p-datepicker [id]="field.name" [formControlName]="field.name" [placeholder]="field.placeholder || ''" [disabled]="field.disabled || false" [class]="'w-full'" />
                                }
                            }

                            @if (field.hint) {
                                <small class="text-muted-color">{{ field.hint }}</small>
                            }

                            @if (getFieldError(field.name)) {
                                <small class="text-red-500">
                                    <i class="pi pi-exclamation-circle mr-1"></i>
                                    {{ getFieldError(field.name) }}
                                </small>
                            }
                        </div>
                    </div>
                }
            </div>

            <ng-content></ng-content>
        </form>
    `,
    styles: []
})
export class DynamicFormComponent implements OnInit {
    private fb = inject(FormBuilder);

    // Inputs
    fields = input<FormFieldConfig[]>([]);
    columns = input<number>(1);
    initialValues = input<Record<string, unknown>>({});

    // Outputs
    formSubmit = output<Record<string, unknown>>();
    formChange = output<Record<string, unknown>>();

    // Form
    form!: FormGroup;

    ngOnInit(): void {
        this.buildForm();

        // Emit changes
        this.form.valueChanges.subscribe((values) => {
            this.formChange.emit(values);
        });
    }

    // Computed
    formClass = signal('w-full');

    gridClass = computed(() => {
        const cols = this.columns();
        const gridCols: Record<number, string> = {
            1: 'grid grid-cols-1 gap-4',
            2: 'grid grid-cols-1 md:grid-cols-2 gap-4',
            3: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4',
            4: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'
        };
        return gridCols[cols] || gridCols[1];
    });

    visibleFields = computed(() => {
        return this.fields()
            .filter((field) => {
                if (!field.condition) return true;

                const watchedValue = this.form?.get(field.condition.field)?.value;
                return this.evaluateCondition(watchedValue, field.condition.operator, field.condition.value);
            })
            .sort((a, b) => (a.order || 0) - (b.order || 0));
    });

    private buildForm(): void {
        const group: Record<string, unknown> = {};
        const initialValues = this.initialValues();

        this.fields().forEach((field) => {
            const validators = [];

            if (field.required) {
                validators.push(Validators.required);
            }

            if (field.validators) {
                validators.push(...field.validators);
            }

            const initialValue = initialValues[field.name] ?? field.value ?? null;
            group[field.name] = [initialValue, validators];
        });

        this.form = this.fb.group(group);
    }

    getFieldColClass(field: FormFieldConfig): string {
        if (field.col) {
            return `col-span-${field.col}`;
        }
        return '';
    }

    getFieldError(fieldName: string): string | null {
        const control = this.form.get(fieldName);
        if (!control || !control.errors || !control.touched) {
            return null;
        }

        const field = this.fields().find((f) => f.name === fieldName);
        const errors = control.errors;
        const errorMessages = field?.errorMessages || {};

        if (errors['required']) {
            return errorMessages['required'] || 'This field is required';
        }

        if (errors['email']) {
            return errorMessages['email'] || 'Please enter a valid email';
        }

        if (errors['min']) {
            return errorMessages['min'] || `Minimum value is ${errors['min'].min}`;
        }

        if (errors['max']) {
            return errorMessages['max'] || `Maximum value is ${errors['max'].max}`;
        }

        return Object.keys(errors)[0];
    }

    private evaluateCondition(value: unknown, operator: string, expectedValue: unknown): boolean {
        switch (operator) {
            case 'equals':
                return value === expectedValue;
            case 'notEquals':
                return value !== expectedValue;
            case 'contains':
                return String(value).includes(String(expectedValue));
            case 'greaterThan':
                return Number(value) > Number(expectedValue);
            case 'lessThan':
                return Number(value) < Number(expectedValue);
            default:
                return true;
        }
    }

    handleSubmit(): void {
        if (this.form.valid) {
            this.formSubmit.emit(this.form.value);
        } else {
            // Mark all fields as touched to show errors
            Object.keys(this.form.controls).forEach((key) => {
                this.form.get(key)?.markAsTouched();
            });
        }
    }

    // Public methods for form control
    reset(): void {
        this.form.reset();
    }

    setValue(values: Record<string, unknown>): void {
        this.form.patchValue(values);
    }

    get isValid(): boolean {
        return this.form.valid;
    }

    get value(): Record<string, unknown> {
        return this.form.value;
    }
}
