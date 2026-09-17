import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ShipmentStatus } from '@prisma/client';

export class CreateTrackingEventDto {
  @IsEnum(ShipmentStatus)
  status!: ShipmentStatus;

  @IsString()
  location!: string;

  @IsOptional()
  @IsString()
  description?: string;
}