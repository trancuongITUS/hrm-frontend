import { Injectable, inject } from '@angular/core';
import { EnvironmentService } from './environment.service';
import { LogLevel } from '@environments/environment.interface';

/**
 * Logger service that respects environment configuration.
 * This service demonstrates how to use environment configuration
 * to control application behavior.
 */
@Injectable({
    providedIn: 'root'
})
export class LoggerService {
    private readonly envService = inject(EnvironmentService);

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
            console.debug(`[DEBUG] ${message}`, ...args);
        }
    }

    /**
     * Logs an info message if the current log level allows it.
     */
    info(message: string, ...args: unknown[]): void {
        if (this.shouldLog('info')) {
            console.info(`[INFO] ${message}`, ...args);
        }
    }

    /**
     * Logs a warning message if the current log level allows it.
     */
    warn(message: string, ...args: unknown[]): void {
        if (this.shouldLog('warn')) {
            console.warn(`[WARN] ${message}`, ...args);
        }
    }

    /**
     * Logs an error message if the current log level allows it.
     */
    error(message: string, ...args: unknown[]): void {
        if (this.shouldLog('error')) {
            console.error(`[ERROR] ${message}`, ...args);
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

