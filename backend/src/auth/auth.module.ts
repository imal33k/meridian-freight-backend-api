import { Module } from '@nestjs/common';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SupabaseAuthGuard } from './guards/supabase-auth.guard';
import { RolesGuard } from './guards/roles.guards.decorators';


@Module({
  imports: [UsersModule],
  controllers: [AuthController],
  providers: [AuthService,SupabaseAuthGuard, RolesGuard],
  exports: [SupabaseAuthGuard],
})
export class AuthModule {}