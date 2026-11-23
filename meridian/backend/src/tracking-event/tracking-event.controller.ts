import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { STAFF_ROLES } from '../common/roles';
import { TrackingEventService } from './tracking-event.service';
import { CreateTrackingEventDto } from './dto/create-tracking-event.dto';
import { Roles } from '../auth/decorators/roles.decorators';
import { Public } from '../auth/decorators/public.decorator';
import { Throttle } from '@nestjs/throttler';

@Controller('tracking-event')
export class TrackingEventController {
  constructor(private readonly trackingEventService: TrackingEventService) {}

  @Post(':trackingNumber/events')
  @Roles(...STAFF_ROLES)
  create(
    @Param('trackingNumber') trackingNumber: string,
    @Body() dto: CreateTrackingEventDto,
  ) {
    return this.trackingEventService.createTrackingEvent(trackingNumber, dto);
  }

  // Public: powers the "Track a shipment" page.
  @Throttle({ default: { limit: 5, ttl:60_000}})
  @Public()
  @Get(':trackingNumber')
  getTracking(@Param('trackingNumber') trackingNumber: string) {
    return this.trackingEventService.getTracking(trackingNumber);
  }
}
