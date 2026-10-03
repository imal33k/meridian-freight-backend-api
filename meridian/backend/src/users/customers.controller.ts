import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { Roles } from '../auth/decorators/roles.decorators';
import { STAFF_ROLES } from '../common/roles';

@Controller('customers')
@Roles(...STAFF_ROLES)
export class CustomersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  list() {
    return this.usersService.listCustomers();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findCustomer(id);
  }
}
