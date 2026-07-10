import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma/prisma.service';
import { CreateUserDto, UserResponseDto } from './dto/user.dto';
import { plainToInstance } from 'class-transformer';
import { passwordHash } from 'src/common/utils/bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateUserDto) {
    const { email, password } = dto;
    const hashedPassword = await passwordHash(password); // hash the password
    await this.prisma.user.create({
      data: { email, password: hashedPassword },
    });
  }

  async getUserById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      omit: { password: true },
    });
    return plainToInstance(UserResponseDto, user);
  }

  async getUserByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      omit: { password: true },
    });
    return plainToInstance(UserResponseDto, user);
  }
}
