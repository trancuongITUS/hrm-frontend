import { Injectable, signal, computed } from '@angular/core';

/**
 * Service for managing global loading state.
 * Uses a counter to handle multiple simultaneous requests.
 */
@Injectable({
    providedIn: 'root'
})
export class LoadingService {
    private readonly loadingCountSignal = signal<number>(0);
    
    // Public readonly computed signal for loading state
    readonly isLoading = computed(() => this.loadingCountSignal() > 0);
    
    // Public readonly signal for loading count (useful for debugging)
    readonly loadingCount = this.loadingCountSignal.asReadonly();

    /**
     * Increments the loading counter and shows the loading indicator.
     */
    show(): void {
        this.loadingCountSignal.update(count => count + 1);
    }

    /**
     * Decrements the loading counter and hides the loading indicator if counter reaches 0.
     */
    hide(): void {
        this.loadingCountSignal.update(count => Math.max(0, count - 1));
    }

    /**
     * Resets the loading counter to 0.
     */
    reset(): void {
        this.loadingCountSignal.set(0);
    }

    /**
     * Gets the current loading state (non-reactive snapshot).
     */
    getLoadingState(): boolean {
        return this.loadingCountSignal() > 0;
    }
}

