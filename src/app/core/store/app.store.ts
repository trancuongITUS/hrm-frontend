import { patchState, signalStore, withMethods, withState, withComputed } from '@ngrx/signals';
import { computed, inject } from '@angular/core';
import { LayoutService } from '../../layout/services/layout.service';

export type Theme = 'light' | 'dark';

export interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
}

export interface AppState {
    theme: Theme;
    user: User | null;
    loading: boolean;
}

const initialState: AppState = {
    theme: 'light',
    user: null,
    loading: false
};

export const AppStore = signalStore(
    { providedIn: 'root' },
    withState(initialState),
    withComputed(({ theme, user }) => ({
        isDarkTheme: computed(() => theme() === 'dark'),
        isAuthenticated: computed(() => !!user())
    })),
    withMethods((store) => {
        const layoutService = inject(LayoutService);

        return {
            setTheme(theme: Theme) {
                patchState(store, { theme });
                // Sync with LayoutService for backward compatibility/UI handling
                layoutService.layoutConfig.update((config) => ({
                    ...config,
                    darkTheme: theme === 'dark'
                }));
            },
            toggleTheme() {
                const newTheme = store.theme() === 'light' ? 'dark' : 'light';
                this.setTheme(newTheme);
            },
            setUser(user: User | null) {
                patchState(store, { user });
            },
            setLoading(loading: boolean) {
                patchState(store, { loading });
            }
        };
    })
);
