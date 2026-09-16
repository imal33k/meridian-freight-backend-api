import { Controller, Get, Req,UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { SupabaseAuthGuard} from '../auth/guards/supabase-auth.guard'
@Controller('users')
export class UsersController {
constructor(private readonly usersService: UsersService){}

  @Get('me')
  @UseGuards(SupabaseAuthGuard)
  getMe(@Req() req: any) {
    return req.user;
  }
}