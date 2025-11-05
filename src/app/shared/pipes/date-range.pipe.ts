import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

/**
 * Formats a date range with smart formatting
 * Shows single date if start and end are the same day
 * 
 * @example
 * ```html
 * <span>{{ event | dateRange }}</span>
 * <!-- Output: "Jan 15, 2024 - Jan 20, 2024" -->
 * <span>{{ event | dateRange: 'short' }}</span>
 * <!-- Output: "1/15/24 - 1/20/24" -->
 * ```
 */
@Pipe({
  name: 'dateRange',
  standalone: true
})
export class DateRangePipe implements PipeTransform {
  private readonly datePipe = new DatePipe('en-US');

  transform(
    value: { startDate: Date | string; endDate: Date | string } | null | undefined,
    format: 'short' | 'medium' | 'long' = 'medium'
  ): string {
    if (!value?.startDate || !value?.endDate) {
      return '';
    }

    const startDate = new Date(value.startDate);
    const endDate = new Date(value.endDate);

    const formatPattern = this.getFormatPattern(format);

    // Check if same day
    if (this.isSameDay(startDate, endDate)) {
      return this.datePipe.transform(startDate, formatPattern) || '';
    }

    const startFormatted = this.datePipe.transform(startDate, formatPattern);
    const endFormatted = this.datePipe.transform(endDate, formatPattern);

    return `${startFormatted} - ${endFormatted}`;
  }

  private isSameDay(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  private getFormatPattern(format: 'short' | 'medium' | 'long'): string {
    switch (format) {
      case 'short':
        return 'M/d/yy';
      case 'long':
        return 'MMMM d, y';
      case 'medium':
      default:
        return 'MMM d, y';
    }
  }
}

