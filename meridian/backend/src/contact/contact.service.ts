import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { RequestUser } from '../auth/decorators/current-user.decorator';
import { escapeHtml } from '../common/escape-html';

@Injectable()
export class ContactService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationsService,
  ) {}

  async create(dto: CreateContactDto, user?: RequestUser) {
    const contact = await this.prisma.contactMessages.create({
      data:{...dto, userId: user?.id}
    });

    await this.notifications.sendEmail(
      contact.email,
      'We received your message',
      `
        <h2>Message Received</h2>

        <p>Hello ${escapeHtml(contact.name)},</p>

        <p>
          Thank you for contacting Meridian Freight.
          We have received your message and our team will review it.
        </p>

        <p>
          <strong>Subject:</strong> ${escapeHtml(contact.subject)}
        </p>

        <p>
          We will get back to you as soon as possible.
        </p>

        <p>Regards,<br />Meridian Freight</p>
      `,
    );
    await this.notifications.sendEmail(
  process.env.ADMIN_NOTIFICATION_EMAIL!,
  'New contact message',
  `
    <h2>New Contact Message</h2>

    <p>A new contact message has been submitted.</p>

    <p><strong>Name:</strong> ${escapeHtml(contact.name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(contact.email)}</p>
    <p><strong>Phone:</strong> ${escapeHtml(contact.phone ?? 'Not provided')}</p>
    <p><strong>Company:</strong> ${escapeHtml(contact.company ?? 'Not provided')}</p>
    <p><strong>Subject:</strong> ${escapeHtml(contact.subject)}</p>

    <p><strong>Message:</strong></p>
    <p>${escapeHtml(contact.message)}</p>

    <p>Please log in to the admin dashboard to review this message.</p>

    <p>Meridian Freight</p>
  `,
);

    return contact;
  }

  listAll() {
    return this.prisma.contactMessages.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateStatus(id: string, dto: UpdateContactDto) {
    const existing = await this.prisma.contactMessages.findUnique({
      where: { id },
    });

    if (!existing) {
      throw new NotFoundException('Message not found');
    }

    return this.prisma.contactMessages.update({
      where: { id },
      data: {
        status: dto.status,
      },
    });
  }
}