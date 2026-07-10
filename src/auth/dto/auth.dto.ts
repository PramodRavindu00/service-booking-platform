import { IsEmail, IsNotEmpty, IsString, Min } from 'class-validator';

export class AuthBaseDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}

export class SignUpDto extends AuthBaseDto {
  @IsString()
  @IsNotEmpty()
  @Min(8)
  password: string;
}
export class LoginUpDto extends AuthBaseDto {
  @IsString()
  @IsNotEmpty()
  password: string;
}
