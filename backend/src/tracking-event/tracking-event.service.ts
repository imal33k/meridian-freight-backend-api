import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTrackingEventDto } from './dto/create-tracking-event.dto';
import { UpdateTrackingEventDto } from './dto/update-tracking-event.dto';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class TrackingEventService {
constructor( private readonly prisma: PrismaService){}

  async createTrackingEvent(
  trackingNumber: string,
  dto: CreateTrackingEventDto,
) {
  const shipment = await this.prisma.shipment.findUnique({
    where: {
      trackingNumber,
    },
  });

  if (!shipment) {
    throw new NotFoundException('Shipment not found');
  }

  return this.prisma.$transaction(async (tx) => {
    const trackingEvent = await tx.trackingEvent.create({
      data: {
        status: dto.status,
        location: dto.location,
        description: dto.description,
        shipmentId: shipment.id,
      },
    });

    await tx.shipment.update({
      where: {
        id: shipment.id,
      },
      data: {
        status: dto.status,
      },
    });

    return trackingEvent;
  });
}

  async getTracking (trackingNumber :string){
    const shipment  =await this.prisma.shipment.findUnique({
      where: {
        trackingNumber},
        include : {
          trackingEvents: {
            orderBy: {
              createdAt: 'asc'}
          },
        },
    });
    if (!shipment){
      throw new NotFoundException ( ' shipment not found');
    }
    return shipment;
  }
}