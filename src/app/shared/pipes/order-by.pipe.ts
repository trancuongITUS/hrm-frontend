import { Pipe, PipeTransform } from '@angular/core';

type SortOrder = 'asc' | 'desc';

/**
 * Sorts an array by a property or multiple properties
 *
 * @example
 * ```html
 * <div *ngFor="let user of users | orderBy: 'name'">{{ user.name }}</div>
 * <div *ngFor="let user of users | orderBy: 'age': 'desc'">{{ user.age }}</div>
 * <div *ngFor="let user of users | orderBy: ['department', 'name']">...</div>
 * ```
 *
 * @note This is an impure pipe and may impact performance with large datasets.
 * Consider sorting in the component for better performance.
 */
@Pipe({
    name: 'orderBy',
    standalone: true,
    pure: false
})
export class OrderByPipe implements PipeTransform {
    transform<T>(items: T[], property: keyof T | (keyof T)[], order: SortOrder = 'asc'): T[] {
        if (!items || items.length === 0) {
            return items;
        }

        const sortedItems = [...items];
        const properties = Array.isArray(property) ? property : [property];
        const direction = order === 'asc' ? 1 : -1;

        sortedItems.sort((a, b) => {
            for (const prop of properties) {
                const valueA = a[prop];
                const valueB = b[prop];

                const comparison = this.compare(valueA, valueB);
                if (comparison !== 0) {
                    return comparison * direction;
                }
            }
            return 0;
        });

        return sortedItems;
    }

    private compare(a: unknown, b: unknown): number {
        if (a === b) return 0;
        if (a === null || a === undefined) return -1;
        if (b === null || b === undefined) return 1;

        // Handle numbers
        if (typeof a === 'number' && typeof b === 'number') {
            return a - b;
        }

        // Handle dates
        if (a instanceof Date && b instanceof Date) {
            return a.getTime() - b.getTime();
        }

        // Handle strings (case-insensitive)
        const strA = String(a).toLowerCase();
        const strB = String(b).toLowerCase();
        return strA.localeCompare(strB);
    }
}
