import { Controller, Post, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PublicRoute } from 'src/common/decorators/public-route.decorator';
import { SetRefreshTokenCookie } from 'src/common/interceptors/set-refresh-token-cookie.interceptor';
import { ClearRefreshTokenCookie } from 'src/common/interceptors/clear-refresh-token.interceptor';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  @PublicRoute()
  signup() {}

  @Post('/login')
  @PublicRoute()
  login() {}

  @Post('/refresh')
  @UseInterceptors(SetRefreshTokenCookie)
  refresh() {}

  @Post('logout')
  @UseInterceptors(ClearRefreshTokenCookie
    
  )
  logout() {}
}
