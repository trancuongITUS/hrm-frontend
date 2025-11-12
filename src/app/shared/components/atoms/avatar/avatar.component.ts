import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvatarModule } from 'primeng/avatar';
import { ComponentSize } from '@shared/models';

/**
 * Avatar component - Wraps PrimeNG Avatar with custom features
 * 
 * @example
 * ```html
 * <!-- Image avatar -->
 * <app-avatar [image]="user.photoUrl" [size]="'large'"></app-avatar>
 * 
 * <!-- Initials avatar -->
 * <app-avatar [label]="'JD'" [size]="'medium'"></app-avatar>
 * 
 * <!-- Icon avatar -->
 * <app-avatar [icon]="'pi pi-user'" [size]="'small'"></app-avatar>
 * 
 * <!-- With status indicator -->
 * <app-avatar [image]="user.photoUrl" [showStatus]="true" [status]="'online'"></app-avatar>
 * ```
 */
@Component({
  selector: 'app-avatar',
  imports: [CommonModule, AvatarModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="relative inline-block">
      <p-avatar
        [image]="image()"
        [icon]="icon()"
        [label]="label()"
        [size]="primeSize()"
        [shape]="shape()"
        [class]="customClass()"
        [ariaLabel]="ariaLabel()"
      />
      
      @if (showStatus()) {
        <span 
          class="absolute bottom-0 right-0 rounded-full ring-2 ring-white dark:ring-surface-900"
          [class]="statusClass()"
          [attr.aria-label]="status() + ' status'"
        ></span>
      }
    </div>
  `,
  styles: []
})
export class AvatarComponent {
  // Inputs
  image = input<string>('');
  icon = input<string>('');
  label = input<string>('');
  size = input<ComponentSize>('medium');
  shape = input<'circle' | 'square'>('circle');
  showStatus = input<boolean>(false);
  status = input<'online' | 'offline' | 'away' | 'busy'>('offline');
  customClass = input<string>('');
  ariaLabel = input<string>('');

  // Computed properties
  primeSize = computed(() => {
    const sizeMap: Record<ComponentSize, 'normal' | 'large' | 'xlarge'> = {
      small: 'normal',
      medium: 'large',
      large: 'xlarge'
    };
    return sizeMap[this.size()];
  });

  statusClass = computed(() => {
    const classes: string[] = [];
    
    // Size based on avatar size
    const sizeMap: Record<ComponentSize, string> = {
      small: 'w-2 h-2',
      medium: 'w-3 h-3',
      large: 'w-4 h-4'
    };
    classes.push(sizeMap[this.size()]);

    // Color based on status
    const statusColors: Record<string, string> = {
      online: 'bg-green-500',
      offline: 'bg-surface-400',
      away: 'bg-yellow-500',
      busy: 'bg-red-500'
    };
    classes.push(statusColors[this.status()] || statusColors['offline']);

    return classes.join(' ');
  });
}

