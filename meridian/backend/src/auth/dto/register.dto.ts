import { IsEmail, IsNotEmpty, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail()
  @MaxLength(254)
  email!: string;

  @IsString()
  @MinLength(8)
  @MaxLength(128)
  password!: string;

  @IsString()
  @MaxLength(100)
  firstName!: string;

  @IsString()
  @MaxLength(100)
  lastName!: string;

  @IsOptional()
  @IsString()
  @MaxLength(40)
  phone?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  companyName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  country?: string;
}
