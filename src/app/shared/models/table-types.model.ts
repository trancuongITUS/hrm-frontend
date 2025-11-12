/**
 * Table and data grid type definitions
 * Used for DataTable and DataGrid components
 */

import { TemplateRef } from '@angular/core';

/**
 * Generic table column configuration
 */
export interface TableColumn<T = unknown> {
  field: keyof T | string;
  header: string;
  sortable?: boolean;
  filterable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
  frozen?: boolean;
  hidden?: boolean;
  template?: TemplateRef<unknown>;
  headerTemplate?: TemplateRef<unknown>;
  formatter?: (value: unknown, row: T) => string;
}

/**
 * Table pagination configuration
 */
export interface PaginationConfig {
  page: number;
  pageSize: number;
  totalRecords: number;
  pageSizeOptions?: number[];
}

/**
 * Table sort configuration
 */
export interface SortConfig {
  field: string;
  order: 'asc' | 'desc' | null;
}

/**
 * Table filter configuration
 */
export interface FilterConfig {
  field: string;
  value: unknown;
  matchMode?: FilterMatchMode;
}

/**
 * Filter match modes
 */
export type FilterMatchMode =
  | 'startsWith'
  | 'contains'
  | 'notContains'
  | 'endsWith'
  | 'equals'
  | 'notEquals'
  | 'in'
  | 'lessThan'
  | 'lessThanOrEqual'
  | 'greaterThan'
  | 'greaterThanOrEqual'
  | 'between'
  | 'dateIs'
  | 'dateIsNot'
  | 'dateBefore'
  | 'dateAfter';

/**
 * Table selection mode
 */
export type SelectionMode = 'single' | 'multiple' | null;

/**
 * Table export format
 */
export type ExportFormat = 'csv' | 'excel' | 'pdf';

/**
 * Table state for persistence
 */
export interface TableState {
  pagination?: PaginationConfig;
  sort?: SortConfig;
  filters?: FilterConfig[];
  selection?: unknown[];
  expandedRows?: unknown[];
}

/**
 * Table action configuration
 */
export interface TableAction<T = unknown> {
  label: string;
  icon?: string;
  command: (row: T) => void;
  visible?: (row: T) => boolean;
  disabled?: (row: T) => boolean;
  severity?: 'success' | 'info' | 'warning' | 'danger';
}

/**
 * Table event payload for row actions
 */
export interface TableRowEvent<T = unknown> {
  data: T;
  index: number;
}

/**
 * Table page event
 */
export interface TablePageEvent {
  first: number;
  rows: number;
  page: number;
  pageCount: number;
}

/**
 * Table sort event
 */
export interface TableSortEvent {
  field: string;
  order: 'asc' | 'desc';
}

/**
 * Table filter event
 */
export interface TableFilterEvent {
  filters: { [key: string]: FilterConfig };
  filteredValue: unknown[];
}

/**
 * Data grid item configuration
 */
export interface DataGridConfig {
  columns?: number; // Number of columns in grid
  gap?: string; // Gap between items (Tailwind class)
  loading?: boolean;
}

