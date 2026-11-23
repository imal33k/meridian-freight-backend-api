import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { STAFF_ROLES } from '../common/roles';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { Roles } from '../auth/decorators/roles.decorators';
import { Public } from '../auth/decorators/public.decorator';
import {CurrentUser,OptionalCurrentUser,type RequestUser,} from '../auth/decorators/current-user.decorator';
@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  // Public: the "Book a call" form is open to visitors.
  @Public()
  @Post()
  create(@Body() dto: CreateBookingDto,
  @OptionalCurrentUser() user?: RequestUser,) {
    return this.bookingService.create(dto, user);
  }

  // ---------- admin ----------

  @Get('admin/all')
  @Roles(...STAFF_ROLES)
  findAllForAdmin() {
    return this.bookingService.findAllForAdmin();
  }

  @Get('admin/:id')
  @Roles(...STAFF_ROLES)
  findOne(@Param('id') id: string) {
    return this.bookingService.findOneForAdmin(id);
  }

  @Patch('admin/:id')
  @Roles(...STAFF_ROLES)
  update(@Param('id') id: string, @Body() dto: UpdateBookingDto) {
    return this.bookingService.updateForAdmin(id, dto);
  }

  @Delete('admin/:id')
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.bookingService.removeForAdmin(id);
  }
}
