import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class AuthBaseDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class SignUpDto extends AuthBaseDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}

export class LoginDto extends AuthBaseDto {
  @IsString()
  @IsNotEmpty()
  password: string;
}
