import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml, SafeResourceUrl, SafeScript, SafeStyle, SafeUrl } from '@angular/platform-browser';

/**
 * Sanitizes and marks values as safe for Angular's security contexts
 *
 * @example
 * ```html
 * <div [innerHTML]="htmlContent | safe: 'html'"></div>
 * <iframe [src]="videoUrl | safe: 'resourceUrl'"></iframe>
 * <a [href]="dynamicUrl | safe: 'url'">Link</a>
 * ```
 */
@Pipe({
    name: 'safe',
    standalone: true
})
export class SafePipe implements PipeTransform {
    constructor(private readonly sanitizer: DomSanitizer) {}

    transform(value: string, type: 'html' | 'style' | 'script' | 'url' | 'resourceUrl'): SafeHtml | SafeStyle | SafeScript | SafeUrl | SafeResourceUrl {
        switch (type) {
            case 'html':
                return this.sanitizer.sanitize(1, value) ? this.sanitizer.bypassSecurityTrustHtml(value) : '';
            case 'style':
                return this.sanitizer.bypassSecurityTrustStyle(value);
            case 'script':
                return this.sanitizer.bypassSecurityTrustScript(value);
            case 'url':
                return this.sanitizer.bypassSecurityTrustUrl(value);
            case 'resourceUrl':
                return this.sanitizer.bypassSecurityTrustResourceUrl(value);
            default:
                return value;
        }
    }
}
