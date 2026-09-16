import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SupabaseService } from '../../supabase/supabase.services';
import { UsersService } from '../../users/users.service';

@Injectable()
export class SupabaseAuthGuard implements CanActivate {
  constructor(
    private readonly supabaseService: SupabaseService,
    private readonly usersService: UsersService,
  ) {}

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('Authentication required');
    }

    const [type, token] = authHeader.split(' ');

    if (type !== 'Bearer' || !token) {
      throw new UnauthorizedException(
        'Invalid authorization header',
      );
    }

    const { data, error } =
      await this.supabaseService
        .getClient()
        .auth.getUser(token);

    if (error || !data.user) {
      throw new UnauthorizedException(
        'Invalid or expired token',
      );
    }

    const user = await this.usersService.findBySupabaseId(
      data.user.id,
    );

    request.user = user;

    return true;
  }
}