import { ConflictException, Injectable } from '@nestjs/common';
import { SignUpDto } from './dto/auth.dto';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { UserService } from 'src/users/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
  ) {}
  async signup(dto: SignUpDto) {
    const existingUser = await this.userService.getUserByEmail(dto.email);
    if (!existingUser) {   //if user exists throw 
      throw new ConflictException('User already exists');
    }
    await this.userService.create(dto);   //else create the user
  }
  
  async login(dto: SignUpDto) {}
  async refresh(refreshToken: string) {}
  async logout() {}
  private generateAuthTokens() {}
}
