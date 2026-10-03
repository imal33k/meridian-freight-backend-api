import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { SupabaseService } from '../supabase/supabase.services';
import { UsersService } from '../users/users.service';

import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    const { data, error } = await this.supabaseService.getClient().auth.signUp({
      email: dto.email,
      password: dto.password,
      options: {
        data: { firstName: dto.firstName, lastName: dto.lastName },
      },
    });

    if (error) {
      throw new BadRequestException(error.message);
    }
    if (!data.user) {
      throw new BadRequestException('User registration failed');
    }

    // NOTE: if this insert fails, the Supabase auth user already exists. Cleaning it up
    // needs the service-role key (auth.admin.deleteUser), which this app doesn't use yet.
    const user = await this.usersService.createUser({
      supabaseId: data.user.id,
      email: dto.email,
      firstName: dto.firstName,
      lastName: dto.lastName,
      phone: dto.phone,
      companyName: dto.companyName,
      country: dto.country,
    });

    return {
      message: 'Registration successful',
      user: { ...user, emailVerified: !!data.user.email_confirmed_at },
      session: data.session,
    };
  }

  async login(dto: LoginDto) {
    const { data, error } = await this.supabaseService
      .getClient()
      .auth.signInWithPassword({ email: dto.email, password: dto.password });

    if (error || !data.user || !data.session) {
      throw new UnauthorizedException('Invalid email or password');
    }

    // Return the application user (role, name, company) - not the raw Supabase user.
    const user = await this.usersService.findBySupabaseId(data.user.id);

    return {
      message: 'Login successful',
      user: { ...user, emailVerified: !!data.user.email_confirmed_at },
      session: data.session,
    };
  }

  /** Exchanges a refresh token for a fresh session (Supabase rotates the refresh token). */
  async refresh(refreshToken: string) {
    const { data, error } = await this.supabaseService
      .getClient()
      .auth.refreshSession({ refresh_token: refreshToken });

    if (error || !data.session) {
      throw new UnauthorizedException('Session expired. Please log in again.');
    }
    return { session: data.session };
  }

  /** Revokes the caller's session so its refresh token can't be used again. */
  async logout(accessToken: string) {
    const url = this.configService.get<string>('SUPABASE_URL');
    const key = this.configService.get<string>('SUPABASE_ANON_KEY');

    // Best effort: the user is logged out client-side regardless.
    await fetch(`${url}/auth/v1/logout?scope=local`, {
      method: 'POST',
      headers: { apikey: key ?? '', Authorization: `Bearer ${accessToken}` },
    }).catch(() => undefined);

    return { message: 'Logged out' };
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const frontendUrl =
      this.configService.get<string>('FRONTEND_URL') ?? 'http://localhost:5173';

    const { error } = await this.supabaseService
      .getClient()
      .auth.resetPasswordForEmail(dto.email, {
        redirectTo: `${frontendUrl}/reset-password`,
      });

    if (error) {
      throw new BadRequestException(error.message);
    }

    // Same response whether or not the email exists.
    return {
      message: 'If an account exists for that email, a reset link has been sent.',
    };
  }

  /** Sets a new password using the recovery token from the emailed reset link. */
  async resetPassword(dto: ResetPasswordDto) {
    const url = this.configService.get<string>('SUPABASE_URL');
    const key = this.configService.get<string>('SUPABASE_ANON_KEY');

    const { data, error } = await this.supabaseService
      .getClient()
      .auth.getUser(dto.accessToken);
    if (error || !data.user) {
      throw new BadRequestException('This reset link is invalid or has expired.');
    }

    const response = await fetch(`${url}/auth/v1/user`, {
      method: 'PUT',
      headers: {
        apikey: key ?? '',
        Authorization: `Bearer ${dto.accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password: dto.password }),
    });

    if (!response.ok) {
      const body = (await response.json().catch(() => null)) as
        | { msg?: string; message?: string }
        | null;
      throw new BadRequestException(
        body?.msg ?? body?.message ?? 'Could not update the password.',
      );
    }

    return { message: 'Password updated. You can now log in.' };
  }
}
