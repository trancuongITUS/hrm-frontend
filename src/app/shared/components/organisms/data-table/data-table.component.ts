import { Component, ChangeDetectionStrategy, input, output, computed, contentChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule, TablePageEvent, TableRowSelectEvent } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { 
  TableColumn, 
  PaginationConfig, 
  SortConfig, 
  SelectionMode,
  TableAction 
} from '@shared/models';

/**
 * DataTable component - Generic type-safe table with PrimeNG
 * 
 * @example
 * ```html
 * <app-data-table
 *   [data]="users()"
 *   [columns]="columns"
 *   [loading]="isLoading()"
 *   [pagination]="paginationConfig"
 *   [selectionMode]="'multiple'"
 *   (rowSelect)="onRowSelect($event)"
 *   (pageChange)="onPageChange($event)">
 * </app-data-table>
 * ```
 */
@Component({
  selector: 'app-data-table',
  imports: [CommonModule, TableModule, ButtonModule, TooltipModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <p-table
      [value]="data()"
      [columns]="columns()"
      [loading]="loading()"
      [paginator]="paginator()"
      [rows]="pagination()?.pageSize || 10"
      [totalRecords]="pagination()?.totalRecords || 0"
      [lazy]="lazy()"
      [selectionMode]="selectionMode()"
      [selection]="selectedRows()"
      [dataKey]="dataKey()"
      [rowHover]="rowHover()"
      [scrollable]="scrollable()"
      [scrollHeight]="scrollHeight()"
      [styleClass]="styleClass()"
      (selectionChange)="handleSelectionChange($event)"
      (onPage)="handlePageChange($event)"
      (onSort)="handleSortChange($event)"
    >
      <ng-template pTemplate="header" let-columns>
        <tr>
          @if (selectionMode()) {
            <th style="width: 3rem">
              @if (selectionMode() === 'multiple') {
                <p-tableHeaderCheckbox />
              }
            </th>
          }
          
          @for (col of columns; track col.field) {
            <th 
              [pSortableColumn]="col.sortable ? col.field : null"
              [style.width]="col.width"
              [class]="'text-' + (col.align || 'left')"
            >
              @if (col.headerTemplate) {
                <ng-container *ngTemplateOutlet="col.headerTemplate"></ng-container>
              } @else {
                {{ col.header }}
              }
              @if (col.sortable) {
                <p-sortIcon [field]="col.field.toString()" />
              }
            </th>
          }
          
          @if (actions().length > 0) {
            <th style="width: 10rem" class="text-center">Actions</th>
          }
        </tr>
      </ng-template>

      <ng-template pTemplate="body" let-rowData let-rowIndex="rowIndex" let-columns="columns">
        <tr [pSelectableRow]="rowData" [pSelectableRowIndex]="rowIndex">
          @if (selectionMode()) {
            <td>
              @if (selectionMode() === 'single') {
                <p-tableRadioButton [value]="rowData" [index]="rowIndex" />
              } @else {
                <p-tableCheckbox [value]="rowData" [index]="rowIndex" />
              }
            </td>
          }
          
          @for (col of columns; track col.field) {
            <td [class]="'text-' + (col.align || 'left')">
              @if (col.template) {
                <ng-container *ngTemplateOutlet="col.template; context: { $implicit: rowData, rowIndex: rowIndex }"></ng-container>
              } @else if (col.formatter) {
                {{ col.formatter(rowData[col.field], rowData) }}
              } @else {
                {{ rowData[col.field] }}
              }
            </td>
          }
          
          @if (actions().length > 0) {
            <td class="text-center">
              <div class="flex items-center justify-center gap-2">
                @for (action of visibleActions(rowData); track action.label) {
                  <p-button
                    [icon]="action.icon"
                    [label]="action.label"
                    [severity]="getSeverity(action.severity)"
                    [text]="true"
                    [rounded]="true"
                    [disabled]="action.disabled?.(rowData) || false"
                    (onClick)="action.command(rowData)"
                    [pTooltip]="action.label"
                    tooltipPosition="top"
                  />
                }
              </div>
            </td>
          }
        </tr>
      </ng-template>

      <ng-template pTemplate="emptymessage">
        <tr>
          <td [attr.colspan]="totalColumns()">
            <div class="flex flex-col items-center justify-center py-8">
              <i class="pi pi-inbox text-4xl text-muted-color mb-4"></i>
              <p class="text-muted-color">{{ emptyMessage() }}</p>
            </div>
          </td>
        </tr>
      </ng-template>

      @if (loading()) {
        <ng-template pTemplate="loadingbody">
          <tr>
            <td [attr.colspan]="totalColumns()">
              <div class="flex items-center justify-center py-8">
                <i class="pi pi-spin pi-spinner text-4xl text-primary"></i>
              </div>
            </td>
          </tr>
        </ng-template>
      }
    </p-table>
  `,
  styles: []
})
export class DataTableComponent<T = unknown> {
  // Inputs
  data = input<T[]>([]);
  columns = input<TableColumn<T>[]>([]);
  loading = input<boolean>(false);
  paginator = input<boolean>(true);
  pagination = input<PaginationConfig | undefined>(undefined);
  lazy = input<boolean>(false);
  selectionMode = input<SelectionMode>(null);
  selectedRows = input<T | T[] | null>(null);
  dataKey = input<string>('id');
  rowHover = input<boolean>(true);
  scrollable = input<boolean>(false);
  scrollHeight = input<string>('400px');
  styleClass = input<string>('');
  emptyMessage = input<string>('No records found');
  actions = input<TableAction<T>[]>([]);

  // Outputs
  rowSelect = output<T>();
  selectionChange = output<T | T[]>();
  pageChange = output<TablePageEvent>();
  sortChange = output<{ field: string; order: 'asc' | 'desc' }>();

  // Computed
  totalColumns = computed(() => {
    let count = this.columns().length;
    if (this.selectionMode()) count++;
    if (this.actions().length > 0) count++;
    return count;
  });

  visibleActions(rowData: T): TableAction<T>[] {
    return this.actions().filter(action => 
      !action.visible || action.visible(rowData)
    );
  }

  getSeverity(severity?: 'success' | 'info' | 'warning' | 'danger'): 'success' | 'info' | 'warn' | 'danger' | 'secondary' {
    if (!severity) return 'secondary';
    if (severity === 'warning') return 'warn';
    return severity;
  }

  handleSelectionChange(selection: T | T[]): void {
    this.selectionChange.emit(selection);
  }

  handlePageChange(event: TablePageEvent): void {
    this.pageChange.emit(event);
  }

  handleSortChange(event: { field: string; order: number }): void {
    const order = event.order === 1 ? 'asc' : 'desc';
    this.sortChange.emit({ field: event.field, order });
  }
}

