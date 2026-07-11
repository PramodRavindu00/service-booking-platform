import { Expose } from 'class-transformer';
import { SignUpDto } from 'src/auth/dto/auth.dto';

export class CreateUserDto extends SignUpDto {}

export class UserResponseDto {
    @Expose()
    id: string;
    @Expose()
    email: string;
    @Expose()
    createdAt: Date;
    @Expose()
    updatedAt: Date;
}
