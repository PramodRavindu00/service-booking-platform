import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { PinoLogger } from 'nestjs-pino';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_ROUTE } from '../decorators/public-route.decorator';
import { JwtPayload, RequestWithUser } from '../constants/constants';
import { UserService } from 'src/users/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly logger: PinoLogger,
    private reflector: Reflector,
  ) {
    this.logger.setContext(AuthGuard.name);
  }
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<RequestWithUser>();
    const isPublicRoute = this.reflector.getAllAndOverride<boolean>(
      IS_PUBLIC_ROUTE,
      [context.getHandler(), context.getClass()],
    );

    if (isPublicRoute) {
      return true; // Bypass authentication
    }

    const token = this.extractTokenFromHeader(req);
    if (!token) {
      this.logger.error('Token not found');
      throw new UnauthorizedException('Token not found');
    }
    try {
      const payLoad: JwtPayload = this.jwtService.verify(token); //if this fails moves to catch block

      //check the user in the access token is actually exists
      const user = await this.userService.getUserById(payLoad.sub);

      //access token is valid somehow , but user not found probably deleted
      if (!user) {
        this.logger.error('User not found');
        throw new UnauthorizedException();
      }

      req.user = user;
      return true; // return true if no error
    } catch (error) {
      this.logger.error(error);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  private extractTokenFromHeader(req: Request): string | undefined {
    const [type, token] = req.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
