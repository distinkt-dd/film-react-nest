import { Injectable, LoggerService } from '@nestjs/common';

@Injectable()
export class TskvLogger implements LoggerService {
  formatMessage(level: string, message: string, ...optionalParams: unknown[]) {
    const optional = optionalParams
      ? `optional=${JSON.stringify(optionalParams)}`
      : '';

    return [`level=${level}`, `message=${message.replace(/\t/g, '')}`, optional]
      .filter((data) => data)
      .join('\t');
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
