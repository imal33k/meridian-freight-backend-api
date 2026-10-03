import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

import { ShipmentItemService } from './shipment-item.service';
import { CreateShipmentItemDto } from './dto/create-shipment-item.dto';
import {
  CurrentUser,
  type RequestUser,
} from '../auth/decorators/current-user.decorator';
import { UpdateShipmentItemDto } from './dto/update-shipment-item.dto';

@Controller('shipment')
export class ShipmentItemController {
  constructor(
    private readonly shipmentItemService: ShipmentItemService,
  ) {}

  @Post(':shipmentId/items')
  create(
    @CurrentUser() user: RequestUser,
    @Param('shipmentId') shipmentId: string,
    @Body() dto: CreateShipmentItemDto,
  ) {
    return this.shipmentItemService.create(
      shipmentId,
      dto,
      user,
    );
  }

  @Get(':shipmentId/items')
  findAll(
    @CurrentUser() user: RequestUser,
    @Param('shipmentId') shipmentId: string,
  ) {
    return this.shipmentItemService.findAll(
      shipmentId,
      user,
    );
  }

  @Patch(':shipmentId/items/:itemId')
update(
  @CurrentUser() user: RequestUser,
  @Param('shipmentId') shipmentId: string,
  @Param('itemId') itemId: string,
  @Body() dto: UpdateShipmentItemDto,
) {
  return this.shipmentItemService.update(
    shipmentId,
    itemId,
    dto as CreateShipmentItemDto,
    user,
  );
}

 @Delete(':shipmentId/items/:itemId')
 remove(
  @CurrentUser() user: RequestUser,
  @Param('shipmentId') shipmentId: string,
  @Param('itemId') itemId: string,
) {
  return this.shipmentItemService.remove(
    shipmentId,
    itemId,
    user,
  );
}
}