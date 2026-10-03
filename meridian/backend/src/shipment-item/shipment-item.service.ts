import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ShipmentStatus, UserRole } from '@prisma/client';

import { PrismaService } from '../database/prisma.service';
import { CreateShipmentItemDto } from './dto/create-shipment-item.dto';
import { UpdateShipmentItemDto } from './dto/update-shipment-item.dto';
import {
  type RequestUser,
} from '../auth/decorators/current-user.decorator';
import { STAFF_ROLES } from '../common/roles';

@Injectable()
export class ShipmentItemService {
  constructor(private readonly prisma: PrismaService) {}

  private async getShipmentForAccess(
    shipmentId: string,
    user: RequestUser,
  ): Promise<{
    id: string;
    userId: string;
    status: ShipmentStatus;
  }> {
    const shipment = await this.prisma.shipment.findUnique({
      where: { id: shipmentId },
      select: {
        id: true,
        userId: true,
        status: true,
      },
    });

    if (!shipment) {
      throw new NotFoundException('Shipment not found');
    }

    if (
      !STAFF_ROLES.includes(user.role as UserRole) &&
      shipment.userId !== user.id
    ) {
      throw new ForbiddenException(
        'You do not have access to this shipment',
      );
    }

    return shipment;
  }

  private ensureItemsCanBeModified(
    shipmentStatus: ShipmentStatus,
    user: RequestUser,
  ) {
    const isStaff = STAFF_ROLES.includes(user.role as UserRole);

    if (isStaff) {
      return;
    }

    if (shipmentStatus !== ShipmentStatus.BOOKED) {
      throw new ForbiddenException(
        'Shipment items can no longer be modified after the shipment is booked',
      );
    }
  }

  async create(
    shipmentId: string,
    dto: CreateShipmentItemDto,
    user: RequestUser,
  ) {
    const shipment = await this.getShipmentForAccess(
      shipmentId,
      user,
    );

    this.ensureItemsCanBeModified(shipment.status, user);

    return this.prisma.shipmentItem.create({
      data: {
        shipmentId,
        ...dto,
      },
    });
  }

  async findAll(
    shipmentId: string,
    user: RequestUser,
  ) {
    await this.getShipmentForAccess(shipmentId, user);

    return this.prisma.shipmentItem.findMany({
      where: { shipmentId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async update(
    shipmentId: string,
    itemId: string,
    dto: UpdateShipmentItemDto,
    user: RequestUser,
  ) {
    const shipment = await this.getShipmentForAccess(
      shipmentId,
      user,
    );

    this.ensureItemsCanBeModified(shipment.status, user);

    const item = await this.prisma.shipmentItem.findFirst({
      where: {
        id: itemId,
        shipmentId,
      },
    });

    if (!item) {
      throw new NotFoundException('Shipment item not found');
    }

    return this.prisma.shipmentItem.update({
      where: {
        id: itemId,
      },
      data: dto,
    });
  }

  async remove(
    shipmentId: string,
    itemId: string,
    user: RequestUser,
  ) {
    const shipment = await this.getShipmentForAccess(
      shipmentId,
      user,
    );

    this.ensureItemsCanBeModified(shipment.status, user);

    const item = await this.prisma.shipmentItem.findFirst({
      where: {
        id: itemId,
        shipmentId,
      },
    });

    if (!item) {
      throw new NotFoundException('Shipment item not found');
    }

    await this.prisma.shipmentItem.delete({
      where: {
        id: itemId,
      },
    });

    return {
      message: 'Shipment item deleted successfully',
    };
  }
}