/**
 * Common component type definitions
 * Used across all shared components for consistent typing
 */

/**
 * Size variants for components
 */
export type ComponentSize = 'small' | 'medium' | 'large';

/**
 * Color/style variants for components
 */
export type ComponentVariant =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'success'
  | 'danger'
  | 'warning'
  | 'info'
  | 'text'
  | 'outlined';

/**
 * Status types for indicators
 */
export type ComponentStatus = 'success' | 'info' | 'warning' | 'error';

/**
 * Severity levels (PrimeNG compatible)
 */
export type Severity = 'success' | 'info' | 'warn' | 'error' | 'secondary' | 'contrast';

/**
 * Position types
 */
export type Position =
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right'
  | 'center';

/**
 * Icon position in buttons or inputs
 */
export type IconPosition = 'left' | 'right';

/**
 * Button types
 */
export type ButtonType = 'button' | 'submit' | 'reset';

/**
 * Modal/Dialog sizes
 */
export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

/**
 * Loading state interface
 */
export interface LoadingState {
  isLoading: boolean;
  message?: string;
}

/**
 * Base component props that many components share
 */
export interface BaseComponentProps {
  id?: string;
  disabled?: boolean;
  ariaLabel?: string;
  ariaDescribedBy?: string;
  testId?: string;
}

