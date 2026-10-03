import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { SupabaseService } from '../../supabase/supabase.services';
import { UsersService } from '../../users/users.service';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class SupabaseAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly supabaseService: SupabaseService,
    private readonly usersService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest();
    const authHeader: string | undefined = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('Authentication required');
    }

    const [type, token] = authHeader.split(' ');
    if (type !== 'Bearer' || !token) {
      throw new UnauthorizedException('Invalid authorization header');
    }

    const { data, error } = await this.supabaseService
      .getClient()
      .auth.getUser(token);

    if (error || !data.user) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    try {
      const profile = await this.usersService.findBySupabaseId(data.user.id);
      request.user = { ...profile, emailVerified: !!data.user.email_confirmed_at };
    } catch (err) {
      // A valid Supabase token with no matching profile row is an auth problem, not a 404.
      if (err instanceof NotFoundException) {
        throw new UnauthorizedException('No account profile found for this user');
      }
      throw err;
    }

    return true;
  }
}
