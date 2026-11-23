import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { STAFF_ROLES } from '../common/roles';
import { TrackingEventService } from './tracking-event.service';
import { CreateTrackingEventDto } from './dto/create-tracking-event.dto';
import { Roles } from '../auth/decorators/roles.decorators';
import { Public } from '../auth/decorators/public.decorator';

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
  @Public()
  @Get(':trackingNumber')
  getTracking(@Param('trackingNumber') trackingNumber: string) {
    return this.trackingEventService.getTracking(trackingNumber);
  }
}
