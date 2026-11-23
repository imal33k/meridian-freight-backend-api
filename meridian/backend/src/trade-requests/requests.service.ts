import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, RequestStatus } from '@prisma/client';
import { randomInt } from 'crypto';
import { PrismaService } from '../database/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateRequestDto } from './dto/create-request.dto';
import type { RequestUser } from '../auth/decorators/current-user.decorator';
import { STAFF_ROLES } from '../common/roles';
import { AdminUpdateRequestDto } from './dto/admin-update-request.dto';

const requestInclude = {
  shipment: { select: { id: true } },
} satisfies Prisma.TradeRequestInclude;

const STATUS_TEXT: Record<RequestStatus, string> = {
  PENDING: 'is pending review',
  UNDER_REVIEW: 'is now under review',
  QUOTE_PROVIDED: 'has a quote ready',
  ACCEPTED: 'has been accepted',
  BOOKED: 'has been booked',
  REJECTED: 'was rejected',
  CANCELLED: 'was cancelled',
  ON_HOLD: 'is on hold',
};

@Injectable()
export class RequestsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationsService,
  ) {}

  private async createWithUniqueReference(
    build: (reference: string) => Prisma.TradeRequestUncheckedCreateInput,
  ) {
    for (let attempt = 0; attempt < 5; attempt++) {
      const reference = `REQ-${new Date().getFullYear()}-${String(randomInt(0, 1_000_000)).padStart(6, '0')}`;
      try {
        return await this.prisma.tradeRequest.create({
          data: build(reference),
          include: requestInclude,
        });
      } catch (err) {
        const clash = err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002';
        if (!clash || attempt === 4) throw err;
      }
    }
    throw new Error('unreachable');
  }

  create(dto: CreateRequestDto, userId: string) {
    return this.createWithUniqueReference((reference) => ({
      ...dto,
      reference,
      userId,
      title: `${dto.type === 'EXPORT' ? 'Export' : 'Import'}: ${dto.goodsType}`,
    }));
  }

  listMine(userId: string) {
    return this.prisma.tradeRequest.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: requestInclude,
    });
  }

  async findMine(id: string, userId: string) {
    const request = await this.prisma.tradeRequest.findFirst({
      where: { id, userId },
      include: requestInclude,
    });
    if (!request) throw new NotFoundException('Request not found');
    return request;
  }

  /** Customers can open only their own requests; staff can open any. */
  findAccessible(id: string, user: RequestUser) {
    return STAFF_ROLES.includes(user.role)
      ? this.findOneForAdmin(id)
      : this.findMine(id, user.id);
  }

  listAll() {
    return this.prisma.tradeRequest.findMany({
      orderBy: { createdAt: 'desc' },
      include: requestInclude,
    });
  }

  async findOneForAdmin(id: string) {
    const request = await this.prisma.tradeRequest.findUnique({
      where: { id },
      include: requestInclude,
    });
    if (!request) throw new NotFoundException('Request not found');
    return request;
  }

  async updateForAdmin(id: string, dto: AdminUpdateRequestDto) {
    const current = await this.findOneForAdmin(id);

    const updated = await this.prisma.tradeRequest.update({
      where: { id },
      data: dto,
      include: requestInclude,
    });

    // Tell the customer, but only when the status actually changed.
    if (dto.status && dto.status !== current.status) {
      await this.notifications.notify(current.userId, {
        type: dto.status === 'QUOTE_PROVIDED' ? 'QUOTE_READY' : 'REQUEST_UPDATE',
        title: dto.status === 'QUOTE_PROVIDED' ? 'Your quote is ready' : 'Request update',
        message: `Your request ${current.reference} ${STATUS_TEXT[dto.status]}.`,
      });
    }

    return updated;
  }
}
