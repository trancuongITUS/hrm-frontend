import { Injectable, inject } from '@angular/core';
import { MessageService } from 'primeng/api';

/**
 * Notification severity levels matching PrimeNG Toast severity.
 */
export type NotificationSeverity = 'success' | 'info' | 'warn' | 'error';

/**
 * Notification position on screen.
 */
export type NotificationPosition = 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right' | 'center';

/**
 * Notification options for customizing display behavior.
 */
export interface NotificationOptions {
    /**
     * Duration in milliseconds before auto-hide. Use 0 for persistent notifications.
     * @default 3000
     */
    life?: number;

    /**
     * Whether notification is closable by user.
     * @default true
     */
    closable?: boolean;

    /**
     * Whether notification is sticky (won't auto-hide).
     * @default false
     */
    sticky?: boolean;

    /**
     * Additional data to pass with notification.
     */
    data?: unknown;

    /**
     * CSS class name for custom styling.
     */
    styleClass?: string;

    /**
     * Inline styles for custom styling.
     */
    contentStyleClass?: string;

    /**
     * Custom key for targeting specific toast container.
     */
    key?: string;
}

/**
 * Complete notification configuration.
 */
export interface Notification {
    severity: NotificationSeverity;
    summary: string;
    detail: string;
    options?: NotificationOptions;
}

/**
 * Service for displaying toast notifications throughout the application.
 * Wraps PrimeNG MessageService with a simplified, type-safe API.
 *
 * @example
 * ```typescript
 * constructor(private notificationService: NotificationService) {}
 *
 * // Simple success notification
 * this.notificationService.showSuccess('Data saved successfully!');
 *
 * // Error with custom duration
 * this.notificationService.showError(
 *   'Failed to save data',
 *   'Error',
 *   { life: 5000 }
 * );
 *
 * // Persistent notification
 * this.notificationService.showWarning(
 *   'Please complete your profile',
 *   'Action Required',
 *   { sticky: true }
 * );
 * ```
 */
@Injectable({
    providedIn: 'root'
})
export class NotificationService {
    private readonly messageService = inject(MessageService);

    /**
     * Default notification lifespan in milliseconds.
     */
    private readonly defaultLife = 3000;

    /**
     * Shows a success notification.
     */
    showSuccess(message: string, title: string = 'Success', options?: NotificationOptions): void {
        this.show('success', title, message, options);
    }

    /**
     * Shows an info notification.
     */
    showInfo(message: string, title: string = 'Info', options?: NotificationOptions): void {
        this.show('info', title, message, options);
    }

    /**
     * Shows a warning notification.
     */
    showWarning(message: string, title: string = 'Warning', options?: NotificationOptions): void {
        this.show('warn', title, message, options);
    }

    /**
     * Shows an error notification.
     */
    showError(message: string, title: string = 'Error', options?: NotificationOptions): void {
        this.show('error', title, message, options);
    }

    /**
     * Shows a custom notification with full control.
     */
    show(severity: NotificationSeverity, title: string, message: string, options?: NotificationOptions): void {
        this.messageService.add({
            severity,
            summary: title,
            detail: message,
            life: options?.sticky ? 0 : (options?.life ?? this.defaultLife),
            closable: options?.closable ?? true,
            sticky: options?.sticky ?? false,
            data: options?.data,
            styleClass: options?.styleClass,
            contentStyleClass: options?.contentStyleClass,
            key: options?.key
        });
    }

    /**
     * Shows multiple notifications at once.
     */
    showMultiple(notifications: Notification[]): void {
        notifications.forEach((notification) => {
            this.show(notification.severity, notification.summary, notification.detail, notification.options);
        });
    }

    /**
     * Clears all notifications.
     */
    clearAll(): void {
        this.messageService.clear();
    }

    /**
     * Clears notifications with a specific key.
     */
    clearByKey(key: string): void {
        this.messageService.clear(key);
    }

    /**
     * Shows a confirmation-style notification (info with action required styling).
     */
    showConfirmation(message: string, title: string = 'Confirmation', options?: NotificationOptions): void {
        this.show('info', title, message, {
            ...options,
            sticky: true,
            styleClass: 'confirmation-toast'
        });
    }

    /**
     * Shows a loading notification (usually sticky until cleared).
     * Returns a function to clear this specific notification.
     */
    showLoading(message: string = 'Loading...', title: string = 'Please wait'): () => void {
        const key = `loading-${Date.now()}`;

        this.show('info', title, message, {
            sticky: true,
            closable: false,
            key,
            styleClass: 'loading-toast'
        });

        return () => this.clearByKey(key);
    }

    /**
     * Shows a validation error notification with formatted error messages.
     */
    showValidationErrors(errors: Record<string, string[]> | string[], title: string = 'Validation Error'): void {
        let message: string;

        if (Array.isArray(errors)) {
            message = errors.join('\n');
        } else {
            message = Object.entries(errors)
                .map(([field, msgs]) => `${field}: ${msgs.join(', ')}`)
                .join('\n');
        }

        this.showError(message, title, { life: 7000 });
    }

    /**
     * Shows a success notification for common CRUD operations.
     */
    showOperationSuccess(operation: 'created' | 'updated' | 'deleted' | 'saved', entity: string = 'Item'): void {
        const messages = {
            created: `${entity} created successfully`,
            updated: `${entity} updated successfully`,
            deleted: `${entity} deleted successfully`,
            saved: `${entity} saved successfully`
        };

        this.showSuccess(messages[operation], 'Success');
    }

    /**
     * Shows an error notification for common CRUD operations.
     */
    showOperationError(operation: 'create' | 'update' | 'delete' | 'save' | 'load', entity: string = 'Item'): void {
        const messages = {
            create: `Failed to create ${entity}`,
            update: `Failed to update ${entity}`,
            delete: `Failed to delete ${entity}`,
            save: `Failed to save ${entity}`,
            load: `Failed to load ${entity}`
        };

        this.showError(messages[operation], 'Operation Failed', { life: 5000 });
    }

    /**
     * Shows a network error notification.
     */
    showNetworkError(message: string = 'Unable to connect to server. Please check your internet connection.'): void {
        this.showError(message, 'Network Error', { life: 7000 });
    }

    /**
     * Shows an authentication error notification.
     */
    showAuthenticationError(message: string = 'Your session has expired. Please log in again.'): void {
        this.showWarning(message, 'Authentication Required', { sticky: true });
    }

    /**
     * Shows an authorization error notification.
     */
    showAuthorizationError(message: string = 'You do not have permission to perform this action.'): void {
        this.showError(message, 'Access Denied', { life: 5000 });
    }

    /**
     * Shows a custom notification using Notification object.
     */
    showNotification(notification: Notification): void {
        this.show(notification.severity, notification.summary, notification.detail, notification.options);
    }
}
