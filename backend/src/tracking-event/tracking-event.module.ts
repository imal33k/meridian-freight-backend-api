import { Module } from '@nestjs/common';
import { TrackingEventService } from './tracking-event.service';
import { TrackingEventController } from './tracking-event.controller';
import { PrismaService } from '../database/prisma.service';

@Module({
  controllers: [TrackingEventController],
  providers: [TrackingEventService, PrismaService],
  exports: [ TrackingEventService],
})
export class TrackingEventModule {}
