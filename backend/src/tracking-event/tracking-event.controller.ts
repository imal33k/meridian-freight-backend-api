import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TrackingEventService } from './tracking-event.service';
import { CreateTrackingEventDto } from './dto/create-tracking-event.dto';
import { UpdateTrackingEventDto } from './dto/update-tracking-event.dto';

@Controller('tracking-event')
export class TrackingEventController {
  constructor(private readonly trackingEventService: TrackingEventService) {}

  @Post()
  create(@Param ('trackingNumber') trackingNumber: string,
  @Body() createTrackingEventDto: CreateTrackingEventDto) {
    return this.trackingEventService.create(createTrackingEventDto);
  }

}
