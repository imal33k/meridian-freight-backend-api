import { Module } from '@nestjs/common';
import { TrackingEventService } from './tracking-event.service';
import { TrackingEventController } from './tracking-event.controller';

@Module({
  controllers: [TrackingEventController],
  providers: [TrackingEventService],
})
export class TrackingEventModule {}
