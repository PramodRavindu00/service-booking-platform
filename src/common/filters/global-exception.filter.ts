import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { FieldErrors } from '../utils/validation-exception.factory';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();
    const path = req.originalUrl ?? req.url;
    const method = req.method;

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const body = exception.getResponse();

      // Validation errors → { field: string[] }
      if (status === HttpStatus.BAD_REQUEST && this.isValidationBody(body)) {
        return res.status(400).json({
          status: 400,
          errors: (body as { errors: FieldErrors }).errors,
          path,
          method,
        });
      }

      // 404 / 405 / other HttpExceptions (401, 403, …)
      return res.status(status).json({
        status,
        message: this.messageOf(body, status),
        path,
        method,
      });
    }

    // Unhandled → 500
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      status: 500,
      message:
        process.env.NODE_ENV === 'production'
          ? 'Internal server error'
          : exception instanceof Error
            ? exception.message
            : 'Internal server error',
      path,
      method,
    });
  }

  private isValidationBody(body: string | object): boolean {
    if (typeof body !== 'object' || body === null) return false;
    const errors = (body as { errors?: unknown }).errors;
    return typeof errors === 'object' && errors !== null && !Array.isArray(errors);
  }

  private messageOf(body: string | object, status: number): string {
    if (typeof body === 'string') return body;

    const message = (body as { message?: string | string[] }).message;
    if (typeof message === 'string') return message;
    if (Array.isArray(message)) return message.join(', ');

    if (status === HttpStatus.NOT_FOUND) return 'Route not found';
    if (status === HttpStatus.METHOD_NOT_ALLOWED) return 'Method not allowed';
    if (status >= 500) return 'Internal server error';
    return 'Unexpected error';
  }
}
