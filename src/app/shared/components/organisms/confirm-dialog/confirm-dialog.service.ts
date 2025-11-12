import { Injectable, inject } from '@angular/core';
import { ConfirmationService } from 'primeng/api';

/**
 * Configuration for confirmation dialog
 */
export interface ConfirmDialogConfig {
  header?: string;
  message: string;
  icon?: string;
  acceptLabel?: string;
  rejectLabel?: string;
  acceptIcon?: string;
  rejectIcon?: string;
  acceptButtonStyleClass?: string;
  rejectButtonStyleClass?: string;
}

/**
 * ConfirmDialog service - Promise-based confirmation dialogs
 * 
 * @example
 * ```typescript
 * const confirmed = await this.confirmDialog.confirm({
 *   header: 'Delete User',
 *   message: 'Are you sure you want to delete this user?',
 *   icon: 'pi pi-exclamation-triangle'
 * });
 * 
 * if (confirmed) {
 *   // User clicked accept
 *   this.deleteUser();
 * }
 * ```
 */
@Injectable({ providedIn: 'root' })
export class ConfirmDialogService {
  private confirmationService = inject(ConfirmationService);

  /**
   * Show confirmation dialog and return a promise
   */
  confirm(config: ConfirmDialogConfig): Promise<boolean> {
    return new Promise((resolve) => {
      this.confirmationService.confirm({
        header: config.header || 'Confirmation',
        message: config.message,
        icon: config.icon || 'pi pi-exclamation-triangle',
        acceptLabel: config.acceptLabel || 'Yes',
        rejectLabel: config.rejectLabel || 'No',
        acceptIcon: config.acceptIcon || 'pi pi-check',
        rejectIcon: config.rejectIcon || 'pi pi-times',
        acceptButtonStyleClass: config.acceptButtonStyleClass || 'p-button-danger',
        rejectButtonStyleClass: config.rejectButtonStyleClass || 'p-button-text',
        accept: () => resolve(true),
        reject: () => resolve(false)
      });
    });
  }

  /**
   * Show delete confirmation dialog
   */
  confirmDelete(itemName?: string): Promise<boolean> {
    return this.confirm({
      header: 'Confirm Delete',
      message: itemName 
        ? `Are you sure you want to delete "${itemName}"? This action cannot be undone.`
        : 'Are you sure you want to delete this item? This action cannot be undone.',
      icon: 'pi pi-trash',
      acceptLabel: 'Delete',
      acceptButtonStyleClass: 'p-button-danger'
    });
  }

  /**
   * Show discard changes confirmation dialog
   */
  confirmDiscard(): Promise<boolean> {
    return this.confirm({
      header: 'Unsaved Changes',
      message: 'You have unsaved changes. Are you sure you want to discard them?',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Discard',
      acceptButtonStyleClass: 'p-button-warning'
    });
  }
}

