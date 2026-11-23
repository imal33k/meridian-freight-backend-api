import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { RequestsService } from './requests.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { AdminUpdateRequestDto } from './dto/admin-update-request.dto';
import { CurrentUser, type RequestUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorators';
import { STAFF_ROLES } from '../common/roles';

@Controller('requests')
export class RequestsController {
  constructor(private readonly requestsService: RequestsService) {}

  // ---------- admin (before ':id') ----------

  @Get('admin/all')
  @Roles(...STAFF_ROLES)
  listAll() {
    return this.requestsService.listAll();
  }

  @Get('admin/:id')
  @Roles(...STAFF_ROLES)
  findOneForAdmin(@Param('id') id: string) {
    return this.requestsService.findOneForAdmin(id);
  }

  @Patch('admin/:id')
  @Roles(...STAFF_ROLES)
  updateForAdmin(@Param('id') id: string, @Body() dto: AdminUpdateRequestDto) {
    return this.requestsService.updateForAdmin(id, dto);
  }

  // ---------- customer ----------

  @Post()
  create(@CurrentUser() user: RequestUser, @Body() dto: CreateRequestDto) {
    return this.requestsService.create(dto, user.id);
  }

  @Get('me')
  listMine(@CurrentUser() user: RequestUser) {
    return this.requestsService.listMine(user.id);
  }

  @Get(':id')
  findOne(@CurrentUser() user: RequestUser, @Param('id') id: string) {
    return this.requestsService.findAccessible(id, user);
  }
}
