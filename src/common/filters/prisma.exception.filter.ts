import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Prisma } from '@prisma/generated';
import { Request, Response } from 'express';

type PrismaMeta = {
  modelName?: string;
  table?: string;
  target?: string | string[];
  field_name?: string;
  cause?: string;
};

@Catch(Prisma.PrismaClientKnownRequestError, Prisma.PrismaClientValidationError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const path = request.originalUrl ?? request.url;
    const method = request.method;

    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      const meta = (exception.meta ?? {}) as PrismaMeta;
      const model = this.resolveModelName(meta);

      if (exception.code === 'P2025') {
        return response.status(HttpStatus.NOT_FOUND).json({
          status: 404,
          message: `${model} not found`,
          path,
          method,
        });
      }

      if (exception.code === 'P2002') {
        const fields = this.resolveFields(meta.target);
        return response.status(HttpStatus.CONFLICT).json({
          status: 409,
          message: fields
            ? `${model} with this ${fields} already exists`
            : `${model} already exists`,
          path,
          method,
        });
      }

      if (exception.code === 'P2003') {
        const field = meta.field_name;
        return response.status(HttpStatus.BAD_REQUEST).json({
          status: 400,
          message: field
            ? `Related ${model} record does not exist for '${field}'`
            : `Related ${model} record does not exist`,
          path,
          method,
        });
      }
    }

    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
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

  /** Prefer Prisma model name (`User`), fall back to DB table name. */
  private resolveModelName(meta: PrismaMeta): string {
    return meta.modelName ?? meta.table ?? 'Record';
  }

  private resolveFields(target?: string | string[]): string | undefined {
    if (!target) return undefined;
    return Array.isArray(target) ? target.join(', ') : target;
  }
}
