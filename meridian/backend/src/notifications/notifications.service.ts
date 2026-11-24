import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { NotificationType } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import { Resend } from 'resend'
import { escapeHtml } from '../common/escape-html';

export interface NotifyInput {
  type: NotificationType;
  title: string;
  message: string;
  shipmentReference?: string;
}

@Injectable()
export class NotificationsService {private readonly resend: Resend; private readonly logger = new Logger(NotificationsService.name);
  constructor(private readonly prisma: PrismaService) {this.resend = new Resend(process.env.RESEND_API_KEY || '');}



async sendEmail(to: string, subject: string, html: string) {
  try {
    const { error } = await this.resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL!,
      to,
      subject,
      html,
    });

    if (error) {
      this.logger.error(`Email to ${to} failed: ${error.message}`);
    }
  } catch (err) {
    this.logger.error('Email send threw', err as Error);
  }
}

  async notify(userId: string, input: NotifyInput) {
    const notification = await this.prisma.notification.create({
      data: { userId, ...input },
    });
    // 2. Get the user's email
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        email: true,
        firstName: true,
        lastName: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // 3. Send email notification
    try {
      await this.sendEmail(
  user.email,
  input.title,
  `
    <h2>${escapeHtml(input.title)}</h2>

    <p>Hello ${escapeHtml(user.firstName)},</p>

    <p>${escapeHtml(input.message)}</p>

    ${
      input.shipmentReference
        ? `<p><strong>Shipment:</strong> ${escapeHtml(input.shipmentReference)}</p>`
        : ''
    }

    <p>Regards,<br />Meridian Freight</p>
  `,
);
    } catch (error) {
      console.error('Failed to send notification email:', error);
    }

    return notification;
  }

  listMine(userId: string) {
    return this.prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 100,
    });
  }
  

  async markRead(id: string, userId: string) {
    const result = await this.prisma.notification.updateMany({
      where: { id, userId },
      data: { read: true },
    });
    if (result.count === 0) {
      throw new NotFoundException('Notification not found');
    }
    return { message: 'Marked as read' };
  }

  async markAllRead(userId: string) {
    await this.prisma.notification.updateMany({
      where: { userId, read: false },
      data: { read: true },
    });
    return { message: 'All notifications marked as read' };
  }
}
