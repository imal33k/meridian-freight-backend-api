import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorators';
import { STAFF_ROLES } from '../common/roles';
import { OptionalCurrentUser, RequestUser } from '../auth/decorators/current-user.decorator';
import { Throttle } from '@nestjs/throttler';

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  // Public: the website contact form.
  @Throttle({ default: { limit: 5, ttl:60_000}})
  @Public()
  @Post()
  create(@Body() dto: CreateContactDto, @OptionalCurrentUser()user?: RequestUser) {
    return this.contactService.create(dto);
  }

  @Get('admin/all')
  @Roles(...STAFF_ROLES)
  listAll() {
    return this.contactService.listAll();
  }

  @Patch('admin/:id')
  @Roles(...STAFF_ROLES)
  updateStatus(@Param('id') id: string, @Body() dto: UpdateContactDto) {
    return this.contactService.updateStatus(id, dto);
  }
}
