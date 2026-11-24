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
import { ThrottlerGuard, ThrottlerModule} from '@nestjs/throttler';
import { APP_GUARD }from '@nestjs/core';
import { SupabaseAuthGuard } from './auth/guards/supabase-auth.guard';
import { RolesGuard } from './auth/guards/roles.guards.decorators';

@Module({
  imports: [
    ConfigModule.forRoot({
  isGlobal: true,
  envFilePath: '.env',
  validate: (env: Record<string, unknown>) => {
    const required = [
      'DATABASE_URL',
      'SUPABASE_URL',
      'SUPABASE_SERVICE_ROLE_KEY',
      'SUPABASE_ANON_KEY',
      'RESEND_API_KEY',
      'RESEND_FROM_EMAIL',
      'ADMIN_NOTIFICATION_EMAIL',
    ];
    const missing = required.filter((k) => !env[k]);
    if (missing.length) {
      throw new Error(`Missing env vars: ${missing.join(', ')}`);
    }
    return env;
  },
}),
    ThrottlerModule.forRoot([{ ttl: 60_000, limit:60}]),
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
  providers:[{ provide: APP_GUARD, useClass: ThrottlerGuard}, { provide:APP_GUARD, useClass: SupabaseAuthGuard}, {provide: APP_GUARD, useClass: RolesGuard}]
})
export class AppModule {}
