import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { SupabaseModule } from './supabase/supabase.module';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './database/prisma.module';
import { ShipmentModule } from './shipment/shipment.module';


@Module({
  imports: [
    AuthModule,
    UsersModule,
    SupabaseModule,
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    PrismaModule,
    ShipmentModule,
  ],
})
export class AppModule {}