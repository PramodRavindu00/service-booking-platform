import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { PublicRoute } from 'src/common/decorators/public-route.decorator';
import { SetRefreshTokenCookie } from 'src/common/interceptors/set-refresh-token-cookie.interceptor';
import { ClearRefreshTokenCookie } from 'src/common/interceptors/clear-refresh-token.interceptor';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { CurrentUserType } from 'src/common/constants/constants';
import {
  AccessTokenResponseDto,
  LoginDto,
  SignUpDto,
} from './dto/auth.dto';
import { Cookie } from 'src/common/decorators/extract-cookie.decorator';
import { UserResponseDto } from 'src/user/dto/user.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  @PublicRoute()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User registered successfully' })
  @ApiResponse({ status: 409, description: 'User already exists' })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  signup(@Body() dto: SignUpDto) {
    return this.authService.signup(dto);
  }

  @Post('/login')
  @PublicRoute()
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(SetRefreshTokenCookie)
  @ApiOperation({
    summary: 'Login with email and password',
    description:
      'Returns an access token in the response body and sets a refresh token cookie.',
  })
  @ApiResponse({
    status: 200,
    description: 'Login successful',
    type: AccessTokenResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @ApiResponse({ status: 400, description: 'Validation failed' })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('/refresh')
  @PublicRoute()
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(SetRefreshTokenCookie)
  @ApiCookieAuth('refreshToken')
  @ApiOperation({
    summary: 'Refresh access token',
    description:
      'Uses the refresh token cookie to issue a new access token and refresh token cookie.',
  })
  @ApiResponse({
    status: 200,
    description: 'Token refreshed successfully',
    type: AccessTokenResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Invalid or missing refresh token' })
  refresh(@Cookie('refreshToken') refreshToken: string) {
    return this.authService.refresh(refreshToken);
  }

  @Post('/logout')
  @HttpCode(HttpStatus.OK)
  @UseInterceptors(ClearRefreshTokenCookie)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Logout current user',
    description: 'Clears the refresh token cookie.',
  })
  @ApiResponse({ status: 200, description: 'Logged out successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  logout() {}

  @Get('/me')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get the currently authenticated user' })
  @ApiResponse({
    status: 200,
    description: 'Current user details',
    type: UserResponseDto,
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getCurrentUser(@CurrentUser() user: CurrentUserType) {
    return user;
  }
}
