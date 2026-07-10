import { AuthGuard } from '@nestjs/passport';
import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { CurrentUserType, JwtPayload } from 'src/common/constants/constants';
import { UsersService } from 'src/users/users.service';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_ROUTE } from '../decorators/public-route.decorator';
import { Observable } from 'rxjs';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    config: ConfigService,
    private readonly userService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.getOrThrow('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload): Promise<CurrentUserType> {
    //check user is actually existing in the database
    // this will prevent stale tokens access endpoints
    const user = await this.userService.getUserById(payload.sub);
    if (!user) {
      throw new UnauthorizedException('User not Found');
    }
    return {
      id: user.id,
      email: user.email,
    };
  }
}

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    
    const isPublicRoute = this.reflector.getAllAndOverride<boolean>(
      IS_PUBLIC_ROUTE,
      [context.getHandler(), context.getClass()],
    );

    if (isPublicRoute) {
      return true; // Bypass authentication
    }

    return super.canActivate(context);
  }
}
