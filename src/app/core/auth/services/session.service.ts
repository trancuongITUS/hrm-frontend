import { Injectable, signal, computed } from '@angular/core';
import { User, UserProfile } from '../models/user.model';

/**
 * Service for managing user session state.
 * Uses Angular Signals for reactive state management.
 */
@Injectable({
    providedIn: 'root'
})
export class SessionService {
    private readonly USER_SESSION_KEY = 'user_session';
    
    // Signals for reactive state management
    private readonly userSignal = signal<User | null>(null);
    private readonly isAuthenticatedSignal = signal<boolean>(false);
    
    // Public computed signals
    readonly user = this.userSignal.asReadonly();
    readonly isAuthenticated = this.isAuthenticatedSignal.asReadonly();
    
    // Derived computed properties
    readonly userProfile = computed<UserProfile | null>(() => {
        const user = this.userSignal();
        if (!user) {
            return null;
        }
        
        return {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            fullName: user.fullName || `${user.firstName} ${user.lastName}`,
            avatar: user.avatar,
            roles: user.roles
        };
    });
    
    readonly userRoles = computed<string[]>(() => {
        const user = this.userSignal();
        return user?.roles ?? [];
    });
    
    readonly userId = computed<string | null>(() => {
        const user = this.userSignal();
        return user?.id ?? null;
    });
    
    readonly userEmail = computed<string | null>(() => {
        const user = this.userSignal();
        return user?.email ?? null;
    });

    constructor() {
        this.loadSessionFromStorage();
    }

    /**
     * Sets the current user and updates authentication state.
     */
    setUser(user: User | null): void {
        this.userSignal.set(user);
        this.isAuthenticatedSignal.set(!!user);
        
        if (user) {
            this.saveSessionToStorage(user);
        } else {
            this.clearSessionFromStorage();
        }
    }

    /**
     * Gets the current user snapshot (non-reactive).
     */
    getCurrentUser(): User | null {
        return this.userSignal();
    }

    /**
     * Checks if the user has a specific role.
     */
    hasRole(role: string): boolean {
        const roles = this.userRoles();
        return roles.includes(role);
    }

    /**
     * Checks if the user has any of the specified roles.
     */
    hasAnyRole(roles: string[]): boolean {
        const userRoles = this.userRoles();
        return roles.some(role => userRoles.includes(role));
    }

    /**
     * Checks if the user has all of the specified roles.
     */
    hasAllRoles(roles: string[]): boolean {
        const userRoles = this.userRoles();
        return roles.every(role => userRoles.includes(role));
    }

    /**
     * Checks if the user has a specific permission.
     */
    hasPermission(permission: string): boolean {
        const user = this.userSignal();
        return user?.permissions?.includes(permission) ?? false;
    }

    /**
     * Clears the current session.
     */
    clearSession(): void {
        this.userSignal.set(null);
        this.isAuthenticatedSignal.set(false);
        this.clearSessionFromStorage();
    }

    /**
     * Updates specific user properties.
     */
    updateUser(updates: Partial<User>): void {
        const currentUser = this.userSignal();
        if (!currentUser) {
            return;
        }

        const updatedUser = { ...currentUser, ...updates };
        this.setUser(updatedUser);
    }

    /**
     * Saves the user session to localStorage.
     */
    private saveSessionToStorage(user: User): void {
        try {
            localStorage.setItem(this.USER_SESSION_KEY, JSON.stringify(user));
        } catch (error) {
            console.error('Error saving session to storage:', error);
        }
    }

    /**
     * Loads the user session from localStorage.
     */
    private loadSessionFromStorage(): void {
        try {
            const sessionData = localStorage.getItem(this.USER_SESSION_KEY);
            if (sessionData) {
                const user = JSON.parse(sessionData) as User;
                
                // Convert date strings back to Date objects
                if (user.lastLoginAt) {
                    user.lastLoginAt = new Date(user.lastLoginAt);
                }
                user.createdAt = new Date(user.createdAt);
                user.updatedAt = new Date(user.updatedAt);
                
                this.userSignal.set(user);
                this.isAuthenticatedSignal.set(true);
            }
        } catch (error) {
            console.error('Error loading session from storage:', error);
            this.clearSessionFromStorage();
        }
    }

    /**
     * Clears the user session from localStorage.
     */
    private clearSessionFromStorage(): void {
        try {
            localStorage.removeItem(this.USER_SESSION_KEY);
        } catch (error) {
            console.error('Error clearing session from storage:', error);
        }
    }

    /**
     * Checks if the session exists in storage.
     */
    hasStoredSession(): boolean {
        return !!localStorage.getItem(this.USER_SESSION_KEY);
    }
}

