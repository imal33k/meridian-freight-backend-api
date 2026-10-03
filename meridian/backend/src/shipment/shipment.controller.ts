import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { ShipmentService } from './shipment.service';
import { UpdateShipmentDto } from './dto/update-shipment.dto';
import { AdminUpdateShipmentDto } from './dto/admin-update-shipment.dto';
import { CreateShipmentFromRequestDto } from './dto/create-shipment-from-request.dto';
import { CreateDocumentDto } from './dto/create-document.dto';
import { CurrentUser, type RequestUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorators';
import { STAFF_ROLES } from '../common/roles';
import { ShipmentQueryDto } from './dto/shipment-query.dto';

@Controller('shipment')
export class ShipmentController {
  constructor(private readonly shipmentService: ShipmentService) {}

  // ---------- admin (declared first so 'admin/...' never matches ':id') ----------

  @Get('admin/all')
  @Roles(...STAFF_ROLES)
  findAllForAdmin(@Query() query: ShipmentQueryDto) {
    return this.shipmentService.findAllForAdmin(query);
  }

  @Post('admin/from-request')
  @Roles(...STAFF_ROLES)
  createFromRequest(@Body() dto: CreateShipmentFromRequestDto) {
    return this.shipmentService.createFromRequest(dto);
  }

  @Get('admin/:id')
  @Roles(...STAFF_ROLES)
  findOneForAdmin(@Param('id') id: string) {
    return this.shipmentService.findOneForAdmin(id);
  }

  @Patch('admin/:id')
  @Roles(...STAFF_ROLES)
  updateForAdmin(@Param('id') id: string, @Body() dto: AdminUpdateShipmentDto) {
    return this.shipmentService.updateForAdmin(id, dto);
  }

  @Post('admin/:id/documents')
  @Roles(...STAFF_ROLES)
  addDocument(@Param('id') id: string, @Body() dto: CreateDocumentDto) {
    return this.shipmentService.addDocument(id, dto);
  }

  @Delete('admin/:id')
  @Roles(UserRole.ADMIN)
  removeForAdmin(@Param('id') id: string) {
    return this.shipmentService.removeForAdmin(id);
  }

  // ---------- customer ----------

  @Get('me')
  findMyShipment(@CurrentUser() user: RequestUser, @Query() query: ShipmentQueryDto) {
    return this.shipmentService.findMyShipment(user.id, query);
  }

  @Get(':id')
  findOne(@CurrentUser() user: RequestUser, @Param('id') id: string) {
    return this.shipmentService.findAccessible(id, user);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: RequestUser,
    @Param('id') id: string,
    @Body() dto: UpdateShipmentDto,
  ) {
    return this.shipmentService.update(id, user.id, dto);
  }

  @Patch(':id/cancel')
  cancel(@CurrentUser() user: RequestUser, @Param('id') id: string) {
    return this.shipmentService.cancel(id, user.id);
  }
}
