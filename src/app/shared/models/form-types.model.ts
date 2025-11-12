/**
 * Form-related type definitions
 * Used for form components and dynamic form generation
 */

import { ValidatorFn } from '@angular/forms';
import { ComponentSize } from './component-types.model';

/**
 * Input field types
 */
export type InputType =
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'tel'
  | 'url'
  | 'search'
  | 'date'
  | 'time'
  | 'datetime-local';

/**
 * Form field types for dynamic forms
 */
export type FormFieldType =
  | 'text'
  | 'email'
  | 'password'
  | 'number'
  | 'textarea'
  | 'select'
  | 'multiselect'
  | 'checkbox'
  | 'radio'
  | 'switch'
  | 'date'
  | 'time'
  | 'file'
  | 'autocomplete'
  | 'chips';

/**
 * Validation error messages
 */
export interface ValidationErrors {
  [key: string]: string;
}

/**
 * Form field configuration for dynamic forms
 */
export interface FormFieldConfig {
  name: string;
  label: string;
  type: FormFieldType;
  placeholder?: string;
  value?: unknown;
  size?: ComponentSize;
  disabled?: boolean;
  required?: boolean;
  readonly?: boolean;
  validators?: ValidatorFn[];
  options?: SelectOption[];
  hint?: string;
  errorMessages?: ValidationErrors;
  col?: number; // Grid column span
  order?: number; // Display order
  condition?: FormFieldCondition;
}

/**
 * Select option interface
 */
export interface SelectOption<T = unknown> {
  label: string;
  value: T;
  disabled?: boolean;
  icon?: string;
  group?: string;
}

/**
 * Form field conditional display
 */
export interface FormFieldCondition {
  field: string; // Field name to watch
  operator: 'equals' | 'notEquals' | 'contains' | 'greaterThan' | 'lessThan';
  value: unknown;
}

/**
 * File upload constraints
 */
export interface FileUploadConstraints {
  maxFileSize?: number; // in bytes
  allowedTypes?: string[]; // MIME types
  maxFiles?: number;
  accept?: string; // HTML accept attribute
}

/**
 * Uploaded file info
 */
export interface UploadedFile {
  name: string;
  size: number;
  type: string;
  url?: string;
  file?: File;
}

/**
 * Form validation state
 */
export interface FormValidationState {
  isValid: boolean;
  errors: { [fieldName: string]: string[] };
  touched: { [fieldName: string]: boolean };
  dirty: { [fieldName: string]: boolean };
}

