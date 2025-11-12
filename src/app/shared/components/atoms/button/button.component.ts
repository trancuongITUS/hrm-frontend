import { Component, ChangeDetectionStrategy, input, output, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { ComponentSize, ComponentVariant, ButtonType, IconPosition } from '@shared/models';

/**
 * Button component - Wraps PrimeNG Button with custom variants
 * 
 * @example
 * ```html
 * <app-button 
 *   [variant]="'primary'" 
 *   [size]="'medium'"
 *   [loading]="isSubmitting()"
 *   (onClick)="handleClick()">
 *   Submit
 * </app-button>
 * ```
 */
@Component({
  selector: 'app-button',
  imports: [CommonModule, ButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <p-button
      [type]="type()"
      [label]="label()"
      [icon]="icon()"
      [iconPos]="iconPos()"
      [loading]="loading()"
      [disabled]="disabled()"
      [severity]="severity()"
      [text]="variant() === 'text'"
      [outlined]="variant() === 'outlined'"
      [rounded]="rounded()"
      [raised]="raised()"
      [size]="primeSize()"
      [class]="customClass()"
      [ariaLabel]="ariaLabel()"
      (onClick)="handleClick($event)"
    >
      @if (!label() && !icon()) {
        <ng-content></ng-content>
      }
    </p-button>
  `,
  styles: []
})
export class ButtonComponent {
  // Inputs
  variant = input<ComponentVariant>('primary');
  size = input<ComponentSize>('medium');
  type = input<ButtonType>('button');
  label = input<string>('');
  icon = input<string>('');
  iconPos = input<IconPosition>('left');
  loading = input<boolean>(false);
  disabled = input<boolean>(false);
  rounded = input<boolean>(false);
  raised = input<boolean>(false);
  customClass = input<string>('');
  ariaLabel = input<string>('');

  // Output
  onClick = output<Event>();

  // Computed properties
  severity = computed((): 'primary' | 'secondary' | 'success' | 'info' | 'warn' | 'danger' | 'help' | 'contrast' | undefined => {
    const variantMap: Record<string, 'primary' | 'secondary' | 'success' | 'info' | 'warn' | 'danger'> = {
      primary: 'primary',
      secondary: 'secondary',
      success: 'success',
      danger: 'danger',
      warning: 'warn',
      info: 'info',
      default: 'secondary'
    };
    return variantMap[this.variant()] || 'primary';
  });

  primeSize = computed(() => {
    const sizeMap: Record<ComponentSize, 'small' | 'large' | undefined> = {
      small: 'small',
      medium: undefined,
      large: 'large'
    };
    return sizeMap[this.size()];
  });

  handleClick(event: Event): void {
    if (!this.disabled() && !this.loading()) {
      this.onClick.emit(event);
    }
  }
}

