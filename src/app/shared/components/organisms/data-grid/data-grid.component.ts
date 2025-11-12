import { Component, ChangeDetectionStrategy, input, output, computed, contentChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataViewModule } from 'primeng/dataview';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { DataGridConfig } from '@shared/models';

/**
 * DataGrid component - Responsive grid layout for data display
 * 
 * @example
 * ```html
 * <app-data-grid
 *   [data]="products()"
 *   [loading]="isLoading()"
 *   [columns]="4"
 *   [paginator]="true"
 *   [rows]="12">
 *   <ng-template #itemTemplate let-item let-index="index">
 *     <div class="card">
 *       <img [src]="item.image" [alt]="item.name" />
 *       <h4>{{ item.name }}</h4>
 *       <p>{{ item.price | currency }}</p>
 *     </div>
 *   </ng-template>
 * </app-data-grid>
 * ```
 */
@Component({
  selector: 'app-data-grid',
  imports: [CommonModule, DataViewModule, PaginatorModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <p-dataView
      [value]="data()"
      [layout]="'grid'"
      [paginator]="paginator()"
      [rows]="rows()"
      [totalRecords]="totalRecords()"
      [lazy]="lazy()"
      [loading]="loading()"
      (onPage)="handlePageChange($event)"
    >
      <ng-template pTemplate="header">
        @if (header()) {
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-xl font-semibold">{{ header() }}</h3>
            <ng-content select="[headerActions]"></ng-content>
          </div>
        }
      </ng-template>

      <ng-template pTemplate="grid" let-items>
        <div [class]="gridClass()">
          @for (item of items; track trackBy()(item, $index)) {
            @if (itemTemplate()) {
              <ng-container *ngTemplateOutlet="itemTemplate()!; context: { $implicit: item, index: $index }"></ng-container>
            } @else {
              <div class="card">
                {{ item | json }}
              </div>
            }
          }
        </div>
      </ng-template>

      <ng-template pTemplate="empty">
        <div class="flex flex-col items-center justify-center py-12">
          <i class="pi pi-inbox text-5xl text-muted-color mb-4"></i>
          <p class="text-lg text-muted-color">{{ emptyMessage() }}</p>
        </div>
      </ng-template>
    </p-dataView>
  `,
  styles: []
})
export class DataGridComponent<T = unknown> {
  // Inputs
  data = input<T[]>([]);
  loading = input<boolean>(false);
  columns = input<number>(3);
  gap = input<string>('gap-4');
  paginator = input<boolean>(false);
  rows = input<number>(12);
  totalRecords = input<number>(0);
  lazy = input<boolean>(false);
  header = input<string>('');
  emptyMessage = input<string>('No items to display');
  trackBy = input<(item: T, index: number) => unknown>((item: T, index: number) => index);

  // Template
  itemTemplate = contentChild<TemplateRef<{ $implicit: T; index: number }>>('itemTemplate');

  // Outputs
  pageChange = output<PaginatorState>();

  // Computed
  gridClass = computed(() => {
    const cols = this.columns();
    const gap = this.gap();
    
    // Responsive grid classes
    const gridCols: Record<number, string> = {
      1: 'grid-cols-1',
      2: 'grid-cols-1 sm:grid-cols-2',
      3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
      4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
      5: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5',
      6: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6'
    };
    
    return `grid ${gridCols[cols] || gridCols[3]} ${gap}`;
  });

  handlePageChange(event: PaginatorState): void {
    this.pageChange.emit(event);
  }
}

