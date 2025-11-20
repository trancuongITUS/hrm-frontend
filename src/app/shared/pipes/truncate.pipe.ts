import { Pipe, PipeTransform } from '@angular/core';

/**
 * Truncates text to a specified length with ellipsis
 *
 * @example
 * ```html
 * <p>{{ longText | truncate: 50 }}</p>
 * <p>{{ description | truncate: 100: '...' }}</p>
 * <p>{{ title | truncate: 30: '': true }}</p> <!-- Truncate at word boundary -->
 * ```
 */
@Pipe({
    name: 'truncate',
    standalone: true
})
export class TruncatePipe implements PipeTransform {
    transform(value: string, limit: number = 50, ellipsis: string = '...', wordBoundary: boolean = false): string {
        if (!value) {
            return '';
        }

        if (value.length <= limit) {
            return value;
        }

        let truncated = value.substring(0, limit);

        if (wordBoundary) {
            const lastSpace = truncated.lastIndexOf(' ');
            if (lastSpace > 0) {
                truncated = truncated.substring(0, lastSpace);
            }
        }

        return truncated.trim() + ellipsis;
    }
}
