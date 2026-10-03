import { Module } from '@nestjs/common';
import { ShipmentItemService } from './shipment-item.service';
import { ShipmentItemController } from './shipment-item.controller';

@Module({
  controllers: [ShipmentItemController],
  providers: [ShipmentItemService],
})
export class ShipmentItemModule {}
