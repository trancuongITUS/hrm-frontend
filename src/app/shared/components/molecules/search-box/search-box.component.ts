import { Component, ChangeDetectionStrategy, input, output, signal, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { ComponentSize } from '@shared/models';

/**
 * SearchBox component - Input with search icon, clear button, and debounced output
 *
 * @example
 * ```html
 * <app-search-box
 *   [placeholder]="'Search users...'"
 *   [debounceTime]="300"
 *   [loading]="isSearching()"
 *   (search)="onSearch($event)">
 * </app-search-box>
 * ```
 */
@Component({
    selector: 'app-search-box',
    imports: [CommonModule, FormsModule, InputTextModule, IconFieldModule, InputIconModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: `
        <p-iconfield iconPosition="left" [class]="containerClass()">
            <p-inputicon>
                @if (loading()) {
                    <i class="pi pi-spin pi-spinner"></i>
                } @else {
                    <i class="pi pi-search"></i>
                }
            </p-inputicon>
            <input pInputText type="text" [(ngModel)]="searchValue" [placeholder]="placeholder()" [disabled]="disabled()" [size]="primeSize()" [attr.aria-label]="ariaLabel()" (ngModelChange)="handleSearch()" class="w-full" />
            @if (searchValue() && showClear()) {
                <button type="button" class="absolute right-2 top-1/2 -translate-y-1/2 text-muted-color hover:text-surface-900 dark:hover:text-surface-0" (click)="clearSearch()" [attr.aria-label]="'Clear search'">
                    <i class="pi pi-times"></i>
                </button>
            }
        </p-iconfield>
    `,
    styles: [
        `
            :host ::ng-deep {
                .p-iconfield {
                    position: relative;
                }
            }
        `
    ]
})
export class SearchBoxComponent {
    // Inputs
    placeholder = input<string>('Search...');
    size = input<ComponentSize>('medium');
    disabled = input<boolean>(false);
    loading = input<boolean>(false);
    debounceTime = input<number>(300);
    showClear = input<boolean>(true);
    ariaLabel = input<string>('Search');

    // Output
    search = output<string>();
    clear = output<void>();

    // Internal state
    searchValue = signal<string>('');
    private debounceTimer: ReturnType<typeof setTimeout> | null = null;

    // Computed
    primeSize = signal<'small' | 'large' | undefined>(undefined);

    constructor() {
        // Map size to PrimeNG size
        effect(() => {
            const sizeMap: Record<ComponentSize, 'small' | 'large' | undefined> = {
                small: 'small',
                medium: undefined,
                large: 'large'
            };
            this.primeSize.set(sizeMap[this.size()]);
        });
    }

    containerClass = signal<string>('w-full');

    handleSearch(): void {
        if (this.debounceTimer) {
            clearTimeout(this.debounceTimer);
        }

        this.debounceTimer = setTimeout(() => {
            this.search.emit(this.searchValue());
        }, this.debounceTime());
    }

    clearSearch(): void {
        this.searchValue.set('');
        this.search.emit('');
        this.clear.emit();
    }
}
