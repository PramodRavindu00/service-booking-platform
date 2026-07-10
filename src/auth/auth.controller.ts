import { Body, Controller, Get, Post, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PublicRoute } from 'src/common/decorators/public-route.decorator';
import { SetRefreshTokenCookie } from 'src/common/interceptors/set-refresh-token-cookie.interceptor';
import { ClearRefreshTokenCookie } from 'src/common/interceptors/clear-refresh-token.interceptor';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { CurrentUserType } from 'src/common/constants/constants';
import { LoginDto, SignUpDto } from './dto/auth.dto';
import { Cookie } from 'src/common/decorators/extract-cookie.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  @PublicRoute()
  signup(@Body() dto: SignUpDto) {
    return this.authService.signup(dto);
  }

  @Post('/login')
  @PublicRoute()
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('/refresh')
  @PublicRoute()
  @UseInterceptors(SetRefreshTokenCookie)
  refresh(@Cookie('refreshToken') refreshToken: string) {
    return this.authService.refresh(refreshToken);
  }

  @Post('/logout')
  @UseInterceptors(ClearRefreshTokenCookie)
  logout() {}

  @Get('/me')
  getCurrentUser(@CurrentUser() user: CurrentUserType) {
    return user;
  }
}
