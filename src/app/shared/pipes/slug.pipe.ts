import { Pipe, PipeTransform } from '@angular/core';

/**
 * Converts text to URL-friendly slug format
 *
 * @example
 * ```html
 * <a [routerLink]="['/blog', post.title | slug]">{{ post.title }}</a>
 * <!-- Input: "Hello World!" → Output: "hello-world" -->
 * <!-- Input: "TypeScript & Angular" → Output: "typescript-angular" -->
 * ```
 */
@Pipe({
    name: 'slug',
    standalone: true
})
export class SlugPipe implements PipeTransform {
    transform(value: string): string {
        if (!value) {
            return '';
        }

        return (
            value
                .toLowerCase()
                .trim()
                // Replace spaces and underscores with hyphens
                .replace(/[\s_]+/g, '-')
                // Remove special characters
                .replace(/[^\w-]+/g, '')
                // Replace multiple hyphens with single hyphen
                .replace(/--+/g, '-')
                // Remove leading/trailing hyphens
                .replace(/^-+|-+$/g, '')
        );
    }
}
