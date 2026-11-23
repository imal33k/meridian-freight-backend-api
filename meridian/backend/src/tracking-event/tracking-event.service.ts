import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { NotificationType, ShipmentStatus } from '@prisma/client';
import { CreateTrackingEventDto } from './dto/create-tracking-event.dto';
import { PrismaService } from '../database/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';


const ALLOWED_STATUS_TRANSITIONS: Record<ShipmentStatus, ShipmentStatus[]> = {
  BOOKED: [ShipmentStatus.SHIPMENT_CREATED, ShipmentStatus.CANCELLED],

  SHIPMENT_CREATED: [
    ShipmentStatus.IN_TRANSIT,
    ShipmentStatus.ON_HOLD,
  ],

  IN_TRANSIT: [
    ShipmentStatus.CUSTOMS,
    ShipmentStatus.OUT_FOR_DELIVERY,
    ShipmentStatus.ON_HOLD,
  ],

  CUSTOMS: [
    ShipmentStatus.OUT_FOR_DELIVERY,
    ShipmentStatus.ON_HOLD,
  ],

  OUT_FOR_DELIVERY: [
    ShipmentStatus.DELIVERED,
    ShipmentStatus.ON_HOLD,
  ],

  ON_HOLD: [],

  DELIVERED: [],

  CANCELLED: [],
};
const NOTIFICATION_FOR_STATUS: Partial<Record<ShipmentStatus, NotificationType>> = {
  SHIPMENT_CREATED: 'SHIPMENT_PICKED_UP',
  IN_TRANSIT: 'SHIPMENT_DEPARTED',
  CUSTOMS: 'CUSTOMS_CLEARANCE',
  OUT_FOR_DELIVERY: 'SHIPMENT_ARRIVED',
  DELIVERED: 'SHIPMENT_DELIVERED',
};

@Injectable()
export class TrackingEventService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationsService,
  ) {}


  private validateStatusTransition(
  currentStatus: ShipmentStatus,
  nextStatus: ShipmentStatus,
) {
  if (currentStatus === nextStatus) {
    return;
  }

  const allowedTransitions = ALLOWED_STATUS_TRANSITIONS[currentStatus];

  if (!allowedTransitions.includes(nextStatus)) {
    throw new ForbiddenException(
      `Invalid shipment status transition: ${currentStatus} → ${nextStatus}`,
    );
  }
}
  async createTrackingEvent(trackingNumber: string, dto: CreateTrackingEventDto) {
    const shipment = await this.prisma.shipment.findUnique({
      where: { trackingNumber },
      include: { trackingEvents: { orderBy: { timestamp: 'desc' }, take: 1 } },
    });
    if (!shipment) {
      throw new NotFoundException('Shipment not found');
    }

    const location =
      dto.location ??
      shipment.trackingEvents[0]?.location ??
      shipment.originCity ??
      shipment.originCountry;

    const statusChanged = !!dto.status && dto.status !== shipment.status;

    if (dto.status) {
  this.validateStatusTransition(shipment.status, dto.status);
}
    const event = await this.prisma.$transaction(async (tx) => {
      const created = await tx.trackingEvent.create({
        data: {
          title: dto.title,
          status: dto.status,
          location,
          description: dto.description,
          shipmentId: shipment.id,
        },
      });

      if (dto.status) {
        await tx.shipment.update({
          where: { id: shipment.id },
          data: {
            status: dto.status,
            ...(dto.status === 'DELIVERED' && { actualDelivery: new Date() }),
          },
        });
      }
      return created;
    });

    // Let the customer know. Plain timeline notes also notify, but as a generic update.
    await this.notifications.notify(shipment.userId, {
      type: (statusChanged && dto.status && NOTIFICATION_FOR_STATUS[dto.status]) || 'SYSTEM',
      title: dto.title,
      message: `Shipment ${shipment.trackingNumber}: ${dto.description ?? dto.title} (${location}).`,
      shipmentReference: shipment.trackingNumber,
    });

    return event;
  }

  // Public endpoint: only return what a person with a tracking number should see
  // (no user id, no internal ids, no request reference).
  async getTracking(trackingNumber: string) {
    const shipment = await this.prisma.shipment.findUnique({
      where: { trackingNumber },
      select: {
        trackingNumber: true,
        status: true,
        shipmentType: true,
        transportMethod: true,
        originCountry: true,
        originCity: true,
        destinationCountry: true,
        destinationCity: true,
        estimatedDelivery: true,
        actualDelivery: true,
        updatedAt: true,
        trackingEvents: {
          orderBy: { timestamp: 'asc' },
          select: { title: true, status: true, location: true, description: true, timestamp: true },
        },
      },
    });

    if (!shipment) {
      throw new NotFoundException('Shipment not found');
    }
    return shipment;
  }
}
