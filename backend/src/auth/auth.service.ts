import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';

import { SupabaseService } from '../supabase/supabase.services';
import { UsersService } from '../users/users.service';

import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly usersService: UsersService,
  ) {}

  async register(dto: RegisterDto) {
    // 1. Create account in Supabase Auth
    const { data, error } =
      await this.supabaseService
        .getClient()
        .auth.signUp({
          email: dto.email,
          password: dto.password,
          options: {
            data: {
              firstName: dto.firstName,
              lastName: dto.lastName,
            },
          },
        });

    // 2. Check if Supabase returned an error
    if (error) {
      throw new BadRequestException(error.message);
    }

    // 3. Make sure Supabase actually returned a user
    if (!data.user) {
      throw new BadRequestException(
        'User registration failed',
      );
    }

    // 4. Create the user in YOUR Prisma database
    const user = await this.usersService.createUser({
      supabaseId: data.user.id,
      email: dto.email,
      firstName: dto.firstName,
      lastName: dto.lastName,
    });

    // 5. Return the result
    return {
      message: 'Registration successful',
      user,
      session: data.session,
    };
  }

  async login(dto: LoginDto) {
    const { data, error } =
      await this.supabaseService
        .getClient()
        .auth.signInWithPassword({
          email: dto.email,
          password: dto.password,
        });

    if (error) {
      throw new BadRequestException(error.message);
    }

    return {
      message: 'Login successful',
      user: data.user,
      session: data.session,
    };
  }

  async forgotPassword(dto: ForgotPasswordDto){
    const { data, error } =
    await this.supabaseService
    .getClient()
    .auth.resetPasswordForEmail(
       dto.email,
      {
        redirectTo: 'http://localhost:3000/reset-password',
    });
if (error) {
  throw new BadRequestException(error.message);

}
return {
  message: 'http://localhost:3000/reset-password',
}
  };
}