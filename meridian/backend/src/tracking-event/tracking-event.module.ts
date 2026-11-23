import { Module } from '@nestjs/common';
import { NotificationsModule } from '../notifications/notifications.module';
import { TrackingEventService } from './tracking-event.service';
import { TrackingEventController } from './tracking-event.controller';

@Module({
  imports: [NotificationsModule],
  controllers: [TrackingEventController],
  providers: [TrackingEventService],
  exports: [TrackingEventService],
})
export class TrackingEventModule {}
