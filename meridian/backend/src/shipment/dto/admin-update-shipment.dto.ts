import { IsDateString, IsOptional, IsString } from 'class-validator';
import { UpdateShipmentDto } from './update-shipment.dto';

// Status is deliberately not editable here: it changes only through tracking events,
// so the status and the tracking history can never disagree.
export class AdminUpdateShipmentDto extends UpdateShipmentDto {
  @IsOptional()
  @IsDateString()
  estimatedDelivery?: string;

  @IsOptional()
  @IsDateString()
  actualDelivery?: string;

  @IsOptional()
  @IsString()
  carrier?: string;

  @IsOptional()
  @IsString()
  containerNumber?: string;

  @IsOptional()
  @IsString()
  billOfLading?: string;

  @IsOptional()
  @IsString()
  airWaybill?: string;
}
