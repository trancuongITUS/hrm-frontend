import { Pipe, PipeTransform } from '@angular/core';

/**
 * Converts bytes to human-readable file size format
 *
 * @example
 * ```html
 * <span>{{ file.size | fileSize }}</span>
 * <!-- Input: 1024 → Output: "1 KB" -->
 * <!-- Input: 1536000 → Output: "1.46 MB" -->
 *
 * <span>{{ file.size | fileSize: 0 }}</span>
 * <!-- Input: 1536000 → Output: "1 MB" (no decimals) -->
 * ```
 */
@Pipe({
  name: 'fileSize',
  standalone: true
})
export class FileSizePipe implements PipeTransform {
  private readonly units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];

  transform(bytes: number, decimals: number = 2): string {
    if (bytes === 0) {
      return '0 B';
    }

    if (!bytes || bytes < 0) {
      return '';
    }

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    const value = bytes / Math.pow(k, i);
    const formattedValue = value.toFixed(dm);

    return `${formattedValue} ${this.units[i]}`;
  }
}

