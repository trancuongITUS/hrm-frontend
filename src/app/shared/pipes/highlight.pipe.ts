import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

/**
 * Highlights search terms in text with HTML markup
 *
 * @example
 * ```html
 * <div [innerHTML]="text | highlight: searchTerm"></div>
 * <div [innerHTML]="text | highlight: searchTerm: 'yellow'"></div>
 * ```
 *
 * @note Returns SafeHtml, use with [innerHTML] binding
 */
@Pipe({
    name: 'highlight',
    standalone: true
})
export class HighlightPipe implements PipeTransform {
    constructor(private readonly sanitizer: DomSanitizer) {}

    transform(value: string, searchTerm: string, highlightColor: string = '#ffeb3b'): SafeHtml {
        if (!value || !searchTerm) {
            return value || '';
        }

        const term = this.escapeRegex(searchTerm);
        const regex = new RegExp(term, 'gi');

        const highlighted = value.replace(regex, (match) => `<mark style="background-color: ${highlightColor}; padding: 0 2px;">${match}</mark>`);

        return this.sanitizer.bypassSecurityTrustHtml(highlighted);
    }

    private escapeRegex(str: string): string {
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
}
