import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentSize } from '@shared/models';

/**
 * Icon component - PrimeIcons wrapper with type safety and sizing
 * 
 * @example
 * ```html
 * <app-icon [name]="'pi-user'" [size]="'large'"></app-icon>
 * <app-icon [name]="'pi-check'" [color]="'text-green-500'"></app-icon>
 * ```
 */
@Component({
  selector: 'app-icon',
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <i [class]="iconClass()" [attr.aria-label]="ariaLabel() || name()"></i>
  `,
  styles: []
})
export class IconComponent {
  // Inputs
  name = input.required<string>();
  size = input<ComponentSize>('medium');
  color = input<string>('');
  spin = input<boolean>(false);
  customClass = input<string>('');
  ariaLabel = input<string>('');

  // Computed properties
  iconClass = computed(() => {
    const classes: string[] = ['pi'];
    
    // Add icon name
    const iconName = this.name();
    if (!iconName.startsWith('pi-')) {
      classes.push(`pi-${iconName}`);
    } else {
      classes.push(iconName);
    }

    // Size classes
    const sizeClasses: Record<ComponentSize, string> = {
      small: 'text-sm',
      medium: 'text-base',
      large: 'text-xl'
    };
    classes.push(sizeClasses[this.size()]);

    // Color
    if (this.color()) {
      classes.push(this.color());
    }

    // Spin animation
    if (this.spin()) {
      classes.push('pi-spin');
    }

    // Custom classes
    if (this.customClass()) {
      classes.push(this.customClass());
    }

    return classes.join(' ');
  });
}

