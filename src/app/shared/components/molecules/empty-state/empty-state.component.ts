import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';

/**
 * EmptyState component - Display when no data is available
 * 
 * @example
 * ```html
 * <app-empty-state
 *   [icon]="'pi-inbox'"
 *   [title]="'No messages'"
 *   [description]="'You have no messages in your inbox'"
 *   [actionLabel]="'Compose Message'"
 *   (action)="composeMessage()">
 * </app-empty-state>
 * ```
 */
@Component({
  selector: 'app-empty-state',
  imports: [CommonModule, ButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-col items-center justify-center text-center py-12 px-4">
      @if (icon()) {
        <div class="mb-4 p-6 rounded-full bg-surface-100 dark:bg-surface-700">
          <i [class]="'pi ' + icon() + ' text-5xl text-muted-color'"></i>
        </div>
      }
      
      @if (title()) {
        <h3 class="text-xl font-semibold text-surface-900 dark:text-surface-0 mb-2">
          {{ title() }}
        </h3>
      }
      
      @if (description()) {
        <p class="text-muted-color max-w-md mb-6">
          {{ description() }}
        </p>
      }
      
      <ng-content></ng-content>
      
      @if (actionLabel()) {
        <p-button
          [label]="actionLabel()"
          [icon]="actionIcon()"
          [severity]="actionSeverity()"
          [outlined]="actionOutlined()"
          (onClick)="handleAction()"
        />
      }
    </div>
  `,
  styles: []
})
export class EmptyStateComponent {
  // Inputs
  icon = input<string>('pi-inbox');
  title = input<string>('No data available');
  description = input<string>('');
  actionLabel = input<string>('');
  actionIcon = input<string>('');
  actionSeverity = input<'primary' | 'secondary' | 'success' | 'info' | 'warn' | 'danger'>('primary');
  actionOutlined = input<boolean>(false);

  // Output
  action = output<void>();

  handleAction(): void {
    this.action.emit();
  }
}

