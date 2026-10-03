import { Body, Controller, Get, Headers, Post } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { RefreshDto } from './dto/refresh.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { Roles } from './decorators/roles.decorators';
import { Public } from './decorators/public.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Public()
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  // Public because the access token is, by definition, already expired when this is called.
  @Public()
  @Post('refresh')
  refresh(@Body() dto: RefreshDto) {
    return this.authService.refresh(dto.refreshToken);
  }

  // Authenticated: the guard has already validated the bearer token.
  @Post('logout')
  logout(@Headers('authorization') authorization: string) {
    return this.authService.logout(authorization.replace(/^Bearer\s+/i, ''));
  }

  @Public()
  @Post('forgot-password')
  forgotPassword(@Body() dto: ForgotPasswordDto) {
    return this.authService.forgotPassword(dto);
  }

  @Public()
  @Post('reset-password')
  resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }

  @Get('admin')
  @Roles(UserRole.ADMIN)
  admin() {
    return { message: 'Admin access granted' };
  }
}
