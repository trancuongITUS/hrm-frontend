import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DividerModule } from 'primeng/divider';

/**
 * Divider component - Wraps PrimeNG Divider
 *
 * @example
 * ```html
 * <app-divider></app-divider>
 * <app-divider [layout]="'vertical'" [class]="'h-full'"></app-divider>
 * <app-divider [type]="'dashed'">OR</app-divider>
 * ```
 */
@Component({
    selector: 'app-divider',
    imports: [CommonModule, DividerModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <p-divider [layout]="layout()" [type]="type()" [align]="align()" [class]="customClass()">
            <ng-content></ng-content>
        </p-divider>
    `,
    styles: []
})
export class DividerComponent {
    // Inputs
    layout = input<'horizontal' | 'vertical'>('horizontal');
    type = input<'solid' | 'dashed' | 'dotted'>('solid');
    align = input<'left' | 'center' | 'right' | 'top' | 'bottom'>('center');
    customClass = input<string>('');
}
