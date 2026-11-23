import { ShipmentStatus } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateTrackingEventDto {
  /** Label shown on the timeline, e.g. "Departed origin port". */
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title!: string;

  /** Optional: when set, the shipment is also moved to this status. */
  @IsOptional()
  @IsEnum(ShipmentStatus)
  status?: ShipmentStatus;

  /** Defaults to the previous event's location when omitted. */
  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
