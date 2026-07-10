import {
    createParamDecorator,
    ExecutionContext,
    NotFoundException,
  } from '@nestjs/common';
import { Request } from 'express';
  
  const CookieParamFactory = createParamDecorator(
    (cookieName: string, ctx: ExecutionContext) => {
      const request = ctx.switchToHttp().getRequest<Request>();
      const cookie = request.cookies?.[cookieName];
  
      if (!cookie) {
        throw new NotFoundException(`Cookie : ${cookieName} not found`);
      }
  
      return cookie;
    },
  );
  
  export const Cookie = (cookieName: string): ParameterDecorator => {
    return CookieParamFactory(cookieName);
  };