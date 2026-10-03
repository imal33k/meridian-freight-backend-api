import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class ResetPasswordDto {
  /** The recovery access token Supabase put in the reset-link URL. */
  @IsString()
  @IsNotEmpty()
  accessToken!: string;

  @IsString()
  @MinLength(8)
  @MaxLength(128)
  password!: string;
}
