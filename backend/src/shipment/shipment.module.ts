import { Module } from '@nestjs/common';
import { ShipmentService } from './shipment.service';
import { ShipmentController } from './shipment.controller';
import { PrismaService } from '../database/prisma.service';

@Module({
  controllers: [ShipmentController],
  providers: [ShipmentService,PrismaService],
  exports: [ShipmentService],
})
export class ShipmentModule {}
