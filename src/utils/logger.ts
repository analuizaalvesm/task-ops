export enum LogLevel {
  INFO = "INFO",
  WARN = "WARN",
  ERROR = "ERROR",
  DEBUG = "DEBUG",
}

class Logger {
  /**
   * Logs an info message
   */
  info(message: string, meta?: any): void {
    this.log(LogLevel.INFO, message, meta);
  }

  /**
   * Logs a warning message
   */
  warn(message: string, meta?: any): void {
    this.log(LogLevel.WARN, message, meta);
  }

  /**
   * Logs an error message
   */
  error(message: string, error?: Error | any): void {
    this.log(LogLevel.ERROR, message, error);
  }

  /**
   * Logs a debug message
   */
  debug(message: string, meta?: any): void {
    this.log(LogLevel.DEBUG, message, meta);
  }

  /**
   * Main log method
   */
  private log(level: LogLevel, message: string, meta?: any): void {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [${level}] ${message}`;

    console.log(logMessage);

    if (meta) {
      if (meta instanceof Error) {
        console.log("Error Details:", meta.message);
        console.log("Stack Trace:", meta.stack);
      } else {
        console.log("Meta:", JSON.stringify(meta, null, 2));
      }
    }
  }
}

export const logger = new Logger();
