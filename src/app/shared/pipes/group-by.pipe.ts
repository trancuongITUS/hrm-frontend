import { Pipe, PipeTransform } from '@angular/core';

export interface GroupedItems<T> {
    key: string;
    value: T[];
}

/**
 * Groups an array of objects by a specified property
 *
 * @example
 * ```html
 * <div *ngFor="let group of users | groupBy: 'department'">
 *   <h3>{{ group.key }}</h3>
 *   <div *ngFor="let user of group.value">{{ user.name }}</div>
 * </div>
 * ```
 *
 * @note This is an impure pipe and may impact performance with large datasets.
 * Consider grouping in the component for better performance.
 */
@Pipe({
    name: 'groupBy',
    standalone: true,
    pure: false
})
export class GroupByPipe implements PipeTransform {
    transform<T>(items: T[], property: keyof T): GroupedItems<T>[] {
        if (!items || items.length === 0) {
            return [];
        }

        const grouped = new Map<string, T[]>();

        items.forEach((item) => {
            const key = String(item[property] ?? 'undefined');
            const group = grouped.get(key) ?? [];
            group.push(item);
            grouped.set(key, group);
        });

        return Array.from(grouped.entries()).map(([key, value]) => ({
            key,
            value
        }));
    }
}
