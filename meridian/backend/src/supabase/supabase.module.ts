import { Global, Module } from '@nestjs/common';
import { SupabaseService } from './supabase.services';

@Global()
@Module({
  providers: [SupabaseService],
  exports: [SupabaseService],
})
export class SupabaseModule {}