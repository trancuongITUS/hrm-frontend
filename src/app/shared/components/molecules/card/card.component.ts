import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';

/**
 * Card component - Wraps PrimeNG Card with loading state
 *
 * @example
 * ```html
 * <app-card
 *   [header]="'User Profile'"
 *   [subheader]="'Manage your account'"
 *   [loading]="isLoading()">
 *   <ng-template #headerActions>
 *     <button pButton icon="pi pi-cog"></button>
 *   </ng-template>
 *
 *   <p>Card content goes here</p>
 *
 *   <ng-template #footer>
 *     <button pButton label="Save"></button>
 *   </ng-template>
 * </app-card>
 * ```
 */
@Component({
    selector: 'app-card',
    imports: [CommonModule, CardModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <p-card [header]="header()" [subheader]="subheader()" [class]="cardClass()">
            <ng-template pTemplate="header" *ngIf="header()">
                <div class="flex items-center justify-between">
                    <div>
                        @if (header()) {
                            <h3 class="text-xl font-semibold m-0">{{ header() }}</h3>
                        }
                        @if (subheader()) {
                            <p class="text-muted-color mt-1 mb-0">{{ subheader() }}</p>
                        }
                    </div>
                    <div>
                        <ng-content select="[headerActions]"></ng-content>
                    </div>
                </div>
            </ng-template>

            @if (loading()) {
                <div class="flex items-center justify-center py-8">
                    <i class="pi pi-spin pi-spinner text-4xl text-primary"></i>
                </div>
            } @else {
                <ng-content></ng-content>
            }

            <ng-template pTemplate="footer" *ngIf="hasFooter()">
                <ng-content select="[footer]"></ng-content>
            </ng-template>
        </p-card>
    `,
    styles: []
})
export class CardComponent {
    // Inputs
    header = input<string>('');
    subheader = input<string>('');
    loading = input<boolean>(false);
    hoverable = input<boolean>(false);
    customClass = input<string>('');
    hasFooter = input<boolean>(false);

    // Computed properties
    cardClass = computed(() => {
        const classes: string[] = [];

        if (this.hoverable()) {
            classes.push('hover:shadow-lg', 'transition-shadow', 'duration-200', 'cursor-pointer');
        }

        if (this.customClass()) {
            classes.push(this.customClass());
        }

        return classes.join(' ');
    });
}
