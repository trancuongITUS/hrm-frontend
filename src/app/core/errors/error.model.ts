/**
 * Error severity levels for classification and logging.
 */
export enum ErrorSeverity {
    LOW = 'low',
    MEDIUM = 'medium',
    HIGH = 'high',
    CRITICAL = 'critical'
}

/**
 * Error types for categorization.
 */
export enum ErrorType {
    NETWORK = 'network',
    HTTP = 'http',
    VALIDATION = 'validation',
    AUTHENTICATION = 'authentication',
    AUTHORIZATION = 'authorization',
    BUSINESS = 'business',
    RUNTIME = 'runtime',
    UNKNOWN = 'unknown'
}

/**
 * Base error information interface.
 */
export interface ErrorInfo {
    readonly message: string;
    readonly type: ErrorType;
    readonly severity: ErrorSeverity;
    readonly timestamp: Date;
    readonly code?: string;
    readonly statusCode?: number;
    readonly stack?: string;
    readonly context?: Record<string, unknown>;
}

/**
 * HTTP error details interface.
 */
export interface HttpErrorInfo extends ErrorInfo {
    readonly type: ErrorType.HTTP;
    readonly statusCode: number;
    readonly url: string;
    readonly method: string;
    readonly headers?: Record<string, string>;
}

/**
 * Validation error details interface.
 */
export interface ValidationErrorInfo extends ErrorInfo {
    readonly type: ErrorType.VALIDATION;
    readonly field?: string;
    readonly validationErrors?: ValidationErrorDetail[];
}

/**
 * Single validation error detail.
 */
export interface ValidationErrorDetail {
    readonly field: string;
    readonly message: string;
    readonly code?: string;
}

/**
 * Application error class with enhanced error information.
 */
export class ApplicationError extends Error {
    readonly type: ErrorType;
    readonly severity: ErrorSeverity;
    readonly timestamp: Date;
    readonly code?: string;
    readonly statusCode?: number;
    readonly context?: Record<string, unknown>;
    readonly originalError?: Error;

    constructor(
        message: string,
        type: ErrorType = ErrorType.UNKNOWN,
        severity: ErrorSeverity = ErrorSeverity.MEDIUM,
        options?: {
            code?: string;
            statusCode?: number;
            context?: Record<string, unknown>;
            originalError?: Error;
        }
    ) {
        super(message);
        this.name = 'ApplicationError';
        this.type = type;
        this.severity = severity;
        this.timestamp = new Date();
        this.code = options?.code;
        this.statusCode = options?.statusCode;
        this.context = options?.context;
        this.originalError = options?.originalError;

        // Maintains proper stack trace for where our error was thrown (Node.js specific)
        if (typeof (Error as any).captureStackTrace === 'function') {
            (Error as any).captureStackTrace(this, ApplicationError);
        }
    }

    /**
     * Converts the error to a serializable error info object.
     */
    toErrorInfo(): ErrorInfo {
        return {
            message: this.message,
            type: this.type,
            severity: this.severity,
            timestamp: this.timestamp,
            code: this.code,
            statusCode: this.statusCode,
            stack: this.stack,
            context: this.context
        };
    }

    /**
     * Creates an ApplicationError from any error object.
     */
    static fromError(error: unknown): ApplicationError {
        if (error instanceof ApplicationError) {
            return error;
        }

        if (error instanceof Error) {
            return new ApplicationError(error.message, ErrorType.RUNTIME, ErrorSeverity.MEDIUM, {
                originalError: error,
                context: { name: error.name }
            });
        }

        const message = typeof error === 'string' ? error : 'An unknown error occurred';
        return new ApplicationError(message, ErrorType.UNKNOWN, ErrorSeverity.LOW);
    }
}

/**
 * HTTP error class with specific HTTP error details.
 */
export class HttpError extends ApplicationError {
    readonly url: string;
    readonly method: string;
    readonly headers?: Record<string, string>;

    constructor(
        message: string,
        statusCode: number,
        url: string,
        method: string,
        options?: {
            code?: string;
            headers?: Record<string, string>;
            context?: Record<string, unknown>;
            originalError?: Error;
        }
    ) {
        super(message, ErrorType.HTTP, HttpError.getSeverityFromStatus(statusCode), {
            statusCode,
            code: options?.code,
            context: options?.context,
            originalError: options?.originalError
        });

        this.name = 'HttpError';
        this.url = url;
        this.method = method;
        this.headers = options?.headers;
    }

    /**
     * Determines error severity based on HTTP status code.
     */
    private static getSeverityFromStatus(statusCode: number): ErrorSeverity {
        if (statusCode >= 500) {
            return ErrorSeverity.CRITICAL;
        }
        if (statusCode >= 400) {
            return ErrorSeverity.MEDIUM;
        }
        return ErrorSeverity.LOW;
    }

    override toErrorInfo(): HttpErrorInfo {
        return {
            ...super.toErrorInfo(),
            type: ErrorType.HTTP,
            statusCode: this.statusCode!,
            url: this.url,
            method: this.method,
            headers: this.headers
        };
    }
}

/**
 * Validation error class for form and data validation errors.
 */
export class ValidationError extends ApplicationError {
    field?: string;
    validationErrors?: ValidationErrorDetail[];

    constructor(
        message: string,
        options?: {
            field?: string;
            validationErrors?: ValidationErrorDetail[];
            context?: Record<string, unknown>;
        }
    ) {
        super(message, ErrorType.VALIDATION, ErrorSeverity.LOW, {
            context: options?.context
        });

        this.name = 'ValidationError';
        this.field = options?.field;
        this.validationErrors = options?.validationErrors;
    }

    override toErrorInfo(): ValidationErrorInfo {
        return {
            ...super.toErrorInfo(),
            type: ErrorType.VALIDATION,
            field: this.field,
            validationErrors: this.validationErrors
        };
    }
}
