import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TrackingEventService } from './tracking-event.service';
import { CreateTrackingEventDto } from './dto/create-tracking-event.dto';
import { UpdateTrackingEventDto } from './dto/update-tracking-event.dto';
import { Roles } from '../auth/decorators/roles.decorators';
import { UserRole } from '@prisma/client';
import { RolesGuard } from '../auth/guards/roles.guards.decorators';



@Controller('tracking-event')
export class TrackingEventController {
  constructor(private readonly trackingEventService: TrackingEventService) {}

  @Post(':trackingNumber/events')
  @Roles(UserRole.ADMIN, UserRole.STAFF)
  create(@Param ('trackingNumber') trackingNumber: string,
  @Body() dto: CreateTrackingEventDto) {
    return this.trackingEventService.createTrackingEvent(trackingNumber,dto);
  };

  @Get(':trackingNumber')
  getTracking(
    @Param('trackingNumber') trackingNumber:string,
  ){
    return this.trackingEventService.getTracking(trackingNumber);
  }

}
