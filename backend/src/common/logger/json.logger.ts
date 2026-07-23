import { Injectable, LoggerService } from '@nestjs/common';

@Injectable()
export class JsonLogger implements LoggerService {
  formatMessage(level: string, message: string, ...optionalParams: unknown[]) {
    return JSON.stringify({ level, message, optionalParams });
  }

  log(message: string, ...optionalParams: unknown[]) {
    console.log(this.formatMessage('log', message, optionalParams));
  }

  fatal(message: string, ...optionalParams: unknown[]) {
    console.log(this.formatMessage('fatal', message, optionalParams));
  }

  error(message: string, ...optionalParams: unknown[]) {
    console.log(this.formatMessage('error', message, optionalParams));
  }

  warn(message: string, ...optionalParams: unknown[]) {
    console.log(this.formatMessage('warn', message, optionalParams));
  }

  debug?(message: string, ...optionalParams: unknown[]) {
    console.log(this.formatMessage('debug', message, optionalParams));
  }

  verbose?(message: string, ...optionalParams: unknown[]) {
    console.log(this.formatMessage('verbose', message, optionalParams));
  }
}
