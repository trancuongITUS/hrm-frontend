import { Component, ChangeDetectionStrategy, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageModule } from 'primeng/message';
import { ComponentStatus, Severity } from '@shared/models';

/**
 * Alert component - Wraps PrimeNG Message for alerts and notifications
 * 
 * @example
 * ```html
 * <app-alert 
 *   [status]="'success'" 
 *   [dismissible]="true"
 *   [text]="'Operation completed successfully!'"
 *   (dismissed)="handleDismiss()">
 * </app-alert>
 * 
 * <!-- With custom content -->
 * <app-alert [status]="'warning'">
 *   <strong>Warning:</strong> This action cannot be undone.
 * </app-alert>
 * ```
 */
@Component({
  selector: 'app-alert',
  imports: [CommonModule, MessageModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (visible()) {
      <div [class]="containerClass()">
        <p-message
          [severity]="severity()"
          [text]="text()"
          [icon]="computedIcon()"
          [class]="'w-full'"
        >
          @if (!text()) {
            <ng-content></ng-content>
          }
        </p-message>
        
        @if (dismissible()) {
          <button
            type="button"
            class="ml-auto text-current opacity-70 hover:opacity-100 transition-opacity"
            (click)="handleDismiss()"
            [attr.aria-label]="'Dismiss alert'"
          >
            <i class="pi pi-times"></i>
          </button>
        }
      </div>
    }
  `,
  styles: [`
    :host ::ng-deep {
      .p-message {
        margin: 0;
      }
    }
  `]
})
export class AlertComponent {
  // Inputs
  status = input<ComponentStatus>('info');
  text = input<string>('');
  icon = input<string>('');
  dismissible = input<boolean>(false);
  customClass = input<string>('');

  // Output
  dismissed = output<void>();

  // Internal state
  visible = input<boolean>(true);

  // Computed properties
  severity = computed((): Severity => {
    const statusMap: Record<ComponentStatus, Severity> = {
      success: 'success',
      info: 'info',
      warning: 'warn',
      error: 'error'
    };
    return statusMap[this.status()];
  });

  computedIcon = computed(() => {
    if (this.icon()) {
      return this.icon();
    }

    // Default icons based on status
    const iconMap: Record<ComponentStatus, string> = {
      success: 'pi pi-check-circle',
      info: 'pi pi-info-circle',
      warning: 'pi pi-exclamation-triangle',
      error: 'pi pi-times-circle'
    };
    return iconMap[this.status()];
  });

  containerClass = computed(() => {
    const classes = ['flex', 'items-start', 'gap-2', 'w-full'];
    
    if (this.customClass()) {
      classes.push(this.customClass());
    }
    
    return classes.join(' ');
  });

  handleDismiss(): void {
    this.dismissed.emit();
  }
}

