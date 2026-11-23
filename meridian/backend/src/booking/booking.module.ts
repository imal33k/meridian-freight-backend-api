import { Module } from '@nestjs/common';

import { BookingService } from './booking.service';
import { BookingController } from './booking.controller';
import { NotificationsModule } from '../notifications/notifications.module';

@Module({
  imports: [NotificationsModule],
  controllers: [BookingController],
  providers: [BookingService],
  exports: [BookingService],
})
export class BookingModule {}