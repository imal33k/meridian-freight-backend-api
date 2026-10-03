import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { CustomersController } from './customers.controller';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController, CustomersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
