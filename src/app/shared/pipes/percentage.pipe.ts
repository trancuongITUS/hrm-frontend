import { Pipe, PipeTransform } from '@angular/core';

/**
 * Formats a number as a percentage with customizable options
 * Different from Angular's built-in percent pipe with additional features
 * 
 * @example
 * ```html
 * <span>{{ 0.856 | percentage }}</span>
 * <!-- Output: "85.6%" -->
 * 
 * <span>{{ 0.856 | percentage: 0 }}</span>
 * <!-- Output: "86%" -->
 * 
 * <span>{{ progress | percentage: 1: true }}</span>
 * <!-- Input already as percentage: 85.6 → Output: "85.6%" -->
 * ```
 */
@Pipe({
  name: 'percentage',
  standalone: true
})
export class PercentagePipe implements PipeTransform {
  transform(
    value: number,
    decimals: number = 1,
    isAlreadyPercentage: boolean = false
  ): string {
    if (value === null || value === undefined || isNaN(value)) {
      return '';
    }

    const percentage = isAlreadyPercentage ? value : value * 100;
    const formatted = percentage.toFixed(decimals);

    return `${formatted}%`;
  }
}

