import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { SupabaseModule } from './supabase/supabase.module';
import { PrismaModule } from './database/prisma.module';
import { ShipmentModule } from './shipment/shipment.module';
import { TrackingEventModule } from './tracking-event/tracking-event.module';
import { BookingModule } from './booking/booking.module';
import { CompanyModule } from './company/company.module';
import { NotificationsModule } from './notifications/notifications.module';
import { RequestsModule } from './trade-requests/requests.module';
import { ContactModule } from './contact/contact.module';
import { ShipmentItemModule } from './shipment-item/shipment-item.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    PrismaModule,
    SupabaseModule,
    AuthModule,
    UsersModule,
    CompanyModule,
    ShipmentModule,
    TrackingEventModule,
    BookingModule,
    RequestsModule,
    NotificationsModule,
    ContactModule,
    ShipmentItemModule,
  ],
})
export class AppModule {}
