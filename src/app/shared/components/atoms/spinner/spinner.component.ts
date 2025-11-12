import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ComponentSize } from '@shared/models';

/**
 * Spinner component - Wraps PrimeNG ProgressSpinner
 * 
 * @example
 * ```html
 * <app-spinner [size]="'medium'" [strokeWidth]="'4'"></app-spinner>
 * 
 * <!-- Inline spinner -->
 * <app-spinner [size]="'small'" [inline]="true"></app-spinner>
 * ```
 */
@Component({
  selector: 'app-spinner',
  imports: [CommonModule, ProgressSpinnerModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div [class]="containerClass()">
      <p-progressSpinner
        [strokeWidth]="strokeWidth()"
        [fill]="fill()"
        [animationDuration]="animationDuration()"
        [style]="spinnerStyle()"
        [ariaLabel]="ariaLabel()"
      />
    </div>
  `,
  styles: []
})
export class SpinnerComponent {
  // Inputs
  size = input<ComponentSize>('medium');
  strokeWidth = input<string>('4');
  fill = input<string>('transparent');
  animationDuration = input<string>('2s');
  inline = input<boolean>(false);
  ariaLabel = input<string>('Loading');

  // Computed properties
  containerClass = computed(() => {
    const classes: string[] = [];
    
    if (this.inline()) {
      classes.push('inline-flex', 'items-center', 'justify-center');
    } else {
      classes.push('flex', 'items-center', 'justify-center', 'w-full');
    }
    
    return classes.join(' ');
  });

  spinnerStyle = computed(() => {
    const sizeMap: Record<ComponentSize, string> = {
      small: '24px',
      medium: '48px',
      large: '72px'
    };
    
    return {
      width: sizeMap[this.size()],
      height: sizeMap[this.size()]
    };
  });
}

