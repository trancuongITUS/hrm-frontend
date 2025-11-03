import { Injectable, inject } from '@angular/core';
import { EnvironmentService } from './environment.service';
import { LogLevel } from '@environments/environment.interface';

/**
 * Log context for structured logging.
 */
export interface LogContext {
    readonly component?: string;
    readonly action?: string;
    readonly userId?: string;
    readonly sessionId?: string;
    readonly metadata?: Record<string, unknown>;
}

/**
 * Log entry interface for structured logging.
 */
export interface LogEntry {
    readonly level: LogLevel;
    readonly message: string;
    readonly timestamp: string;
    readonly context?: LogContext;
    readonly data?: unknown[];
}

/**
 * Logger service that respects environment configuration.
 * Provides structured logging with context support for better debugging and monitoring.
 * 
 * @example
 * ```typescript
 * // Simple logging
 * this.logger.info('User logged in');
 * 
 * // Logging with data
 * this.logger.error('Failed to fetch data', error);
 * 
 * // Structured logging with context
 * this.logger.withContext({ component: 'AuthComponent', action: 'login' })
 *   .info('Login attempt', { email: user.email });
 * 
 * // Group related logs
 * this.logger.group('API Call', () => {
 *   this.logger.info('Request sent');
 *   this.logger.info('Response received');
 * });
 * ```
 */
@Injectable({
    providedIn: 'root'
})
export class LoggerService {
    private readonly envService = inject(EnvironmentService);
    private context?: LogContext;

    private readonly logLevelPriority: Record<LogLevel, number> = {
        debug: 0,
        info: 1,
        warn: 2,
        error: 3
    };

    /**
     * Logs a debug message if the current log level allows it.
     */
    debug(message: string, ...args: unknown[]): void {
        if (this.shouldLog('debug')) {
            this.log('debug', message, args);
        }
    }

    /**
     * Logs an info message if the current log level allows it.
     */
    info(message: string, ...args: unknown[]): void {
        if (this.shouldLog('info')) {
            this.log('info', message, args);
        }
    }

    /**
     * Logs a warning message if the current log level allows it.
     */
    warn(message: string, ...args: unknown[]): void {
        if (this.shouldLog('warn')) {
            this.log('warn', message, args);
        }
    }

    /**
     * Logs an error message if the current log level allows it.
     */
    error(message: string, ...args: unknown[]): void {
        if (this.shouldLog('error')) {
            this.log('error', message, args);
        }
    }

    /**
     * Creates a new logger instance with specific context.
     * Context is included in all subsequent log entries.
     */
    withContext(context: LogContext): LoggerService {
        const logger = new LoggerService();
        logger.context = { ...this.context, ...context };
        return logger;
    }

    /**
     * Groups related log messages together.
     */
    group(label: string, callback: () => void): void {
        if (this.shouldLog('debug')) {
            console.group(`[GROUP] ${label}`);
            try {
                callback();
            } finally {
                console.groupEnd();
            }
        }
    }

    /**
     * Groups related log messages together (collapsed by default).
     */
    groupCollapsed(label: string, callback: () => void): void {
        if (this.shouldLog('debug')) {
            console.groupCollapsed(`[GROUP] ${label}`);
            try {
                callback();
            } finally {
                console.groupEnd();
            }
        }
    }

    /**
     * Logs a table of data (useful for arrays and objects).
     */
    table(data: unknown, columns?: string[]): void {
        if (this.shouldLog('debug')) {
            if (columns) {
                console.table(data, columns);
            } else {
                console.table(data);
            }
        }
    }

    /**
     * Starts a performance timer.
     * Returns a function to end the timer and log the duration.
     */
    time(label: string): () => void {
        if (this.shouldLog('debug')) {
            console.time(label);
            return () => {
                console.timeEnd(label);
            };
        }
        return () => { }; // No-op if logging disabled
    }

    /**
     * Logs execution time of an async operation.
     */
    async measureAsync<T>(label: string, operation: () => Promise<T>): Promise<T> {
        const endTimer = this.time(label);
        try {
            return await operation();
        } finally {
            endTimer();
        }
    }

    /**
     * Logs execution time of a synchronous operation.
     */
    measure<T>(label: string, operation: () => T): T {
        const endTimer = this.time(label);
        try {
            return operation();
        } finally {
            endTimer();
        }
    }

    /**
     * Traces function execution (useful for debugging).
     */
    trace(message: string, ...args: unknown[]): void {
        if (this.shouldLog('debug')) {
            console.trace(`[TRACE] ${message}`, ...args);
        }
    }

    /**
     * Clears the console.
     */
    clear(): void {
        if (!this.envService.isProduction) {
            console.clear();
        }
    }

    /**
     * Core logging method with structured logging support.
     */
    private log(level: LogLevel, message: string, args: unknown[]): void {
        const entry = this.createLogEntry(level, message, args);
        
        // Format message with context if available
        const formattedMessage = this.formatMessage(entry);

        // Choose appropriate console method
        const consoleMethod = this.getConsoleMethod(level);

        // Log with formatted message and data
        if (args.length > 0) {
            consoleMethod(formattedMessage, ...args);
        } else {
            consoleMethod(formattedMessage);
        }

        // Log structured entry in development for debugging
        if (!this.envService.isProduction && this.context) {
            console.debug('Log Entry:', entry);
        }
    }

    /**
     * Creates a structured log entry.
     */
    private createLogEntry(level: LogLevel, message: string, data: unknown[]): LogEntry {
        return {
            level,
            message,
            timestamp: new Date().toISOString(),
            context: this.context,
            data: data.length > 0 ? data : undefined
        };
    }

    /**
     * Formats log message with level and context.
     */
    private formatMessage(entry: LogEntry): string {
        const parts: string[] = [
            `[${entry.level.toUpperCase()}]`,
            `[${this.formatTimestamp(entry.timestamp)}]`
        ];

        if (entry.context?.component) {
            parts.push(`[${entry.context.component}]`);
        }

        if (entry.context?.action) {
            parts.push(`[${entry.context.action}]`);
        }

        parts.push(entry.message);

        return parts.join(' ');
    }

    /**
     * Formats timestamp for display.
     */
    private formatTimestamp(isoString: string): string {
        const date = new Date(isoString);
        return date.toLocaleTimeString('en-US', { 
            hour12: false, 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit',
            fractionalSecondDigits: 3
        });
    }

    /**
     * Gets the appropriate console method for the log level.
     */
    private getConsoleMethod(level: LogLevel): typeof console.log {
        switch (level) {
            case 'debug':
                return console.debug.bind(console);
            case 'info':
                return console.info.bind(console);
            case 'warn':
                return console.warn.bind(console);
            case 'error':
                return console.error.bind(console);
            default:
                return console.log.bind(console);
        }
    }

    /**
     * Determines if a message should be logged based on the current log level.
     */
    private shouldLog(level: LogLevel): boolean {
        const currentLevel = this.envService.logLevel as LogLevel;
        const currentPriority = this.logLevelPriority[currentLevel];
        const messagePriority = this.logLevelPriority[level];

        return messagePriority >= currentPriority;
    }
}

