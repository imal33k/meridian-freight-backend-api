import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, RequestType, ShipmentStatus } from '@prisma/client';
import { randomInt } from 'crypto';
import { PrismaService } from '../database/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { UpdateShipmentDto } from './dto/update-shipment.dto';
import { AdminUpdateShipmentDto } from './dto/admin-update-shipment.dto';
import { CreateShipmentFromRequestDto } from './dto/create-shipment-from-request.dto';
import { CreateDocumentDto } from './dto/create-document.dto';
import type { RequestUser } from '../auth/decorators/current-user.decorator';
import { STAFF_ROLES } from '../common/roles';
import { ShipmentQueryDto } from './dto/shipment-query.dto';

// Everything the app needs to render a shipment: owner name, timeline and documents.
const shipmentInclude = {
  user: {
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      company: { select: { name: true } },
    },
  },
  trackingEvents: { orderBy: { timestamp: 'asc' } },
  documents: { orderBy: { uploadedAt: 'desc' } },
} satisfies Prisma.ShipmentInclude;

@Injectable()
export class ShipmentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationsService,
  ) {}

  private trackingNumberFor(type: RequestType): string {
    const prefix = type === 'EXPORT' ? 'EXP' : 'IMP';
    return `${prefix}-${new Date().getFullYear()}-${String(randomInt(0, 1_000_000)).padStart(6, '0')}`;
  }

  private isUniqueClash(err: unknown): boolean {
    return err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002';
  }

  // ---------- customer ----------

  
  async findMyShipment(userId: string, query: ShipmentQueryDto) {
    const { page, limit, status, shipmentType, search } = query;
    const where: Prisma.ShipmentWhereInput = { userId ,
    ...(status && { status }),
    ...(shipmentType && { shipmentType }),
    ...(search && {
      OR: [
        { trackingNumber: { contains: search, mode: 'insensitive' } },
        { requestReference: { contains: search, mode: 'insensitive' } },], }) };
    const [ data, total ] = await this.prisma.$transaction([
      this.prisma.shipment.findMany({
        where,
        orderBy: { updatedAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
        include: shipmentInclude,
      }),
      this.prisma.shipment.count({ where }),
    ]);
    return { data, meta:{total, page, limit ,totalPages: Math.ceil(total /limit)} };
  } 

  async findMyOne(id: string, userId: string) {
    const shipment = await this.prisma.shipment.findFirst({
      where: { id, userId },
      include: shipmentInclude,
    });
    if (!shipment) throw new NotFoundException('Shipment not found');
    return shipment;
  }

  /** Customers can open only their own shipments; staff can open any. */
  findAccessible(id: string, user: RequestUser) {
    return STAFF_ROLES.includes(user.role)
      ? this.findOneForAdmin(id)
      : this.findMyOne(id, user.id);
  }

  async update(id: string, userId: string, dto: UpdateShipmentDto) {
    const shipment = await this.findMyOne(id, userId);
    if (shipment.status !== ShipmentStatus.BOOKED) {
      throw new ForbiddenException('Only shipments that have not started moving can be edited');
    }

    const { items, ...shipmentData } = dto;

    return this.prisma.shipment.update({
      where: { id: shipment.id },
      data: {
        ...shipmentData,
        ...(items?.length
          ? {
              items: {
                deleteMany: {},
                create: items.map((item) => ({
                  description: item.description,
                  quantity: item.quantity,
                  packageType: item.packageType,
                  weight: item.weight,
                  weightUnit: item.weightUnit,
                  length: item.length,
                  width: item.width,
                  height: item.height,
                  value: item.value,
                  currency: item.currency,
                  hsCode: item.hsCode,
                })),
              },
            }
          : {}),
      },
      include: shipmentInclude,
    });
  }

  async cancel(id: string, userId: string) {
    const shipment = await this.findMyOne(id, userId);
    if (shipment.status !== ShipmentStatus.BOOKED) {
      throw new ForbiddenException('Only shipments that have not started moving can be cancelled');
    }
     const cancelledShipment = await this.prisma.$transaction(async (tx) => {
    const updated = await tx.shipment.update({
      where: { id: shipment.id },
      data: {
        status: ShipmentStatus.CANCELLED,
      },
      include: shipmentInclude,
    });

    await tx.trackingEvent.create({

      data: {
        shipmentId: shipment.id,
        title: 'Shipment cancelled',
        status: ShipmentStatus.CANCELLED,
        location: shipment.originCity ?? shipment.originCountry,
        description: 'Shipment was cancelled by the customer.',
      },
    });

    return updated;
  });

  await this.notifications.notify(userId, {
    type: 'REQUEST_UPDATE',
    title: 'Shipment cancelled',
    message: `Your shipment ${shipment.trackingNumber} has been cancelled.`,
    shipmentReference: shipment.trackingNumber,
  });

  return cancelledShipment;
}

  // ---------- admin ----------
async findAllForAdmin(query: ShipmentQueryDto) {
  const { page, limit, status, shipmentType, search } = query;

  const where: Prisma.ShipmentWhereInput = {
    ...(status && { status }),
    ...(shipmentType && { shipmentType }),
    ...(search && {
      OR: [
        {
          trackingNumber: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          requestReference: {
            contains: search,
            mode: 'insensitive',
          },
        },
      ],
    }),
  };

  const [data, total] = await this.prisma.$transaction([
    this.prisma.shipment.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      include: shipmentInclude,
    }),
    this.prisma.shipment.count({ where }),
  ]);

  return {
    data,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

  async findOneForAdmin(id: string) {
    const shipment = await this.prisma.shipment.findUnique({
      where: { id },
      include: shipmentInclude,
    });
    if (!shipment) throw new NotFoundException('Shipment not found');
    return shipment;
  }

  // Turns an accepted request into a shipment owned by the requesting customer.
  async createFromRequest(dto: CreateShipmentFromRequestDto) {
    const request = await this.prisma.tradeRequest.findUnique({
      where: { id: dto.requestId },
      include: { shipment: true },
    });
    if (!request) throw new NotFoundException('Request not found');
    if (request.shipment) throw new ConflictException('This request already has a shipment');

    const origin = request.originCity ?? request.originCountry;

    for (let attempt = 0; attempt < 5; attempt++) {
      const trackingNumber = this.trackingNumberFor(request.type);
      try {
        const shipment = await this.prisma.$transaction(async (tx) => {
          const created = await tx.shipment.create({
            data: {
              trackingNumber,
              requestReference: request.reference,
              requestId: request.id,
              userId: request.userId,
              shipmentType: request.type,
              transportMethod: request.transportMethod,
              originCountry: request.originCountry,
              originCity: request.originCity,
              destinationCountry: request.destinationCountry,
              destinationCity: request.destinationCity,
              description: request.cargoDescription,
              goodsType: request.goodsType ?? 'General cargo',
              weight: request.weightKg,
              weightUnit: 'kg',
              estimatedDelivery: dto.estimatedDelivery ? new Date(dto.estimatedDelivery) : undefined,
            },
          });
          await tx.trackingEvent.create({
            data: {
              shipmentId: created.id,
              title: 'Booking confirmed',
              status: 'BOOKED',
              location: origin,
              description: 'Shipment created from accepted request.',
            },
          });
          await tx.tradeRequest.update({ where: { id: request.id }, data: { status: 'BOOKED' } });
          return created;
        });

        await this.notifications.notify(request.userId, {
          type: 'REQUEST_UPDATE',
          title: 'Your shipment is booked',
          message: `Request ${request.reference} is now shipment ${shipment.trackingNumber}.`,
          shipmentReference: shipment.trackingNumber,
        });

        return this.findOneForAdmin(shipment.id);
      } catch (err) {
        if (!this.isUniqueClash(err) || attempt === 4) throw err;
      }
    }
    throw new Error('unreachable');
  }

  async updateForAdmin(id: string, dto: AdminUpdateShipmentDto) {
    await this.findOneForAdmin(id);
    const { estimatedDelivery, actualDelivery, items, ...rest } = dto;
    return this.prisma.shipment.update({
      where: { id },
      data: {
        ...rest,
        ...(estimatedDelivery && { estimatedDelivery: new Date(estimatedDelivery) }),
        ...(actualDelivery && { actualDelivery: new Date(actualDelivery) }),
      },
      include: shipmentInclude,
    });
  }

  async addDocument(shipmentId: string, dto: CreateDocumentDto) {
    await this.findOneForAdmin(shipmentId);
    return this.prisma.shipmentDocument.create({ data: { ...dto, shipmentId } });
  }

  async removeForAdmin(id: string) {
    await this.findOneForAdmin(id);
    await this.prisma.shipment.delete({ where: { id } });
    return { message: 'Shipment deleted successfully' };
  }
}
