import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';

@Injectable()
export class ContactService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationsService,
  ) {}

  async create(dto: CreateContactDto) {
    const contact = await this.prisma.contactMessages.create({
      data: dto,
    });

    await this.notifications.sendEmail(
      contact.email,
      'We received your message',
      `
        <h2>Message Received</h2>

        <p>Hello ${contact.name},</p>

        <p>
          Thank you for contacting Meridian Freight.
          We have received your message and our team will review it.
        </p>

        <p>
          <strong>Subject:</strong> ${contact.subject}
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

    <p><strong>Name:</strong> ${contact.name}</p>
    <p><strong>Email:</strong> ${contact.email}</p>
    <p><strong>Phone:</strong> ${contact.phone ?? 'Not provided'}</p>
    <p><strong>Company:</strong> ${contact.company ?? 'Not provided'}</p>
    <p><strong>Subject:</strong> ${contact.subject}</p>

    <p><strong>Message:</strong></p>
    <p>${contact.message}</p>

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