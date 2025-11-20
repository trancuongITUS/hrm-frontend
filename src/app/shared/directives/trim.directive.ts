import { Directive, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

/**
 * Directive to automatically trim whitespace from input values
 * Works with both template-driven and reactive forms
 *
 * @example
 * <input formControlName="username" appTrim />
 * <input [(ngModel)]="email" appTrim />
 */
@Directive({
    selector: '[appTrim]',
    standalone: true
})
export class TrimDirective {
    constructor(private ngControl: NgControl) {}

    @HostListener('blur')
    onBlur(): void {
        const control = this.ngControl.control;
        if (control && control.value && typeof control.value === 'string') {
            const trimmedValue = control.value.trim();
            if (trimmedValue !== control.value) {
                control.setValue(trimmedValue);
            }
        }
    }

    @HostListener('input', ['$event'])
    onInput(event: Event): void {
        const input = event.target as HTMLInputElement;
        // Remove leading whitespace during typing
        if (input.value && input.value.startsWith(' ')) {
            const trimmedValue = input.value.trimStart();
            const control = this.ngControl.control;
            if (control) {
                control.setValue(trimmedValue);
            }
        }
    }
}
