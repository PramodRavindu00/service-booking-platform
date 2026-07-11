import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { SignUpDto } from 'src/auth/dto/auth.dto';

export class CreateUserDto extends SignUpDto {}

export class UserResponseDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  @Expose()
  id: string;

  @ApiProperty({ example: 'user@example.com' })
  @Expose()
  email: string;

  @ApiProperty()
  @Expose()
  createdAt: Date;

  @ApiProperty()
  @Expose()
  updatedAt: Date;
}
