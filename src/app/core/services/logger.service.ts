import { Injectable } from '@angular/core';

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  namespace: string; // exemple: commandes.form.submit
  message: string;
  data?: unknown;
}

@Injectable({ providedIn: 'root' })
export class LoggerService {
  private format(entry: LogEntry): string {
    return JSON.stringify(entry);
  }

  private log(level: LogLevel, namespace: string, message: string, data?: unknown): void {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      namespace,
      message,
      data,
    };
    const output = this.format(entry);
    switch (level) {
      case 'debug':
      case 'info':
        console.log(output);
        break;
      case 'warn':
        console.warn(output);
        break;
      case 'error':
        console.error(output);
        break;
    }
  }

  debug(namespace: string, message: string, data?: unknown): void {
    this.log('debug', namespace, message, data);
  }

  info(namespace: string, message: string, data?: unknown): void {
    this.log('info', namespace, message, data);
  }

  warn(namespace: string, message: string, data?: unknown): void {
    this.log('warn', namespace, message, data);
  }

  error(namespace: string, message: string, data?: unknown): void {
    this.log('error', namespace, message, data);
  }
}
