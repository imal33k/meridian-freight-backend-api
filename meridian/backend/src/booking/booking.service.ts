import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { RequestUser } from '../auth/decorators/current-user.decorator';
import { NotificationsService } from '../notifications/notifications.service';


@Injectable()
export class BookingService {
  constructor(private readonly prisma: PrismaService, private readonly notificationsService: NotificationsService) {}

  async create(dto: CreateBookingDto, user?: RequestUser) {
  const booking = await this.prisma.booking.create({
    data: {
      ...dto,
      preferredDate: new Date(dto.preferredDate),
      userId: user?.id,
    },
  });

  // Email the customer
  await this.notificationsService.sendEmail(
    booking.email,
    'Booking request received',
    `
      <h2>Booking Request Received</h2>

      <p>Hello ${booking.name},</p>

      <p>
        We have received your request to book a call with Meridian Freight.
      </p>

      <p>
        <strong>Type:</strong> ${booking.type}
      </p>

      <p>
        <strong>Preferred date:</strong>
        ${booking.preferredDate.toLocaleDateString()}
      </p>

      <p>
        <strong>Preferred time:</strong>
        ${booking.preferredTime}
      </p>

      <p>
        Your booking is currently <strong>PENDING</strong>.
        Our team will review your request and contact you.
      </p>

      <p>Regards,<br />Meridian Freight</p>
    `,
  );

  // Notify Meridian admin
  await this.notificationsService.sendEmail(
    process.env.ADMIN_NOTIFICATION_EMAIL!,
    'New booking request',
    `
      <h2>New Booking Request</h2>

      <p>A new booking request has been submitted.</p>

      <p><strong>Name:</strong> ${booking.name}</p>
      <p><strong>Email:</strong> ${booking.email}</p>
      <p><strong>Phone:</strong> ${booking.phone ?? 'Not provided'}</p>
      <p><strong>Company:</strong> ${booking.companyName ?? 'Not provided'}</p>
      <p><strong>Type:</strong> ${booking.type}</p>

      <p>
        <strong>Preferred date:</strong>
        ${booking.preferredDate.toLocaleDateString()}
      </p>

      <p>
        <strong>Preferred time:</strong>
        ${booking.preferredTime}
      </p>

      <p>
        <strong>Message:</strong>
        ${booking.message ?? 'No message provided'}
      </p>

      <p>Please log in to the admin dashboard to review this booking.</p>

      <p>Meridian Freight</p>
    `,
  );

  return booking;
}

  findAllForAdmin() {
    return this.prisma.booking.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async findOneForAdmin(id: string) {
    const booking = await this.prisma.booking.findUnique({ where: { id } });
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }
    return booking;
  }

  async updateForAdmin(id: string, dto: UpdateBookingDto) {
  const existing = await this.findOneForAdmin(id);

  const { preferredDate, status, ...rest } = dto;

  const booking = await this.prisma.booking.update({
    where: { id },
    data: {
      ...rest,
      ...(preferredDate && {
        preferredDate: new Date(preferredDate),
      }),
      ...(status && { status }),
    },
  });

  if (status && status !== existing.status) {
    const statusMessages: Record<string, string> = {
      CONFIRMED:
        'Your booking has been confirmed. Our team will contact you with the next steps.',
      CANCELLED:
        'Your booking has been cancelled. Please contact us if you need further assistance.',
      COMPLETED:
        'Your booking has been marked as completed. Thank you for choosing Meridian Freight.',
      PENDING:
        'Your booking is currently pending review by our team.',
    };

    const message =
      statusMessages[status] ??
      `Your booking status has been updated to ${status}.`;

    await this.notificationsService.sendEmail(
      booking.email,
      `Booking ${status.toLowerCase()}`,
      `
        <h2>Booking Status Update</h2>

        <p>Hello ${booking.name},</p>

        <p>${message}</p>

        <p>
          <strong>Booking type:</strong> ${booking.type}
        </p>

        <p>
          <strong>Preferred date:</strong>
          ${booking.preferredDate.toLocaleDateString()}
        </p>

        <p>
          <strong>Preferred time:</strong>
          ${booking.preferredTime}
        </p>

        <p>
          <strong>Status:</strong> ${booking.status}
        </p>

        <p>Regards,<br />Meridian Freight</p>
      `,
    );
  }

  return booking;
}

  async removeForAdmin(id: string) {
    await this.findOneForAdmin(id);
    await this.prisma.booking.delete({ where: { id } });
    return { message: 'Booking deleted successfully' };
  }
}
