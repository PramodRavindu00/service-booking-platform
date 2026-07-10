import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginDto, SignUpDto } from './dto/auth.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';
import { AuthTokens, JwtPayload } from 'src/common/constants/constants';
import { comparePassword } from 'src/common/utils/bcrypt';
import { PinoLogger } from 'nestjs-pino';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly logger: PinoLogger,
  ) {}
  async signup(dto: SignUpDto): Promise<void> {
    const existingUser = await this.userService.getUserByEmail(dto.email);
    if (existingUser) {
      //if user exists throw

      throw new ConflictException('User already exists');
    }
    await this.userService.create(dto); //else create the user
  }

  async login(dto: LoginDto): Promise<AuthTokens> {
    const { email, password } = dto;
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isPasswordMatching = await comparePassword(password, user.password);

    if (!isPasswordMatching)
      throw new UnauthorizedException('Invalid credentials');
    return this.generateAuthTokens(user.id, user.email);
  }

  async refresh(refreshToken: string): Promise<AuthTokens> {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh Token not found');
    }
    try {
      const payload = this.jwtService.verify<JwtPayload>(refreshToken);
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user) {
        throw new UnauthorizedException('User no longer exists');
      }

      return this.generateAuthTokens(user.id, user.email);
    } catch (error) {
      this.logger.error('Tokens refreshing failed :', error.message);
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  private generateAuthTokens(userId: string, email: string): AuthTokens {
    const jwtPayload: JwtPayload = {
      sub: userId,
      email,
    };
    const accessToken = this.jwtService.sign(jwtPayload);
    const refreshToken = this.jwtService.sign(jwtPayload, { expiresIn: '7d' });

    return {
      accessToken,
      refreshToken,
    };
  }
}
