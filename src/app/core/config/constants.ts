/**
 * Application-wide constants.
 * This file contains all constant values used throughout the application.
 */

/**
 * API configuration constants.
 */
export const API_CONFIG = {
    TIMEOUT: 30000, // 30 seconds
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000, // 1 second
    PAGE_SIZE_DEFAULT: 20,
    PAGE_SIZE_OPTIONS: [10, 20, 50, 100]
} as const;

/**
 * Storage keys for local/session storage.
 */
export const STORAGE_KEYS = {
    ACCESS_TOKEN: 'hrm_access_token',
    REFRESH_TOKEN: 'hrm_refresh_token',
    USER_PREFERENCES: 'hrm_user_preferences',
    LANGUAGE: 'hrm_language',
    THEME: 'hrm_theme',
    LAST_ROUTE: 'hrm_last_route'
} as const;

/**
 * Date and time format constants.
 */
export const DATE_FORMATS = {
    DISPLAY: 'dd/MM/yyyy',
    DISPLAY_TIME: 'dd/MM/yyyy HH:mm',
    DISPLAY_FULL: 'dd/MM/yyyy HH:mm:ss',
    API: 'yyyy-MM-dd',
    API_TIME: "yyyy-MM-dd'T'HH:mm:ss",
    API_FULL: "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'"
} as const;

/**
 * HTTP status codes.
 */
export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    UNPROCESSABLE_ENTITY: 422,
    TOO_MANY_REQUESTS: 429,
    INTERNAL_SERVER_ERROR: 500,
    BAD_GATEWAY: 502,
    SERVICE_UNAVAILABLE: 503,
    GATEWAY_TIMEOUT: 504
} as const;

/**
 * Authentication constants.
 */
export const AUTH_CONFIG = {
    TOKEN_REFRESH_THRESHOLD: 300, // 5 minutes before expiration
    SESSION_TIMEOUT: 3600, // 1 hour
    MAX_LOGIN_ATTEMPTS: 5,
    LOCKOUT_DURATION: 900 // 15 minutes
} as const;

/**
 * Validation constants.
 */
export const VALIDATION = {
    EMAIL_PATTERN: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    PHONE_PATTERN: /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/,
    PASSWORD_MIN_LENGTH: 8,
    PASSWORD_PATTERN: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    USERNAME_MIN_LENGTH: 3,
    USERNAME_MAX_LENGTH: 50
} as const;

/**
 * UI constants.
 */
export const UI_CONFIG = {
    TOAST_DURATION: 3000, // 3 seconds
    DEBOUNCE_TIME: 300, // 300ms
    ANIMATION_DURATION: 200, // 200ms
    LOADING_DELAY: 500, // 500ms before showing loader
    ITEMS_PER_PAGE: 20
} as const;

/**
 * File upload constants.
 */
export const FILE_UPLOAD = {
    MAX_SIZE: 5242880, // 5MB in bytes
    ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']
} as const;

/**
 * Application routes.
 */
export const APP_ROUTES = {
    HOME: '/',
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    FORGOT_PASSWORD: '/auth/forgot-password',
    DASHBOARD: '/dashboard',
    PROFILE: '/profile',
    SETTINGS: '/settings',
    NOT_FOUND: '/error/404',
    FORBIDDEN: '/error/403',
    SERVER_ERROR: '/error/500'
} as const;

/**
 * User roles.
 * Extend this as needed for your application's role-based access control.
 */
export const USER_ROLES = {
    ADMIN: 'ADMIN',
    USER: 'USER',
    GUEST: 'GUEST'
} as const;

/**
 * User role type.
 */
export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

/**
 * Feature flags.
 */
export const FEATURE_FLAGS = {
    ENABLE_ANALYTICS: 'enableAnalytics',
    ENABLE_ERROR_TRACKING: 'enableErrorTracking',
    ENABLE_NOTIFICATIONS: 'enableNotifications',
    ENABLE_DARK_MODE: 'enableDarkMode'
} as const;
