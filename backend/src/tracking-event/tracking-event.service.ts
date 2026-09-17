import { Injectable } from '@nestjs/common';
import { CreateTrackingEventDto } from './dto/create-tracking-event.dto';
import { UpdateTrackingEventDto } from './dto/update-tracking-event.dto';

@Injectable()
export class TrackingEventService {
  create(createTrackingEventDto: CreateTrackingEventDto) {
    return 'This action adds a new trackingEvent';
  }

  findAll() {
    return `This action returns all trackingEvent`;
  }

  findOne(id: number) {
    return `This action returns a #${id} trackingEvent`;
  }

  update(id: number, updateTrackingEventDto: UpdateTrackingEventDto) {
    return `This action updates a #${id} trackingEvent`;
  }

  remove(id: number) {
    return `This action removes a #${id} trackingEvent`;
  }
}
