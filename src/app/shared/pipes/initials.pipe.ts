import { Pipe, PipeTransform } from '@angular/core';

/**
 * Extracts initials from a name
 * 
 * @example
 * ```html
 * <div class="avatar">{{ user.name | initials }}</div>
 * <!-- Input: "John Doe" → Output: "JD" -->
 * <!-- Input: "John Michael Doe" → Output: "JD" (first and last) -->
 * 
 * <div class="avatar">{{ user.name | initials: 3 }}</div>
 * <!-- Input: "John Michael Doe" → Output: "JMD" -->
 * ```
 */
@Pipe({
  name: 'initials',
  standalone: true
})
export class InitialsPipe implements PipeTransform {
  transform(value: string, maxInitials: number = 2): string {
    if (!value || typeof value !== 'string') {
      return '';
    }

    const words = value
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0);

    if (words.length === 0) {
      return '';
    }

    if (words.length === 1) {
      return words[0].charAt(0).toUpperCase();
    }

    // Get first and last initials if max is 2, otherwise get first N
    let initials: string[];
    if (maxInitials === 2 && words.length > 2) {
      initials = [words[0].charAt(0), words[words.length - 1].charAt(0)];
    } else {
      initials = words.slice(0, maxInitials).map((word) => word.charAt(0));
    }

    return initials.join('').toUpperCase();
  }
}

