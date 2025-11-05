import { Pipe, PipeTransform } from '@angular/core';

/**
 * Formats numbers with thousands separators and custom formatting
 *
 * @example
 * ```html
 * <span>{{ 1234567 | numberFormat }}</span>
 * <!-- Output: "1,234,567" -->
 *
 * <span>{{ 1234567.89 | numberFormat: 2 }}</span>
 * <!-- Output: "1,234,567.89" -->
 *
 * <span>{{ 1234567 | numberFormat: 0: 'k' }}</span>
 * <!-- Output: "1,235k" -->
 * ```
 */
@Pipe({
  name: 'numberFormat',
  standalone: true
})
export class NumberFormatPipe implements PipeTransform {
  transform(
    value: number,
    decimals: number = 0,
    suffix: '' | 'k' | 'M' | 'B' = ''
  ): string {
    if (value === null || value === undefined || isNaN(value)) {
      return '';
    }

    let formattedValue = value;
    let usedSuffix = suffix;

    // Auto-detect suffix if not provided
    if (!suffix && Math.abs(value) >= 1000) {
      if (Math.abs(value) >= 1000000000) {
        formattedValue = value / 1000000000;
        usedSuffix = 'B';
      } else if (Math.abs(value) >= 1000000) {
        formattedValue = value / 1000000;
        usedSuffix = 'M';
      } else if (Math.abs(value) >= 1000) {
        formattedValue = value / 1000;
        usedSuffix = 'k';
      }
    } else if (suffix === 'k') {
      formattedValue = value / 1000;
    } else if (suffix === 'M') {
      formattedValue = value / 1000000;
    } else if (suffix === 'B') {
      formattedValue = value / 1000000000;
    }

    // Format with commas and decimals
    const parts = formattedValue.toFixed(decimals).split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    return parts.join('.') + (usedSuffix ? usedSuffix : '');
  }
}

