import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor,
  } from '@nestjs/common';
  import { Response } from 'express';
  import { Observable } from 'rxjs';
  
  @Injectable()
  export class ClearRefreshTokenCookie implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
      const ctx = context.switchToHttp();
      const res = ctx.getResponse<Response>();
      res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/auth/refresh',
      });
      return next.handle();
    }
  }