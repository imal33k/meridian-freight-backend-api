import { IsEmail, IsEnum, IsString, MaxLength, MinLength, IsOptional } from 'class-validator';
import { UserRole } from '@prisma/client';

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

}``