import { Controller, Get } from '@nestjs/common';
import { CurrentUser, type RequestUser } from '../auth/decorators/current-user.decorator';

@Controller('users')
export class UsersController {
  @Get('me')
  getMe(@CurrentUser() user: RequestUser) {
    return user;
  }
}
