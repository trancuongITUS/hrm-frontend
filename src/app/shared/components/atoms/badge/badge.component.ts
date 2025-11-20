import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentSize, ComponentVariant } from '@shared/models';

/**
 * Badge component - Custom badge for labels and status indicators
 *
 * @example
 * ```html
 * <app-badge [variant]="'success'" [size]="'small'">Active</app-badge>
 * <app-badge [variant]="'danger'" [dot]="true"></app-badge>
 * ```
 */
@Component({
    selector: 'app-badge',
    imports: [CommonModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <span [class]="badgeClass()" [attr.aria-label]="ariaLabel()">
            @if (dot()) {
                <span class="inline-block rounded-full" [class]="dotClass()"></span>
            } @else {
                <ng-content></ng-content>
            }
        </span>
    `,
    styles: []
})
export class BadgeComponent {
    // Inputs
    variant = input<ComponentVariant>('default');
    size = input<ComponentSize>('medium');
    dot = input<boolean>(false);
    rounded = input<boolean>(false);
    ariaLabel = input<string>('');

    // Computed properties
    badgeClass = computed(() => {
        const classes = ['inline-flex', 'items-center', 'justify-center', 'font-medium'];

        // Size classes
        if (this.dot()) {
            classes.push('p-1');
        } else {
            const sizeClasses: Record<ComponentSize, string> = {
                small: 'px-2 py-0.5 text-xs',
                medium: 'px-2.5 py-0.5 text-sm',
                large: 'px-3 py-1 text-base'
            };
            classes.push(sizeClasses[this.size()]);
        }

        // Variant colors
        const variantClasses: Record<string, string> = {
            default: 'bg-surface-100 dark:bg-surface-700 text-surface-900 dark:text-surface-0',
            primary: 'bg-primary text-primary-contrast',
            secondary: 'bg-surface-200 dark:bg-surface-600 text-surface-900 dark:text-surface-0',
            success: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400',
            danger: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400',
            warning: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400',
            info: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400'
        };
        classes.push(variantClasses[this.variant()] || variantClasses['default']);

        // Shape
        if (this.rounded() || this.dot()) {
            classes.push('rounded-full');
        } else {
            classes.push('rounded');
        }

        return classes.join(' ');
    });

    dotClass = computed(() => {
        const sizeMap: Record<ComponentSize, string> = {
            small: 'w-1.5 h-1.5',
            medium: 'w-2 h-2',
            large: 'w-2.5 h-2.5'
        };
        return sizeMap[this.size()];
    });
}
