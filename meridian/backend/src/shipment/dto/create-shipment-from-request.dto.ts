import { IsDateString, IsOptional, IsUUID } from 'class-validator';

export class CreateShipmentFromRequestDto {
  @IsUUID()
  requestId!: string;

  @IsOptional()
  @IsDateString()
  estimatedDelivery?: string;
}
