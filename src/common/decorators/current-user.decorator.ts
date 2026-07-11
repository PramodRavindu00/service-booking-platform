import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RequestWithUser } from '../constants/constants';

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();
    return request.user;
  },
);