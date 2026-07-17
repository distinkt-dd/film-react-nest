import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

interface NestErrorResponse {
  message?: string | string[];
  error?: string;
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    let errorMessage: string;
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse =
      exception instanceof HttpException
        ? exception.getResponse()
        : { message: 'Internal server error' };

    if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
      const errorObj = exceptionResponse as NestErrorResponse;

      if (Array.isArray(errorObj.message)) {
        errorMessage = errorObj.message.join(', ');
      } else if (errorObj.message) {
        errorMessage = errorObj.message;
      } else if (errorObj.error) {
        errorMessage = errorObj.error;
      } else {
        errorMessage = 'Упс! Ошибка сервера!';
      }
    } else if (typeof exceptionResponse === 'string') {
      errorMessage = exceptionResponse;
    } else {
      errorMessage = 'Упс! Ошибка сервера!';
    }

    response.status(status).json({
      error: errorMessage,
    });
  }
}
