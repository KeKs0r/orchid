export type LogFn = (...args: unknown[]) => void;
/**
 * Not adding Fatal als level, since only uncaught exceptions are fatal.
 * The logger can only receive 'error' for exceptions
 */
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';
export type Logger = Record<LogLevel, LogFn>;
