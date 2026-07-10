import {
    createParamDecorator,
    ExecutionContext,
    NotFoundException,
  } from '@nestjs/common';
import { ExtendedRequest } from '../constants/constants';
  
  const CookieParamFactory = createParamDecorator(
    (cookieName: string, ctx: ExecutionContext) => {
      const request = ctx.switchToHttp().getRequest<ExtendedRequest>();
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